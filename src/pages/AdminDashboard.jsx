import { Link } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-page">

      <header className="admin-header">

        <div>
          <h1>Admin Dashboard</h1>
          <p>
            Manage users, students, trainers, programs and reports.
          </p>
        </div>

        <div className="admin-header-actions">

          <Link
            to="/admin-profile"
            className="admin-profile-button"
          >
            👤 Profile
          </Link>

          <Link
            to="/login"
            className="admin-logout"
          >
            Logout
          </Link>

        </div>

      </header>


      <section className="admin-stats">

        <div className="admin-stat-card">
          <span className="admin-stat-icon">👥</span>

          <div>
            <span>Total Users</span>
            <strong>72</strong>
          </div>
        </div>


        <div className="admin-stat-card">
          <span className="admin-stat-icon">👨‍🎓</span>

          <div>
            <span>Students</span>
            <strong>48</strong>
          </div>
        </div>


        <div className="admin-stat-card">
          <span className="admin-stat-icon">👨‍🏫</span>

          <div>
            <span>Trainers</span>
            <strong>12</strong>
          </div>
        </div>


        <div className="admin-stat-card">
          <span className="admin-stat-icon">📚</span>

          <div>
            <span>Programs</span>
            <strong>12</strong>
          </div>
        </div>

      </section>


      <section className="admin-dashboard-section">

        <h2>Administration</h2>

        <div className="admin-menu-grid">


          {/* ADMIN PROFILE */}

          <Link
            to="/admin-profile"
            className="admin-menu-card"
          >
            <span>👤</span>

            <h3>
              My Profile
            </h3>

            <p>
              View your administrator profile and account details.
            </p>
          </Link>


          {/* USER MANAGEMENT */}

          <Link
            to="/user-management"
            className="admin-menu-card"
          >
            <span>👥</span>

            <h3>
              User Management
            </h3>

            <p>
              Manage system users and their roles.
            </p>
          </Link>


          {/* STUDENT MANAGEMENT */}

          <Link
            to="/student-management"
            className="admin-menu-card"
          >
            <span>👨‍🎓</span>

            <h3>
              Student Management
            </h3>

            <p>
              View and manage registered students.
            </p>
          </Link>


          {/* TRAINER MANAGEMENT */}

          <Link
            to="/trainer-management"
            className="admin-menu-card"
          >
            <span>👨‍🏫</span>

            <h3>
              Trainer Management
            </h3>

            <p>
              Manage trainers and their details.
            </p>
          </Link>


          {/* TRAINING PROGRAMS */}

          <Link
            to="/admin-programs"
            className="admin-menu-card"
          >
            <span>📚</span>

            <h3>
              Training Programs
            </h3>

            <p>
              Manage training programs.
            </p>
          </Link>


          {/* TRAINING MODULES */}

          <Link
            to="/admin-modules"
            className="admin-menu-card"
          >
            <span>📖</span>

            <h3>
              Training Modules
            </h3>

            <p>
              Manage modules under programs.
            </p>
          </Link>


          {/* REPORTS */}

          <Link
            to="/admin-reports"
            className="admin-menu-card"
          >
            <span>📊</span>

            <h3>
              Reports
            </h3>

            <p>
              View system statistics and reports.
            </p>
          </Link>


        </div>

      </section>

    </div>
  );
}

export default AdminDashboard;