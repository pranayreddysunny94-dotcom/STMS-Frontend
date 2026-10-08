import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";


/* =====================================================
   STUDENT IMPORTS
===================================================== */

import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import TrainingPrograms from "./pages/TrainingPrograms";
import TrainingModules from "./pages/TrainingModules";
import Enrollments from "./pages/Enrollments";
import Attendance from "./pages/Attendance";
import StudentAttendance from "./pages/StudentAttendance";

import Assessments from "./pages/Assessments";
import AssessmentQuestions from "./pages/AssessmentQuestions";
import Results from "./pages/Results";

import Skills from "./pages/Skills";

import Assignments from "./pages/Assignments";
import AssignmentDetails from "./pages/AssignmentDetails";
import CreateAssignment from "./pages/CreateAssignment";

import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import CreateProject from "./pages/CreateProject";

import Feedback from "./pages/Feedback";


/* =====================================================
   TRAINER IMPORTS
===================================================== */

import TrainerDashboard from "./pages/TrainerDashboard";
import TrainerProfile from "./pages/TrainerProfile";
import TrainerPrograms from "./pages/TrainerPrograms";
import TrainerModules from "./pages/TrainerModules";
import TrainerModuleDetails from "./pages/TrainerModuleDetails";
import TrainerStudents from "./pages/TrainerStudents";

import TrainerAttendance from "./pages/TrainerAttendance";
import TrainerAttendanceSession from "./pages/TrainerAttendanceSession";

import TrainerAssignments from "./pages/TrainerAssignments";
import ManageAssignment from "./pages/ManageAssignment";

import TrainerAssessments from "./pages/TrainerAssessments";
import TrainerAssessmentDetails from "./pages/TrainerAssessmentDetails";
import TrainerCreateAssessment from "./pages/TrainerCreateAssessment";
import TrainerAddQuestion from "./pages/TrainerAddQuestion";

import TrainerResults from "./pages/TrainerResults";

import TrainerProjects from "./pages/TrainerProjects";
import TrainerProjectDetails from "./pages/TrainerProjectDetails";

import TrainerFeedback from "./pages/TrainerFeedback";


/* =====================================================
   ADMIN IMPORTS
===================================================== */

import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import StudentManagement from "./pages/StudentManagement";
import TrainerManagement from "./pages/TrainerManagement";
import AdminPrograms from "./pages/AdminPrograms";
import AdminModules from "./pages/AdminModules";
import AdminReports from "./pages/AdminReports";
import AdminProfile from "./pages/AdminProfile";


/* =====================================================
   PROTECTED ROUTE
===================================================== */

import ProtectedRoute from "./components/ProtectedRoute";


