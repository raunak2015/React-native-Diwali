const express = require('express');
const { getMyFavorites, toggleFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getMyFavorites);
router.post('/:propertyId', toggleFavorite);

module.exports = router;
