CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view categories" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON public.categories
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert initial categories
INSERT INTO public.categories (name) VALUES 
('Fashion'), 
('Artificial Jewelry'), 
('Bangles'), 
('Necklaces'), 
('Earrings')
ON CONFLICT (name) DO NOTHING;
