const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite'); // Pour ouvrir SQLite async
const path = require('path');

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Fonction pour ouvrir la base SQLite
async function openDb() {
    return open({
        filename: path.join(__dirname, '../../movies.db'), // ⚠️ Vérifie le bon chemin
        driver: sqlite3.Database
    });
}

// Test API
app.get('/api', (req, res) => {
    res.json({ message: 'Hello depuis Vercel Serverless !' });
});

// GET Movies (avec filtres)
app.get('/api/movies', async (req, res) => {
    const db = await openDb();
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

    try {
        const movies = await db.all(sql, params);
        res.json(movies);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// PUT (Update Movie)
app.put('/api/movies/:id', async (req, res) => {
    const db = await openDb();
    const { id } = req.params;
    const { nom, realisateur, compagnie, dateDeSortie, note, notePublic, description, lienImage, origine } = req.body;

    const sql = `UPDATE movies 
                 SET nom = ?, realisateur = ?, compagnie = ?, dateDeSortie = ?, note = ?, notePublic = ?, description = ?, lienImage = ?, origine = ?
                 WHERE id = ?`;
    const params = [nom, realisateur, compagnie, dateDeSortie, note, notePublic, description, lienImage, origine, id];

    try {
        await db.run(sql, params);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST (Add Movie)
app.post('/api/movies', async (req, res) => {
    const db = await openDb();
    const { nom, realisateur, compagnie, dateDeSortie, note, notePublic, description, lienImage, origine, categorie } = req.body;
    
    const sql = `INSERT INTO movies (nom, realisateur, compagnie, dateDeSortie, note, notePublic, description, lienImage, origine, categorie)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [nom, realisateur, compagnie, dateDeSortie, note, notePublic, description, lienImage, origine, categorie];

    try {
        const result = await db.run(sql, params);
        res.json({ success: true, id: result.lastID });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// DELETE (Remove Movie)
app.delete('/api/movies/:id', async (req, res) => {
    const db = await openDb();
    const { id } = req.params;

    console.log("Tentative de suppression de l'ID :", id);

    try {
        await db.run("DELETE FROM movies WHERE id = ?", [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Exporter l'API pour Vercel
module.exports = app;
