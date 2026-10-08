import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "./TrainingPrograms.css";

function TrainingPrograms() {
  const { user } = useContext(AuthContext);

  const [programs, setPrograms] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // LOAD TRAINING PROGRAMS
  // ==========================================

  useEffect(() => {
    let isMounted = true;

    const loadPrograms = async () => {
      try {
        const response = await api.get("/training-programs");

        if (isMounted) {
          setPrograms(response.data || []);
          setError("");
        }
      } catch (err) {
        console.error("Training Programs Error:", err);

        if (isMounted) {
          setError("Unable to load training programs.");
        }
      }
    };

    loadPrograms();

    return () => {
      isMounted = false;
    };
  }, []);

  // ==========================================
  // LOAD STUDENT ENROLLMENTS
  // ==========================================

  useEffect(() => {
    let isMounted = true;

    const loadEnrollments = async () => {
      if (!user?.id) {
        return;
      }

      try {
        console.log(
          "Loading enrollments for User ID:",
          user.id
        );

        const response = await api.get(
          `/enrollments/user/${user.id}`
        );

        console.log(
          "Student Enrollments:",
          response.data
        );

        if (isMounted) {
          setEnrollments(response.data || []);
        }
      } catch (err) {
        console.error(
          "Enrollment Loading Error:",
          err
        );

        if (isMounted) {
          setEnrollments([]);
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

  // ==========================================
  // CHECK WHETHER STUDENT IS ALREADY ENROLLED
  // ==========================================

  const isAlreadyEnrolled = (programId) => {
    return enrollments.some(
      (enrollment) =>
        enrollment.trainingProgram?.id === programId
    );
  };

  // ==========================================
  // ENROLL STUDENT
  // ==========================================

  const handleEnroll = async (programId) => {

    if (!user?.id) {
      setError(
        "User information not found. Please login again."
      );
      return;
    }

    // Prevent duplicate enrollment
    if (isAlreadyEnrolled(programId)) {
      setMessage(
        "You are already enrolled in this training program."
      );
      return;
    }

    setEnrollingId(programId);
    setMessage("");
    setError("");

    try {

      const response = await api.post(
        `/enrollments/user/${user.id}?trainingProgramId=${programId}`
      );

      console.log(
        "Enrollment Created:",
        response.data
      );

      // Add newly created enrollment to state
      setEnrollments((previousEnrollments) => [
        ...previousEnrollments,
        response.data,
      ]);

      setMessage(
        "You have been enrolled in the training program."
      );

    } catch (err) {

      console.error(
        "Enrollment Error:",
        err
      );

      if (err.response) {

        const responseData =
          err.response.data;

        setError(
          typeof responseData === "string"
            ? responseData
            : responseData?.message ||
              "Unable to enroll in this program."
        );

      } else {

        setError(
          "Unable to connect to backend."
        );
      }

    } finally {

      setEnrollingId(null);

    }
  };

  return (
    <div className="programs-page">

      {/* ======================================
          HEADER
      ======================================= */}

      <header className="programs-header">

        <div>

          <h1>
            Training Programs
          </h1>

          <p>
            Explore available training programs
            and continue your learning journey.
          </p>

        </div>

        <Link
          to="/student-dashboard"
          className="back-button"
        >
          ← Dashboard
        </Link>

      </header>


      {/* ======================================
          PROGRAM SUMMARY
      ======================================= */}

      <div className="program-summary">

        <div className="summary-icon">
          📚
        </div>

        <div>

          <span>
            Available Programs
          </span>

          <strong>
            {programs.length}
          </strong>

        </div>

      </div>


      {/* ======================================
          SUCCESS MESSAGE
      ======================================= */}

      {message && (

        <div className="program-success">

          <span>
            ✅
          </span>

          <p>
            {message}
          </p>

        </div>

      )}


      {/* ======================================
          LOADING
      ======================================= */}

      {loading && (

        <div className="program-message">

          <div className="loading-icon">
            ⏳
          </div>

          <h3>
            Loading Training Programs
          </h3>

          <p>
            Please wait while we fetch
            the available programs.
          </p>

        </div>

      )}


      {/* ======================================
          ERROR
      ======================================= */}

      {!loading && error && (

        <div className="program-error">

          <span>
            ⚠️
          </span>

          <div>

            <strong>
              Unable to process request
            </strong>

            <p>
              {error}
            </p>

          </div>

        </div>

      )}


      {/* ======================================
          NO PROGRAMS
      ======================================= */}

      {!loading &&
        !error &&
        programs.length === 0 && (

          <div className="program-message">

            <div className="empty-icon">
              📚
            </div>

            <h3>
              No Training Programs Available
            </h3>

            <p>
              There are currently no training
              programs available for students.
            </p>

          </div>

        )}


      {/* ======================================
          PROGRAM LIST
      ======================================= */}

      {!loading &&
        programs.length > 0 && (

          <section className="program-section">

            <div className="section-heading">

              <div>

                <h2>
                  Available Programs
                </h2>

                <p>
                  Select a program to view
                  its training modules.
                </p>

              </div>

            </div>


            <div className="program-grid">

              {programs.map((program) => {

                const alreadyEnrolled =
                  isAlreadyEnrolled(
                    program.id
                  );

                return (

                  <div
                    className="program-card"
                    key={program.id}
                  >

                    {/* ==========================
                        PROGRAM TOP
                    =========================== */}

                    <div className="program-card-top">

                      <div className="program-icon">
                        📚
                      </div>

                      <span className="program-status">
                        {program.status ||
                          "Active"}
                      </span>

                    </div>


                    {/* ==========================
                        TITLE
                    =========================== */}

                    <h2>
                      {program.title ||
                        "Training Program"}
                    </h2>


                    {/* ==========================
                        DESCRIPTION
                    =========================== */}

                    <p className="program-description">

                      {program.description ||
                        "Develop your technical skills through this structured training program."}

                    </p>


                    {/* ==========================
                        DETAILS
                    =========================== */}

                    <div className="program-details">

                      <div className="program-detail">

                        <span>
                          Trainer
                        </span>

                        <strong>
                          {program.trainer ||
                            "Assigned Trainer"}
                        </strong>

                      </div>


                      <div className="program-detail">

                        <span>
                          Duration
                        </span>

                        <strong>
                          {program.duration ||
                            "Not specified"}
                        </strong>

                      </div>


                      <div className="program-detail">

                        <span>
                          Level
                        </span>

                        <strong>
                          {program.level ||
                            "All Levels"}
                        </strong>

                      </div>

                    </div>


                    {/* ==========================
                        ACTIONS
                    =========================== */}

                    <div className="program-actions">

                      <Link
                        to={`/training-modules?programId=${program.id}`}
                        className="view-program-button"
                      >
                        View Modules
                        <span>
                          →
                        </span>
                      </Link>


                      {/* ========================
                          ENROLL BUTTON
                      ========================= */}

                      <button
                        className={
                          alreadyEnrolled
                            ? "enroll-button enrolled-button"
                            : "enroll-button"
                        }
                        onClick={() =>
                          handleEnroll(
                            program.id
                          )
                        }
                        disabled={
                          alreadyEnrolled ||
                          enrollingId ===
                            program.id
                        }
                      >

                        {enrollingId ===
                        program.id

                          ? "Enrolling..."

                          : alreadyEnrolled

                          ? "Already Enrolled"

                          : "Enroll Now"}

                      </button>

                    </div>

                  </div>

                );

              })}

            </div>

          </section>

        )}

    </div>
  );
}

export default TrainingPrograms;
