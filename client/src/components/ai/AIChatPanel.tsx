import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { FiCpu, FiFileText, FiMessageCircle, FiMinus, FiPaperclip, FiSend, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/useAuth';
import { resetChat } from '../../redux/slices/aiSlice';
import { sendAIMessage, uploadAIDocument } from '../../redux/thunks/aiThunk';
import AIMessage from './AIMessage';
import AIPromptSuggestions from './AIPromptSuggestions';
import TypingAnimation from './TypingAnimation';
import ClipLoader from '../common/ClipLoader';

const ACCEPTED_DOCUMENT_TYPES = '.pdf,.txt,.md,.doc,.docx,application/pdf,text/plain,text/markdown,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;

export default function AIChatPanel() {
  const [message, setMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(true);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const threadEndRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const { messages, suggestions, loading, uploadLoading } = useAppSelector((state) => state.ai);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, loading, uploadLoading]);

  const send = (text = message) => {
    if (!text.trim()) return;
    setShowQuickQuestions(false);
    void dispatch(sendAIMessage(text));
    setMessage('');
  };

  const pickDocument = (file: File) => {
    setFileError('');
    if (file.size > MAX_DOCUMENT_SIZE) {
      setSelectedFile(null);
      setFileError('Document must be 10MB or smaller.');
      return;
    }
    setSelectedFile(file);
    setShowQuickQuestions(false);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const text = message.trim();

    if (!text && !selectedFile) return;

    if (selectedFile) {
      const file = selectedFile;
      clearSelectedFile();
      setMessage('');
      setShowQuickQuestions(false);
      const uploaded = await dispatch(uploadAIDocument(file));
      if (uploadAIDocument.fulfilled.match(uploaded) && text) {
        void dispatch(sendAIMessage(text));
      }
      return;
    }

    send(text);
  };

  const isBusy = loading || uploadLoading;

  if (isClosed || isMinimized) {
    return (
      <button
        className="ai-launcher"
        type="button"
        onClick={() => {
          setIsClosed(false);
          setIsMinimized(false);
        }}
        aria-label="Open NexFlow Bot"
      >
        <FiMessageCircle />
      </button>
    );
  }

  return (
    <motion.aside className="ai-panel" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
      <header className="ai-panel-header">
        <div className="ai-bot-avatar"><FiCpu /></div>
        <div>
          <h3>NexFlow Bot</h3>
          <p>Ask me anything</p>
        </div>
        <div className="ai-window-actions">
          <button type="button" aria-label="Minimize chat" onClick={() => setIsMinimized((value) => !value)}><FiMinus /></button>
          <button
            type="button"
            aria-label="Close chat"
            onClick={() => {
              dispatch(resetChat());
              setMessage('');
              clearSelectedFile();
              setShowQuickQuestions(true);
              setIsClosed(true);
            }}
          >
            <FiX />
          </button>
        </div>
      </header>
      {!isMinimized && (
        <>
          <div className="ai-thread">
            <div className="ai-floating-avatar"><FiCpu /></div>
            {messages.map((item) => <AIMessage key={item.id} message={item} />)}
            {isBusy && <TypingAnimation />}
            <div ref={threadEndRef} />
          </div>
          {showQuickQuestions && (
            <section className="quick-questions">
              <p>Quick questions:</p>
              <AIPromptSuggestions prompts={suggestions} onPick={send} />
            </section>
          )}
          <form className="ai-input" onSubmit={submit}>
            {(selectedFile || fileError) && (
              <div className={`ai-file-chip ${fileError ? 'error' : ''}`}>
                <FiFileText />
                <span>{fileError || selectedFile?.name}</span>
                <button type="button" aria-label="Remove selected document" onClick={clearSelectedFile}>
                  <FiX />
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              className="ai-file-input"
              type="file"
              accept={ACCEPTED_DOCUMENT_TYPES}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) pickDocument(file);
              }}
            />
            <button
              className="ai-attach-btn"
              type="button"
              aria-label="Attach document"
              disabled={isBusy}
              onClick={() => fileInputRef.current?.click()}
            >
              <FiPaperclip />
            </button>
            <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder={selectedFile ? 'Ask from this document...' : 'Ask a question...'} />
            <button className={message.trim() || selectedFile || isBusy ? 'active' : ''} type="submit" aria-label="Send" disabled={isBusy}>
              {isBusy ? <ClipLoader /> : <FiSend />}
            </button>
          </form>
        </>
      )}
    </motion.aside>
  );
}
