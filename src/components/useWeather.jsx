import { useState, useEffect } from "react";
import { fetchWeatherByCity, fetchWeatherByCoords } from "../services/weatherService";


export default function useWeather(defaultCity = "Delhi") {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherData = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const { weather, forecast } = await fetchWeatherByCity(city);
      setWeatherData(weather);
      setForecastData(forecast);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          try {
            setLoading(true);
            setError(null);
            const { weather, forecast } = await fetchWeatherByCoords(
              coords.latitude,
              coords.longitude
            );
            setWeatherData(weather);
            setForecastData(forecast);
          } catch {
            setError("Failed to fetch location weather");
            fetchWeatherData(defaultCity);
          } finally {
            setLoading(false);
          }
        },
        () => fetchWeatherData(defaultCity)
      );
    } else {
      fetchWeatherData(defaultCity);
    }
  };

  useEffect(() => {
    fetchLocationWeather();
  }, []);

  return {
    weatherData,
    forecastData,
    loading,
    error,
    fetchWeatherData,
  };
}
