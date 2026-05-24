import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { FiGithub, FiSearch, FiStar, FiUsers } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../hooks/useAuth';
import { fetchGithub } from '../../redux/thunks/githubThunk';
import RepoCard from './RepoCard';
import ClipLoader from '../common/ClipLoader';
import Skeleton from '../common/Skeleton';

export default function GithubStats() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { profile, loading, error } = useAppSelector((state) => state.github);
  const profileUsername = user?.githubUsername || 'octocat';
  const [username, setUsername] = useState(profileUsername);

  useEffect(() => {
    setUsername(profileUsername);
    void dispatch(fetchGithub(profileUsername));
  }, [dispatch, profileUsername]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void dispatch(fetchGithub(username.trim() || profileUsername));
  };

  return (
    <section className="glass-card github-card">
      <div className="github-header">
        <div className="card-title"><FiGithub /> Developer Activity</div>
        <form className="inline-form github-search" onSubmit={submit}>
          <input value={username} onChange={(event) => setUsername(event.target.value)} />
          <button className="icon-btn compact-btn" type="submit" aria-label="Search GitHub" disabled={loading}>
            {loading ? <ClipLoader /> : <FiSearch />}
          </button>
        </form>
      </div>
      {loading && !profile && <Skeleton lines={4} />}
      {!loading && error && <p className="empty-state github-empty">{error}. Check username in profile and try again.</p>}
      {!loading && profile && (
        <>
          <div className="stat-grid compact">
            <span><FiUsers /> {profile.followers} followers</span>
            <span><FiGithub /> {profile.publicRepos} repos</span>
            <span><FiStar /> {profile.totalStars} stars</span>
          </div>
          <div className="repo-list">
            {profile.repositories.length
              ? profile.repositories.slice(0, 3).map((repo) => <RepoCard key={repo.id} repo={repo} />)
              : <p className="empty-state github-empty">No public repositories found for {profile.username}.</p>}
          </div>
        </>
      )}
    </section>
  );
}
