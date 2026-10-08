import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./TrainerProjects.css";

function TrainerProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await api.get("/projects");
        setProjects(response.data || []);
        setError("");
      } catch (err) {
        console.error("Projects API Error:", err);
        setError("Unable to load student projects.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleReviewProject = (id) => {
    navigate(`/trainer-projects/${id}`);
  };

  return (
    <div className="trainer-projects-page">

      <header className="trainer-projects-header">
        <div>
          <h1>Student Projects</h1>
          <p>Review student project submissions.</p>
        </div>

        <Link to="/trainer-dashboard">
          ← Dashboard
        </Link>
      </header>

      {loading && (
        <div className="trainer-project-message">
          <h2>Loading Projects...</h2>
          <p>Please wait while projects are loaded.</p>
        </div>
      )}

      {!loading && error && (
        <div className="trainer-project-message">
          <h2>Unable to Load Projects</h2>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="trainer-project-message">
          <h2>No Student Projects</h2>
          <p>No project submissions are available.</p>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <section className="trainer-projects-grid">

          {projects.map((project) => (
            <div
              className="trainer-project-card"
              key={project.id}
            >

              <div className="trainer-project-top">
                <div className="trainer-project-icon">
                  💻
                </div>

                <span className="trainer-project-status">
                  {project.status || "Submitted"}
                </span>
              </div>

              <h2>
                {project.title ||
                  project.projectTitle ||
                  "Student Project"}
              </h2>

              <p>
                Student:{" "}
                <strong>
                  {project.student?.name ||
                    project.studentName ||
                    project.student?.fullName ||
                    "Student"}
                </strong>
              </p>

              <p>
                Technology:{" "}
                <strong>
                  {project.technology ||
                    project.technologies ||
                    project.techStack ||
                    "Not specified"}
                </strong>
              </p>

              <button
                type="button"
                onClick={() => handleReviewProject(project.id)}
              >
                Review Project
              </button>

            </div>
          ))}

        </section>
      )}

    </div>
  );
}

export default TrainerProjects;