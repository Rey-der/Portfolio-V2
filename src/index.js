import React, { lazy, Suspense, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import { ScrollProvider } from './context/ScrollContext';
import { useThemeStore } from './utils/themeStore';

// Lazy load components
const MainLayout = lazy(() => import('./pages/MainLayout'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Contact = lazy(() => import('./pages/Contact'));

// Root layout with immediate visibility
const RootLayout = () => {
  const { theme, listenToSystemThemeChanges } = useThemeStore();
  const [pageReady, setPageReady] = useState(false);
  
  // Add preload CSS to hide all icons until page is ready
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Hide all SVG icons initially */
      .preload svg {
        opacity: 0;
        transition: opacity 0.3s ease-out;
      }
    `;
    document.head.appendChild(style);
    
    // Detect when page is fully loaded including assets
    window.addEventListener('load', () => {
      // Remove preload class once everything is ready
      document.body.classList.remove('preload');
      setPageReady(true);
    });
    
    // Add preload class to body
    document.body.classList.add('preload');
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Your existing theme code
  useEffect(() => {
    console.log('🌓 Setting up theme system listener');
    const unsubscribe = listenToSystemThemeChanges();
    
    // Apply theme on first render
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme-storage');
    if (!savedTheme && isDarkMode) {
      document.documentElement.classList.add('dark');
    }
    
    // Mark page as ready
    setTimeout(() => {
      setPageReady(true);
      console.log('🚀 Page ready for interaction');
    }, 200);
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [listenToSystemThemeChanges]);
  
  // Your existing interaction fix
  useEffect(() => {
    // Add a global pointer-events fix
    const style = document.createElement('style');
    style.id = 'global-interaction-fix';
    style.textContent = `
      /* Ensure header links are highly interactive */
      header a, 
      header button,
      [role="navigation"] a,
      [role="navigation"] button,
      .nav-link {
        pointer-events: auto !important;
        position: relative !important;
        z-index: 50 !important;
      }
      
      /* Fix any overlays that might block clicks */
      .overlay, 
      [class*="overlay"] {
        pointer-events: none !important;
      }
      
      /* Ensure interactive elements are prioritized */
      a, button, [role="button"], input, select, textarea {
        position: relative;
        z-index: 5;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      const existingStyle = document.getElementById('global-interaction-fix');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);
  
  return (
    <ScrollProvider>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-2 focus:bg-blue-600 focus:text-white focus:z-50">
        Skip to content
      </a>
      
      <div className={`flex flex-col min-h-screen transition-colors duration-300 ${pageReady ? 'page-ready' : ''}`}>
        <Header />
        <main id="main-content" className="flex-grow container-wide mx-auto py-6">
          <Suspense fallback={<LoadingSpinner aria-label="Loading content" />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
    </ScrollProvider>
  );
};
