import React, { useState, useEffect } from 'react';
import { WiThunderstorm, WiRain, WiDaySunny, WiCloudy, WiSnow } from "react-icons/wi";
import { FaSearch, FaTemperatureHigh, FaTemperatureLow, FaTint, FaWind, FaCloud, FaMapMarkerAlt } from "react-icons/fa";
import "./WeatherApp.css";

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchCity, setSearchCity] = useState('');

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const API_URL = import.meta.env.VITE_WEATHER_API_URL;

  const getWeatherIcon = (condition) => {
    condition = condition.toLowerCase();
    if (condition.includes("thunderstorm")) return <WiThunderstorm className="main-weather-icon" />;
    if (condition.includes("rain") || condition.includes("drizzle")) return <WiRain className="main-weather-icon" />;
    if (condition.includes("snow")) return <WiSnow className="main-weather-icon" />;
    if (condition.includes("cloud")) return <WiCloudy className="main-weather-icon" />;
    return <WiDaySunny className="main-weather-icon" />;
  };

  const fetchWeatherData = async (city) => {
    if (!API_KEY) {
      setError('API key not found. Please add your OpenWeatherMap API key to the .env file.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const weatherResponse = await fetch(
        `${API_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!weatherResponse.ok) {
        throw new Error('City not found. Please check the city name and try again.');
      }
      const weatherResult = await weatherResponse.json();

      const forecastResponse = await fetch(
        `${API_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastResult = await forecastResponse.json();

      setWeatherData(weatherResult);
      setForecastData(forecastResult);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            setLoading(true);
            setError(null);
            const weatherResponse = await fetch(
              `${API_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            );
            const weatherResult = await weatherResponse.json();
            const forecastResponse = await fetch(
              `${API_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            );
            const forecastResult = await forecastResponse.json();
            setWeatherData(weatherResult);
            setForecastData(forecastResult);
          } catch (err) {
            setError('Failed to fetch weather data for your location');
            fetchWeatherData('Delhi');
          } finally {
            setLoading(false);
          }
        },
        () => {
          fetchWeatherData('Delhi');
        }
      );
    } else {
      fetchWeatherData('Delhi');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeatherData(searchCity.trim());
      setSearchCity('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  useEffect(() => {
    fetchLocationWeather();
  }, []);

  const statIcons = [
    { icon: <FaTemperatureHigh className="stat-icon" />, label: "Temp max", accessor: weather => `${Math.round(weather.main.temp_max)}°`, righticon: <span style={{ color: '#ee5566', marginLeft: '8px' }}><FaTemperatureHigh /></span> },
    { icon: <FaTemperatureLow className="stat-icon" />, label: "Temp min", accessor: weather => `${Math.round(weather.main.temp_min)}°`, righticon: <span style={{ color: '#3992cb', marginLeft: '8px' }}><FaTemperatureLow /></span> },
    { icon: <FaTint className="stat-icon" />, label: "Humidity", accessor: weather => `${weather.main.humidity}%`, righticon: <span style={{ color: '#5fdcf3', marginLeft: '8px' }}><FaTint /></span> },
    { icon: <FaCloud className="stat-icon" />, label: "Cloudy", accessor: weather => `${weather.clouds.all}%`, righticon: <span style={{ color: '#c3bfff', marginLeft: '8px' }}><FaCloud /></span> },
    { icon: <FaWind className="stat-icon" />, label: "Wind", accessor: weather => `${Math.round(weather.wind.speed * 3.6)}km/h`, righticon: <span style={{ color: '#d0eefd', marginLeft: '8px' }}><FaWind /></span> }
  ];

  return (
    <div className="weather-app-container">
      <div className="app-header">
        <div className="app-logo">
          <span className="logo-icon"><img src="/image.png" alt="" /></span>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading weather data...</p>
        </div>
      )}

      <div className="weather-content">
        <div className="weather-overview">
          {weatherData ? (
            <>
              <div className="location-info">
                <div className="current-temp">
                  {Math.round(weatherData.main.temp)}
                  <span className="degree-symbol">°</span>
                </div>

                <div className="city-name">
                  {weatherData.name}
                  <br />
                   {new Date(weatherData.dt * 1000).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                    year: "2-digit",
                  })}
                    {new Date(weatherData.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{" "}
                  <br />
                  
                </div>
                
                <div className="weather-icon">
                  {getWeatherIcon(weatherData.weather[0].description)}
                </div>


              </div>

            </>
          ) : !loading && (
            <div className="no-data">
              <h2>Welcome to WeatherApp</h2>
              <p>Search for a city to get weather information!</p>
            </div>
          )}
        </div>

        <div className="weather-details">
          {/* Search Box */}
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search Location..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
                <button type="submit" className="search-btn" disabled={loading || !searchCity.trim()}>
                  <FaSearch />
                </button>
              </div>
            </form>
          </div>
          <hr />
          {/* WEATHER DETAILS */}
          {weatherData && (
            <>
              <div className="details-title" style={{ marginBottom: '10px', marginTop: '4px' }}>Weather Details...</div>
              <div className="weather-status" style={{ letterSpacing: '.2px', marginBottom: '20px', fontWeight: 'bold' }}>
                {weatherData.weather[0].description.toUpperCase()}
              </div>
              <br />
              <div className="weather-stats" style={{ margin: '0 0 7px 0' }}>
                {statIcons.map((stat, i) => (
                  <div className="stat-item" key={i}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      {stat.label}
                    </span>
                    <span style={{ minWidth: '58px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                      {stat.accessor(weatherData)} {stat.righticon}
                    </span>
                  </div>
                ))}
              </div>
              <hr style={{ margin: '22px 0 11px 0', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.18)' }} />
              <div style={{ color: '#ffffffff', fontSize: '1.03rem', marginBottom: '9px', fontWeight: '500' }}>Today's Weather Forecast...</div>
            </>
          )}

          {/* FORECAST */}
          {forecastData && (
            <div className="forecast-container">
              <div className="forecast-items">
                {forecastData.list.slice(0, 3).map((item, index) => (
                  <div key={index} className="forecast-item">
                    <div className="forecast-time">
                      {new Date(item.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="forecast-icon" style={{ fontSize: '1.8rem', marginTop: '2px' }}>
                      {getWeatherIcon(item.weather[0].description)}
                    </div>
                    <div className="forecast-weather">{item.weather[0].main}</div>
                    <div className="forecast-temp-range" style={{ gap: '4px' }}>
                      <span className="forecast-temp-high">{Math.round(item.main.temp)}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
