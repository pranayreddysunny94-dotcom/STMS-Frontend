import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./StudentManagement.css";

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD STUDENTS FROM BACKEND
  // ==========================================

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/students");

        console.log("Students from backend:", response.data);

        const studentData = response.data || [];

        // Sort by roll number in ascending order
        const sortedStudents = [...studentData].sort((a, b) => {
          return String(a.rollNumber || "").localeCompare(
            String(b.rollNumber || ""),
            undefined,
            {
              numeric: true,
              sensitivity: "base",
            }
          );
        });

        setStudents(sortedStudents);

      } catch (err) {
        console.error("Student API Error:", err);

        setError(
          err.response?.data?.message ||
          "Unable to load students."
        );
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);


  // ==========================================
  // DELETE STUDENT
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/students/${id}`);

      setStudents((previous) =>
        previous.filter((student) => student.id !== id)
      );

    } catch (err) {
      console.error("Delete Student Error:", err);

      alert(
        err.response?.data?.message ||
        "Unable to delete student."
      );
    }
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="student-management-page">

        <header className="student-management-header">

          <div>
            <h1>Student Management</h1>

            <p>
              Manage registered students and their training details.
            </p>
          </div>

          <Link to="/admin-dashboard">
            ← Dashboard
          </Link>

        </header>

        <section className="student-management-card">

          <h2>
            Loading Students...
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
      <div className="student-management-page">

        <header className="student-management-header">

          <div>
            <h1>Student Management</h1>

            <p>
              Manage registered students and their training details.
            </p>
          </div>

          <Link to="/admin-dashboard">
            ← Dashboard
          </Link>

        </header>

        <section className="student-management-card">

          <h2>
            Unable to Load Students
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
    <div className="student-management-page">

      {/* ======================================
          HEADER
      ======================================= */}

      <header className="student-management-header">

        <div>

          <h1>
            Student Management
          </h1>

          <p>
            Manage registered students and their training details.
          </p>

        </div>

        <Link to="/admin-dashboard">
          ← Dashboard
        </Link>

      </header>


      {/* ======================================
          MAIN CARD
      ======================================= */}

      <section className="student-management-card">

        <div className="student-management-top">

          <h2>
            Students
          </h2>

          <span>
            Total Students: {students.length}
          </span>

        </div>


        {/* ====================================
            TABLE
        ===================================== */}

        <div className="student-table-wrapper">

          <table>

            <thead>

              <tr>

                <th>ID</th>

                <th>Student</th>

                <th>Email</th>

                <th>Roll Number</th>

                <th>Department</th>

                <th>Academic Year</th>

                <th>Phone</th>

                <th>Action</th>

              </tr>

            </thead>


            <tbody>

              {students.map((student, index) => (

                <tr key={student.id}>

                  {/* DISPLAY ID */}

                  <td>
                    {index + 1}
                  </td>


                  {/* STUDENT NAME */}

                  <td className="student-name">
                    {student.user?.name || "Not Available"}
                  </td>


                  {/* EMAIL */}

                  <td>
                    {student.user?.email || "Not Available"}
                  </td>


                  {/* ROLL NUMBER */}

                  <td>
                    {student.rollNumber || "Not Available"}
                  </td>


                  {/* DEPARTMENT */}

                  <td>
                    {student.department || "Not Assigned"}
                  </td>


                  {/* ACADEMIC YEAR */}

                  <td>
                    {student.year || "Not Available"}
                  </td>


                  {/* PHONE */}

                  <td>
                    {student.phone || "Not Available"}
                  </td>


                  {/* ACTION */}

                  <td>

                    <button
                      className="student-delete"
                      onClick={() =>
                        handleDelete(student.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>


          {/* ==================================
              NO STUDENTS
          =================================== */}

          {students.length === 0 && (

            <div
              style={{
                padding: "30px",
                textAlign: "center"
              }}
            >

              <h3>
                No students found
              </h3>

              <p>
                There are currently no students in the database.
              </p>

            </div>

          )}

        </div>

      </section>

    </div>
  );
}

export default StudentManagement;