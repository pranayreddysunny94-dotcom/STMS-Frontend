import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./TrainerPrograms.css";

function TrainerPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        console.error("Training Programs API Error:", err);

        if (isMounted) {
          if (err.response) {
            const responseData = err.response.data;

            setError(
              typeof responseData === "string"
                ? responseData
                : responseData?.message ||
                    "Unable to load training programs."
            );
          } else {
            setError("Unable to connect to backend.");
          }
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

  return (
    <div className="trainer-programs-page">

      <header className="trainer-programs-header">
        <div>
          <h1>Training Programs</h1>
          <p>Manage the training programs assigned to you.</p>
        </div>

        <Link to="/trainer-dashboard">
          ← Dashboard
        </Link>
      </header>

      {loading && (
        <div className="program-error">
          <span>⏳</span>
          <div>
            <strong>Loading training programs...</strong>
            <p>Please wait.</p>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="program-error">
          <span>⚠️</span>
          <div>
            <strong>Unable to load training programs</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && programs.length === 0 && (
        <div className="program-error">
          <span>📚</span>
          <div>
            <strong>No training programs found</strong>
            <p>No training programs are available.</p>
          </div>
        </div>
      )}

      {!loading && !error && programs.length > 0 && (
        <section className="trainer-programs-grid">

          {programs.map((program) => (
            <div
              className="trainer-program-card"
              key={program.id}
            >

              <div className="trainer-program-top">
                <span>📚</span>
                <b>{program.status}</b>
              </div>

              <h2>{program.title}</h2>

              <div className="trainer-program-info">

                <p>
                  <span>Duration</span>
                  <strong>
                    {program.duration || "Not specified"}
                  </strong>
                </p>

                <p>
                  <span>Trainer</span>
                  <strong>
                    {program.trainer || "Not specified"}
                  </strong>
                </p>

              </div>

              <Link to="/trainer-modules">
                View Modules →
              </Link>

            </div>
          ))}

        </section>
      )}

    </div>
  );
}

export default TrainerPrograms;