const { fetchMoonData } = require("./moonAPI");
const express = require("express");
const db = require("./database");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/api/moon-data", async (req, res) => {
  try {
    const { date, location } = req.query;

    if (!date || !location) {
      return res.status(400).json({ error: "Date and location are required" });
    }
    const moonData = await fetchMoonData(date, location);
    res.json(moonData);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: error.message });
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
