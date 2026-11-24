const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true
    },
    subtitle: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      default: 'Editorial'
    },
    author: {
      type: String,
      default: 'Maxwell Tomlinson'
    },
    date: {
      type: String,
      default: () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    image: {
      type: String,
      required: [true, 'Blog image URL is required']
    },
    content: {
      type: String,
      required: [true, 'Blog content is required']
    },
    tags: [String]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Blog', BlogSchema);
