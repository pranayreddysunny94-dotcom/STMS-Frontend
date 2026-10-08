import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Projects.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        const userData = JSON.parse(
          localStorage.getItem("user")
        );

        if (!userData?.id) {
          throw new Error(
            "Logged-in user information not found."
          );
        }

        let studentId = userData.studentId;

        /*
         * If studentId is not stored in localStorage,
         * get the Student record using the logged-in user ID.
         */
        if (!studentId) {
          const studentResponse = await api.get(
            `/students/user/${userData.id}`
          );

          studentId = studentResponse.data?.id;
        }

        if (!studentId) {
          throw new Error(
            "Student record not found."
          );
        }

        console.log("Logged-in User ID:", userData.id);
        console.log("Student ID:", studentId);

        const response = await api.get(
          `/projects/student/${studentId}`
        );

        console.log(
          "Projects API Response:",
          response.data
        );

        if (isMounted) {
          setProjects(response.data || []);
          setError("");
        }

      } catch (err) {
        console.error(
          "Projects API Error:",
          err
        );

        if (isMounted) {

          if (err.response) {

            console.error(
              "Status:",
              err.response.status
            );

            console.error(
              "Response:",
              err.response.data
            );

            const responseData =
              err.response.data;

            setError(
              typeof responseData === "string"
                ? responseData
                : responseData?.message ||
                    `Unable to load projects. Server returned ${err.response.status}.`
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

    loadProjects();

    return () => {
      isMounted = false;
    };

  }, []);

  const totalProjects = projects.length;

  const ongoingProjects =
    projects.filter(
      (project) =>
        project.status?.toUpperCase() ===
        "ONGOING"
    ).length;

  const completedProjects =
    projects.filter(
      (project) =>
        project.status?.toUpperCase() ===
        "COMPLETED"
    ).length;

  return (
    <div className="projects-page">

      <header className="projects-header">

        <div>
          <h1>My Projects</h1>

          <p>
            View your projects, technologies and
            project progress.
          </p>
        </div>

        <Link
          to="/student-dashboard"
          className="projects-back-button"
        >
          ← Dashboard
        </Link>

      </header>

      <section className="project-summary">

        <div className="project-summary-card">

          <div className="project-summary-icon">
            💻
          </div>

          <div>
            <span>Total Projects</span>
            <strong>{totalProjects}</strong>
          </div>

        </div>

        <div className="project-summary-card">

          <div className="project-summary-icon ongoing-icon">
            ⏳
          </div>

          <div>
            <span>Ongoing</span>
            <strong>{ongoingProjects}</strong>
          </div>

        </div>

        <div className="project-summary-card">

          <div className="project-summary-icon completed-icon">
            ✅
          </div>

          <div>
            <span>Completed</span>
            <strong>{completedProjects}</strong>
          </div>

        </div>

      </section>

      {loading && (
        <section className="projects-section">

          <div className="projects-section-heading">

            <div>
              <h2>My Projects</h2>
              <p>Loading projects...</p>
            </div>

          </div>

        </section>
      )}

      {!loading && error && (
        <section className="projects-section">

          <div className="projects-section-heading">

            <div>
              <h2>My Projects</h2>
              <p>{error}</p>
            </div>

          </div>

        </section>
      )}

      {!loading &&
        !error &&
        projects.length === 0 && (

          <section className="projects-section">

            <div className="projects-section-heading">

              <div>
                <h2>My Projects</h2>

                <p>
                  No projects have been added yet.
                </p>
              </div>

              <Link
                to="/create-project"
                className="create-project-link"
              >
                + Create Project
              </Link>

            </div>

          </section>
        )}

      {!loading &&
        !error &&
        projects.length > 0 && (

          <section className="projects-section">

            <div className="projects-section-heading">

              <div>
                <h2>My Projects</h2>

                <p>
                  View your projects, technologies
                  and project progress.
                </p>
              </div>

              <Link
                to="/create-project"
                className="create-project-link"
              >
                + Create Project
              </Link>

            </div>

            <div className="projects-grid">

              {projects.map((project) => {

                const isCompleted =
                  project.status?.toUpperCase() ===
                  "COMPLETED";

                return (
                  <div
                    className="project-card"
                    key={project.id}
                  >

                    <div className="project-card-top">

                      <div className="project-icon">
                        💻
                      </div>

                      <span
                        className={`project-status ${
                          isCompleted
                            ? "completed"
                            : "ongoing"
                        }`}
                      >
                        {project.status}
                      </span>

                    </div>

                    <h3>
                      {project.title}
                    </h3>

                    <p className="project-description">
                      {project.description}
                    </p>

                    <div className="project-details">

                      <div className="project-detail">

                        <span>
                          🛠️ Technologies
                        </span>

                        <strong>
                          {project.technology}
                        </strong>

                      </div>

                      <div className="project-detail">

                        <span>
                          📅 Start Date
                        </span>

                        <strong>
                          {project.startDate || "-"}
                        </strong>

                      </div>

                      <div className="project-detail">

                        <span>
                          📅 End Date
                        </span>

                        <strong>
                          {project.endDate || "-"}
                        </strong>

                      </div>

                    </div>

                    <Link
                      to={`/project-details/${project.id}`}
                      className="project-button"
                    >
                      View Project →
                    </Link>

                  </div>
                );
              })}

            </div>

          </section>
        )}

    </div>
  );
}

export default Projects;