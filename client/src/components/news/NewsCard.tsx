import { FiExternalLink, FiRadio } from 'react-icons/fi';
import type { NewsArticle } from '../../types/news.types';

export default function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <a className="news-card" href={article.url} target="_blank">
      <span><FiRadio /> {article.source}</span>
      <h4>{article.title}</h4>
      <p>{article.summary || article.description}</p>
      <small>{article.category} <FiExternalLink /></small>
    </a>
  );
}
