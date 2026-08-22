const express = require('express');
const router = express.Router();
const {
  getMyPayroll,
  getAllPayroll,
  createPayroll,
  updatePayroll,
  markPayrollPaid
} = require('../controllers/payrollController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/my', protect, getMyPayroll);
router.get('/', protect, authorize('ADMIN'), getAllPayroll);
router.post('/', protect, authorize('ADMIN'), createPayroll);
router.put('/:id', protect, authorize('ADMIN'), updatePayroll);
router.put('/:id/pay', protect, authorize('ADMIN'), markPayrollPaid);

module.exports = router;
