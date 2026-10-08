import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import "./StudentDashboard.css";

function StudentDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [trainingPrograms, setTrainingPrograms] = useState(0);
  const [enrollments, setEnrollments] = useState(0);
  const [attendance, setAttendance] = useState(0);
  const [results, setResults] = useState(0);

  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // =====================================================
  // LOAD DASHBOARD DATA
  // =====================================================

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // =================================================
        // GET LOGGED-IN USER
        // =================================================

        const userData = localStorage.getItem("user");

        if (!userData) {
          console.log("User information not found");
          return;
        }

        const loggedUser = JSON.parse(userData);

        const userId = loggedUser.id;

        if (!userId) {
          console.log("User ID not found");
          return;
        }

        console.log("Dashboard User ID:", userId);

        // =================================================
        // GET STUDENT DETAILS
        // =================================================
        // Example:
        // User ID    = 7
        // Student ID = 3
        //
        // We need Student ID for:
        // - Enrollments
        // - Results
        // =================================================

        let studentId = null;

        try {
          const studentResponse = await api.get(
            `/students/user/${userId}`
          );

          const studentData = studentResponse.data;

          console.log("Student Data:", studentData);

          if (studentData && studentData.id) {
            studentId = studentData.id;

            console.log("Student ID:", studentId);
          } else {
            console.log("Student ID not found");
          }
        } catch (error) {
          console.error(
            "Student Details Error:",
            error
          );
        }

        // =================================================
        // TRAINING PROGRAMS
        // =================================================

        try {
          const programResponse = await api.get(
            "/training-programs"
          );

          const programData =
            programResponse.data || [];

          console.log(
            "Training Programs:",
            programData
          );

          setTrainingPrograms(
            Array.isArray(programData)
              ? programData.length
              : 0
          );
        } catch (error) {
          console.error(
            "Training Programs Error:",
            error
          );

          setTrainingPrograms(0);
        }

        // =================================================
        // ENROLLMENTS
        // =================================================
        // Backend supports:
        // GET /api/enrollments/user/{userId}
        //
        // This endpoint internally converts:
        // User ID -> Student ID
        //
        // Therefore this is the safest endpoint.
        // =================================================

        try {
          const enrollmentResponse =
            await api.get(
              `/enrollments/user/${userId}`
            );

          const enrollmentData =
            enrollmentResponse.data || [];

          console.log(
            "Enrollments:",
            enrollmentData
          );

          setEnrollments(
            Array.isArray(enrollmentData)
              ? enrollmentData.length
              : 0
          );
        } catch (error) {
          console.error(
            "Enrollments Error:",
            error
          );

          setEnrollments(0);
        }

        // =================================================
        // ATTENDANCE
        // =================================================
        // Attendance endpoint uses USER ID.
        // =================================================

        try {
          const attendanceResponse =
            await api.get(
              `/attendance/user/${userId}`
            );

          const attendanceData =
            attendanceResponse.data || [];

          console.log(
            "Attendance:",
            attendanceData
          );

          if (
            Array.isArray(attendanceData) &&
            attendanceData.length > 0
          ) {
            const total =
              attendanceData.length;

            const present =
              attendanceData.filter(
                (item) =>
                  item.status?.toUpperCase() ===
                  "PRESENT"
              ).length;

            const percentage =
              Math.round(
                (present / total) * 100
              );

            setAttendance(percentage);
          } else {
            setAttendance(0);
          }
        } catch (error) {
          console.error(
            "Attendance Error:",
            error
          );

          setAttendance(0);
        }

        // =================================================
        // RESULTS
        // =================================================
        // Results endpoint uses STUDENT ID.
        //
        // Example:
        // User ID    = 7
        // Student ID = 3
        //
        // Therefore:
        // /results/student/3
        // =================================================

        if (studentId) {
          try {
            const resultsResponse =
              await api.get(
                `/results/student/${studentId}`
              );

            const resultsData =
              resultsResponse.data || [];

            console.log(
              "Results:",
              resultsData
            );

            setResults(
              Array.isArray(resultsData)
                ? resultsData.length
                : 0
            );
          } catch (error) {
            console.error(
              "Results Error:",
              error
            );

            setResults(0);
          }
        } else {
          setResults(0);
        }
      } catch (error) {
        console.error(
          "Dashboard Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="student-dashboard">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="dashboard-sidebar">

        <div className="sidebar-logo">

          <div className="logo-icon">
            🎓
          </div>

          <h2>
            STMS
          </h2>

          <p>
            Student Training Management
          </p>

        </div>

        <nav className="sidebar-menu">

          <Link
            to="/student-dashboard"
            className="sidebar-link active"
          >
            <span>🏠</span>
            Dashboard
          </Link>

          <Link
            to="/student-profile"
            className="sidebar-link"
          >
            <span>👤</span>
            My Profile
          </Link>

          <Link
            to="/training-programs"
            className="sidebar-link"
          >
            <span>📚</span>
            Training Programs
          </Link>

          <Link
            to="/training-modules"
            className="sidebar-link"
          >
            <span>📖</span>
            Training Modules
          </Link>

          <Link
            to="/enrollments"
            className="sidebar-link"
          >
            <span>📝</span>
            My Enrollments
          </Link>

          <Link
            to="/attendance"
            className="sidebar-link"
          >
            <span>📅</span>
            Attendance
          </Link>

          <Link
            to="/assessments"
            className="sidebar-link"
          >
            <span>🧾</span>
            Assessments
          </Link>

          <Link
            to="/assignments"
            className="sidebar-link"
          >
            <span>📋</span>
            Assignments
          </Link>

          <Link
            to="/results"
            className="sidebar-link"
          >
            <span>📊</span>
            My Results
          </Link>

          <Link
            to="/skills"
            className="sidebar-link"
          >
            <span>💡</span>
            My Skills
          </Link>

          <Link
            to="/projects"
            className="sidebar-link"
          >
            <span>💻</span>
            My Projects
          </Link>

          <Link
            to="/feedback"
            className="sidebar-link"
          >
            <span>💬</span>
            Feedback
          </Link>

        </nav>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          <span>🚪</span>
          Logout
        </button>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="dashboard-main">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="dashboard-header">

          <div>

            <h1>
              Student Dashboard
            </h1>

            <p>
              Manage your training and track your progress.
            </p>

          </div>

          <div className="user-info">

            <div className="user-avatar">

              {user?.name
                ?.charAt(0)
                .toUpperCase()}

            </div>

            <div>

              <strong>
                {user?.name}
              </strong>

              <span>
                {user?.role}
              </span>

            </div>

          </div>

        </header>

        {/* =================================================
            WELCOME
        ================================================= */}

        <section className="welcome-section">

          <div>

            <h2>
              Welcome back, {user?.name}! 👋
            </h2>

            <p>
              Continue your training journey and keep improving
              your skills.
            </p>

          </div>

        </section>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="dashboard-stats">

          {/* TRAINING PROGRAMS */}

          <div className="stat-card">

            <div className="stat-icon">
              📚
            </div>

            <div>

              <h3>
                Training Programs
              </h3>

              <strong>
                {loading
                  ? "..."
                  : trainingPrograms}
              </strong>

              <p>
                Available programs
              </p>

            </div>

          </div>

          {/* ENROLLMENTS */}

          <div className="stat-card">

            <div className="stat-icon">
              📝
            </div>

            <div>

              <h3>
                Enrollments
              </h3>

              <strong>
                {loading
                  ? "..."
                  : enrollments}
              </strong>

              <p>
                Active enrollments
              </p>

            </div>

          </div>

          {/* ATTENDANCE */}

          <div className="stat-card">

            <div className="stat-icon">
              📅
            </div>

            <div>

              <h3>
                Attendance
              </h3>

              <strong>
                {loading
                  ? "..."
                  : `${attendance}%`}
              </strong>

              <p>
                Overall attendance
              </p>

            </div>

          </div>

          {/* RESULTS */}

          <div className="stat-card">

            <div className="stat-icon">
              🏆
            </div>

            <div>

              <h3>
                Results
              </h3>

              <strong>
                {loading
                  ? "..."
                  : results}
              </strong>

              <p>
                Completed assessments
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            QUICK ACCESS
        ================================================= */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                Quick Access
              </h2>

              <p>
                Access your important training features.
              </p>

            </div>

          </div>

          <div className="dashboard-cards">

            <Link
              to="/student-profile"
              className="dashboard-card"
            >
              <div className="card-icon">
                👤
              </div>

              <h3>
                My Profile
              </h3>

              <p>
                View and manage your student information.
              </p>
            </Link>

            <Link
              to="/training-programs"
              className="dashboard-card"
            >
              <div className="card-icon">
                📚
              </div>

              <h3>
                Training Programs
              </h3>

              <p>
                Explore available training programs.
              </p>
            </Link>

            <Link
              to="/training-modules"
              className="dashboard-card"
            >
              <div className="card-icon">
                📖
              </div>

              <h3>
                Training Modules
              </h3>

              <p>
                View modules from your training programs.
              </p>
            </Link>

            <Link
              to="/enrollments"
              className="dashboard-card"
            >
              <div className="card-icon">
                📝
              </div>

              <h3>
                My Enrollments
              </h3>

              <p>
                Check your enrolled training programs.
              </p>
            </Link>

            <Link
              to="/attendance"
              className="dashboard-card"
            >
              <div className="card-icon">
                📅
              </div>

              <h3>
                Attendance
              </h3>

              <p>
                Track your training attendance.
              </p>
            </Link>

            <Link
              to="/assessments"
              className="dashboard-card"
            >
              <div className="card-icon">
                🧾
              </div>

              <h3>
                Assessments
              </h3>

              <p>
                View upcoming assessments and marks.
              </p>
            </Link>

            <Link
              to="/assignments"
              className="dashboard-card"
            >
              <div className="card-icon">
                📋
              </div>

              <h3>
                Assignments
              </h3>

              <p>
                View assignments and submit your work.
              </p>
            </Link>

            <Link
              to="/results"
              className="dashboard-card"
            >
              <div className="card-icon">
                📊
              </div>

              <h3>
                My Results
              </h3>

              <p>
                View your assessment results and progress.
              </p>
            </Link>

            <Link
              to="/skills"
              className="dashboard-card"
            >
              <div className="card-icon">
                💡
              </div>

              <h3>
                My Skills
              </h3>

              <p>
                Manage and track your technical skills.
              </p>
            </Link>

            <Link
              to="/projects"
              className="dashboard-card"
            >
              <div className="card-icon">
                💻
              </div>

              <h3>
                My Projects
              </h3>

              <p>
                View your completed and ongoing projects.
              </p>
            </Link>

            <Link
              to="/feedback"
              className="dashboard-card"
            >
              <div className="card-icon">
                💬
              </div>

              <h3>
                Feedback
              </h3>

              <p>
                Share feedback about your training.
              </p>
            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default StudentDashboard;