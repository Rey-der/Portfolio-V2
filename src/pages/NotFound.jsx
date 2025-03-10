import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  const [terminalLine, setTerminalLine] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const handleNavigation = () => {
    navigate('/');
  };
  
  // section navigation with improved scrolling
  const handleSectionNavigation = (sectionId) => {
    navigate('/');
    
    const attemptScroll = (attempts = 0) => {
      if (attempts > 5) return; // Give up after 5 attempts
      
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          attemptScroll(attempts + 1);
        }
      }, attempts === 0 ? 500 : 300);
    };
    
    attemptScroll();
  };
  
  // Simulate typing effect for terminal
  useEffect(() => {
    if (terminalLine < 6) {
      const timer = setTimeout(() => {
        setTerminalLine(prev => prev + 1);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [terminalLine]);
  
  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);
  
  // Handle copy to clipboard
  const copyToClipboard = () => {
    const errorText = `Error: 404 Page Not Found
at Router.navigateTo (/src/router/index.js:42:13)
at processRequest (/src/middleware/routing.js:77:21)
at handleNavigation (/src/components/App.jsx:105:7)

Available routes:
✓ /home
✓ /projects
✓ /about
✓ /guestbook
✓ /contact`;
    
    navigator.clipboard.writeText(errorText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  // Navigation tabs for main site sections - reordered as requested
  const navigationTabs = [
    { name: 'Home', path: '/', id: 'home' },
    { name: 'Projects', path: '/', id: 'projects' },
    { name: 'About', path: '/', id: 'about' },
    { name: 'Guestbook', path: '/', id: 'guestbook' },
    { name: 'Contact', path: '/contact', id: null } 
  ];
  
  return (
    <div className="fixed inset-0 flex items-center justify-center text-gray-800 dark:text-gray-200" 
         style={{ backgroundColor: 'var(--background)' }}>
      {/* VS Code Window with styling */}
      <div className="vs-code-container flex flex-col w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl border border-[#424242]/50 m-4" 
           style={{ boxShadow: "0 0 30px rgba(0,0,0,0.5), 0 0 1px 1px rgba(255,255,255,0.07)" }}>
        {/* VS Code Title Bar with rounded corners on top */}
        <div className="vs-title-bar flex items-center justify-between bg-[#323233] px-4 py-2 text-sm rounded-t-lg">
          <div className="flex items-center">
            <span className="vs-icon mr-2">📁</span>
            <span className="text-white">404 Error</span>
          </div>
          <div className="flex space-x-2">
            <button className="w-3 h-3 rounded-full bg-yellow-500"></button>
            <button className="w-3 h-3 rounded-full bg-green-500"></button>
            <button className="w-3 h-3 rounded-full bg-red-500"></button>
          </div>
        </div>
        
        {/* VS Code Tabs */}
        <div className="vs-tabs flex overflow-x-auto bg-[#252526] text-sm border-b border-[#191919]">
          {navigationTabs.map((tab, index) => (
            <button 
              key={index}
              onClick={() => tab.id ? handleSectionNavigation(tab.id) : navigate(tab.path)}
              className={`px-4 py-2 flex items-center whitespace-nowrap text-white cursor-pointer ${
                index === 0 
                  ? 'bg-[#1E1E1E] border-t-2 border-[#444444]' 
                  : 'bg-[#2D2D2D] hover:bg-[#2A2D2E]'
              }`}
            >
              <span className="mr-2">{index === 0 ? '⚠️' : '📄'}</span>
              <span>{tab.name}</span>
              {index === 0 && <span className="ml-2 text-xs">×</span>}
            </button>
          ))}
        </div>
        
        {/* Main Content - Terminal (takes all available space) */}
        <div className="flex-1 p-4 overflow-auto bg-[#1E1E1E]" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <div className="vs-terminal border border-[#191919] rounded shadow-lg h-full">
            <div className="vs-terminal-header bg-[#323233] px-4 py-2 flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-2">📺</span>
                <span className="text-white">TERMINAL - Error Log</span>
              </div>
              <button 
                onClick={copyToClipboard}
                className="px-2 py-0.5 bg-[#252526] hover:bg-[#37373D] text-white text-xs rounded border border-[#3D3D42] flex items-center"
                title="Copy to clipboard"
              >
                {copied ? (
                  <>
                    <span className="text-[#89D185] mr-1">✓</span>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <span className="mr-1">📋</span>
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="p-4 font-mono text-sm overflow-y-auto text-white" style={{ minHeight: '200px' }}>
              {terminalLine >= 1 && 
                <p className="text-[#569CD6]">$ node navigate.js --route="/not-found"</p>}
              
              {terminalLine >= 2 && 
                <p className="text-[#F44747] mt-4">Error: 404 Page Not Found</p>}
              
              {terminalLine >= 3 && 
                <p className="text-[#CCCCCC] mt-2 ml-4">at Router.navigateTo (/src/router/index.js:42:13)</p>}
              
              {terminalLine >= 4 && 
                <p className="text-[#CCCCCC] ml-4">at processRequest (/src/middleware/routing.js:77:21)</p>}
              
              {terminalLine >= 5 && 
                <p className="text-[#CCCCCC] ml-4">at handleNavigation (/src/components/App.jsx:105:7)</p>}
              
              {terminalLine >= 6 && (
                <>
                  <p className="text-[#CCCCCC] mt-8 mb-2">Available routes:</p>
                  <p className="text-[#6A9955] ml-4">✓ /home</p>
                  <p className="text-[#6A9955] ml-4">✓ /projects</p>
                  <p className="text-[#6A9955] ml-4">✓ /about</p>
                  <p className="text-[#6A9955] ml-4">✓ /guestbook</p>
                  <p className="text-[#6A9955] ml-4">✓ /contact</p>
                  
                  <p className="text-[#569CD6] mt-6">$ navigate --to="/"</p>
                </>
              )}
              
              <span className="text-[#569CD6] inline-block mt-2">
                {terminalLine >= 6 ? "Redirecting..." : "$"}
                <span className={`ml-1 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}>▊</span>
              </span>
            </div>
          </div>
        </div>
        
        {/* Status Bar with rounded corners on bottom */}
        <div className="vs-statusbar flex items-center justify-between bg-[#424242] text-white px-4 py-1 text-xs rounded-b-lg">
          <div className="flex items-center space-x-4">
            <span>⚠️ 404 Error</span>
            <span>🔀 main</span>
          </div>
          <button 
            onClick={handleNavigation}
            className="bg-[#1E1E1E] hover:bg-[#252526] text-white px-3 py-0.5 rounded text-xs"
          >
            Return Home
          </button>
          <div className="flex items-center space-x-4">
            <span>JavaScript</span>
            <span>UTF-8</span>
            <span>Ln 404, Col 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

NotFound.displayName = 'NotFoundPage';
NotFound.noLayout = true;

export default NotFound;