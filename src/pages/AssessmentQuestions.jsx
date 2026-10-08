import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./AssessmentQuestions.css";

function AssessmentQuestions() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [student, setStudent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadAssessment = async () => {
      try {
        const userData = JSON.parse(
          localStorage.getItem("user")
        );

        if (!userData?.id) {
          throw new Error(
            "Logged-in user information not found."
          );
        }

        const [
          assessmentResponse,
          questionsResponse,
          studentResponse,
        ] = await Promise.all([
          api.get(`/assessments/${id}`),
          api.get(`/questions/assessment/${id}`),
          api.get(`/students/user/${userData.id}`),
        ]);

        if (isMounted) {
          setAssessment(assessmentResponse.data);
          setQuestions(questionsResponse.data || []);
          setStudent(studentResponse.data);
          setError("");
        }
      } catch (err) {
        console.error(
          "Assessment Questions API Error:",
          err
        );

        if (isMounted) {
          if (err.response) {
            const responseData = err.response.data;

            setError(
              typeof responseData === "string"
                ? responseData
                : responseData?.message ||
                    "Unable to load assessment."
            );
          } else {
            setError(
              err.message ||
                "Unable to connect to backend."
            );
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAssessment();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAnswerChange = (
    questionId,
    answer
  ) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    setSubmitError("");

    if (!student?.id) {
      setSubmitError(
        "Student information could not be found."
      );
      return;
    }

    if (!questions.length) {
      setSubmitError(
        "There are no questions to submit."
      );
      return;
    }

    const unansweredQuestions = questions.filter(
      (question) =>
        !answers[question.id]
    );

    if (unansweredQuestions.length > 0) {
      setSubmitError(
        `Please answer all questions before submitting. ${unansweredQuestions.length} question(s) remaining.`
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post(
        "/results/submit",
        {
          studentId: student.id,
          assessmentId: Number(id),
          answers: answers,
        }
      );

      console.log(
        "Assessment submitted:",
        response.data
      );

      navigate("/results");
    } catch (err) {
      console.error(
        "Assessment Submission Error:",
        err
      );

      if (err.response) {
        const responseData = err.response.data;

        setSubmitError(
          typeof responseData === "string"
            ? responseData
            : responseData?.message ||
                "Unable to submit assessment."
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

  if (loading) {
    return (
      <div className="assessment-questions-page">
        <section className="assessment-questions-card">
          <h2>Loading Assessment...</h2>
          <p>
            Please wait while the questions are
            loaded.
          </p>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assessment-questions-page">
        <section className="assessment-questions-card">
          <div className="assessment-question-error">
            <span>⚠️</span>

            <div>
              <strong>
                Unable to load assessment
              </strong>

              <p>{error}</p>
            </div>
          </div>

          <Link
            to="/assessments"
            className="back-button"
          >
            ← Back to Assessments
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="assessment-questions-page">

      <header className="assessment-questions-header">

        <div>
          <h1>
            {assessment?.title || "Assessment"}
          </h1>

          <p>
            {assessment?.description ||
              "Answer the following questions."}
          </p>
        </div>

        <Link
          to="/assessments"
          className="back-button"
        >
          ← Assessments
        </Link>

      </header>

      <section className="assessment-info">

        <div className="assessment-info-item">
          <span>📝 Questions</span>

          <strong>
            {questions.length}
          </strong>
        </div>

        <div className="assessment-info-item">
          <span>🎯 Total Marks</span>

          <strong>
            {assessment?.totalMarks || 0}
          </strong>
        </div>

        <div className="assessment-info-item">
          <span>⏱️ Duration</span>

          <strong>
            {assessment?.duration || 0} Minutes
          </strong>
        </div>

        <div className="assessment-info-item">
          <span>📌 Status</span>

          <strong>
            {assessment?.status || "PENDING"}
          </strong>
        </div>

      </section>

      <section className="questions-card">

        <div className="questions-heading">

          <div>
            <h2>
              Assessment Questions
            </h2>

            <p>
              Select one answer for each question.
            </p>
          </div>

        </div>

        {questions.length === 0 ? (

          <div className="no-questions">

            <div>📝</div>

            <h3>
              No Questions Available
            </h3>

            <p>
              Questions have not been added to
              this assessment yet.
            </p>

          </div>

        ) : (

          <div className="questions-list">

            {questions.map(
              (question, index) => (

                <div
                  className="question-item"
                  key={question.id}
                >

                  <div className="question-header">

                    <span className="question-number">
                      Question {index + 1}
                    </span>

                    <span className="question-marks">
                      {question.marks} Marks
                    </span>

                  </div>

                  <h3>
                    {question.questionText}
                  </h3>

                  <div className="question-options">

                    <label className="question-option">

                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value="A"
                        checked={
                          answers[
                            question.id
                          ] === "A"
                        }
                        onChange={() =>
                          handleAnswerChange(
                            question.id,
                            "A"
                          )
                        }
                      />

                      <span>
                        <strong>A.</strong>{" "}
                        {question.optionA}
                      </span>

                    </label>

                    <label className="question-option">

                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value="B"
                        checked={
                          answers[
                            question.id
                          ] === "B"
                        }
                        onChange={() =>
                          handleAnswerChange(
                            question.id,
                            "B"
                          )
                        }
                      />

                      <span>
                        <strong>B.</strong>{" "}
                        {question.optionB}
                      </span>

                    </label>

                    <label className="question-option">

                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value="C"
                        checked={
                          answers[
                            question.id
                          ] === "C"
                        }
                        onChange={() =>
                          handleAnswerChange(
                            question.id,
                            "C"
                          )
                        }
                      />

                      <span>
                        <strong>C.</strong>{" "}
                        {question.optionC}
                      </span>

                    </label>

                    <label className="question-option">

                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value="D"
                        checked={
                          answers[
                            question.id
                          ] === "D"
                        }
                        onChange={() =>
                          handleAnswerChange(
                            question.id,
                            "D"
                          )
                        }
                      />

                      <span>
                        <strong>D.</strong>{" "}
                        {question.optionD}
                      </span>

                    </label>

                  </div>

                </div>
              )
            )}

          </div>
        )}

        {questions.length > 0 && (
          <div className="assessment-submit-section">

            {submitError && (
              <div className="assessment-question-error">
                <span>⚠️</span>

                <div>
                  <strong>
                    Unable to submit assessment
                  </strong>

                  <p>{submitError}</p>
                </div>
              </div>
            )}

            <button
              type="button"
              className="submit-assessment-button"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit Assessment"}
            </button>

          </div>
        )}

      </section>

    </div>
  );
}

export default AssessmentQuestions;