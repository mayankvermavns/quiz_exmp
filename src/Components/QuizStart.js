import React from "react";

const QuizStart = ({ onStart }) => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to the Quiz!</h1>
      <p style={styles.description}>
        Test your knowledge by starting the quiz.
      </p>
      <button style={styles.button} onClick={onStart}>
        Start Quiz
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #4facfe, #00f2fe)",
    color: "white",
    textAlign: "center",
  },
  title: { fontSize: "36px", marginBottom: "10px" },
  description: { fontSize: "18px", marginBottom: "30px" },
  button: {
    padding: "10px 20px",
    fontSize: "18px",
    cursor: "pointer",
    backgroundColor: "#ffb700",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
};

export default QuizStart;
