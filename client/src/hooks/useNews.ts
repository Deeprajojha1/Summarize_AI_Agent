import { useAppSelector } from './useAuth';

export const useNews = () => useAppSelector((state) => state.news);
