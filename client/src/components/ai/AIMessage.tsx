import { FiFileText } from 'react-icons/fi';
import type { ChatMessage } from '../../types/ai.types';

const renderInlineText = (text: string) => {
  const cleanedText = text.replace(/^\*([^*]+)\*$/g, '$1');
  const parts = cleanedText.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
};

const renderContent = (content: string) => {
  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !/^[-*]?\s*\*?sources?\s+\d/i.test(line));

  return lines.map((line, index) => {
    const numbered = line.match(/^(\d+)\.\s+(.*)$/);
    const bullet = line.match(/^[-*]\s+(.*)$/);

    if (numbered) {
      return (
        <div className="ai-list-row numbered" key={`${line}-${index}`}>
          <span>{numbered[1]}</span>
          <p>{renderInlineText(numbered[2])}</p>
        </div>
      );
    }

    if (bullet) {
      return (
        <div className="ai-list-row" key={`${line}-${index}`}>
          <span />
          <p>{renderInlineText(bullet[1])}</p>
        </div>
      );
    }

    return <p key={`${line}-${index}`}>{renderInlineText(line)}</p>;
  });
};

export default function AIMessage({ message }: { message: ChatMessage }) {
  const attachedDocument = message.content.match(/^Attached document:\s*(.+)$/);

  return (
    <div className={`ai-message ${message.role}`}>
      {attachedDocument ? (
        <div className="ai-upload-card">
          <FiFileText />
          <span>{attachedDocument[1]}</span>
        </div>
      ) : (
        <div className="ai-message-body">{renderContent(message.content)}</div>
      )}
      {message.tools?.length ? <small>Tools: {message.tools.join(', ')}</small> : null}
    </div>
  );
}
