CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  animal_type TEXT NOT NULL,
  animal_other TEXT,
  pet_name TEXT,
  booking_date DATE NOT NULL,
  vaccination_plan JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.bookings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create a booking" ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Signed-in staff can view bookings" ON public.bookings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Signed-in staff can update bookings" ON public.bookings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Signed-in staff can delete bookings" ON public.bookings FOR DELETE TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();