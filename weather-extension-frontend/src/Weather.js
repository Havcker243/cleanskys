// Importing necessary React hooks and CSS.
import React, { useEffect, useState } from "react";
import "./App.css"; // Make sure you import your stylesheet

// Defining the Weather component.
function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [weatherClass, setWeatherClass] = useState(""); // Add a state to hold the class name
  const [weatherBackground, setWeatherBackground] = useState("");
  const [weatherMessage, setWeatherMessage] = useState("");
  const [localTime, setLocalTime] = useState(""); // State to store the local time

  // useEffect hook to handle the lifecycle of the component.
  useEffect(() => {
    // Function to fetch weather data
    const apikey = process.env.REACT_APP_API_KEY;
    const fetchWeather = async (latitude, longitude) => {
      // Constructing the URL with the API key and coordinates.
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}&units=metric`;
      // Making the API call and handling the response.
      try {
        const response = await fetch(url);
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        // Logging any errors that occur during the fetch operation.
        console.error("Error fetching the weather data:", error);
      }
    };

    // Function to get user's location
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Fetching weather data for the current location.

            fetchWeather(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            // Logging any errors that occur while getting the location.

            console.error("Error getting location:", error);
            // Handle errors or fallback to a default location
          }
        );
      } else {
        // Handling cases where geolocation is not supported by the browser.

        console.error("Geolocation is not supported by this browser.");
      }
    };

    getLocation(); // Call the function to get location and fetch weather
  }, []); // Empty dependency array means this effect runs once on mount

  // Effect to update the class based on the weather condition
  useEffect(() => {
    if (weatherData && weatherData.weather) {
      const condition = weatherData.weather[0].main.toLowerCase();
      switch (condition) {
        case "snow":
          setWeatherClass("snow");
          break;
        case "rain":
          setWeatherClass("rain");
          break;
        case "clear":
          setWeatherClass("sunny");
          break;
        case "clouds":
          setWeatherClass("cloudy");
          break;
        default:
          setWeatherClass("");
      }
    }
  }, [weatherData]); // This effect runs whenever weatherData changes

  // useEffect to update styles and message based on the weather condition
  useEffect(() => {
    if (weatherData && weatherData.weather) {
      // Extracting the description of the current weather.

      const weather = weatherData.weather[0];
      setWeatherMessage(`It's ${weather.description} today.`);
      setWeatherClass(weather.main.toLowerCase()); // Use this class for icons or additional styling
      // Updating the background image based on the weather condition.

      switch (weather.main) {
        case "Snow":
          setWeatherBackground("snow.png");
          break;
        case "Rain":
          setWeatherBackground("Rainy.png");
          break;
        case "Clear":
          setWeatherBackground("Sunny.png");
          break;
        case "Clouds":
          setWeatherBackground("cloudy.png");
          break;
        // Add more cases as needed
        default:
          setWeatherBackground("url(/path-to-default-weather-image.jpg)");
      }
    }
  }, [weatherData]);

  // Function to convert UNIX timestamp to local time string
  const getLocalTime = (unixTimestamp, timezoneOffset) => {
    // Create a new date object using the timestamp and offset
    const date = new Date((unixTimestamp + timezoneOffset) * 1000);
    // Return the date as a local time string
    return date.toLocaleTimeString();
  };
  // Displaying a loading message while waiting for weather data.

  if (!weatherData) return <div>Loading weather info ...</div>;

  // Get the local time of the weather data calculation
  const calculationTime = weatherData.dt
    ? getLocalTime(weatherData.dt, weatherData.timezone)
    : "";

  return (
    <div
      className={`weather ${weatherClass}`}
      style={{ backgroundImage: weatherBackground }}
    >
      {weatherData.main ? (
        <div>
          <h1>Weather Information for {weatherData.name}</h1>
          <img
            src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
            alt="Weather icon"
          />
          <p>
            According to UTC + 8 Timezone at {calculationTime}, the state of the weather is :{" "}
            {weatherData.weather[0].main}
          </p>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>It might feel like: {weatherData.main.feels_like}°C</p>
          <p>The maximum temperature will be: {weatherData.main.temp_max}°C</p>
          <p>The minimum temperature will be: {weatherData.main.temp_min}°C</p>
          <p>Pressure levels: {weatherData.main.pressure} hPa</p>
        </div>
      ) : (
        <p>Weather data not available</p>
      )}
    </div>
  );
}

export default Weather;
