const express = require('express');
const {
  getProperties,
  getFeaturedProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/featured', getFeaturedProperties);

router
  .route('/')
  .get(getProperties)
  .post(protect, authorize('landlord', 'admin'), createProperty);

router
  .route('/:id')
  .get(getPropertyById)
  .put(protect, authorize('landlord', 'admin'), updateProperty)
  .delete(protect, authorize('landlord', 'admin'), deleteProperty);

module.exports = router;
