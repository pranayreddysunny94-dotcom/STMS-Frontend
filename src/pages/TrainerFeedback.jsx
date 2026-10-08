import { Link } from "react-router-dom";
import "./TrainerFeedback.css";

function TrainerFeedback() {
  const feedback = [
    {
      id: 1,
      student: "Pranay Reddy",
      program: "Full Stack Java",
      rating: 5,
      comment: "The training sessions were clear and easy to understand.",
    },
    {
      id: 2,
      student: "Kiran Kumar",
      program: "Full Stack Java",
      rating: 4,
      comment: "Good practical examples and useful assignments.",
    },
    {
      id: 3,
      student: "Tarun Kumar",
      program: "React Development",
      rating: 5,
      comment: "The React sessions were very helpful.",
    },
  ];

  return (
    <div className="trainer-feedback-page">
      <header className="trainer-feedback-header">
        <div>
          <h1>Student Feedback</h1>
          <p>View feedback submitted by students.</p>
        </div>

        <Link to="/trainer-dashboard">← Dashboard</Link>
      </header>

      <section className="trainer-feedback-grid">
        {feedback.map((item) => (
          <div className="trainer-feedback-card" key={item.id}>
            <div className="feedback-top">
              <div className="feedback-avatar">
                {item.student.charAt(0)}
              </div>

              <div>
                <h2>{item.student}</h2>
                <p>{item.program}</p>
              </div>
            </div>

            <div className="feedback-rating">
              {"★".repeat(item.rating)}
              {"☆".repeat(5 - item.rating)}
            </div>

            <p className="feedback-comment">
              "{item.comment}"
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default TrainerFeedback;