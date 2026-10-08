const mongoose = require('../config/db');
const { Movie } = require('./movieModel');

const favouriteSchema = new mongoose.Schema({
    session_id: { type: String, required: true },
    movie_id: { type: Number, required: true }
}, { timestamps: true });

favouriteSchema.index({ session_id: 1, movie_id: 1 }, { unique: true });

const Favourite = mongoose.models.Favourite || mongoose.model('Favourite', favouriteSchema);

async function addFavourite(sessionId, movieId) {
    const numMovieId = Number(movieId);
    const strSessionId = String(sessionId);

    try {
        const existing = await Favourite.findOne({ session_id: strSessionId, movie_id: numMovieId }).lean();
        if (existing) {
            const err = new Error('Duplicate favourite');
            err.code = 'DUPLICATE';
            throw err;
        }

        const created = await Favourite.create({
            session_id: strSessionId,
            movie_id: numMovieId
        });
        return created._id;
    } catch (err) {
        if (err.code === 11000 || err.code === 'DUPLICATE') {
            const customErr = new Error('Duplicate favourite');
            customErr.code = 'DUPLICATE';
            throw customErr;
        }
        throw err;
    }
}

async function removeFavourite(sessionId, movieId) {
    const result = await Favourite.deleteOne({
        session_id: String(sessionId),
        movie_id: Number(movieId)
    });
    return result.deletedCount;
}

async function getFavourites(sessionId) {
    const favs = await Favourite.find({ session_id: String(sessionId) }).lean();
    if (!favs || favs.length === 0) return [];

    const movieIds = favs.map(f => f.movie_id);
    const movies = await Movie.find({ tmdb_id: { $in: movieIds } }).lean();

    return movies.map(m => ({
        id: m.id || m.tmdb_id,
        tmdb_id: m.tmdb_id,
        title: m.title,
        type: m.type,
        poster_url: m.poster_url,
        backdrop_url: m.backdrop_url,
        description: m.description,
        release_date: m.release_date,
        rating: m.rating
    }));
}

module.exports = { addFavourite, removeFavourite, getFavourites };