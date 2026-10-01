CREATE TABLE public.whatsapp_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  twilio_account_sid text,
  twilio_auth_token text,
  twilio_from_number text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.whatsapp_settings TO service_role;
ALTER TABLE public.whatsapp_settings ENABLE ROW LEVEL SECURITY;