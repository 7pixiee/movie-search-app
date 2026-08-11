const tmdb = require('../config/tmdb');

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';

function formatMovie(m, genreMap = {}) {
    return {
        tmdb_id: m.id,
        title: m.title || m.name,
        type: m.title ? 'movie' : 'series',
        poster_url: m.poster_path ? IMG_BASE + m.poster_path : null,
        backdrop_url: m.backdrop_path ? BACKDROP_BASE + m.backdrop_path : null,
        description: m.overview,
        rating: m.vote_average,
        release_date: m.release_date || m.first_air_date || null,
        genres: (m.genre_ids || []).map(id => genreMap[id]).filter(Boolean)
    };
}

async function getGenreMap() {
    const res = await tmdb.get('/genre/movie/list');
    const map = {};
    res.data.genres.forEach(g => { map[g.id] = g.name; });
    return map;
}

async function fetchPopular(page = 1) {
    const genreMap = await getGenreMap();
    const res = await tmdb.get('/movie/popular', { params: { page } });
    return {
        page: res.data.page,
        total_pages: res.data.total_pages,
        total_results: res.data.total_results,
        results: res.data.results.map(m => formatMovie(m, genreMap))
    };
}

async function fetchLatest(page = 1) {
    const genreMap = await getGenreMap();
    const res = await tmdb.get('/discover/movie', { params: { page, sort_by: 'release_date.desc' } });
    return {
        page: res.data.page,
        total_pages: res.data.total_pages,
        total_results: res.data.total_results,
        results: res.data.results.map(m => formatMovie(m, genreMap))
    };
}

async function searchMovies(query, page = 1) {
    const genreMap = await getGenreMap();
    const res = await tmdb.get('/search/movie', { params: { query, page } });
    return {
        page: res.data.page,
        total_pages: res.data.total_pages,
        total_results: res.data.total_results,
        results: res.data.results.map(m => formatMovie(m, genreMap))
    };
}

async function fetchByGenre(tmdbGenreId, page = 1) {
    const genreMap = await getGenreMap();
    const res = await tmdb.get('/discover/movie', { params: { with_genres: tmdbGenreId, page } });
    return {
        page: res.data.page,
        total_pages: res.data.total_pages,
        total_results: res.data.total_results,
        results: res.data.results.map(m => formatMovie(m, genreMap))
    };
}

async function fetchGenreList() {
    const res = await tmdb.get('/genre/movie/list');
    return res.data.genres;
}

async function fetchMovieDetails(tmdbId) {
    const res = await tmdb.get(`/movie/${tmdbId}`);
    const genreMap = {};
    res.data.genres.forEach(g => { genreMap[g.id] = g.name; });
    return formatMovie({ ...res.data, genre_ids: res.data.genres.map(g => g.id) }, genreMap);
}

module.exports = { fetchPopular, fetchLatest, searchMovies, fetchByGenre, fetchGenreList, fetchMovieDetails };