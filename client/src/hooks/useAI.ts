import { useAppSelector } from './useAuth';

export const useAI = () => useAppSelector((state) => state.ai);
