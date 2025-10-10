import { useState } from "react";
import axios from "axios";
import "./QuizApi.css"; // ✅ External CSS file import

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

  return (
    <div className="quiz-body">
      <h1 className="quiz-title">🎯 Mayank Super Quiz App</h1>

      {/* SUBJECTS */}
      {!selectedSubject && (
        <div className="quiz-card">
          <button onClick={loadSubjects} className="quiz-button">
            🚀 Load Subjects
          </button>

          {subjects.map((subject, i) => (
            <button
              key={i}
              onClick={() => loadQuizzes(subject)}
              className="quiz-button"
            >
              {subject.name}
            </button>
          ))}
        </div>
      )}

      {/* QUIZZES */}
      {selectedSubject && quizzes.length > 0 && !selectedQuiz && (
        <div className="quiz-card">
          <h2>📘 Quizzes in {selectedSubject}</h2>
          {quizzes.map((quiz, i) => (
            <button
              key={i}
              onClick={() => loadQuestions(quiz)}
              className="quiz-button"
            >
              {quiz.title}
            </button>
          ))}
        </div>
      )}

      {/* QUESTIONS */}
      {selectedQuiz && questions.length > 0 && !showResult && (
        <div className="quiz-card">
          <h2>🧮 {selectedQuiz}</h2>
          <p className="question-text">
            {currentIndex + 1}. {questions[currentIndex].text}
          </p>

          <div>
            <label className="option-label">
              <input
                type="radio"
                name={`q${currentIndex}`}
                value="True"
                checked={answers[currentIndex] === "True"}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="radio-btn"
              />
              ✅ True
            </label>
            <label className="option-label">
              <input
                type="radio"
                name={`q${currentIndex}`}
                value="False"
                checked={answers[currentIndex] === "False"}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="radio-btn"
              />
              ❌ False
            </label>
          </div>

          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentIndex === 0}
              className={`quiz-button ${currentIndex === 0 ? "disabled" : ""}`}
            >
              ⬅ Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button onClick={handleNext} className="quiz-button">
                Next ➡
              </button>
            ) : (
              <button onClick={handleSubmit} className="quiz-button">
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
        <div className="quiz-card">
          <h2>🎉 Quiz Completed!</h2>
          <p>
            You got <b>{score}</b> out of <b>{questions.length}</b> correct.
          </p>
          <p>
            🏆 Score:{" "}
            <b className="highlight">
              {((score / questions.length) * 100).toFixed(2)}%
            </b>
          </p>

          <div className="result-section">
            <h3>📋 Detailed Review:</h3>
            {questions.map((q, i) => {
              const isCorrect = answers[i] === q.answer;
              return (
                <div
                  key={i}
                  className={`result-item ${isCorrect ? "correct" : "wrong"}`}
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
            className="quiz-button"
          >
            🔙 Back to Home
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizApi;
