import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./TrainerProjectDetails.css";

function TrainerProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await api.get(`/projects/${id}`);

        setProject(response.data);
        setError("");
      } catch (err) {
        console.error("Project Details API Error:", err);
        setError("Unable to load project details.");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  const handleBack = () => {
    navigate("/trainer-projects");
  };

  if (loading) {
    return (
      <div className="trainer-project-details-page">
        <div className="project-details-message">
          <h2>Loading Project...</h2>
          <p>Please wait while project details are loaded.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trainer-project-details-page">
        <div className="project-details-message">
          <h2>Unable to Load Project</h2>
          <p>{error}</p>

          <button onClick={handleBack}>
            ← Back to Projects
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="trainer-project-details-page">
        <div className="project-details-message">
          <h2>Project Not Found</h2>

          <button onClick={handleBack}>
            ← Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="trainer-project-details-page">

      <header className="trainer-project-details-header">

        <div>
          <h1>Review Project</h1>
          <p>View student project submission details.</p>
        </div>

        <Link to="/trainer-projects">
          ← Projects
        </Link>

      </header>

      <section className="trainer-project-details-card">

        <div className="project-details-icon">
          💻
        </div>

        <h2>
          {project.title ||
            project.projectTitle ||
            "Student Project"}
        </h2>

        <p className="project-description">
          {project.description ||
            "No project description available."}
        </p>

        <div className="project-details-grid">

          <div className="project-detail-box">
            <span>Project ID</span>
            <strong>{project.id}</strong>
          </div>

          <div className="project-detail-box">
            <span>Student</span>
            <strong>
              {project.student?.name ||
                project.studentName ||
                project.student?.fullName ||
                "Not specified"}
            </strong>
          </div>

          <div className="project-detail-box">
            <span>Technology</span>
            <strong>
              {project.technology ||
                project.technologies ||
                project.techStack ||
                "Not specified"}
            </strong>
          </div>

          <div className="project-detail-box">
            <span>Status</span>
            <strong>
              {project.status || "Submitted"}
            </strong>
          </div>

        </div>

        <div className="project-actions">

          <button
            type="button"
            className="back-project-button"
            onClick={handleBack}
          >
            ← Back to Projects
          </button>

        </div>

      </section>

    </div>
  );
}

export default TrainerProjectDetails;