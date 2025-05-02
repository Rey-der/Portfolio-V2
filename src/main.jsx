import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./styles/spinner.css";
import "./styles/animations.css";
import { LanguageProvider } from './context/LanguageContext'; // Import Language Provider
import { ScrollProvider } from './context/ScrollContext'; // Add this import

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
    
    /* MODIFIED: Allow proper scrolling while preventing bounce effects */
    html {
      overscroll-behavior: none;
      scroll-behavior: smooth;
    }
    
    body {
      overscroll-behavior: none;
      overflow-x: hidden;
      position: relative;
      /* REMOVED: height: 100%; - this can cause scroll issues */
      width: 100%;
      margin: 0;
      padding: 0;
    }
    
    /* Fix for scroll event bubbling */
    * {
      box-sizing: border-box;
    }
    
    /* Add custom passive scroll handler to ensure events are captured */
    [data-scroll-section] {
      position: relative;
      z-index: 1;
    }
    
    /* Fix for scroll tracking */
    #root {
      position: relative;
      min-height: 100vh;
      width: 100%;
      overflow: visible;
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

  // Add a global scroll position tracker
  // This ensures we always have accurate scroll position available
  window._scrollY = window.scrollY || 0;
  window._scrollDirection = 'none';
  window._lastScrollY = window.scrollY || 0;
  
  // Add a passive scroll listener early in the document lifecycle
  // This ensures scroll position is always tracked accurately
  const globalScrollTracker = () => {
    window._lastScrollY = window._scrollY;
    window._scrollY = window.scrollY;
    window._scrollDirection = window._scrollY > window._lastScrollY ? 'down' : 'up';
    
    // Set data attributes on body to enable CSS selectors based on scroll
    document.body.setAttribute('data-scroll-y', Math.round(window._scrollY));
    document.body.setAttribute('data-scroll-direction', window._scrollDirection);
  };
  
  // Use capture phase to ensure we get the events first
  window.addEventListener('scroll', globalScrollTracker, { 
    passive: true,
    capture: true
  });
  
  // Add debug helper to window object
  window.scrollDebug = {
    getScrollPosition: () => window._scrollY,
    getScrollDirection: () => window._scrollDirection,
    logScrollInfo: () => console.log({
      position: window._scrollY,
      direction: window._scrollDirection,
      tracked: true,
      time: new Date().toLocaleTimeString()
    })
  };

  // Render app with ScrollProvider wrapping everything
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <LanguageProvider>
        <ScrollProvider>
          <App />
        </ScrollProvider>
      </LanguageProvider>
    </React.StrictMode>
  );
  console.log('✅ React app mounted');
  
  // Force a small scroll to kick off scroll tracking
  // This ensures our tracking system is initialized 
  setTimeout(() => {
    if (window.scrollY === 0) {
      window.scrollBy(0, 1);
      setTimeout(() => {
        window.scrollBy(0, -1);
        console.log('🔄 Scroll tracking initialized');
      }, 50);
    }
  }, 500);
});