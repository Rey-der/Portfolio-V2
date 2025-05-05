import { useLocation, useNavigate } from 'react-router-dom';
import { useScroll } from '../../../context/ScrollContext';

const useHeaderNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeSection, scrollToSection, setActiveSection } = useScroll();

  /**
   * Fast, direct scroll with element.scrollIntoView that respects CSS scroll margins
   */
  const scrollToElementWithOffset = (sectionId) => {
    // Immediately try to find the element - no delay
    const element = 
      document.getElementById(sectionId) || 
      document.querySelector(`[data-section="${sectionId}"]`);
    
    if (element) {
      // Use scrollIntoView which respects CSS scroll-margin-top
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
      
      // Set active section immediately
      setActiveSection(sectionId);
    } else {
      // Fallback to context's scrollToSection for reliability
      scrollToSection(sectionId);
    }
  };

  /**
   * Streamlined navigation handler with faster response
   */
  const handleNavigation = (sectionId, path) => {
    // Remove focus from clicked element immediately
    document.activeElement.blur();
    
    // Special case for contact page
    if (sectionId === 'contact') {
      navigate('/contact');
      return;
    }

    // Special case for legal page
    if (sectionId === 'legal') {
      navigate('/legal');
      return;
    }
    
    // Case 1: Navigating to a different page route
    if (path && path !== '/' && path !== location.pathname) {
      // First navigate to the page
      navigate(path);
      
      // Use requestAnimationFrame for smoother performance
      requestAnimationFrame(() => {
        // Use a small delay to allow DOM updates
        setTimeout(() => {
          scrollToElementWithOffset(sectionId);
        }, 150);
      });
      return;
    }
    
    // Case 2: Coming from contact or legal page
    if (location.pathname === '/contact' || location.pathname === '/legal') {
      navigate('/');
      
      // Use requestAnimationFrame for smoother performance
      requestAnimationFrame(() => {
        setTimeout(() => {
          scrollToElementWithOffset(sectionId);
        }, 150);
      });
      return;
    }

    // Case 3: Same page navigation - immediate scroll
    scrollToElementWithOffset(sectionId);
  };

  /**
   * Determines if a navigation link should be shown as active
   * FIXED: Using !text-primary to ensure it overrides any other text color classes 
   */
  const isActive = (sectionId) => {
    // Special case for contact page
    if (sectionId === 'contact' && location.pathname === '/contact') {
      return '!text-primary font-medium'; // Added ! to ensure priority
    }
    
    // Special case for legal page
    if (sectionId === 'legal' && location.pathname === '/legal') {
      return '!text-primary font-medium'; // Added ! to ensure priority
    }
    
    // For dedicated section pages
    if (location.pathname.includes(sectionId) && sectionId !== 'home') {
      return '!text-primary font-medium'; // Added ! to ensure priority
    }
    
    // For sections on the home page
    if (location.pathname === '/' && sectionId !== 'contact' && sectionId !== 'legal') {
      if (activeSection === sectionId) {
        return '!text-primary font-medium'; // Added ! to ensure priority
      }
    }
    
    return '';
  };

  return { handleNavigation, isActive };
};

export default useHeaderNavigation;