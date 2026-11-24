const express = require('express');
const router = express.Router();
const {
  getModels,
  getModelById,
  createModel,
  updateModel,
  deleteModel
} = require('../controllers/modelController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getModels)
  .post(protect, authorize('admin'), createModel);

router.route('/:id')
  .get(getModelById)
  .put(protect, authorize('admin'), updateModel)
  .delete(protect, authorize('admin'), deleteModel);

module.exports = router;
