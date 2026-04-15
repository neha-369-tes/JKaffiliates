import { useInView } from '@/hooks/useInView';
import { motion } from 'framer-motion';

interface ScrollRevealTextProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  variant?: 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight';
}

/**
 * Scroll Reveal Text Component
 * 
 * Design: Luxury Fashion Editorial
 * - Reusable component for scroll-triggered animations
 * - Intersection Observer for performance
 * - Configurable fade-in and slide animations
 * - Supports staggered animations for multiple elements
 */
export const ScrollRevealText = ({
  children,
  delay = 0,
  duration = 0.8,
  className = '',
  variant = 'slideUp',
}: ScrollRevealTextProps) => {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  const variants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    slideUp: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 },
    },
    slideDown: {
      hidden: { opacity: 0, y: -50 },
      visible: { opacity: 1, y: 0 },
    },
    slideLeft: {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 },
    },
    slideRight: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants[variant]}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollRevealText;
