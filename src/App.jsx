import { useState, useEffect } from 'react'
import { memeQuestions } from "./data/memeQuestions"

function getRank(percentage) {
  if (percentage >= 90) return { label: "MEME LORD", glow: "#39FF88" };
  if (percentage >= 70) return { label: "DANK ENOUGH", glow: "#FFD23F" };
  if (percentage >= 40) return { label: "NORMIE", glow: "#FF2E9A" };
  return { label: "TOUCH GRASS", glow: "#888888" };
}

function App() {
  const [gameStarted, setGameStarted] = useState(false);
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
    if (!gameStarted || answered || showResult) return;
    if (timeLeft === 0) {
      handleAnswer(null);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, answered, showResult, gameStarted]);

  function resetGame() {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setTimeLeft(10);
    setAnswered(false);
    setGameStarted(false);
  }

  const timerPct = (timeLeft / 10) * 100;
  const timerColor = timeLeft <= 3 ? "#FF2E9A" : timeLeft <= 6 ? "#FFD23F" : "#39FF88";

  return (
    <div className="min-h-screen bg-[#050506] flex items-center justify-center p-4 sm:p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bungee&family=Space+Grotesk:wght@400;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
        .font-display { font-family: 'Bungee', cursive; }
        .font-body { font-family: 'Space Grotesk', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        .crt-frame {
          background: linear-gradient(155deg, #1c1c1e, #0a0a0b 60%);
          border-radius: 28px;
          padding: 18px;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 30px 60px -20px rgba(0,0,0,0.8),
            0 0 80px -30px rgba(57,255,136,0.15);
        }
        .crt-screen {
          position: relative;
          background: radial-gradient(ellipse at 50% 0%, #0d1410 0%, #050505 75%);
          border-radius: 16px;
          overflow: hidden;
        }
        .crt-screen::before {
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,0.035) 0px,
            rgba(255,255,255,0.035) 1px,
            transparent 1px,
            transparent 3px
          );
          pointer-events: none;
          z-index: 20;
        }
        .crt-screen::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5) 100%);
          pointer-events: none;
          z-index: 21;
        }
        @keyframes flicker {
          0%, 96%, 100% { opacity: 1; }
          97% { opacity: 0.94; }
          98% { opacity: 1; }
        }
        .crt-flicker { animation: flicker 6s infinite; }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.15; }
        }
        .blink { animation: blink 1.1s step-start infinite; }

        @keyframes stampIn {
          0% { transform: scale(2.4) rotate(-10deg); opacity: 0; filter: blur(6px); }
          60% { transform: scale(0.95) rotate(2deg); opacity: 1; filter: blur(0); }
          100% { transform: scale(1) rotate(-3deg); opacity: 1; }
        }
        .animate-stamp { animation: stampIn 0.55s cubic-bezier(.2,.8,.3,1.2) forwards; }

        @keyframes popIn {
          0% { transform: translateY(6px) scale(0.97); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-popin { animation: popIn 0.35s ease-out forwards; }

        .arcade-btn {
          border-bottom: 4px solid rgba(0,0,0,0.4);
          transition: all 0.12s ease;
        }
        .arcade-btn:active:not(:disabled) {
          transform: translateY(3px);
          border-bottom-width: 1px;
        }

        .glow-text { text-shadow: 0 0 12px currentColor, 0 0 32px currentColor; }
      `}</style>

      <div className="crt-frame w-full max-w-md">
        <div className="crt-screen crt-flicker px-6 py-10 min-h-[560px] flex items-center justify-center text-white">

          {/* HOME SCREEN */}
          {!gameStarted && !showResult && (
            <div className="relative z-10 text-center animate-popin">
              <p className="font-mono text-[10px] tracking-[0.4em] text-[#39FF88] mb-6">
                ARCADE MODE — {memeQuestions.length} ROUNDS
              </p>
              <h1 className="font-display text-4xl sm:text-5xl leading-tight mb-4 text-[#FFD23F] glow-text">
                GUESS THE<br />MEME
              </h1>
              <p className="font-body text-gray-500 text-sm mb-12">
                10 seconds a round. No pressure. (There's pressure.)
              </p>
              <button
                onClick={() => setGameStarted(true)}
                className="font-mono blink text-[#FF2E9A] text-sm tracking-[0.3em] glow-text"
              >
                ▸ INSERT COIN TO START ◂
              </button>
            </div>
          )}

          {/* RESULT SCREEN */}
          {showResult && (() => {
            const percentage = Math.round((score / memeQuestions.length) * 100);
            const rank = getRank(percentage);
            return (
              <div className="relative z-10 text-center">
                <p className="font-mono text-[10px] tracking-[0.4em] text-gray-500 mb-8">GAME OVER</p>
                <h2
                  className="font-display text-3xl sm:text-4xl mb-6 animate-stamp inline-block glow-text"
                  style={{ color: rank.glow }}
                >
                  {rank.label}
                </h2>
                <p className="font-mono text-5xl font-bold mb-2">{percentage}<span className="text-2xl">%</span></p>
                <p className="font-body text-gray-500 text-sm mb-10">
                  {score} / {memeQuestions.length} correct
                </p>
                <button
                  onClick={resetGame}
                  className="arcade-btn font-display text-xs px-6 py-3 bg-white/10 hover:bg-white/15 rounded-lg tracking-wider"
                >
                  PLAY AGAIN
                </button>
              </div>
            );
          })()}

          {/* GAME SCREEN */}
          {gameStarted && !showResult && (
            <div className="relative z-10 flex flex-col items-center w-full animate-popin">
              <div className="flex items-center justify-between w-full mb-3 font-mono text-[10px] tracking-widest text-gray-500">
                <span>ROUND {String(current + 1).padStart(2, '0')}/{String(memeQuestions.length).padStart(2, '0')}</span>
                <span>SCORE {String(score).padStart(2, '0')}</span>
              </div>

              {/* timer bar */}
              <div className="w-full h-2 bg-white/5 rounded-full mb-6 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${timerPct}%`, backgroundColor: timerColor, boxShadow: `0 0 10px ${timerColor}` }}
                />
              </div>

              <h2 className="font-body font-bold text-lg text-center mb-5 text-gray-100">{question.prompt}</h2>

              <div className="w-56 h-56 bg-black/50 border border-white/10 rounded-xl flex items-center justify-center overflow-hidden mb-6">
                <img
                  src={question.image}
                  alt="guess the meme"
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 w-full">
                {question.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    disabled={answered}
                    className={`arcade-btn font-body p-3 rounded-lg font-semibold text-xs sm:text-sm
                      ${!answered
                        ? "bg-white/10 hover:bg-white/20 text-gray-200"
                        : opt === question.answer
                          ? "bg-[#39FF88] text-black border-b-[#1a7a44]"
                          : opt === selected
                            ? "bg-[#FF2E9A] text-black border-b-[#8a1857]"
                            : "bg-white/5 text-gray-600"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default App