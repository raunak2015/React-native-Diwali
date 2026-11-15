const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide property title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide property description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    propertyType: {
      type: String,
      required: [true, 'Please specify property type'],
      enum: ['apartment', 'house', 'villa', 'studio', 'pg'],
      default: 'apartment',
    },
    price: {
      type: Number,
      required: [true, 'Please specify monthly rent price'],
      min: [0, 'Price must be greater than zero'],
    },
    deposit: {
      type: Number,
      default: 0,
    },
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      state: {
        type: String,
        default: 'Maharashtra',
      },
      zipCode: {
        type: String,
        default: '',
      },
      coordinates: {
        lat: { type: Number, default: 19.076 },
        lng: { type: Number, default: 72.8777 },
      },
    },
    bedrooms: {
      type: Number,
      required: [true, 'Number of bedrooms is required'],
      default: 1,
    },
    bathrooms: {
      type: Number,
      required: [true, 'Number of bathrooms is required'],
      default: 1,
    },
    areaSqFt: {
      type: Number,
      required: [true, 'Square footage is required'],
    },
    furnishing: {
      type: String,
      enum: ['unfurnished', 'semi-furnished', 'fully-furnished'],
      default: 'semi-furnished',
    },
    amenities: [
      {
        type: String,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

propertySchema.index({ 'location.city': 1, propertyType: 1, price: 1 });

module.exports = mongoose.model('Property', propertySchema);
