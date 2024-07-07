import "./search.css"
import React, { useState } from 'react';
function SearchPage() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    const apiKey = process.env.REACT_APP_API_KEY; // Ensure your API key is stored safely
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.cod !== 200) {
        throw new Error(data.message);
      }
      setWeatherData(data);
      setError('');
    } catch (error) {
      setError(error.message);
      setWeatherData(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  return (
    <div>
      <h1>Search for Weather</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button type="submit">Get Weather</button>
      </form>
      {error && <p>{error}</p>}
      {weatherData && (
        <div>
          <h2>Weather in {weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp} °C</p>
          <p>Weather: {weatherData.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
