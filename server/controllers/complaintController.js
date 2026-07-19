const Complaint = require('../models/Complaint');
const User = require('../models/User');

// @desc    Create a new complaint/ticket
// @route   POST /api/complaints
// @access  Private
exports.createComplaint = async (req, res, next) => {
  try {
    const { title, description, type, customFields } = req.body;

    // Check if user is customer (Admins/Agents can raise on behalf of customer if needed, but default to current user)
    const complaint = await Complaint.create({
      title,
      description,
      type: type || 'complaint',
      customer: req.user.id,
      customFields: customFields || {},
    });

    res.status(201).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints (filtered by role access)
// @route   GET /api/complaints
// @access  Private
exports.getComplaints = async (req, res, next) => {
  try {
    let query = {};

    // Filter by role
    if (req.user.role === 'customer') {
      query.customer = req.user.id;
    } else if (req.user.role === 'agent') {
      query.agent = req.user.id;
    }
    // Admin sees all

    // Additional query filters from client
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.type) {
      query.type = req.query.type;
    }
    if (req.query.unassigned === 'true') {
      query.agent = null;
    }

    const complaints = await Complaint.find(query)
      .populate('customer', 'name email phone')
      .populate('agent', 'name email phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('customer', 'name email phone customProfileFields')
      .populate('agent', 'name email phone');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Access check: Customer must own it, Agent must be assigned, or user must be Admin
    if (
      req.user.role === 'customer' &&
      complaint.customer._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this ticket' });
    }

    if (
      req.user.role === 'agent' &&
      complaint.agent &&
      complaint.agent._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this ticket' });
    }

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign ticket to an agent
// @route   PUT /api/complaints/:id/assign
// @access  Private/Admin
exports.assignComplaint = async (req, res, next) => {
  try {
    const { agentId } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Verify agent user exists and is indeed an agent
    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'agent') {
      return res.status(400).json({ success: false, message: 'Invalid Agent selected' });
    }

    complaint.agent = agentId;
    // Update status to assigned if currently open
    if (complaint.status === 'open') {
      complaint.status = 'assigned';
    }

    await complaint.save();

    const updatedComplaint = await Complaint.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('agent', 'name email phone');

    res.status(200).json({
      success: true,
      data: updatedComplaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private
exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Validation on status
    const allowedStatuses = ['open', 'assigned', 'resolved', 'closed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    // Security check: Only Admin, or assigned Agent, or Customer (to close) can update status
    if (req.user.role === 'customer') {
      if (complaint.customer.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
      if (status !== 'closed') {
        return res.status(400).json({ success: false, message: 'Customers can only close their tickets' });
      }
    } else if (req.user.role === 'agent') {
      if (!complaint.agent || complaint.agent.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized: You are not the assigned agent' });
      }
    }

    complaint.status = status;
    await complaint.save();

    const updatedComplaint = await Complaint.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('agent', 'name email phone');

    res.status(200).json({
      success: true,
      data: updatedComplaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit customer feedback and rating for a ticket
// @route   POST /api/complaints/:id/feedback
// @access  Private
exports.submitFeedback = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Please provide a rating between 1 and 5' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Check if user is the customer who raised it
    if (complaint.customer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to submit feedback for this ticket' });
    }

    complaint.feedback = { rating, comment };
    complaint.status = 'closed'; // Automatically close ticket when feedback is submitted
    await complaint.save();

    const updatedComplaint = await Complaint.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('agent', 'name email phone');

    res.status(200).json({
      success: true,
      data: updatedComplaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard analytics (Admin only)
// @route   GET /api/complaints/analytics/summary
// @access  Private/Admin
exports.getAnalyticsSummary = async (req, res, next) => {
  try {
    // Total counts by status
    const statusCounts = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Total counts by type
    const typeCounts = await Complaint.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Feedback rating summary
    const ratingSummary = await Complaint.aggregate([
      { $match: { 'feedback.rating': { $exists: true } } },
      { $group: { _id: null, avgRating: { $avg: '$feedback.rating' }, totalRatings: { $sum: 1 } } }
    ]);

    // Agent performance (resolved tickets count & average rating)
    const agentStats = await Complaint.aggregate([
      { $match: { agent: { $ne: null } } },
      {
        $group: {
          _id: '$agent',
          totalTickets: { $sum: 1 },
          resolvedCount: {
            $sum: { $cond: [{ $in: ['$status', ['resolved', 'closed']] }, 1, 0] }
          },
          avgRating: { $avg: '$feedback.rating' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'agentInfo'
        }
      },
      { $unwind: '$agentInfo' },
      {
        $project: {
          name: '$agentInfo.name',
          email: '$agentInfo.email',
          totalTickets: 1,
          resolvedCount: 1,
          avgRating: { $ifNull: ['$avgRating', 0] }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        statusCounts: statusCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, { open: 0, assigned: 0, resolved: 0, closed: 0 }),
        typeCounts: typeCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, { complaint: 0, inquiry: 0, feedback: 0, request: 0 }),
        averageRating: ratingSummary.length > 0 ? ratingSummary[0].avgRating : 0,
        totalRatings: ratingSummary.length > 0 ? ratingSummary[0].totalRatings : 0,
        agentStats,
      }
    });
  } catch (error) {
    next(error);
  }
};
