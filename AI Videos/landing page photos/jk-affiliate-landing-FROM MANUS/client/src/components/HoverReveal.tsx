import { useRef, useState } from 'react';

interface HoverRevealProps {
  children: React.ReactNode;
  revealContent: React.ReactNode;
  revealRadius?: number; // Radius in pixels for hover detection
  className?: string;
}

/**
 * Hover Reveal Component
 * 
 * Design: Interactive Luxury Fashion
 * - Detects mouse position within a radius
 * - Reveals hidden content on hover
 * - Smooth fade-in/out transitions
 * - Used for interactive text reveal on hero images
 */
export const HoverReveal = ({
  children,
  revealContent,
  revealRadius = 100,
  className = '',
}: HoverRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // Calculate distance from center of container
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const distance = Math.hypot(x - centerX, y - centerY);

    setIsHovering(distance < revealRadius);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative hover-reveal-container ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Content */}
      <div className="relative z-10">{children}</div>

      {/* Revealed Content */}
      <div
        className="absolute inset-0 flex items-center justify-center hover-reveal-content"
        style={{
          opacity: isHovering ? 1 : 0,
          pointerEvents: isHovering ? 'auto' : 'none',
        }}
      >
        {revealContent}
      </div>
    </div>
  );
};

export default HoverReveal;
