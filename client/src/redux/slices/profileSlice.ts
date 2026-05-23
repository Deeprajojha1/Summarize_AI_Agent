import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types/auth.types';
import type { Task } from '../../types/task.types';

type ProfileOverview = {
  productivityScore: number;
  completedTasks: number;
  urgentTasks: number;
  developerIdentity: string;
  locationContext: string;
  workspaceRole: string;
  secureSessionLabel: string;
};

type ProfileState = {
  overview: ProfileOverview;
};

const initialState: ProfileState = {
  overview: {
    productivityScore: 0,
    completedTasks: 0,
    urgentTasks: 0,
    developerIdentity: 'Not linked',
    locationContext: 'Not set',
    workspaceRole: 'user',
    secureSessionLabel: 'Secure workspace session',
  },
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    syncProfileOverview: (state, action: PayloadAction<{ user: User | null; tasks: Task[] }>) => {
      const { user, tasks } = action.payload;
      const completedTasks = tasks.filter((task) => task.status === 'done').length;
      const urgentTasks = tasks.filter((task) => task.priority === 'urgent').length;

      state.overview = {
        productivityScore: tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0,
        completedTasks,
        urgentTasks,
        developerIdentity: user?.githubUsername || 'Not linked',
        locationContext: user?.currentAddress || 'Not set',
        workspaceRole: user?.role || 'user',
        secureSessionLabel: 'Secure workspace session',
      };
    },
  },
});

export const { syncProfileOverview } = profileSlice.actions;
export default profileSlice.reducer;
