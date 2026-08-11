const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../../database.db'), (err) => {
    if (err) console.error('DB connection failed:', err.message);
    else console.log('Connected to SQLite database');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tmdb_id INTEGER UNIQUE,
    title TEXT,
    type TEXT,
    poster_url TEXT,
    backdrop_url TEXT,
    description TEXT,
    release_date TEXT,
    rating REAL
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tmdb_genre_id INTEGER UNIQUE,
    name TEXT
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS movie_genres (
    movie_id INTEGER,
    genre_id INTEGER
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS favourites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    movie_id INTEGER,
    UNIQUE(session_id, movie_id)
  )`);
});

module.exports = db;