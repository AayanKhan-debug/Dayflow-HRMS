const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  getAllEmployees,
  getEmployeeById,
  updateEmployeeByAdmin
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Employee routes
router.get('/employees/me', protect, getMyProfile);
router.put('/employees/me', protect, updateMyProfile);

// Admin routes
router.get('/admin/employees', protect, authorize('ADMIN'), getAllEmployees);
router.get('/admin/employees/:id', protect, authorize('ADMIN'), getEmployeeById);
router.put('/admin/employees/:id', protect, authorize('ADMIN'), updateEmployeeByAdmin);

module.exports = router;
