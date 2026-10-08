import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./StudentProfile.css";

function StudentProfile() {
  const { user } = useContext(AuthContext);

  const name = user?.name || "Student";
  const email = user?.email || "Not available";
  const role = user?.role || "STUDENT";

  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="student-profile-page">

      <div className="profile-header">
        <div>
          <h1>My Profile</h1>
          <p>View your student account information.</p>
        </div>

        <Link to="/student-dashboard" className="back-button">
          ← Dashboard
        </Link>
      </div>

      <div className="profile-layout">

        <div className="profile-card-main">

          <div className="profile-top">
            <div className="profile-avatar">
              {initial}
            </div>

            <div className="profile-name-section">
              <h2>{name}</h2>
              <p>{email}</p>
              <span className="role-badge">{role}</span>
            </div>
          </div>

          <div className="profile-divider"></div>

          <h3>Student Information</h3>

          <div className="profile-information">

            <div className="information-item">
              <span className="information-label">Full Name</span>
              <span className="information-value">{name}</span>
            </div>

            <div className="information-item">
              <span className="information-label">Email Address</span>
              <span className="information-value">{email}</span>
            </div>

            <div className="information-item">
              <span className="information-label">Account Role</span>
              <span className="information-value">{role}</span>
            </div>

            <div className="information-item">
              <span className="information-label">Account Status</span>
              <span className="status-badge">Active</span>
            </div>

          </div>

        </div>

        <div className="profile-side-card">

          <div className="side-icon">🎓</div>

          <h3>Student Account</h3>

          <p>
            Manage your training journey, assignments, assessments,
            skills and overall academic progress through STMS.
          </p>

          <Link to="/training-programs" className="training-button">
            Explore Training Programs
          </Link>

        </div>

      </div>

    </div>
  );
}

export default StudentProfile;