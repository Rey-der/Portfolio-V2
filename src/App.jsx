import React, { lazy, Suspense, useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import { ScrollProvider } from './context/ScrollContext';
import { useThemeStore } from './utils/themeStore';

// Lazy load components for direct navigation with controlled loading
const MainLayout = lazy(() => import('./pages/MainLayout'));
const NotFound = lazy(() => import('./pages/NotFound'));

const Contact = lazy(() => 
  new Promise(resolve => {
    // small delay to ensure styles are loaded before component renders
    setTimeout(() => {
      import('./pages/Contact').then(resolve);
    }, 300);
  })
);

// Root layout with immediate visibility
const RootLayout = () => {
  const { theme, listenToSystemThemeChanges } = useThemeStore();
  const [pageReady, setPageReady] = useState(false);
  
  // Set up listener for system theme changes - do this only once
  useEffect(() => {
    console.log('🌓 Setting up theme system listener');
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
      
      // Apply icons-ready class to body after page is ready
      document.body.classList.add('icons-ready');
    }, 200);
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [listenToSystemThemeChanges]);

  return (
    <ScrollProvider>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-2 focus:bg-blue-600 focus:text-white focus:z-50">
        Skip to content
      </a>
      
      <div className={`flex flex-col min-h-screen transition-colors duration-300 ${pageReady ? 'page-ready' : 'page-loading'}`}>
        <Header />
        <main id="main-content" className="flex-grow container-wide mx-auto py-6">
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
    </ScrollProvider>
  );
};

// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <MainLayout /> },
      { path: "about", element: <MainLayout /> },
      { path: "projects", element: <MainLayout /> },
      { path: "guestbook", element: <MainLayout /> },
      { path: "contact", element: <Contact /> }, // Make sure Contact is properly used here
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
      console.log('✅ Icons ready for display');
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  return <RouterProvider router={router} />;
}

export default App;