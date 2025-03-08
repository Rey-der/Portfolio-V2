import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./styles/spinner.css";
import "./styles/animations.css";

console.log('🚀 Application bootstrap starting');

// Add this to ensure CSS variables are available before rendering
document.addEventListener('DOMContentLoaded', () => {
  // Add initial CSS styles to prevent flickering
  const style = document.createElement('style');
  style.textContent = `
    /* Ensure triangle is invisible initially */
    .triangle-animation {
      opacity: 0;
      transition: opacity 0.8s ease-in-out;
    }
    
    /* Hide footer initially */
    footer {
      opacity: 0;
      transition: opacity 0.7s ease-out;
    }
    
    /* Target mail SVG icons specifically by both paths */
    svg[viewBox="0 0 20 20"] path[d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"],
    svg[viewBox="0 0 20 20"] path[d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"],
    svg[viewBox="0 0 20 20"]:has(path[d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"]),
    .mail-icon {
      opacity: 0;
      transition: opacity 1s ease-out;
      animation: fadeInMail 1.8s forwards;
    }
    
    @keyframes fadeInMail {
      0% { opacity: 0; }
      50% { opacity: 0; }
      100% { opacity: 1; }
    }
    
    /* Prevent overscroll */
    html, body {
      overscroll-behavior: none;
      overflow-x: hidden;
      position: relative;
      height: 100%;
      width: 100%;
    }
    
    /* Ensure RGB variables are available */
    :root {
      --primary-rgb: 26, 115, 232;
    }
    
    .dark {
      --primary-rgb: 187, 134, 252;
    }
  `;
  document.head.appendChild(style);

  // Render app immediately without setTimeout
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('✅ React app mounted');
});