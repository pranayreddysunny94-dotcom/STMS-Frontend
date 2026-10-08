import { Link } from "react-router-dom";
import "./AdminReports.css";

function AdminReports() {
  return (
    <div className="admin-reports-page">
      <header className="admin-reports-header">
        <div>
          <h1>System Reports</h1>
          <p>Overview of Student Training Management System statistics.</p>
        </div>

        <Link to="/admin-dashboard">← Dashboard</Link>
      </header>

      <section className="report-summary-grid">
        <div className="report-summary-card">
          <span>👥</span>
          <div>
            <label>Total Users</label>
            <strong>72</strong>
          </div>
        </div>

        <div className="report-summary-card">
          <span>👨‍🎓</span>
          <div>
            <label>Total Students</label>
            <strong>48</strong>
          </div>
        </div>

        <div className="report-summary-card">
          <span>👨‍🏫</span>
          <div>
            <label>Total Trainers</label>
            <strong>12</strong>
          </div>
        </div>

        <div className="report-summary-card">
          <span>📚</span>
          <div>
            <label>Total Programs</label>
            <strong>12</strong>
          </div>
        </div>
      </section>

      <section className="report-section">
        <h2>Training Statistics</h2>

        <div className="report-stat-grid">
          <div className="report-stat-box">
            <span>Active Programs</span>
            <strong>10</strong>
            <small>Currently available</small>
          </div>

          <div className="report-stat-box">
            <span>Active Modules</span>
            <strong>32</strong>
            <small>Across all programs</small>
          </div>

          <div className="report-stat-box">
            <span>Total Enrollments</span>
            <strong>86</strong>
            <small>Student enrollments</small>
          </div>

          <div className="report-stat-box">
            <span>Average Attendance</span>
            <strong>89%</strong>
            <small>Across all students</small>
          </div>
        </div>
      </section>

      <section className="report-section">
        <h2>Assessment Statistics</h2>

        <div className="report-assessment-grid">
          <div className="assessment-report-card">
            <span>Total Assessments</span>
            <strong>18</strong>
          </div>

          <div className="assessment-report-card">
            <span>Completed Assessments</span>
            <strong>15</strong>
          </div>

          <div className="assessment-report-card">
            <span>Average Score</span>
            <strong>82%</strong>
          </div>
        </div>
      </section>

      <section className="report-section">
        <h2>System Activity</h2>

        <div className="activity-list">
          <div className="activity-item">
            <span>👤</span>
            <div>
              <strong>New student registered</strong>
              <p>Kiran Kumar joined the system.</p>
            </div>
            <small>Today</small>
          </div>

          <div className="activity-item">
            <span>📚</span>
            <div>
              <strong>Training program updated</strong>
              <p>Full Stack Java Development was updated.</p>
            </div>
            <small>Yesterday</small>
          </div>

          <div className="activity-item">
            <span>📝</span>
            <div>
              <strong>Assessment completed</strong>
              <p>Students completed Java Fundamentals Test.</p>
            </div>
            <small>2 days ago</small>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminReports;