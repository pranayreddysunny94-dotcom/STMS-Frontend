import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./TrainerProfile.css";

function TrainerProfile() {
  const { user } = useContext(AuthContext);

  return (
    <div className="trainer-profile-page">

      <header className="trainer-profile-header">

        <div>
          <h1>Trainer Profile</h1>
          <p>View your trainer information.</p>
        </div>

        <Link to="/trainer-dashboard">
          ← Dashboard
        </Link>

      </header>

      <section className="trainer-profile-card">

        <div className="trainer-profile-top">

          <div className="trainer-avatar">
            {user?.name?.charAt(0).toUpperCase() || "TR"}
          </div>

          <div>

            <h2>
              {user?.name || "Trainer"}
            </h2>

            <p>
              Trainer
            </p>

            <span>
              Active Trainer
            </span>

          </div>

        </div>

        <div className="trainer-profile-grid">

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
              {user?.role || "TRAINER"}
            </strong>
          </div>

          <div>
            <label>Trainer ID</label>
            <strong>
              {user?.id || "Not available"}
            </strong>
          </div>

          <div>
            <label>Phone</label>
            <strong>
              Not available
            </strong>
          </div>

          <div>
            <label>Specialization</label>
            <strong>
              Not available
            </strong>
          </div>

        </div>

      </section>

    </div>
  );
}

export default TrainerProfile;