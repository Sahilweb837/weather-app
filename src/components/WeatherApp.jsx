import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import useWeather from "./useWeather";
import { getWeatherIcon, statIcons } from "./icons";
import "./WeatherApp.css";

export default function WeatherApp() {
  const { weatherData, forecastData, loading, error, fetchWeatherData } = useWeather();
  const [searchCity, setSearchCity] = useState("");
  const [unit, setUnit] = useState("metric");

  useEffect(() => {
    const interval = setInterval(() => {
      if (weatherData?.name) {
        fetchWeatherData(weatherData.name, unit);
      }
    }, 300000);
    return () => clearInterval(interval);
  }, [weatherData, unit, fetchWeatherData]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeatherData(searchCity.trim(), unit);
      setSearchCity("");
    }
  };

  const handleRefresh = () => {
    if (weatherData?.name) {
      fetchWeatherData(weatherData.name, unit);
    }
  };

  const toggleUnit = () => {
    setUnit((prev) => (prev === "metric" ? "imperial" : "metric"));
    if (weatherData?.name) {
      fetchWeatherData(weatherData.name, unit === "metric" ? "imperial" : "metric");
    }
  };

  const handleTodayWeather = () => {
    if (weatherData?.name) {
      fetchWeatherData(weatherData.name, unit, "today");
    }
  };

  const handleFiveDayForecast = () => {
    if (weatherData?.name) {
      fetchWeatherData(weatherData.name, unit, "forecast");
    }
  };

  const handleCityClick = (city) => {
    fetchWeatherData(city, unit);
  };

  return (
    <div className="weather-app-container">
      <div className="app-header">
        <div className="app-logo">
          <span className="logo-icon"><img src="/image.png" alt="logo" /></span>
        </div>
      </div>

      {error && <div className="error-message"><h1>⚠️ {error}</h1></div>}
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading weather data...</p>
        </div>
      )}

      <div className="weather-content">
        <div className="weather-overview">
          {weatherData ? (
            <div className="location-info">
              <div className="current-temp">
                {weatherData.main ? Math.round(weatherData.main.temp) : "--"}
                <span className="degree-symbol">°{unit === "metric" ? "C" : "F"}</span>
              </div>
              <div className="city-name">
                {weatherData.name || "Unknown City"}
                <br />
                {weatherData.dt && (
                  <>
                    {new Date(weatherData.dt * 1000).toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "numeric",
                      month: "short",
                      year: "2-digit",
                    })}{" "}
                    {new Date(weatherData.dt * 1000).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </>
                )}
              </div>
              <div className="weather-icon">
                {weatherData.weather?.[0] && getWeatherIcon(weatherData.weather[0].description)}
              </div>
            </div>
          ) : !loading && (
            <div className="no-data">
              <h2>Welcome to WeatherApp</h2>
              <p>Search for a city to get weather information!</p>
            </div>
          )}
        </div>

        <div className="weather-details">
          {/* 🔎 Search Box */}
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search Location..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  disabled={loading}
                />
                <button type="submit" className="search-btn" disabled={loading || !searchCity.trim()}>
                  <FaSearch />
                </button>
              </div>
            </form>
          </div>

          <div className="quick-city-buttons">
            <button onClick={() => handleCityClick("Delhi")}>Delhi</button>
            <button onClick={() => handleCityClick("Mumbai")}>Mumbai</button>
            <button onClick={() => handleCityClick("Chandigarh")}>Chandigarh</button>
            <button onClick={() => handleCityClick("Mohali")}> Mohali</button>
          </div>

          <hr />

          {weatherData?.main && (
            <>
              <div className="details-title">Weather Details...</div>
              <div className="weather-status">
                {weatherData.weather?.[0]?.description?.toUpperCase()}
              </div>
              <div className="weather-stats">
                {statIcons.map((stat, i) => (
                  <div className="stat-item" key={i}>
                    <span>{stat.label}</span>
                    <span>{stat.accessor(weatherData)} {stat.righticon}</span>
                  </div>
                ))}
              </div>
              <hr />
              <div className="forecast-title">Today's Weather Forecast...</div>
            </>
          )}

          {forecastData?.list && (
            <div className="forecast-container">
              <div className="forecast-items">
                {forecastData.list.slice(0, 3).map((item, index) => (
                  <div key={index} className="forecast-item">
                    <div className="forecast-time">
                      {new Date(item.dt_txt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div className="forecast-icon">
                      {getWeatherIcon(item.weather[0].description)}
                    </div>
                    <div className="forecast-weather">{item.weather[0].main}</div>
                    <div className="forecast-temp-range">
                      <span>{Math.round(item.main.temp)}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ✅ Extra Action Buttons */}
          <div className="extra-buttons">
            <button onClick={handleRefresh} className="refresh-btn">🔄 Refresh</button>
            <button onClick={toggleUnit} className="unit-btn">
              Switch to {unit === "metric" ? "°F" : "°C"}
            </button>
            <button onClick={handleTodayWeather} className="today-btn">🌤 Today</button>
            <button onClick={handleFiveDayForecast} className="forecast-btn">📅 5-Day Forecast</button>
          </div>
        </div>
      </div>
    </div>
  );
}
