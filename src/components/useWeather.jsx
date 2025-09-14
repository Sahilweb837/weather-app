 import { useState, useEffect } from "react";
import { fetchWeatherByCity, fetchWeatherByCoords } from "../services/weatherService";

export default function useWeather(defaultCity = "Delhi") {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("metric");  

  const fetchWeatherData = async (city, selectedUnit = unit) => {
    setLoading(true);
    setError(null);
    try {
      const { weather, forecast } = await fetchWeatherByCity(city, selectedUnit);
      setWeatherData(weather);
      setForecastData(forecast);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationWeather = (selectedUnit = unit) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          try {
            setLoading(true);
            setError(null);
            const { weather, forecast } = await fetchWeatherByCoords(
              coords.latitude,
              coords.longitude,
              selectedUnit
            );
            setWeatherData(weather);
            setForecastData(forecast);
          } catch {
            setError("Failed to fetch location weather");
            fetchWeatherData(defaultCity, selectedUnit);
          } finally {
            setLoading(false);
          }
        },
        () => fetchWeatherData(defaultCity, selectedUnit)
      );
    } else {
      fetchWeatherData(defaultCity, selectedUnit);
    }
  };

  useEffect(() => {
    fetchLocationWeather(unit);

     const interval = setInterval(() => {
      if (weatherData?.name) {
        fetchWeatherData(weatherData.name, unit);
      } else {
        fetchLocationWeather(unit);
      }
    }, 300000); 

    return () => clearInterval(interval);
  }, [unit]);  

  return {
    weatherData,
    forecastData,
    loading,
    error,
    unit,
    setUnit,  
    fetchWeatherData,
    fetchLocationWeather,
  };
}
