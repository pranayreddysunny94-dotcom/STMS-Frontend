import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import "./ManageAssignment.css";

function ManageAssignment() {
  const { id } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAssignment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/assignments/${id}`);

        setAssignment(response.data);
      } catch (err) {
        console.error("Assignment API Error:", err);

        if (err.response) {
          const data = err.response.data;

          if (typeof data === "string") {
            setError(data);
          } else if (data && data.message) {
            setError(data.message);
          } else {
            setError("Unable to load assignment.");
          }
        } else {
          setError("Unable to connect to backend.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadAssignment();
  }, [id]);

  if (loading) {
    return (
      <div className="manage-assignment-page">
        <div className="manage-assignment-message">
          <h2>Loading Assignment...</h2>
          <p>Please wait while the assignment is loaded.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-assignment-page">
        <div className="manage-assignment-message">
          <h2>Unable to Load Assignment</h2>
          <p>{error}</p>

          <div className="manage-assignment-actions">
            <Link
              to="/trainer-assignments"
              className="manage-assignment-action"
            >
              ← Back to Assignments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-assignment-page">

      <header className="manage-assignment-header">
        <div>
          <h1>Manage Assignment</h1>
          <p>
            View and manage assignment details.
          </p>
        </div>

        <Link
          to="/trainer-assignments"
          className="manage-assignment-back"
        >
          ← Assignments
        </Link>
      </header>

      <main className="manage-assignment-container">

        <section className="manage-assignment-card">

          <div className="manage-assignment-icon">
            📝
          </div>

          <h2>{assignment.title}</h2>

          <p className="manage-assignment-description">
            {assignment.description}
          </p>

          <div className="manage-assignment-details">

            <div className="manage-assignment-detail">
              <span>Training Program</span>

              <strong>
                {assignment.trainingProgram &&
                assignment.trainingProgram.title
                  ? assignment.trainingProgram.title
                  : "Not Assigned"}
              </strong>
            </div>

            <div className="manage-assignment-detail">
              <span>Due Date</span>

              <strong>
                {assignment.dueDate
                  ? assignment.dueDate
                  : "Not specified"}
              </strong>
            </div>

            <div className="manage-assignment-detail">
              <span>Status</span>

              <strong className="manage-assignment-status">
                {assignment.status
                  ? assignment.status
                  : "Not specified"}
              </strong>
            </div>

          </div>

          <div className="manage-assignment-actions">

            <Link
              to="/trainer-assignments"
              className="manage-assignment-action"
            >
              ← Back to Assignments
            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default ManageAssignment;