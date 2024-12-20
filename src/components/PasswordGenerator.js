import React, { useState, useEffect } from "react";
import "../styles/App.css";

const PasswordGenerator = () => {
  const [length, setLength] = useState(12);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  });
  const [additionalSymbols, setAdditionalSymbols] = useState(""); // User-supplied symbols
  const [allowRepeats, setAllowRepeats] = useState(true); // Toggle for allowing repeats
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(""); // Password strength

  // Auto-generate a password when the component loads
  useEffect(() => {
    handleGenerate();
  }, []);

  const handleGenerate = () => {
    const charset = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+[]{}|;:',.<>?/`~",
    };

    // Build the character pool based on selected options
    let charPool = "";
    Object.keys(options).forEach((key) => {
      if (options[key]) {
        charPool += charset[key];
      }
    });

    if (additionalSymbols) {
      charPool += additionalSymbols;
    }

    if (!charPool) {
      setPassword("Select at least one option");
      setStrength("None");
      return;
    }

    // Generate password
    let newPassword = "";
    const uniqueChars = new Set();

    while (newPassword.length < length) {
      const randomChar = charPool.charAt(Math.floor(Math.random() * charPool.length));
      if (allowRepeats || !uniqueChars.has(randomChar)) {
        newPassword += randomChar;
        uniqueChars.add(randomChar);
      }
      if (!allowRepeats && uniqueChars.size >= charPool.length) break; // Avoid infinite loop
    }

    setPassword(newPassword);
    calculateStrength(newPassword);
  };

  const toggleOption = (key) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const calculateStrength = (password) => {
    let score = 0;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setStrength(score <= 2 ? "Weak" : score === 3 ? "Moderate" : "Strong");
  };

  return (
    <div className="password-generator">
      <h1>Password Generator</h1>
      <div className="settings">
        <label>
          Length:
          <input
            type="number"
            min="4"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
          />
        </label>
        <div className="checkboxes">
          {Object.keys(options).map((key) => (
            <label key={key}>
              <input
                type="checkbox"
                checked={options[key]}
                onChange={() => toggleOption(key)}
              />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
          ))}
        </div>
        <label>
          Additional Symbols:
          <input
            type="text"
            placeholder="E.g., @#$"
            value={additionalSymbols}
            onChange={(e) => setAdditionalSymbols(e.target.value)}
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={allowRepeats}
            onChange={() => setAllowRepeats(!allowRepeats)}
          />
          Allow repeated characters
        </label>
      </div>
      <button onClick={handleGenerate}>Generate Password</button>
      {password && (
        <div className="password-display">
          <input type="text" value={password} readOnly />
          <button onClick={() => navigator.clipboard.writeText(password)}>
            Copy
          </button>
        </div>
      )}
      {password && <p>Password Strength: {strength}</p>}
    </div>
  );
};

export default PasswordGenerator;