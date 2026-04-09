ALTER TABLE products
ADD COLUMN media_urls TEXT[] DEFAULT '{}';

-- Migrate any existing single gif_url into the new array
UPDATE products 
SET media_urls = ARRAY[gif_url]
WHERE gif_url IS NOT NULL AND gif_url != '' AND array_length(media_urls, 1) IS NULL;
