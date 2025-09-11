const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const API_URL = import.meta.env.VITE_WEATHER_API_URL;

export const fetchWeatherByCity = async (city) => {
  if (!API_KEY) throw new Error("API key not found");

  const weatherResponse = await fetch(
    `${API_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
  );
  if (!weatherResponse.ok) throw new Error("City not found");

  const forecastResponse = await fetch(
    `${API_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
  );

  return {
    weather: await weatherResponse.json(),
    forecast: await forecastResponse.json(),
  };
};

export const fetchWeatherByCoords = async (lat, lon) => {
  const weatherResponse = await fetch(
    `${API_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  const forecastResponse = await fetch(
    `${API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );

  return {
    weather: await weatherResponse.json(),
    forecast: await forecastResponse.json(),
  };
};
