const db = require('../config/db');

function saveMovie(movie) {
    return new Promise((resolve, reject) => {
        db.get(`select id from movies where tmdb_id = ?`, [movie.tmdb_id], (err, row) => {
            if (err) return reject(err);
            if (row) return resolve(row.id);

            db.run(
                `insert into movies (tmb_id, title, type, poster_url, backdrop_url, description, release_date, rating)
                values (?, ?, ?, ?, ?, ?, ?, ?)`,
                [movie.tmdb_id, movie.title, movie.type, movie.poster_url, movie.backdrop_url,
                movie.description, movie.release_date, movie.rating],
                function (err) {
                    if (err) return reject(err);
                    else return resolve(this.lastID);
                }
            );
        });
    });
};

function getMovieById(id) {
    return new Promise((resolve, reject) => {
        db.get(`select * from movies where id = ?`, [id], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
};


module.exports = { saveMovie, getMovieById };