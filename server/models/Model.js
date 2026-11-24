const mongoose = require('mongoose');

const ModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Model name is required'],
      trim: true
    },
    gender: {
      type: String,
      enum: ['female', 'male', 'all'],
      required: [true, 'Gender is required'],
      default: 'female'
    },
    letter: {
      type: String,
      uppercase: true,
      required: true,
      maxlength: 1
    },
    category: {
      type: String,
      default: 'Editorial & Runway'
    },
    agency: {
      type: String,
      default: 'PREMIER MODEL MANAGEMENT'
    },
    image: {
      type: String,
      required: [true, 'Model portrait image URL is required']
    },
    height: {
      type: String,
      default: '5\'10" / 178cm'
    },
    bust: {
      type: String,
      default: '32" / 81cm'
    },
    waist: {
      type: String,
      default: '24" / 61cm'
    },
    hips: {
      type: String,
      default: '35" / 89cm'
    },
    eyes: {
      type: String,
      default: 'Blue/Green'
    },
    hair: {
      type: String,
      default: 'Brown'
    },
    bio: {
      type: String,
      default: 'International fashion and runway model represented globally.'
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Auto-populate letter field from first letter of name before saving
ModelSchema.pre('validate', function (next) {
  if (this.name && !this.letter) {
    this.letter = this.name.trim().charAt(0).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Model', ModelSchema);
