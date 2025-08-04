-- Create suggestions table
CREATE TABLE public.suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_id TEXT NOT NULL,
  suggestion_type TEXT NOT NULL CHECK (suggestion_type IN ('bug', 'improvement', 'problem', 'new_feature')),
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

-- Create policies for suggestions
CREATE POLICY "Anyone can insert suggestions" 
ON public.suggestions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all suggestions" 
ON public.suggestions 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can update suggestions" 
ON public.suggestions 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_suggestions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_suggestions_updated_at
BEFORE UPDATE ON public.suggestions
FOR EACH ROW
EXECUTE FUNCTION public.update_suggestions_updated_at();

-- Create function to insert suggestions
CREATE OR REPLACE FUNCTION public.create_suggestion(
  p_telegram_id TEXT,
  p_suggestion_type TEXT,
  p_content TEXT
)
RETURNS suggestions
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_suggestion public.suggestions;
BEGIN
  INSERT INTO public.suggestions (telegram_id, suggestion_type, content)
  VALUES (p_telegram_id, p_suggestion_type, p_content)
  RETURNING * INTO result_suggestion;
  
  RETURN result_suggestion;
END;
$$;