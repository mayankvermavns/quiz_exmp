import React from "react";
import "./QuizStart.css"; // 👈 Import external CSS file

const QuizStart = ({ onStart }) => {
  return (
    <div className="quizstart-container">
      <h1 className="quizstart-title">Welcome to the Quiz!</h1>
      <p className="quizstart-description">
        Test your knowledge by starting the quiz.
      </p>
      <button className="quizstart-button" onClick={onStart}>
        Start Quiz
      </button>
    </div>
  );
};

export default QuizStart;
