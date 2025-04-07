const axios = require("axios");
require("dotenv").config();

const fetchMoonData = async (date, location) => {
  try {
    const geoResponse = await axios.get(
      `http://api.weatherapi.com/v1/search.json?key=${process.env.WEATHERAPI_KEY}&q=${location}`
    );

    if (!geoResponse.data || geoResponse.data.length === 0) {
      throw new Error("Location not found");
    }

    const { lat, lon } = geoResponse.data[0];

    const astronomyResponse = await axios.get(
      `http://api.weatherapi.com/v1/astronomy.json?key=${process.env.WEATHERAPI_KEY}&q=${lat},${lon}&dt=${date}`
    );

    const astroData = astronomyResponse.data.astronomy.astro;

    return {
      phase: calculateMoonPhase(date),
    };
  } catch (error) {
    console.error("Error fetching moon data:", error);
    throw new Error("Failed to fetch moon data");
  }
};

function calculateMoonPhase(date) {
  const { getMoonPhase } = require("lunarphase-js");
  return getMoonPhase(new Date(date));
}

module.exports = { fetchMoonData };
