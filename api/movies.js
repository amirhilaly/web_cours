const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

// CORS pour autoriser GitHub Pages
app.use(cors({
    origin: ['https://amirhilaly.github.io/web/', 'http://localhost:8080'],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Test si le backend fonctionne
app.get('/home', (req, res) => {
    res.status(200).json('Welcome, your app is working well');
});

// Connexion à la base SQLite
const db = new sqlite3.Database(path.join(__dirname, 'movies.db'));

// Récupération des films
app.get('/api/movies', (req, res) => {
    const { origine, categorie, noteMin, noteMax } = req.query;
    let sql = 'SELECT * FROM movies WHERE 1=1';
    let params = [];

    if (origine && origine !== 'all') {
        sql += ' AND origine = ?';
        params.push(origine);
    }
    if (categorie && categorie !== 'standard') {
        sql += ' AND categorie = ?';
        params.push(categorie);
    }
    if (noteMin) {
        sql += ' AND note >= ?';
        params.push(parseFloat(noteMin));
    }
    if (noteMax) {
        sql += ' AND note <= ?';
        params.push(parseFloat(noteMax));
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Ajout d'un film
app.post('/api/movies', (req, res) => {
    const { nom, realisateur, compagnie, dateDeSortie, note, notePublic, description, lienImage, origine, categorie } = req.body;
    const sql = `INSERT INTO movies (nom, realisateur, compagnie, dateDeSortie, note, notePublic, description, lienImage, origine, categorie)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [nom, realisateur, compagnie, dateDeSortie, note, notePublic, description, lienImage, origine, categorie];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, id: this.lastID });
    });
});

// Suppression d'un film
app.delete('/api/movies', (req, res) => {
    const id = req.query.id;
    db.run("DELETE FROM movies WHERE id = ?", [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true });
    });
});

// Mise à jour d'un film
app.put('/api/movies', (req, res) => {
    const id = req.query.id;
    const { nom, realisateur, compagnie, dateDeSortie, note, notePublic, description, lienImage, origine, categorie } = req.body;

    const sql = `UPDATE movies 
                 SET nom = ?, realisateur = ?, compagnie = ?, dateDeSortie = ?, note = ?, 
                     notePublic = ?, description = ?, lienImage = ?, origine = ?, categorie = ?
                 WHERE id = ?`;
    const params = [nom, realisateur, compagnie, dateDeSortie, note, notePublic, description, lienImage, origine, categorie, id];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true });
    });
});

// ⚡ Lancer le serveur Express sur Vercel
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
