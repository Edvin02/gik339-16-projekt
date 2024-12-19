// Importerar Express-biblioteket för att skapa en webbtjänst
const express = require("express");

// Skapar en instans av Express-servern
const server = express();

// Importerar SQLite3-biblioteket med "verbose" för att få mer detaljerade felmeddelanden
const sqlite3 = require("sqlite3").verbose();

// Middleware för att hantera JSON-data från klienten
server
  .use(express.json())

  // Middleware för att hantera URL-enkodad data från formulär (extended: false innebär att enklare objekt stöds)
  .use(express.urlencoded({ extended: false }))

  // Middleware för att ställa in CORS (Cross-Origin Resource Sharing)-header
  .use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Tillåter alla domäner att göra förfrågningar
    res.header("Access-Control-Allow-Headers", "*"); // Tillåter alla typer av headers
    res.header("Access-Control-Allow-Methods", "*"); // Tillåter alla HTTP-metoder (GET, POST, etc.)

    next(); // Går vidare till nästa middleware eller route-handler
  });

// GET-route för att hämta alla användare från databasen
server.get("/cars", (req, res) => {
  // Öppnar en anslutning till SQLite-databasen
  const db = new sqlite3.Database("./cars.db");

  // SQL-fråga för att hämta alla rader från tabellen "users"
  const sql = "SELECT * FROM cars";

  // Kör SQL-frågan och returnerar alla rader
  db.all(sql, (err, rows) => {
    if (err) {
      return res
        .status(500)
        .send({ error: "Database error", details: err.message });
    }
    res.send(rows);
  });

  // Stänger anslutningen till databasen
  db.close();
});

// Startar servern och lyssnar på port 3000
server.listen(3000, () =>
  console.log("Running server on http://localhost:3000")
);