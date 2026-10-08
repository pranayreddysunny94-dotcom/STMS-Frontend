import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Results.css";

function Results() {

  const [assessments, setAssessments] = useState([]);
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    let isMounted = true;

    const loadResults = async () => {

      try {

        const userData = JSON.parse(
          localStorage.getItem("user")
        );

        if (!userData?.id) {
          throw new Error(
            "Logged-in user information not found."
          );
        }

        // Get the Student record linked to the logged-in user
        const studentResponse = await api.get(
          `/students/user/${userData.id}`
        );

        const studentId =
          studentResponse.data.id;

        // Get all assessments and this student's results
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
          "Results API Error:",
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
                    "Unable to load results."
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

    loadResults();

    return () => {
      isMounted = false;
    };

  }, []);

  if (loading) {

    return (
      <div className="results-page">

        <section className="results-card">

          <div className="section-heading">
            <div>
              <h2>Loading Results...</h2>

              <p>
                Please wait while your results
                are loaded.
              </p>
            </div>
          </div>

        </section>

      </div>
    );
  }

  if (error) {

    return (
      <div className="results-page">

        <section className="results-card">

          <div className="section-heading">

            <div>

              <h2>
                Unable to Load Results
              </h2>

              <p>{error}</p>

            </div>

          </div>

          <Link
            to="/student-dashboard"
            className="back-button"
          >
            ← Dashboard
          </Link>

        </section>

      </div>
    );
  }

  /*
   * Match each assessment with the student's
   * result.
   */
  const assessmentRows =
    assessments.map((assessment) => {

      const result = results.find(
        (item) =>
          item.assessment?.id ===
          assessment.id
      );

      return {
        assessment,
        result,
      };
    });

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

  const passedCount =
    completedResults.filter(
      (result) =>
        result.resultStatus === "PASS"
    ).length;

  const totalAssessments =
    assessments.length;

  return (
    <div className="results-page">

      {/* Header */}

      <header className="results-header">

        <div>

          <h1>My Results</h1>

          <p>
            View your assessment results
            and overall training performance.
          </p>

        </div>

        <Link
          to="/student-dashboard"
          className="back-button"
        >
          ← Dashboard
        </Link>

      </header>


      {/* Summary */}

      <section className="results-summary">

        <div className="result-stat">

          <div className="result-icon">
            📝
          </div>

          <div>

            <span>
              Assessments
            </span>

            <strong>
              {totalAssessments}
            </strong>

          </div>

        </div>


        <div className="result-stat">

          <div className="result-icon">
            🏆
          </div>

          <div>

            <span>
              Average Score
            </span>

            <strong>
              {averageScore}%
            </strong>

          </div>

        </div>


        <div className="result-stat">

          <div className="result-icon">
            ✅
          </div>

          <div>

            <span>
              Passed
            </span>

            <strong>
              {passedCount}
            </strong>

          </div>

        </div>


        <div className="result-stat">

          <div className="result-icon">
            📊
          </div>

          <div>

            <span>
              Overall Progress
            </span>

            <strong>
              75%
            </strong>

          </div>

        </div>

      </section>


      {/* Assessment Results */}

      <section className="results-card">

        <div className="section-heading">

          <div>

            <h2>
              Assessment Results
            </h2>

            <p>
              Your completed assessment
              performance.
            </p>

          </div>

        </div>


        <div className="results-table-wrapper">

          <table className="results-table">

            <thead>

              <tr>

                <th>#</th>

                <th>
                  Assessment
                </th>

                <th>
                  Training Program
                </th>

                <th>
                  Marks
                </th>

                <th>
                  Percentage
                </th>

                <th>
                  Grade
                </th>

                <th>
                  Result
                </th>

              </tr>

            </thead>


            <tbody>

              {assessmentRows.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    No assessments available.
                  </td>

                </tr>

              ) : (

                assessmentRows.map(
                  (
                    { assessment, result },
                    index
                  ) => {

                    const trainingProgram =
                      assessment
                        ?.trainingProgram
                        ?.name ||
                      assessment
                        ?.trainingProgram
                        ?.title ||
                      "Java Full Stack Development";

                    const isCompleted =
                      !!result;

                    return (

                      <tr
                        key={assessment.id}
                      >

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          {assessment.title}
                        </td>

                        <td>
                          {trainingProgram}
                        </td>

                        <td>

                          {isCompleted
                            ? `${result.marksObtained}/${assessment.totalMarks}`
                            : "-"}

                        </td>

                        <td>

                          {isCompleted
                            ? `${result.percentage}%`
                            : "-"}

                        </td>

                        <td>

                          {isCompleted
                            ? result.grade
                            : "-"}

                        </td>

                        <td>

                          {isCompleted ? (

                            <span
                              className={`result-badge ${
                                result.resultStatus ===
                                "PASS"
                                  ? "passed"
                                  : "failed"
                              }`}
                            >

                              {result.resultStatus ===
                              "PASS"
                                ? "Passed"
                                : "Failed"}

                            </span>

                          ) : (

                            <span className="result-badge pending">
                              Pending
                            </span>

                          )}

                        </td>

                      </tr>

                    );
                  }
                )

              )}

            </tbody>

          </table>

        </div>

      </section>


      {/* Training Progress */}

      <section className="progress-card">

        <div className="progress-heading">

          <div>

            <h2>
              Training Progress
            </h2>

            <p>
              Overall completion of your
              training program.
            </p>

          </div>

          <strong>
            75%
          </strong>

        </div>


        <div className="progress-bar">

          <div
            className="progress-fill"
            style={{
              width: "75%",
            }}
          ></div>

        </div>


        <div className="progress-info">

          <span>
            Completed: 9 modules
          </span>

          <span>
            Remaining: 3 modules
          </span>

        </div>

      </section>

    </div>
  );
}

export default Results;