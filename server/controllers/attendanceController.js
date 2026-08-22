const Attendance = require('../models/Attendance');

const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// @desc    Check-in employee
// @route   POST /api/attendance/check-in
// @access  Private
const checkIn = async (req, res) => {
  try {
    const today = getTodayDateString();
    
    // Prevent duplicate check-in
    const existing = await Attendance.findOne({
      user: req.user._id,
      date: today
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already checked in for today' });
    }

    const attendance = await Attendance.create({
      user: req.user._id,
      date: today,
      checkIn: new Date(),
      status: 'PRESENT'
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check-out employee
// @route   POST /api/attendance/check-out
// @access  Private
const checkOut = async (req, res) => {
  try {
    const today = getTodayDateString();

    const attendance = await Attendance.findOne({
      user: req.user._id,
      date: today
    });

    if (!attendance) {
      return res.status(400).json({ message: 'No active check-in record found for today' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: 'You have already checked out for today' });
    }

    const checkOutTime = new Date();
    const diffMs = checkOutTime - new Date(attendance.checkIn);
    const hours = Math.max(0.1, Number((diffMs / (1000 * 60 * 60)).toFixed(2)));

    attendance.checkOut = checkOutTime;
    attendance.workedHours = hours;

    if (hours < 4) {
      attendance.status = 'HALF_DAY';
    }

    const updatedAttendance = await attendance.save();
    res.json(updatedAttendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's attendance history
// @route   GET /api/attendance/my
// @access  Private
const getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ user: req.user._id }).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all attendance (Admin)
// @route   GET /api/attendance
// @access  Private/Admin
const getAllAttendance = async (req, res) => {
  try {
    const { date, employeeId } = req.query;
    let filter = {};

    if (date) {
      filter.date = date;
    }

    if (employeeId) {
      filter.user = employeeId;
    }

    const records = await Attendance.find(filter)
      .populate('user', 'firstName lastName email department designation')
      .sort({ date: -1, createdAt: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance
};
