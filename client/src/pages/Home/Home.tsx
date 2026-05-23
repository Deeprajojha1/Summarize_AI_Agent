import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCpu, FiGithub, FiShield, FiZap } from 'react-icons/fi';

export default function Home() {
  return (
    <main className="home-page">
      <section className="hero-section">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="eyebrow"><FiCpu /> AI Productivity Command Center</span>
          <h1>NexFlow AI</h1>
          <p>One premium operating surface for tasks, AI news, weather, GitHub activity, and autonomous Gemini-powered recommendations.</p>
          <div className="hero-actions">
            <Link className="primary-btn" to="/signup">Launch dashboard <FiArrowRight /></Link>
            <Link className="ghost-btn" to="/login">Open workspace</Link>
          </div>
        </motion.div>
        <div className="hero-preview">
          <div className="preview-top"><span /> <span /> <span /></div>
          <div className="preview-grid">
            <article><FiZap /> AI summaries</article>
            <article><FiGithub /> Dev analytics</article>
            <article><FiShield /> Cookie auth</article>
          </div>
        </div>
      </section>
    </main>
  );
}
