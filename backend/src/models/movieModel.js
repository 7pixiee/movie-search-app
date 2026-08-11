const db = require('../config/db');

function saveMovie(movie) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT id FROM movies WHERE tmdb_id = ?`, [movie.tmdb_id], (err, row) => {
            if (err) return reject(err);
            if (row) return resolve(row.id);

            db.run(
                `INSERT INTO movies (tmdb_id, title, type, poster_url, backdrop_url, description, release_date, rating)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [movie.tmdb_id, movie.title, movie.type, movie.poster_url, movie.backdrop_url,
                movie.description, movie.release_date, movie.rating],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                }
            );
        });
    });
}

function getMovieById(id) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM movies WHERE id = ?`, [id], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

module.exports = { saveMovie, getMovieById };