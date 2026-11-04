# Cleanup

- [x] Remove WhatsApp settings tab and Twilio settings code.
- [x] Remove unused automated reminder endpoint and inspect dependencies (no Twilio package installed).
- [x] Verify remaining admin tabs and retain existing direct WhatsApp links.

## Orders and bookings access

- [x] Repair orders/bookings grants and enable safe insert/read policies in the connected database.
- [x] Verify public submission and passcode-protected admin readback; provide the same SQL for the external Vercel database.
- [x] Provide a complete fresh-database script for categories, products, bookings and orders, with private customer records (external execution remains the user's step).
- [x] Handle empty and failed collection loads gracefully in the store and administration; verify empty screens and run three focused tests.

## Product image uploads

- [x] Create the products storage bucket (private; workspace blocks public buckets).
- [x] Replace image URL input with validated file upload, loading state, and saved image preview.
- [x] Verify image upload, image serving route, and store readback.

## Booking condition description

- [ ] Make service selection optional and keep condition notes visible.
- [ ] Add bookings service_description storage with validated inputs and include it in the direct WhatsApp message.
- [ ] Verify a no-service booking, description readback, and WhatsApp destination.