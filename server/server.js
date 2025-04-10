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
  const { date, visibility, phase, rating, notes } = req.body;

  db.run(
    `INSERT INTO observations (date, visibility, moon_phase, rating, notes) 
     VALUES (?, ?, ?, ?, ?)`,
    [date, visibility === "true", phase, rating, notes],
    function (err) {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({
        message: "Observation added successfully",
        id: this.lastID,
      });
    }
  );
});

app.delete("/api/observations/:id", (req, res) => {
  const id = req.params.id;

  db.run(`DELETE FROM observations WHERE id = ?`, id, function (err) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Observation not found" });
    }
    res.json({ message: "Observation deleted successfully" });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
