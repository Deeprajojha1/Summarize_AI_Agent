import { FiCpu } from 'react-icons/fi';
import ClipLoader from './ClipLoader';

export default function Loader({ label = 'Loading' }: { label?: string }) {
  return <div className="loader"><FiCpu className="spin" /> {label} <ClipLoader /></div>;
}
