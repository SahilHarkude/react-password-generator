import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [length, setLength] = useState(12);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);

  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");

  const [history, setHistory] = useState([]);

  const [darkMode, setDarkMode] = useState(true);

  /* Load saved data */
  useEffect(() => {
    const savedHistory = JSON.parse(
      localStorage.getItem("passwordHistory")
    );
    const savedTheme = localStorage.getItem("theme");

    if (savedHistory) setHistory(savedHistory);
    if (savedTheme) setDarkMode(savedTheme === "dark");
  }, []);

  /* Save data */
  useEffect(() => {
    localStorage.setItem(
      "passwordHistory",
      JSON.stringify(history)
    );
    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [history, darkMode]);

  /* Generate password */
  const generatePassword = (save = false) => {
    let chars = "";
    let result = "";

    if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+{}[]<>?";

    if (!chars) return;

    for (let i = 0; i < length; i++) {
      const rand = Math.floor(Math.random() * chars.length);
      result += chars[rand];
    }

    setPassword(result);

    /* Save only on button click */
    if (save) {
      setHistory((prev) => {
        const newHistory = [result, ...prev];
        return newHistory.slice(0, 5);
      });
    }
  };

  /* Clear History */
const clearHistory = () => {
  setHistory([]);
  localStorage.removeItem("passwordHistory");
};


  /* Strength check */
  const checkStrength = () => {
    let score = 0;

    if (length >= 12) score++;
    if (uppercase) score++;
    if (lowercase) score++;
    if (numbers) score++;
    if (symbols) score++;

    if (score <= 2) setStrength("Weak");
    else if (score <= 4) setStrength("Medium");
    else setStrength("Strong");
  };

  /* Auto preview */
  useEffect(() => {
    generatePassword(false);
    checkStrength();
  }, [length, uppercase, lowercase, numbers, symbols]);

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <div className="container">

        {/* Header */}
        <div className="top-bar">
          <h1>Password Generator</h1>

          <button
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "🌙" : "☀️"}
          </button>
        </div>

        {/* Output */}
        <div className="output">
          <input type="text" value={password} readOnly />

          <button
            onClick={() =>
              navigator.clipboard.writeText(password)
            }
          >
            Copy
          </button>
        </div>

        {/* Strength */}
        <p className={`strength ${strength.toLowerCase()}`}>
          Strength: {strength}
        </p>

        {/* Settings */}
        <div className="settings">

          <label>
            Length: {length}
            <input
              type="range"
              min="4"
              max="30"
              value={length}
              onChange={(e) =>
                setLength(Number(e.target.value))
              }
            />
          </label>

          <label>
            <input
              type="checkbox"
              checked={uppercase}
              onChange={() =>
                setUppercase(!uppercase)
              }
            />
            Uppercase
          </label>

          <label>
            <input
              type="checkbox"
              checked={lowercase}
              onChange={() =>
                setLowercase(!lowercase)
              }
            />
            Lowercase
          </label>

          <label>
            <input
              type="checkbox"
              checked={numbers}
              onChange={() =>
                setNumbers(!numbers)
              }
            />
            Numbers
          </label>

          <label>
            <input
              type="checkbox"
              checked={symbols}
              onChange={() =>
                setSymbols(!symbols)
              }
            />
            Symbols
          </label>

        </div>

        {/* Generate Button */}
        <button
          className="generate-btn"
          onClick={() => generatePassword(true)}
        >
          Generate
        </button>

        {/* History */}
{history.length > 0 && (
  <div className="history">
    <div className="history-header">
      <h3>Recent Passwords</h3>

      <button
        className="clear-btn"
        onClick={clearHistory}
      >
        Clear
      </button>
    </div>

    <ul>
      {history.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
)}


      </div>
    </div>
  );
}

export default App;
