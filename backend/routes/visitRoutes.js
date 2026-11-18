const express = require('express');
const {
  getMyVisits,
  createVisitRequest,
  updateVisitStatus,
} = require('../controllers/visitController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').get(getMyVisits).post(createVisitRequest);
router.route('/:id/status').patch(updateVisitStatus);

module.exports = router;
