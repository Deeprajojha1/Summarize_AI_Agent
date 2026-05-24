import axios from 'axios';

const github = axios.create({
  baseURL: 'https://api.github.com',
});

const publicGithub = axios.create({
  baseURL: 'https://api.github.com',
});

const fetchGithubData = async (username: string) => {
  const headers = process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : undefined;

  try {
    return await Promise.all([
      github.get(`/users/${username}`, { headers }),
      github.get(`/users/${username}/repos`, { headers, params: { sort: 'updated', per_page: 8 } }),
    ]);
  } catch {
    return Promise.all([
      publicGithub.get(`/users/${username}`),
      publicGithub.get(`/users/${username}/repos`, { params: { sort: 'updated', per_page: 8 } }),
    ]);
  }
};

export const getGithubProfile = async (username: string) => {
  let response;
  try {
    response = await fetchGithubData(username);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`GitHub lookup failed for "${username}" (${error.response?.status || 'network error'})`);
    }
    throw error;
  }

  const [{ data: user }, { data: repos }] = response;
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
    activity: [],
    source: 'live',
  };
};
