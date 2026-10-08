import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import "./TrainerAssessmentDetails.css";

function TrainerAssessmentDetails() {
  const { id } = useParams();

  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingQuestion, setEditingQuestion] = useState(null);

  const [editForm, setEditForm] = useState({
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
    marks: "",
  });

  useEffect(() => {
    if (!id) {
      return;
    }

    let isActive = true;

    const loadAssessment = async () => {
      try {
        setLoading(true);
        setError("");

        const assessmentResponse = await api.get(
          `/assessments/${id}`
        );

        if (!isActive) return;

        setAssessment(assessmentResponse.data);

        const questionsResponse = await api.get(
          `/questions/assessment/${id}`
        );

        if (!isActive) return;

        setQuestions(questionsResponse.data || []);
      } catch (err) {
        console.error(
          "Assessment Details API Error:",
          err
        );

        if (!isActive) return;

        if (err.response) {
          const data = err.response.data;

          if (typeof data === "string") {
            setError(data);
          } else if (data && data.message) {
            setError(data.message);
          } else {
            setError(
              "Unable to load assessment details."
            );
          }
        } else {
          setError(
            "Unable to connect to backend."
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadAssessment();

    return () => {
      isActive = false;
    };
  }, [id]);

  /* =================================
     EDIT QUESTION
  ================================= */

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);

    setEditForm({
      questionText: question.questionText || "",
      optionA: question.optionA || "",
      optionB: question.optionB || "",
      optionC: question.optionC || "",
      optionD: question.optionD || "",
      correctAnswer: question.correctAnswer || "A",
      marks:
        question.marks !== null &&
        question.marks !== undefined
          ? question.marks
          : "",
    });
  };

  /* =================================
     EDIT FORM CHANGE
  ================================= */

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =================================
     CANCEL EDIT
  ================================= */

  const handleCancelEdit = () => {
    setEditingQuestion(null);

    setEditForm({
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "A",
      marks: "",
    });
  };

  /* =================================
     SAVE EDIT
  ================================= */

  const handleSaveEdit = async () => {
    console.log("handleSaveEdit started");

    if (!editForm.questionText.trim()) {
      alert("Please enter the question.");
      return;
    }

    if (!editForm.optionA.trim()) {
      alert("Please enter Option A.");
      return;
    }

    if (!editForm.optionB.trim()) {
      alert("Please enter Option B.");
      return;
    }

    if (!editForm.optionC.trim()) {
      alert("Please enter Option C.");
      return;
    }

    if (!editForm.optionD.trim()) {
      alert("Please enter Option D.");
      return;
    }

    if (!editForm.marks) {
      alert("Please enter marks.");
      return;
    }

    try {
      const questionData = {
        questionText: editForm.questionText.trim(),
        optionA: editForm.optionA.trim(),
        optionB: editForm.optionB.trim(),
        optionC: editForm.optionC.trim(),
        optionD: editForm.optionD.trim(),
        correctAnswer: editForm.correctAnswer,
        marks: Number(editForm.marks),
      };

      console.log(
        "Updating Question:",
        editingQuestion?.id
      );

      console.log(
        "Question Data:",
        questionData
      );

      console.log(
        "Assessment ID:",
        id
      );

      await api.put(
        `/questions/${editingQuestion.id}?assessmentId=${id}`,
        questionData
      );

      console.log(
        "Question update API completed"
      );

      alert(
        "Question updated successfully."
      );

      setEditingQuestion(null);

      setEditForm({
        questionText: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "A",
        marks: "",
      });

      /* ================================
         Reload Assessment
      ================================= */

      const assessmentResponse =
        await api.get(
          `/assessments/${id}`
        );

      setAssessment(
        assessmentResponse.data
      );

      /* ================================
         Reload Questions
      ================================= */

      const questionsResponse =
        await api.get(
          `/questions/assessment/${id}`
        );

      setQuestions(
        questionsResponse.data || []
      );

    } catch (err) {
      console.error(
        "Update Question Error:",
        err
      );

      if (err.response) {
        const data = err.response.data;

        console.error(
          "Backend Response:",
          data
        );

        if (typeof data === "string") {
          alert(data);
        } else if (
          data &&
          data.message
        ) {
          alert(data.message);
        } else {
          alert(
            "Unable to update question."
          );
        }
      } else {
        alert(
          "Unable to connect to backend."
        );
      }
    }
  };

  /* =================================
     MISSING ID
  ================================= */

  if (!id) {
    return (
      <div className="trainer-assessment-details-page">

        <div className="trainer-assessment-message">

          <div className="trainer-assessment-error-icon">
            ⚠️
          </div>

          <h2>
            Unable to Load Assessment
          </h2>

          <p>
            Assessment ID is missing.
          </p>

          <Link
            to="/trainer-assessments"
            className="trainer-assessment-back-btn"
          >
            ← Back to Assessments
          </Link>

        </div>

      </div>
    );
  }

  /* =================================
     LOADING
  ================================= */

  if (loading) {
    return (
      <div className="trainer-assessment-details-page">

        <div className="trainer-assessment-message">

          <div className="trainer-assessment-loading-icon">
            📋
          </div>

          <h2>
            Loading Assessment...
          </h2>

          <p>
            Please wait while the assessment
            details are loaded.
          </p>

        </div>

      </div>
    );
  }

  /* =================================
     ERROR
  ================================= */

  if (error) {
    return (
      <div className="trainer-assessment-details-page">

        <div className="trainer-assessment-message">

          <div className="trainer-assessment-error-icon">
            ⚠️
          </div>

          <h2>
            Unable to Load Assessment
          </h2>

          <p>
            {error}
          </p>

          <Link
            to="/trainer-assessments"
            className="trainer-assessment-back-btn"
          >
            ← Back to Assessments
          </Link>

        </div>

      </div>
    );
  }

  /* =================================
     MAIN PAGE
  ================================= */

  return (
    <div className="trainer-assessment-details-page">

      {/* =================================
          HEADER
      ================================= */}

      <header className="trainer-assessment-details-header">

        <div>

          <h1>
            Assessment Details
          </h1>

          <p>
            View assessment information and
            questions.
          </p>

        </div>

        <Link
          to="/trainer-assessments"
          className="trainer-assessment-back-btn"
        >
          ← Assessments
        </Link>

      </header>


      {/* =================================
          ASSESSMENT INFORMATION
      ================================= */}

      <section className="trainer-assessment-info-card">

        <div className="trainer-assessment-info-icon">
          📋
        </div>

        <h2>
          {assessment?.title ||
            "Untitled Assessment"}
        </h2>

        <p className="trainer-assessment-description">
          {assessment?.description ||
            "No description available."}
        </p>

        <div className="trainer-assessment-info-grid">

          <div>

            <span>
              Training Program
            </span>

            <strong>
              {assessment?.trainingProgram?.title ||
                "Not Assigned"}
            </strong>

          </div>


          <div>

            <span>
              Duration
            </span>

            <strong>
              {assessment?.duration
                ? `${assessment.duration} Minutes`
                : "Not specified"}
            </strong>

          </div>


          <div>

            <span>
              Total Marks
            </span>

            <strong>
              {assessment?.totalMarks !== null &&
              assessment?.totalMarks !== undefined
                ? assessment.totalMarks
                : "Not specified"}
            </strong>

          </div>


          <div>

            <span>
              Status
            </span>

            <strong className="assessment-status">
              {assessment?.status ||
                "Not specified"}
            </strong>

          </div>

        </div>

      </section>


      {/* =================================
          QUESTIONS SECTION
      ================================= */}

      <section className="trainer-assessment-questions">

        <div className="trainer-assessment-section-header">

          <div>

            <h2>
              Assessment Questions
            </h2>

            <p>
              {questions.length}{" "}
              {questions.length === 1
                ? "Question"
                : "Questions"}
            </p>

          </div>


          <Link
            to={`/trainer-assessments/${id}/add-question`}
            className="add-question-btn"
          >
            + Add Question
          </Link>

        </div>


        {/* =================================
            EDIT QUESTION FORM
        ================================= */}

        {editingQuestion && (

          <div className="trainer-edit-question-card">

            <h2>
              Edit Question
            </h2>

            <p>
              Update the question details below.
            </p>


            {/* QUESTION */}

            <div className="question-form-group">

              <label htmlFor="edit-questionText">
                Question
              </label>

              <textarea
                id="edit-questionText"
                name="questionText"
                value={
                  editForm.questionText
                }
                onChange={
                  handleEditChange
                }
                rows="4"
              />

            </div>


            {/* OPTIONS */}

            <div className="question-options-grid">

              <div className="question-form-group">

                <label htmlFor="edit-optionA">
                  Option A
                </label>

                <input
                  id="edit-optionA"
                  name="optionA"
                  type="text"
                  value={
                    editForm.optionA
                  }
                  onChange={
                    handleEditChange
                  }
                />

              </div>


              <div className="question-form-group">

                <label htmlFor="edit-optionB">
                  Option B
                </label>

                <input
                  id="edit-optionB"
                  name="optionB"
                  type="text"
                  value={
                    editForm.optionB
                  }
                  onChange={
                    handleEditChange
                  }
                />

              </div>


              <div className="question-form-group">

                <label htmlFor="edit-optionC">
                  Option C
                </label>

                <input
                  id="edit-optionC"
                  name="optionC"
                  type="text"
                  value={
                    editForm.optionC
                  }
                  onChange={
                    handleEditChange
                  }
                />

              </div>


              <div className="question-form-group">

                <label htmlFor="edit-optionD">
                  Option D
                </label>

                <input
                  id="edit-optionD"
                  name="optionD"
                  type="text"
                  value={
                    editForm.optionD
                  }
                  onChange={
                    handleEditChange
                  }
                />

              </div>

            </div>


            {/* CORRECT ANSWER + MARKS */}

            <div className="question-settings-row">

              <div className="question-form-group">

                <label htmlFor="edit-correctAnswer">
                  Correct Answer
                </label>

                <select
                  id="edit-correctAnswer"
                  name="correctAnswer"
                  value={
                    editForm.correctAnswer
                  }
                  onChange={
                    handleEditChange
                  }
                >

                  <option value="A">
                    Option A
                  </option>

                  <option value="B">
                    Option B
                  </option>

                  <option value="C">
                    Option C
                  </option>

                  <option value="D">
                    Option D
                  </option>

                </select>

              </div>


              <div className="question-form-group">

                <label htmlFor="edit-marks">
                  Marks
                </label>

                <input
                  id="edit-marks"
                  name="marks"
                  type="number"
                  min="1"
                  value={
                    editForm.marks
                  }
                  onChange={
                    handleEditChange
                  }
                />

              </div>

            </div>


            {/* EDIT BUTTONS */}

            <div className="trainer-edit-question-actions">

              <button
                type="button"
                onClick={
                  handleCancelEdit
                }
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={() => {
                  console.log(
                    "SAVE BUTTON CLICKED"
                  );

                  handleSaveEdit();
                }}
              >
                Save Changes
              </button>

            </div>

          </div>

        )}


        {/* =================================
            NO QUESTIONS
        ================================= */}

        {questions.length === 0 && (

          <div className="trainer-assessment-empty">

            <div>
              📝
            </div>

            <h3>
              No Questions Available
            </h3>

            <p>
              No questions have been added
              to this assessment yet.
            </p>

            <Link
              to={`/trainer-assessments/${id}/add-question`}
              className="empty-add-question-btn"
            >
              + Add First Question
            </Link>

          </div>

        )}


        {/* =================================
            QUESTIONS
        ================================= */}

        {questions.length > 0 && (

          <div className="trainer-question-list">

            {questions.map(
              (question, index) => (

                <div
                  className="trainer-question-card"
                  key={question.id}
                >

                  {/* QUESTION NUMBER */}

                  <div className="trainer-question-number">
                    {index + 1}
                  </div>


                  {/* QUESTION CONTENT */}

                  <div className="trainer-question-content">

                    <h3>
                      {question.questionText}
                    </h3>


                    {/* OPTIONS */}

                    <div className="trainer-question-options">

                      <div>

                        <strong>
                          A.
                        </strong>

                        <span>
                          {question.optionA}
                        </span>

                      </div>


                      <div>

                        <strong>
                          B.
                        </strong>

                        <span>
                          {question.optionB}
                        </span>

                      </div>


                      <div>

                        <strong>
                          C.
                        </strong>

                        <span>
                          {question.optionC}
                        </span>

                      </div>


                      <div>

                        <strong>
                          D.
                        </strong>

                        <span>
                          {question.optionD}
                        </span>

                      </div>

                    </div>


                    {/* QUESTION FOOTER */}

                    <div className="trainer-question-footer">

                      <span>

                        Marks:{" "}

                        <strong>
                          {question.marks}
                        </strong>

                      </span>


                      <span>

                        Correct Answer:{" "}

                        <strong>
                          {question.correctAnswer}
                        </strong>

                      </span>

                    </div>


                    {/* QUESTION ACTIONS */}

                    <div className="trainer-question-actions">

                      <button
                        type="button"
                        onClick={() =>
                          handleEditQuestion(
                            question
                          )
                        }
                      >
                        ✏️ Edit
                      </button>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>

    </div>
  );
}

export default TrainerAssessmentDetails;