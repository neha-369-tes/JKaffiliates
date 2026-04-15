-- Database Schema for Affiliate Store

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: products
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    price_anchor NUMERIC,
    category TEXT,
    gif_url TEXT,
    amazon_link TEXT NOT NULL,
    badge TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: analytics
CREATE TABLE public.analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    event_type TEXT CHECK (event_type IN ('page_view', 'buy_click')),
    user_agent TEXT,
    country TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 1. Public can SELECT active products
CREATE POLICY "Public can view active products" ON public.products
    FOR SELECT USING (is_active = true);

-- 2. Authenticated users (admin) can do all
CREATE POLICY "Admins can manage products" ON public.products
    FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for analytics
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- 1. Anyone can insert analytics anonymously (or you can use secure server api keys)
CREATE POLICY "Public can insert analytics" ON public.analytics
    FOR INSERT WITH CHECK (true);

-- 2. Authenticated users (admin) can view analytics
CREATE POLICY "Admins can view analytics" ON public.analytics
    FOR SELECT USING (auth.role() = 'authenticated');

-- Storage Bucket for GIFs
insert into storage.buckets (id, name, public) values ('product-gifs', 'product-gifs', true) ON CONFLICT (id) DO NOTHING;
create policy "Admins can upload gifs" on storage.objects for insert to authenticated with check (bucket_id = 'product-gifs');
create policy "Public can view gifs" on storage.objects for select to public using (bucket_id = 'product-gifs');
