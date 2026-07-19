const CustomField = require('../models/CustomField');

// @desc    Get all custom field definitions
// @route   GET /api/custom-fields
// @access  Private
exports.getCustomFields = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.target) {
      filter.target = req.query.target;
    }

    const fields = await CustomField.find(filter);

    res.status(200).json({
      success: true,
      count: fields.length,
      data: fields,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new custom field definition
// @route   POST /api/custom-fields
// @access  Private/Admin
exports.createCustomField = async (req, res, next) => {
  try {
    const { name, label, type, target, required } = req.body;

    if (!name || !label || !target) {
      return res.status(400).json({ success: false, message: 'Please provide name, label, and target' });
    }

    // Convert name to camelCase just in case
    const formattedName = name
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '');

    const customField = await CustomField.create({
      name: formattedName,
      label,
      type: type || 'text',
      target,
      required: !!required,
    });

    res.status(201).json({
      success: true,
      data: customField,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete custom field definition
// @route   DELETE /api/custom-fields/:id
// @access  Private/Admin
exports.deleteCustomField = async (req, res, next) => {
  try {
    const customField = await CustomField.findById(req.params.id);
    if (!customField) {
      return res.status(404).json({ success: false, message: 'Custom field not found' });
    }

    await customField.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Custom field successfully deleted',
    });
  } catch (error) {
    next(error);
  }
};
