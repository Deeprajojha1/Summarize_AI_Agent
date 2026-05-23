import type { ChatMessage } from '../../types/ai.types';

export default function AIMessage({ message }: { message: ChatMessage }) {
  return (
    <div className={`ai-message ${message.role}`}>
      <p>{message.content}</p>
      {message.tools?.length ? <small>Tools: {message.tools.join(', ')}</small> : null}
    </div>
  );
}
