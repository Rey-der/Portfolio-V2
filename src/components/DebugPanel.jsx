import React, { useState, useEffect } from 'react';
import { useScroll } from '../context/ScrollContext';

const DebugPanel = () => {
  const { 
    activeSection, 
    registeredSections,
    sectionsInView,
    scrollY,
    scrollDirection,
    settings,
    updateSettings
  } = useScroll();
  
  // State for settings and panel visibility
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTriggers, setShowTriggers] = useState(false);
  const [showScanLine, setShowScanLine] = useState(false);
  const [showURLTriggers, setShowURLTriggers] = useState(false);
  const [lastDetection, setLastDetection] = useState(null);
  const [lastMarker, setLastMarker] = useState(null);
  
  const [localSettings, setLocalSettings] = useState(settings || {
    dampeningFactor: 0.15,
    updateRatioThreshold: 0.25,
    minUpdateInterval: 600,
    observerThresholds: [0.15, 0.25, 0.5],
    rootMarginTop: -10,
    rootMarginBottom: -50,
    urlUpdateInterval: 1200,
    homeThreshold: 0.15,
    sectionThreshold: 0.2
  });
  
  // Sync with context settings when they change
  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);
  
  // Handle settings change
  const handleChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    if (updateSettings) {
      updateSettings(newSettings);
    }
  };

  // Effect for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Shift+D to toggle debug panel
      if (e.ctrlKey && e.shiftKey && e.key === 'd') {
        setIsExpanded(prev => !prev);
      }
      // Ctrl+Alt+S to toggle scan line
      else if (e.ctrlKey && e.altKey && e.key === 's') {
        setShowScanLine(prev => !prev);
        
        // Dispatch custom event for scan line visibility change
        document.dispatchEvent(new CustomEvent('debug-scanline-toggle', {
          detail: { visible: !showScanLine }
        }));
      }
      // Ctrl+Alt+T to toggle all triggers
      else if (e.ctrlKey && e.altKey && e.key === 't') {
        const newValue = !showTriggers;
        setShowTriggers(newValue);
        setShowURLTriggers(newValue);
      }
      // Ctrl+Alt+U to toggle URL triggers only
      else if (e.ctrlKey && e.altKey && e.key === 'u') {
        setShowURLTriggers(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showScanLine, showTriggers, showURLTriggers]);

  // Effect to create and show/hide scan line
  useEffect(() => {
    // Create or find the scan line element
    let scanLine = document.getElementById('viewport-scan-line');
    
    if (!scanLine) {
      scanLine = document.createElement('div');
      scanLine.id = 'viewport-scan-line';
      document.body.appendChild(scanLine);
    }
    
    // Set its styles
    Object.assign(scanLine.style, {
      position: 'fixed',
      left: '0',
      width: '100%',
      height: showScanLine ? '4px' : '2px',
      backgroundColor: showScanLine ? 'rgba(0, 180, 255, 0.8)' : 'transparent',
      zIndex: '9999',
      pointerEvents: 'none',
      top: '50%', // Middle of the viewport
      transform: 'translateY(-50%)',
      boxShadow: showScanLine ? '0 0 8px rgba(0, 180, 255, 0.8)' : 'none',
      transition: 'all 0.3s ease'
    });
    
    // Create scan area boundary markers
    if (showScanLine) {
      // Create scan area boundary markers
      let topMarker = document.getElementById('scan-area-top-marker');
      let bottomMarker = document.getElementById('scan-area-bottom-marker');
      
      if (!topMarker) {
        topMarker = document.createElement('div');
        topMarker.id = 'scan-area-top-marker';
        document.body.appendChild(topMarker);
      }
      
      if (!bottomMarker) {
        bottomMarker = document.createElement('div');
        bottomMarker.id = 'scan-area-bottom-marker';
        document.body.appendChild(bottomMarker);
      }
      
      // Calculate positions based on the rootMargin values
      const viewportHeight = window.innerHeight;
      const topPosition = viewportHeight * 0.475; // 47.5% down from top
      const bottomPosition = viewportHeight * 0.525; // 52.5% down from top
      
      // Style the markers
      const markerStyle = {
        position: 'fixed',
        left: '0',
        width: '100%',
        height: '1px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        pointerEvents: 'none',
        zIndex: 9998
      };
      
      Object.assign(topMarker.style, {
        ...markerStyle,
        top: `${topPosition}px`,
        display: 'block'
      });
      
      Object.assign(bottomMarker.style, {
        ...markerStyle,
        top: `${bottomPosition}px`,
        display: 'block'
      });
    } else {
      // Hide markers if scan line is hidden
      const topMarker = document.getElementById('scan-area-top-marker');
      const bottomMarker = document.getElementById('scan-area-bottom-marker');
      
      if (topMarker) topMarker.style.display = 'none';
      if (bottomMarker) bottomMarker.style.display = 'none';
    }
    
    // Broadcast scan line state
    document.dispatchEvent(new CustomEvent('debug-scanline-state', {
      detail: { visible: showScanLine }
    }));
    
    // Clean up when component unmounts
    return () => {
      const scanLine = document.getElementById('viewport-scan-line');
      const topMarker = document.getElementById('scan-area-top-marker');
      const bottomMarker = document.getElementById('scan-area-bottom-marker');
      
      if (scanLine && scanLine.parentNode) {
        scanLine.parentNode.removeChild(scanLine);
      }
      
      if (topMarker && topMarker.parentNode) {
        topMarker.parentNode.removeChild(topMarker);
      }
      
      if (bottomMarker && bottomMarker.parentNode) {
        bottomMarker.parentNode.removeChild(bottomMarker);
      }
    };
  }, [showScanLine]);

  // Effect to highlight regular trigger elements when showTriggers is true
  useEffect(() => {
    const triggers = document.querySelectorAll('.section-trigger-top, .section-trigger-bottom');
    
    if (showTriggers) {
      triggers.forEach(trigger => {
        const sectionId = trigger.getAttribute('data-section');
        const triggerType = trigger.getAttribute('data-trigger');
        const color = triggerType.includes('top') ? 'rgba(52, 211, 153, 0.3)' : 'rgba(239, 68, 68, 0.3)';
        
        trigger.style.opacity = '1';
        trigger.style.backgroundColor = color;
        trigger.style.border = `2px dashed ${triggerType.includes('top') ? '#34d399' : '#ef4444'}`;
        trigger.style.zIndex = '50';
        trigger.textContent = `${sectionId}-${triggerType}`;
        trigger.style.display = 'flex';
        trigger.style.alignItems = 'center';
        trigger.style.justifyContent = 'center';
        trigger.style.color = 'white';
        trigger.style.fontWeight = 'bold';
        trigger.style.textShadow = '0px 0px 2px black';
      });
    } else {
      triggers.forEach(trigger => {
        trigger.style.opacity = '0';
        trigger.style.backgroundColor = '';
        trigger.style.border = '';
        trigger.style.zIndex = '-1';
        trigger.textContent = '';
      });
    }
    
    return () => {
      // Reset triggers when component unmounts
      triggers.forEach(trigger => {
        trigger.style.opacity = '0';
        trigger.style.backgroundColor = '';
        trigger.style.border = '';
        trigger.style.zIndex = '-1';
        trigger.textContent = '';
      });
    };
  }, [showTriggers]);
  
  // Effect to highlight URL trigger elements when showURLTriggers is true
  useEffect(() => {
    const urlTriggers = document.querySelectorAll('.section-url-trigger');
    
    if (showURLTriggers) {
      urlTriggers.forEach(trigger => {
        const sectionId = trigger.getAttribute('data-section');
        const triggerType = trigger.getAttribute('data-trigger');
        const isEntry = triggerType.includes('entry');
        const color = isEntry ? 'rgba(255, 196, 0, 0.3)' : 'rgba(132, 94, 247, 0.3)';
        
        trigger.style.opacity = '1';
        trigger.style.backgroundColor = color;
        trigger.style.border = `2px dashed ${isEntry ? '#ffc400' : '#845ef7'}`;
        trigger.style.zIndex = '50';
        trigger.textContent = `${sectionId}-${triggerType}`;
        trigger.style.display = 'flex';
        trigger.style.alignItems = 'center';
        trigger.style.justifyContent = 'center';
        trigger.style.color = 'white';
        trigger.style.fontWeight = 'bold';
        trigger.style.textShadow = '0px 0px 2px black';
      });
    } else {
      urlTriggers.forEach(trigger => {
        trigger.style.opacity = '0';
        trigger.style.backgroundColor = '';
        trigger.style.border = '';
        trigger.style.zIndex = '-1';
        trigger.textContent = '';
      });
    }
    
    return () => {
      // Reset URL triggers when component unmounts
      urlTriggers.forEach(trigger => {
        trigger.style.opacity = '0';
        trigger.style.backgroundColor = '';
        trigger.style.border = '';
        trigger.style.zIndex = '-1';
        trigger.textContent = '';
      });
    };
  }, [showURLTriggers]);
  
  // Listen for trigger detection events from ScrollURLUpdate
  useEffect(() => {
    const handleTriggerDetection = (e) => {
      setLastDetection({
        sectionId: e.detail.sectionId,
        triggerType: e.detail.triggerType,
        intersectionRatio: e.detail.intersectionRatio,
        scrollDirection: e.detail.scrollDirection,
        timestamp: Date.now()
      });
      
      // Auto-clear after 3 seconds
      setTimeout(() => {
        setLastDetection(prev => {
          if (prev && prev.timestamp === e.detail.timestamp) {
            return null;
          }
          return prev;
        });
      }, 3000);
    };
    
    const handleURLChange = (e) => {
      setLastMarker({
        sectionId: e.detail.sectionId,
        from: e.detail.from,
        to: e.detail.to,
        timestamp: Date.now()
      });
      
      // Auto-clear after 3 seconds
      setTimeout(() => {
        setLastMarker(prev => {
          if (prev && prev.timestamp === e.detail.timestamp) {
            return null;
          }
          return prev;
        });
      }, 3000);
    };
    
    document.addEventListener('debug-trigger-detection', handleTriggerDetection);
    document.addEventListener('debug-url-change', handleURLChange);
    
    return () => {
      document.removeEventListener('debug-trigger-detection', handleTriggerDetection);
      document.removeEventListener('debug-url-change', handleURLChange);
    };
  }, []);
  
  return (
    <div 
      className="debug-panel" 
      style={{
        position: 'fixed',
        zIndex: 9999,
        right: '16px',
        top: '90px',
        width: isExpanded ? '320px' : '40px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        borderRadius: '8px',
        padding: isExpanded ? '16px' : '8px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        fontFamily: 'monospace',
        fontSize: '12px',
        opacity: isExpanded ? 1 : 0.5,
        cursor: 'pointer'
      }}
      onClick={() => !isExpanded && setIsExpanded(true)}
      title="Press Ctrl+Shift+D to toggle debug panel"
    >
      {!isExpanded && (
        <div className="debug-icon" style={{ textAlign: 'center', fontSize: '16px' }}>⚙️</div>
      )}
      
      {isExpanded && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: '0', fontSize: '14px' }}>Debug Controls</h3>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ×
            </button>
          </div>
          
          <div style={{ fontSize: '10px', marginBottom: '8px', opacity: 0.7 }}>
            Press Ctrl+Shift+D to toggle this panel
          </div>
          
          <div>
            <div className="debug-section">
              <h4>Current State</h4>
              <div>Active Section: <strong>{activeSection}</strong></div>
              <div>Scroll Position: <strong>{scrollY}px</strong></div>
              <div>Direction: <strong>{scrollDirection}</strong></div>
              <div>Registered Sections: <strong>{registeredSections?.join(', ') || 'none'}</strong></div>
              
              {/* Debug Visualizations */}
              <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={showTriggers} 
                      onChange={() => setShowTriggers(!showTriggers)}
                      style={{ marginRight: '8px' }}
                    />
                    <span>Show Section Triggers</span>
                    <span style={{ marginLeft: '4px', fontSize: '9px', opacity: 0.7 }}>(Ctrl+Alt+T)</span>
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={showURLTriggers} 
                      onChange={() => setShowURLTriggers(!showURLTriggers)}
                      style={{ marginRight: '8px' }}
                    />
                    <span>Show URL Triggers</span>
                    <span style={{ marginLeft: '4px', fontSize: '9px', opacity: 0.7 }}>(Ctrl+Alt+U)</span>
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={showScanLine} 
                      onChange={() => {
                        const newValue = !showScanLine;
                        setShowScanLine(newValue);
                        // Dispatch custom event for scan line visibility change
                        document.dispatchEvent(new CustomEvent('debug-scanline-toggle', {
                          detail: { visible: newValue }
                        }));
                      }}
                      style={{ marginRight: '8px' }}
                    />
                    <span>Show Viewport Scan Line</span>
                    <span style={{ marginLeft: '4px', fontSize: '9px', opacity: 0.7 }}>(Ctrl+Alt+S)</span>
                  </label>
                </div>
              </div>
              
              {/* Last detection */}
              {lastDetection && (
                <div style={{
                  marginTop: '10px',
                  padding: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '4px',
                  borderLeft: `3px solid ${
                    lastDetection.triggerType === 'top' ? '#34d399' : 
                    lastDetection.triggerType === 'bottom' ? '#ef4444' : 
                    lastDetection.triggerType === 'url-entry' ? '#ffc400' : '#845ef7'
                  }`
                }}>
                  <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '4px' }}>Last Detection:</div>
                  <div><strong>{lastDetection.sectionId}-{lastDetection.triggerType}</strong></div>
                  <div>Ratio: {lastDetection.intersectionRatio}, Dir: {lastDetection.scrollDirection}</div>
                </div>
              )}
              
              {/* Last URL change */}
              {lastMarker && (
                <div style={{
                  marginTop: '10px',
                  padding: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '4px',
                  borderLeft: '3px solid #ffc400'
                }}>
                  <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '4px' }}>Last URL Update:</div>
                  <div><strong>{lastMarker.from} → {lastMarker.to}</strong></div>
                  <div>Section: {lastMarker.sectionId}</div>
                </div>
              )}
              
              {/* Sections in view with more detail */}
              <div style={{ marginTop: '10px' }}>
                <h5 style={{ margin: '4px 0' }}>Sections In View:</h5>
                {sectionsInView && sectionsInView.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {sectionsInView.map(section => (
                      <li key={section.id} style={{ 
                        color: section.id === activeSection ? '#4ade80' : 'inherit',
                        fontWeight: section.id === activeSection ? 'bold' : 'normal'
                      }}>
                        {section.id} ({section.visibility})
                        {section.id === activeSection && <span style={{ color: '#4ade80' }}> ✓</span>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>None</div>
                )}
              </div>
              
              {/* Trigger and scan line visualization */}
              {(showTriggers || showURLTriggers || showScanLine) && (
                <div style={{ marginTop: '10px' }}>
                  <h5 style={{ margin: '4px 0' }}>Debug Visualization:</h5>
                  <div style={{ 
                    display: 'flex',
                    gap: '8px',
                    marginTop: '4px',
                    flexWrap: 'wrap'
                  }}>
                    {showTriggers && (
                      <>
                        <div style={{ 
                          padding: '2px 6px', 
                          backgroundColor: 'rgba(52, 211, 153, 0.3)',
                          border: '1px solid #34d399',
                          borderRadius: '4px',
                          fontSize: '10px'
                        }}>
                          Top Triggers
                        </div>
                        <div style={{ 
                          padding: '2px 6px', 
                          backgroundColor: 'rgba(239, 68, 68, 0.3)',
                          border: '1px solid #ef4444',
                          borderRadius: '4px',
                          fontSize: '10px'
                        }}>
                          Bottom Triggers
                        </div>
                      </>
                    )}
                    
                    {showURLTriggers && (
                      <>
                        <div style={{ 
                          padding: '2px 6px', 
                          backgroundColor: 'rgba(255, 196, 0, 0.3)',
                          border: '1px solid #ffc400',
                          borderRadius: '4px',
                          fontSize: '10px'
                        }}>
                          URL Entry
                        </div>
                        <div style={{ 
                          padding: '2px 6px', 
                          backgroundColor: 'rgba(132, 94, 247, 0.3)',
                          border: '1px solid #845ef7',
                          borderRadius: '4px',
                          fontSize: '10px'
                        }}>
                          URL Exit
                        </div>
                      </>
                    )}
                    
                    {showScanLine && (
                      <div style={{ 
                        padding: '2px 6px', 
                        backgroundColor: 'rgba(0, 180, 255, 0.2)',
                        border: '1px solid rgba(0, 180, 255, 0.8)',
                        borderRadius: '4px',
                        fontSize: '10px'
                      }}>
                        URL Update Scan Line
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="debug-section" style={{ marginTop: '16px' }}>
              <h4>Intersection Observer Settings</h4>
              
              <label style={{ display: 'block', margin: '8px 0' }}>
                Dampening Factor: {localSettings.dampeningFactor}
                <input 
                  type="range" 
                  min="0.05" 
                  max="0.5" 
                  step="0.05" 
                  value={localSettings.dampeningFactor}
                  onChange={(e) => handleChange('dampeningFactor', parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </label>
              
              <label style={{ display: 'block', margin: '8px 0' }}>
                Update Ratio Threshold: {localSettings.updateRatioThreshold}
                <input 
                  type="range" 
                  min="0.1" 
                  max="0.5" 
                  step="0.05" 
                  value={localSettings.updateRatioThreshold}
                  onChange={(e) => handleChange('updateRatioThreshold', parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </label>
              
              <label style={{ display: 'block', margin: '8px 0' }}>
                Min Update Interval: {localSettings.minUpdateInterval}ms
                <input 
                  type="range" 
                  min="100" 
                  max="1500" 
                  step="100" 
                  value={localSettings.minUpdateInterval}
                  onChange={(e) => handleChange('minUpdateInterval', parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </label>
              
              <label style={{ display: 'block', margin: '8px 0' }}>
                Root Margin Top: {localSettings.rootMarginTop}%
                <input 
                  type="range" 
                  min="-50" 
                  max="0" 
                  step="5" 
                  value={localSettings.rootMarginTop}
                  onChange={(e) => handleChange('rootMarginTop', parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </label>
              
              <label style={{ display: 'block', margin: '8px 0' }}>
                Root Margin Bottom: {localSettings.rootMarginBottom}%
                <input 
                  type="range" 
                  min="-80" 
                  max="-10" 
                  step="5" 
                  value={localSettings.rootMarginBottom}
                  onChange={(e) => handleChange('rootMarginBottom', parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </label>
            </div>
            
            <div className="debug-section" style={{ marginTop: '16px' }}>
              <h4>URL Update Settings</h4>
              <label style={{ display: 'block', margin: '8px 0' }}>
                URL Update Interval: {localSettings.urlUpdateInterval}ms
                <input 
                  type="range" 
                  min="300" 
                  max="2000" 
                  step="100" 
                  value={localSettings.urlUpdateInterval}
                  onChange={(e) => handleChange('urlUpdateInterval', parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </label>
              
              <label style={{ display: 'block', margin: '8px 0' }}>
                Visibility Threshold:
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Home/About: {localSettings.homeThreshold || 0.15}</span>
                  <span>Others: {localSettings.sectionThreshold || 0.2}</span>
                </div>
                <input 
                  type="range" 
                  min="0.05" 
                  max="0.3" 
                  step="0.05" 
                  value={localSettings.homeThreshold || 0.15}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    handleChange('homeThreshold', value);
                    handleChange('sectionThreshold', value + 0.05);
                  }}
                  style={{ width: '100%' }}
                />
              </label>
              
              <label style={{ display: 'block', margin: '8px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>URL Entry Position: {Math.round(localSettings.urlEntryPosition * 100) || 25}%</span>
                  <span>URL Exit Position: {Math.round(localSettings.urlExitPosition * 100) || 25}%</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="0.4" 
                  step="0.05" 
                  value={localSettings.urlEntryPosition || 0.25}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    handleChange('urlEntryPosition', value);
                    handleChange('urlExitPosition', value);
                  }}
                  style={{ width: '100%' }}
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;