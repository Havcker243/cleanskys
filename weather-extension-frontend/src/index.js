// Importing necessary React and ReactDOM libraries along with styles and App component.
import React from "react";
import ReactDOM from "react-dom";
import "./index.css"; // Global CSS
import App from "./App"; // Main App component

// Rendering the App component into the DOM.
ReactDOM.render(
  // React.StrictMode is a tool for highlighting potential problems in an application.
  // It activates additional checks and warnings for its descendants.
  <React.StrictMode>
    <App /> {}
  </React.StrictMode>,
  document.getElementById("root") 
);

