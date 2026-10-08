import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./AdminPrograms.css";

const EMPTY_FORM = {
  title: "",
  description: "",
  duration: "",
  status: "ACTIVE",
};

function AdminPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingProgram, setEditingProgram] = useState(null);

  const [formData, setFormData] = useState(EMPTY_FORM);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/training-programs");

      setPrograms(response.data || []);
    } catch (err) {
      console.error("Programs API Error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to load training programs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(loadPrograms);
  }, []);

  const handleCreate = () => {
    setEditingProgram({ create: true });

    setFormData({
      title: "",
      description: "",
      duration: "",
      status: "ACTIVE",
    });
  };

  const handleEdit = (program) => {
    setEditingProgram(program);

    setFormData({
      title: program.title || "",
      description: program.description || "",
      duration: program.duration || "",
      status: program.status || "ACTIVE",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (editingProgram?.create) {
        const response = await api.post(
          "/training-programs",
          formData
        );

        setPrograms((previousPrograms) => [
          ...previousPrograms,
          response.data,
        ]);

        alert("Training program created.");
      } else {
        const response = await api.put(
          `/training-programs/${editingProgram.id}`,
          formData
        );

        setPrograms((previousPrograms) =>
          previousPrograms.map((program) =>
            program.id === editingProgram.id
              ? response.data
              : program
          )
        );

        alert("Training program updated.");
      }

      setEditingProgram(null);
      setFormData(EMPTY_FORM);
    } catch (err) {
      console.error("Save Program Error:", err);

      alert(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to save training program."
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this training program?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/training-programs/${id}`);

      setPrograms((previousPrograms) =>
        previousPrograms.filter(
          (program) => program.id !== id
        )
      );

      alert("Training program deleted.");
    } catch (err) {
      console.error("Delete Program Error:", err);

      alert(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to delete training program."
      );
    }
  };

  const closeEdit = () => {
    setEditingProgram(null);
    setFormData(EMPTY_FORM);
  };

  return (
    <div className="admin-programs-page">

      {/* HEADER */}

      <header className="admin-programs-header">

        <div>
          <h1>Training Programs</h1>

          <p>
            Manage all training programs in the system.
          </p>
        </div>

        <Link
          to="/admin-dashboard"
          className="dashboard-button"
        >
          ← Dashboard
        </Link>

      </header>


      {/* PROGRAM TITLE */}

      <div className="program-section-header">

        <h2>Programs</h2>

        <button
          type="button"
          className="create-program-button"
          onClick={handleCreate}
        >
          Create Program
        </button>

      </div>


      {/* LOADING */}

      {loading && (
        <div className="program-message">
          Loading training programs...
        </div>
      )}


      {/* ERROR */}

      {!loading && error && (
        <div className="program-error">
          {error}
        </div>
      )}


      {/* EMPTY */}

      {!loading &&
        !error &&
        programs.length === 0 && (
          <div className="program-message">
            No training programs available.
          </div>
        )}


      {/* PROGRAMS */}

      {!loading &&
        !error &&
        programs.length > 0 && (

          <section className="program-grid">

            {programs.map((program) => (

              <div
                className="program-card"
                key={program.id}
              >

                <div className="program-card-top">

                  <div className="program-icon">
                    📚
                  </div>

                  <span
                    className={
                      program.status === "ACTIVE"
                        ? "status-active"
                        : "status-inactive"
                    }
                  >
                    {program.status || "ACTIVE"}
                  </span>

                </div>


                <h2>
                  {program.title || "Training Program"}
                </h2>


                {program.description && (
                  <p className="program-description">
                    {program.description}
                  </p>
                )}


                <div className="program-details">

                  <div>
                    <span>Trainer</span>

                    <strong>
                      {program.trainer?.name ||
                        program.trainerName ||
                        "Not Assigned"}
                    </strong>
                  </div>


                  <div>
                    <span>Duration</span>

                    <strong>
                      {program.duration ||
                        "Not specified"}
                    </strong>
                  </div>


                  <div>
                    <span>Students</span>

                    <strong>
                      {program.students?.length ??
                        program.studentCount ??
                        0}
                    </strong>
                  </div>

                </div>


                {/* ACTION BUTTONS */}

                <div className="program-actions">

                  <button
                    type="button"
                    className="edit-button"
                    onClick={() =>
                      handleEdit(program)
                    }
                  >
                    Edit
                  </button>


                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      handleDelete(program.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </section>

        )}


      {/* CREATE / EDIT MODAL */}

      {editingProgram && (

        <div className="edit-overlay">

          <div className="edit-modal">

            <div className="edit-modal-header">

              <div>

                <h2>
                  {editingProgram.create
                    ? "Create Training Program"
                    : "Edit Training Program"}
                </h2>

                <p>
                  {editingProgram.create
                    ? "Enter the training program details."
                    : "Update the training program details."}
                </p>

              </div>

              <button
                type="button"
                className="close-button"
                onClick={closeEdit}
              >
                ×
              </button>

            </div>


            <form onSubmit={handleSave}>

              <div className="form-group">

                <label>
                  Program Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter program title"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter program description"
                />

              </div>


              <div className="form-group">

                <label>
                  Duration
                </label>

                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Example: 12 Weeks"
                />

              </div>


              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >

                  <option value="ACTIVE">
                    ACTIVE
                  </option>

                  <option value="INACTIVE">
                    INACTIVE
                  </option>

                </select>

              </div>


              <div className="edit-form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeEdit}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                >
                  {editingProgram.create
                    ? "Create Program"
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminPrograms;