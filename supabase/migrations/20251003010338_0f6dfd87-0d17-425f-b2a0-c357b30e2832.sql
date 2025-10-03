-- Add waste_type and brand columns to pending_reports table
-- This allows storing complete AI analysis results

ALTER TABLE public.pending_reports
ADD COLUMN IF NOT EXISTS waste_type text,
ADD COLUMN IF NOT EXISTS brand text;