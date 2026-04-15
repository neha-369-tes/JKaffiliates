import { useEffect, useState } from 'react';

/**
 * Hook to track scroll position and calculate progress
 * Returns scroll progress as a value between 0 and 1
 */
export const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      // Calculate scroll progress (0 to 1)
      const progress = scrollTop / (documentHeight - windowHeight);
      setScrollProgress(Math.min(progress, 1));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollProgress;
};

/**
 * Hook to get scroll position in pixels
 */
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
};

/**
 * Hook to calculate parallax offset based on scroll position
 * @param speed - Parallax speed multiplier (0.5 = half speed)
 */
export const useParallax = (speed = 0.5) => {
  const scrollPosition = useScrollPosition();
  return scrollPosition * speed;
};
