const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  updateBookingStatus,
  deleteBooking
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(createBooking)
  .get(protect, authorize('admin'), getBookings);

router.route('/:id/status')
  .put(protect, authorize('admin'), updateBookingStatus);

router.route('/:id')
  .delete(protect, authorize('admin'), deleteBooking);

module.exports = router;
