const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const User = require('./models/User');
const seedData = require('./utils/seed');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/employeeRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/payroll', require('./routes/payrollRoutes'));

// Root endpoint for status check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Dayflow HRMS API is running smoothly' });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect DB and Start Server
connectDB().then(async () => {
  // Auto-seed if database has no users
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Auto-Seed] Empty database detected. Seeding initial demo data...');
      await seedData();
    }
  } catch (e) {
    console.error('[Auto-Seed Error]', e.message);
  }

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Dayflow HRMS Backend Server running on port ${PORT}`);
    console.log(`   API Endpoint: http://localhost:${PORT}/api`);
    console.log(`====================================================`);
  });
});
