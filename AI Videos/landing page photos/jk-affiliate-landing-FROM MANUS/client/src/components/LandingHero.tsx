import { useEffect, useState } from 'react';
import { useScrollPosition, useParallax } from '@/hooks/useScrollReveal';
import { CategorySelector } from './CategorySelector';

interface LandingHeroProps {
  onCategoryChange?: (category: 'women' | 'men') => void;
}

/**
 * Landing Hero Component
 * 
 * Design Philosophy: Luxury Fashion Editorial
 * - Full-screen hero with background image
 * - Scroll-triggered text reveal with increasing opacity
 * - Parallax background effect
 * - Category selector appears after first scroll
 * - Interactive hover zones for text reveal
 */
export const LandingHero = ({ onCategoryChange }: LandingHeroProps) => {
  const [activeCategory, setActiveCategory] = useState<'women' | 'men'>('women');
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [textOpacity, setTextOpacity] = useState(0);
  const scrollPosition = useScrollPosition();
  const parallaxOffset = useParallax(0.6);

  // Women's hero image (CDN URL)
  const heroImages = {
    women: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663535340334/KbWcMv68XNvZ3ambUstXuw/10_df348976.svg',
    men: 'https://via.placeholder.com/1920x1080/6d28d9/ffffff?text=Men+Collection', // Placeholder for men's image - to be added later
  };

  useEffect(() => {
    // Calculate text opacity based on scroll position
    // Text starts appearing after scrolling ~80px and fully visible at ~300px
    const opacityStart = 80;
    const opacityEnd = 300;
    const opacity = Math.max(0, Math.min(1, (scrollPosition - opacityStart) / (opacityEnd - opacityStart)));
    setTextOpacity(opacity);

    // Show category selector after first scroll (80px)
    setShowCategorySelector(scrollPosition > 80);
  }, [scrollPosition]);

  const handleCategoryChange = (category: 'women' | 'men') => {
    setActiveCategory(category);
    setTextOpacity(0); // Reset text opacity when category changes
    onCategoryChange?.(category);
  };

  return (
    <div className="relative w-full">
      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden bg-white">
        {/* Background Image with Parallax */}
        <div
          className="absolute inset-0 bg-cover bg-center parallax-bg"
          style={{
            backgroundImage: `url(${heroImages[activeCategory]})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            transform: `translateY(${parallaxOffset}px)`,
            transition: 'background-image 0.8s ease-in-out',
            willChange: 'transform',
          }}
        />

        {/* Gradient Overlay - Purple to transparent */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-purple-600/10 to-white/40" />

        {/* Logo - Fixed at top left */}
        <div className="absolute top-6 left-6 z-40">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">JK</span>
            </div>
            <span className="text-foreground font-semibold text-sm hidden sm:inline">JK Affiliate Store</span>
          </div>
        </div>

        {/* Main Display Text - Scroll Reveal */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            opacity: textOpacity,
            transition: 'opacity 0.3s ease-out',
            willChange: 'opacity',
          }}
        >
          <div className="text-center px-4">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-2xl font-serif">
              {activeCategory === 'women' ? 'WOMEN' : 'MEN'}
            </h1>
            <p className="text-white text-lg md:text-xl mt-6 font-light tracking-wide">
              {activeCategory === 'women' ? 'Curated Fashion Collection' : 'Premium Selection'}
            </p>
          </div>
        </div>

        {/* Category Selector - Appears after scroll */}
        {showCategorySelector && (
          <CategorySelector
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        )}

        {/* Scroll Indicator - Only show if text is not visible */}
        {textOpacity < 0.5 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
            <svg
              className="w-6 h-6 text-white drop-shadow-lg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        )}
      </section>
    </div>
  );
};

export default LandingHero;
