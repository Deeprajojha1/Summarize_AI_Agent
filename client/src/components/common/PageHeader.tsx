import { FiBell, FiCommand, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function PageHeader() {
  return (
    <motion.header className="page-header" initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      <div>
        <span className="eyebrow">AI Operating System</span>
        <h2>Good evening, operator.</h2>
      </div>
      <div className="command-bar"><FiSearch /> Ask, search, or run a workflow <kbd><FiCommand /> K</kbd></div>
      <button className="icon-btn" aria-label="Notifications"><FiBell /></button>
    </motion.header>
  );
}
