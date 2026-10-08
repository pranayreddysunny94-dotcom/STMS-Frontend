import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", formData);

      setMessage(response.data.message);

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "STUDENT",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(
          err.response.data.message || "Registration failed"
        );
      } else {
        setError("Cannot connect to backend");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-container">

        <div className="register-left">

          <div className="logo">🎓</div>

          <h1>
            Student Training
            <br />
            Management System
          </h1>

          <p>
            Learn • Build • Track • Grow
          </p>

          <span>
            Create your account and manage your training,
            attendance, assessments, skills and progress
            in one place.
          </span>

        </div>

        <div className="register-right">

          <h2>Create Account</h2>

          <p className="register-subtitle">
            Register for the Student Training Management System
          </p>

          {error && (
            <p className="register-error">
              {error}
            </p>
          )}

          {message && (
            <p className="success-message">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit}>

            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />

            <label>Register As</label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="STUDENT">Student</option>
              <option value="TRAINER">Trainer</option>
              <option value="ADMIN">Admin</option>
            </select>

            <button type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          <p className="login-text">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;