const axios = require("axios");
require("dotenv").config();

async function fetchWeather() {
  const apiKey = process.env.OPENWEATHER_API_KEY;   
  const city = "Krakow";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    const weather = {
      main: data.weather[0].main,
      description: data.weather[0].description,
      temp: data.main.temp,
    };

    return weather;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

module.exports = {
  fetchWeather,
};
