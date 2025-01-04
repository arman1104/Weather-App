import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Droplet, Wind } from "lucide-react";
import { allIcons } from "../components/Data";

const WeatherCard = () => {
  const apiKey = "9e6575789f45533a67f70b84ddf67ca1";
  const [weatherData, setWeatherData] = useState(null);
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleInput(event) {
    // setInput(event.target.value);
    const value = event.target.value;
    setInput(value);
    if (value.trim() === "") {
      setWeatherData(null); // Clear previously fetched data
      setErrorMessage("Please Enter a City/Country Name."); // Clear any error messages
    }
  }

  const search = async (city) => {
    if (city.trim() === "") {
      setErrorMessage("Please Enter a City/Country Name.");
      setWeatherData(null);
      return;
    }

    try {
      const API = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
      const response = await fetch(API);
      const data = await response.json();

      if (data.cod !== 200) {
        setErrorMessage("City Not Found.");
        setWeatherData(null);
        return;
      }

      setErrorMessage(""); // Clear any previous error messages

      //! icon url from direct api
      const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0]?.icon}@2x.png`;
      //! icon from private folder
      // const icon = allIcons[data.weather[0]?.icon] || allIcons["01d"]; // Default to clearIcon

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        //! icon from  api url
        icon: iconUrl,
        //! icon from private folder
        // icon: icon,
        description: data.weather[0].description,
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setErrorMessage("An error occurred. Please try again.");
      setWeatherData(null);
    }
  };

  useEffect(() => {
    search("");
  }, []);

  return (
    <div className="main-container">
      <div className="card">
        {/* Search Bar */}
        <div className="input-container">
          <input
            type="text"
            placeholder="Search"
            value={input}
            onChange={handleInput}
          />
          <Search className="search-icon" onClick={() => search(input)} />
        </div>

        {errorMessage ? (
          <p className="error-message">{errorMessage}</p>
        ) : weatherData ? (
          <>
            <h3>{weatherData.location}</h3>
            <img
              src={weatherData.icon}
              alt="Weather Icon"
              className="weather-icon"
            />
            <p className="description">{weatherData.description}</p>
            <h1>{weatherData.temperature}°C</h1>

            <div className="info-container">
              <div className="info">
                <Droplet className="info-icon" />
                <span>{weatherData.humidity}%</span>
                <p>Humidity</p>
              </div>
              <div className="info">
                <Wind className="info-icon" />
                <span>{weatherData.windSpeed} Km/h</span>
                <p>Wind Speed</p>
              </div>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;
