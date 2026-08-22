# ☀️ Dayflow – Human Resource Management System (MERN Stack)

**Dayflow** is a complete, modern, production-ready MERN stack web application built to streamline Human Resource operations including Employee Directory management, Check-in/Check-out Attendance tracking, Leave Request approvals, and Payroll processing with strict Role-Based Access Control (`EMPLOYEE` & `ADMIN`).

---

## 🌟 Key Features

### 👤 Employee Portal
- **Dashboard**: Personalized welcome banner, real-time Check-In / Check-Out controls, worked hours tracker, today's status, pending leave counters, and recent activity.
- **My Profile**: View employment details (role, department, designation, salary) and update contact information (phone number, address, profile picture).
- **Attendance History**: Log daily attendance and review worked hours logs.
- **Leave Management**: Apply for leaves (`CASUAL`, `SICK`, `UNPAID`), track request status (`PENDING`, `APPROVED`, `REJECTED`), and view admin feedback comments.
- **Payroll**: Review monthly salary breakdown (`baseSalary + allowances - deductions`) and payment statuses (`PENDING` / `PAID`).

### 👑 Admin Portal
- **Metrics Dashboard**: Company-wide statistics showing Total Employees, Present Today, Absent Today, and Pending Leave Requests.
- **Employee Directory**: Search employees by name, email, or designation; view detailed profiles; update roles, departments, designations, and base salaries.
- **Master Attendance**: View company-wide check-in logs with filters by date or specific employee.
- **Leave Approval Portal**: Review employee leave applications, approve or reject with custom feedback comments.
- **Payroll Management**: Generate monthly payroll statements, adjust allowances & deductions, and mark salary status as `PAID`.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** (Vite)
- **Tailwind CSS** (Modern UI styling)
- **React Router DOM v6** (Client-side routing & protected routes)
- **Axios** (API HTTP requests with JWT interceptor)
- **Lucide React** (Icons)

### Backend
- **Node.js** & **Express.js** (REST API)
- **MongoDB** & **Mongoose** (Data modeling & schemas)
- **JWT (JSON Web Tokens)** (Authentication & route protection)
- **bcryptjs** (Password hashing & security)
- **MongoDB Memory Server** (Automatic zero-config fallback for seamless demo execution)

---

## 🔑 Demo Login Credentials

For quick evaluation, use the pre-seeded credentials or click the **1-Click Demo Buttons** on the Login screen:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@dayflow.com` | `admin123` | Master Control Panel & Management Features |
| **EMPLOYEE** | `employee@dayflow.com` | `emp123` | Employee Workspace (John Doe - Sr. Dev) |
| **EMPLOYEE (Secondary)** | `sarah@dayflow.com` | `emp123` | Employee Workspace (Sarah Connor - UX Lead) |

---

## 📂 Project Structure

```text
dayflow/
│
├── client/                      # React Frontend (Vite)
│   ├── src/
│   │   ├── api/                 # Axios instance & interceptors
│   │   ├── components/          # Layout, Navbar, Sidebar, StatCard, StatusBadge, Modal
│   │   ├── context/             # AuthContext (state & login/register handlers)
│   │   ├── pages/               # Login, Register, Dashboards, Attendance, Leaves, Payroll
│   │   ├── App.jsx              # Main App router & Protected Routes
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Tailwind CSS imports
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                      # Express REST API Backend
│   ├── config/                  # Database connection with fallback
│   ├── controllers/             # Auth, Employee, Attendance, Leave, Payroll controllers
│   ├── middleware/              # Auth JWT verification & error handler
│   ├── models/                  # User, Attendance, LeaveRequest, Payroll Mongoose schemas
│   ├── routes/                  # API routes definition
│   ├── utils/                   # Database seeder script
│   ├── server.js                # Server entry point
│   ├── .env                     # Configuration file
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Backend Setup

```bash
cd server
npm install
npm run seed      # (Optional) Pre-populates demo accounts and sample records
npm start         # Runs backend API on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev       # Runs Vite development server on http://localhost:5173
```

---

## 📡 REST API Summary

### Authentication
- `POST /api/auth/register` — Create new account
- `POST /api/auth/login` — User login
- `GET  /api/auth/me` — Get logged-in user profile

### Employee Management
- `GET  /api/employees/me` — Get profile details
- `PUT  /api/employees/me` — Update phone, address, profile picture
- `GET  /api/admin/employees` — Get all employees (Admin)
- `PUT  /api/admin/employees/:id` — Update employee role/department/salary (Admin)

### Attendance
- `POST /api/attendance/check-in` — Clock in for the day
- `POST /api/attendance/check-out` - Clock out & calculate worked hours
- `GET  /api/attendance/my` — Get user's attendance log
- `GET  /api/attendance` — View all company attendance logs (Admin)

### Leave Requests
- `POST /api/leaves` — Submit leave request
- `GET  /api/leaves/my` — View user's leave requests
- `GET  /api/leaves` — Master leave request queue (Admin)
- `PUT  /api/leaves/:id/approve` — Approve leave (Admin)
- `PUT  /api/leaves/:id/reject` — Reject leave (Admin)

### Payroll
- `GET  /api/payroll/my` — View user's salary statements
- `GET  /api/payroll` — Master payroll records (Admin)
- `POST /api/payroll` — Generate new payroll statement (Admin)
- `PUT  /api/payroll/:id` — Edit allowances/deductions (Admin)
- `PUT  /api/payroll/:id/pay` — Mark payroll as PAID (Admin)

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
