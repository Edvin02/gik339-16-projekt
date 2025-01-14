// Edvin

// Importerar Express, ett ramverk för att skapa en webbaserad server
const express = require("express");

// Importerar SQLite3 för att hantera databasen
const sqlite3 = require("sqlite3").verbose();

// Skapar en Express-server
const server = express();

// Middleware för att hantera JSON-data, URL-kodade formulär och CORS
server
  .use(express.json()) // Tillåter servern att tolka inkommande JSON-data
  .use(express.urlencoded({ extended: false })) // Tillåter servern att tolka URL-kodade data (t.ex. formulär)
  .use((req, res, next) => {
    // Konfigurerar Cross-Origin Resource Sharing (CORS) för att möjliggöra åtkomst från andra domäner
    res.header("Access-Control-Allow-Origin", "*"); // Tillåt alla domäner att göra förfrågningar
    res.header("Access-Control-Allow-Headers", "*"); // Tillåt alla headers i förfrågningar
    res.header("Access-Control-Allow-Methods", "*"); // Tillåt alla HTTP-metoder (GET, POST, PUT, DELETE, etc.)
    next(); // Fortsätt till nästa middleware eller route
  });

// Route: Hämta alla bilar från databasen
server.get("/cars", (req, res) => {
  const db = new sqlite3.Database("./cars.db"); // Öppnar en anslutning till databasen
  const sql = "SELECT * FROM cars"; // SQL-fråga för att hämta alla bilar

  db.all(sql, (err, rows) => {
    if (err) {
      // Om ett fel uppstår vid körning av SQL-frågan
      return res
        .status(500)
        .send({ error: "Database error", details: err.message });
    }
    res.json(rows); // Returnerar alla bilar i JSON-format
  });

  db.close(); // Stänger anslutningen till databasen
});

// Route: Uppdatera en bil baserat på ID
server.put("/cars/:id", (req, res) => {
  const db = new sqlite3.Database("./cars.db"); // Öppnar en anslutning till databasen
  const { brand, year, regnr, color } = req.body; // Hämtar data från klientens förfrågan
  const { id } = req.params; // Hämtar bilens ID från URL-parametern

  const sql =
    "UPDATE cars SET brand = ?, year = ?, regnr = ?, color = ? WHERE id = ?"; // SQL-fråga för att uppdatera en bil

  db.run(sql, [brand, year, regnr, color, id], function (err) {
    if (err) {
      // Om ett fel uppstår vid körning av SQL-frågan
      db.close();
      return res
        .status(500)
        .send({ error: "Database error", details: err.message });
    }

    db.close(); // Stänger anslutningen till databasen
    res.json({
      message: "Bilen har uppdaterats med framgång",
      updatedCar: { id, brand, year, regnr, color }, // Returnerar den uppdaterade bilens detaljer
    });
  });
});

// Route: Hämta detaljer för en specifik bil baserat på ID
server.get("/cars/:id", (req, res) => {
  const db = new sqlite3.Database("./cars.db"); // Öppnar en anslutning till databasen
  const { id } = req.params; // Hämtar bilens ID från URL-parametern

  const sql = "SELECT * FROM cars WHERE id = ?"; // SQL-fråga för att hämta en specifik bil

  db.get(sql, [id], (err, row) => {
    if (err) {
      // Om ett fel uppstår vid körning av SQL-frågan
      db.close();
      return res
        .status(500)
        .send({ error: "Database error", details: err.message });
    }
    if (!row) {
      // Om ingen bil hittas med det angivna ID:t
      db.close();
      return res.status(404).send({ error: "Car not found" });
    }

    db.close(); // Stänger anslutningen till databasen
    res.json(row); // Returnerar bilens detaljer i JSON-format
  });
});

// Edvin slut----->>

