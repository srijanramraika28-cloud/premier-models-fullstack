const Model = require('../models/Model');

// @desc    Get models list with filtering (letter, gender, search)
// @route   GET /api/models
// @access  Public
const getModels = async (req, res, next) => {
  try {
    const { letter, gender, search, featured } = req.query;
    let query = {};

    if (letter && letter.toUpperCase() !== 'ALL') {
      query.letter = letter.toUpperCase();
    }

    if (gender && gender.toLowerCase() !== 'all') {
      query.gender = gender.toLowerCase();
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { agency: { $regex: search, $options: 'i' } }
      ];
    }

    const models = await Model.find(query).sort({ name: 1 });

    res.json({
      success: true,
      count: models.length,
      filter: { letter: letter || 'ALL', gender: gender || 'all' },
      models
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single model by ID
// @route   GET /api/models/:id
// @access  Public
const getModelById = async (req, res, next) => {
  try {
    const model = await Model.findById(req.params.id);
    if (!model) {
      return res.status(404).json({
        success: false,
        message: 'Model not found'
      });
    }

    res.json({
      success: true,
      model
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new Model (Admin only)
// @route   POST /api/models
// @access  Private (Admin only)
const createModel = async (req, res, next) => {
  try {
    const {
      name,
      gender,
      category,
      agency,
      image,
      height,
      bust,
      waist,
      hips,
      eyes,
      hair,
      bio,
      featured
    } = req.body;

    if (!name || !image) {
      return res.status(400).json({
        success: false,
        message: 'Model name and image URL are required.'
      });
    }

    const letter = name.trim().charAt(0).toUpperCase();

    const model = await Model.create({
      name,
      gender: gender || 'female',
      letter,
      category: category || 'Editorial & Runway',
      agency: agency || 'PREMIER MODEL MANAGEMENT',
      image,
      height: height || "5'10\" / 178cm",
      bust: bust || '32" / 81cm',
      waist: waist || '24" / 61cm',
      hips: hips || '35" / 89cm',
      eyes: eyes || 'Hazel',
      hair: hair || 'Brown',
      bio: bio || 'Represented exclusively by Premier Models.',
      featured: featured === true || featured === 'true'
    });

    res.status(201).json({
      success: true,
      message: 'Model profile created successfully',
      model
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a Model (Admin only)
// @route   PUT /api/models/:id
// @access  Private (Admin only)
const updateModel = async (req, res, next) => {
  try {
    let model = await Model.findById(req.params.id);
    if (!model) {
      return res.status(404).json({
        success: false,
        message: 'Model not found'
      });
    }

    if (req.body.name) {
      req.body.letter = req.body.name.trim().charAt(0).toUpperCase();
    }

    model = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Model profile updated successfully',
      model
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a Model (Admin only)
// @route   DELETE /api/models/:id
// @access  Private (Admin only)
const deleteModel = async (req, res, next) => {
  try {
    const model = await Model.findById(req.params.id);
    if (!model) {
      return res.status(404).json({
        success: false,
        message: 'Model not found'
      });
    }

    await model.deleteOne();

    res.json({
      success: true,
      message: 'Model profile deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getModels,
  getModelById,
  createModel,
  updateModel,
  deleteModel
};
