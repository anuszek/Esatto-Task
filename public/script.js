import { Moon } from "https://cdn.jsdelivr.net/npm/lunarphase-js@2.0.1/+esm";

const addObservationBtn = document.getElementById("add-observation");
const observationModal = document.getElementById("observation-modal");
const observationForm = document.getElementById("observation-form");
const cancelObservationBtn = document.getElementById("cancel-observation");
const fetchMoonDataBtn = document.getElementById("fetch-moon-data");

addObservationBtn.addEventListener("click", async () => {
  document.getElementById("modal-title").textContent = "Add New Observation";
  document.getElementById("observation-id").value = "";
  try {
    const weatherData = await getWeatherData();
    console.log(weatherData);

    if (weatherData) {
      document.getElementById("weather").innerText = weatherData.main;
    } else {
      document.getElementById("weather").innerText = "Weather data unavailable";
    }
  } catch (error) {
    console.error("Error getting weather data:", error);
    document.getElementById("weather").innerText = "Error fetching weather";
  }
  observationForm.reset();
  observationModal.style.display = "flex";
});

cancelObservationBtn.addEventListener("click", () => {
  observationModal.style.display = "none";
});

fetchMoonDataBtn.addEventListener("click", async () => {});

observationForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // In a real app, you would send this data to your backend
  const observationData = {
    date: document.getElementById("observation-date").value,
    location: document.getElementById("location").value,
    // visibility: document.getElementById("visibility").value,
    notes: document.getElementById("notes").value,
  };

  console.log("Observation data to save:", observationData);
  alert("In a real app, this would save to your database");
  observationModal.style.display = "none";

  // Refresh the observations list
  // In a real app: fetchObservations();
});

// helper functions

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

// close modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === observationModal) {
    observationModal.style.display = "none";
  }
});
