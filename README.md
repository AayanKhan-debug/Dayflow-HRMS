# ☀️ Dayflow – Human Resource Management System (MERN Stack)

**Dayflow** is a complete, modern, production-ready MERN stack web application built to streamline Human Resource operations including Employee Directory management, Check-in/Check-out Attendance tracking, Leave Request approvals, Payroll processing, interactive Recharts analytics, and Notification alerts with strict Role-Based Access Control (`EMPLOYEE` & `ADMIN`).

---

## 🌟 Features

### 👑 Admin Portal
- **Executive Analytics Dashboard**: Interactive Recharts charts including **Attendance Overview (Bar Chart)**, **Leave Analytics (Donut Chart)**, **Department Distribution (Bar Chart)**, and **Payroll Spend Overview (Line Chart)**.
- **Employee Directory**: Search workforce by name, email, or designation; edit employee details, roles (`EMPLOYEE` / `ADMIN`), departments, designations, and base salaries.
- **Master Attendance Register**: Monitor company-wide check-in/out logs with date and employee filters.
- **Leave Approvals Portal**: Filter requests by status (`PENDING`, `APPROVED`, `REJECTED`), approve or reject leave applications with custom admin feedback comments.
- **Payroll Operations**: Issue monthly payroll statements, adjust allowances & deductions with auto-calculated net salary, and mark statement status as `PAID`.
- **Notification Center**: Interactive popover dropdown alerting admins to new leave submissions, attendance activity, and generated payroll statements.

### 👤 Employee Portal
- **Personalized Workspace Dashboard**: Dynamic time-of-day greeting ("Good Morning / Afternoon / Evening"), daily worked hours trend chart, leave status summary, quick action launcher grid, and latest salary slips snippet.
- **Live Attendance Widget**: 1-click Check In & Check Out with real-time status ring and worked hours calculation.
- **My Profile**: View system-managed employment details and edit contact preferences (phone number, address, profile picture URL).
- **Leave Application Workflow**: Apply for leaves (`CASUAL`, `SICK`, `UNPAID`), auto-calculate leave duration in days, track request status, and view admin feedback comments.
- **Payroll & Payslips**: Review monthly salary breakdown (`baseSalary + allowances - deductions`) and payment statuses (`PENDING` / `PAID`).
- **Notification Center**: Real-time alerts for approved/rejected leave applications and issued payslips with direct navigation.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** (Vite)
- **Framer Motion** (Page transitions, modal popups, and staggered card entrance micro-animations)
- **Recharts** (Interactive data visualization charts)
- **Tailwind CSS** (Modern SaaS UI styling, glassmorphism, responsive grid)
- **React Router DOM v6** (Client-side routing & protected role-based routes)
- **Axios** (HTTP API client with JWT bearer header interceptor)
- **Lucide React** (Icons)

### Backend
- **Node.js** & **Express.js** (RESTful API architecture)
- **MongoDB** & **Mongoose** (Data schemas & relationships)
- **JWT (JSON Web Tokens)** (Authentication & route protection middleware)
- **bcryptjs** (Secure password hashing)
- **MongoDB Memory Server** (Automatic zero-config fallback for seamless demo execution)

---

## 📂 Project Structure

```text
dayflow/
├── client/                      # React Frontend (Vite)
│   ├── src/
│   │   ├── api/                 # Axios instance & JWT interceptor
│   │   ├── components/          # Navbar, Sidebar, StatCard, StatusBadge, Modal, PageWrapper, SkeletonLoader
│   │   ├── context/             # AuthContext (user state, login/register, logout)
│   │   ├── pages/               # Login, Register, Dashboards, Attendance, Leaves, Payroll, Employees
│   │   ├── App.jsx              # Main App router & Protected Routes
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Tailwind CSS imports & custom utility classes
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── server/                      # Express REST API Backend
│   ├── config/                  # Database connection with memory server fallback
│   ├── controllers/             # Auth, Employee, Attendance, Leave, Payroll controllers
│   ├── middleware/              # Auth JWT verification & error handler
│   ├── models/                  # User, Attendance, LeaveRequest, Payroll Mongoose schemas
│   ├── routes/                  # REST API endpoint definitions
│   ├── utils/                   # Database seeder script
│   ├── server.js                # Server entry point
│   ├── .env                     # Server environment variables
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Clone Repository & Backend Setup

```bash
# Clone the repository
git clone https://github.com/AayanKhan-debug/Dayflow-HRMS.git
cd Dayflow-HRMS/server

# Install backend dependencies
npm install

# Run database seeder (Optional - populates demo accounts & historical data)
npm run seed

# Start Express REST API server (Runs on http://localhost:5000)
npm start
```

### 2. Frontend Setup

```bash
# Open a new terminal window
cd Dayflow-HRMS/client

# Install frontend dependencies
npm install

# Start Vite development server (Runs on http://localhost:5173)
npm run dev
```

---

## 🔑 Demo Credentials

Use these credentials or click the **1-Click Demo Buttons** on the Login screen:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **👑 ADMIN** | `admin@dayflow.com` | `admin123` | Executive Control Panel & Approvals |
| **👤 EMPLOYEE** | `employee@dayflow.com` | `emp123` | Employee Workspace (John Doe - Sr. Dev) |
| **👤 EMPLOYEE (Secondary)** | `sarah@dayflow.com` | `emp123` | Employee Workspace (Sarah Connor - UX Lead) |

---

## 🔐 Environment Variables

### Server (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/dayflow
JWT_SECRET=your_jwt_secret_key_here
```

### Client (`client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
