const mongoose = require('../config/db');

const genreSchema = new mongoose.Schema({
    id: { type: Number },
    tmdb_genre_id: { type: Number, required: true, unique: true },
    name: { type: String, required: true }
}, { timestamps: true });

const Genre = mongoose.models.Genre || mongoose.model('Genre', genreSchema);

async function syncGenres(genres) {
    if (!Array.isArray(genres)) return;
    for (const g of genres) {
        const numId = Number(g.id);
        await Genre.updateOne(
            { tmdb_genre_id: numId },
            { $setOnInsert: { id: numId, tmdb_genre_id: numId, name: g.name } },
            { upsert: true }
        );
    }
}

async function getAllGenres() {
    const docs = await Genre.find({}).sort({ id: 1 }).lean();
    return docs.map(d => ({
        id: d.id || d.tmdb_genre_id,
        name: d.name,
        tmdb_genre_id: d.tmdb_genre_id
    }));
}

async function getGenreById(id) {
    const numId = Number(id);
    const query = isNaN(numId) ? { _id: id } : { $or: [{ id: numId }, { tmdb_genre_id: numId }] };
    const doc = await Genre.findOne(query).lean();
    if (!doc) return null;
    return {
        id: doc.id || doc.tmdb_genre_id,
        tmdb_genre_id: doc.tmdb_genre_id,
        name: doc.name
    };
}

module.exports = { syncGenres, getAllGenres, getGenreById };