import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle, FiCloud, FiCpu, FiGithub, FiShield, FiZap } from 'react-icons/fi';

export default function Home() {
  return (
    <main className="home-page">
      <section className="hero-section">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="eyebrow"><FiCpu /> AI Productivity Command Center</span>
          <h1>NexFlow AI</h1>
          <p>Run tasks, weather context, GitHub activity, news signals, and AI answers from one focused developer workspace.</p>
          <div className="hero-actions">
            <Link className="primary-btn" to="/signup">Start free <FiArrowRight /></Link>
            <Link className="ghost-btn" to="/login">Login</Link>
          </div>
          <div className="hero-stats" aria-label="NexFlow highlights">
            <span><FiCheckCircle /> Real API data</span>
            <span><FiShield /> Secure sessions</span>
            <span><FiZap /> AI workflow tools</span>
          </div>
        </motion.div>
        <div className="hero-preview">
          <div className="preview-top">
            <span /> <span /> <span />
            <strong>NexFlow dashboard</strong>
          </div>
          <div className="preview-command">
            <FiCpu />
            <div>
              <strong>Ask your workspace</strong>
              <p>Weather, GitHub, tasks, and news answered with live tools.</p>
            </div>
          </div>
          <div className="preview-grid">
            <article>
              <FiCloud />
              <div><strong>Live weather</strong><span>City-aware context</span></div>
            </article>
            <article>
              <FiGithub />
              <div><strong>GitHub activity</strong><span>Repos and stars</span></div>
            </article>
            <article>
              <FiZap />
              <div><strong>AI signals</strong><span>News summaries</span></div>
            </article>
            <article>
              <FiShield />
              <div><strong>Private access</strong><span>Cookie auth</span></div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
