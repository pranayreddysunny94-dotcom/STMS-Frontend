import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "./Enrollments.css";

function Enrollments() {
  const { user } = useContext(AuthContext);

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadEnrollments = async () => {
      if (!user?.id) {
        if (isMounted) {
          setError("User information not found.");
          setLoading(false);
        }
        return;
      }

      try {
        console.log("Loading enrollments for User ID:", user.id);

        const response = await api.get(
          `/enrollments/user/${user.id}`
        );

        console.log("Enrollment response:", response.data);

        if (isMounted) {
          setEnrollments(response.data);
          setError("");
        }
      } catch (err) {
        console.error("Enrollment API Error:", err);

        if (isMounted) {
          if (err.response) {
            const responseData = err.response.data;

            setError(
              `Error ${err.response.status}: ${
                typeof responseData === "string"
                  ? responseData
                  : JSON.stringify(responseData)
              }`
            );
          } else if (err.request) {
            setError("Backend server did not respond.");
          } else {
            setError("Unable to send request to backend.");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadEnrollments();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <div className="enrollments-page">

      <header className="enrollments-header">
        <div>
          <h1>My Enrollments</h1>
          <p>
            View the training programs you are enrolled in.
          </p>
        </div>

        <Link
          to="/student-dashboard"
          className="back-button"
        >
          ← Dashboard
        </Link>
      </header>

      {loading && (
        <div className="enrollment-message">
          Loading enrollments...
        </div>
      )}

      {error && (
        <div className="enrollment-error">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        enrollments.length === 0 && (
          <div className="enrollment-message">
            You are not enrolled in any training programs yet.
          </div>
        )}

      {!loading &&
        !error &&
        enrollments.length > 0 && (
          <div className="enrollment-grid">

            {enrollments.map((enrollment) => (
              <div
                className="enrollment-card"
                key={enrollment.id}
              >

                <div className="enrollment-icon">
                  📝
                </div>

                <h2>
                  {enrollment.trainingProgram?.title ||
                    "Training Program"}
                </h2>

                <p className="enrollment-description">
                  {enrollment.trainingProgram?.description ||
                    "Training program details"}
                </p>

                <div className="enrollment-details">

                  <div>
                    <strong>Enrollment ID</strong>
                    <span>{enrollment.id}</span>
                  </div>

                  <div>
                    <strong>Enrollment Date</strong>
                    <span>
                      {enrollment.enrollmentDate}
                    </span>
                  </div>

                  <div>
                    <strong>Duration</strong>
                    <span>
                      {enrollment.trainingProgram?.duration ||
                        "-"}
                    </span>
                  </div>

                  <div>
                    <strong>Level</strong>
                    <span>
                      {enrollment.trainingProgram?.level ||
                        "-"}
                    </span>
                  </div>

                  <div>
                    <strong>Status</strong>
                    <span className="enrollment-status">
                      {enrollment.status}
                    </span>
                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

    </div>
  );
}

export default Enrollments;