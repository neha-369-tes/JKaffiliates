ALTER TABLE products
ADD COLUMN is_main_look BOOLEAN DEFAULT FALSE,
ADD COLUMN focal_x NUMERIC DEFAULT 50,
ADD COLUMN focal_y NUMERIC DEFAULT 50,
ADD COLUMN zoom_level NUMERIC DEFAULT 1;

CREATE TABLE IF NOT EXISTS product_bundles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    main_product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    accessory_product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(main_product_id, accessory_product_id)
);

ALTER TABLE product_bundles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view product bundles" ON product_bundles FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage product bundles" ON product_bundles FOR ALL TO authenticated USING (auth.uid() IS NOT NULL AND auth.jwt() ->> 'user_role' = 'admin');

-- Optional: Migrate existing accessories array data to product_bundles if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='accessories') THEN
        INSERT INTO product_bundles (main_product_id, accessory_product_id)
        SELECT id, unnest(accessories)
        FROM products
        WHERE accessories IS NOT NULL
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
