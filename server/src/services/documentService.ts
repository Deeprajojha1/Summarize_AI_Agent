import { GoogleGenerativeAI, TaskType } from '@google/generative-ai';
import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';
import Document from '../models/Document.js';
import DocumentChunk from '../models/DocumentChunk.js';
import { generateGeminiText } from '../config/gemini.js';
import { logger } from '../utils/logger.js';

type UploadedDocument = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
};

type DocumentAnswerMode = 'auto' | 'rag_search' | 'document_generation';

const CHUNK_SIZE = 1400;
const CHUNK_OVERLAP = 220;
const TOP_K = 6;
const MIN_RAG_SCORE = 0.35;

const normalizeText = (text: string) => text.replace(/\s+/g, ' ').trim();

const splitIntoChunks = (text: string) => {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);
    const chunk = text.slice(start, end).trim();
    if (chunk.length > 80) chunks.push(chunk);
    if (end === text.length) break;
    start = Math.max(0, end - CHUNK_OVERLAP);
  }

  return chunks;
};

const extractText = async (file: UploadedDocument) => {
  if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
    const parser = new PDFParse({ data: file.buffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.text;
  }

  if (
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    || file.originalname.toLowerCase().endsWith('.docx')
  ) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }

  if (file.mimetype.startsWith('text/') || /\.(txt|md)$/i.test(file.originalname)) {
    return file.buffer.toString('utf8');
  }

  throw new Error('Unsupported document type. Upload PDF, DOCX, TXT, or Markdown.');
};

const getEmbeddingModel = (modelName: string) => {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is missing');
  return new GoogleGenerativeAI(key).getGenerativeModel({ model: modelName });
};

