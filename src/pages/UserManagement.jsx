import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserManagement.css";

const API_URL = "http://localhost:9090/api/user";

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  role: "STUDENT",
};

function UserManagement() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState(EMPTY_FORM);

  // ==========================================
  // GET JWT TOKEN
  // ==========================================

  const getToken = useCallback(() => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("jwtToken") ||
      localStorage.getItem("jwt") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("jwtToken") ||
      sessionStorage.getItem("jwt") ||
      sessionStorage.getItem("accessToken") ||
      ""
    );
  }, []);

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "STUDENT",
    });
  };

  // ==========================================
  // LOAD USERS
  // ==========================================

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      console.log("JWT TOKEN EXISTS:", token ? "YES" : "NO");

      const headers = {
        Accept: "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/get`, {
        method: "GET",
        headers: headers,
      });

      const responseText = await response.text();

      console.log("GET USERS STATUS:", response.status);
      console.log("GET USERS RESPONSE:", responseText);

      if (!response.ok) {
        throw new Error(
          responseText ||
            `HTTP ${response.status} ${response.statusText}`
        );
      }

      let data = [];

      if (responseText.trim() !== "") {
        data = JSON.parse(responseText);
      }

      if (!Array.isArray(data)) {
        throw new Error("Server response is not a user list.");
      }

      setUsers(data);
    } catch (err) {
      console.error("LOAD USERS ERROR:", err);

      setUsers([]);

      if (err.message) {
        setError(err.message);
      } else {
        setError("Unable to load users.");
      }
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  // ==========================================
  // LOAD USERS WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    void Promise.resolve().then(loadUsers);
  }, [loadUsers]);

  // ==========================================
  // ADD USER
  // ==========================================

  const handleAddUser = () => {
    setEditingUser(null);
    resetForm();
    setShowModal(true);
  };

  // ==========================================
  // EDIT USER
  // ==========================================

  const handleEdit = (user) => {
    setEditingUser(user);

    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "STUDENT",
    });

    setShowModal(true);
  };

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingUser(null);
    resetForm();
  };

  // ==========================================
  // SAVE USER
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password.trim();

    if (!name) {
      alert("Please enter name.");
      return;
    }

    if (!email) {
      alert("Please enter email.");
      return;
    }

    if (!editingUser && !password) {
      alert("Please enter password.");
      return;
    }

    try {
      setSaving(true);

      const token = getToken();

      const url = editingUser
        ? `${API_URL}/update/${editingUser.id}`
        : `${API_URL}/add`;

      const method = editingUser ? "PUT" : "POST";

      const dataToSend = {
        name: name,
        email: email,
        role: formData.role,
      };

      if (!editingUser || password) {
        dataToSend.password = password;
      }

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      console.log("SAVE USER URL:", url);
      console.log("SAVE USER METHOD:", method);

      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(dataToSend),
      });

      const responseText = await response.text();

      console.log("SAVE USER STATUS:", response.status);
      console.log("SAVE USER RESPONSE:", responseText);

      if (!response.ok) {
        throw new Error(
          responseText ||
            `HTTP ${response.status} ${response.statusText}`
        );
      }

      alert(
        editingUser
          ? "User updated successfully."
          : "User added successfully."
      );

      setShowModal(false);
      setEditingUser(null);
      resetForm();

      await loadUsers();
    } catch (err) {
      console.error("SAVE USER ERROR:", err);

      alert(err.message || "Unable to save user.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE USER
  // ==========================================

  const handleDelete = async (id) => {
    if (!id) {
      alert("Invalid user ID.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = getToken();

      const headers = {
        Accept: "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/delete/${id}`, {
        method: "DELETE",
        headers: headers,
      });

      const responseText = await response.text();

      console.log("DELETE USER STATUS:", response.status);
      console.log("DELETE USER RESPONSE:", responseText);

      if (!response.ok) {
        throw new Error(
          responseText ||
            `HTTP ${response.status} ${response.statusText}`
        );
      }

      alert("User deleted successfully.");

      await loadUsers();
    } catch (err) {
      console.error("DELETE USER ERROR:", err);

      alert(err.message || "Unable to delete user.");
    }
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="user-management-page">

      <div className="user-management-header">
        <div>
          <h1>User Management</h1>
          <p>Manage all users registered in the system.</p>
        </div>

        <button
          type="button"
          className="dashboard-btn"
          onClick={() => navigate("/admin-dashboard")}
        >
          ← Dashboard
        </button>
      </div>

      <div className="users-container">

        <div className="users-title-row">
          <div>
            <h2>System Users</h2>
            <p>Manage students, trainers and administrators.</p>
          </div>

          <button
            type="button"
            className="add-user-btn"
            onClick={handleAddUser}
          >
            + Add User
          </button>
        </div>

        {loading && (
          <div className="message-box">
            Loading users...
          </div>
        )}

        {!loading && error && (
          <div className="message-box error-message">
            <strong>Unable to load users</strong>
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="table-wrapper">
            <table className="users-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>

                    <td>{user.id}</td>

                    <td className="user-name">
                      {user.name || "-"}
                    </td>

                    <td>{user.email || "-"}</td>

                    <td>
                      <span
                        className={`role-badge ${String(
                          user.role || ""
                        ).toLowerCase()}`}
                      >
                        {user.role || "-"}
                      </span>
                    </td>

                    <td>
                      <span className="status-badge active">
                        Active
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">

                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(user.id)
                          }
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <div className="message-box">
            No users found.
          </div>
        )}

      </div>

      {showModal && (
        <div className="modal-overlay">

          <div className="user-modal">

            <div className="modal-header">
              <div>
                <h2>
                  {editingUser ? "Edit User" : "Add User"}
                </h2>
                <p>
                  {editingUser
                    ? "Update user information."
                    : "Create a new system user."}
                </p>
              </div>

              <button
                type="button"
                className="close-btn"
                onClick={closeModal}
                disabled={saving}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label htmlFor="name">
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    editingUser
                      ? "Enter new password"
                      : "Enter password"
                  }
                  required={!editingUser}
                />

                {editingUser && (
                  <small>
                    Leave blank to keep the current password.
                  </small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="role">
                  Role
                </label>

                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="STUDENT">STUDENT</option>
                  <option value="TRAINER">TRAINER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingUser
                    ? "Update User"
                    : "Add User"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default UserManagement;