CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_name text NOT NULL,
  phone text NOT NULL,
  animal_type text NOT NULL,
  animal_other text,
  pet_name text,
  booking_date date NOT NULL,
  vaccination_plan jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Customers can create bookings" ON public.bookings;
CREATE POLICY "Customers can create bookings" ON public.bookings FOR INSERT TO anon, authenticated
WITH CHECK (length(trim(owner_name)) BETWEEN 2 AND 60 AND phone ~ '^07[0-9]{9}$' AND animal_type IN ('cat','dog','bird','other') AND (animal_type <> 'other' OR length(trim(animal_other)) >= 2) AND vaccination_plan IS NULL);
DROP POLICY IF EXISTS "Trusted server can read bookings" ON public.bookings;
CREATE POLICY "Trusted server can read bookings" ON public.bookings FOR SELECT TO service_role USING (true);

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  unit_price numeric NOT NULL DEFAULT 0,
  quantity integer NOT NULL DEFAULT 1,
  customer_name text NOT NULL,
  phone text NOT NULL,
  note text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.orders TO anon, authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Customers can create orders" ON public.orders;
CREATE POLICY "Customers can create orders" ON public.orders FOR INSERT TO anon, authenticated
WITH CHECK (length(trim(customer_name)) BETWEEN 2 AND 60 AND phone ~ '^07[0-9]{9}$' AND quantity BETWEEN 1 AND 99 AND status = 'new' AND EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND p.is_available AND p.name = product_name AND p.price = unit_price));
DROP POLICY IF EXISTS "Trusted server can read orders" ON public.orders;
CREATE POLICY "Trusted server can read orders" ON public.orders FOR SELECT TO service_role USING (true);