const embedText = async (text: string, taskType: TaskType, title?: string) => {
  const modelNames = [process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001'];
  let lastError: unknown;

  for (const modelName of [...new Set(modelNames)]) {
    try {
      const model = getEmbeddingModel(modelName);
      const response = await model.embedContent({
        content: { role: 'user', parts: [{ text }] },
        taskType,
        title,
      });
      return response.embedding.values;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Embedding generation failed');
};

const cosineSimilarity = (left: number[], right: number[]) => {
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (let index = 0; index < Math.min(left.length, right.length); index += 1) {
    dot += left[index] * right[index];
    leftMagnitude += left[index] ** 2;
    rightMagnitude += right[index] ** 2;
  }

  if (!leftMagnitude || !rightMagnitude) return 0;
  return dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
};

const isGenerationRequest = (question: string) => /prepare|generate|create|make|draft|write|suggest|practice|mock|question|questions|interview/i.test(question);
const isOnlyNotFoundAnswer = (answer: string) => {
  const normalized = answer.toLowerCase();
  return normalized.length < 220 && /document|context|uploaded/.test(normalized) && /does not contain|not contain|not found|no information|not available/.test(normalized);
};

const answerWithGeneralGemini = async (question: string) => {
  const prompt = `Answer this question from general knowledge.

Question:
${question}

Instructions:
- Do not mention uploaded documents.
- Give the actual answer directly.
- If it is technical, include a small example.
- Keep it concise and beginner-friendly.`;

  return generateGeminiText(prompt);
};

const pickSentences = (text: string, limit: number) => text
  .split(/(?<=[.!?])\s+|\n+/)
  .map((item) => item.trim())
  .filter((item) => item.length > 35)
  .slice(0, limit);

const buildLocalDocumentAnswer = (
  question: string,
  chunks: Array<{ filename: string; chunkIndex: number; content: string; score: number }>,
  mode: DocumentAnswerMode,
) => {
  const bestScore = chunks[0]?.score || 0;
  const sources = [...new Set(chunks.map((chunk) => chunk.filename))].join(', ') || 'uploaded documents';
  const combined = chunks.map((chunk) => chunk.content).join(' ');
  const sentences = pickSentences(combined, 10);

  if (mode === 'rag_search' && bestScore < MIN_RAG_SCORE) {
    return 'I checked your uploaded document, but this answer was not found there. Gemini is temporarily unavailable, so I could not generate the general answer right now. Please try again in a moment.';
  }

  if (mode === 'document_generation') {
    const topic = /mern/i.test(question) ? 'MERN stack internship interview' : 'this uploaded document';
    const generatedQuestions = [
      `Explain the main projects or topics mentioned in ${sources}.`,
      `Which technical skills from the document are most relevant for a ${topic}?`,
      'Describe one project from the document and the problem it solves.',
      'Which backend concepts are visible in the document, and how would you explain them?',
      'Which frontend concepts are visible in the document, and how would you explain them?',
      'How would you improve one project or feature mentioned in the document?',
      'What database or data handling concepts can be discussed from this document?',
      'What challenges might come from the work described in the document?',
      'How would you explain your role or contribution based on this document?',
      'What follow-up questions can an interviewer ask from the strongest section of this document?',
    ];

    return [
      `Gemini is temporarily busy, so I prepared a document-based fallback from ${sources}.`,
      '',
      ...generatedQuestions.map((item, index) => `${index + 1}. ${item}`),
      sentences.length ? `\nUseful context I found:\n${sentences.slice(0, 3).map((item) => `- ${item}`).join('\n')}` : '',
    ].filter(Boolean).join('\n');
  }

  if (!sentences.length) {
    return `I found uploaded document chunks from ${sources}, but could not extract a clean answer locally. Please try again in a moment.`;
  }

  return [
    `Gemini is temporarily busy, so here is the closest document context from ${sources}:`,
    '',
    ...sentences.slice(0, 6).map((item) => `- ${item}`),
  ].join('\n');
};

const getRecentDocumentContext = async (userId: string, limit = 8) => {
  const documents = await Document.find({ user: userId, status: 'ready' }).sort({ createdAt: -1 }).limit(3).lean();
  if (!documents.length) return { documents, chunks: [] as Array<{ filename: string; chunkIndex: number; content: string; score: number }> };

  const chunks = await DocumentChunk.find({ user: userId, document: { $in: documents.map((document) => document._id) } })
    .sort({ createdAt: -1, chunkIndex: 1 })
    .limit(limit)
    .select('content filename chunkIndex')
    .lean();

  return {
    documents,
    chunks: chunks.map((chunk) => ({ filename: chunk.filename, chunkIndex: chunk.chunkIndex, content: chunk.content, score: 1 })),
  };
};

export const ingestDocument = async (file: UploadedDocument, userId: string) => {
  const document = await Document.create({
    user: userId,
    filename: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    status: 'processing',
  });

  try {
    const text = normalizeText(await extractText(file));
    if (!text) throw new Error('No readable text found in this document');

    const chunks = splitIntoChunks(text);
    if (!chunks.length) throw new Error('Document text is too short to index');

    const chunkDocs = [];
    for (let index = 0; index < chunks.length; index += 1) {
      const chunk = chunks[index];
      const embedding = await embedText(chunk, TaskType.RETRIEVAL_DOCUMENT, file.originalname);
      chunkDocs.push({
        user: userId,
        document: document.id,
        filename: file.originalname,
        content: chunk,
        embedding,
        chunkIndex: index,
        metadata: { source: file.originalname },
      });
    }

    await DocumentChunk.insertMany(chunkDocs);
    const summary = text.slice(0, 1200);
    await Document.findByIdAndUpdate(document.id, { status: 'ready', chunkCount: chunks.length, summary });

    return {
      id: document.id,
      filename: file.originalname,
      chunkCount: chunks.length,
    };
  } catch (error) {
    await Document.findByIdAndUpdate(document.id, { status: 'failed' });
    logger.error('Document ingestion failed', error);
    throw error;
  }
};

export const searchDocumentChunks = async (question: string, userId: string, limit = TOP_K) => {
  const queryEmbedding = await embedText(question, TaskType.RETRIEVAL_QUERY);
  const chunks = await DocumentChunk.find({ user: userId }).select('content embedding filename chunkIndex document').lean();

  return chunks
    .map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding as number[]),
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
};

export const hasReadyDocuments = async (userId: string) => Document.exists({ user: userId, status: 'ready' });

export const answerFromDocuments = async (question: string, userId: string, mode: DocumentAnswerMode = 'auto') => {
  const documents = await Document.find({ user: userId, status: 'ready' }).sort({ createdAt: -1 }).limit(5).lean();
  if (!documents.length) {
    return {
      answer: 'No uploaded documents are ready yet. Upload a document first, then ask a document-based question.',
      sources: [],
      mode: 'rag_search',
    };
  }

  const selectedMode = mode === 'auto' ? (isGenerationRequest(question) ? 'document_generation' : 'rag_search') : mode;
  const chunks = selectedMode === 'document_generation'
    ? (await getRecentDocumentContext(userId, 10)).chunks
    : await searchDocumentChunks(question, userId, TOP_K);
  const context = chunks.map((chunk, index) => `[Source ${index + 1}: ${chunk.filename}, chunk ${chunk.chunkIndex}]\n${chunk.content}`).join('\n\n');
  const bestScore = chunks[0]?.score || 0;
  const shouldUseGeneralGemini = selectedMode === 'rag_search' && (!chunks.length || bestScore < MIN_RAG_SCORE);
  const instruction = shouldUseGeneralGemini
    ? 'The uploaded documents did not contain strong matching context. First say this was not found in the uploaded document, then answer from your general knowledge.'
    : selectedMode === 'document_generation'
    ? 'Use the document context as source material and generate the requested output. For example, create interview questions, practice questions, summaries, or drafts based on the document.'
    : 'Answer only from the document context. If the answer is not present, say that the uploaded document does not contain enough information.';

  const prompt = `You are a document-aware RAG assistant.

Mode: ${selectedMode}
User question:
${question}

Document context:
${shouldUseGeneralGemini ? 'No strong matching document context was found.' : context || 'No matching chunks found.'}

Instructions:
- ${instruction}
- If using general knowledge, do not include document chunks or sources.
- If the uploaded document does not contain the answer, you must still answer the user's question from general knowledge in the same response.
- Keep the answer clear and useful.
- For interview/practice question generation, return only the questions. Do not include source lists after each question.
- Mention source filenames only when the user asks for evidence or exact document lookup.
- Do not invent facts outside the context unless the user explicitly asks you to generate practice/interview questions from the document or no strong document context was found.`;

  try {
    const answer = await generateGeminiText(prompt);
    const finalAnswer = selectedMode === 'rag_search' && isOnlyNotFoundAnswer(answer)
      ? `This was not found in the uploaded document.\n\n${await answerWithGeneralGemini(question)}`
      : answer;

    return {
      answer: finalAnswer,
      sources: chunks.map((chunk) => ({ filename: chunk.filename, chunkIndex: chunk.chunkIndex, score: Number(chunk.score.toFixed(4)) })),
      mode: selectedMode,
    };
  } catch (error) {
    logger.error('Document answer generation failed; using local fallback', error);
    return {
      answer: buildLocalDocumentAnswer(question, chunks, shouldUseGeneralGemini ? 'rag_search' : selectedMode),
      sources: chunks.map((chunk) => ({ filename: chunk.filename, chunkIndex: chunk.chunkIndex, score: Number(chunk.score.toFixed(4)) })),
      mode: selectedMode,
    };
  }
};
