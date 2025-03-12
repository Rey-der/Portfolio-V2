import { useRef, useState, useEffect, useCallback, useMemo } from 'react';

const useIntersectionObserver = (options = {}) => {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    triggerOnce = false,
    onIntersect,
  } = options;

  const [inView, setInView] = useState(false);
  const [entry, setEntry] = useState(null);
  const [intersectionRatio, setIntersectionRatio] = useState(0);
  
  const ref = useRef(null);
  const observerRef = useRef(null);
  const callbackRef = useRef(onIntersect);

  // Update callback ref when onIntersect changes
  useEffect(() => {
    callbackRef.current = onIntersect;
  }, [onIntersect]);

  const observerOptions = useMemo(() => ({
    root,
    rootMargin,
    threshold,
  }), [root, rootMargin, threshold]);

  const createObserver = useCallback(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      const currentEntry = entries[0];
      if (!currentEntry) return;

      setInView(currentEntry.isIntersecting);
      setEntry(currentEntry);
      setIntersectionRatio(currentEntry.intersectionRatio);

      if (callbackRef.current && typeof callbackRef.current === 'function') {
        callbackRef.current(currentEntry);
      }
      
      if (triggerOnce && currentEntry.isIntersecting && observerRef.current) {
        observerRef.current.unobserve(currentEntry.target);
      }
    }, observerOptions);
  }, [observerOptions, triggerOnce]);

  // Create observer and observe the current element.
  useEffect(() => {
    createObserver();
    const currentElement = ref.current;
    if (currentElement && observerRef.current) {
      observerRef.current.observe(currentElement);
    }
    return () => {
      if (currentElement && observerRef.current) {
        observerRef.current.unobserve(currentElement);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [createObserver]);

  // Provide a ref updater to allow dynamic element ref changes.
  const updateRef = useCallback((node) => {
    if (ref.current && observerRef.current) {
      observerRef.current.unobserve(ref.current);
    }
    ref.current = node;
    if (node && observerRef.current) {
      observerRef.current.observe(node);
    }
  }, []);

  return [ref, inView, entry, intersectionRatio, updateRef];
};

export default useIntersectionObserver;