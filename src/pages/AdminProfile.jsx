import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./AdminProfile.css";

function AdminProfile() {
  const { user } = useContext(AuthContext);

  return (
    <div className="admin-profile-page">

      <header className="admin-profile-header">

        <div>
          <h1>Admin Profile</h1>
          <p>View your administrator information.</p>
        </div>

        <Link to="/admin-dashboard">
          ← Dashboard
        </Link>

      </header>

      <section className="admin-profile-card">

        <div className="admin-profile-top">

          <div className="admin-avatar">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>

          <div>

            <h2>
              {user?.name || "Administrator"}
            </h2>

            <p>
              System Administrator
            </p>

            <span>
              Active Admin
            </span>

          </div>

        </div>

        <div className="admin-profile-grid">

          <div>
            <label>Full Name</label>
            <strong>
              {user?.name || "Not available"}
            </strong>
          </div>

          <div>
            <label>Email</label>
            <strong>
              {user?.email || "Not available"}
            </strong>
          </div>

          <div>
            <label>Role</label>
            <strong>
              {user?.role || "ADMIN"}
            </strong>
          </div>

          <div>
            <label>Admin ID</label>
            <strong>
              {user?.id || "Not available"}
            </strong>
          </div>

          <div>
            <label>Account Status</label>
            <strong>
              Active
            </strong>
          </div>

          <div>
            <label>Access Level</label>
            <strong>
              Administrator
            </strong>
          </div>

        </div>

      </section>

    </div>
  );
}

export default AdminProfile;