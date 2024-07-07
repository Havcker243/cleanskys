// Importing necessary React hooks and CSS.
import React, { useEffect, useState } from "react";
import "./App.css"; // Make sure you import your styleshee
// Defining the Weather component.
function Weather() {
  // State for storing weather data fetched from the API.
  const [weatherData, setWeatherData] = useState(null);
    // State to store the CSS class based on weather conditions.\
  const [weatherClass, setWeatherClass] = useState(""); // Add a state to hold the class name
    // State to toggle between Celsius and Fahrenheit.
  const [isCelsius, setIsCelsius] = useState(true); // True for Celsius, false for Fahrenheit
    // State to store weather-related messages.
  const [weatherMessage, setWeatherMessage] = useState("");
    // State to store temperature-related image and description.
  const [temperatureInfo, setTemperatureInfo] = useState({
    image: "",
    description: "",
  });

    // Array of objects defining temperature ranges and corresponding imagery/descriptions.
  const temperatureRanges = [
    { max: -10, image: "ice.png", description: "Extremely Cold" },
    { min: -10, max: 0, image: "snow.png", description: "Freezing" }, // Changed to 'snow.png' which might be more visually appropriate for freezing conditions.
    { min: 1, max: 5, image: "fahrenheit.png", description: "Very Cold" },
    {
      min: 6,
      max: 10,
      image: "raindrops.png",
      description: "Chilly with Raindrops",
    },
    {
      min: 11,
      max: 15,
      image: "windyrainy.png",
      description: "Cool with Windy Rain",
    },
    {
      min: 16,
      max: 20,
      image: "cloudysunny.png",
      description: "Mild Overcast",
    }, // Assuming 'cloudysunny.png' could represent 'Mild Overcast'.
    { min: 21, max: 25, image: "daysunny.png", description: "Warm and Sunny" },
    { min: 26, max: 30, image: "thermometer.png", description: "Hot" },
    { min: 31, max: 40, image: "strong_wind.png", description: "Very Hot" }, // No specific image for very hot, using placeholder.
    { min: 41, max: 50, image: "droplets.png", description: "Extremely Hot" }, // Changed to 'droplets.png', assuming visual of intense heat.
    { min: 51, max: 60, image: "clearsunny.png", description: "Scorching" }, // Changed to 'clearsunny.png' for a more intense sun representation.
    { min: 61, max: 70, image: "Color-Offcloudy.png", description: "Inferno" },
    { min: 71, max: 80, image: "Color-Off.png", description: "Blazing" },
    { min: 81, max: 90, image: "Color-Off.png", description: "Boiling Point" },
    { min: 91, max: 100, image: "Color-Off.png", description: "Melting Point" },
    { min: 101, max: 110, image: "Color-Off.png", description: "Incendiary" },
    {
      min: 111,
      max: 120,
      image: "Color-Off.png",
      description: "Unbearable Heat",
    },
  ];


  // Function to determine the temperature range based on current temperature.
  function getTemperatureRange(temp) {
    for (const range of temperatureRanges) {
      if (
        (range.min === undefined || temp >= range.min) &&
        (range.max === undefined || temp <= range.max)
      ) {
        return { image: range.image, description: range.description };
      }
    }
    return { image: "default.png", description: "Temperature out of range" }; // Default case if no range matches
  }

  // Function to convert temperature from Celsius to Fahrenheit.
  function convertToFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
  }

    // Function to utilize the Web Speech API to speak weather information.
  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

    // Handler for triggering speech of current weather conditions.
  const handleSpeak = () => {
    if (!weatherData) return;
    const tempUnit = isCelsius ? "degrees Celsius" : "degrees Fahrenheit";
    const temp = isCelsius
      ? weatherData.main.temp
      : convertToFahrenheit(Math.floor(weatherData.main.temp));
    const feeltemp = isCelsius
      ? weatherData.main.feels_like
      : convertToFahrenheit(Math.floor(weatherData.main.feels_like));
    const maxtemp = isCelsius
      ? weatherData.main.temp_max
      : convertToFahrenheit(Math.floor(weatherData.main.temp_max));
    const mintemp = isCelsius
      ? weatherData.main.temp_min
      : convertToFahrenheit(Math.floor(weatherData.main.temp_min));
    const text = `Current temperature in ${weatherData.name} is ${temp} ${tempUnit}, with ${weatherData.weather[0].description}.,It might feel like: ${feeltemp} ${tempUnit} , but it will never pass: ${maxtemp}${tempUnit} and never below: ${mintemp} ${tempUnit}`;
    speak(text);
  };

  // Effect hook to fetch weather data once component is mounted.
  useEffect(() => {
    if (weatherData && weatherData.main && weatherData.main.temp) {
      const tempInfo = getTemperatureRange(weatherData.main.temp);
      setTemperatureInfo(tempInfo);
    }
  }, [weatherData]); // This effect runs whenever weatherData changes

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

  useEffect(() => {
    if (weatherData && weatherData.main && weatherData.main.temp) {
      const tempInfo = getTemperatureRange(weatherData.main.temp);
      setTemperatureInfo(tempInfo);
    }
  }, [weatherData]); // This effect runs whenever weatherData change

  // useEffect to update styles and message based on the weather condition
  useEffect(() => {
    if (weatherData && weatherData.weather) {
      // Extracting the description of the current weather.

      const weather = weatherData.weather[0];
      setWeatherMessage(`It's ${weather.description} today.`);
      setWeatherClass(weather.main.toLowerCase()); // Use this class for icons or additional styling
      // Updating the background image based on the weather condition.
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
  const calculationTime = weatherData.timezone
    ? getLocalTime(weatherData.dt, weatherData.timezone)
    : "";
// Function used to convert the timestamp to dates 
  function convertTimestampToDate(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000); // Convert the timestamp from seconds to milliseconds
    return date.toLocaleDateString("en-US"); // Returns the date in the format "MM/DD/YYYY" for the US locale
  }

    // Convert UNIX timestamp to a human-readable date.
const finaldate = convertTimestampToDate(weatherData.dt)

  // Main JSX for displaying weather information.
  return (
    <div className={`weather ${weatherClass}`}>
      {weatherData.main ? (
        <div>
          <h1>Weather Information for {weatherData.name}</h1>
          <img
            src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
            alt="Weather icon"
            style={{ width: 70, height: 70 }}
          />
          <p>{weatherMessage}</p>

          <p>
            At {calculationTime} on {finaldate}, the state of the
            weather is : {weatherData.weather[0].main}
          </p>
          <label>
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={isCelsius}
                onChange={() => setIsCelsius(!isCelsius)}
              />
              <span className="slider"></span>
            </div>
            Display in Celsius
          </label>
          <button onClick={handleSpeak}>Speak</button>
          <p>
            Temperature:{" "}
            {isCelsius
              ? `${Math.floor(weatherData.main.temp)}°C`
              : `${convertToFahrenheit(Math.floor(weatherData.main.temp))}°F`}
          </p>

          <p>
            It might feel like:{" "}
            {isCelsius
              ? `${Math.floor(weatherData.main.feels_like)}°C`
              : `${convertToFahrenheit(
                  Math.floor(weatherData.main.feels_like)
                )}°F`}{" "}
          </p>

          <p>
            The maximum temperature will be:{" "}
            {isCelsius
              ? `${Math.floor(weatherData.main.temp_max)}°C`
              : `${convertToFahrenheit(
                  Math.floor(Math.floor(weatherData.main.temp_max))
                )}°F`}
          </p>
          <p>
            The minimum temperature will be:{" "}
            {isCelsius
              ? `${Math.floor(weatherData.main.temp_min)}°C`
              : `${convertToFahrenheit(
                  Math.floor(weatherData.main.temp_min)
                )}°F`}
          </p>
          <p>Pressure levels: {weatherData.main.pressure} hPa</p>
        </div>
      ) : (
        <p>Weather data not available</p>
      )}
    </div>
  );
}

export default Weather;
