import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "./Attendance.css";

function Attendance() {
  const { user } = useContext(AuthContext);

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadAttendance = async () => {
      if (!user?.id) {
        if (isMounted) {
          setError("User information not found.");
          setLoading(false);
        }
        return;
      }

      try {
        const response = await api.get(
          `/attendance/user/${user.id}`
        );

        if (isMounted) {
          setAttendance(response.data || []);
          setError("");
        }
      } catch (err) {
        console.error("Attendance API Error:", err);

        if (isMounted) {
          if (err.response) {
            const responseData = err.response.data;

            setError(
              typeof responseData === "string"
                ? responseData
                : responseData?.message ||
                    "Unable to load attendance."
            );
          } else {
            setError("Unable to connect to backend.");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAttendance();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const totalSessions = attendance.length;

  const presentSessions = attendance.filter(
    (item) => item.status?.toUpperCase() === "PRESENT"
  ).length;

  const absentSessions = attendance.filter(
    (item) => item.status?.toUpperCase() === "ABSENT"
  ).length;

  const attendancePercentage =
    totalSessions > 0
      ? Math.round((presentSessions / totalSessions) * 100)
      : 0;

  return (
    <div className="attendance-page">

      <header className="attendance-header">
        <div>
          <h1>Attendance</h1>
          <p>
            Track your training attendance and session participation.
          </p>
        </div>

        <Link
          to="/student-dashboard"
          className="back-button"
        >
          ← Dashboard
        </Link>
      </header>

      <section className="attendance-summary">

        <div className="attendance-stat">
          <div className="attendance-stat-icon">📅</div>
          <div>
            <span>Total Sessions</span>
            <strong>{totalSessions}</strong>
          </div>
        </div>

        <div className="attendance-stat">
          <div className="attendance-stat-icon">✅</div>
          <div>
            <span>Present</span>
            <strong>{presentSessions}</strong>
          </div>
        </div>

        <div className="attendance-stat">
          <div className="attendance-stat-icon">❌</div>
          <div>
            <span>Absent</span>
            <strong>{absentSessions}</strong>
          </div>
        </div>

        <div className="attendance-stat">
          <div className="attendance-stat-icon">📊</div>
          <div>
            <span>Attendance</span>
            <strong>{attendancePercentage}%</strong>
          </div>
        </div>

      </section>

      {loading && (
        <section className="attendance-card">
          <div className="section-heading">
            <div>
              <h2>Attendance Details</h2>
              <p>Loading your attendance records...</p>
            </div>
          </div>
        </section>
      )}

      {!loading && error && (
        <section className="attendance-card">
          <div className="program-error">
            <span>⚠️</span>
            <div>
              <strong>Unable to load attendance</strong>
              <p>{error}</p>
            </div>
          </div>
        </section>
      )}

      {!loading && !error && attendance.length === 0 && (
        <section className="attendance-card">

          <div className="section-heading">
            <div>
              <h2>Attendance Details</h2>
              <p>Your recent training sessions.</p>
            </div>

            <span className="attendance-percentage">
              0% Attendance
            </span>
          </div>

          <div className="attendance-empty">
            <div>📅</div>
            <h3>No Attendance Records</h3>
            <p>
              Your attendance records will appear here once
              attendance is marked.
            </p>
          </div>

        </section>
      )}

      {!loading && !error && attendance.length > 0 && (
        <section className="attendance-card">

          <div className="section-heading">
            <div>
              <h2>Attendance Details</h2>
              <p>Your recent training sessions.</p>
            </div>

            <span className="attendance-percentage">
              {attendancePercentage}% Attendance
            </span>
          </div>

          <div className="attendance-table-wrapper">

            <table className="attendance-table">

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

                    <td>{index + 1}</td>

                    <td>
                      {item.trainingProgram?.title ||
                        "Training Program"}
                    </td>

                    <td>
                      {item.attendanceDate}
                    </td>

                    <td>
                      <span
                        className={`status ${
                          item.status?.toLowerCase() === "present"
                            ? "present"
                            : "absent"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </section>
      )}

    </div>
  );
}

export default Attendance;