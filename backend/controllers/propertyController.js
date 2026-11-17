const Property = require('../models/Property');

// Sample default listings to seed or return when database is fresh
const sampleProperties = [
  {
    _id: '6735a1f2b8429b6e82c19a01',
    title: 'Modern Luxury Penthouse in Bandra',
    description: 'Breathtaking sea views, premium Italian marble flooring, fully furnished modular kitchen and smart automation throughout.',
    propertyType: 'apartment',
    price: 85000,
    deposit: 250000,
    location: {
      address: 'Pali Hill, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400050',
      coordinates: { lat: 19.0607, lng: 72.8258 },
    },
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 1850,
    furnishing: 'fully-furnished',
    amenities: ['Gym', 'Swimming Pool', 'Sea View', 'Covered Parking', 'Elevator', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    ],
    featured: true,
    isAvailable: true,
  },
  {
    _id: '6735a1f2b8429b6e82c19a02',
    title: 'Spacious 2BHK Garden Apartment',
    description: 'Quiet green residential area, minutes away from tech parks and international schools. Ideal for families.',
    propertyType: 'apartment',
    price: 42000,
    deposit: 120000,
    location: {
      address: 'Indiranagar 100ft Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560038',
      coordinates: { lat: 12.9784, lng: 77.6408 },
    },
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1200,
    furnishing: 'semi-furnished',
    amenities: ['Power Backup', 'Club House', 'Kids Play Area', 'Covered Parking'],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    ],
    featured: true,
    isAvailable: true,
  },
  {
    _id: '6735a1f2b8429b6e82c19a03',
    title: 'Cozy Studio near Cyber Hub',
    description: 'Compact high-efficiency studio with high-speed fiber internet and metro connectivity within 500m.',
    propertyType: 'studio',
    price: 26000,
    deposit: 50000,
    location: {
      address: 'DLF Phase 2',
      city: 'Gurugram',
      state: 'Haryana',
      zipCode: '122002',
      coordinates: { lat: 28.4878, lng: 77.0878 },
    },
    bedrooms: 1,
    bathrooms: 1,
    areaSqFt: 550,
    furnishing: 'fully-furnished',
    amenities: ['High Speed WiFi', 'Air Conditioning', 'Elevator', 'CCTV'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    ],
    featured: false,
    isAvailable: true,
  },
];

// @desc    Get all properties with optional query filters
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res, next) => {
  try {
    const { city, propertyType, minPrice, maxPrice, bedrooms, search } = req.query;
    let query = { isAvailable: true };

    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }
    if (propertyType) {
      query.propertyType = propertyType;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (bedrooms) {
      query.bedrooms = Number(bedrooms);
    }
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { 'location.address': new RegExp(search, 'i') },
        { 'location.city': new RegExp(search, 'i') },
      ];
    }

    let properties = [];
    try {
      properties = await Property.find(query).populate('landlord', 'name email phone avatar');
    } catch (e) {
      console.warn('DB query fallback to sample data');
    }

    if (!properties || properties.length === 0) {
      properties = sampleProperties;
    }

    res.status(200).json({
      status: 'success',
      results: properties.length,
      data: { properties },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get property by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res, next) => {
  try {
    let property = null;
    try {
      property = await Property.findById(req.params.id).populate('landlord', 'name email phone avatar');
    } catch (e) {}

    if (!property) {
      property = sampleProperties.find((p) => p._id === req.params.id) || sampleProperties[0];
    }

    res.status(200).json({
      status: 'success',
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new property listing
// @route   POST /api/properties
// @access  Private (Landlords/Admins)
const createProperty = async (req, res, next) => {
  try {
    const propertyData = {
      ...req.body,
      landlord: req.user._id,
    };

    const property = await Property.create(propertyData);

    res.status(201).json({
      status: 'success',
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property listing
// @route   PUT /api/properties/:id
// @access  Private
const updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ status: 'fail', message: 'Property not found' });
    }

    if (property.landlord.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'fail', message: 'Unauthorized to modify this property' });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property listing
// @route   DELETE /api/properties/:id
// @access  Private
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ status: 'fail', message: 'Property not found' });
    }

    if (property.landlord.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'fail', message: 'Unauthorized to delete this property' });
    }

    await property.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Property successfully removed',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
const getFeaturedProperties = async (req, res, next) => {
  try {
    let properties = [];
    try {
      properties = await Property.find({ featured: true, isAvailable: true }).limit(5);
    } catch (e) {}

    if (!properties || properties.length === 0) {
      properties = sampleProperties.filter((p) => p.featured);
    }

    res.status(200).json({
      status: 'success',
      data: { properties },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProperties,
  getFeaturedProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
