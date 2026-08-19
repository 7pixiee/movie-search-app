const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const movieRoutes = require('./routes/movieRoutes');
const genreRoutes = require('./routes/genreRoutes');
const favouriteRoutes = require('./routes/favouriteRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/movies', movieRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/favourites', favouriteRoutes);

app.get('/', (req, res) => res.send('🎬 Movie App Backend Running'));

app.use(errorHandler);

module.exports = app;