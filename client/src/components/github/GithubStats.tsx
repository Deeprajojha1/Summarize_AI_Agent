import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { FiGithub, FiStar, FiUsers } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../hooks/useAuth';
import { fetchGithub } from '../../redux/thunks/githubThunk';
import RepoCard from './RepoCard';

export default function GithubStats() {
  const [username, setUsername] = useState('octocat');
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.github);
  useEffect(() => { void dispatch(fetchGithub('octocat')); }, [dispatch]);
  const submit = (event: FormEvent) => { event.preventDefault(); void dispatch(fetchGithub(username)); };

  return (
    <section className="glass-card">
      <div className="card-title"><FiGithub /> Developer Activity</div>
      <form className="inline-form" onSubmit={submit}>
        <input value={username} onChange={(event) => setUsername(event.target.value)} />
      </form>
      {profile && (
        <>
          <div className="stat-grid compact">
            <span><FiUsers /> {profile.followers} followers</span>
            <span><FiGithub /> {profile.publicRepos} repos</span>
            <span><FiStar /> {profile.totalStars} stars</span>
          </div>
          <div className="repo-list">{profile.repositories.slice(0, 3).map((repo) => <RepoCard key={repo.id} repo={repo} />)}</div>
        </>
      )}
    </section>
  );
}
