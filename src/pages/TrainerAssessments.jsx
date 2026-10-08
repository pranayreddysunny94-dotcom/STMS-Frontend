import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./TrainerAssessments.css";

function TrainerAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAssessments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/assessments");

        setAssessments(response.data || []);
      } catch (err) {
        console.error("Assessments API Error:", err);

        if (err.response) {
          const data = err.response.data;

          if (typeof data === "string") {
            setError(data);
          } else if (data && data.message) {
            setError(data.message);
          } else {
            setError("Unable to load assessments.");
          }
        } else {
          setError("Unable to connect to backend.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadAssessments();
  }, []);

  return (
    <div className="trainer-assessments-page">

      {/* Header */}

      <header className="trainer-assessments-header">

        <div>
          <h1>Assessments</h1>

          <p>
            Manage tests and assessments for students.
          </p>
        </div>

        <div className="trainer-assessment-actions">

          <Link to="/trainer-dashboard">
            ← Dashboard
          </Link>

          <Link
            to="/trainer-create-assessment"
            className="create-assessment-btn"
          >
            Create Assessment
          </Link>

        </div>

      </header>

      {/* Loading */}

      {loading && (
        <section className="trainer-assessment-grid">

          <div className="trainer-assessment-card">

            <h2>
              Loading Assessments...
            </h2>

            <p>
              Please wait while assessments are loaded.
            </p>

          </div>

        </section>
      )}

      {/* Error */}

      {!loading && error && (
        <section className="trainer-assessment-grid">

          <div className="trainer-assessment-card">

            <h2>
              Unable to Load Assessments
            </h2>

            <p>
              {error}
            </p>

          </div>

        </section>
      )}

      {/* No Assessments */}

      {!loading &&
        !error &&
        assessments.length === 0 && (
          <section className="trainer-assessment-grid">

            <div className="trainer-assessment-card">

              <div className="assessment-icon">
                📋
              </div>

              <h2>
                No Assessments
              </h2>

              <p>
                No assessments are available.
              </p>

            </div>

          </section>
        )}

      {/* Assessment Cards */}

      {!loading &&
        !error &&
        assessments.length > 0 && (
          <section className="trainer-assessment-grid">

            {assessments.map((assessment) => (
              <div
                className="trainer-assessment-card"
                key={assessment.id}
              >

                <div className="assessment-icon">
                  📋
                </div>

                <h2>
                  {assessment.title}
                </h2>

                <p>
                  {assessment.trainingProgram &&
                  assessment.trainingProgram.title
                    ? assessment.trainingProgram.title
                    : "Not Assigned"}
                </p>

                <div className="assessment-details">

                  <span>
                    Duration

                    <strong>
                      {assessment.duration
                        ? `${assessment.duration} Minutes`
                        : "Not specified"}
                    </strong>
                  </span>

                  <span>
                    Total Marks

                    <strong>
                      {assessment.totalMarks !== null &&
                      assessment.totalMarks !== undefined
                        ? assessment.totalMarks
                        : "Not specified"}
                    </strong>
                  </span>

                  <span>
                    Status

                    <strong>
                      {assessment.status
                        ? assessment.status
                        : "Not specified"}
                    </strong>
                  </span>

                </div>

                <Link
                  to={`/trainer-assessments/${assessment.id}`}
                  className="view-assessment-btn"
                >
                  View Assessment
                </Link>

              </div>
            ))}

          </section>
        )}

    </div>
  );
}

export default TrainerAssessments;