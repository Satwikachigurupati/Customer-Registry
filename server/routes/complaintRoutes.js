const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getComplaint,
  assignComplaint,
  updateComplaintStatus,
  submitFeedback,
  getAnalyticsSummary,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect); // Protect all routes

router.route('/')
  .post(createComplaint)
  .get(getComplaints);

// Put static paths before dynamic :id parameter!
router.get('/analytics/summary', authorize('admin'), getAnalyticsSummary);

router.route('/:id')
  .get(getComplaint);

router.put('/:id/assign', authorize('admin'), assignComplaint);
router.put('/:id/status', updateComplaintStatus);
router.post('/:id/feedback', submitFeedback);

module.exports = router;
