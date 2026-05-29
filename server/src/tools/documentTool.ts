import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { answerFromDocuments } from '../services/documentService.js';

export const createDocumentTool = (userId: string) => new DynamicStructuredTool({
  name: 'document_tool',
  description: 'Search uploaded documents with RAG or generate interview/practice questions, summaries, and insights from uploaded documents.',
  schema: z.object({
    question: z.string(),
    mode: z.enum(['auto', 'rag_search', 'document_generation']).default('auto'),
  }),
  func: async ({ question, mode }) => JSON.stringify(await answerFromDocuments(question, userId, mode)),
});
