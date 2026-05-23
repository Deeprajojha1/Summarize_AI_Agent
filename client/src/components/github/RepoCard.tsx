import { FiGitBranch, FiStar } from 'react-icons/fi';
import type { Repository } from '../../types/github.types';

export default function RepoCard({ repo }: { repo: Repository }) {
  return (
    <a className="repo-card" href={repo.url} target="_blank">
      <strong>{repo.name}</strong>
      <span>{repo.language || 'Code'} · <FiStar /> {repo.stars} · <FiGitBranch /> {repo.forks}</span>
    </a>
  );
}
