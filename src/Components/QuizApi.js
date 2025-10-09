import { useState } from "react";
import axios from "axios";

function QuizApi() {
  const [subjects, setSubjects] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // Load subjects
  const loadSubjects = () => {
    const baseurl = "https://mayankvermavns.github.io/All-Json-File/Subject.json";
    axios
      .get(baseurl)
      .then((response) => setSubjects(response.data))
      .catch(() => console.log("Error loading subjects"));
  };

  // Load quizzes of selected subject
  const loadQuizzes = (subject) => {
    setSelectedSubject(subject.name);
    axios
      .get(subject.quizzes_url)
      .then((response) => setQuizzes(response.data))
      .catch(() => console.log("Error loading quizzes"));
  };

  // Load questions of selected quiz
  const loadQuestions = (quiz) => {
    setSelectedQuiz(quiz.title);
    axios
      .get(quiz.questions_url)
      .then((response) => {
        setQuestions(response.data.questions);
        setCurrentIndex(0);
        setAnswers({});
        setShowResult(false);
        setScore(0);
      })
      .catch(() => console.log("Error loading questions"));
  };

  // Submit quiz and calculate score
  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] && answers[i] === q.answer) correct++;
    });
    setScore(correct);
    setShowResult(true);
  };

  // Handle answer selection
  const handleAnswerChange = (value) => {
    setAnswers({ ...answers, [currentIndex]: value });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>📚 Mayank Super Quizzes</h1>

      {/* SUBJECTS */}
      {!selectedSubject && (
        <div>
          <button
            onClick={loadSubjects}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginBottom: "20px",
            }}
          >
            Load Subjects
          </button>

          {subjects.map((subject, i) => (
            <button
              key={i}
              onClick={() => loadQuizzes(subject)}
              style={{
                display: "block",
                margin: "10px auto",
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              {subject.name}
            </button>
          ))}
        </div>
      )}

      {/* QUIZZES */}
      {selectedSubject && quizzes.length > 0 && !selectedQuiz && (
        <div>
          <h2>Quizzes in {selectedSubject}</h2>
          {quizzes.map((quiz, i) => (
            <button
              key={i}
              onClick={() => loadQuestions(quiz)}
              style={{
                display: "block",
                margin: "10px auto",
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
                backgroundColor: "#17a2b8",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              {quiz.title}
            </button>
          ))}
        </div>
      )}

      {/* QUESTIONS ONE BY ONE */}
      {selectedQuiz && questions.length > 0 && !showResult && (
        <div
          style={{
            maxWidth: "600px",
            margin: "30px auto",
            textAlign: "left",
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2>🧮 {selectedQuiz}</h2>
          <h3>
            {currentIndex + 1}. {questions[currentIndex].text}
          </h3>

          <div style={{ marginTop: "15px" }}>
            <label>
              <input
                type="radio"
                name={`q${currentIndex}`}
                value="True"
                checked={answers[currentIndex] === "True"}
                onChange={(e) => handleAnswerChange(e.target.value)}
                style={{ marginRight: "8px" }}
              />
              True
            </label>
            <br />
            <label>
              <input
                type="radio"
                name={`q${currentIndex}`}
                value="False"
                checked={answers[currentIndex] === "False"}
                onChange={(e) => handleAnswerChange(e.target.value)}
                style={{ marginRight: "8px" }}
              />
              False
            </label>
          </div>

          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentIndex === 0}
              style={{
                padding: "8px 15px",
                marginRight: "10px",
                cursor: "pointer",
              }}
            >
              ⬅ Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() =>
                  setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))
                }
                style={{
                  padding: "8px 15px",
                  cursor: "pointer",
                }}
              >
                Next ➡
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                style={{
                  padding: "8px 15px",
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                ✅ Submit
              </button>
            )}
          </div>

          <p style={{ marginTop: "15px", fontStyle: "italic" }}>
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
      )}

      {/* RESULT SECTION */}
      {showResult && (
        <div style={{ marginTop: "40px" }}>
          <h2>🎉 Quiz Completed!</h2>
          <p>
            You got <b>{score}</b> out of <b>{questions.length}</b> correct.
          </p>
          <p>
            Score: {((score / questions.length) * 100).toFixed(2)}%
          </p>
          <button
            onClick={() => {
              setSelectedSubject(null);
              setSelectedQuiz(null);
              setQuestions([]);
              setShowResult(false);
            }}
            style={{
              padding: "10px 20px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            🔙 Back to Home
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizApi;
