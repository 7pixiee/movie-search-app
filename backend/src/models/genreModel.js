const db = require('../config/db');

function syncGenres(genres) {
    genres.forEach(g => {
        db.run(
            `INSERT OR IGNORE INTO genres (tmdb_genre_id, name) VALUES (?, ?)`, [g.id, g.name],

        );
    });
}


function getAllGenres() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT id, name FROM genres ORDER BY id`, [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

function getGenreById(id) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM genres WHERE id = ?`, [id], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

module.exports = { syncGenres, getAllGenres, getGenreById };