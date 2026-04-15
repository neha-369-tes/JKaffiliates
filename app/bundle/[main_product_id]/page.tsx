import { createClient } from '@/lib/supabase-server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BundlePage({ params }: { params: { main_product_id: string } }) {
  const supabase = await createClient();
  const { main_product_id } = await params;

  // Fetch the main product
  const { data: mainProduct, error: mainError } = await supabase
    .from('products')
    .select('*')
    .eq('id', main_product_id)
    .single();

  if (mainError || !mainProduct) {
    return notFound();
  }

  // Fetch accessories using the product_bundles junction table
  const { data: bundles } = await supabase
    .from('product_bundles')
    .select('accessory_product_id')
    .eq('main_product_id', main_product_id);

  let accessories: any[] = [];
  if (bundles && bundles.length > 0) {
    const accessoryIds = bundles.map((b: any) => b.accessory_product_id);
    const { data: accessoriesData } = await supabase
      .from('products')
      .select('*')
      .in('id', accessoryIds);
      
    if (accessoriesData) {
        // preserve order or not? just use whatever comes back
        accessories = accessoriesData;
    }
  }

  // Determine primary media from the gallery
  const primaryMedia = (mainProduct.media_gallery && mainProduct.media_gallery.length > 0) 
    ? mainProduct.media_gallery.sort((a: any, b: any) => a.order - b.order)[0] 
    : null;

  // Safe defaults for focal points and zoom
  const focalX = primaryMedia?.focal_x ?? 50;
  const focalY = primaryMedia?.focal_y ?? 50;
  const zoomLevel = primaryMedia?.zoom_level ?? 1;

  const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });
  const currentDate = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="w-full md:w-[45%] lg:w-[40%] h-[auto] md:h-screen sticky top-0 bg-white overflow-y-auto hidden-scrollbar border-r border-gray-200 shadow-sm flex flex-col">
          <Link href="/" className="absolute top-6 left-6 z-50 bg-white/90 px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:bg-white transition-colors">
            &larr; Back to Store
          </Link>
          
          <div className="relative w-full h-[60vh] md:h-[65vh] bg-black overflow-hidden shrink-0">
            {primaryMedia ? (
              primaryMedia.type === 'video' || primaryMedia.url.endsWith('.mp4') ? (
                <video 
                  src={primaryMedia.url} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-contain"
                  style={{
                    objectPosition: `${focalX}% ${focalY}%`,
                    transform: `scale(${zoomLevel})`
                  }}
                />
              ) : (
                <Image 
                  src={primaryMedia.url} 
                  alt={mainProduct.name} 
                  fill
                  className="w-full h-full object-contain"
                  style={{
                    objectPosition: `${focalX}% ${focalY}%`,
                    transform: `scale(${zoomLevel})`
                  }}
                />
              )
            ) : (
              <div className="text-gray-400 w-full h-full flex items-center justify-center">No media available</div>
            )}
          </div>

          <div className="p-8 flex flex-col flex-grow justify-start">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight tracking-tight">
                {mainProduct.name}
              </h1>
              <p className="text-2xl font-semibold text-gray-800 mb-6">
                {formatter.format(mainProduct.price)}
              </p>
              {mainProduct.description && (
                  <p className="text-gray-600 mb-8 leading-relaxed whitespace-pre-wrap">
                      {mainProduct.description}
                  </p>
              )}
              <div className="mt-auto pt-6 border-t border-gray-100">
                  <a 
                      href={mainProduct.amazon_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 px-6 rounded-xl transition duration-200 shadow-md mb-2"
                  >
                      Buy the Main Look on Amazon
                  </a>
                  <p className="text-[10px] text-gray-400 text-center leading-tight">
                    Price as of {currentDate}. Prices and availability are subject to change.
                  </p>
              </div>
          </div>
        </div>

        <div className="w-full md:w-[55%] lg:w-[60%] p-6 md:p-10 lg:p-14 overflow-y-auto bg-gray-50 flex-1">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10 pb-6 border-b border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop The Look</h2>
                <p className="text-gray-500 text-lg">Complete the aesthetics with these hand-picked matching items.</p>
            </div>

            <div className="space-y-6">
              {accessories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                  {accessories.map((item) => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-gray-500 italic text-lg">No accessories found for this look.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Affiliate Disclosure */}
      <div className="bg-gray-900 text-gray-400 py-4 border-t border-gray-800 text-center text-sm px-4 shrink-0 shadow-inner z-[60] relative">
        <p>As an Amazon Associate I earn from qualifying purchases.</p>
        <p className="mt-1">Content and prices are dynamic. Verify upon clicking the final link.</p>
      </div>
    </div>
  );
}
