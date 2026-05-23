import { configureStore } from '@reduxjs/toolkit';
import aiReducer from '../redux/slices/aiSlice';
import authReducer from '../redux/slices/authSlice';
import githubReducer from '../redux/slices/githubSlice';
import newsReducer from '../redux/slices/newsSlice';
import profileReducer from '../redux/slices/profileSlice';
import taskReducer from '../redux/slices/taskSlice';
import uiReducer from '../redux/slices/uiSlice';
import weatherReducer from '../redux/slices/weatherSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    weather: weatherReducer,
    news: newsReducer,
    profile: profileReducer,
    github: githubReducer,
    tasks: taskReducer,
    ai: aiReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
