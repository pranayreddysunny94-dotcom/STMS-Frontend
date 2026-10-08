import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./TrainerAddQuestion.css";

function TrainerAddQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
    marks: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

    if (!formData.questionText.trim()) {
      setError("Please enter the question.");
      return;
    }

    if (!formData.optionA.trim()) {
      setError("Please enter Option A.");
      return;
    }

    if (!formData.optionB.trim()) {
      setError("Please enter Option B.");
      return;
    }

    if (!formData.optionC.trim()) {
      setError("Please enter Option C.");
      return;
    }

    if (!formData.optionD.trim()) {
      setError("Please enter Option D.");
      return;
    }

    if (!formData.marks) {
      setError("Please enter marks.");
      return;
    }

    try {
      setLoading(true);

      const questionData = {
        questionText: formData.questionText.trim(),
        optionA: formData.optionA.trim(),
        optionB: formData.optionB.trim(),
        optionC: formData.optionC.trim(),
        optionD: formData.optionD.trim(),
        correctAnswer: formData.correctAnswer,
        marks: Number(formData.marks),
      };

      await api.post(
        `/questions?assessmentId=${id}`,
        questionData
      );

      setSuccess("Question added successfully.");

      setFormData({
        questionText: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "A",
        marks: "",
      });

    } catch (err) {
      console.error("Add Question Error:", err);

      if (err.response) {
        const data = err.response.data;

        if (typeof data === "string") {
          setError(data);
        } else if (data && data.message) {
          setError(data.message);
        } else {
          setError("Unable to add question.");
        }
      } else {
        setError("Unable to connect to backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trainer-add-question-page">

      {/* Header */}

      <header className="trainer-add-question-header">

        <div>
          <h1>Add Question</h1>

          <p>
            Add a question to the selected assessment.
          </p>
        </div>

        <button
          type="button"
          className="back-question-btn"
          onClick={() =>
            navigate(`/trainer-assessments/${id}`)
          }
        >
          ← Assessment
        </button>

      </header>

      {/* Form */}

      <section className="trainer-add-question-card">

        <form onSubmit={handleSubmit}>

          {/* Question */}

          <div className="question-form-group">

            <label htmlFor="questionText">
              Question
            </label>

            <textarea
              id="questionText"
              name="questionText"
              value={formData.questionText}
              onChange={handleChange}
              placeholder="Enter the question"
              rows="4"
            />

          </div>

          {/* Options */}

          <div className="question-options-grid">

            <div className="question-form-group">

              <label htmlFor="optionA">
                Option A
              </label>

              <input
                id="optionA"
                name="optionA"
                type="text"
                value={formData.optionA}
                onChange={handleChange}
                placeholder="Enter Option A"
              />

            </div>

            <div className="question-form-group">

              <label htmlFor="optionB">
                Option B
              </label>

              <input
                id="optionB"
                name="optionB"
                type="text"
                value={formData.optionB}
                onChange={handleChange}
                placeholder="Enter Option B"
              />

            </div>

            <div className="question-form-group">

              <label htmlFor="optionC">
                Option C
              </label>

              <input
                id="optionC"
                name="optionC"
                type="text"
                value={formData.optionC}
                onChange={handleChange}
                placeholder="Enter Option C"
              />

            </div>

            <div className="question-form-group">

              <label htmlFor="optionD">
                Option D
              </label>

              <input
                id="optionD"
                name="optionD"
                type="text"
                value={formData.optionD}
                onChange={handleChange}
                placeholder="Enter Option D"
              />

            </div>

          </div>

          {/* Correct Answer + Marks */}

          <div className="question-settings-row">

            <div className="question-form-group">

              <label htmlFor="correctAnswer">
                Correct Answer
              </label>

              <select
                id="correctAnswer"
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleChange}
              >
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>

            </div>

            <div className="question-form-group">

              <label htmlFor="marks">
                Marks
              </label>

              <input
                id="marks"
                name="marks"
                type="number"
                min="1"
                value={formData.marks}
                onChange={handleChange}
                placeholder="Example: 10"
              />

            </div>

          </div>

          {/* Messages */}

          {error && (
            <div className="question-form-error">
              {error}
            </div>
          )}

          {success && (
            <div className="question-form-success">
              {success}
            </div>
          )}

          {/* Actions */}

          <div className="question-form-actions">

            <button
              type="button"
              className="cancel-question-btn"
              onClick={() =>
                navigate(`/trainer-assessments/${id}`)
              }
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-question-btn"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Question"}
            </button>

          </div>

        </form>

      </section>

    </div>
  );
}

export default TrainerAddQuestion;