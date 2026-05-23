import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { FiCloud, FiDroplet, FiMapPin, FiWind } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../hooks/useAuth';
import { fetchWeather } from '../../redux/thunks/weatherThunk';
import Skeleton from '../common/Skeleton';

export default function WeatherCard() {
  const [city, setCity] = useState('Bengaluru');
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((state) => state.weather);

  useEffect(() => { void dispatch(fetchWeather('Bengaluru')); }, [dispatch]);
  const submit = (event: FormEvent) => { event.preventDefault(); void dispatch(fetchWeather(city)); };

  return (
    <section className="glass-card weather-card">
      <div className="card-title"><FiCloud /> Live Weather</div>
      <form onSubmit={submit} className="inline-form">
        <FiMapPin />
        <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Search city" />
      </form>
      {loading ? <Skeleton /> : data && (
        <div className="weather-body">
          <strong>{Math.round(data.temperature)}°C</strong>
          <span>{data.city} · {data.condition}</span>
          <div className="metric-row">
            <span><FiDroplet /> {data.humidity}%</span>
            <span><FiWind /> {data.windSpeed} km/h</span>
          </div>
        </div>
      )}
    </section>
  );
}
