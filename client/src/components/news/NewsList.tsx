import { useEffect } from 'react';
import { FiZap } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../hooks/useAuth';
import { fetchNews } from '../../redux/thunks/newsThunk';
import Skeleton from '../common/Skeleton';
import NewsCard from './NewsCard';

export default function NewsList() {
  const dispatch = useAppDispatch();
  const { articles, loading } = useAppSelector((state) => state.news);

  useEffect(() => { void dispatch(fetchNews('ai')); }, [dispatch]);

  return (
    <section className="glass-card tall-card">
      <div className="card-title"><FiZap /> AI & Developer Signals</div>
      {loading ? <Skeleton lines={5} /> : (
        <div className="news-list">
          {articles.length ? articles.slice(0, 4).map((article) => <NewsCard key={article.url} article={article} />) : <p className="empty-state">No live news yet. Add a NewsAPI key in server/.env.</p>}
        </div>
      )}
    </section>
  );
}
