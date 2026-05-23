import { useState } from 'react';
import type { FormEvent } from 'react';
import { FiMic, FiSend, FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/useAuth';
import { sendAIMessage } from '../../redux/thunks/aiThunk';
import AIMessage from './AIMessage';
import AIPromptSuggestions from './AIPromptSuggestions';
import TypingAnimation from './TypingAnimation';

export default function AIChatPanel() {
  const [message, setMessage] = useState('');
  const dispatch = useAppDispatch();
  const { messages, suggestions, loading } = useAppSelector((state) => state.ai);
  const send = (text = message) => {
    if (!text.trim()) return;
    void dispatch(sendAIMessage(text));
    setMessage('');
  };
  const submit = (event: FormEvent) => { event.preventDefault(); send(); };

  return (
    <motion.aside className="ai-panel" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
      <div className="card-title"><FiZap /> NexFlow Copilot</div>
      <div className="ai-thread">
        {messages.map((item) => <AIMessage key={item.id} message={item} />)}
        {loading && <TypingAnimation />}
      </div>
      <AIPromptSuggestions prompts={suggestions} onPick={send} />
      <form className="ai-input" onSubmit={submit}>
        <button type="button" className="icon-btn" aria-label="Voice input"><FiMic /></button>
        <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask NexFlow AI..." />
        <button type="submit" className="icon-btn" aria-label="Send"><FiSend /></button>
      </form>
    </motion.aside>
  );
}
