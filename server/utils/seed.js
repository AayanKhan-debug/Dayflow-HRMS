const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');
const Payroll = require('../models/Payroll');

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing database collections...');
    await User.deleteMany({});
    await Attendance.deleteMany({});
    await LeaveRequest.deleteMany({});
    await Payroll.deleteMany({});

    console.log('[Seed] Inserting initial users...');

    const admin = await User.create({
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'admin@dayflow.com',
      password: 'admin123',
      role: 'ADMIN',
      department: 'Human Resources',
      designation: 'HR Director',
      phone: '+1 (555) 019-2831',
      address: '100 Corporate Plaza, New York, NY',
      baseSalary: 120000
    });

    const emp1 = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'employee@dayflow.com',
      password: 'emp123',
      role: 'EMPLOYEE',
      department: 'Engineering',
      designation: 'Senior Frontend Developer',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace, Springfield',
      baseSalary: 85000
    });

    const emp2 = await User.create({
      firstName: 'Sarah',
      lastName: 'Connor',
      email: 'sarah@dayflow.com',
      password: 'emp123',
      role: 'EMPLOYEE',
      department: 'Design',
      designation: 'UI/UX Lead',
      phone: '+1 (555) 987-6543',
      address: '42 Wallaby Way, Sydney',
      baseSalary: 78000
    });

    console.log('[Seed] Users created:');
    console.log(` - ADMIN: admin@dayflow.com / admin123`);
    console.log(` - EMPLOYEE: employee@dayflow.com / emp123`);
    console.log(` - EMPLOYEE: sarah@dayflow.com / emp123`);

    // Create sample attendance
    const today = new Date();
    const dStr = (d) => d.toISOString().split('T')[0];

    await Attendance.create([
      {
        user: emp1._id,
        date: dStr(new Date(Date.now() - 86400000 * 2)),
        checkIn: new Date(Date.now() - 86400000 * 2 + 32400000), // 9 AM
        checkOut: new Date(Date.now() - 86400000 * 2 + 64800000), // 6 PM
        workedHours: 9.0,
        status: 'PRESENT'
      },
      {
        user: emp1._id,
        date: dStr(new Date(Date.now() - 86400000 * 1)),
        checkIn: new Date(Date.now() - 86400000 * 1 + 34200000), // 9:30 AM
        checkOut: new Date(Date.now() - 86400000 * 1 + 63000000), // 5:30 PM
        workedHours: 8.0,
        status: 'PRESENT'
      },
      {
        user: emp2._id,
        date: dStr(new Date(Date.now() - 86400000 * 1)),
        checkIn: new Date(Date.now() - 86400000 * 1 + 36000000),
        checkOut: new Date(Date.now() - 86400000 * 1 + 61200000),
        workedHours: 7.0,
        status: 'PRESENT'
      }
    ]);

    // Create sample leave requests
    await LeaveRequest.create([
      {
        user: emp1._id,
        leaveType: 'CASUAL',
        startDate: new Date(Date.now() + 86400000 * 3),
        endDate: new Date(Date.now() + 86400000 * 5),
        reason: 'Family event out of town',
        status: 'PENDING'
      },
      {
        user: emp2._id,
        leaveType: 'SICK',
        startDate: new Date(Date.now() - 86400000 * 10),
        endDate: new Date(Date.now() - 86400000 * 9),
        reason: 'Viral fever rest',
        status: 'APPROVED',
        adminComment: 'Approved. Get well soon!'
      }
    ]);

    // Create sample payrolls
    await Payroll.create([
      {
        user: emp1._id,
        month: 'August',
        year: 2026,
        baseSalary: 85000,
        allowances: 3000,
        deductions: 1500,
        netSalary: 86500,
        status: 'PENDING'
      },
      {
        user: emp2._id,
        month: 'August',
        year: 2026,
        baseSalary: 78000,
        allowances: 2500,
        deductions: 1000,
        netSalary: 79500,
        status: 'PAID'
      }
    ]);

    console.log('[Seed] Seeding completed successfully!');
  } catch (err) {
    console.error('[Seed Error]', err);
  }
};

if (require.main === module) {
  seedData().then(() => process.exit(0));
}

module.exports = seedData;
