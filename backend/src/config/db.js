const sqlite3 = require('sqlite3').verbose;
const path = require(path);

const db = new sqlite3.Database(path.json(__dirname, '../..database.db'), (err) => {
    if (err) console.error("DB connection failed: ", err.message);
    else console.log("Connected to SQLITE database");
});

db.serialize(() => {
    db.run(`create table if not exits movies (
        id integer primary key autoincrement,
        tmdb_id integer unique,
        title text,
        type text,
        poster_url text,
        backdrop_url text,
        description text,
        release_date text,
        rating real)`
    );

    db.run(`create table if not exits genres(
        id integer primary key auto increment,
        tmdb_genre_id integer unique,
        name text)`
    );

    db.run(`create table if not exits movie_genres(
        movie_id integer,
        genre_id integer)`
    );

    db.run(`create table if not exits favourites(
        id integer primary key autoincrement,
        session_id text,
        movie_id integer,
        unique(session_id, movie_id))`
    );
});

module.exports = db;