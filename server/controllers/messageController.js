const Message = require('../models/Message');
const Complaint = require('../models/Complaint');

// @desc    Get all messages for a ticket
// @route   GET /api/messages/:complaintId
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Access control
    if (req.user.role === 'customer' && complaint.customer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view messages' });
    }

    if (req.user.role === 'agent' && complaint.agent && complaint.agent.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view messages' });
    }

    const messages = await Message.find({ complaint: req.params.complaintId })
      .populate('sender', 'name role')
      .sort('createdAt');

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Post a message in a ticket chat
// @route   POST /api/messages
// @access  Private
exports.createMessage = async (req, res, next) => {
  try {
    const { complaintId, content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message content cannot be empty' });
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Access control
    if (req.user.role === 'customer' && complaint.customer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to post messages' });
    }

    if (req.user.role === 'agent' && complaint.agent && complaint.agent.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to post messages' });
    }

    const message = await Message.create({
      complaint: complaintId,
      sender: req.user.id,
      content,
    });

    const populatedMessage = await Message.findById(message._id).populate('sender', 'name role');

    res.status(201).json({
      success: true,
      data: populatedMessage,
    });
  } catch (error) {
    next(error);
  }
};
