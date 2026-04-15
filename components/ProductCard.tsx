'use client';

import Image from 'next/image';
import { Star, ShieldCheck, Check, Info, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  short_title?: string | null;
  description: string;
  price: number;
  price_anchor: number | null;
  category: string;
  amazon_link: string;
  badge: string | null;
  rating?: number;
  reviews_count?: string;
  view_count?: number;
  accessories?: string[];
  is_main_look?: boolean;
  media_gallery?: { url: string; type: string; order: number; focal_x?: number; focal_y?: number; zoom_level?: number }[];
}

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

  // Timestamp for pricing disclaimer
  const [currentDate, setCurrentDate] = useState('');
  useEffect(() => {
    setCurrentDate(new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }));
  }, []);

  // Impression tracking logic
  const [hasTrackedView, setHasTrackedView] = useState(false);
  useEffect(() => {
    if (!cardRef.current || hasTrackedView) return;

    const currentRef = cardRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Track view
          fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: product.id, eventType: 'page_view' }),
          }).catch(console.error);
          
          setHasTrackedView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 } // 50% of the card must be visible to count as a view
    );

    observer.observe(currentRef);

    return () => observer.disconnect();
  }, [hasTrackedView, product.id]);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    if (isHovered) {
      videoRefs.current.forEach(v => {
        if (v) v.play().catch(() => {});
      });
    } else {
      videoRefs.current.forEach(v => {
        if (v) v.pause();
      });
    }
  }, [isHovered]);

  const handleBuyClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Track click before redirecting
    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, eventType: 'buy_click' }),
      });
    } catch (err) {
      console.error(err);
    }
    window.open(product.amazon_link, '_blank');
  };

  const hasBundle = product.accessories && product.accessories.length > 0;
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0));
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`group relative flex flex-col h-full cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] origin-center
          ${hasBundle && (isTouchDevice ? isRevealed : isHovered) ? 'mt-[24px] sm:mt-[32px]' : 'mt-0'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); if (isTouchDevice) setIsRevealed(false); }}
        onClick={() => {
          if (hasBundle && isTouchDevice && !isRevealed) {
             setIsRevealed(true);
          } else if (hasBundle) {
             window.location.href = `/bundle/${product.id}`;
          } else {
             window.open(product.amazon_link, '_blank');
          }
        }}
      >
        {/* Bundle Reveal Glass Card Peeking from Top */}
        {hasBundle && (
          <div 
            role="button"
            tabIndex={0}
            className={`absolute inset-0 z-0 flex flex-col items-center justify-start p-1 text-gray-900 
              bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_-4px_15px_rgba(0,0,0,0.08)] rounded-2xl cursor-pointer 
              origin-bottom transition-all duration-[600ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
              ${isTouchDevice 
                ? (isRevealed ? 'translate-y-[-24px] sm:translate-y-[-32px] opacity-100 animate-[floatYSubtle_2.5s_ease-in-out_infinite]' : 'translate-y-0 opacity-0 pointer-events-none') 
                : 'opacity-0 group-hover:opacity-100 group-hover:translate-y-[-24px] sm:group-hover:translate-y-[-32px] group-hover:animate-[floatYSubtle_2.5s_ease-in-out_infinite]'}`}
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/bundle/${product.id}`;
            }}
            title="Shop the Complete Look"
          >
            <style jsx>{`
              @keyframes floatYSubtle {
                0%, 100% { transform: translateY(-32px); }
                50% { transform: translateY(-36px); }
              }
              @media (max-width: 639px) {
                @keyframes floatYSubtle {
                  0%, 100% { transform: translateY(-24px); }
                  50% { transform: translateY(-28px); }
                }
              }
            `}</style>
            
            <div className="absolute top-0 left-0 right-0 h-6 sm:h-8 flex flex-row justify-center items-center gap-1.5 cursor-pointer pt-1">
               <ShoppingBag size={14} className="text-gray-900 drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]" />
               <span className="font-black text-[10px] sm:text-[11px] uppercase tracking-[0.1em] text-gray-900 drop-shadow-sm leading-none whitespace-nowrap">
                 Complete Outfit
               </span>
            </div>
          </div>
        )}
      <div className="bg-white h-full relative z-10 flex flex-col rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 overflow-hidden border border-gray-100">
        
        {/* Media section */}
        <div 
          className="relative aspect-[4/5] overflow-hidden bg-gray-50 flex items-center justify-center group-media rounded-t-2xl"
        >

          {product.badge && (
            <div className={`absolute top-2 left-2 z-10 ${hasBundle ? 'max-w-[70%]' : 'max-w-[90%]'}`}>
            <span className="bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded shadow-md uppercase tracking-wide inline-block w-full truncate">
              {product.badge}
            </span>
          </div>
        )}
        
        {/* Placeholder or actual media handling */}
        <div 
          className="flex overflow-x-auto snap-x snap-mandatory hide-scroll-bar w-full h-full"
          onScroll={(e) => {
            if (!scrollContainerRef.current) return;
            const scrollLeft = e.currentTarget.scrollLeft;
            const width = e.currentTarget.clientWidth;
            const newIndex = Math.round(scrollLeft / width);
            if (newIndex !== activeMediaIndex) setActiveMediaIndex(newIndex);
          }}
          ref={scrollContainerRef}
        >
          {(product.media_gallery?.length ? product.media_gallery.sort((a, b) => a.order - b.order) : []).map((media, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 snap-center relative overflow-hidden bg-gray-50 flex items-center justify-center">
              {media.type === 'video' || media.url.endsWith('.mp4') ? (
                <video 
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  src={media.url} 
                  loop 
                  muted 
                  playsInline
                  className="object-contain w-full h-full"
                  style={{
                    objectPosition: `${media.focal_x ?? 50}% ${media.focal_y ?? 50}%`,
                    transform: `scale(${media.zoom_level ?? 1})`
                  }}
                />
              ) : (
                <Image 
                  src={media.url} 
                  alt={`${product.name} - media ${index + 1}`}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  style={{
                    objectPosition: `${media.focal_x ?? 50}% ${media.focal_y ?? 50}%`,
                    transform: `scale(${media.zoom_level ?? 1})`
                  }}
                />
              )}
            </div>
          ))}
          {(!product.media_gallery?.length) && (
            <div className="min-w-full flex-shrink-0 snap-center relative flex items-center justify-center bg-gray-50">
               <div className="text-gray-400">No media available</div>
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        {((product.media_gallery?.length ?? 0) > 1) && (
          <>
            <button 
              disabled={activeMediaIndex === 0} 
              onClick={(e) => { 
                e.stopPropagation(); 
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollBy({ left: -scrollContainerRef.current.clientWidth, behavior: 'smooth' });
                }
              }} 
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              disabled={activeMediaIndex === (product.media_gallery?.length ?? 1) - 1} 
              onClick={(e) => { 
                e.stopPropagation(); 
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollBy({ left: scrollContainerRef.current.clientWidth, behavior: 'smooth' });
                }
              }} 
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Media Pagination Dots */}
        {((product.media_gallery?.length ?? 0) > 1) && (
          <div className="absolute bottom-3 left-0 w-full flex justify-center gap-1.5 z-20">
            {product.media_gallery!.map((_, index) => (
              <span 
                key={index}
                className={`transition-all duration-300 rounded-full bg-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] ${index === activeMediaIndex ? 'w-4 h-1.5 opacity-100' : 'w-1.5 h-1.5 opacity-60'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="p-5 flex flex-col flex-grow bg-white">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="font-semibold text-lg text-gray-900 truncate" title={product.name}>
            {product.short_title || product.name}
          </h3>
          {product.price_anchor && product.price_anchor > product.price && (
            <span className="text-xs font-bold text-white bg-red-600 px-2 py-1 rounded-full uppercase tracking-wide">
              {Math.round(((product.price_anchor - product.price) / product.price_anchor) * 100)}% Off
            </span>
          )}
        </div>
        
        {/* "Why Buy This" conversion line */}
        {product.description && (
          <p className="text-xs text-gray-600 italic mb-2 line-clamp-1 border-l-2 border-indigo-200 pl-2">
            "{product.description}"
          </p>
        )}
        
        <div className="flex items-center gap-1 mb-3 shrink-0">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${(product.rating || 4.8) > i ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
          ))}
          <span className="text-sm font-medium text-gray-600 ml-1">{(product.rating || 4.8).toFixed(1)}</span>
          <span className="text-xs text-gray-400">({product.reviews_count || '1.2k'} reviews)</span>
        </div>

        <div className="mb-4 flex-grow">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatter.format(product.price)}
            </span>
            {product.price_anchor && (
              <>
                <span className="text-sm text-gray-500 line-through">
                  {formatter.format(product.price_anchor)}
                </span>
                <span className="text-xs font-bold text-green-600 self-end mb-1">
                  Save {Math.round(((product.price_anchor - product.price) / product.price_anchor) * 100)}%
                </span>
              </>
            )}
          </div>
        </div>

        {/* Social Proof */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[11px] font-medium text-gray-500">
            {product.view_count || (Math.floor(Math.random() * 40) + 10)} people viewed this today
          </span>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleBuyClick}
          className="w-full bg-[#FF9900] hover:bg-[#FF8800] text-black font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 hover:animate-[pulse_1.5s_cubic-bezier(0.4,0,0.6,1)_infinite] flex items-center justify-center gap-2 mt-auto"
        >
          Buy Now on Amazon
        </button>

        {/* Price timestamp disclaimer */}
        <p className="text-[10px] text-gray-400 mt-2 text-center leading-tight">
          Price as of {currentDate}. Prices are subject to change.
        </p>
      </div>
    </div>
    </div>
  );
}
