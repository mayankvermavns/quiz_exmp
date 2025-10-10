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

  // Load quizzes
  const loadQuizzes = (subject) => {
    setSelectedSubject(subject.name);
    axios
      .get(subject.quizzes_url)
      .then((response) => setQuizzes(response.data))
      .catch(() => console.log("Error loading quizzes"));
  };

  // Load questions
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

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] && answers[i] === q.answer) correct++;
    });
    setScore(correct);
    setShowResult(true);
  };

  const handleAnswerChange = (value) => {
    setAnswers({ ...answers, [currentIndex]: value });
  };

  const handleNext = () => {
    if (!answers[currentIndex]) {
      alert("⚠️ Please select an answer before moving to the next question!");
      return;
    }
    setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  // 🔥 STYLING OBJECTS
  const styles = {
    body: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      color: "#fff",
      textAlign: "center",
      padding: "40px 10px",
      fontFamily: "'Poppins', sans-serif",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "700",
      marginBottom: "20px",
      textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
    },
    card: {
      background: "rgba(255,255,255,0.15)",
      backdropFilter: "blur(10px)",
      borderRadius: "20px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
      padding: "25px",
      maxWidth: "650px",
      margin: "20px auto",
      color: "#fff",
    },
    button: {
      background: "linear-gradient(90deg, #ff9966, #ff5e62)",
      color: "white",
      border: "none",
      borderRadius: "10px",
      padding: "10px 20px",
      fontSize: "16px",
      margin: "10px",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    question: {
      fontSize: "18px",
      fontWeight: "500",
      marginBottom: "10px",
    },
    label: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      margin: "10px 0",
      fontSize: "18px",
      cursor: "pointer",
      background: "rgba(255,255,255,0.1)",
      padding: "8px 12px",
      borderRadius: "10px",
      transition: "background 0.3s",
    },
    radio: {
      width: "22px",
      height: "22px",
      accentColor: "#00ffcc",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.body}>
      <h1 style={styles.title}>🎯 Mayank Super Quiz App</h1>

      {/* SUBJECTS */}
      {!selectedSubject && (
        <div style={styles.card}>
          <button onClick={loadSubjects} style={styles.button}>
            🚀 Load Subjects
          </button>

          {subjects.map((subject, i) => (
            <button
              key={i}
              onClick={() => loadQuizzes(subject)}
              style={styles.button}
            >
              {subject.name}
            </button>
          ))}
        </div>
      )}

      {/* QUIZZES */}
      {selectedSubject && quizzes.length > 0 && !selectedQuiz && (
        <div style={styles.card}>
          <h2>📘 Quizzes in {selectedSubject}</h2>
          {quizzes.map((quiz, i) => (
            <button
              key={i}
              onClick={() => loadQuestions(quiz)}
              style={styles.button}
            >
              {quiz.title}
            </button>
          ))}
        </div>
      )}

      {/* QUESTIONS */}
      {selectedQuiz && questions.length > 0 && !showResult && (
        <div style={styles.card}>
          <h2>🧮 {selectedQuiz}</h2>
          <p style={styles.question}>
            {currentIndex + 1}. {questions[currentIndex].text}
          </p>

          <div>
            <label style={styles.label}>
              <input
                type="radio"
                name={`q${currentIndex}`}
                value="True"
                checked={answers[currentIndex] === "True"}
                onChange={(e) => handleAnswerChange(e.target.value)}
                style={styles.radio}
              />
              ✅ True
            </label>
            <label style={styles.label}>
              <input
                type="radio"
                name={`q${currentIndex}`}
                value="False"
                checked={answers[currentIndex] === "False"}
                onChange={(e) => handleAnswerChange(e.target.value)}
                style={styles.radio}
              />
              ❌ False
            </label>
          </div>

          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentIndex === 0}
              style={{
                ...styles.button,
                opacity: currentIndex === 0 ? 0.5 : 1,
              }}
            >
              ⬅ Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button onClick={handleNext} style={styles.button}>
                Next ➡
              </button>
            ) : (
              <button onClick={handleSubmit} style={styles.button}>
                ✅ Submit
              </button>
            )}
          </div>

          <p style={{ marginTop: "15px", fontStyle: "italic" }}>
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
      )}

      {/* RESULT */}
      {showResult && (
        <div style={styles.card}>
          <h2>🎉 Quiz Completed!</h2>
          <p>
            You got <b>{score}</b> out of <b>{questions.length}</b> correct.
          </p>
          <p>
            🏆 Score:{" "}
            <b style={{ color: "#00ffcc" }}>
              {((score / questions.length) * 100).toFixed(2)}%
            </b>
          </p>

          {/* Detailed Review Section */}
          <div style={{ textAlign: "left", marginTop: "25px" }}>
            <h3>📋 Detailed Review:</h3>
            {questions.map((q, i) => {
              const isCorrect = answers[i] === q.answer;
              return (
                <div
                  key={i}
                  style={{
                    background: isCorrect
                      ? "rgba(0,255,0,0.2)"
                      : "rgba(255,0,0,0.2)",
                    borderLeft: isCorrect
                      ? "5px solid #00ff00"
                      : "5px solid #ff4d4d",
                    borderRadius: "10px",
                    padding: "10px",
                    marginTop: "10px",
                  }}
                >
                  <p>
                    <b>Q{i + 1}:</b> {q.text}
                  </p>
                  <p>
                    🟩 <b>Correct Answer:</b> {q.answer}
                  </p>
                  <p>
                    🟥 <b>Your Answer:</b>{" "}
                    {answers[i] ? answers[i] : "Not answered"}
                  </p>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              setSelectedSubject(null);
              setSelectedQuiz(null);
              setQuestions([]);
              setShowResult(false);
            }}
            style={styles.button}
          >
            🔙 Back to Home
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizApi;
