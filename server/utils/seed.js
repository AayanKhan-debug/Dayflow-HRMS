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

    console.log('[Seed] Inserting initial users across multiple departments...');

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

    const emp3 = await User.create({
      firstName: 'Michael',
      lastName: 'Scott',
      email: 'michael@dayflow.com',
      password: 'emp123',
      role: 'EMPLOYEE',
      department: 'Sales',
      designation: 'Regional Sales Lead',
      phone: '+1 (555) 456-7890',
      address: '1725 Slough Avenue, Scranton, PA',
      baseSalary: 92000
    });

    const emp4 = await User.create({
      firstName: 'Emily',
      lastName: 'Watson',
      email: 'emily@dayflow.com',
      password: 'emp123',
      role: 'EMPLOYEE',
      department: 'Engineering',
      designation: 'DevOps Engineer',
      phone: '+1 (555) 321-6549',
      address: '12 Market St, San Francisco, CA',
      baseSalary: 95000
    });

    console.log('[Seed] Users created successfully.');

    // Seed Attendance records across past dates
    const dStr = (offsetDays) => {
      const d = new Date(Date.now() - 86400000 * offsetDays);
      return d.toISOString().split('T')[0];
    };

    console.log('[Seed] Creating attendance history...');
    await Attendance.create([
      {
        user: emp1._id,
        date: dStr(4),
        checkIn: new Date(Date.now() - 86400000 * 4 + 32400000), // 9:00 AM
        checkOut: new Date(Date.now() - 86400000 * 4 + 64800000), // 6:00 PM
        workedHours: 9.0,
        status: 'PRESENT'
      },
      {
        user: emp1._id,
        date: dStr(3),
        checkIn: new Date(Date.now() - 86400000 * 3 + 33300000), // 9:15 AM
        checkOut: new Date(Date.now() - 86400000 * 3 + 63900000), // 5:45 PM
        workedHours: 8.5,
        status: 'PRESENT'
      },
      {
        user: emp1._id,
        date: dStr(2),
        checkIn: new Date(Date.now() - 86400000 * 2 + 34200000), // 9:30 AM
        checkOut: new Date(Date.now() - 86400000 * 2 + 63000000), // 5:30 PM
        workedHours: 8.0,
        status: 'PRESENT'
      },
      {
        user: emp1._id,
        date: dStr(1),
        checkIn: new Date(Date.now() - 86400000 * 1 + 32400000),
        checkOut: new Date(Date.now() - 86400000 * 1 + 64800000),
        workedHours: 9.0,
        status: 'PRESENT'
      },
      {
        user: emp2._id,
        date: dStr(2),
        checkIn: new Date(Date.now() - 86400000 * 2 + 36000000),
        checkOut: new Date(Date.now() - 86400000 * 2 + 54000000),
        workedHours: 5.0,
        status: 'HALF_DAY'
      },
      {
        user: emp2._id,
        date: dStr(1),
        checkIn: new Date(Date.now() - 86400000 * 1 + 32400000),
        checkOut: new Date(Date.now() - 86400000 * 1 + 61200000),
        workedHours: 8.0,
        status: 'PRESENT'
      },
      {
        user: emp3._id,
        date: dStr(1),
        checkIn: new Date(Date.now() - 86400000 * 1 + 34200000),
        checkOut: new Date(Date.now() - 86400000 * 1 + 63000000),
        workedHours: 8.0,
        status: 'PRESENT'
      },
      {
        user: emp4._id,
        date: dStr(1),
        checkIn: new Date(Date.now() - 86400000 * 1 + 32400000),
        checkOut: new Date(Date.now() - 86400000 * 1 + 64800000),
        workedHours: 9.0,
        status: 'PRESENT'
      }
    ]);

    // Seed Leave requests across PENDING, APPROVED, REJECTED
    console.log('[Seed] Creating leave requests...');
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
      },
      {
        user: emp3._id,
        leaveType: 'UNPAID',
        startDate: new Date(Date.now() - 86400000 * 20),
        endDate: new Date(Date.now() - 86400000 * 18),
        reason: 'Personal vacation trip',
        status: 'REJECTED',
        adminComment: 'High workload during product launch week.'
      },
      {
        user: emp4._id,
        leaveType: 'CASUAL',
        startDate: new Date(Date.now() + 86400000 * 7),
        endDate: new Date(Date.now() + 86400000 * 8),
        reason: 'Medical checkup',
        status: 'PENDING'
      }
    ]);

    // Seed Payroll records across June, July, August
    console.log('[Seed] Creating payroll records...');
    await Payroll.create([
      {
        user: emp1._id,
        month: 'June',
        year: 2026,
        baseSalary: 85000,
        allowances: 2500,
        deductions: 1200,
        netSalary: 86300,
        status: 'PAID'
      },
      {
        user: emp1._id,
        month: 'July',
        year: 2026,
        baseSalary: 85000,
        allowances: 3000,
        deductions: 1500,
        netSalary: 86500,
        status: 'PAID'
      },
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
        month: 'July',
        year: 2026,
        baseSalary: 78000,
        allowances: 2000,
        deductions: 1000,
        netSalary: 79000,
        status: 'PAID'
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
      },
      {
        user: emp3._id,
        month: 'August',
        year: 2026,
        baseSalary: 92000,
        allowances: 4000,
        deductions: 2000,
        netSalary: 94000,
        status: 'PENDING'
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
