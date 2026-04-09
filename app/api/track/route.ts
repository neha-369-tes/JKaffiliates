import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { productId, eventType, source } = await req.json();

    if (!productId || !eventType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get country from Vercel Edge Headers
    const country = req.headers.get('x-vercel-ip-country') || 'Unknown';
    const userAgent = req.headers.get('user-agent') || 'Unknown';

    const { error } = await supabase.from('analytics').insert([
      {
        product_id: productId,
        event_type: eventType,
        country: country,
        user_agent: userAgent,
        source: source || null,
      },
    ]);

    if (error) {
      console.error('Analytics insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
