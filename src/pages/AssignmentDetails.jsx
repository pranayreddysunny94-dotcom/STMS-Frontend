import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import "./AssignmentDetails.css";

function AssignmentDetails() {
  const { id } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [submitted, setSubmitted] = useState(false);

  // Existing submission from backend
  const [existingSubmission, setExistingSubmission] = useState(null);

  // =========================================================
  // LOAD ASSIGNMENT + CHECK EXISTING SUBMISSION
  // =========================================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        // ---------------------------------------------------
        // GET ASSIGNMENT
        // ---------------------------------------------------

        const assignmentResponse =
          await api.get(`/assignments/${id}`);

        setAssignment(assignmentResponse.data);

        // ---------------------------------------------------
        // GET LOGGED-IN STUDENT
        // ---------------------------------------------------

        const userData =
          localStorage.getItem("user");

        if (!userData) {
          setLoading(false);
          return;
        }

        const user =
          JSON.parse(userData);

        const studentId =
          user.id;

        if (!studentId) {
          setLoading(false);
          return;
        }

        console.log(
          "Logged-in Student ID:",
          studentId
        );

        // ---------------------------------------------------
        // GET STUDENT SUBMISSIONS
        // ---------------------------------------------------

        const submissionResponse =
          await api.get(
            `/assignment-submissions/student/${studentId}`
          );

        const submissions =
          submissionResponse.data || [];

        console.log(
          "Student Submissions:",
          submissions
        );

        // ---------------------------------------------------
        // FIND SUBMISSION FOR CURRENT ASSIGNMENT
        // ---------------------------------------------------

        const currentSubmission =
          submissions.find(
            (submission) =>
              Number(submission.assignment?.id) ===
              Number(id)
          );

        if (currentSubmission) {

          console.log(
            "Existing Assignment Submission:",
            currentSubmission
          );

          setExistingSubmission(
            currentSubmission
          );

          setSubmitted(true);

        } else {

          setExistingSubmission(null);

          setSubmitted(false);
        }

      } catch (err) {

        console.error(
          "Assignment Details API Error:",
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

          } else if (
            err.response.data.message
          ) {

            setError(
              err.response.data.message
            );

          } else {

            setError(
              "Unable to load assignment."
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

    if (id) {
      loadData();
    }

  }, [id]);


  // =========================================================
  // FILE CHANGE
  // =========================================================

  const handleFileChange = (e) => {

    const file =
      e.target.files?.[0];

    if (file) {

      setSelectedFile(file);

      // When replacing an existing file,
      // show the upload form again.
      setSubmitted(false);

      setSubmitError("");
    }
  };


  // =========================================================
  // SUBMIT ASSIGNMENT
  // =========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSubmitError("");

    if (!selectedFile) {

      setSubmitError(
        "Please select an assignment file."
      );

      return;
    }

    try {

      setSubmitting(true);

      // ---------------------------------------------------
      // GET LOGGED-IN USER
      // ---------------------------------------------------

      const userData =
        localStorage.getItem("user");

      if (!userData) {

        setSubmitError(
          "Student information not found. Please login again."
        );

        return;
      }

      const user =
        JSON.parse(userData);

      const studentId =
        user.id;

      if (!studentId) {

        setSubmitError(
          "Student ID not found. Please login again."
        );

        return;
      }

      // ---------------------------------------------------
      // CREATE FORM DATA
      // ---------------------------------------------------

      const formData =
        new FormData();

      formData.append(
        "assignmentId",
        id
      );

      formData.append(
        "studentId",
        studentId
      );

      formData.append(
        "file",
        selectedFile
      );

      // ---------------------------------------------------
      // DEBUG INFORMATION
      // ---------------------------------------------------

      console.log(
        "Assignment ID:",
        id
      );

      console.log(
        "Student ID:",
        studentId
      );

      console.log(
        "Selected File:",
        selectedFile.name
      );

      // ---------------------------------------------------
      // SUBMIT TO BACKEND
      // ---------------------------------------------------

      const response =
        await api.post(
          "/assignment-submissions",
          formData
        );

      console.log(
        "Assignment Submission Response:",
        response.data
      );

      // ---------------------------------------------------
      // SAVE BACKEND RESPONSE
      // ---------------------------------------------------

      setExistingSubmission(
        response.data
      );

      setSubmitted(true);

      setSelectedFile(null);

      setSubmitError("");

    } catch (err) {

      console.error(
        "Assignment Submission Error:",
        err
      );

      if (err.response?.data) {

        if (
          typeof err.response.data ===
          "string"
        ) {

          setSubmitError(
            err.response.data
          );

        } else if (
          err.response.data.message
        ) {

          setSubmitError(
            err.response.data.message
          );

        } else {

          setSubmitError(
            "Unable to submit assignment."
          );
        }

      } else {

        setSubmitError(
          "Unable to connect to backend."
        );
      }

    } finally {

      setSubmitting(false);
    }
  };


  // =========================================================
  // FORMAT DATE
  // =========================================================

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
        month: "long",
        year: "numeric",
      }
    );
  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <div className="assignment-details-page">

        <header className="assignment-details-header">

          <div>

            <h1>
              Assignment Details
            </h1>

            <p>
              Loading assignment information...
            </p>

          </div>

          <Link
            to="/assignments"
            className="details-back-button"
          >
            ← Assignments
          </Link>

        </header>

        <div className="assignment-details-container">

          <div className="assignment-main-card">

            <div className="assignment-loading">

              <div className="loading-icon">
                📋
              </div>

              <h2>
                Loading Assignment...
              </h2>

              <p>
                Please wait while assignment details are loaded.
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error) {

    return (
      <div className="assignment-details-page">

        <header className="assignment-details-header">

          <div>

            <h1>
              Assignment Details
            </h1>

            <p>
              Unable to load assignment information.
            </p>

          </div>

          <Link
            to="/assignments"
            className="details-back-button"
          >
            ← Assignments
          </Link>

        </header>

        <div className="assignment-details-container">

          <div className="assignment-main-card">

            <div className="assignment-error">

              <div className="error-icon">
                ⚠️
              </div>

              <h2>
                Unable to Load Assignment
              </h2>

              <p>
                {error}
              </p>

              <Link
                to="/assignments"
                className="details-error-button"
              >
                ← Back to Assignments
              </Link>

            </div>

          </div>

        </div>

      </div>
    );
  }


  if (!assignment) {
    return null;
  }


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="assignment-details-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="assignment-details-header">

        <div>

          <h1>
            Assignment Details
          </h1>

          <p>
            View assignment information and submit your work.
          </p>

        </div>

        <Link
          to="/assignments"
          className="details-back-button"
        >
          ← Assignments
        </Link>

      </header>


      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div className="assignment-details-container">


        {/* ===================================================
            ASSIGNMENT INFORMATION
        ==================================================== */}

        <div className="assignment-main-card">

          <div className="details-top">

            <div className="details-icon">
              📋
            </div>

            <div className="details-title">

              <h2>
                {assignment.title}
              </h2>

              <span
                className={`details-status ${
                  assignment.status?.toLowerCase() ===
                  "active"
                    ? "active"
                    : "inactive"
                }`}
              >
                {assignment.status ||
                  "ACTIVE"}
              </span>

            </div>

          </div>


          {/* =================================================
              ASSIGNMENT INFORMATION GRID
          ================================================== */}

          <div className="details-info-grid">


            <div className="details-info-item">

              <span>
                📖 Training Program
              </span>

              <strong>
                {assignment.trainingProgram?.title ||
                  "Java Full Stack Development"}
              </strong>

            </div>


            <div className="details-info-item">

              <span>
                📅 Due Date
              </span>

              <strong>
                {formatDate(
                  assignment.dueDate
                )}
              </strong>

            </div>


            <div className="details-info-item">

              <span>
                🆔 Assignment ID
              </span>

              <strong>
                #{assignment.id}
              </strong>

            </div>


            <div className="details-info-item">

              <span>
                📌 Status
              </span>

              <strong>
                {assignment.status ||
                  "ACTIVE"}
              </strong>

            </div>

          </div>


          {/* =================================================
              DESCRIPTION
          ================================================== */}

          <section className="details-section">

            <h3>
              Assignment Description
            </h3>

            <p>
              {assignment.description ||
                "No description available for this assignment."}
            </p>

          </section>


          {/* =================================================
              INSTRUCTIONS
          ================================================== */}

          <section className="details-section">

            <h3>
              Submission Instructions
            </h3>

            <ul className="instruction-list">

              <li>
                <span>✓</span>
                Complete the assignment according to the description.
              </li>

              <li>
                <span>✓</span>
                Make sure your work is properly organized.
              </li>

              <li>
                <span>✓</span>
                Check your project before submitting.
              </li>

              <li>
                <span>✓</span>
                Submit your completed assignment file.
              </li>

            </ul>

          </section>

        </div>


        {/* ===================================================
            SUBMISSION CARD
        ==================================================== */}

        <div className="submission-card">

          <div className="submission-heading">

            <div className="submission-icon">
              📤
            </div>

            <div>

              <h2>
                {submitted
                  ? "Assignment Submitted"
                  : "Submit Assignment"}
              </h2>

              <p>
                {submitted
                  ? "Your assignment submission has been recorded."
                  : "Upload your completed assignment."}
              </p>

            </div>

          </div>


          {/* =================================================
              EXISTING SUBMISSION
          ================================================== */}

          {submitted ? (

            <div className="submission-success">

              <div className="success-icon">
                ✓
              </div>

              <h3>
                Assignment Submitted
              </h3>

              <p>
                Your assignment has been submitted successfully.
              </p>


              {/* FILE NAME */}

              <div className="submitted-file">

                📎

                <span>

                  {existingSubmission?.fileName ||
                    "Submitted file"}

                </span>

              </div>


              {/* SUBMISSION DETAILS */}

              {existingSubmission && (

                <div
                  className="submitted-details"
                  style={{
                    marginTop: "15px",
                    textAlign: "left",
                  }}
                >

                  <p>
                    <strong>
                      Status:
                    </strong>{" "}
                    {existingSubmission.status ||
                      "SUBMITTED"}
                  </p>

                  <p>
                    <strong>
                      Submitted On:
                    </strong>{" "}
                    {formatDate(
                      existingSubmission.submittedAt
                    )}
                  </p>

                </div>

              )}


              {/* REPLACE FILE */}

              <label
                htmlFor="replace-file"
                className="replace-button"
              >
                Replace File
              </label>

              <input
                id="replace-file"
                type="file"
                accept=".pdf,.doc,.docx,.zip,.rar,.txt"
                onChange={handleFileChange}
              />

            </div>

          ) : (

            /* =================================================
               UPLOAD FORM
            ================================================== */

            <form
              onSubmit={handleSubmit}
            >

              <div className="submission-upload-area">

                <div className="upload-large-icon">
                  📁
                </div>

                <h3>
                  Upload your assignment
                </h3>

                <p>
                  Select your completed assignment file.
                </p>


                {/* CHOOSE FILE */}

                <label
                  htmlFor="submission-file"
                  className="choose-file-button"
                >
                  Choose File
                </label>

                <input
                  id="submission-file"
                  type="file"
                  accept=".pdf,.doc,.docx,.zip,.rar,.txt"
                  onChange={handleFileChange}
                />


                {/* SELECTED FILE */}

                {selectedFile && (

                  <div className="selected-submission">

                    <span>
                      📄
                    </span>

                    <div>

                      <small>
                        Selected File
                      </small>

                      <strong>
                        {selectedFile.name}
                      </strong>

                    </div>

                  </div>

                )}

              </div>


              {/* ERROR */}

              {submitError && (

                <div className="submission-error">

                  ⚠️ {submitError}

                </div>

              )}


              {/* SUBMIT BUTTON */}

              <button
                type="submit"
                className="submit-assignment-button"
                disabled={
                  !selectedFile ||
                  submitting
                }
              >

                {submitting
                  ? "Submitting..."
                  : "📤 Submit Assignment"}

              </button>


              <p className="submission-note">
                Supported formats: PDF, DOC, DOCX, ZIP, RAR, TXT
              </p>

            </form>

          )}

        </div>

      </div>

    </div>
  );
}

export default AssignmentDetails;
