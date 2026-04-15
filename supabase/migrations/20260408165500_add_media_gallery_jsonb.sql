ALTER TABLE products ADD COLUMN media_gallery JSONB DEFAULT '[]'::jsonb;

UPDATE products SET media_gallery = jsonb_build_array(jsonb_build_object('url', gif_url, 'type', CASE WHEN gif_url LIKE '%.mp4' THEN 'video' ELSE 'image' END, 'order', 1, 'focal_x', COALESCE(focal_x, 50), 'focal_y', COALESCE(focal_y, 50), 'zoom_level', COALESCE(zoom_level, 1))) WHERE gif_url IS NOT NULL;

ALTER TABLE products DROP COLUMN IF EXISTS gif_url CASCADE;
ALTER TABLE products DROP COLUMN IF EXISTS focal_x CASCADE;
ALTER TABLE products DROP COLUMN IF EXISTS focal_y CASCADE;
ALTER TABLE products DROP COLUMN IF EXISTS zoom_level CASCADE;
ALTER TABLE products DROP COLUMN IF EXISTS media_urls CASCADE;