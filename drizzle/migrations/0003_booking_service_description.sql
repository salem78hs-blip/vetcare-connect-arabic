ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS service_type text NOT NULL DEFAULT '';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS service_description text NOT NULL DEFAULT '';
ALTER TABLE public.bookings ADD CONSTRAINT bookings_service_type_valid CHECK (service_type IN ('', 'medical_checkup', 'grooming_bathing'));
ALTER TABLE public.bookings ADD CONSTRAINT bookings_service_description_length CHECK (char_length(service_description) <= 1000);
GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
NOTIFY pgrst, 'reload schema';