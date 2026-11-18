const Favorite = require('../models/Favorite');

// @desc    Get logged in user favorites
// @route   GET /api/favorites
// @access  Private
const getMyFavorites = async (req, res, next) => {
  try {
    let favorites = [];
    try {
      favorites = await Favorite.find({ user: req.user._id }).populate('property');
    } catch (e) {}

    res.status(200).json({
      status: 'success',
      results: favorites.length,
      data: { favorites },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle property favorite
// @route   POST /api/favorites/:propertyId
// @access  Private
const toggleFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const existing = await Favorite.findOne({
      user: req.user._id,
      property: propertyId,
    });

    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({
        status: 'success',
        message: 'Removed from favorites',
        isFavorite: false,
      });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      property: propertyId,
    });

    res.status(201).json({
      status: 'success',
      message: 'Added to favorites',
      isFavorite: true,
      data: { favorite },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyFavorites,
  toggleFavorite,
};
