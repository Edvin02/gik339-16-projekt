DROP TABLE IF EXISTS cars;
CREATE TABLE IF NOT EXISTS cars (
     id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
     brand VARCHAR(15) NOT NULL,
     year VARCHAR(4) NOT NULL,
     regnr VARCHAR(6) NOT NULL,
     color VARCHAR(10) NOT NULL
);

INSERT INTO cars (id, brand, year, regnr, color) VALUES (1, 'Ferarri', 2020, 'ABC123', 'red');
INSERT INTO cars (id, brand, year, regnr, color) VALUES (2, 'Volvo', 2015, 'AHL876', 'black');
INSERT INTO cars (id, brand, year, regnr, color) VALUES (3, 'Tesla', 2021, 'XYZ123', 'blue');

select * from cars;