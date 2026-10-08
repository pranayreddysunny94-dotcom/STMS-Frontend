import { Link } from "react-router-dom";
import "./TrainerDashboard.css";

function TrainerDashboard() {
  return (
    <div className="trainer-page">
      <header className="trainer-header">
        <div>
          <h1>Trainer Dashboard</h1>
          <p>Manage training programs, students, assessments and projects.</p>
        </div>
        <Link to="/login" className="trainer-logout">Logout</Link>
      </header>

      <section className="trainer-stats">
        <div className="trainer-stat-card">
          <span className="trainer-stat-icon">📚</span>
          <div>
            <span>Programs</span>
            <strong>4</strong>
          </div>
        </div>

        <div className="trainer-stat-card">
          <span className="trainer-stat-icon">👨‍🎓</span>
          <div>
            <span>Students</span>
            <strong>48</strong>
          </div>
        </div>

        <div className="trainer-stat-card">
          <span className="trainer-stat-icon">📝</span>
          <div>
            <span>Assignments</span>
            <strong>12</strong>
          </div>
        </div>

        <div className="trainer-stat-card">
          <span className="trainer-stat-icon">📊</span>
          <div>
            <span>Assessments</span>
            <strong>6</strong>
          </div>
        </div>
      </section>

      <section className="trainer-dashboard-section">
        <h2>Trainer Management</h2>

        <div className="trainer-menu-grid">
          <Link to="/trainer-profile" className="trainer-menu-card">
            <span>👤</span>
            <h3>My Profile</h3>
            <p>View trainer profile and personal information.</p>
          </Link>

          <Link to="/trainer-programs" className="trainer-menu-card">
            <span>📚</span>
            <h3>Training Programs</h3>
            <p>Manage assigned training programs.</p>
          </Link>

          <Link to="/trainer-modules" className="trainer-menu-card">
            <span>📖</span>
            <h3>Training Modules</h3>
            <p>Manage modules and learning content.</p>
          </Link>

          <Link to="/trainer-students" className="trainer-menu-card">
            <span>👨‍🎓</span>
            <h3>Students</h3>
            <p>View students assigned to your programs.</p>
          </Link>

          <Link to="/trainer-attendance" className="trainer-menu-card">
            <span>📅</span>
            <h3>Attendance</h3>
            <p>Monitor student attendance.</p>
          </Link>

          <Link to="/trainer-assignments" className="trainer-menu-card">
            <span>📝</span>
            <h3>Assignments</h3>
            <p>Create and manage assignments.</p>
          </Link>

          <Link to="/trainer-assessments" className="trainer-menu-card">
            <span>📋</span>
            <h3>Assessments</h3>
            <p>Manage tests and assessments.</p>
          </Link>

          <Link to="/trainer-results" className="trainer-menu-card">
            <span>📊</span>
            <h3>Results</h3>
            <p>View student marks and results.</p>
          </Link>

          <Link to="/trainer-projects" className="trainer-menu-card">
            <span>💻</span>
            <h3>Projects</h3>
            <p>Review student project submissions.</p>
          </Link>

          <Link to="/trainer-feedback" className="trainer-menu-card">
            <span>💬</span>
            <h3>Feedback</h3>
            <p>View feedback provided by students.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default TrainerDashboard;