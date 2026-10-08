import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">

      {/* Small Navigation Bar */}
      <nav className="home-navbar">
        <div className="home-logo">
          <span>STMS</span>
        </div>

        <div className="home-nav-links">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-badge">Student Training Management System</span>

          <h1>
            Learn. Build. <span>Track. Grow.</span>
          </h1>

          <p>
            A unified digital ecosystem that empowers institutions to efficiently manage
             student development while delivering a seamless and structured experience.
          </p>

          <div className="home-buttons">
            <Link to="/login" className="home-primary-btn">
              Get Started
            </Link>

            <Link to="/register" className="home-secondary-btn">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;