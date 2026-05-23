import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="not-found">
      <h1>404</h1>
      <p>This workflow does not exist.</p>
      <Link className="primary-btn" to="/dashboard">Back to dashboard</Link>
    </main>
  );
}
