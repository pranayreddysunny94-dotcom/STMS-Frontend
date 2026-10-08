import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./TrainerCreateAssessment.css";

function TrainerCreateAssessment() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    totalMarks: "",
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const trainingProgramId = 2;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      setError("Please enter assessment title.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please enter assessment description.");
      return;
    }

    if (!formData.duration) {
      setError("Please enter assessment duration.");
      return;
    }

    if (!formData.totalMarks) {
      setError("Please enter total marks.");
      return;
    }

    try {
      setLoading(true);

      const assessmentData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        duration: Number(formData.duration),
        totalMarks: Number(formData.totalMarks),
        status: formData.status,
      };

      await api.post(
        `/assessments?trainingProgramId=${trainingProgramId}`,
        assessmentData
      );

      setSuccess("Assessment created successfully.");

      setTimeout(() => {
        navigate("/trainer-assessments");
      }, 1000);
    } catch (err) {
      console.error("Create Assessment Error:", err);

      if (err.response) {
        const data = err.response.data;

        if (typeof data === "string") {
          setError(data);
        } else if (data && data.message) {
          setError(data.message);
        } else {
          setError("Unable to create assessment.");
        }
      } else {
        setError("Unable to connect to backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trainer-create-assessment-page">

      {/* Header */}

      <header className="trainer-create-assessment-header">

        <div>
          <h1>Create Assessment</h1>

          <p>
            Create a new assessment for your training program.
          </p>
        </div>

        <button
          type="button"
          className="back-dashboard-btn"
          onClick={() => navigate("/trainer-assessments")}
        >
          ← Assessments
        </button>

      </header>

      {/* Form */}

      <section className="trainer-create-assessment-card">

        <form onSubmit={handleSubmit}>

          {/* Title */}

          <div className="form-group">

            <label htmlFor="title">
              Assessment Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter assessment title"
            />

          </div>

          {/* Description */}

          <div className="form-group">

            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter assessment description"
              rows="5"
            />

          </div>

          {/* Duration + Marks */}

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="duration">
                Duration (Minutes)
              </label>

              <input
                id="duration"
                name="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Example: 30"
              />

            </div>

            <div className="form-group">

              <label htmlFor="totalMarks">
                Total Marks
              </label>

              <input
                id="totalMarks"
                name="totalMarks"
                type="number"
                min="1"
                value={formData.totalMarks}
                onChange={handleChange}
                placeholder="Example: 100"
              />

            </div>

          </div>

          {/* Status */}

          <div className="form-group">

            <label htmlFor="status">
              Status
            </label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="ACTIVE">
                ACTIVE
              </option>

              <option value="PENDING">
                PENDING
              </option>

              <option value="INACTIVE">
                INACTIVE
              </option>
            </select>

          </div>

          {/* Training Program */}

          <div className="form-group">

            <label>
              Training Program
            </label>

            <input
              type="text"
              value="Java Full Stack Development"
              readOnly
              className="readonly-input"
            />

            <small>
              Training Program ID: {trainingProgramId}
            </small>

          </div>

          {/* Error */}

          {error && (
            <div className="assessment-form-error">
              {error}
            </div>
          )}

          {/* Success */}

          {success && (
            <div className="assessment-form-success">
              {success}
            </div>
          )}

          {/* Buttons */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-assessment-btn"
              onClick={() => navigate("/trainer-assessments")}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-assessment-btn"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Assessment"}
            </button>

          </div>

        </form>

      </section>

    </div>
  );
}

export default TrainerCreateAssessment;