import { Moon } from "https://cdn.jsdelivr.net/npm/lunarphase-js@2.0.1/+esm";

async function init() {
  try {
    const observations = await fetchObservations();
    renderObservations(observations);

    setupEventListeners();
  } catch (error) {
    console.error("Initialization error:", error);
  }
}

document.addEventListener("DOMContentLoaded", init);

const addObservationBtn = document.getElementById("add-observation");
const observationModal = document.getElementById("observation-modal");
const observationForm = document.getElementById("observation-form");
const cancelObservationBtn = document.getElementById("cancel-observation");
const observationsList = document.getElementById("observations-list");

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

    const observations = await response.json();
    console.log("Fetched observations:", observations);

    return observations;
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

function renderObservations(observations) {
  observationsList.innerHTML = "";

  if (observations.length === 0) {
    observationsList.innerHTML =
      '<p class="no-results">No observations found</p>';
    return;
  }

  observations.forEach((observation) => {
    const moonIcon = getMoonPhaseIcon(observation.moon_phase);
    const dateObj = new Date(observation.date);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const card = document.createElement("div");
    card.className = "observation-card";
    card.innerHTML = `
    <div class="observation-header">
          <div>
            <span class="moon-phase-icon">${moonIcon}</span>
            <span class="observation-date">${formattedDate}</span>
          </div>
        </div>
        <div class="observation-notes">
        ${observation.notes || "No notes provided"}
        </div>
        <div class="observation-details">
          <div class="detail-item">
            <strong>Moon Phase: ${observation.moon_phase}</strong> 
          </div>
          <div class="detail-item"><strong>Visible: ${
            observation.visibility ? "Yes" : "No"
          }</strong>
          </div>
          <div class="detail-item">
          <strong>Rating: </strong> ${getRatingStars(observation.rating)}
        </div>
        </div>
        </div>
        `;
    observationsList.appendChild(card);
  });
}

// helper functions
function getMoonPhaseIcon(phase) {
  const phaseIcons = {
    "New Moon": "🌑",
    "Waxing Crescent": "🌒",
    "First Quarter": "🌓",
    "Waxing Gibbous": "🌔",
    "Full Moon": "🌕",
    "Waning Gibbous": "🌖",
    "Last Quarter": "🌗",
    "Waning Crescent": "🌘",
  };

  return phaseIcons[phase] || "🌙";
}

function getRatingStars(rating) {
  const numRating = parseInt(rating);
  return "★".repeat(numRating) + "☆".repeat(5 - numRating);
}

window.addEventListener("click", (e) => {
  if (e.target === observationModal) {
    observationModal.style.display = "none";
  }
});
