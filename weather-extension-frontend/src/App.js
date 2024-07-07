// Importing necessary React libraries and CSS.
import React from 'react';
import Weather from './Weather'; // Importing the Weather component that .
import './App.css'; // App-specific CSS


// Defining the App functional component.
function App() {
  // This component renders the Weather component wrapped in a div with a class name 'App'.
  return (
    <div className="App">
      <Weather /> {}
    </div>
  );
}

// Exporting the App component so it can be imported and used in other files, like index.js.
export default App;



