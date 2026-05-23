import { useState } from 'react';
import type { FormEvent } from 'react';
import { FiCpu, FiMessageCircle, FiMinus, FiSend, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/useAuth';
import { resetChat } from '../../redux/slices/aiSlice';
import { sendAIMessage } from '../../redux/thunks/aiThunk';
import AIMessage from './AIMessage';
import AIPromptSuggestions from './AIPromptSuggestions';
import TypingAnimation from './TypingAnimation';
import ClipLoader from '../common/ClipLoader';

export default function AIChatPanel() {
  const [message, setMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(true);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const dispatch = useAppDispatch();
  const { messages, suggestions, loading } = useAppSelector((state) => state.ai);
  const send = (text = message) => {
    if (!text.trim()) return;
    setShowQuickQuestions(false);
    void dispatch(sendAIMessage(text));
    setMessage('');
  };
  const submit = (event: FormEvent) => { event.preventDefault(); send(); };

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
            {loading && <TypingAnimation />}
          </div>
          {showQuickQuestions && (
            <section className="quick-questions">
              <p>Quick questions:</p>
              <AIPromptSuggestions prompts={suggestions} onPick={send} />
            </section>
          )}
          <form className="ai-input" onSubmit={submit}>
            <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask a question..." />
            <button className={message.trim() || loading ? 'active' : ''} type="submit" aria-label="Send" disabled={loading}>
              {loading ? <ClipLoader /> : <FiSend />}
            </button>
          </form>
        </>
      )}
    </motion.aside>
  );
}
