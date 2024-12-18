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

cursor.execute('INSERT INTO cars (id, brand, year, regnr, color) VALUES (?, ?, ?, ?, ?)', (1, 'Ferarri', 2020, 'ABC123', 'red'))

connection.commit()
connection.close()
print('Database created and sample data inserted')
