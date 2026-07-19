const express = require('express');
const router = express.Router();
const { getCustomFields, createCustomField, deleteCustomField } = require('../controllers/customFieldController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect); // Protect all routes

router.route('/')
  .get(getCustomFields)
  .post(authorize('admin'), createCustomField);

router.route('/:id')
  .delete(authorize('admin'), deleteCustomField);

module.exports = router;
