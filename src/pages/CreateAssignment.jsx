import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CreateAssignment.css";

function CreateAssignment() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    program: "",
    module: "",
    dueDate: "",
    marks: "",
  });

  const [attachment, setAttachment] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAttachment = (e) => {
    const file = e.target.files[0];

    if (file) {
      setAttachment(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage("Assignment created successfully.");

    setTimeout(() => {
      navigate("/assignments");
    }, 1500);
  };

  return (
    <div className="create-assignment-page">

      <header className="create-assignment-header">

        <div>
          <h1>Create Assignment</h1>
          <p>
            Create and publish an assignment for your students.
          </p>
        </div>

        <Link
          to="/assignments"
          className="create-back-button"
        >
          ← Assignments
        </Link>

      </header>

      <div className="create-assignment-container">

        <div className="create-assignment-card">

          <div className="form-heading">
            <div className="form-heading-icon">
              📋
            </div>

            <div>
              <h2>Assignment Information</h2>
              <p>
                Enter the details of the assignment below.
              </p>
            </div>
          </div>

          {message && (
            <div className="create-success-message">
              ✅ {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label>
                Assignment Title
              </label>

              <input
                type="text"
                name="title"
                placeholder="Enter assignment title"
                value={formData.title}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                name="description"
                placeholder="Enter assignment description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                required
              />

            </div>

            <div className="form-row">

              <div className="form-group">

                <label>
                  Training Program
                </label>

                <select
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select training program
                  </option>

                  <option value="Java Full Stack Development">
                    Java Full Stack Development
                  </option>

                  <option value="Web Development">
                    Web Development
                  </option>

                  <option value="Python Development">
                    Python Development
                  </option>

                </select>

              </div>

              <div className="form-group">

                <label>
                  Training Module
                </label>

                <select
                  name="module"
                  value={formData.module}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select module
                  </option>

                  <option value="Introduction to Java">
                    Introduction to Java
                  </option>

                  <option value="Spring Boot">
                    Spring Boot
                  </option>

                  <option value="React">
                    React
                  </option>

                  <option value="MySQL">
                    MySQL
                  </option>

                </select>

              </div>

            </div>

            <div className="form-row">

              <div className="form-group">

                <label>
                  Due Date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Maximum Marks
                </label>

                <input
                  type="number"
                  name="marks"
                  placeholder="Enter maximum marks"
                  min="1"
                  value={formData.marks}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            <div className="form-group">

              <label>
                Assignment Attachment
              </label>

              <div className="attachment-box">

                <input
                  id="assignment-file"
                  type="file"
                  accept=".pdf,.doc,.docx,.zip,.rar"
                  onChange={handleAttachment}
                />

                <label
                  htmlFor="assignment-file"
                  className="attachment-label"
                >
                  📎 Choose Assignment File
                </label>

                {attachment && (
                  <div className="selected-file">
                    <span>📄</span>

                    <div>
                      <small>Selected File</small>
                      <strong>
                        {attachment.name}
                      </strong>
                    </div>
                  </div>
                )}

              </div>

              <small className="file-help">
                Supported files: PDF, DOC, DOCX, ZIP, RAR
              </small>

            </div>

            <div className="form-actions">

              <Link
                to="/assignments"
                className="cancel-button"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="create-button"
              >
                📋 Create Assignment
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default CreateAssignment;