import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "./Feedback.css";

function Feedback() {
  const { user } = useContext(AuthContext);

  const [programs, setPrograms] = useState([]);
  const [trainingProgramId, setTrainingProgramId] = useState("");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");

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
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPrograms();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitError("");

    if (!user?.id) {
      setSubmitError(
        "User information not found. Please login again."
      );
      return;
    }

    if (!trainingProgramId) {
      setSubmitError(
        "Please select a training program."
      );
      return;
    }

    if (!rating) {
      setSubmitError(
        "Please select a rating."
      );
      return;
    }

    if (!feedback.trim()) {
      setSubmitError(
        "Please enter your feedback."
      );
      return;
    }

    try {
      setSubmitting(true);

      await api.post(
        `/feedback?studentId=${user.id}&trainingProgramId=${trainingProgramId}&rating=${rating}&feedback=${encodeURIComponent(
          feedback.trim()
        )}`
      );

      setSubmitted(true);
      setSubmitError("");

    } catch (err) {
      console.error("Feedback Submission Error:", err);

      if (err.response) {
        const responseData = err.response.data;

        setSubmitError(
          typeof responseData === "string"
            ? responseData
            : responseData?.message ||
              "Unable to submit feedback."
        );
      } else {
        setSubmitError(
          "Unable to connect to backend."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-page">

      <header className="feedback-header">

        <div>
          <h1>Training Feedback</h1>

          <p>
            Share your experience and help improve the
            training program.
          </p>
        </div>

        <Link
          to="/student-dashboard"
          className="feedback-back-button"
        >
          ← Dashboard
        </Link>

      </header>

      <div className="feedback-container">

        <div className="feedback-card">

          <div className="feedback-heading">

            <div className="feedback-heading-icon">
              💬
            </div>

            <div>
              <h2>Share Your Feedback</h2>

              <p>
                Your feedback helps us improve the
                training experience.
              </p>
            </div>

          </div>

          {loading ? (

            <div className="feedback-loading">
              Loading training programs...
            </div>

          ) : error ? (

            <div className="feedback-error">
              ⚠️ {error}
            </div>

          ) : submitted ? (

            <div className="feedback-success">

              <div className="feedback-success-icon">
                ✓
              </div>

              <h2>Thank You!</h2>

              <p>
                Your feedback has been submitted successfully.
              </p>

              <Link
                to="/student-dashboard"
                className="feedback-dashboard-button"
              >
                Back to Dashboard
              </Link>

            </div>

          ) : (

            <form onSubmit={handleSubmit}>

              <div className="feedback-form-group">

                <label>
                  Training Program
                </label>

                <select
                  value={trainingProgramId}
                  onChange={(e) =>
                    setTrainingProgramId(e.target.value)
                  }
                  required
                >
                  <option value="">
                    Select training program
                  </option>

                  {programs.map((program) => (
                    <option
                      key={program.id}
                      value={program.id}
                    >
                      {program.title}
                    </option>
                  ))}

                </select>

              </div>

              <div className="feedback-form-group">

                <label>
                  Rate Your Training Experience
                </label>

                <div className="rating-container">

                  {[1, 2, 3, 4, 5].map((star) => (

                    <button
                      type="button"
                      key={star}
                      className={`rating-star ${
                        star <= rating
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        setRating(star)
                      }
                    >
                      ★
                    </button>

                  ))}

                </div>

                <small>
                  {rating === 0
                    ? "Select a rating"
                    : `${rating} out of 5`}
                </small>

              </div>

              <div className="feedback-form-group">

                <label>
                  Your Feedback
                </label>

                <textarea
                  placeholder="Write your feedback about the training..."
                  rows="6"
                  value={feedback}
                  onChange={(e) =>
                    setFeedback(e.target.value)
                  }
                  required
                />

              </div>

              {submitError && (
                <div className="feedback-error">
                  ⚠️ {submitError}
                </div>
              )}

              <div className="feedback-actions">

                <Link
                  to="/student-dashboard"
                  className="feedback-cancel-button"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="feedback-submit-button"
                  disabled={submitting}
                >
                  {submitting
                    ? "Submitting..."
                    : "💬 Submit Feedback"}
                </button>

              </div>

            </form>

          )}

        </div>

      </div>

    </div>
  );
}

export default Feedback;