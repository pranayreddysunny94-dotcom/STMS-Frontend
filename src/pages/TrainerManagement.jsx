import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./TrainerManagement.css";

function TrainerManagement() {
  const [trainers, setTrainers] = useState(() => {
    const savedTrainers = localStorage.getItem("stms_trainers");

    return savedTrainers
      ? JSON.parse(savedTrainers)
      : [];
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    programs: 0,
    status: "Active",
  });

  // ==========================================
  // LOAD REGISTERED TRAINERS
  // ==========================================

  useEffect(() => {
    const loadTrainers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/user/get");

        console.log("All users:", response.data);

        // ========================================
        // LOAD SAVED TRAINERS FROM LOCAL STORAGE
        // ========================================

        const savedTrainers =
          localStorage.getItem("stms_trainers");

        if (savedTrainers) {
          setTrainers(JSON.parse(savedTrainers));
          return;
        }

        const users = response.data || [];

        const registeredTrainers = users
          .filter((user) => user.role === "TRAINER")
          .map((user, index) => ({
            id: user.id,
            displayId: index + 1,
            name: user.name,
            email: user.email,
            specialization: "Not Assigned",
            programs: 0,
            status: "Active",
          }));

        console.log(
          "Registered Trainers:",
          registeredTrainers
        );

        setTrainers(registeredTrainers);

      } catch (err) {
        console.error(
          "Trainer Loading Error:",
          err
        );

        setError(
          err.response?.data?.message ||
          "Unable to load trainers."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTrainers();
  }, []);

  // ==========================================
  // ADD TRAINER
  // ==========================================

  const handleAddTrainer = () => {
    setEditingTrainer(null);

    setFormData({
      name: "",
      email: "",
      specialization: "",
      programs: 0,
      status: "Active",
    });

    setShowModal(true);
  };

  // ==========================================
  // EDIT TRAINER
  // ==========================================

  const handleEdit = (trainer) => {
    setEditingTrainer(trainer);

    setFormData({
      name: trainer.name,
      email: trainer.email,
      specialization: trainer.specialization,
      programs: trainer.programs,
      status: trainer.status,
    });

    setShowModal(true);
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter trainer name.");
      return;
    }

    if (!formData.email.trim()) {
      alert("Please enter email.");
      return;
    }

    if (!formData.specialization.trim()) {
      alert("Please enter specialization.");
      return;
    }

    // ========================================
    // EDIT
    // ========================================

    if (editingTrainer) {
      const updatedTrainers = trainers.map((trainer) =>
        trainer.id === editingTrainer.id
          ? {
              ...trainer,

              name: formData.name.trim(),

              email: formData.email.trim(),

              specialization:
                formData.specialization.trim(),

              programs:
                Number(formData.programs),

              status:
                formData.status,
            }
          : trainer
      );

      setTrainers(updatedTrainers);

      localStorage.setItem(
        "stms_trainers",
        JSON.stringify(updatedTrainers)
      );

      alert("Trainer updated successfully.");
    }

    // ========================================
    // ADD
    // ========================================

    else {
      const newTrainer = {
        id: Date.now(),

        displayId:
          trainers.length + 1,

        name:
          formData.name.trim(),

        email:
          formData.email.trim(),

        specialization:
          formData.specialization.trim(),

        programs:
          Number(formData.programs),

        status:
          formData.status,
      };

      const updatedTrainers = [
        ...trainers,
        newTrainer,
      ];

      setTrainers(updatedTrainers);

      localStorage.setItem(
        "stms_trainers",
        JSON.stringify(updatedTrainers)
      );

      alert("Trainer added successfully.");
    }

    setShowModal(false);
    setEditingTrainer(null);
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this trainer?"
    );

    if (!confirmed) {
      return;
    }

    const updatedTrainers = trainers.filter(
      (trainer) => trainer.id !== id
    );

    setTrainers(updatedTrainers);

    localStorage.setItem(
      "stms_trainers",
      JSON.stringify(updatedTrainers)
    );

    alert("Trainer deleted successfully.");
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    setShowModal(false);
    setEditingTrainer(null);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="trainer-management-page">

        <header className="trainer-management-header">

          <div>
            <h1>
              Trainer Management
            </h1>

            <p>
              Manage trainers and their assigned programs.
            </p>
          </div>

          <Link to="/admin-dashboard">
            ← Dashboard
          </Link>

        </header>

        <section className="trainer-management-card">

          <h2>
            Loading Trainers...
          </h2>

        </section>

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="trainer-management-page">

        <header className="trainer-management-header">

          <div>

            <h1>
              Trainer Management
            </h1>

            <p>
              Manage trainers and their assigned programs.
            </p>

          </div>

          <Link to="/admin-dashboard">
            ← Dashboard
          </Link>

        </header>

        <section className="trainer-management-card">

          <h2>
            Unable to Load Trainers
          </h2>

          <p>
            {error}
          </p>

        </section>

      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="trainer-management-page">

      <header className="trainer-management-header">

        <div>

          <h1>
            Trainer Management
          </h1>

          <p>
            Manage trainers and their assigned programs.
          </p>

        </div>

        <Link to="/admin-dashboard">
          ← Dashboard
        </Link>

      </header>

      <section className="trainer-management-card">

        <div className="trainer-management-top">

          <h2>
            Trainers
          </h2>

          <button
            type="button"
            onClick={handleAddTrainer}
          >
            Add Trainer
          </button>

        </div>

        <div className="trainer-table-wrapper">

          <table>

            <thead>

              <tr>

                <th>
                  ID
                </th>

                <th>
                  Trainer
                </th>

                <th>
                  Email
                </th>

                <th>
                  Specialization
                </th>

                <th>
                  Programs
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {trainers.map((trainer) => (

                <tr key={trainer.id}>

                  <td>
                    {trainer.displayId}
                  </td>

                  <td className="trainer-name">
                    {trainer.name}
                  </td>

                  <td>
                    {trainer.email}
                  </td>

                  <td>
                    {trainer.specialization}
                  </td>

                  <td>
                    {trainer.programs}
                  </td>

                  <td>

                    <span
                      className={
                        trainer.status === "Active"
                          ? "trainer-status active"
                          : "trainer-status inactive"
                      }
                    >
                      {trainer.status}
                    </span>

                  </td>

                  <td>

                    <button
                      type="button"
                      className="trainer-edit"
                      onClick={() =>
                        handleEdit(trainer)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="trainer-delete"
                      onClick={() =>
                        handleDelete(trainer.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {trainers.length === 0 && (

            <div
              style={{
                padding: "30px",
                textAlign: "center",
              }}
            >

              <h3>
                No Trainers Found
              </h3>

              <p>
                No registered trainers were found.
              </p>

            </div>

          )}

        </div>

      </section>

      {/* ======================================
          MODAL
      ======================================= */}

      {showModal && (

        <div className="trainer-modal-overlay">

          <div className="trainer-modal">

            <div className="trainer-modal-header">

              <h2>
                {editingTrainer
                  ? "Edit Trainer"
                  : "Add Trainer"}
              </h2>

              <button
                type="button"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="trainer-form-group">

                <label htmlFor="trainer-name">
                  Name
                </label>

                <input
                  id="trainer-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter trainer name"
                />

              </div>

              <div className="trainer-form-group">

                <label htmlFor="trainer-email">
                  Email
                </label>

                <input
                  id="trainer-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />

              </div>

              <div className="trainer-form-group">

                <label htmlFor="trainer-specialization">
                  Specialization
                </label>

                <input
                  id="trainer-specialization"
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="Enter specialization"
                />

              </div>

              <div className="trainer-form-group">

                <label htmlFor="trainer-programs">
                  Programs
                </label>

                <input
                  id="trainer-programs"
                  type="number"
                  name="programs"
                  min="0"
                  value={formData.programs}
                  onChange={handleChange}
                />

              </div>

              <div className="trainer-form-group">

                <label htmlFor="trainer-status">
                  Status
                </label>

                <select
                  id="trainer-status"
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

              <div className="trainer-modal-actions">

                <button
                  type="button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button type="submit">

                  {editingTrainer
                    ? "Update Trainer"
                    : "Add Trainer"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default TrainerManagement;