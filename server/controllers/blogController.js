const Blog = require('../models/Blog');

// @desc    Get all blog updates / editorial articles
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: blogs.length,
      blogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog post
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Editorial blog post not found'
      });
    }

    res.json({
      success: true,
      blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a blog post (Admin only)
// @route   POST /api/blogs
// @access  Private (Admin only)
const createBlog = async (req, res, next) => {
  try {
    const { title, subtitle, category, author, date, image, content, tags } = req.body;

    if (!title || !image || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title, image URL, and content are required.'
      });
    }

    const blog = await Blog.create({
      title,
      subtitle: subtitle || '',
      category: category || 'Editorial',
      author: author || 'Premier Editorial',
      date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      image,
      content,
      tags: tags || []
    });

    res.status(201).json({
      success: true,
      message: 'Editorial article published successfully',
      blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog post (Admin only)
// @route   PUT /api/blogs/:id
// @access  Private (Admin only)
const updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Article updated successfully',
      blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog post (Admin only)
// @route   DELETE /api/blogs/:id
// @access  Private (Admin only)
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    await blog.deleteOne();

    res.json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
};
