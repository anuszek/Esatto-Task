import { Moon } from "https://cdn.jsdelivr.net/npm/lunarphase-js@2.0.1/+esm";

const addObservationBtn = document.getElementById("add-observation");
const observationModal = document.getElementById("observation-modal");
const observationForm = document.getElementById("observation-form");
const cancelObservationBtn = document.getElementById("cancel-observation");

var date = null;
var time = null;

addObservationBtn.addEventListener("click", async () => {
  date = new Date().toISOString().split("T")[0];
  time = new Date().toLocaleTimeString().slice(0, -3);

  document.getElementById(
    "current-date"
  ).innerText = `Current date: ${date}, ${time}`;
  document.getElementById("observation-id").value = "";

  try {
    const weatherData = await getWeatherData();
    console.log(weatherData);

    if (weatherData) {
      document.getElementById(
        "weather"
      ).innerText = `Current weather: ${weatherData.main}`;
    } else {
      document.getElementById("weather").innerText = "Weather data unavailable";
    }
  } catch (error) {
    console.error("Error getting weather data:", error);
    document.getElementById("weather").innerText = "Error fetching weather";
  }

  document.getElementById(
    "moon-phase"
  ).innerText = `Moon phase: ${Moon.lunarPhaseEmoji()} ${Moon.lunarPhase()}`;

  observationForm.reset();
  observationModal.style.display = "flex";
});

cancelObservationBtn.addEventListener("click", () => {
  observationModal.style.display = "none";
});

observationForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const observationData = {
    date: date,
    visibility: document.querySelector('input[name="visibility"]:checked')
      .value,
    rating: document
      .querySelector('input[name="value-radio"]:checked')
      .value.slice(-1),
    notes: document.getElementById("notes").value,
  };
  console.log(observationData);

  addObservation(observationData);

  observationModal.style.display = "none";

  fetchObservations();
});

// fetch functions
async function getWeatherData() {
  try {
    const response = await fetch("/api/weather");
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

async function fetchObservations() {
  try {
    const response = await fetch("/api/observations");
    if (!response.ok) {
      throw new Error("Failed to fetch observations");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching observations:", error);
    return [];
  }
}

async function addObservation(observationData) {
  try {
    const response = await fetch("/api/observations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: observationData.date,
        visibility: observationData.visibility,
        phase: Moon.lunarPhase(),
        rating: observationData.rating,
        notes: observationData.notes,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add observation");
    }

    const newObservation = await response.json();
    console.log("New observation added:", newObservation);
  } catch (error) {
    console.error("Error adding observation:", error);
  }
}

// close modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === observationModal) {
    observationModal.style.display = "none";
  }
});
