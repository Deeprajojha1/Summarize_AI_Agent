export type Repository = {
  id: number;
  name: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  updatedAt: string;
};

export type GithubProfile = {
  username: string;
  avatar: string;
  followers: number;
  publicRepos: number;
  totalStars: number;
  repositories: Repository[];
  activity: { day: string; commits: number }[];
  error?: string;
  source?: 'live';
};
