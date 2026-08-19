const favouriteModel = require('../models/favouriteModel');

function requireSessionId(req, res) {
    const sessionId = req.headers['x-session-id'];
    if (!sessionId) {
        res.status(400).json({ success: false, message: 'X-Session-Id header is required' });
        return null;
    }
    return sessionId;
}

async function list(req, res) {
    const sessionId = requireSessionId(req, res);
    if (!sessionId) return;
    try {
        const rows = await favouriteModel.getFavourites(sessionId);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch favourites' });
    }
}

async function add(req, res) {
    const sessionId = requireSessionId(req, res);
    if (!sessionId) return;
    try {
        await favouriteModel.addFavourite(sessionId, req.params.movieId);
        res.status(201).json({ success: true, message: 'Added to favourites' });
    } catch (err) {
        if (err.code === 'DUPLICATE') return res.status(409).json({ success: false, message: 'Already in favourites' });
        res.status(500).json({ success: false, message: 'Failed to add favourite' });
    }
}

async function remove(req, res) {
    const sessionId = requireSessionId(req, res);
    if (!sessionId) return;
    try {
        const changes = await favouriteModel.removeFavourite(sessionId, req.params.movieId);
        if (changes === 0) return res.status(404).json({ success: false, message: 'Favourite not found' });
        res.json({ success: true, message: 'Removed from favourites' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to remove favourite' });
    }
}

module.exports = { list, add, remove };