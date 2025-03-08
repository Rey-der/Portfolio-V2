import { useRef, useState, useEffect } from 'react';

const useIntersectionObserver = (options = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      setEntry(entry);
      
      if (entry.isIntersecting && options.triggerOnce) {
        observer.unobserve(entry.target);
      }
    }, {
      root: options.root || null,
      rootMargin: options.rootMargin || '0px',
      threshold: options.threshold || 0
    });

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options.root, options.rootMargin, options.threshold, options.triggerOnce]);

  return [ref, inView, entry];
};

export default useIntersectionObserver;