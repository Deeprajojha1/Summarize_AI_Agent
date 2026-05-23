import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <main className="auth-shell">
      <section className="auth-brand">
        <span className="eyebrow">NexFlow AI</span>
        <h1>Your intelligent productivity command center.</h1>
        <p>Secure, fast, and built for developers who live across tools, tasks, APIs, and decisions.</p>
      </section>
      <Outlet />
    </main>
  );
}
