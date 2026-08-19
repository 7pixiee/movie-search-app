const tmdbService = require('../services/tmdbService');
const movieModel = require('../models/movieModel');
const genreModel = require('../models/genreModel');

async function list(req, res) {
    try {
        const genres = await tmdbService.fetchGenreList();
        genreModel.syncGenres(genres);
        const rows = await genreModel.getAllGenres();
        res.json({ success: true, count: rows.length, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch genres' });
    }
}

async function moviesByGenre(req, res) {
    try {
        const localGenreId = req.params.id;
        const genre = await genreModel.getGenreById(localGenreId);
        if (!genre) return res.status(404).json({ success: false, message: 'Genre not found' });

        const page = parseInt(req.query.page) || 1;
        const result = await tmdbService.fetchByGenre(genre.tmdb_genre_id, page);
        for (const movie of result.results) await movieModel.saveMovie(movie);

        res.json({
            success: true,
            genre: { id: genre.id, name: genre.name },
            page: result.page,
            total_pages: result.total_pages,
            total_results: result.total_results,
            data: result.results
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch movies by genre' });
    }
}

module.exports = { list, moviesByGenre };