import { useState, useEffect } from 'react'
import { memeQuestions } from "./data/memeQuestions"

function App() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [answered, setAnswered] = useState(false);
  const question = memeQuestions[current];

  function handleAnswer(option) {
    if (answered) return;
    setAnswered(true);
    setSelected(option);
    if (option == question.answer) setScore((s) => s + 1);
    setTimeout(() => {
      if (current + 1 < memeQuestions.length) {
        setCurrent((c) => c + 1);
        setSelected(null);
        setTimeLeft(10);
        setAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 1200);
  }

  useEffect(() => {
    if (answered || showResult) return;
    if (timeLeft === 0) {
      handleAnswer(null);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, answered, showResult]);

  if (showResult) {
    const percentage = Math.round((score / memeQuestions.length) * 100);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white p-4">
        <div className="animate-[fadeIn_0.6s_ease-out] text-center">
          <p className="text-sm uppercase tracking-widest text-purple-300 mb-2">Quiz Complete</p>
          <h1 className="text-5xl font-extrabold mb-4">{percentage}%</h1>
          <p className="text-xl text-gray-200 mb-8">
            You scored <span className="font-bold text-green-400">{score}</span> out of{" "}
            <span className="font-bold">{memeQuestions.length}</span>
          </p>
          <button
            onClick={() => {
              setCurrent(0);
              setScore(0);
              setSelected(null);
              setShowResult(false);
              setTimeLeft(10);
              setAnswered(false);
            }}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold transition"
          >
            Play Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-black text-white p-4">
      <p className="text-xs uppercase tracking-widest text-purple-300 mb-1">
        Question {current + 1} of {memeQuestions.length}
      </p>
      <h2 className="text-2xl font-bold mb-4 text-center">{question.prompt}</h2>

      <img
        src={question.image}
        alt="guess the meme"
        className="rounded-2xl shadow-xl w-80 h-80 mb-6 object-cover mx-auto"
      />

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {question.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            disabled={answered}
            className={`p-3 rounded-xl font-semibold transition duration-300
              ${!answered
                ? "bg-white/10 hover:bg-white/20"
                : opt === question.answer
                  ? "bg-green-500 scale-105"
                  : opt === selected
                    ? "bg-red-500"
                    : "bg-white/10"}`}
          >
            {opt}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-gray-300">
        ⏱ Time left: <span className={timeLeft <= 3 ? "text-red-400 font-bold" : ""}>{timeLeft}s</span>
      </p>
    </div>
  )
}

export default App
