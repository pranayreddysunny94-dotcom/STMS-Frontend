import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Assignments.css";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD ASSIGNMENTS + STUDENT SUBMISSIONS
  // ==========================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        // --------------------------------------
        // GET LOGGED-IN STUDENT
        // --------------------------------------

        const userData = sessionStorage.getItem("user");

        if (!userData) {
          setError("Student information not found. Please login again.");
          return;
        }

        const user = JSON.parse(userData);

        const studentId = user.id;

        if (!studentId) {
          setError("Student ID not found. Please login again.");
          return;
        }

        console.log("Logged-in Student ID:", studentId);

        // --------------------------------------
        // GET ASSIGNMENTS
        // --------------------------------------

        const assignmentResponse =
          await api.get("/assignments");

        const assignmentData =
          assignmentResponse.data || [];

        console.log(
          "Assignments:",
          assignmentData
        );

        setAssignments(assignmentData);

        // --------------------------------------
        // GET STUDENT SUBMISSIONS
        // --------------------------------------

        const submissionResponse =
          await api.get(
            `/assignment-submissions/student/${studentId}`
          );

        const submissionData =
          submissionResponse.data || [];

        console.log(
          "Student Submissions:",
          submissionData
        );

        setSubmissions(submissionData);

      } catch (err) {
        console.error(
          "Assignments API Error:",
          err
        );

        if (err.response?.data) {

          if (
            typeof err.response.data ===
            "string"
          ) {
            setError(
              err.response.data
            );
          }

          else if (
            err.response.data.message
          ) {
            setError(
              err.response.data.message
            );
          }

          else {
            setError(
              "Unable to load assignments."
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

    loadData();

  }, []);


  // ==========================================
  // CHECK WHETHER ASSIGNMENT IS SUBMITTED
  // ==========================================

  const isAssignmentSubmitted = (
    assignmentId
  ) => {

    return submissions.some(
      (submission) =>
        submission.assignment?.id ===
        assignmentId
    );
  };


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {

    if (!date) {
      return "Not specified";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="assignments-page">

        <div className="assignments-header">

          <div>

            <h1>
              Assignments
            </h1>

            <p>
              Loading assignments...
            </p>

          </div>

          <Link
            to="/student-dashboard"
            className="assignments-dashboard-button"
          >
            ← Dashboard
          </Link>

        </div>

        <div className="assignments-loading">

          <div className="loading-icon">
            📋
          </div>

          <h2>
            Loading Assignments...
          </h2>

          <p>
            Please wait while assignments
            are being loaded.
          </p>

        </div>

      </div>
    );
  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (
      <div className="assignments-page">

        <div className="assignments-header">

          <div>

            <h1>
              Assignments
            </h1>

            <p>
              View your assignments,
              deadlines and submission status.
            </p>

          </div>

          <Link
            to="/student-dashboard"
            className="assignments-dashboard-button"
          >
            ← Dashboard
          </Link>

        </div>

        <div className="assignments-error">

          <div className="error-icon">
            ⚠️
          </div>

          <h2>
            Unable to Load Assignments
          </h2>

          <p>
            {error}
          </p>

        </div>

      </div>
    );
  }


  // ==========================================
  // COUNTS
  // ==========================================

  const totalAssignments =
    assignments.length;

  const submittedCount =
    assignments.filter(
      (assignment) =>
        isAssignmentSubmitted(
          assignment.id
        )
    ).length;

  const pendingCount =
    totalAssignments -
    submittedCount;


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="assignments-page">


      {/* ======================================
          HEADER
      ======================================= */}

      <div className="assignments-header">

        <div>

          <h1>
            Assignments
          </h1>

          <p>
            View your assignments,
            deadlines and submission status.
          </p>

        </div>

        <Link
          to="/student-dashboard"
          className="assignments-dashboard-button"
        >
          ← Dashboard
        </Link>

      </div>


      {/* ======================================
          STATISTICS
      ======================================= */}

      <div className="assignment-stats">


        {/* TOTAL */}

        <div className="assignment-stat-card">

          <div className="stat-icon">
            📋
          </div>

          <div>

            <span>
              Total Assignments
            </span>

            <strong>
              {totalAssignments}
            </strong>

          </div>

        </div>


        {/* PENDING */}

        <div className="assignment-stat-card">

          <div className="stat-icon">
            ⏳
          </div>

          <div>

            <span>
              Pending
            </span>

            <strong>
              {pendingCount}
            </strong>

          </div>

        </div>


        {/* SUBMITTED */}

        <div className="assignment-stat-card">

          <div className="stat-icon submitted-stat-icon">
            ✅
          </div>

          <div>

            <span>
              Submitted
            </span>

            <strong>
              {submittedCount}
            </strong>

          </div>

        </div>

      </div>


      {/* ======================================
          ASSIGNMENTS SECTION
      ======================================= */}

      <section className="my-assignments-section">

        <h2>
          My Assignments
        </h2>

        <p className="section-description">
          Select an assignment to view
          complete details and submit your work.
        </p>


        {/* ====================================
            ASSIGNMENT CARDS
        ===================================== */}

        <div className="assignments-grid">

          {assignments.map(
            (assignment) => {

              const submitted =
                isAssignmentSubmitted(
                  assignment.id
                );

              return (

                <div
                  className={`assignment-card ${
                    submitted
                      ? "assignment-submitted"
                      : ""
                  }`}
                  key={assignment.id}
                >


                  {/* TOP */}

                  <div className="assignment-card-top">

                    <div className="assignment-card-icon">
                      📋
                    </div>

                    <span
                      className={`assignment-status ${
                        submitted
                          ? "submitted"
                          : "active"
                      }`}
                    >
                      {submitted
                        ? "SUBMITTED"
                        : assignment.status ||
                          "ACTIVE"}
                    </span>

                  </div>


                  {/* TITLE */}

                  <h3>
                    {assignment.title}
                  </h3>


                  {/* DESCRIPTION */}

                  <p className="assignment-description">

                    {assignment.description ||
                      "No description available."}

                  </p>


                  {/* DETAILS */}

                  <div className="assignment-card-details">


                    {/* PROGRAM */}

                    <div className="assignment-detail-row">

                      <span>
                        📚 Program
                      </span>

                      <strong>

                        {assignment.trainingProgram
                          ?.title ||
                          "Java Full Stack Development"}

                      </strong>

                    </div>


                    {/* DUE DATE */}

                    <div className="assignment-detail-row">

                      <span>
                        📅 Due Date
                      </span>

                      <strong>
                        {formatDate(
                          assignment.dueDate
                        )}
                      </strong>

                    </div>


                    {/* ASSIGNMENT ID */}

                    <div className="assignment-detail-row">

                      <span>
                        🆔 Assignment ID
                      </span>

                      <strong>
                        #{assignment.id}
                      </strong>

                    </div>

                  </div>


                  {/* BUTTON */}

                  <Link
                    to={`/assignment-details/${assignment.id}`}
                    className={`view-assignment-button ${
                      submitted
                        ? "submitted-button"
                        : ""
                    }`}
                  >

                    {submitted
                      ? "View Submission →"
                      : "View Assignment →"}

                  </Link>

                </div>

              );

            }
          )}

        </div>


        {/* NO ASSIGNMENTS */}

        {assignments.length === 0 && (

          <div className="no-assignments">

            <div>
              📋
            </div>

            <h3>
              No Assignments
            </h3>

            <p>
              There are currently no
              assignments available.
            </p>

          </div>

        )}

      </section>

    </div>
  );
}

export default Assignments;