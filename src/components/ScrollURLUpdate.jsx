import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useScroll } from '../context/ScrollContext';

const ScrollURLUpdate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeSection } = useScroll();

  useEffect(() => {
    let newPath = '/'; // Default to home
    if (activeSection && activeSection !== 'home') {
      newPath = `/${activeSection}`;
    }

    // Only update the URL if it's different from the current one
    if (location.pathname !== newPath) {
      navigate(newPath, { replace: true });
    }
  }, [activeSection, location.pathname, navigate]);

  return null;
};

export default ScrollURLUpdate;