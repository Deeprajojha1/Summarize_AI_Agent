import { useAppSelector } from './useAuth';

export const useWeather = () => useAppSelector((state) => state.weather);
