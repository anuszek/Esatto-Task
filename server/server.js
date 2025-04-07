const express = require("express");
const db = require("./database");
const { fetchWeather } = require("./weatherAPI");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/api/weather", async (req, res) => {
  try {
    const weatherData = await fetchWeather();
    res.json(weatherData);
  } catch (error) {
    console.error("Server error fetching weather:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.get("/api/observations", (req, res) => {
  db.all("SELECT * FROM observations", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/api/observations", (req, res) => {
  const { date, location, details } = req.body;

  if (!date || !location || !details) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.run();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
