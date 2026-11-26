import { useState, useEffect } from "react";
import "./App.css";

const answer = "GRAPE";

function App() {
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [result, setResult] = useState("");

  const checkAnswer = (word) => {
    if (word === answer) {
      setResult("won");
    } else if (guesses.length === 5) {
      setResult("lost");
    }
  };

  const submitGuess = () => {
    if (guess.length !== 5 || result !== "") return;

    const updatedGuesses = [...guesses, guess];
    setGuesses(updatedGuesses);
    setGuess("");

    if (guess === answer) {
      setResult("won");
    } else if (updatedGuesses.length === 6) {
      setResult("lost");
    }
  };

  const handleInput = (key) => {
    if (result !== "") return;

    if (key === "ENTER") {
      submitGuess();
    } else if (key === "BACKSPACE") {
      setGuess((previous) => previous.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && guess.length < 5) {
      setGuess((previous) => previous + key);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toUpperCase();

      if (key === "ENTER") {
        handleInput("ENTER");
      } else if (key === "BACKSPACE") {
        handleInput("BACKSPACE");
      } else if (/^[A-Z]$/.test(key)) {
        handleInput(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [guess, guesses, result]);

  const getColor = (letter, index, word) => {
    if (answer[index] === letter) return "correct";
    if (answer.includes(letter)) return "present";
    return "absent";
  };

  const restartGame = () => {
    setGuess("");
    setGuesses([]);
    setResult("");
  };

  const keyboard = [
    "QWERTYUIOP".split(""),
    "ASDFGHJKL".split(""),
    ["ENTER", ..."ZXCVBNM".split(""), "BACKSPACE"],
  ];

  return (
    <div className="game-container">
      <h1>WORD CHALLENGE</h1>
      <p className="subtitle">Guess the hidden five-letter word!</p>

      <div className="board">
        {Array.from({ length: 6 }, (_, row) => {
          const word = guesses[row] || (row === guesses.length ? guess : "");

          return (
            <div className="board-row" key={row}>
              {Array.from({ length: 5 }, (_, col) => {
                const letter = word[col] || "";
                const submitted = row < guesses.length;

                return (
                  <div
                    className={`tile ${
                      submitted ? getColor(letter, col, word) : ""
                    }`}
                    key={col}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="keyboard">
        {keyboard.map((row, index) => (
          <div className="key-row" key={index}>
            {row.map((key) => (
              <button
                className="key"
                key={key}
                onClick={() => handleInput(key)}
              >
                {key === "BACKSPACE" ? "⌫" : key}
              </button>
            ))}
          </div>
        ))}
      </div>

      {result && (
        <div className="result">
          <h2>{result === "won" ? "You Won!" : "Game Over!"}</h2>
          <p>The correct word was {answer}.</p>
          <button className="restart" onClick={restartGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

export default App;