// Elange---->>>>
// Route: Lägg till en ny bil
server.post("/cars", (req, res) => {
  const db = new sqlite3.Database("./cars.db"); // Öppnar en anslutning till SQLite-databasen
  const { brand, year, regnr, color } = req.body; // Hämtar bilens data från klientens förfrågan

  // Validering: Kontrollera att alla fält är ifyllda
  if (!brand || !year || !regnr || !color) {
    // Om något fält saknas, returnera ett felmeddelande med status 400 (Bad Request)
    return res.status(400).send({ error: "Alla fält måste fyllas i" });
  }

  // Kontrollera om en bil med samma registreringsnummer redan finns i databasen
  const checkSql = "SELECT COUNT(*) as count FROM cars WHERE regnr = ?";
  db.get(checkSql, [regnr], (err, row) => {
    if (err) {
      // Om ett databasfel inträffar, returnera ett felmeddelande med status 500 (Internal Server Error)
      db.close();
      return res
        .status(500)
        .send({ error: "Database error", details: err.message });
    }

    if (row.count > 0) {
      // Om det redan finns en bil med samma registreringsnummer, returnera ett felmeddelande med status 400
      db.close();
      return res
        .status(400)
        .send({ error: "En bil med samma registreringsnummer finns redan." });
    }

    // Lägg till den nya bilen i databasen om registreringsnumret är unikt
    const insertSql =
      "INSERT INTO cars (brand, year, regnr, color) VALUES (?, ?, ?, ?)";
    db.run(insertSql, [brand, year, regnr, color], function (err) {
      if (err) {
        // Om ett databasfel inträffar, returnera ett felmeddelande med status 500
        db.close();
        return res
          .status(500)
          .send({ error: "Database error", details: err.message });
      }

      // Om bilen läggs till framgångsrikt, returnera ett bekräftelsemeddelande och bilens detaljer
      res.status(201).json({
        message: "Woohoo bilen har lagts till!", // Framgångsmeddelande
        car: { id: this.lastID, brand, year, regnr, color }, // Returnerar den nya bilens data
      });

      db.close(); // Stänger anslutningen till databasen
    });
  });
});

// Route: Ta bort en bil baserat på ID
server.delete("/cars/:id", (req, res) => {
  const db = new sqlite3.Database("./cars.db"); // Öppnar en anslutning till SQLite-databasen
  const { id } = req.params; // Hämtar bilens ID från URL-parametern

  if (!id) {
    // Om inget ID tillhandahålls, returnera ett felmeddelande med status 400 (Bad Request)
    return res
      .status(400)
      .send({ error: "ID är obligatoriskt för att ta bort en resurs." });
  }

  // Kontrollera om bilen finns i databasen och hämta dess namn (märke)
  const selectSql = "SELECT brand FROM cars WHERE id = ?";
  db.get(selectSql, [id], (err, row) => {
    if (err) {
      // Om ett databasfel inträffar, returnera ett felmeddelande med status 500
      db.close();
      return res
        .status(500)
        .send({ error: "Database error", details: err.message });
    }

    if (!row) {
      // Om bilen med det angivna ID:t inte finns, returnera ett felmeddelande med status 404 (Not Found)
      db.close();
      return res
        .status(404)
        .send({ error: "Resurs med angivet ID hittades inte." });
    }

    const brand = row.brand; // Hämtar bilens märke för meddelandet

    // Ta bort bilen från databasen
    const deleteSql = "DELETE FROM cars WHERE id = ?";
    db.run(deleteSql, [id], function (err) {
      if (err) {
        // Om ett databasfel inträffar, returnera ett felmeddelande med status 500
        db.close();
        return res
          .status(500)
          .send({ error: "Database error", details: err.message });
      }

      db.close(); // Stänger anslutningen till databasen
      // Returnera ett meddelande om att bilen har tagits bort
      res.status(200).json({
        message: `Bilen '${brand}' har tagits bort.`,
      });
    });
  });
});
// Startar servern och lyssnar på port 3000
server.listen(3000, () => {
  console.log("Running server on http://localhost:3000");
});
