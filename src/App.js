import React, { useState } from "react";
import "./App.css";
import {  Thermometer, Droplets, Wind } from 'lucide-react';
function App() {
  const API_KEY = process.env.REACT_APP_API_KEY; // Access API key from .env
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]); // Added state for suggestions

  // Fetch weather data
  const getWeather = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission

    if (!city.trim()) {
      setError("Please enter a city name.");
      setWeatherData(null);
      return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("City not found.");
      }

      const data = await response.json();
      setWeatherData(data);
      setError("");
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    }
  };

  // Fetch city suggestions as user types
  const getCitySuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const url = `https://api.openweathermap.org/data/2.5/find?q=${query}&appid=${API_KEY}&type=like&cnt=5`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setSuggestions(data.list || []);
    } catch (err) {
      console.error("Error fetching city suggestions:", err);
    }
  };

   {/* Handle city input */}
  const handleCityChange = (e) => {
    setCity(e.target.value);
    getCitySuggestions(e.target.value);
  };
  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };
  return (
    <div className="App">
      {/* Top Heading */}
      <div className="topheading">
        <h1>Weather App</h1>
        <img
          className="headinglogo"
          src="https://i.pinimg.com/736x/30/b1/1a/30b11a92a85361de088b6d668785f0aa.jpg"
          alt="Logo"
        />
      </div>

      {/* Search Form */}
      <div className="inputbox">
        <div className="form-container">
          <form className="form" onSubmit={getWeather}>
            <div className="form-group">
              <label htmlFor="city">Search for a city or airport:</label>
              <input
                type="text"
                id="city"
                placeholder="Enter city name"
                value={city}
                onChange={handleCityChange}
              />
            </div>
            <button className="form-submit-btn" type="submit">
              Get Weather
            </button>
          </form>
          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  onClick={() => {
                    setCity(suggestion.name);
                    setSuggestions([]);
                  }}
                >
                  {suggestion.name}, {suggestion.sys.country}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Display Weather Data */}
     <div className="weatherinfo">  
     <div className="weather-container">
        {error && <p className="error">{error}</p>}
        {weatherData && (
        <div className="weather-data">
          <div className="weather-header">
            <h2>
              {weatherData.name}, {weatherData.sys.country}
            </h2>
            <div className="weather-icon">
              <img
                src={getWeatherIcon(weatherData.weather[0].icon)}
                alt={weatherData.weather[0].description}
              />
            </div>
            <div className="weather-info">
              <p className="temperature">{Math.round(weatherData.main.temp)}°C</p>
              <p className="description">{weatherData.weather[0].description}</p>
            </div>
          </div>

          <div className="weather-stats">
            <div className="stat">
              <Thermometer className="icon" />
              <div>
                <p className="label">Feels Like</p>
                <p className="value">{Math.round(weatherData.main.feels_like)}°C</p>
              </div>
            </div>
            <div className="stat">
              <Droplets className="icon" />
              <div>
                <p className="label">Humidity</p>
                <p className="value">{weatherData.main.humidity}%</p>
              </div>
            </div>
            <div className="stat">
              <Wind className="icon" />
              <div>
                <p className="label">Wind Speed</p>
                <p className="value">{weatherData.wind.speed} m/s</p>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
     </div>

       {/* Footer */}
       <footer className="footer">
        <p>&copy; 2025 WeatherApp. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
