import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
// ScrollProvider is likely applied in main.jsx, so not needed here directly
// import { ScrollProvider } from './context/ScrollContext';
import { useThemeStore } from './utils/themeStore';

// Lazy load components for direct navigation with controlled loading
const MainLayout = lazy(() => import('./pages/MainLayout'));
const NotFound = lazy(() => import('./pages/NotFound'));
// Correctly lazy load the detailed LegalNoticePrivacyPolicy component
const LegalNoticePrivacyPolicy = lazy(() => import('./pages/LegalNoticePrivacyPolicy'));

const Contact = lazy(() =>
  new Promise(resolve => {
    // small delay to ensure styles are loaded before component renders
    setTimeout(() => {
      import('./pages/Contact').then(resolve);
    }, 300);
  })
);

// Create a context for the cloak
export const CloakContext = React.createContext({
  controlCloak: () => {},
  isClockVisible: false
});

// Add a hook for using the cloak
export const useCloak = () => {
  return React.useContext(CloakContext);
};

// Root layout with immediate visibility
const RootLayout = () => {
  const { theme, listenToSystemThemeChanges } = useThemeStore();
  const [pageReady, setPageReady] = useState(false);
  const location = useLocation();
  const cloakRef = useRef(null); // Ref for the cloak element
  const [cloakStyle, setCloakStyle] = useState({ // State to control cloak style
    opacity: 1, // Always visible
    top: '100vh', // Start at the bottom of the viewport
    height: '100vh',
    pointerEvents: 'none', // Non-interactive
    backgroundColor: 'var(--background)', // Use CSS variable
  });

  // Track scroll position
  const [scrollPosition, setScrollPosition] = useState(0);

  // Function to control cloak - enhanced to include position
  const controlCloak = ({ isVisible, top = '0px', height = '100vh' }) => {
    setCloakStyle(prevStyle => ({
      ...prevStyle,
      opacity: isVisible ? 1 : 0,
      top: top,
      height: height,
      pointerEvents: isVisible ? 'auto' : 'none',
      backgroundColor: 'var(--background)', // Ensure background updates with theme
    }));
  };

  // Create context value
  const cloakContextValue = React.useMemo(() => ({
    controlCloak,
    isCloakVisible: cloakStyle.opacity > 0
  }), [cloakStyle.opacity]);

  // Set up listener for system theme changes - do this only once
  useEffect(() => {
    const unsubscribe = listenToSystemThemeChanges();

    // Apply theme on first render
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme-storage');
    if (!savedTheme && isDarkMode) {
      document.documentElement.classList.add('dark');
    }

    // Mark page as ready after a small delay to ensure styles apply
    setTimeout(() => {
      setPageReady(true);
      document.body.classList.add('icons-ready');
    }, 200);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [listenToSystemThemeChanges]);

  // Update cloak background color if theme changes
  useEffect(() => {
    setCloakStyle(prev => ({ ...prev, backgroundColor: 'var(--background)' }));
  }, [theme]);

  // Enhanced scroll tracking to update cloak position
  useEffect(() => {
    const handleScroll = () => {
      // Update scroll position
      setScrollPosition(window.scrollY);

      // Position the cloak based on scroll
      // Always keep it visible with opacity 1, just positioned at viewport bottom
      setCloakStyle(prev => ({
        ...prev,
        opacity: 1,
        top: '100vh', // Position at viewport bottom
        height: '100vh' // Cover everything below
      }));
    };

    // Add event listener once
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial call
    handleScroll();

    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  return (
    <CloakContext.Provider value={cloakContextValue}>
      <>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-2 focus:bg-blue-600 focus:text-white focus:z-50">
          Skip to content
        </a>

        {/* Global vertical lines - FIXED FOR CORRECT LAYERING */}
        <div 
          className="fixed top-0 left-0 w-full h-full pointer-events-none"
          style={{ 
            zIndex: 1, // REDUCED: Much lower than content
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          aria-hidden="true"
        >
          <div 
            className="vertical-line left"
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '10vw',
              width: '2px',
              backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
              height: '100%',
              boxShadow: theme === 'dark' ? '0 0 8px rgba(255,255,255,0.1)' : '0 0 8px rgba(0,0,0,0.1)',
            }}
          />
          <div 
            className="vertical-line right"
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: '10vw',
              width: '2px',
              backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
              height: '100%',
              boxShadow: theme === 'dark' ? '0 0 8px rgba(255,255,255,0.1)' : '0 0 8px rgba(0,0,0,0.1)',
            }}
          />
        </div>

        {/* Main application structure */}
        <div 
          className={`flex flex-col transition-colors duration-300 min-h-screen ${pageReady ? 'page-ready' : 'page-loading'}`}
          style={{ position: 'relative', zIndex: 10 }} // Keep this above the lines
        >
          {/* Header - Remains at highest z-index */}
          <div className="relative" style={{ zIndex: 300 }}> 
            <Header />
          </div>

          {/* Main content - INCREASED z-index to be above lines */}
          <main 
            id="main-content" 
            className="flex-grow container-wide mx-auto py-6 pt-20 relative" 
            style={{ zIndex: 50 }} // INCREASED: Much higher than lines
          >
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner aria-label="Loading content" />
              </div>
            }>
              <Outlet />
            </Suspense>
          </main>
          <Footer />
        </div>

        {/* Cloak Element - Keep as highest element */}
        <div
          ref={cloakRef}
          style={{
            position: 'fixed',
            left: 0,
            width: '100%',
            zIndex: -100, // INCREASED: Absolutely highest
            transition: 'background-color 0.3s ease-in-out',
            ...cloakStyle,
          }}
          aria-hidden="true"
          className="cloak-element"
        />
      </>
    </CloakContext.Provider>
  );
};

// Router configuration - ensure all future flags are properly set
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <MainLayout /> },
      { path: "about", element: <MainLayout /> },
      { path: "projects", element: <MainLayout /> },
      { path: "guestbook", element: <MainLayout /> },
      { path: "contact", element: <Contact /> },
      // Use the correct component for the /legal route
      { path: "legal", element: <LegalNoticePrivacyPolicy /> },
      { path: "*", element: <NotFound /> },
    ],
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

function App() {
  useEffect(() => {
    // Add global class to control icon visibility
    document.body.classList.add('icons-loading');

    // After a delay, show all icons
    const timer = setTimeout(() => {
      document.body.classList.remove('icons-loading');
      document.body.classList.add('icons-ready');
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;