const express = require('express');
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  getOwnerProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route: Get all properties
router.get('/', getProperties);

// Owner & Renter listing route: Get owner's own listings
router.get('/my-properties', protect, getOwnerProperties);

// Public route: Get single property details
router.get('/:id', getPropertyById);

// Authenticated route: Create new property
router.post('/', protect, createProperty);

// Authenticated route: Update & Delete property (ownership validated in controller)
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

module.exports = router;
