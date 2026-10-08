import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./StudentAttendance.css";

function StudentAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        setLoading(true);
        setError("");

        if (!userId) {
          setError("Student login information not found.");
          return;
        }

        const response = await api.get(
          `/attendance/user/${userId}`
        );

        setAttendance(response.data || []);
      } catch (err) {
        console.error("Attendance API Error:", err);

        if (err.response?.data) {
          if (typeof err.response.data === "string") {
            setError(err.response.data);
          } else if (err.response.data.message) {
            setError(err.response.data.message);
          } else {
            setError("Unable to load attendance.");
          }
        } else {
          setError("Unable to connect to backend.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadAttendance();
  }, [userId]);

  const presentCount = attendance.filter(
    (item) => item.status === "PRESENT"
  ).length;

  const absentCount = attendance.filter(
    (item) => item.status === "ABSENT"
  ).length;

  const totalClasses = attendance.length;

  const percentage =
    totalClasses > 0
      ? ((presentCount / totalClasses) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="student-attendance-page">

      <header className="student-attendance-header">

        <div>
          <h1>My Attendance</h1>

          <p>
            View your training attendance records.
          </p>
        </div>

        <Link
          to="/student-dashboard"
          className="student-attendance-back"
        >
          ← Dashboard
        </Link>

      </header>

      <section className="student-attendance-summary">

        <div className="student-attendance-summary-card">
          <span>📚</span>

          <div>
            <p>Total Classes</p>
            <strong>{totalClasses}</strong>
          </div>
        </div>

        <div className="student-attendance-summary-card present">
          <span>✓</span>

          <div>
            <p>Present</p>
            <strong>{presentCount}</strong>
          </div>
        </div>

        <div className="student-attendance-summary-card absent">
          <span>✕</span>

          <div>
            <p>Absent</p>
            <strong>{absentCount}</strong>
          </div>
        </div>

        <div className="student-attendance-summary-card percentage">
          <span>📊</span>

          <div>
            <p>Attendance</p>
            <strong>{percentage}%</strong>
          </div>
        </div>

      </section>

      <section className="student-attendance-card">

        <div className="student-attendance-card-header">

          <div>
            <h2>Attendance History</h2>

            <p>
              Your attendance recorded by the trainer.
            </p>
          </div>

        </div>

        {loading && (
          <div className="student-attendance-message">
            <span>📚</span>

            <h3>Loading Attendance...</h3>

            <p>Please wait.</p>
          </div>
        )}

        {!loading && error && (
          <div className="student-attendance-message error">
            <span>⚠️</span>

            <h3>Unable to Load Attendance</h3>

            <p>{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          attendance.length === 0 && (
            <div className="student-attendance-message">
              <span>📅</span>

              <h3>No Attendance Records</h3>

              <p>
                Your trainer has not recorded any attendance yet.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          attendance.length > 0 && (
            <div className="student-attendance-table-wrapper">

              <table className="student-attendance-table">

                <thead>
                  <tr>
                    <th>#</th>
                    <th>Training Program</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {attendance.map((item, index) => (

                    <tr key={item.id}>

                      <td>
                        {index + 1}
                      </td>

                      <td>
                        {item.trainingProgram?.title ||
                          "Training Program"}
                      </td>

                      <td>
                        {item.attendanceDate}
                      </td>

                      <td>

                        <span
                          className={
                            item.status === "PRESENT"
                              ? "student-status present"
                              : "student-status absent"
                          }
                        >
                          {item.status === "PRESENT"
                            ? "✓ Present"
                            : "✕ Absent"}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

      </section>

    </div>
  );
}

export default StudentAttendance;