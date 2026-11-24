const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'Please provide contact name'],
      trim: true
    },
    clientEmail: {
      type: String,
      required: [true, 'Please provide contact email'],
      lowercase: true,
      trim: true
    },
    clientPhone: {
      type: String,
      trim: true,
      default: ''
    },
    company: {
      type: String,
      trim: true,
      default: ''
    },
    modelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Model'
    },
    modelName: {
      type: String,
      default: 'General Agency Inquiry'
    },
    projectType: {
      type: String,
      enum: ['Editorial Shoot', 'Runway Show', 'Commercial Campaign', 'Lookbook', 'Digital Content', 'Other'],
      default: 'Editorial Shoot'
    },
    projectDate: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: 'London, UK'
    },
    budget: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      required: [true, 'Please describe project details / inquiry']
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Declined', 'Completed'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Booking', BookingSchema);
