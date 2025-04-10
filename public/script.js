import { Moon } from "https://cdn.jsdelivr.net/npm/lunarphase-js@2.0.1/+esm";

async function init() {
  try {
    const observations = await fetchObservations();
    renderObservations(observations);

    updatePaginationControls();
  } catch (error) {
    console.error("Initialization error:", error);
  }
}

document.addEventListener("DOMContentLoaded", init);

const searchInput = document.getElementById("search");
const addObservationBtn = document.getElementById("add-observation");
const observationModal = document.getElementById("observation-modal");
const observationForm = document.getElementById("observation-form");
const cancelObservationBtn = document.getElementById("cancel-observation");
const observationsList = document.getElementById("observations-list");
const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");

const itemsPerPage = 3;
let currentPage = 1;
let observationsArray = [];

let date = null;
let time = null;

searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredObservations = observationsArray.filter((observation) => {
    return observation.notes.toLowerCase().includes(searchTerm);
  });
  renderObservations(filteredObservations);
  currentPage = 1;
  updatePaginationControls();
});

addObservationBtn.addEventListener("click", async () => {
  date = new Date().toISOString().split("T")[0];
  time = new Date().toLocaleTimeString().slice(0, -3);

  document.getElementById(
    "current-date"
  ).innerText = `Current date: ${date}, ${time}`;
  document.getElementById("observation-id").value = "";

  try {
    const weatherData = await getWeatherData();
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

  addObservation(observationData);

  observationModal.style.display = "none";

  await fetchObservations();
  renderObservations(observationsArray);
});

prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderObservations(observationsArray);
  }
});

nextPageBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(observationsArray.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderObservations(observationsArray);
  }
});

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
    observationsArray = observations;
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
  } catch (error) {
    console.error("Error adding observation:", error);
  }
}

async function deleteObservation(id) {
  try {
    const response = await fetch(`/api/observations/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete observation");
    }
    const deletedObservation = await response.json();
    observationsArray = observationsArray.filter((obs) => obs.id !== id);
    renderObservations(observationsArray);
  } catch (error) {
    console.error("Error deleting observation:", error);
  }
}

function renderObservations(observations) {
  if (!observations || observations.length === 0) {
    observationsList.innerHTML =
      '<p class="no-results">No observations found</p>';
    updatePaginationControls();
    return;
  }
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedObservations = observations.slice(startIndex, endIndex);

  observationsList.innerHTML = "";

  paginatedObservations.forEach((observation) => {
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
      <div>
        <button class="edit-btn" data-id="${observation.id}">Edit</button>
        <button class="delete-btn" data-id="${observation.id}">Delete</button>
      </div>
    </div>
    <div class="observation-details">
      <div class="detail-item">
        <strong>Moon Phase: ${observation.moon_phase}</strong> 
      </div>
      <div class="detail-item">
        <strong>Visible: ${observation.visibility ? "Yes" : "No"}</strong>
      </div>
      <div class="detail-item">
        <strong>Rating: </strong> ${getRatingStars(observation.rating)}
      </div>     
    </div>     
    <div class="observation-notes">
      ${observation.notes || "<i>No notes provided</i>"}
    </div>
   `;
    observationsList.appendChild(card);
  });

  updatePaginationControls();
}

observationsList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const id = parseInt(event.target.getAttribute("data-id"), 10);
    deleteObservation(id);
  }

  if (event.target.classList.contains("edit-btn")) {
    const id = parseInt(event.target.getAttribute("data-id"), 10);
    editObservation(id);
  }
});

function editObservation(id) {}

function showObservation(id) {
  document.getElementById("edit-observation-modal").style.display = "flex";
}

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

function updatePaginationControls() {
  const totalPages = Math.ceil(observationsArray.length / itemsPerPage);

  document.getElementById("page-info").textContent = `Page ${currentPage} of ${
    totalPages || 1
  }`;
  document.getElementById("prev-page").disabled = currentPage <= 1;
  document.getElementById("next-page").disabled =
    currentPage >= totalPages || totalPages === 0;
}

window.addEventListener("click", (e) => {
  if (e.target === observationModal) {
    observationModal.style.display = "none";
  }
});
