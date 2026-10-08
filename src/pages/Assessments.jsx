import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Assessments.css";

function Assessments() {
  const [assessments, setAssessments] = useState([]);
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadAssessments = async () => {
      try {
        setLoading(true);

        const userData = JSON.parse(
          localStorage.getItem("user")
        );

        if (!userData?.id) {
          throw new Error(
            "Logged-in user information not found."
          );
        }

        // Get Student record
        const studentResponse = await api.get(
          `/students/user/${userData.id}`
        );

        const studentId = studentResponse.data.id;

        // Get assessments and student's results
        const [
          assessmentsResponse,
          resultsResponse,
        ] = await Promise.all([
          api.get("/assessments"),
          api.get(`/results/student/${studentId}`),
        ]);

        if (isMounted) {
          setAssessments(
            assessmentsResponse.data || []
          );

          setResults(
            resultsResponse.data || []
          );

          setError("");
        }
      } catch (err) {
        console.error(
          "Assessment API Error:",
          err
        );

        if (isMounted) {
          if (err.response) {
            const responseData =
              err.response.data;

            setError(
              typeof responseData === "string"
                ? responseData
                : responseData?.message ||
                    "Unable to load assessments."
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

    loadAssessments();

    return () => {
      isMounted = false;
    };
  }, []);

  /*
   * Check whether the logged-in student
   * has already completed an assessment.
   */
  const isAssessmentCompleted = (assessmentId) => {
    return results.some(
      (result) =>
        Number(result.assessment?.id) ===
        Number(assessmentId)
    );
  };

  const totalAssessments =
    assessments.length;

  const completedAssessments =
    assessments.filter((assessment) =>
      isAssessmentCompleted(assessment.id)
    ).length;

  const pendingAssessments =
    totalAssessments -
    completedAssessments;

  const completedResults =
    results.filter(
      (result) =>
        result?.percentage !== null &&
        result?.percentage !== undefined
    );

  const averageScore =
    completedResults.length > 0
      ? Math.round(
          completedResults.reduce(
            (total, result) =>
              total +
              Number(result.percentage || 0),
            0
          ) / completedResults.length
        )
      : 0;

  return (
    <div className="assessments-page">

      {/* ================= HEADER ================= */}

      <header className="assessments-header">

        <div>
          <h1>
            Assessments
          </h1>

          <p>
            View your training assessments and
            track your performance.
          </p>
        </div>

        <Link
          to="/student-dashboard"
          className="back-button"
        >
          ← Dashboard
        </Link>

      </header>


      {/* ================= SUMMARY ================= */}

      <section className="assessment-summary">

        <div className="assessment-stat">

          <div className="assessment-icon">
            📝
          </div>

          <div>
            <span>
              Total Assessments
            </span>

            <strong>
              {totalAssessments}
            </strong>
          </div>

        </div>


        <div className="assessment-stat">

          <div className="assessment-icon">
            ✅
          </div>

          <div>
            <span>
              Completed
            </span>

            <strong>
              {completedAssessments}
            </strong>
          </div>

        </div>


        <div className="assessment-stat">

          <div className="assessment-icon">
            ⏳
          </div>

          <div>
            <span>
              Pending
            </span>

            <strong>
              {pendingAssessments}
            </strong>
          </div>

        </div>


        <div className="assessment-stat">

          <div className="assessment-icon">
            🏆
          </div>

          <div>
            <span>
              Average Score
            </span>

            <strong>
              {completedResults.length > 0
                ? `${averageScore}%`
                : "-"}
            </strong>
          </div>

        </div>

      </section>


      {/* ================= LOADING ================= */}

      {loading && (

        <section className="assessment-card">

          <div className="section-heading">

            <div>

              <h2>
                My Assessments
              </h2>

              <p>
                Loading assessments...
              </p>

            </div>

          </div>

        </section>

      )}


      {/* ================= ERROR ================= */}

      {!loading && error && (

        <section className="assessment-card">

          <div className="program-error">

            <span>
              ⚠️
            </span>

            <div>

              <strong>
                Unable to load assessments
              </strong>

              <p>
                {error}
              </p>

            </div>

          </div>

        </section>

      )}


      {/* ================= NO ASSESSMENTS ================= */}

      {!loading &&
        !error &&
        assessments.length === 0 && (

          <section className="assessment-card">

            <div className="section-heading">

              <div>

                <h2>
                  My Assessments
                </h2>

                <p>
                  No assessments are available yet.
                </p>

              </div>

            </div>

          </section>

        )}


      {/* ================= ASSESSMENTS TABLE ================= */}

      {!loading &&
        !error &&
        assessments.length > 0 && (

          <section className="assessment-card">

            <div className="section-heading">

              <div>

                <h2>
                  My Assessments
                </h2>

                <p>
                  Assessment status and scores.
                </p>

              </div>

            </div>


            <div className="assessment-table-wrapper">

              <table className="assessment-table">

                <thead>

                  <tr>

                    <th>
                      #
                    </th>

                    <th>
                      Assessment
                    </th>

                    <th>
                      Training Program
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Score
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {assessments.map(
                    (assessment, index) => {

                      const completed =
                        isAssessmentCompleted(
                          assessment.id
                        );

                      const result =
                        results.find(
                          (item) =>
                            Number(
                              item.assessment?.id
                            ) ===
                            Number(
                              assessment.id
                            )
                        );

                      return (

                        <tr
                          key={assessment.id}
                        >

                          {/* NUMBER */}

                          <td>
                            {index + 1}
                          </td>


                          {/* ASSESSMENT */}

                          <td>
                            {assessment.title}
                          </td>


                          {/* TRAINING PROGRAM */}

                          <td>
                            {assessment
                              .trainingProgram
                              ?.title ||
                              "Training Program"}
                          </td>


                          {/* DATE */}

                          <td>
                            {assessment.date ||
                              assessment.createdAt ||
                              "-"}
                          </td>


                          {/* SCORE */}

                          <td>

                            {completed &&
                            result ? (

                              <strong>
                                {
                                  result.marksObtained
                                }
                                /
                                {
                                  assessment.totalMarks
                                }
                              </strong>

                            ) : (

                              "-"
                            )}

                          </td>


                          {/* STATUS */}

                          <td>

                            <span
                              className={`assessment-status ${
                                completed
                                  ? "completed"
                                  : "pending"
                              }`}
                            >

                              {completed
                                ? "Completed"
                                : "Pending"}

                            </span>

                          </td>


                          {/* ACTION */}

                          <td>

                            {completed ? (

                              <Link
                                to="/results"
                                className="assessment-action completed-action"
                              >
                                ✓ Completed
                              </Link>

                            ) : (

                              <Link
                                to={`/assessment-questions/${assessment.id}`}
                                className="assessment-action start-action"
                              >
                                ▶ Start Assessment
                              </Link>

                            )}

                          </td>

                        </tr>

                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          </section>

        )}

    </div>
  );
}

export default Assessments;