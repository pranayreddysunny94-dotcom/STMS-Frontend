import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./TrainerAssignments.css";

function TrainerAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/assignments");

        setAssignments(response.data || []);
      } catch (err) {
        console.error("Assignments API Error:", err);

        if (err.response) {
          const data = err.response.data;

          if (typeof data === "string") {
            setError(data);
          } else if (data && data.message) {
            setError(data.message);
          } else {
            setError("Unable to load assignments.");
          }
        } else {
          setError("Unable to connect to backend.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadAssignments();
  }, []);

  return (
    <div className="trainer-assignments-page">

      <header className="trainer-assignments-header">
        <div>
          <h1>Assignments</h1>
          <p>
            Manage assignments under your training programs.
          </p>
        </div>

        <Link to="/trainer-dashboard">
          ← Dashboard
        </Link>
      </header>

      {/* Loading */}
      {loading && (
        <section className="trainer-assignments-grid">
          <div className="trainer-assignment-card">
            <h2>Loading Assignments...</h2>
            <p>
              Please wait while assignments are loaded.
            </p>
          </div>
        </section>
      )}

      {/* Error */}
      {!loading && error && (
        <section className="trainer-assignments-grid">
          <div className="trainer-assignment-card">
            <h2>Unable to Load Assignments</h2>
            <p>{error}</p>
          </div>
        </section>
      )}

      {/* No assignments */}
      {!loading &&
        !error &&
        assignments.length === 0 && (
          <section className="trainer-assignments-grid">
            <div className="trainer-assignment-card">

              <div className="trainer-assignment-icon">
                📝
              </div>

              <h2>No Assignments</h2>

              <p>
                No assignments are available.
              </p>

            </div>
          </section>
        )}

      {/* Assignments */}
      {!loading &&
        !error &&
        assignments.length > 0 && (
          <section className="trainer-assignments-grid">

            {assignments.map((assignment) => (
              <div
                className="trainer-assignment-card"
                key={assignment.id}
              >

                <div className="trainer-assignment-icon">
                  📝
                </div>

                <h2>
                  {assignment.title}
                </h2>

                <p>
                  {assignment.description}
                </p>

                <div className="trainer-assignment-details">

                  <span>
                    Program

                    <strong>
                      {assignment.trainingProgram &&
                      assignment.trainingProgram.title
                        ? assignment.trainingProgram.title
                        : "Not Assigned"}
                    </strong>
                  </span>

                  <span>
                    Due Date

                    <strong>
                      {assignment.dueDate
                        ? assignment.dueDate
                        : "Not specified"}
                    </strong>
                  </span>

                  <span>
                    Status

                    <strong>
                      {assignment.status
                        ? assignment.status
                        : "Not specified"}
                    </strong>
                  </span>

                </div>

                {/* Manage Assignment */}
                <Link
                  to={`/trainer-assignments/${assignment.id}`}
                  className="manage-assignment-btn"
                >
                  Manage Assignment
                </Link>

              </div>
            ))}

          </section>
        )}

    </div>
  );
}

export default TrainerAssignments;