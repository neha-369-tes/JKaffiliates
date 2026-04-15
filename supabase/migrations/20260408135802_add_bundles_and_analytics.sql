ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS accessories UUID[] DEFAULT '{}'::uuid[];

ALTER TABLE public.analytics
ADD COLUMN IF NOT EXISTS source TEXT;

-- We need to drop the old check constraint on analytics event_type
ALTER TABLE public.analytics DROP CONSTRAINT IF EXISTS analytics_event_type_check;

ALTER TABLE public.analytics ADD CONSTRAINT analytics_event_type_check CHECK (event_type IN ('page_view', 'buy_click', 'bundle_view'));
