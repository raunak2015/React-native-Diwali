const mongoose = require('mongoose');

const visitRequestSchema = new mongoose.Schema(
  {
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    visitDate: {
      type: Date,
      required: [true, 'Please select visit date'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Please select a preferred time slot'],
      enum: ['Morning (9am - 12pm)', 'Afternoon (12pm - 4pm)', 'Evening (4pm - 8pm)'],
      default: 'Evening (4pm - 8pm)',
    },
    notes: {
      type: String,
      maxlength: [300, 'Notes cannot exceed 300 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('VisitRequest', visitRequestSchema);
