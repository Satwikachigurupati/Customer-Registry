const express = require('express');
const router = express.Router();
const { getMessages, createMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.use(protect); // Protect all routes

router.route('/')
  .post(createMessage);

router.route('/:complaintId')
  .get(getMessages);

module.exports = router;
