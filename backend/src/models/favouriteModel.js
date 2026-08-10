const db = require('../config/db');

function addFavourite(sessionId, movieId) {
    return new Promise((resolve, reject) => {
        db.run(
            `insert into favourites (session_id, move_id) values (?, ?)`,
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

function removeFavourite(sessionId, movieID) {
    return new Promise((resolve, reject) => {
        db.run(
            `delete from favourites where session_id = ? and movie_id = ?`,
            [sessionId, movieId],
            function (err) {
                if (err) return reject(err);
                resolve(this.changes);
            }
        );
    });
}

function getFavourite(sessionId) {
    return new Promise((resolve, reject) => {
        db.run(
            `select * from favourites join movies on favourites.movie_id = movies.id where favourites.session_id = ?`,
            [sessionId],
            (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            }
        );
    });
}

module.exports = { addFavourite, removeFavourite, getFavourites };