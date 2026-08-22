const Payroll = require('../models/Payroll');
const User = require('../models/User');

// @desc    Get logged in user's payroll records
// @route   GET /api/payroll/my
// @access  Private
const getMyPayroll = async (req, res) => {
  try {
    const payrolls = await Payroll.find({ user: req.user._id }).sort({ year: -1, createdAt: -1 });
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all payroll records (Admin)
// @route   GET /api/payroll
// @access  Private/Admin
const getAllPayroll = async (req, res) => {
  try {
    const { month, year } = req.query;
    let filter = {};

    if (month) filter.month = month;
    if (year) filter.year = Number(year);

    const payrolls = await Payroll.find(filter)
      .populate('user', 'firstName lastName email department designation baseSalary')
      .sort({ createdAt: -1 });

    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create / Generate payroll record (Admin)
// @route   POST /api/payroll
// @access  Private/Admin
const createPayroll = async (req, res) => {
  try {
    const { employeeId, month, year, baseSalary, allowances, deductions } = req.body;

    if (!employeeId || !month || !year) {
      return res.status(400).json({ message: 'Employee, month, and year are required' });
    }

    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const salary = baseSalary !== undefined ? Number(baseSalary) : (employee.baseSalary || 50000);
    const allow = allowances !== undefined ? Number(allowances) : 0;
    const deduct = deductions !== undefined ? Number(deductions) : 0;
    const net = salary + allow - deduct;

    // Check existing
    const existing = await Payroll.findOne({ user: employeeId, month, year: Number(year) });
    if (existing) {
      return res.status(400).json({ message: `Payroll for ${month} ${year} already exists for this employee` });
    }

    const payroll = await Payroll.create({
      user: employeeId,
      month,
      year: Number(year),
      baseSalary: salary,
      allowances: allow,
      deductions: deduct,
      netSalary: net,
      status: 'PENDING'
    });

    const populated = await Payroll.findById(payroll._id).populate('user', 'firstName lastName email department designation');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update allowances/deductions of a payroll record (Admin)
// @route   PUT /api/payroll/:id
// @access  Private/Admin
const updatePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }

    const baseSalary = req.body.baseSalary !== undefined ? Number(req.body.baseSalary) : payroll.baseSalary;
    const allowances = req.body.allowances !== undefined ? Number(req.body.allowances) : payroll.allowances;
    const deductions = req.body.deductions !== undefined ? Number(req.body.deductions) : payroll.deductions;

    payroll.baseSalary = baseSalary;
    payroll.allowances = allowances;
    payroll.deductions = deductions;
    payroll.netSalary = baseSalary + allowances - deductions;

    if (req.body.status) {
      payroll.status = req.body.status;
    }

    const updatedPayroll = await payroll.save();
    const populated = await Payroll.findById(updatedPayroll._id).populate('user', 'firstName lastName email department designation');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark payroll as PAID (Admin)
// @route   PUT /api/payroll/:id/pay
// @access  Private/Admin
const markPayrollPaid = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }

    payroll.status = 'PAID';
    const updatedPayroll = await payroll.save();
    const populated = await Payroll.findById(updatedPayroll._id).populate('user', 'firstName lastName email department designation');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyPayroll,
  getAllPayroll,
  createPayroll,
  updatePayroll,
  markPayrollPaid
};
