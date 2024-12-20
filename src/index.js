import React from "react";
import ReactDOM from "react-dom/client"; // Use createRoot from React 18+
import "./styles/popup.css";
import App from "./App";

// Create a root container and render the React app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);