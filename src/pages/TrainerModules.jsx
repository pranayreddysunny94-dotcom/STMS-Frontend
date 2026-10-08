import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./TrainerModules.css";

function TrainerModules() {

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    let isMounted = true;

    const loadModules = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await api.get(
          "/training-modules"
        );

        if (isMounted) {

          setModules(
            Array.isArray(response.data)
              ? response.data
              : []
          );

        }

      } catch (err) {

        console.error(
          "Training Modules API Error:",
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
                  "Unable to load training modules."
            );

          } else {

            setError(
              "Unable to connect to backend."
            );

          }

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

  }, []);

  return (

    <div className="trainer-modules-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="trainer-modules-header">

        <div>

          <h1>
            Training Modules
          </h1>

          <p>
            Manage modules under your assigned programs.
          </p>

        </div>

        <Link to="/trainer-dashboard">
          ← Dashboard
        </Link>

      </header>


      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (

        <section className="trainer-modules-grid">

          <div className="trainer-module-card">

            <div className="trainer-module-icon">
              ⏳
            </div>

            <h2>
              Loading Training Modules...
            </h2>

            <p>
              Please wait while modules are loaded.
            </p>

          </div>

        </section>

      )}


      {/* =====================================================
          ERROR
      ===================================================== */}

      {!loading && error && (

        <section className="trainer-modules-grid">

          <div className="trainer-module-card">

            <div className="trainer-module-icon">
              ⚠️
            </div>

            <h2>
              Unable to Load Modules
            </h2>

            <p>
              {error}
            </p>

          </div>

        </section>

      )}


      {/* =====================================================
          NO MODULES
      ===================================================== */}

      {!loading &&
        !error &&
        modules.length === 0 && (

        <section className="trainer-modules-grid">

          <div className="trainer-module-card">

            <div className="trainer-module-icon">
              📖
            </div>

            <h2>
              No Training Modules
            </h2>

            <p>
              No training modules are available.
            </p>

          </div>

        </section>

      )}


      {/* =====================================================
          MODULES
      ===================================================== */}

      {!loading &&
        !error &&
        modules.length > 0 && (

        <section className="trainer-modules-grid">

          {modules.map((module) => (

            <div
              className="trainer-module-card"
              key={module.id}
            >

              <div className="trainer-module-icon">
                📖
              </div>


              <h2>
                {module.moduleTitle ||
                  "Training Module"}
              </h2>


              <p>
                {module.trainingProgram?.title ||
                  "Training Program"}
              </p>


              <div className="trainer-module-details">

                <span>

                  Duration

                  <strong>
                    {module.duration ||
                      "Not specified"}
                  </strong>

                </span>


                <span>

                  Module Order

                  <strong>
                    {module.moduleOrder ??
                      "-"}
                  </strong>

                </span>

              </div>


              {/* =================================================
                  MANAGE MODULE
              ================================================= */}

              <Link
                to={`/trainer-module-details/${module.id}`}
                className="manage-module-button"
              >
                Manage Module
              </Link>

            </div>

          ))}

        </section>

      )}

    </div>

  );

}

export default TrainerModules;
