-- Allow the public booking/order flows and the admin dashboard to keep working
-- even when requests use the anon or authenticated Supabase client.

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read and insert" ON public.bookings;
CREATE POLICY "Allow public read and insert"
  ON public.bookings
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read and insert" ON public.orders;
CREATE POLICY "Allow public read and insert"
  ON public.orders
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

GRANT SELECT, INSERT ON public.bookings TO anon, authenticated;
GRANT SELECT, INSERT ON public.orders TO anon, authenticated;