function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* =====================================================
            PUBLIC
        ===================================================== */}

        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =====================================================
            STUDENT
        ===================================================== */}

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-profile"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/training-programs"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <TrainingPrograms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/training-modules"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <TrainingModules />
            </ProtectedRoute>
          }
        />

        <Route
          path="/enrollments"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <Enrollments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <Attendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-attendance"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentAttendance />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            STUDENT ASSESSMENTS
        ===================================================== */}

        <Route
          path="/assessments"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <Assessments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assessment-questions/:id"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <AssessmentQuestions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assessments/:id"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <AssessmentQuestions />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            STUDENT RESULTS
        ===================================================== */}

        <Route
          path="/results"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <Results />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            STUDENT ASSIGNMENTS
        ===================================================== */}

        <Route
          path="/assignments"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <Assignments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assignment-details/:id"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <AssignmentDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-assignment"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <CreateAssignment />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            STUDENT SKILLS
        ===================================================== */}

        <Route
          path="/skills"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <Skills />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            STUDENT PROJECTS
        ===================================================== */}

        <Route
          path="/projects"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <Projects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/project-details/:id"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-project"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <CreateProject />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            STUDENT FEEDBACK
        ===================================================== */}

        <Route
          path="/feedback"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <Feedback />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            TRAINER DASHBOARD
        ===================================================== */}

        <Route
          path="/trainer-dashboard"
          element={
            <ProtectedRoute allowedRoles={["TRAINER"]}>
              <TrainerDashboard />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            TRAINER PROFILE
        ===================================================== */}

        <Route
          path="/trainer-profile"
          element={
            <ProtectedRoute allowedRoles={["TRAINER"]}>
              <TrainerProfile />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            TRAINER PROGRAMS
        ===================================================== */}

        <Route
          path="/trainer-programs"
          element={
            <ProtectedRoute allowedRoles={["TRAINER"]}>
              <TrainerPrograms />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            TRAINER MODULES
        ===================================================== */}

        <Route
          path="/trainer-modules"
          element={
            <ProtectedRoute allowedRoles={["TRAINER"]}>
              <TrainerModules />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trainer-module-details/:id"
          element={
            <ProtectedRoute allowedRoles={["TRAINER"]}>
              <TrainerModuleDetails />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            TRAINER STUDENTS
        ===================================================== */}

        <Route
          path="/trainer-students"
          element={
            <ProtectedRoute allowedRoles={["TRAINER"]}>
              <TrainerStudents />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            TRAINER ATTENDANCE
        ===================================================== */}

        <Route
          path="/trainer-attendance"
          element={
            <ProtectedRoute allowedRoles={["TRAINER"]}>
              <TrainerAttendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trainer-attendance/session/:id"
          element={
            <ProtectedRoute allowedRoles={["TRAINER"]}>
              <TrainerAttendanceSession />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            TRAINER ASSIGNMENTS
        ===================================================== */}

        <Route
          path="/trainer-assignments"
          element={
            <ProtectedRoute allowedRoles={["TRAINER"]}>
              <TrainerAssignments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trainer-assignments/:id"
          element={
            <ProtectedRoute allowedRoles={["TRAINER"]}>
              <ManageAssignment />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            TRAINER ASSESSMENTS
        ===================================================== */}

        <Route
          path="/trainer-assessments"
          element={
            <ProtectedRoute allowedRoles={["TRAINER"]}>
              <TrainerAssessments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trainer-assessments/:id"
          element={
            <ProtectedRoute allowedRoles={["TRAINER"]}>
              <TrainerAssessmentDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trainer-assessments/:id/add-question"
          element={
            <ProtectedRoute allowedRoles={["TRAINER"]}>
              <TrainerAddQuestion />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trainer-create-assessment"
          element={
            <ProtectedRoute allowedRoles={["TRAINER"]}>
              <TrainerCreateAssessment />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            TRAINER RESULTS
        ===================================================== */}

        <Route
          path="/trainer-results"
          element={
            <ProtectedRoute allowedRoles={["TRAINER"]}>
              <TrainerResults />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            TRAINER PROJECTS
        ===================================================== */}

        <Route
          path="/trainer-projects"
          element={
            <ProtectedRoute allowedRoles={["TRAINER"]}>
              <TrainerProjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trainer-projects/:id"
          element={
            <ProtectedRoute allowedRoles={["TRAINER"]}>
              <TrainerProjectDetails />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            TRAINER FEEDBACK
        ===================================================== */}

        <Route
          path="/trainer-feedback"
          element={
            <ProtectedRoute allowedRoles={["TRAINER"]}>
              <TrainerFeedback />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            ADMIN DASHBOARD
        ===================================================== */}

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/admin-profile"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminProfile />
    </ProtectedRoute>
  }
/>


        {/* =====================================================
            ADMIN USER MANAGEMENT
        ===================================================== */}

        <Route
          path="/user-management"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            ADMIN STUDENT MANAGEMENT
        ===================================================== */}

        <Route
          path="/student-management"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <StudentManagement />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            ADMIN TRAINER MANAGEMENT
        ===================================================== */}

        <Route
          path="/trainer-management"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <TrainerManagement />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            ADMIN PROGRAMS
        ===================================================== */}

        <Route
          path="/admin-programs"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminPrograms />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            ADMIN MODULES
        ===================================================== */}

        <Route
          path="/admin-modules"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminModules />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            ADMIN REPORTS
        ===================================================== */}

        <Route
          path="/admin-reports"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminReports />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            UNKNOWN ROUTE
        ===================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;