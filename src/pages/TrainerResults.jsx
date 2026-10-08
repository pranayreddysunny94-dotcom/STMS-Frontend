import { Link } from "react-router-dom";
import "./TrainerResults.css";

function TrainerResults() {
  const results = [
    {
      id: 1,
      student: "Kiran Kumar",
      assessment: "Java Fundamentals Test",
      marks: 86,
      total: 100,
      grade: "A",
    },
    {
      id: 2,
      student: "Tarun Kumar",
      assessment: "Java Fundamentals Test",
      marks: 78,
      total: 100,
      grade: "B+",
    },
    {
      id: 3,
      student: "Pranay Reddy",
      assessment: "Java Fundamentals Test",
      marks: 92,
      total: 100,
      grade: "A+",
    },
    {
      id: 4,
      student: "Ajay Kumar",
      assessment: "React Development Test",
      marks: 81,
      total: 100,
      grade: "A",
    },
  ];

  return (
    <div className="trainer-results-page">
      <header className="trainer-results-header">
        <div>
          <h1>Student Results</h1>
          <p>View assessment marks and grades.</p>
        </div>

        <Link to="/trainer-dashboard">← Dashboard</Link>
      </header>

      <section className="trainer-results-card">
        <div className="trainer-results-title">
          <h2>Assessment Results</h2>
          <span>{results.length} Results</span>
        </div>

        <div className="trainer-results-table">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Assessment</th>
                <th>Marks</th>
                <th>Total</th>
                <th>Grade</th>
              </tr>
            </thead>

            <tbody>
              {results.map((result) => (
                <tr key={result.id}>
                  <td className="result-student">{result.student}</td>
                  <td>{result.assessment}</td>
                  <td>{result.marks}</td>
                  <td>{result.total}</td>
                  <td>
                    <span className="grade-badge">{result.grade}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default TrainerResults;