import { createClient } from '@supabase/supabase-js'
import ProductCard from '@/components/ProductCard'
import StoreFilters from '@/components/StoreFilters'
import { Suspense } from 'react'

// Force dynamic fetch (prevent static HTML caching issues)
export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || 'all';
  const searchTerm = resolvedParams.search || '';
  const maxPrice = resolvedParams.maxPrice ? parseInt(resolvedParams.maxPrice) : 10000;
  const gender = resolvedParams.gender || '';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  let query = supabase.from('products').select('*').eq('is_active', true);
  
  if (currentCategory !== 'all') {
    if (currentCategory === 'accessories') {
      query = query.in('category', ['Accessories', 'accessories', 'Jewelry', 'jewelry', 'jwellary', 'Bangles', 'bangles', 'Necklaces', 'necklaces', 'Earrings', 'earrings']);
    } else if (currentCategory === 'dresses') {
      query = query.in('category', ['Fashion', 'fashion', 'Dresses', 'dresses']);
    } else if (currentCategory === 'bags') {
      query = query.ilike('category', '%bags%');
    } else {
      query = query.ilike('category', currentCategory);
    }
  }

  if (currentCategory === 'dresses' && gender) {
     if (gender === 'women') {
        query = query.or('name.ilike.%women%,name.ilike.%girl%,name.ilike.%ladies%');
     } else if (gender === 'men') {
        query = query.or('name.ilike.%men%,name.ilike.%boy%,name.ilike.%gents%').not('name', 'ilike', '%women%');
     }
  }

  if (searchTerm) {
    query = query.or(`name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
  }
  
  if (maxPrice < 10000) {
    query = query.lte('price', maxPrice);
  }

  const { data: products, error } = await query;

  const { data: navbarConfig } = await supabase.from('navbar').select('*').order('order', { ascending: true });
  const { data: categoriesData } = await supabase.from('categories').select('*').order('created_at', { ascending: true });

  const normalizeId = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

  const defaultCategories = [
    { id: 'all', name: 'All' },
    { id: 'dresses', name: 'Dresses' },
    { id: 'bags', name: 'Bags' },
    { id: 'accessories', name: 'Accessories' }
  ];

  const navbarCategories = navbarConfig && navbarConfig.length > 0
    ? navbarConfig.filter(item => item.visible).map(item => ({ id: normalizeId(item.name), name: item.name }))
    : [];

  const extraCategories = (categoriesData || [])
    .map(item => ({ id: normalizeId(item.name), name: item.name }))
    .filter(item => !navbarCategories.some(nav => nav.id === item.id));

  const categories = navbarCategories.length > 0
    ? [...navbarCategories, ...extraCategories]
    : defaultCategories;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col pt-12">
      {/* Header Tabs */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-8 overflow-x-auto pb-4 pt-4 hide-scroll-bar">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/?category=${cat.id}`}
              className={`whitespace-nowrap pb-2 font-medium text-sm transition-colors border-b-2
                ${
                  currentCategory === cat.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {cat.name}
            </a>
          ))}
        </div>
      </nav>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {currentCategory === 'dresses' && (
          <div className="flex items-center space-x-3 mb-8 border-b border-gray-200 pb-6 w-full overflow-x-auto hide-scroll-bar">
            <span className="text-gray-500 font-medium mr-2">Filter by:</span>
            <a
              href="/?category=dresses"
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${!gender ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              All Dresses
            </a>
            <a
              href="/?category=dresses&gender=women"
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${gender === 'women' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              Women's
            </a>
            <a
              href="/?category=dresses&gender=men"
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${gender === 'men' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              Men's
            </a>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Editor's Picks</h1>
          <p className="text-gray-500 text-lg">Curated and hand-picked affordable finds from Amazon.</p>
        </div>

        <Suspense fallback={<div className="h-24 bg-gray-100 animate-pulse rounded-2xl mb-8"></div>}>
          <StoreFilters />
        </Suspense>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {(!products || products.length === 0) && (
            <div className="col-span-full py-12 text-center text-gray-500">
              No products found in this category.
            </div>
          )}
        </div>
      </div>

      {/* Persistent Affiliate Disclosure */}
      <footer className="mt-auto bg-gray-900 text-gray-400 py-6 border-t border-gray-800 text-center text-sm px-4 shadow-inner">
        <p>As an Amazon Associate I earn from qualifying purchases.</p>
        <p className="mt-1">Content and prices are dynamic. Verify upon clicking the final link.</p>
      </footer>
    </main>
  );
}
