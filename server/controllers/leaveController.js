const LeaveRequest = require('../models/LeaveRequest');

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private
const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'Please provide all required leave details' });
    }

    const leave = await LeaveRequest.create({
      user: req.user._id,
      leaveType,
      startDate,
      endDate,
      reason,
      status: 'PENDING'
    });

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's leave requests
// @route   GET /api/leaves/my
// @access  Private
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all leave requests (Admin)
// @route   GET /api/leaves
// @access  Private/Admin
const getAllLeaves = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status && status !== 'ALL') {
      filter.status = status;
    }

    const leaves = await LeaveRequest.find(filter)
      .populate('user', 'firstName lastName email department designation')
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve leave request (Admin)
// @route   PUT /api/leaves/:id/approve
// @access  Private/Admin
const approveLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leave.status = 'APPROVED';
    if (req.body.adminComment !== undefined) {
      leave.adminComment = req.body.adminComment;
    }

    const updatedLeave = await leave.save();
    const populated = await LeaveRequest.findById(updatedLeave._id).populate('user', 'firstName lastName email department designation');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject leave request (Admin)
// @route   PUT /api/leaves/:id/reject
// @access  Private/Admin
const rejectLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leave.status = 'REJECTED';
    if (req.body.adminComment !== undefined) {
      leave.adminComment = req.body.adminComment;
    }

    const updatedLeave = await leave.save();
    const populated = await LeaveRequest.findById(updatedLeave._id).populate('user', 'firstName lastName email department designation');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave
};
