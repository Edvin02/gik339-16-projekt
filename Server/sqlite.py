import sqlite3

connection = sqlite3.connect('cars.db')
cursor = connection.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS cars (
     id INTEGER PRIMARY KEY,
     brand TEXT NOT NULL,
     year INTEGER NOT NULL,
     regnr TEXT NOT NULL,
     color TEXT
)
''')

cursor.execute('INSERT INTO cars (brand, year, regnr, color) VALUES (?, ?, ?, ?)', ('Ferarri', 2020, 'ABC123', 'red'))
cursor.execute('INSERT INTO cars (brand, year, regnr, color) VALUES (?, ?, ?, ?)', ('Volvo', 2015, 'AHL876', 'black'))
cursor.execute('INSERT INTO cars (brand, year, regnr, color) VALUES (?, ?, ?, ?)', ('Tesla', 2021, 'XYZ123', 'white'))


connection.commit()
connection.close()
print('Database created and sample data inserted')
