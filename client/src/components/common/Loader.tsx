import { FiCpu } from 'react-icons/fi';

export default function Loader({ label = 'Loading' }: { label?: string }) {
  return <div className="loader"><FiCpu className="spin" /> {label}</div>;
}
