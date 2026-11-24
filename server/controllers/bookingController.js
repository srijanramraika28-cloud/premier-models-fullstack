const Booking = require('../models/Booking');

// @desc    Create a model casting / agency booking inquiry
// @route   POST /api/bookings
// @access  Public (or Authenticated Client)
const createBooking = async (req, res, next) => {
  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      company,
      modelId,
      modelName,
      projectType,
      projectDate,
      location,
      budget,
      notes
    } = req.body;

    if (!clientName || !clientEmail || !notes) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and project details are required.'
      });
    }

    const booking = await Booking.create({
      clientName,
      clientEmail,
      clientPhone: clientPhone || '',
      company: company || '',
      modelId: modelId || null,
      modelName: modelName || 'General Agency Inquiry',
      projectType: projectType || 'Editorial Shoot',
      projectDate: projectDate || '',
      location: location || 'London, UK',
      budget: budget || '',
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Your casting inquiry has been received! Premier Models team will contact you shortly.',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all booking inquiries (Admin only)
// @route   GET /api/bookings
// @access  Private (Admin only)
const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking inquiry status (Admin only)
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin only)
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking inquiry not found'
      });
    }

    booking.status = status || booking.status;
    await booking.save();

    res.json({
      success: true,
      message: `Booking status updated to ${booking.status}`,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete booking inquiry (Admin only)
// @route   DELETE /api/bookings/:id
// @access  Private (Admin only)
const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking inquiry not found'
      });
    }

    await booking.deleteOne();

    res.json({
      success: true,
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBookingStatus,
  deleteBooking
};
