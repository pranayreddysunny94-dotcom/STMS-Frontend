import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./CreateProject.css";

function CreateProject() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technology: "",
    startDate: "",
    endDate: "",
    github: "",
  });

  const [projectFile, setProjectFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProjectFile(file);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setMessage("");
  setError("");
  setLoading(true);

  try {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      setError("User session not found. Please login again.");
      setLoading(false);
      return;
    }

    const userData = JSON.parse(savedUser);

    console.log("Logged-in User:", userData);

    if (!userData?.id) {
      setError("Logged-in user information not found.");
      setLoading(false);
      return;
    }

    /*
     * Get Student ID from stored user first.
     */
    let studentId = userData.studentId;

    /*
     * If studentId is not available,
     * get the Student record using User ID.
     */
    if (!studentId) {
      console.log(
        "Student ID not found in user. Looking up student..."
      );

      const studentResponse = await api.get(
        `/students/user/${userData.id}`
      );

      console.log(
        "Student API Response:",
        studentResponse.data
      );

      studentId = studentResponse.data?.id;
    }

    /*
     * Student must exist before creating project.
     */
    if (!studentId) {
      setError(
        "Student record not found for this user."
      );
      setLoading(false);
      return;
    }

    console.log("Logged-in User ID:", userData.id);
    console.log("Student ID:", studentId);

    const projectData = {
      title: formData.title,
      description: formData.description,
      technology: formData.technology,
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      github: formData.github || null,
      status: "Ongoing",

      student: {
        id: studentId,
      },
    };

    console.log(
      "Project data being sent:",
      projectData
    );

    const response = await api.post(
      "/projects",
      projectData
    );

    console.log(
      "Project created:",
      response.data
    );

    setMessage(
      "Project created successfully."
    );

    setTimeout(() => {
      navigate("/projects");
    }, 1000);

  } catch (err) {
    console.error(
      "Create Project API Error:",
      err
    );

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
            `Unable to create project. Server returned ${err.response.status}.`
      );

    } else {
      setError(
        err.message ||
          "Unable to connect to backend."
      );
    }

  } finally {
    setLoading(false);
  }
};
  return (
    <div className="create-project-page">

      <header className="create-project-header">

        <div>
          <h1>Create Project</h1>

          <p>
            Add a new project to your training profile.
          </p>
        </div>

        <Link
          to="/projects"
          className="create-project-back-button"
        >
          ← Projects
        </Link>

      </header>

      <div className="create-project-container">

        <div className="create-project-card">

          <div className="create-project-heading">

            <div className="create-project-heading-icon">
              💻
            </div>

            <div>
              <h2>Project Information</h2>

              <p>
                Enter the details of your project below.
              </p>
            </div>

          </div>

          {message && (
            <div className="create-project-success">
              ✅ {message}
            </div>
          )}

          {error && (
            <div className="create-project-error">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label>
                Project Title
              </label>

              <input
                type="text"
                name="title"
                placeholder="Enter project title"
                value={formData.title}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>
                Project Description
              </label>

              <textarea
                name="description"
                placeholder="Enter project description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>
                Technologies Used
              </label>

              <input
                type="text"
                name="technology"
                placeholder="Example: React, Spring Boot, MySQL"
                value={formData.technology}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-row">

              <div className="form-group">

                <label>
                  Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  End Date
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            <div className="form-group">

              <label>
                GitHub Repository
              </label>

              <input
                type="url"
                name="github"
                placeholder="https://github.com/username/project"
                value={formData.github}
                onChange={handleChange}
              />

            </div>

            <div className="form-group">

              <label>
                Project File
              </label>

              <div className="project-file-box">

                <input
                  id="project-upload"
                  type="file"
                  accept=".zip,.rar,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                />

                <label
                  htmlFor="project-upload"
                  className="project-file-label"
                >
                  📎 Choose Project File
                </label>

                {projectFile && (
                  <div className="selected-project-file">

                    <span>📄</span>

                    <div>

                      <small>
                        Selected File
                      </small>

                      <strong>
                        {projectFile.name}
                      </strong>

                    </div>

                  </div>
                )}

              </div>

              <small className="project-file-help">
                Supported formats: ZIP, RAR, PDF, DOC, DOCX
              </small>

            </div>

            <div className="create-project-actions">

              <Link
                to="/projects"
                className="create-project-cancel"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="create-project-button"
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "💻 Create Project"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default CreateProject;