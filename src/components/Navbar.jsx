import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">STMS</Link>
      </div>

      <div className="navbar-user">
        <span>
          {user.name}
        </span>

        <span className="navbar-role">
          {user.role}
        </span>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;