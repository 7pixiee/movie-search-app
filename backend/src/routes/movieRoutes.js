const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/popular', movieController.popular);
router.get('/latest', movieController.latest);
router.get('/featured', movieController.popular);
router.get('/search', movieController.search);
router.get('/:id', movieController.details);

module.exports = router;