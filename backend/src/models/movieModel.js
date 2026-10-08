const mongoose = require('../config/db');

const movieSchema = new mongoose.Schema({
    id: { type: Number },
    tmdb_id: { type: Number, required: true, unique: true },
    title: String,
    type: String,
    poster_url: String,
    backdrop_url: String,
    description: String,
    release_date: String,
    rating: Number
}, { timestamps: true });

const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);

async function saveMovie(movie) {
    try {
        const numTmdbId = Number(movie.tmdb_id);
        const existing = await Movie.findOne({ tmdb_id: numTmdbId }).lean();
        if (existing) {
            return existing.id || existing.tmdb_id;
        }

        const newMovie = await Movie.create({
            id: numTmdbId,
            tmdb_id: numTmdbId,
            title: movie.title,
            type: movie.type,
            poster_url: movie.poster_url,
            backdrop_url: movie.backdrop_url,
            description: movie.description,
            release_date: movie.release_date,
            rating: movie.rating
        });

        return newMovie.id || newMovie.tmdb_id;
    } catch (err) {
        if (err.code === 11000) {
            const existing = await Movie.findOne({ tmdb_id: Number(movie.tmdb_id) }).lean();
            return existing ? (existing.id || existing.tmdb_id) : Number(movie.tmdb_id);
        }
        throw err;
    }
}

async function getMovieById(id) {
    const numId = Number(id);
    const query = isNaN(numId) ? { _id: id } : { $or: [{ id: numId }, { tmdb_id: numId }] };
    const doc = await Movie.findOne(query).lean();
    if (!doc) return null;
    return {
        id: doc.id || doc.tmdb_id,
        tmdb_id: doc.tmdb_id,
        title: doc.title,
        type: doc.type,
        poster_url: doc.poster_url,
        backdrop_url: doc.backdrop_url,
        description: doc.description,
        release_date: doc.release_date,
        rating: doc.rating
    };
}

module.exports = { saveMovie, getMovieById, Movie };