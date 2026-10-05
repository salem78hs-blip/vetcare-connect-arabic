CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ADD COLUMN category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL;
INSERT INTO public.categories (name, sort_order) VALUES ('أكل قطط',1),('أكل كلاب',2),('ألعاب',3),('أسرّة',4);