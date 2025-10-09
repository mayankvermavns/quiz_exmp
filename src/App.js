import React, { useState } from "react";
import QuizStart from "./Components/QuizStart";
import QuizApi from "./Components/QuizApi";

function App() {
  const [started, setStarted] = useState(false);

  const handleStart = () => setStarted(true);

  return (
    <div>
      {!started ? (
        <QuizStart onStart={handleStart} />
      ) : (
        <QuizApi />
      )}
    </div>
  );
}

export default App;
