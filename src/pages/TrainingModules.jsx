import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import "./TrainingModules.css";

function TrainingModules() {
  const [searchParams] = useSearchParams();
  const programId = searchParams.get("programId");

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadModules = async () => {
      setLoading(true);
      setError("");

      try {
        let response;

        if (programId) {
          response = await api.get(
            `/training-modules/program/${programId}`
          );
        } else {
          response = await api.get("/training-modules");
        }

        if (isMounted) {
          setModules(response.data || []);
        }
      } catch (err) {
        console.error(err);

        if (isMounted) {
          setError("Unable to load training modules.");
          setModules([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadModules();

    return () => {
      isMounted = false;
    };
  }, [programId]);

  return (
    <div className="modules-page">

      <header className="modules-header">
        <div>
          <h1>Training Modules</h1>
          <p>
            View the modules available in your training program.
          </p>
        </div>

        <Link
          to="/training-programs"
          className="back-button"
        >
          ← Programs
        </Link>
      </header>

      <div className="module-summary">

        <div className="summary-icon">
          📖
        </div>

        <div>
          <span>Available Modules</span>
          <strong>{modules.length}</strong>
        </div>

      </div>

      {loading && (
        <div className="module-message">

          <div className="message-icon">
            ⏳
          </div>

          <h3>Loading Training Modules</h3>

          <p>
            Please wait while we fetch the available modules.
          </p>

        </div>
      )}

      {!loading && error && (
        <div className="module-error">

          <span className="error-icon">
            ⚠️
          </span>

          <div>
            <strong>Unable to load modules</strong>
            <p>{error}</p>
          </div>

        </div>
      )}

      {!loading && !error && modules.length === 0 && (
        <div className="module-message">

          <div className="message-icon">
            📖
          </div>

          <h3>No Training Modules Available</h3>

          <p>
            There are currently no modules available for this training program.
          </p>

        </div>
      )}

      {!loading && !error && modules.length > 0 && (
        <section className="module-section">

          <div className="section-heading">
            <div>
              <h2>Available Modules</h2>

              <p>
                Follow these modules as part of your training journey.
              </p>
            </div>
          </div>

          <div className="module-grid">

            {modules.map((module) => (
              <div
                className="module-card"
                key={module.id}
              >

                <div className="module-top">

                  <div className="module-icon">
                    📖
                  </div>

                  <span className="module-number">
                    Module {module.moduleOrder}
                  </span>

                </div>

                <h2>
                  {module.moduleTitle || "Training Module"}
                </h2>

                <p className="module-description">
                  {module.description ||
                    "Learn important concepts and practical skills through this training module."}
                </p>

                <div className="module-details">

                  <div className="module-detail">
                    <span>Duration</span>

                    <strong>
                      {module.duration || "Not specified"}
                    </strong>
                  </div>

                  <div className="module-detail">
                    <span>Status</span>

                    <span className="module-status">
                      {module.status || "Active"}
                    </span>
                  </div>

                </div>

                {module.trainingProgram && (
                  <div className="program-info">

                    <span>Training Program</span>

                    <strong>
                      {module.trainingProgram.title}
                    </strong>

                  </div>
                )}

              </div>
            ))}

          </div>

        </section>
      )}

    </div>
  );
}

export default TrainingModules;