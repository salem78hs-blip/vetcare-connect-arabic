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

- [x] Make service selection optional and keep condition notes visible.
- [x] Add bookings service_description storage with validated inputs and include it in the direct WhatsApp message.
- [x] Verify a no-service booking, description readback, and WhatsApp destination (eight tests passed; desktop/mobile and protected admin verified; test booking removed).

## Mandatory condition description

- [x] Remove the service-choice buttons; keep one required "وصف الحالة" field with the hint (فحص طبي، تحميم، أخرى).
- [x] Fix the Zod build error blocking the preview; typecheck clean and all tests pass.
- [x] Verify in browser: empty description blocks submission; with a description the booking saves and opens WhatsApp to 07760198800 containing the text; test booking deleted.

## Booking insert matches the database schema

- [x] Insert with the real columns (owner_name, phone, animal_type, animal_other, pet_name, booking_date, service_type, service_description) from one shared helper used by the public form and the server function; drop client_name/phone_number/pet_type/status.
- [x] Redirect to WhatsApp immediately after a successful insert.
- [x] Verify: insert returns 201 and the row reads back with the correct values; WhatsApp opens on 07760198800 with the condition text; admin and tracking screens read the renamed columns.