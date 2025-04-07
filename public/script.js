const addObservationBtn = document.getElementById("add-observation");
const observationModal = document.getElementById("observation-modal");
const observationForm = document.getElementById("observation-form");
const cancelObservationBtn = document.getElementById("cancel-observation");
const fetchMoonDataBtn = document.getElementById("fetch-moon-data");

addObservationBtn.addEventListener("click", () => {
  document.getElementById("modal-title").textContent = "Add New Observation";
  document.getElementById("observation-id").value = "";
  observationForm.reset();
  observationModal.style.display = "flex";
});

cancelObservationBtn.addEventListener("click", () => {
  observationModal.style.display = "none";
});

fetchMoonDataBtn.addEventListener("click", async () => {
  const date = document.getElementById("observation-date").value;
  const location = document.getElementById("location").value;

  if (!date) {
    alert("Please enter a date first");
    return;
  }

  try {
    // In a real app, you would call your backend which calls the moon API
    // This is a mock implementation
    const mockMoonData = {
      moon_phase: getRandomPhase(),
      illumination: Math.floor(Math.random() * 100),
      moonrise: "19:45",
      moonset: "05:23",
    };

    // Display the data (in a real app, you might store this)
    alert(
      `Fetched moon data:\n
      Phase: ${mockMoonData.moon_phase}\n
      Illumination: ${mockMoonData.illumination}%\n
      Moonrise: ${mockMoonData.moonrise}\n
      Moonset: ${mockMoonData.moonset}`
    );
  } catch (error) {
    console.error("Error fetching moon data:", error);
    alert("Failed to fetch moon data. Please try again.");
  }
});

observationForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // In a real app, you would send this data to your backend
  const observationData = {
    date: document.getElementById("observation-date").value,
    location: document.getElementById("location").value,
    visibility: document.getElementById("visibility").value,
    equipment: document.getElementById("equipment").value,
    notes: document.getElementById("notes").value,
    image_url: document.getElementById("image-url").value,
  };

  console.log("Observation data to save:", observationData);
  alert("In a real app, this would save to your database");
  observationModal.style.display = "none";

  // Refresh the observations list
  // In a real app: fetchObservations();
});

// Helper functions
function getRandomPhase() {
  const phases = [
    "New Moon",
    "Waxing Crescent",
    "First Quarter",
    "Waxing Gibbous",
    "Full Moon",
    "Waning Gibbous",
    "Last Quarter",
    "Waning Crescent",
  ];
  return phases[Math.floor(Math.random() * phases.length)];
}

// close modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === observationModal) {
    observationModal.style.display = "none";
  }
});
