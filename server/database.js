const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "lunar_database.db");

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, "");
}

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS observations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE,
      location TEXT NOT NULL,
      moon_phase TEXT,
      visibility BOOLEAN DEAFAULT TRUE,
      rating NUMERIC,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  );
});

module.exports = db;
