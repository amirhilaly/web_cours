const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 8080;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

const db = new sqlite3.Database('./movies.db');

app.get('/movies', (req, res) => {
    db.all("SELECT * FROM movies", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/movies', (req, res) => {
    const { nom, realisateur, compagnie, dateDeSortie, note, notePublic, description, lienImage, origine } = req.body;
    const sql = `INSERT INTO movies (nom, realisateur, compagnie, dateDeSortie, note, notePublic, description, lienImage, origine) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [nom, realisateur, compagnie, dateDeSortie, note, notePublic, description, lienImage, origine];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(500).json({ success: false, error: err.message });
            return;
        }
        res.json({ success: true, id: this.lastID });
    });
});


app.delete('/movies/:id', (req, res) => {
    const movieId = req.params.id;

    console.log("OOOHHH EHHH Y'A UN TRUK LA!!!!!!!!");

    db.run("DELETE FROM movies WHERE id = ?", [movieId], function (err) {
        if (err) {
            res.status(500).json({ success: false, error: err.message });
            return;
        }
        res.json({ success: true });
    });
});


app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
