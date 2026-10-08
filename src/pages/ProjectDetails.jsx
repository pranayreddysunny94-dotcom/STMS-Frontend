import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import "./ProjectDetails.css";

function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(
    id ? "" : "Project ID is missing."
  );

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadProject = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/projects/${id}`);

        if (mounted) {
          setProject(response.data);
        }
      } catch (err) {
        console.error("Project Details API Error:", err);

        if (!mounted) {
          return;
        }

        if (err.response) {
          const data = err.response.data;

          if (typeof data === "string") {
            setError(data);
          } else {
            setError(
              data?.message ||
                `Unable to load project. Server returned ${err.response.status}.`
            );
          }
        } else {
          setError("Unable to connect to backend.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadProject();
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setUploadMessage("");
    setUploadError("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setUploadMessage("");
    setUploadError("");

    if (!selectedFile) {
      setUploadError("Please select a project file.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await api.post(
        `/projects/${id}/submit`,
        formData
      );

      setProject(response.data);
      setSelectedFile(null);

      setUploadMessage(
        "Project file uploaded successfully."
      );
    } catch (err) {
      console.error("Project Upload Error:", err);

      if (err.response) {
        const data = err.response.data;

        if (typeof data === "string") {
          setUploadError(data);
        } else {
          setUploadError(
            data?.message ||
              `Unable to upload file. Server returned ${err.response.status}.`
          );
        }
      } else {
        setUploadError("Unable to connect to backend.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleReplaceFile = () => {
    setSelectedFile(null);
    setUploadMessage("");
    setUploadError("");

    const input = document.getElementById(
      "replace-project-file"
    );

    if (input) {
      input.value = "";
      input.click();
    }
  };

  if (loading) {
    return (
      <div className="project-details-page">
        <header className="project-details-header">
          <div>
            <h1>Project Details</h1>
            <p>Loading project information...</p>
          </div>

          <Link
            to="/projects"
            className="project-details-back-button"
          >
            ← Projects
          </Link>
        </header>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-details-page">
        <header className="project-details-header">
          <div>
            <h1>Project Details</h1>
            <p>{error}</p>
          </div>

          <Link
            to="/projects"
            className="project-details-back-button"
          >
            ← Projects
          </Link>
        </header>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-details-page">
        <header className="project-details-header">
          <div>
            <h1>Project Details</h1>
            <p>Project not found.</p>
          </div>

          <Link
            to="/projects"
            className="project-details-back-button"
          >
            ← Projects
          </Link>
        </header>
      </div>
    );
  }

  const hasSubmittedFile =
    Boolean(project.projectFileName);

  const isCompleted =
    project.status?.toUpperCase() === "COMPLETED";

  return (
    <div className="project-details-page">

      {/* ================= HEADER ================= */}

      <header className="project-details-header">

        <div>
          <h1>Project Details</h1>

          <p>
            View project information and submit your
            project work.
          </p>
        </div>

        <Link
          to="/projects"
          className="project-details-back-button"
        >
          ← Projects
        </Link>

      </header>

      {/* ================= MAIN CONTAINER ================= */}

      <div className="project-details-container">

        {/* ================= PROJECT INFORMATION ================= */}

        <div className="project-main-card">

          <div className="project-details-top">

            <div className="project-details-icon">
              💻
            </div>

            <div className="project-details-title">

              <h2>
                {project.title}
              </h2>

              <span
                className={`project-details-status ${
                  isCompleted
                    ? "completed"
                    : "ongoing"
                }`}
              >
                {project.status || "Ongoing"}
              </span>

            </div>

          </div>

          {/* ================= PROJECT INFO ================= */}

          <div className="project-info-grid">

            <div className="project-info-item">
              <span>
                🛠️ Technologies
              </span>

              <strong>
                {project.technology || "-"}
              </strong>
            </div>

            <div className="project-info-item">
              <span>
                📅 Start Date
              </span>

              <strong>
                {project.startDate || "-"}
              </strong>
            </div>

            <div className="project-info-item">
              <span>
                📅 End Date
              </span>

              <strong>
                {project.endDate || "-"}
              </strong>
            </div>

            <div className="project-info-item">
              <span>
                🆔 Project ID
              </span>

              <strong>
                {project.id}
              </strong>
            </div>

            <div className="project-info-item">
              <span>
                📌 Status
              </span>

              <strong>
                {project.status || "Ongoing"}
              </strong>
            </div>

            <div className="project-info-item">
              <span>
                📎 Project File
              </span>

              <strong>
                {project.projectFileName ||
                  "Not submitted"}
              </strong>
            </div>

          </div>

          {/* ================= DESCRIPTION ================= */}

          <section className="project-details-section">

            <h3>
              Project Description
            </h3>

            <p>
              {project.description ||
                "No description provided."}
            </p>

          </section>

          {/* ================= GITHUB ================= */}

          <section className="project-details-section">

            <h3>
              Project Repository
            </h3>

            {project.github ? (

              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="github-button"
              >
                🔗 Open GitHub Repository
              </a>

            ) : (

              <p>
                GitHub repository not provided.
              </p>

            )}

          </section>

        </div>

        {/* ================= SUBMISSION CARD ================= */}

        <div className="project-submission-card">

          <div className="project-submission-heading">

            <div className="project-submission-icon">
              📤
            </div>

            <div>

              <h2>
                Project Submission
              </h2>

              <p>
                Upload your completed project.
              </p>

            </div>

          </div>

          {/* ================= SUCCESS MESSAGE ================= */}

          {uploadMessage && (

            <div className="project-submission-success">

              ✅ {uploadMessage}

            </div>

          )}

          {/* ================= ERROR MESSAGE ================= */}

          {uploadError && (

            <div className="project-submission-error">

              ⚠️ {uploadError}

            </div>

          )}

          {/* ================= EXISTING FILE ================= */}

          {hasSubmittedFile ? (

            <div className="project-submission-success">

              <div className="project-success-icon">
                ✓
              </div>

              <h3>
                Project Submitted
              </h3>

              <p>
                Your project file has been uploaded.
              </p>

              <div className="project-submitted-file">

                📎{" "}

                {project.projectFileName}

              </div>

              <button
                type="button"
                className="project-replace-button"
                onClick={handleReplaceFile}
                disabled={uploading}
              >
                Replace File
              </button>

              <input
                id="replace-project-file"
                type="file"
                accept=".zip,.rar,.pdf,.doc,.docx"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              {selectedFile && (

                <form
                  onSubmit={handleSubmit}
                  style={{ marginTop: "15px" }}
                >

                  <div className="project-selected-file">

                    <span>
                      📄
                    </span>

                    <div>

                      <small>
                        New File
                      </small>

                      <strong>
                        {selectedFile.name}
                      </strong>

                    </div>

                  </div>

                  <button
                    type="submit"
                    className="project-submit-button"
                    disabled={uploading}
                  >
                    {uploading
                      ? "Uploading..."
                      : "📤 Upload New File"}
                  </button>

                </form>

              )}

            </div>

          ) : (

            /* ================= NEW FILE ================= */

            <form onSubmit={handleSubmit}>

              <div className="project-upload-area">

                <div className="project-upload-icon">
                  📁
                </div>

                <h3>
                  Upload your project
                </h3>

                <p>
                  Select your completed project file.
                </p>

                <label
                  htmlFor="project-file"
                  className="project-choose-file-button"
                >
                  Choose File
                </label>

                <input
                  id="project-file"
                  type="file"
                  accept=".zip,.rar,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                />

                {selectedFile && (

                  <div className="project-selected-file">

                    <span>
                      📄
                    </span>

                    <div>

                      <small>
                        Selected File
                      </small>

                      <strong>
                        {selectedFile.name}
                      </strong>

                    </div>

                  </div>

                )}

              </div>

              <button
                type="submit"
                className="project-submit-button"
                disabled={
                  !selectedFile || uploading
                }
              >
                {uploading
                  ? "Uploading..."
                  : "📤 Submit Project"}
              </button>

              <p className="project-submission-note">
                Supported formats: ZIP, RAR, PDF,
                DOC, DOCX
              </p>

            </form>

          )}

        </div>

      </div>

    </div>
  );
}

export default ProjectDetails;