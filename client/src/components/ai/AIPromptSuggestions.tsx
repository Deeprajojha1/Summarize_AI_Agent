export default function AIPromptSuggestions({ prompts, onPick }: { prompts: string[]; onPick: (prompt: string) => void }) {
  return <div className="prompt-row">{prompts.map((prompt) => <button key={prompt} onClick={() => onPick(prompt)}>{prompt}</button>)}</div>;
}
