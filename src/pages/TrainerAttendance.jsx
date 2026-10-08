import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./TrainerAttendance.css";

function TrainerAttendance() {
  const navigate = useNavigate();

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

  const [programs, setPrograms] = useState([]);
  const [submittedPrograms, setSubmittedPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/training-programs");

        const programData = response.data || [];

        setPrograms(programData);

        // Get all students
        const studentsResponse = await api.get("/students");
        const students = studentsResponse.data || [];

        // Get today's date
        const today = new Date();

        const todayDate =
          today.getFullYear() +
          "-" +
          String(today.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(today.getDate()).padStart(2, "0");

        const completedPrograms = [];

        // Check today's attendance for every program
        for (const program of programData) {
          try {
            const attendanceResponse = await api.get(
              `/attendance/program/${program.id}`
            );

            const attendanceRecords =
              attendanceResponse.data || [];

            const todayRecords = attendanceRecords.filter(
              (record) =>
                record.attendanceDate === todayDate
            );

            // Get students who have attendance today
            const studentIds = new Set(
              todayRecords
                .map((record) => record.student?.id)
                .filter(
                  (id) =>
                    id !== undefined &&
                    id !== null
                )
            );

            // If all students have attendance today,
            // this program is already completed.
            if (
              students.length > 0 &&
              studentIds.size >= students.length
            ) {
              completedPrograms.push(program.id);
            }
          } catch (attendanceError) {
            console.error(
              `Attendance check failed for program ${program.id}:`,
              attendanceError
            );
          }
        }

        setSubmittedPrograms(completedPrograms);
      } catch (err) {
        console.error(
          "Training Programs API Error:",
          err
        );

        if (err.response?.data) {
          if (
            typeof err.response.data === "string"
          ) {
            setError(err.response.data);
          } else if (
            err.response.data.message
          ) {
            setError(
              err.response.data.message
            );
          } else {
            setError(
              "Unable to load training programs."
            );
          }
        } else {
          setError(
            "Unable to connect to backend."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadPrograms();
  }, []);

  const handleMarkAttendance = (program) => {
    navigate(
      `/trainer-attendance/session/${program.id}`,
      {
        state: {
          program,
        },
      }
    );
  };

  // =========================
  // ACCESS RESTRICTION
  // =========================

  if (!canManageAttendance) {
    return (
      <div className="trainer-attendance-page">

        <header className="trainer-attendance-header">

          <div>
            <h1>Attendance</h1>

            <p>
              Attendance management is assigned
              to the designated trainer.
            </p>
          </div>

          <Link
            to="/trainer-dashboard"
            className="trainer-attendance-back"
          >
            ← Dashboard
          </Link>

        </header>

        <section className="trainer-attendance-info">

          <div className="trainer-info-icon">
            🔒
          </div>

          <div>

            <h3>
              Attendance Access Restricted
            </h3>

            <p>
              Only the designated trainer can
              manage student attendance.
            </p>

          </div>

        </section>

      </div>
    );
  }

  return (
    <div className="trainer-attendance-page">

      {/* =========================
          HEADER
      ========================== */}

      <header className="trainer-attendance-header">

        <div>

          <h1>
            Attendance
          </h1>

          <p>
            Select a training program to update
            student attendance.
          </p>

        </div>

        <Link
          to="/trainer-dashboard"
          className="trainer-attendance-back"
        >
          ← Dashboard
        </Link>

      </header>


      {/* =========================
          TRAINING PROGRAMS
      ========================== */}

      <section className="trainer-attendance-section">

        <div className="trainer-attendance-section-header">

          <div>

            <h2>
              Training Programs
            </h2>

            <p>
              Select a training program to mark
              today's attendance.
            </p>

          </div>

          {!loading && !error && (
            <span className="trainer-session-count">

              {programs.length}{" "}

              {programs.length === 1
                ? "Program"
                : "Programs"}

            </span>
          )}

        </div>


        {/* =========================
            LOADING
        ========================== */}

        {loading && (

          <div className="trainer-attendance-message">

            <div className="trainer-message-icon">
              📚
            </div>

            <h3>
              Loading Training Programs...
            </h3>

            <p>
              Please wait while your training
              programs are loaded.
            </p>

          </div>

        )}


        {/* =========================
            ERROR
        ========================== */}

        {!loading && error && (

          <div className="trainer-attendance-message error">

            <div className="trainer-message-icon">
              ⚠️
            </div>

            <h3>
              Unable to Load Programs
            </h3>

            <p>
              {error}
            </p>

          </div>

        )}


        {/* =========================
            NO PROGRAMS
        ========================== */}

        {!loading &&
          !error &&
          programs.length === 0 && (

            <div className="trainer-attendance-message">

              <div className="trainer-message-icon">
                📚
              </div>

              <h3>
                No Training Programs
              </h3>

              <p>
                No active training programs are
                available for attendance.
              </p>

            </div>

          )}


        {/* =========================
            PROGRAM LIST
        ========================== */}

        {!loading &&
          !error &&
          programs.length > 0 && (

            <div className="trainer-session-list">

              {programs.map(
                (program, index) => {

                  const isSubmitted =
                    submittedPrograms.includes(
                      program.id
                    );

                  return (

                    <div
                      className="trainer-session-card"
                      key={program.id}
                    >

                      {/* Number */}

                      <div className="trainer-session-number">

                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}

                      </div>


                      {/* Program Information */}

                      <div className="trainer-session-info">

                        <h3>
                          {program.title}
                        </h3>

                        <div className="trainer-program-details">

                          <span>
                            👨‍🏫{" "}
                            {program.trainer ||
                              "Trainer not assigned"}
                          </span>

                          <span>
                            ⏱️{" "}
                            {program.duration ||
                              "Duration not specified"}
                          </span>

                          <span>
                            📊{" "}
                            {program.level ||
                              "Level not specified"}
                          </span>

                        </div>

                        <span
                          className={
                            program.status ===
                            "ACTIVE"
                              ? "trainer-session-type active"
                              : "trainer-session-type"
                          }
                        >
                          {program.status ||
                            "NOT SPECIFIED"}
                        </span>

                      </div>


                      {/* =========================
                          ACTION
                      ========================== */}

                      {isSubmitted ? (

                        <button
                          type="button"
                          className="trainer-mark-attendance-btn"
                          disabled
                        >
                          Attendance Submitted
                          <span>✓</span>
                        </button>

                      ) : (

                        <button
                          type="button"
                          className="trainer-mark-attendance-btn"
                          onClick={() =>
                            handleMarkAttendance(
                              program
                            )
                          }
                        >
                          Mark Attendance
                          <span>→</span>
                        </button>

                      )}

                    </div>

                  );
                }
              )}

            </div>

          )}

      </section>


      {/* =========================
          INFORMATION
      ========================== */}

      <section className="trainer-attendance-info">

        <div className="trainer-info-icon">
          ℹ️
        </div>

        <div>

          <h3>
            Attendance Instructions
          </h3>

          <p>
            Select the required training program.
            You will then see the students assigned
            to that program and can mark each student
            as Present or Absent.
          </p>

        </div>

      </section>

    </div>
  );
}

export default TrainerAttendance;