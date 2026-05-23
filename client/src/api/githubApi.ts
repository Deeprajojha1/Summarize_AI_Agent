import api from './axios';
import type { GithubProfile } from '../types/github.types';

export const githubApi = {
  getProfile: (username: string) => api.get<{ profile: GithubProfile }>('/github/' + username),
};
