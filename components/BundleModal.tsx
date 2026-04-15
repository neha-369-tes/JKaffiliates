'use client';

import { useState, useEffect } from 'react';
import { X, Star, ExternalLink, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import Image from 'next/image';

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
  media_gallery?: { url: string; type: string; order: number; focal_x?: number; focal_y?: number; zoom_level?: number }[];
}

export default function BundleModal({ 
  mainProduct, 
  onClose 
}: { 
  mainProduct: Product, 
  onClose: () => void 
}) {
  const [accessories, setAccessories] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });
  const supabase = createClient();

  useEffect(() => {
    async function loadAccessories() {
      // Track bundle view when opening the modal
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId: mainProduct.id, 
          eventType: 'bundle_view',
          source: 'bundle_page_main'
        }),
      }).catch(console.error);

      if (mainProduct.accessories && mainProduct.accessories.length > 0) {
        const { data } = await supabase
          .from('products')
          .select('*')
          .in('id', mainProduct.accessories);
        if (data) {
          setAccessories(data);
        }
      }
      setLoading(false);
    }
    loadAccessories();
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mainProduct.id, mainProduct.accessories, supabase]);

  const handleBuyClick = async (productId: string, affiliateLink: string, source: string) => {
    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, eventType: 'buy_click', source }),
      });
    } catch (err) {
      console.error(err);
    }
    window.open(affiliateLink, '_blank');
  };

  const renderAccessoryItem = (product: Product) => {
    const primaryMedia = (product.media_gallery && product.media_gallery.length > 0)
      ? product.media_gallery.sort((a, b) => a.order - b.order)[0]
      : null;

    return (
      <div key={product.id} className="flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 items-center">
        {/* Image Column */}
        <div className="w-full md:w-1/3 aspect-square relative rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
          {product.badge && (
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow uppercase tracking-wide">
                {product.badge}
              </span>
            </div>
          )}
          {primaryMedia ? (
              primaryMedia.type === 'video' || primaryMedia.url.endsWith('.mp4') ? (
                <video src={primaryMedia.url} autoPlay loop muted playsInline className="object-contain w-full h-full" 
                  style={{
                    objectPosition: `${primaryMedia.focal_x ?? 50}% ${primaryMedia.focal_y ?? 50}%`,
                    transform: `scale(${primaryMedia.zoom_level ?? 1})`
                  }}
                />
              ) : (
                <Image src={primaryMedia.url} alt={product.name} fill className="object-contain" 
                  style={{
                    objectPosition: `${primaryMedia.focal_x ?? 50}% ${primaryMedia.focal_y ?? 50}%`,
                    transform: `scale(${primaryMedia.zoom_level ?? 1})`
                  }}
                />
              )
            ) : (
              <div className="text-gray-400">No media</div>
            )}
        </div>

        {/* Details Column */}
        <div className="w-full md:w-2/3 flex flex-col justify-between h-full">
          <div>
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">Perfect Accessory</span>
            
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
            
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${(product.rating || 4.8) > i ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              ))}
              <span className="text-sm font-medium text-gray-600 ml-2">{product.rating || 4.8} Stars</span>
              {product.reviews_count && <span className="text-sm text-gray-400">({product.reviews_count} reviews)</span>}
            </div>

            <div className="flex flex-wrap items-end gap-3 mb-4">
              <span className="text-3xl font-bold text-gray-900">{formatter.format(product.price)}</span>
              {product.price_anchor && (
                <>
                  <span className="text-lg text-gray-400 line-through mb-1">{formatter.format(product.price_anchor)}</span>
                  <span className="text-sm font-bold text-green-600 mb-1">
                    Save {Math.round(((product.price_anchor - product.price) / product.price_anchor) * 100)}%
                  </span>
                </>
              )}
            </div>

            {product.description && (
               <div className="bg-gray-50 rounded-lg p-4 mb-6">
                 <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Why buy this</span>
                 <p className="text-sm text-gray-700 leading-relaxed">✨ {product.description}</p>
               </div>
            )}
          </div>

          <button 
            onClick={() => handleBuyClick(product.id, product.amazon_link, 'bundle_page_accessory')}
            className="mt-auto w-full font-bold py-4 px-6 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white"
          >
            Buy This Accessory
            <ExternalLink size={18} />
          </button>
        </div>
      </div>
    );
  };

  const mainPrimaryMedia = (mainProduct.media_gallery && mainProduct.media_gallery.length > 0)
    ? mainProduct.media_gallery.sort((a, b) => a.order - b.order)[0]
    : null;

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col h-screen w-full overflow-hidden">
      {/* Header Bar */}
      <div className="flex justify-between items-center p-4 bg-white border-b border-gray-100 shadow-sm shrink-0">
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 text-gray-700 font-medium">
          <ArrowLeft size={20} /> Back to Store
        </button>
        <span className="text-sm text-gray-500 hidden sm:block">Shop the Complete Look</span>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X size={24} className="text-gray-500" />
        </button>
      </div>

      {/* Split Screen Layout */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        
        {/* LEFT SIDE: Sticky Main Product */}
        <div className="w-full lg:w-[45%] h-[50vh] lg:h-full overflow-y-auto hidden-scrollbar border-r border-gray-200 bg-white flex flex-col relative shrink-0">
          
          <div className="relative w-full h-[55vh] lg:h-[60vh] bg-black overflow-hidden shrink-0">
            {mainProduct.badge && (
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-red-600 text-white text-sm font-bold px-3 py-1.5 rounded shadow uppercase tracking-wide">
                  {mainProduct.badge}
                </span>
              </div>
            )}
            {mainPrimaryMedia ? (
              mainPrimaryMedia.type === 'video' || mainPrimaryMedia.url.endsWith('.mp4') ? (
                <video src={mainPrimaryMedia.url} autoPlay loop muted playsInline className="object-contain w-full h-full" 
                  style={{
                    objectPosition: `${mainPrimaryMedia.focal_x ?? 50}% ${mainPrimaryMedia.focal_y ?? 50}%`,
                    transform: `scale(${mainPrimaryMedia.zoom_level ?? 1})`
                  }}
                />
              ) : (
                <Image src={mainPrimaryMedia.url} alt={mainProduct.name} fill className="object-contain w-full h-full" 
                  style={{
                    objectPosition: `${mainPrimaryMedia.focal_x ?? 50}% ${mainPrimaryMedia.focal_y ?? 50}%`,
                    transform: `scale(${mainPrimaryMedia.zoom_level ?? 1})`
                  }}
                />
              )
            ) : (
              <div className="text-gray-400 w-full h-full flex items-center justify-center bg-gray-100">No media</div>
            )}
          </div>

          <div className="p-6 lg:p-10 flex flex-col flex-grow bg-white">
            <span className="inline-block self-start px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">The Main Look</span>
            
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
              {mainProduct.name}
            </h1>
            
            <div className="flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${(mainProduct.rating || 4.8) > i ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              ))}
              <span className="text-base font-medium text-gray-600 ml-2">{mainProduct.rating || 4.8} Stars</span>
              {mainProduct.reviews_count && <span className="text-base text-gray-400">({mainProduct.reviews_count} reviews)</span>}
            </div>

            <div className="flex flex-wrap items-end gap-4 mb-6 border-b border-gray-100 pb-6">
              <span className="text-4xl font-black text-gray-900">{formatter.format(mainProduct.price)}</span>
              {mainProduct.price_anchor && (
                <>
                  <span className="text-xl text-gray-400 line-through mb-1">{formatter.format(mainProduct.price_anchor)}</span>
                  <span className="text-base font-bold text-green-600 mb-1">
                    Save {Math.round(((mainProduct.price_anchor - mainProduct.price) / mainProduct.price_anchor) * 100)}%
                  </span>
                </>
              )}
            </div>

            {mainProduct.description && (
               <div className="mb-8">
                 <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">About this item</h4>
                 <p className="text-gray-700 leading-relaxed text-lg">{mainProduct.description}</p>
               </div>
            )}

            <div className="mt-auto pt-4">
              <button 
                onClick={() => handleBuyClick(mainProduct.id, mainProduct.amazon_link, 'bundle_page_main')}
                className="w-full font-bold py-5 px-6 rounded-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 text-black text-lg"
              >
                Buy the Main Look on Amazon
                <ExternalLink size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Scrolling Accessories */}
        <div className="w-full lg:w-[55%] h-auto lg:h-full overflow-y-auto bg-gray-50 p-6 lg:p-10">
          <div className="max-w-3xl mx-auto flex flex-col gap-6 pb-20">
            
            <div className="mb-8 border-b border-gray-200 pb-6">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Shop The Look</h2>
              <p className="text-lg text-gray-500">Complete the aesthetics with these hand-picked matching items.</p>
            </div>

            {/* Render Accessories */}
            {loading ? (
               <div className="text-center py-12 text-gray-400">Loading perfect accessories...</div>
            ) : accessories.length > 0 ? (
              <div className="flex flex-col gap-6">
                {accessories.map(acc => renderAccessoryItem(acc))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm mt-4">
                <p className="text-lg italic">No accessories linked to this look yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer Disclaimer */}
      <div className="bg-gray-900 text-gray-400 py-3 text-center text-xs shrink-0 px-4">
        As an Amazon Associate I earn from qualifying purchases. Prices are subject to change.
      </div>
    </div>
  );
}
