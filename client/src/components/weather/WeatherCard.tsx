import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { FiCloud, FiDroplet, FiMapPin, FiSearch, FiWind } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../hooks/useAuth';
import { fetchWeather } from '../../redux/thunks/weatherThunk';
import Skeleton from '../common/Skeleton';
import ClipLoader from '../common/ClipLoader';

export default function WeatherCard() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { data, loading } = useAppSelector((state) => state.weather);
  const profileCity = user?.currentAddress || 'Bengaluru';
  const [city, setCity] = useState('');

  useEffect(() => {
    if (!data) void dispatch(fetchWeather(profileCity));
  }, [data, dispatch, profileCity]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void dispatch(fetchWeather(city.trim() || profileCity));
  };

  return (
    <section className="glass-card weather-card">
      <div className="card-title"><FiCloud /> Live Weather</div>
      <form onSubmit={submit} className="inline-form">
        <FiMapPin />
        <input value={city || profileCity} onChange={(event) => setCity(event.target.value)} placeholder="Search city" />
        <button className="icon-btn compact-btn" type="submit" aria-label="Search weather" disabled={loading}>
          {loading ? <ClipLoader /> : <FiSearch />}
        </button>
      </form>
      {loading ? <Skeleton /> : data && (
        <div className="weather-body">
          <strong>{Math.round(data.temperature)} C</strong>
          <span>{data.city} - {data.condition}</span>
          <div className="metric-row">
            <span><FiDroplet /> {data.humidity}%</span>
            <span><FiWind /> {data.windSpeed} km/h</span>
          </div>
        </div>
      )}
    </section>
  );
}
