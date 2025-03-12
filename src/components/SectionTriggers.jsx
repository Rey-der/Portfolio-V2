import React from 'react';

/**
 * Creates both visual feedback triggers and URL update triggers
 * at strategic positions in a section
 */
const SectionTriggers = ({ sectionId }) => {
  return (
    <>
      {/* Top trigger - for visual feedback only */}
      <div 
        id={`${sectionId}-top-trigger`}
        className="section-trigger section-trigger-top"
        style={{
          height: '20px',
          position: 'absolute',
          top: '2%',
          left: '0',
          right: '0',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
        data-section={sectionId}
        data-trigger="top"
      />
      
      {/* Bottom trigger - for visual feedback only */}
      <div 
        id={`${sectionId}-bottom-trigger`}
        className="section-trigger section-trigger-bottom"
        style={{
          height: '20px',
          position: 'absolute',
          bottom: '2%',
          left: '0',
          right: '0',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
        data-section={sectionId}
        data-trigger="bottom"
      />
      
      {/* URL trigger for entering section - positioned at 25% down from top */}
      <div 
        id={`${sectionId}-url-entry-trigger`}
        className="section-url-trigger section-url-trigger-entry"
        style={{
          position: 'absolute',
          top: '25%',
          left: '0',
          right: '0',
          height: '15px',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
        data-section={sectionId}
        data-trigger="url-entry"
      />
      
      {/* URL trigger for exiting section - positioned at 25% up from bottom */}
      <div 
        id={`${sectionId}-url-exit-trigger`}
        className="section-url-trigger section-url-trigger-exit"
        style={{
          position: 'absolute',
          bottom: '25%',
          left: '0',
          right: '0',
          height: '15px',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
        data-section={sectionId}
        data-trigger="url-exit"
      />
    </>
  );
};

export default SectionTriggers;