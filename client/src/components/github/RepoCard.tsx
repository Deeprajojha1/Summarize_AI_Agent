import { FiClock, FiCode, FiGitBranch, FiStar } from 'react-icons/fi';
import type { Repository } from '../../types/github.types';

export default function RepoCard({ repo }: { repo: Repository }) {
  return (
    <a className="repo-card repo-card-modern" href={repo.url} target="_blank">
      <div className="repo-main">
        <strong>{repo.name}</strong>
        <span className="repo-language"><FiCode /> {repo.language || 'Code'}</span>
      </div>
      <div className="repo-meta">
        <span><FiStar /> {repo.stars}</span>
        <span><FiGitBranch /> {repo.forks}</span>
        <span><FiClock /> {new Date(repo.updatedAt).toLocaleDateString()}</span>
      </div>
    </a>
  );
}
