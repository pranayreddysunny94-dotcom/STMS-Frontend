import { useState } from "react";
import { Link } from "react-router-dom";
import "./AdminModules.css";

function AdminModules() {
  const [modules, setModules] = useState([
    {
      id: 1,
      name: "Java Fundamentals",
      program: "Full Stack Java Development",
      trainer: "Dr. Rahul Kumar",
      duration: "2 Weeks",
      lessons: 8,
      status: "Active",
    },
    {
      id: 2,
      name: "Spring Boot",
      program: "Full Stack Java Development",
      trainer: "Dr. Rahul Kumar",
      duration: "3 Weeks",
      lessons: 12,
      status: "Active",
    },
    {
      id: 3,
      name: "React Development",
      program: "React Frontend Development",
      trainer: "Priya Sharma",
      duration: "3 Weeks",
      lessons: 10,
      status: "Active",
    },
    {
      id: 4,
      name: "MySQL Database",
      program: "Database Management",
      trainer: "Suresh Reddy",
      duration: "2 Weeks",
      lessons: 7,
      status: "Active",
    },
    {
      id: 5,
      name: "Machine Learning Basics",
      program: "Python & Machine Learning",
      trainer: "Anita Rao",
      duration: "3 Weeks",
      lessons: 11,
      status: "Inactive",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingModule, setEditingModule] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    program: "",
    trainer: "",
    duration: "",
    lessons: "",
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreate = () => {
    setEditingModule(null);

    setFormData({
      name: "",
      program: "",
      trainer: "",
      duration: "",
      lessons: "",
      status: "Active",
    });

    setShowForm(true);
  };

  const handleEdit = (module) => {
    setEditingModule(module);

    setFormData({
      name: module.name,
      program: module.program,
      trainer: module.trainer,
      duration: module.duration,
      lessons: module.lessons,
      status: module.status,
    });

    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingModule) {
      setModules((previousModules) =>
        previousModules.map((module) =>
          module.id === editingModule.id
            ? {
                ...module,
                ...formData,
                lessons: Number(formData.lessons),
              }
            : module
        )
      );
    } else {
      const newModule = {
        id:
          modules.length > 0
            ? Math.max(...modules.map((module) => module.id)) + 1
            : 1,
        ...formData,
        lessons: Number(formData.lessons),
      };

      setModules((previousModules) => [
        ...previousModules,
        newModule,
      ]);
    }

    setShowForm(false);
    setEditingModule(null);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this module?"
    );

    if (!confirmed) {
      return;
    }

    setModules((previousModules) =>
      previousModules.filter(
        (module) => module.id !== id
      )
    );
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingModule(null);
  };

  return (
    <div className="admin-modules-page">

      <header className="admin-modules-header">

        <div>
          <h1>Training Modules</h1>
          <p>
            Manage modules across all training programs.
          </p>
        </div>

        <Link to="/admin-dashboard">
          ← Dashboard
        </Link>

      </header>


      <section className="admin-modules-top">

        <h2>Modules</h2>

        <button
          type="button"
          onClick={handleCreate}
        >
          Create Module
        </button>

      </section>


      <section className="admin-modules-grid">

        {modules.map((module) => (

          <div
            className="admin-module-card"
            key={module.id}
          >

            <div className="admin-module-top">

              <span className="admin-module-icon">
                📖
              </span>

              <span
                className={
                  module.status === "Active"
                    ? "module-status active"
                    : "module-status inactive"
                }
              >
                {module.status}
              </span>

            </div>


            <h2>{module.name}</h2>


            <p className="admin-module-program">
              {module.program}
            </p>


            <div className="admin-module-details">

              <p>
                <span>Trainer</span>
                <strong>{module.trainer}</strong>
              </p>

              <p>
                <span>Duration</span>
                <strong>{module.duration}</strong>
              </p>

              <p>
                <span>Lessons</span>
                <strong>{module.lessons}</strong>
              </p>

            </div>


            <div className="admin-module-actions">

              <button
                type="button"
                className="module-edit"
                onClick={() => handleEdit(module)}
              >
                Edit
              </button>

              <button
                type="button"
                className="module-delete"
                onClick={() => handleDelete(module.id)}
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </section>


      {showForm && (

        <div className="admin-module-overlay">

          <div className="admin-module-form">

            <div className="admin-module-form-header">

              <div>
                <h2>
                  {editingModule
                    ? "Edit Module"
                    : "Create Module"}
                </h2>

                <p>
                  {editingModule
                    ? "Update module details."
                    : "Enter module details."}
                </p>
              </div>

              <button
                type="button"
                className="module-close"
                onClick={closeForm}
              >
                ×
              </button>

            </div>


            <form onSubmit={handleSubmit}>

              <div className="module-form-group">

                <label>Module Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="module-form-group">

                <label>Program</label>

                <input
                  type="text"
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="module-form-group">

                <label>Trainer</label>

                <input
                  type="text"
                  name="trainer"
                  value={formData.trainer}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="module-form-group">

                <label>Duration</label>

                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Example: 2 Weeks"
                  required
                />

              </div>


              <div className="module-form-group">

                <label>Lessons</label>

                <input
                  type="number"
                  name="lessons"
                  value={formData.lessons}
                  onChange={handleChange}
                  min="1"
                  required
                />

              </div>


              <div className="module-form-group">

                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>


              <div className="admin-module-form-actions">

                <button
                  type="button"
                  className="module-cancel"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="module-save"
                >
                  {editingModule
                    ? "Save Changes"
                    : "Create Module"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminModules;
