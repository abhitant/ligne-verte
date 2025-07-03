-- Add enhanced tracking features to reports table
ALTER TABLE public.reports 
ADD COLUMN waste_type text CHECK (waste_type IN ('plastic_bottle', 'cigarette_butt', 'food_packaging', 'glass', 'metal_can', 'paper', 'organic', 'electronics', 'textile', 'other')),
ADD COLUMN brand text,
ADD COLUMN severity_level integer DEFAULT 1 CHECK (severity_level BETWEEN 1 AND 5),
ADD COLUMN is_cleaned boolean DEFAULT false,
ADD COLUMN cleanup_photo_url text,
ADD COLUMN points_awarded integer DEFAULT 0;