const tmdbService = require('../services/tmdbService');
const movieModel = require('../models/movieModel');

async function popular(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const result = await tmdbService.fetchPopular(page);
        for (const movie of result.results) await movieModel.saveMovie(movie);
        res.json({ success: true, page: result.page, total_pages: result.total_pages, total_results: result.total_results, data: result.results });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch popular movies' });
    }
};

async function latest(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const result = await tmdbService.fetchLatest(page);
        for (const movie of result.results) await movieModel.saveMovie(movie);
        res.json({ success: true, page: result.page, total_pages: result.total_pages, total_results: result.total_results, data: result.results });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch latest movies' });
    }
};

async function search(req, res) {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ success: false, message: 'Query parameter is required' });
        const page = parseInt(req.query.page) || 1;
        const result = await tmdbService.searchMovies(query, page);
        for (const movie of result.results) await movieModel.saveMovie(movie);
        res.json({ success: true, query, page: result.page, total_pages: result.total_pages, total_results: result.total_results, data: result.results });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Search failed' });
    }
};

async function details(req, res) {
    try {
        const localId = req.params.id;
        const localMovie = await movieModel.getMovieById(localId);
        if (!localMovie) return res.status(404).json({ success: false, message: 'Movie not found' });
        const full = await tmdbService.fetchMovieDetails(localMovie.tmdb_id);
        res.json({ success: true, data: { id: localMovie.id, ...full } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch movie details' });
    }
};

module.exports = { popular, latest, search, details };
