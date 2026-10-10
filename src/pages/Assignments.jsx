
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Assignments.css";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LOAD ASSIGNMENTS AND STUDENT SUBMISSIONS
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        // GET LOGGED-IN USER
        const userData = sessionStorage.getItem("user");

        if (!userData) {
          throw new Error(
            "User information not found. Please log in again."
          );
        }

        let user;

        try {
          user = JSON.parse(userData);
        } catch {
          throw new Error(
            "Invalid user information. Please log in again."
          );
        }

        if (!user?.id) {
          throw new Error(
            "User ID not found. Please log in again."
          );
        }

        console.log("Logged-in User ID:", user.id);

        // GET ACTUAL STUDENT PROFILE
        const studentResponse = await api.get(
          `/students/user/${user.id}`
        );

        const student = studentResponse.data;
        const studentId = student?.id;

        if (!studentId) {
          throw new Error(
            "Student profile not found for this account."
          );
        }

        console.log("Student Profile ID:", studentId);

        // LOAD ASSIGNMENTS AND SUBMISSIONS
        const [assignmentResponse, submissionResponse] =
          await Promise.all([
            api.get("/assignments"),
            api.get(
              `/assignment-submissions/student/${studentId}`
            ),
          ]);

        const assignmentData = Array.isArray(
          assignmentResponse.data
        )
          ? assignmentResponse.data
          : [];

        const submissionData = Array.isArray(
          submissionResponse.data
        )
          ? submissionResponse.data
          : [];

        console.log("Assignments:", assignmentData);
        console.log("Student Submissions:", submissionData);

        if (isMounted) {
          setAssignments(assignmentData);
          setSubmissions(submissionData);
          setError("");
        }
      } catch (err) {
        console.error("Assignments API Error:", err);

        let message = "Unable to load assignments.";

        if (err.response) {
          const responseData = err.response.data;

          if (typeof responseData === "string") {
            message = responseData;
          } else if (responseData?.message) {
            message = responseData.message;
          } else if (err.response.status === 401) {
            message = "Session expired. Please log in again.";
          } else if (err.response.status === 403) {
            message =
              "You don't have permission to view assignments.";
          } else if (err.response.status === 404) {
            message =
              "Student profile or submission endpoint was not found.";
          }
        } else if (err.message) {
          message = err.message;
        }

        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // CHECK WHETHER AN ASSIGNMENT IS SUBMITTED
  const isAssignmentSubmitted = (assignmentId) => {
    return submissions.some((submission) => {
      const submittedAssignmentId =
        submission.assignment?.id ??
        submission.assignmentId;

      return (
        Number(submittedAssignmentId) ===
        Number(assignmentId)
      );
    });
  };

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) {
      return "Not specified";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // LOADING
  if (loading) {
    return (
      <div className="assignments-page">
        <div className="assignments-header">
          <div>
            <h1>Assignments</h1>
            <p>Loading assignments...</p>
          </div>

          <Link
            to="/student-dashboard"
            className="assignments-dashboard-button"
          >
            ← Dashboard
          </Link>
        </div>

        <div className="assignments-loading">
          <div className="loading-icon">📋</div>
          <h2>Loading Assignments...</h2>
          <p>
            Please wait while assignments are being loaded.
          </p>
        </div>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="assignments-page">
        <div className="assignments-header">
          <div>
            <h1>Assignments</h1>
            <p>
              View your assignments, deadlines and submission status.
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
          <div className="error-icon">⚠️</div>
          <h2>Unable to Load Assignments</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // STATISTICS
  const totalAssignments = assignments.length;

  const submittedCount = assignments.filter((assignment) =>
    isAssignmentSubmitted(assignment.id)
  ).length;

  const pendingCount = totalAssignments - submittedCount;

  // PAGE
  return (
    <div className="assignments-page">
      {/* HEADER */}
      <div className="assignments-header">
        <div>
          <h1>Assignments</h1>
          <p>
            View your assignments, deadlines and submission status.
          </p>
        </div>

        <Link
          to="/student-dashboard"
          className="assignments-dashboard-button"
        >
          ← Dashboard
        </Link>
      </div>

      {/* STATISTICS */}
      <div className="assignment-stats">
        <div className="assignment-stat-card">
          <div className="stat-icon">📋</div>
          <div>
            <span>Total Assignments</span>
            <strong>{totalAssignments}</strong>
          </div>
        </div>

        <div className="assignment-stat-card">
          <div className="stat-icon">⏳</div>
          <div>
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </div>
        </div>

        <div className="assignment-stat-card">
          <div className="stat-icon submitted-stat-icon">✅</div>
          <div>
            <span>Submitted</span>
            <strong>{submittedCount}</strong>
          </div>
        </div>
      </div>

      {/* ASSIGNMENTS SECTION */}
      <section className="my-assignments-section">
        <h2>My Assignments</h2>

        <p className="section-description">
          Select an assignment to view complete details and submit your work.
        </p>

        <div className="assignments-grid">
          {assignments.map((assignment) => {
            const submitted = isAssignmentSubmitted(
              assignment.id
            );

            return (
              <div
                className={`assignment-card ${
                  submitted ? "assignment-submitted" : ""
                }`}
                key={assignment.id}
              >
                {/* CARD HEADER */}
                <div className="assignment-card-top">
                  <div className="assignment-card-icon">
                    📋
                  </div>

                  <span
                    className={`assignment-status ${
                      submitted ? "submitted" : "active"
                    }`}
                  >
                    {submitted
                      ? "SUBMITTED"
                      : assignment.status || "ACTIVE"}
                  </span>
                </div>

                {/* TITLE */}
                <h3>{assignment.title}</h3>

                {/* DESCRIPTION */}
                <p className="assignment-description">
                  {assignment.description ||
                    "No description available."}
                </p>

                {/* DETAILS */}
                <div className="assignment-card-details">
                  <div className="assignment-detail-row">
                    <span>📚 Program</span>
                    <strong>
                      {assignment.trainingProgram?.title ||
                        "Training Program"}
                    </strong>
                  </div>

                  <div className="assignment-detail-row">
                    <span>📅 Due Date</span>
                    <strong>
                      {formatDate(assignment.dueDate)}
                    </strong>
                  </div>

                  <div className="assignment-detail-row">
                    <span>🆔 Assignment ID</span>
                    <strong>#{assignment.id}</strong>
                  </div>
                </div>

                {/* ACTION */}
                <Link
                  to={`/assignment-details/${assignment.id}`}
                  className={`view-assignment-button ${
                    submitted ? "submitted-button" : ""
                  }`}
                >
                  {submitted
                    ? "View Submission →"
                    : "View Assignment →"}
                </Link>
              </div>
            );
          })}
        </div>

        {/* NO ASSIGNMENTS */}
        {assignments.length === 0 && (
          <div className="no-assignments">
            <div>📋</div>
            <h3>No Assignments</h3>
            <p>
              There are currently no assignments available.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Assignments;
