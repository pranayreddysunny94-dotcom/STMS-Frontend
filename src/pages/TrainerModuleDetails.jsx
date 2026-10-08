import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./TrainerModuleDetails.css";

function TrainerModuleDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [module, setModule] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    moduleTitle: "",
    description: "",
    moduleOrder: "",
    duration: "",
    status: ""
  });


  // =====================================================
  // LOAD MODULE
  // =====================================================

  useEffect(() => {

    const loadModule = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await api.get(
          `/training-modules/${id}`
        );

        const data = response.data;

        setModule(data);

        setFormData({
          moduleTitle: data.moduleTitle || "",
          description: data.description || "",
          moduleOrder: data.moduleOrder ?? "",
          duration: data.duration || "",
          status: data.status || ""
        });

      } catch (err) {

        console.error(
          "Training Module Error:",
          err
        );

        if (err.response) {

          const responseData =
            err.response.data;

          setError(
            typeof responseData === "string"
              ? responseData
              : responseData?.message ||
                "Unable to load training module."
          );

        } else {

          setError(
            "Unable to connect to backend."
          );

        }

      } finally {

        setLoading(false);

      }

    };

    loadModule();

  }, [id]);


  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

  };


  // =====================================================
  // START EDIT
  // =====================================================

  const handleEdit = () => {

    setEditing(true);
    setError("");

  };


  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancel = () => {

    setFormData({
      moduleTitle: module.moduleTitle || "",
      description: module.description || "",
      moduleOrder: module.moduleOrder ?? "",
      duration: module.duration || "",
      status: module.status || ""
    });

    setEditing(false);
    setError("");

  };


  // =====================================================
  // UPDATE MODULE
  // =====================================================

  const handleUpdate = async (e) => {

    e.preventDefault();

    if (!module?.trainingProgram?.id) {

      setError(
        "Training program information is missing."
      );

      return;
    }

    try {

      setSaving(true);
      setError("");

      const trainingProgramId =
        module.trainingProgram.id;

      const updatedModule = {
        moduleTitle: formData.moduleTitle,
        description: formData.description,
        moduleOrder:
          formData.moduleOrder === ""
            ? null
            : Number(formData.moduleOrder),
        duration: formData.duration,
        status: formData.status
      };

      const response = await api.put(
        `/training-modules/${id}?trainingProgramId=${trainingProgramId}`,
        updatedModule
      );

      setModule(response.data);

      setFormData({
        moduleTitle:
          response.data.moduleTitle || "",

        description:
          response.data.description || "",

        moduleOrder:
          response.data.moduleOrder ?? "",

        duration:
          response.data.duration || "",

        status:
          response.data.status || ""
      });

      setEditing(false);

    } catch (err) {

      console.error(
        "Update Module Error:",
        err
      );

      if (err.response) {

        const responseData =
          err.response.data;

        setError(
          typeof responseData === "string"
            ? responseData
            : responseData?.message ||
              "Unable to update training module."
        );

      } else {

        setError(
          "Unable to connect to backend."
        );

      }

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // DELETE MODULE
  // =====================================================

  const handleDelete = async () => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this training module?"
    );

    if (!confirmed) {
      return;
    }

    try {

      await api.delete(
        `/training-modules/${id}`
      );

      alert(
        "Training module deleted."
      );

      navigate("/trainer-modules");

    } catch (err) {

      console.error(
        "Delete Module Error:",
        err
      );

      if (err.response) {

        const responseData =
          err.response.data;

        alert(
          typeof responseData === "string"
            ? responseData
            : responseData?.message ||
              "Unable to delete training module."
        );

      } else {

        alert(
          "Unable to connect to backend."
        );

      }

    }

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="trainer-module-details-page">

        <div className="trainer-module-details-card">

          <div className="module-details-icon">
            ⏳
          </div>

          <h2>
            Loading Training Module...
          </h2>

          <p>
            Please wait while the module is loaded.
          </p>

        </div>

      </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error && !module) {

    return (

      <div className="trainer-module-details-page">

        <header className="trainer-module-details-header">

          <div>

            <h1>
              Manage Module
            </h1>

            <p>
              Training module details.
            </p>

          </div>

          <Link
            to="/trainer-modules"
            className="module-back-button"
          >
            ← Modules
          </Link>

        </header>

        <div className="trainer-module-details-card">

          <div className="module-details-icon">
            ⚠️
          </div>

          <h2>
            Unable to Load Module
          </h2>

          <p>
            {error}
          </p>

        </div>

      </div>

    );

  }


  // =====================================================
  // EDIT MODE
  // =====================================================

  if (editing) {

    return (

      <div className="trainer-module-details-page">

        <header className="trainer-module-details-header">

          <div>

            <h1>
              Edit Module
            </h1>

            <p>
              Update the training module information.
            </p>

          </div>

          <Link
            to="/trainer-modules"
            className="module-back-button"
          >
            ← Modules
          </Link>

        </header>


        <section className="trainer-module-details-card">

          <div className="module-details-icon">
            📖
          </div>


          <h2>
            Edit Training Module
          </h2>


          {error && (

            <div className="module-form-error">
              {error}
            </div>

          )}


          <form
            onSubmit={handleUpdate}
            className="module-edit-form"
          >

            {/* MODULE TITLE */}

            <div className="module-form-group">

              <label>
                Module Title
              </label>

              <input
                type="text"
                name="moduleTitle"
                value={formData.moduleTitle}
                onChange={handleChange}
                required
              />

            </div>


            {/* DESCRIPTION */}

            <div className="module-form-group">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                required
              />

            </div>


            {/* MODULE ORDER */}

            <div className="module-form-group">

              <label>
                Module Order
              </label>

              <input
                type="number"
                name="moduleOrder"
                value={formData.moduleOrder}
                onChange={handleChange}
                min="1"
              />

            </div>


            {/* DURATION */}

            <div className="module-form-group">

              <label>
                Duration
              </label>

              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Example: 3 Weeks"
              />

            </div>


            {/* STATUS */}

            <div className="module-form-group">

              <label>
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >

                <option value="">
                  Select Status
                </option>

                <option value="ACTIVE">
                  ACTIVE
                </option>

                <option value="INACTIVE">
                  INACTIVE
                </option>

              </select>

            </div>


            {/* TRAINING PROGRAM */}

            <div className="module-form-group">

              <label>
                Training Program
              </label>

              <input
                type="text"
                value={
                  module?.trainingProgram?.title ||
                  "Training Program"
                }
                disabled
              />

            </div>


            {/* BUTTONS */}

            <div className="module-action-buttons">

              <button
                type="submit"
                className="module-edit-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>


              <button
                type="button"
                className="module-cancel-button"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>

            </div>

          </form>

        </section>

      </div>

    );

  }


  // =====================================================
  // VIEW MODE
  // =====================================================

  return (

    <div className="trainer-module-details-page">

      <header className="trainer-module-details-header">

        <div>

          <h1>
            Manage Module
          </h1>

          <p>
            View and manage your training module.
          </p>

        </div>

        <Link
          to="/trainer-modules"
          className="module-back-button"
        >
          ← Modules
        </Link>

      </header>


      <section className="trainer-module-details-card">

        <div className="module-details-icon">
          📖
        </div>


        <h2>
          {module.moduleTitle ||
            "Training Module"}
        </h2>


        <p className="module-details-description">

          {module.description ||
            "No description available."}

        </p>


        <div className="module-info-grid">

          <div className="module-info-item">

            <span>
              Module ID
            </span>

            <strong>
              {module.id}
            </strong>

          </div>


          <div className="module-info-item">

            <span>
              Module Order
            </span>

            <strong>
              {module.moduleOrder ?? "-"}
            </strong>

          </div>


          <div className="module-info-item">

            <span>
              Duration
            </span>

            <strong>
              {module.duration ||
                "Not specified"}
            </strong>

          </div>


          <div className="module-info-item">

            <span>
              Status
            </span>

            <strong>
              {module.status ||
                "Not specified"}
            </strong>

          </div>


          <div className="module-info-item module-program-item">

            <span>
              Training Program
            </span>

            <strong>
              {module.trainingProgram?.title ||
                "Training Program"}
            </strong>

          </div>

        </div>


        {error && (

          <div className="module-form-error">
            {error}
          </div>

        )}


        <div className="module-action-buttons">

          <button
            type="button"
            className="module-edit-button"
            onClick={handleEdit}
          >
            Edit Module
          </button>


          <button
            type="button"
            className="module-delete-button"
            onClick={handleDelete}
          >
            Delete Module
          </button>

        </div>

      </section>

    </div>

  );

}

export default TrainerModuleDetails;
