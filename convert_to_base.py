import json
import sqlite3

# Load the JSON file
try:
    with open("movies.json", "r", encoding="utf-8") as file:
        movies = json.load(file)
    print(f"Loaded {len(movies)} movies from JSON file.")  # Debug: Print number of movies
except Exception as e:
    print("Error loading movies.json:", e)
    exit()

# Connect to the SQLite database
conn = sqlite3.connect("movies.db")
cursor = conn.cursor()

# Create the table
cursor.execute("""
CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT,
    dateDeSortie TEXT,
    realisateur TEXT,
    note INT,
    notePublic INT,
    compagnie TEXT,
    origine TEXT,
    description TEXT,
    lienImage TEXT,
    categorie TEXT
)
""")
print("Table 'movies' created or already exists.")  # Debug: Confirm table creation

# Insert data
for movie in movies:
    note = movie.get("note")
    if note > 4.2:
        categorie = "classique"
    elif note < 3:
        categorie = "navet"
    else:
        categorie = "standard"

    cursor.execute("""
    INSERT INTO movies (nom, dateDeSortie, realisateur, note, notePublic, compagnie, origine, description, lienImage, categorie)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        movie.get("nom"),
        movie.get("dateDeSortie"),
        movie.get("realisateur"),
        note,
        movie.get("notePublic"),
        movie.get("compagnie"),
        movie.get("origine"),
        movie.get("description"),
        movie.get("lienImage"),
        categorie
    ))
    print(f"Inserted movie: {movie.get('nom')}")  # Debug: Print each inserted movie

# Commit and close
conn.commit()
conn.close()
print("Database populated successfully!")  # Debug: Confirm completion