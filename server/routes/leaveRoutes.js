const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave
} = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, applyLeave);
router.get('/my', protect, getMyLeaves);
router.get('/', protect, authorize('ADMIN'), getAllLeaves);
router.put('/:id/approve', protect, authorize('ADMIN'), approveLeave);
router.put('/:id/reject', protect, authorize('ADMIN'), rejectLeave);

module.exports = router;
