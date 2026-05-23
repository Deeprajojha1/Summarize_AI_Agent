import { asyncHandler } from '../middleware/asyncHandler.js';
import { getGithubProfile } from '../services/githubService.js';

export const githubProfile = asyncHandler(async (req, res) => {
  res.json({ profile: await getGithubProfile(String(req.params.username)) });
});
