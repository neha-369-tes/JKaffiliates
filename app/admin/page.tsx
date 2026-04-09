import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import { createClient } from '@/lib/supabase-server';

export default async function AdminDashboard() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/admin/login');
  }

  // Fetch metrics and product list
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  const { data: analyticsArray } = await supabase.from('analytics').select('*');
  const { data: categoriesArray } = await supabase.from('categories').select('*').order('created_at', { ascending: true });

  // Compute metrics from analytics
  let totalViews = 0;
  let totalClicks = 0;
  analyticsArray?.forEach(a => {
    if (a.event_type === 'page_view') totalViews++;
    if (a.event_type === 'buy_click') totalClicks++;
  });
  
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <form action="/auth/signout" method="post">
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Logout</button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <h3 className="text-gray-500 font-medium">Total Views</h3>
          <p className="text-3xl font-bold">{totalViews}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <h3 className="text-gray-500 font-medium">Total Clicks</h3>
          <p className="text-3xl font-bold">{totalClicks}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <h3 className="text-gray-500 font-medium">Average CTR</h3>
          <p className="text-3xl font-bold">{ctr}%</p>
        </div>
      </div>

      <DashboardClient 
        initialProducts={products || []} 
        initialCategories={(categoriesArray || []).map(c => c.name)}
      />
    </div>
  );
}
