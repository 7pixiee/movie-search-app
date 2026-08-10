const axios = require('axios');
require('dotenv').config();


const tmdbAxios = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
        api_key: process.env.TMDB_API_KEY,
        language: 'en-US'
    }
})

module.exports = tmdbAxios;