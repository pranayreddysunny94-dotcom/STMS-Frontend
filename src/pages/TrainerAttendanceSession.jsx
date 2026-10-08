import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../services/api";
import "./TrainerAttendanceSession.css";

function TrainerAttendanceSession() {
  const location = useLocation();

  const program = location.state?.program;

  // =========================
  // ATTENDANCE ACCESS
  // =========================

  const storedUser = localStorage.getItem("user");

  let currentUser = null;

  if (storedUser) {
    try {
      currentUser = JSON.parse(storedUser);
    } catch (error) {
      console.error("Invalid user data:", error);
    }
  }

  const canManageAttendance =
    currentUser?.email === "sumith@gmail.com";

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/students");

        setStudents(response.data || []);
      } catch (err) {
        console.error("Students API Error:", err);

        if (err.response?.data) {
          if (typeof err.response.data === "string") {
            setError(err.response.data);
          } else if (err.response.data.message) {
            setError(err.response.data.message);
          } else {
            setError("Unable to load students.");
          }
        } else {
          setError("Unable to connect to backend.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  const markAttendance = (studentId, status) => {
    setAttendance((previous) => ({
      ...previous,
      [studentId]: status,
    }));

    setSubmitted(false);
  };

  const handleSubmit = async () => {
    if (students.length === 0) {
      alert("No students available.");
      return;
    }

    if (!program?.id) {
      alert("Training program information is missing.");
      return;
    }

    const unmarkedStudents = students.filter(
      (student) => !attendance[student.id]
    );

    if (unmarkedStudents.length > 0) {
      alert(
        `Please mark attendance for all students.\n\n${unmarkedStudents.length} student(s) are still unmarked.`
      );
      return;
    }

    try {
      setSubmitting(true);
      setSubmitted(false);
      setError("");

      const attendanceDate = new Date()
        .toISOString()
        .split("T")[0];

      for (const student of students) {
        await api.post("/attendance", null, {
          params: {
            studentId: student.id,
            trainingProgramId: program.id,
            attendanceDate: attendanceDate,
            status: attendance[student.id],
          },
        });
      }

      setSubmitted(true);

      alert("Attendance submitted successfully.");
    } catch (err) {
      console.error("Attendance Submit Error:", err);

      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          alert(err.response.data);
        } else if (err.response.data.message) {
          alert(err.response.data.message);
        } else {
          alert("Unable to submit attendance.");
        }
      } else {
        alert("Unable to connect to backend.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const presentCount = students.filter(
    (student) => attendance[student.id] === "PRESENT"
  ).length;

  const absentCount = students.filter(
    (student) => attendance[student.id] === "ABSENT"
  ).length;

  const unmarkedCount =
    students.length - presentCount - absentCount;

  // =========================
  // ACCESS RESTRICTION
  // =========================

  if (!canManageAttendance) {
    return (
      <div className="trainer-attendance-session-page">

        <header className="trainer-session-header">

          <div>
            <h1>
              Attendance Access Restricted
            </h1>

            <p>
              Only the designated trainer can
              manage student attendance.
            </p>
          </div>

          <Link
            to="/trainer-attendance"
            className="trainer-session-back"
          >
            ← Back
          </Link>

        </header>

      </div>
    );
  }

  return (
    <div className="trainer-attendance-session-page">

      {/* =========================
          HEADER
      ========================== */}

      <header className="trainer-session-header">

        <div>

          <h1>
            Mark Attendance
          </h1>

          <p>
            {program?.title || "Training Program"}
          </p>

        </div>

        <Link
          to="/trainer-attendance"
          className="trainer-session-back"
        >
          ← Back
        </Link>

      </header>


      {/* =========================
          PROGRAM INFORMATION
      ========================== */}

      <section className="trainer-session-program">

        <div className="trainer-session-program-main">

          <span className="trainer-session-icon">
            📚
          </span>

          <div>

            <h2>
              {program?.title || "Training Program"}
            </h2>

            <p>
              {program?.trainer || "Trainer"}
            </p>

          </div>

        </div>

        <div className="trainer-session-date">

          <span>
            Today's Attendance
          </span>

          <strong>
            {new Date().toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )}
          </strong>

        </div>

      </section>


      {/* =========================
          ATTENDANCE SUMMARY
      ========================== */}

      <section className="trainer-attendance-summary">

        <div className="attendance-summary-card">

          <span className="summary-icon">
            👨‍🎓
          </span>

          <div>
            <span>Total Students</span>
            <strong>{students.length}</strong>
          </div>

        </div>


        <div className="attendance-summary-card present">

          <span className="summary-icon">
            ✓
          </span>

          <div>
            <span>Present</span>
            <strong>{presentCount}</strong>
          </div>

        </div>


        <div className="attendance-summary-card absent">

          <span className="summary-icon">
            ✕
          </span>

          <div>
            <span>Absent</span>
            <strong>{absentCount}</strong>
          </div>

        </div>


        <div className="attendance-summary-card pending">

          <span className="summary-icon">
            ⏳
          </span>

          <div>
            <span>Not Marked</span>
            <strong>{unmarkedCount}</strong>
          </div>

        </div>

      </section>


      {/* =========================
          SUBMITTED MESSAGE
      ========================== */}

      {submitted && (

        <div className="attendance-submit-message">

          <div className="submit-message-icon">
            ✓
          </div>

          <div>

            <h3>
              Attendance Submitted
            </h3>

            <p>
              Attendance for all {students.length} students
              has been saved.
            </p>

          </div>

        </div>

      )}


      {/* =========================
          STUDENT ATTENDANCE
      ========================== */}

      <section className="trainer-student-attendance-card">

        <div className="trainer-student-attendance-header">

          <div>

            <h2>
              Student Attendance
            </h2>

            <p>
              Mark each student as Present or Absent.
            </p>

          </div>

        </div>


        {/* =========================
            LOADING
        ========================== */}

        {loading && (

          <div className="trainer-session-message">

            <div>
              📚
            </div>

            <h3>
              Loading Students...
            </h3>

            <p>
              Please wait.
            </p>

          </div>

        )}


        {/* =========================
            ERROR
        ========================== */}

        {!loading && error && (

          <div className="trainer-session-message error">

            <div>
              ⚠️
            </div>

            <h3>
              Unable to Load Students
            </h3>

            <p>
              {error}
            </p>

          </div>

        )}


        {/* =========================
            NO STUDENTS
        ========================== */}

        {!loading &&
          !error &&
          students.length === 0 && (

            <div className="trainer-session-message">

              <div>
                👨‍🎓
              </div>

              <h3>
                No Students Found
              </h3>

              <p>
                No student records are available.
              </p>

            </div>

          )}


        {/* =========================
            STUDENT TABLE
        ========================== */}

        {!loading &&
          !error &&
          students.length > 0 && (

            <div className="trainer-student-table-wrapper">

              <table className="trainer-student-table">

                <thead>

                  <tr>

                    <th>
                      #
                    </th>

                    <th>
                      Student
                    </th>

                    <th>
                      Roll Number
                    </th>

                    <th>
                      Department
                    </th>

                    <th>
                      Attendance
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {students.map(
                    (student, index) => (

                      <tr key={student.id}>

                        <td className="student-number">
                          {index + 1}
                        </td>

                        <td>

                          <div className="student-name-cell">

                            <div className="student-avatar">

                              {student.user?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "S"}

                            </div>

                            <div>

                              <strong>
                                {student.user?.name ||
                                  `Student ${index + 1}`}
                              </strong>

                              <span>
                                {student.user?.email ||
                                  "Student"}
                              </span>

                            </div>

                          </div>

                        </td>

                        <td className="student-roll">

                          {student.rollNumber}

                        </td>

                        <td>

                          {student.department ||
                            "Not Assigned"}

                        </td>

                        <td>

                          <div className="attendance-actions">

                            <button
                              type="button"
                              disabled={submitting}
                              className={
                                attendance[
                                  student.id
                                ] === "PRESENT"
                                  ? "attendance-btn present active"
                                  : "attendance-btn present"
                              }
                              onClick={() =>
                                markAttendance(
                                  student.id,
                                  "PRESENT"
                                )
                              }
                            >
                              ✓ Present
                            </button>


                            <button
                              type="button"
                              disabled={submitting}
                              className={
                                attendance[
                                  student.id
                                ] === "ABSENT"
                                  ? "attendance-btn absent active"
                                  : "attendance-btn absent"
                              }
                              onClick={() =>
                                markAttendance(
                                  student.id,
                                  "ABSENT"
                                )
                              }
                            >
                              ✕ Absent
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

      </section>


      {/* =========================
          SUBMIT
      ========================== */}

      {!loading &&
        !error &&
        students.length > 0 && (

          <div className="trainer-submit-area">

            <button
              type="button"
              className="trainer-submit-attendance"
              onClick={handleSubmit}
              disabled={
                submitting || submitted
              }
            >

              {submitting
                ? "Submitting Attendance..."
                : submitted
                ? "Attendance Submitted"
                : "Submit Attendance"}

            </button>

          </div>

        )}

    </div>
  );
}

export default TrainerAttendanceSession;