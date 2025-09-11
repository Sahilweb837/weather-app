import {
  WiThunderstorm,
  WiRain,
  WiDaySunny,
  WiCloudy,
  WiSnow,
} from "react-icons/wi";
import {
  FaTemperatureHigh,
  FaTemperatureLow,
  FaTint,
  FaWind,
  FaCloud,
} from "react-icons/fa";

export const getWeatherIcon = (condition) => {
  const c = condition.toLowerCase();
  if (c.includes("thunderstorm")) return <WiThunderstorm className="main-weather-icon" />;
  if (c.includes("rain") || c.includes("drizzle")) return <WiRain className="main-weather-icon" />;
  if (c.includes("snow")) return <WiSnow className="main-weather-icon" />;
  if (c.includes("cloud")) return <WiCloudy className="main-weather-icon" />;
  return <WiDaySunny className="main-weather-icon" />;
};

export const statIcons = [
  {
    icon: <FaTemperatureHigh className="stat-icon" />,
    label: "Temp max",
    accessor: (weather) => `${Math.round(weather.main.temp_max)}°`,
    righticon: <span style={{ color: "#ee5566", marginLeft: "8px" }}><FaTemperatureHigh /></span>,
  },
  {
    icon: <FaTemperatureLow className="stat-icon" />,
    label: "Temp min",
    accessor: (weather) => `${Math.round(weather.main.temp_min)}°`,
    righticon: <span style={{ color: "#3992cb", marginLeft: "8px" }}><FaTemperatureLow /></span>,
  },
  {
    icon: <FaTint className="stat-icon" />,
    label: "Humidity",
    accessor: (weather) => `${weather.main.humidity}%`,
    righticon: <span style={{ color: "#5fdcf3", marginLeft: "8px" }}><FaTint /></span>,
  },
  {
    icon: <FaCloud className="stat-icon" />,
    label: "Cloudy",
    accessor: (weather) => `${weather.clouds.all}%`,
    righticon: <span style={{ color: "#c3bfff", marginLeft: "8px" }}><FaCloud /></span>,
  },
  {
    icon: <FaWind className="stat-icon" />,
    label: "Wind",
    accessor: (weather) => `${Math.round(weather.wind.speed * 3.6)}km/h`,
    righticon: <span style={{ color: "#d0eefd", marginLeft: "8px" }}><FaWind /></span>,
  },
];
