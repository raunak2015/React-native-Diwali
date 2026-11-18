const VisitRequest = require('../models/VisitRequest');

// @desc    Get current user's visit requests
// @route   GET /api/visits
// @access  Private
const getMyVisits = async (req, res, next) => {
  try {
    let visits = [];
    try {
      visits = await VisitRequest.find({ renter: req.user._id })
        .populate('property')
        .sort('-createdAt');
    } catch (e) {}

    res.status(200).json({
      status: 'success',
      results: visits.length,
      data: { visits },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a visit request
// @route   POST /api/visits
// @access  Private
const createVisitRequest = async (req, res, next) => {
  try {
    const { propertyId, visitDate, timeSlot, notes } = req.body;

    const visit = await VisitRequest.create({
      renter: req.user._id,
      property: propertyId,
      visitDate: visitDate || new Date(Date.now() + 86400000 * 2),
      timeSlot: timeSlot || 'Evening (4pm - 8pm)',
      notes: notes || '',
    });

    res.status(201).json({
      status: 'success',
      data: { visit },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update visit request status
// @route   PATCH /api/visits/:id/status
// @access  Private
const updateVisitStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const visit = await VisitRequest.findById(req.params.id);

    if (!visit) {
      return res.status(404).json({ status: 'fail', message: 'Visit not found' });
    }

    visit.status = status;
    await visit.save();

    res.status(200).json({
      status: 'success',
      data: { visit },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyVisits,
  createVisitRequest,
  updateVisitStatus,
};
