import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const data = response.data;

      // Check selected role
      if (data.role !== role) {
        setError("Selected role does not match your account.");
        setLoading(false);
        return;
      }

      // ==========================================
      // STORE JWT TOKEN
      // ==========================================

      sessionStorage.setItem("token", data.token);

      // ==========================================
      // STORE LOGGED-IN USER INFORMATION
      // ==========================================

      const userData = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      sessionStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      // ==========================================
      // UPDATE AUTH CONTEXT
      // ==========================================

      login(userData);

      // ==========================================
      // NAVIGATION
      // ==========================================

      if (data.role === "STUDENT") {
        navigate("/student-dashboard");
      } else if (data.role === "TRAINER") {
        navigate("/trainer-dashboard");
      } else if (data.role === "ADMIN") {
        navigate("/admin-dashboard");
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err);

      if (err.response && err.response.data) {
        setError(
          err.response.data.message ||
          "Invalid email or password"
        );
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-left">
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
            Manage your training, attendance, assessments,
            skills and overall progress in one place.
          </span>
        </div>

        <div className="login-right">

          <h2>Welcome Back</h2>

          <p className="login-subtitle">
            Login to your account
          </p>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label>Login As</label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="STUDENT">
                Student
              </option>

              <option value="TRAINER">
                Trainer
              </option>

              <option value="ADMIN">
                Admin
              </option>
            </select>

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>

          <p className="register-text">
            Don't have an account?{" "}
            <Link to="/register">
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;