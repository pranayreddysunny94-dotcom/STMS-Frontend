import { Link } from "react-router-dom";
import "./Skills.css";

function Skills() {
  return (
    <div className="skills-page">

      <header className="skills-header">
        <div>
          <h1>My Skills</h1>
          <p>Track your technical and professional skills.</p>
        </div>

        <Link to="/student-dashboard" className="back-button">
          ← Dashboard
        </Link>
      </header>

      <section className="skills-summary">

        <div className="skill-stat">
          <div className="skill-icon">💡</div>
          <div>
            <span>Total Skills</span>
            <strong>6</strong>
          </div>
        </div>

        <div className="skill-stat">
          <div className="skill-icon">⭐</div>
          <div>
            <span>Advanced</span>
            <strong>2</strong>
          </div>
        </div>

        <div className="skill-stat">
          <div className="skill-icon">📈</div>
          <div>
            <span>Intermediate</span>
            <strong>3</strong>
          </div>
        </div>

        <div className="skill-stat">
          <div className="skill-icon">🌱</div>
          <div>
            <span>Beginner</span>
            <strong>1</strong>
          </div>
        </div>

      </section>

      <section className="skills-card">

        <div className="section-heading">
          <div>
            <h2>Technical Skills</h2>
            <p>Your current skill levels.</p>
          </div>
        </div>

        <div className="skills-grid">

          <div className="skill-item">
            <div className="skill-title">
              <strong>Java</strong>
              <span>Advanced</span>
            </div>

            <div className="skill-bar">
              <div className="skill-progress advanced"></div>
            </div>

            <p>90%</p>
          </div>

          <div className="skill-item">
            <div className="skill-title">
              <strong>Spring Boot</strong>
              <span>Intermediate</span>
            </div>

            <div className="skill-bar">
              <div className="skill-progress intermediate"></div>
            </div>

            <p>75%</p>
          </div>

          <div className="skill-item">
            <div className="skill-title">
              <strong>React</strong>
              <span>Intermediate</span>
            </div>

            <div className="skill-bar">
              <div className="skill-progress intermediate"></div>
            </div>

            <p>70%</p>
          </div>

          <div className="skill-item">
            <div className="skill-title">
              <strong>MySQL</strong>
              <span>Advanced</span>
            </div>

            <div className="skill-bar">
              <div className="skill-progress advanced"></div>
            </div>

            <p>85%</p>
          </div>

          <div className="skill-item">
            <div className="skill-title">
              <strong>HTML & CSS</strong>
              <span>Intermediate</span>
            </div>

            <div className="skill-bar">
              <div className="skill-progress intermediate"></div>
            </div>

            <p>78%</p>
          </div>

          <div className="skill-item">
            <div className="skill-title">
              <strong>JavaScript</strong>
              <span>Beginner</span>
            </div>

            <div className="skill-bar">
              <div className="skill-progress beginner"></div>
            </div>

            <p>50%</p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Skills;