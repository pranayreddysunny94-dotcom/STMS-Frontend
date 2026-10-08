import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "./TrainerStudents.css";

function TrainerStudents() {
  const { user } = useContext(AuthContext);

  const [students, setStudents] = useState([]);
  const [enrollmentRequests, setEnrollmentRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);

  const [error, setError] = useState("");
  const [requestError, setRequestError] = useState("");

  const [processingId, setProcessingId] = useState(null);

  // ------------------------------------------
  // LOAD STUDENTS
  // ------------------------------------------
  useEffect(() => {
    let isMounted = true;

    const loadStudents = async () => {
      try {
        const response = await api.get("/students");

        if (!isMounted) {
          return;
        }

        const studentList = response.data || [];

        const studentsWithDetails =
          await Promise.all(
            studentList.map(async (student) => {
              try {
                const attendanceResponse =
                  await api.get(
                    `/attendance/student/${student.id}`
                  );

                const records =
                  attendanceResponse.data || [];

                const total = records.length;

                const present = records.filter(
                  (item) =>
                    item.status?.toUpperCase() ===
                    "PRESENT"
                ).length;

                const attendance =
                  total > 0
                    ? Math.round(
                        (present / total) * 100
                      )
                    : 0;

                const program =
                  records.length > 0 &&
                  records[0].trainingProgram
                    ? records[0].trainingProgram.title
                    : "Not Assigned";

                return {
                  ...student,
                  program,
                  attendance: `${attendance}%`,
                };
              } catch (attendanceError) {
                console.error(
                  "Attendance API Error:",
                  attendanceError
                );

                return {
                  ...student,
                  program: "Not Assigned",
                  attendance: "0%",
                };
              }
            })
          );

        if (isMounted) {
          setStudents(studentsWithDetails);
          setError("");
        }
      } catch (err) {
        console.error(
          "Students API Error:",
          err
        );

        if (isMounted) {
          if (err.response) {
            const responseData =
              err.response.data;

            setError(
              typeof responseData === "string"
                ? responseData
                : responseData?.message ||
                    "Unable to load students."
            );
          } else {
            setError(
              "Unable to connect to backend."
            );
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStudents();

    return () => {
      isMounted = false;
    };
  }, []);

  // ------------------------------------------
  // LOAD PENDING ENROLLMENT REQUESTS
  // ------------------------------------------
  useEffect(() => {
    let isMounted = true;

    const loadEnrollmentRequests = async () => {
      try {
        setRequestsLoading(true);

        if (!user) {
          setEnrollmentRequests([]);
          return;
        }

        // Training programs store trainer username
        // Example: sumith
        const trainerName =
          user.name ||
          user.username ||
          user.email?.split("@")[0];

        if (!trainerName) {
          setEnrollmentRequests([]);
          return;
        }

        const response = await api.get(
          `/enrollments/trainer/${encodeURIComponent(
            trainerName
          )}/pending`
        );

        if (isMounted) {
          setEnrollmentRequests(
            response.data || []
          );
          setRequestError("");
        }
      } catch (err) {
        console.error(
          "Enrollment Requests API Error:",
          err
        );

        if (isMounted) {
          setEnrollmentRequests([]);

          if (err.response) {
            const responseData =
              err.response.data;

            setRequestError(
              typeof responseData === "string"
                ? responseData
                : responseData?.message ||
                    "Unable to load enrollment requests."
            );
          } else {
            setRequestError(
              "Unable to connect to backend."
            );
          }
        }
      } finally {
        if (isMounted) {
          setRequestsLoading(false);
        }
      }
    };

    loadEnrollmentRequests();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // ------------------------------------------
  // APPROVE / REJECT ENROLLMENT
  // ------------------------------------------
  const handleEnrollmentStatus = async (
    enrollmentId,
    status
  ) => {
    try {
      setProcessingId(enrollmentId);

      await api.put(
        `/enrollments/${enrollmentId}`,
        {
          status: status,
        }
      );

      // Remove the request from pending list
      setEnrollmentRequests((previous) =>
        previous.filter(
          (request) =>
            request.id !== enrollmentId
        )
      );
    } catch (err) {
      console.error(
        "Enrollment Status Update Error:",
        err
      );

      alert(
        `Unable to ${status.toLowerCase()} enrollment request.`
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="trainer-students-page">

      <header className="trainer-students-header">
        <div>
          <h1>Students</h1>

          <p>
            View students assigned to your training
            programs.
          </p>
        </div>

        <Link to="/trainer-dashboard">
          ← Dashboard
        </Link>
      </header>

      {/* ==========================================
          ENROLLMENT REQUESTS
          ========================================== */}

      <section className="trainer-students-card">

        <div className="trainer-students-top">
          <h2>Enrollment Requests</h2>

          <span>
            {enrollmentRequests.length} Pending
          </span>
        </div>

        {requestsLoading && (
          <p>
            Loading enrollment requests...
          </p>
        )}

        {!requestsLoading && requestError && (
          <p>
            {requestError}
          </p>
        )}

        {!requestsLoading &&
          !requestError &&
          enrollmentRequests.length === 0 && (
            <p>
              No pending enrollment requests.
            </p>
          )}

        {!requestsLoading &&
          !requestError &&
          enrollmentRequests.length > 0 && (

            <div className="trainer-table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Program</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {enrollmentRequests.map(
                    (request) => (

                      <tr key={request.id}>

                        <td className="trainer-student-name">
                          {request.student?.user?.name ||
                            "Student"}
                        </td>

                        <td>
                          {request.student?.user?.email ||
                            "Not available"}
                        </td>

                        <td>
                          {request.trainingProgram?.title ||
                            "Training Program"}
                        </td>

                        <td>
                          <span className="attendance-badge">
                            {request.status}
                          </span>
                        </td>

                        <td>

                          <button
                            type="button"
                            disabled={
                              processingId ===
                              request.id
                            }
                            onClick={() =>
                              handleEnrollmentStatus(
                                request.id,
                                "APPROVED"
                              )
                            }
                          >
                            {processingId ===
                            request.id
                              ? "Processing..."
                              : "Approve"}
                          </button>

                          <button
                            type="button"
                            disabled={
                              processingId ===
                              request.id
                            }
                            onClick={() =>
                              handleEnrollmentStatus(
                                request.id,
                                "REJECTED"
                              )
                            }
                            style={{
                              marginLeft: "8px",
                            }}
                          >
                            Reject
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

      </section>

      {/* ==========================================
          EXISTING STUDENT LIST
          ========================================== */}

      {loading && (
        <section className="trainer-students-card">

          <div className="trainer-students-top">
            <h2>Student List</h2>
          </div>

          <p>Loading students...</p>

        </section>
      )}

      {!loading && error && (
        <section className="trainer-students-card">

          <div className="trainer-students-top">
            <h2>Student List</h2>
          </div>

          <p>{error}</p>

        </section>
      )}

      {!loading &&
        !error &&
        students.length === 0 && (
          <section className="trainer-students-card">

            <div className="trainer-students-top">
              <h2>Student List</h2>

              <span>0 Students</span>
            </div>

            <p>
              No students are available.
            </p>

          </section>
        )}

      {!loading &&
        !error &&
        students.length > 0 && (
          <section className="trainer-students-card">

            <div className="trainer-students-top">

              <h2>Student List</h2>

              <span>
                {students.length} Students
              </span>

            </div>

            <div className="trainer-table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Program</th>
                    <th>Attendance</th>
                  </tr>
                </thead>

                <tbody>

                  {students.map((student) => (
                    <tr key={student.id}>

                      <td>
                        {student.id}
                      </td>

                      <td className="trainer-student-name">
                        {student.user?.name ||
                          "Student"}
                      </td>

                      <td>
                        {student.user?.email ||
                          "Not available"}
                      </td>

                      <td>
                        {student.program}
                      </td>

                      <td>
                        <span className="attendance-badge">
                          {student.attendance}
                        </span>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </section>
        )}

    </div>
  );
}

export default TrainerStudents;