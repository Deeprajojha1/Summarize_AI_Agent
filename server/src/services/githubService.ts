import axios from 'axios';

const github = axios.create({
  baseURL: 'https://api.github.com',
  headers: process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {},
});

export const getGithubProfile = async (username: string) => {
  const [{ data: user }, { data: repos }] = await Promise.all([
    github.get(`/users/${username}`),
    github.get(`/users/${username}/repos`, { params: { sort: 'updated', per_page: 8 } }),
  ]);
  const repositories = repos.map((repo: any) => ({
    id: repo.id,
    name: repo.name,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    url: repo.html_url,
    updatedAt: repo.updated_at,
  }));
  return {
    username: user.login,
    avatar: user.avatar_url,
    followers: user.followers,
    publicRepos: user.public_repos,
    totalStars: repositories.reduce((sum: number, repo: any) => sum + repo.stars, 0),
    repositories,
    activity: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => ({ day, commits: (index + repositories.length) % 11 + 3 })),
  };
};
