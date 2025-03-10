import { useRef, useState, useEffect, useCallback } from 'react';

const useIntersectionObserver = (options = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [entry, setEntry] = useState(null);
  const [intersectionRatio, setIntersectionRatio] = useState(0);
  const callbackRef = useRef(options.onIntersect);

  // Update callback ref when onIntersect changes
  useEffect(() => {
    callbackRef.current = options.onIntersect;
  }, [options.onIntersect]);

  // Setup intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      setEntry(entry);
      setIntersectionRatio(entry.intersectionRatio);
      
      if (callbackRef.current && typeof callbackRef.current === 'function') {
        callbackRef.current(entry);
      }
      
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

  const updateRef = useCallback((node) => {
    if (ref.current) {
      observer.unobserve(ref.current);
    }
    
    ref.current = node;
    
    if (node) {
      observer.observe(node);
    }
  }, []);

  return [ref, inView, entry, intersectionRatio, updateRef];
};

export default useIntersectionObserver;