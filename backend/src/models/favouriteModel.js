const db = require('../config/db');

function addFavourite(sessionId, movieId) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO favourites (session_id, movie_id) VALUES (?, ?)`,
            [sessionId, movieId],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) return reject({ code: 'DUPLICATE' });
                    return reject(err);
                }
                resolve(this.lastID);
            }
        );
    });
}

function removeFavourite(sessionId, movieId) {
    return new Promise((resolve, reject) => {
        db.run(
            `DELETE FROM favourites WHERE session_id = ? AND movie_id = ?`,
            [sessionId, movieId],
            function (err) {
                if (err) return reject(err);
                resolve(this.changes);
            }
        );
    });
}

function getFavourites(sessionId) {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT movies.* FROM favourites JOIN movies ON favourites.movie_id = movies.id WHERE favourites.session_id = ?`,
            [sessionId],
            (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            }
        );
    });
}

module.exports = { addFavourite, removeFavourite, getFavourites };