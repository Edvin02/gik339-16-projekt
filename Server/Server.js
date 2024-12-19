const express = require("express");

const server = express();

const sqlite3 = require("sqlite3").verbose();

server
  .use(express.json())

  .use(express.urlencoded({ extended: false }))

  .use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");

    next();
  });

server.get("/cars", (req, res) => {
  const db = new sqlite3.Database("./cars.db");

  const sql = "SELECT * FROM cars";

  db.all(sql, (err, rows) => {
    if (err) {
      return res
        .status(500)
        .send({ error: "Database error", details: err.message });
    }
    res.send(rows);
  });

  db.close();
});

//put
server.put('/cars/:id', (req, res) => {
  const db = new sqlite3.Database("./cars.db");
  const { brand, year, regnr, color } = req.body;
  const { id } = req.params;

  const sql = "UPDATE cars SET brand = ?, year = ?, regnr = ?, color = ? WHERE id = ?";

  db.run(sql, [brand, year, regnr, color, id], function (err) {
    if (err) {
      db.close();
      return res
        .status(500)
        .send({ error: "Database error", details: err.message });
    }
    
    db.close();
    res.send({ 
      message: "Car updated successfully",
      updatedCar: { id, brand, year, regnr, color }
    });
  });
});
//post
server.post("/cars", (req, res) => {
  const db = new sqlite3.Database("./cars.db");

  const { brand, year, regnr, color } = req.body;

  if (!brand || !year || !regnr || !color) {
    return res.status(400).send({ error: "Alla fält måste fyllas" });
  }

  const sql =
    "INSERT INTO cars (brand, year, regnr, color) VALUES (?, ?, ?, ?)";

  db.run(sql, [brand, year, regnr, color], function (err) {
    if (err) {
      return res
        .status(500)
        .send({ error: "Database error", details: err.message });
    }

    res.status(201).send({
      message: "Woohoo bilen har lagts till!",
      car: { id: this.lastID, brand, year, regnr, color },
    });
  });

  db.close();
});

server.listen(3000, () =>
  console.log("Running server on http://localhost:3000")
);
