const axios = require("axios");

async function fetchWeather() {
  const apiKey = "451e252e659bf3f308a40bfb80b72ce4";
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
