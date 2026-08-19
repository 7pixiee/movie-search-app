const express = require('express');
const router = express.Router();
const favouriteController = require('../controllers/favouriteController');

router.get('/', favouriteController.list);
router.post('/:movieId', favouriteController.add);
router.delete('/:movieId', favouriteController.remove);

module.exports = router;