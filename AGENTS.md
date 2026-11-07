<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Rules

- Booking validation and direct WhatsApp message formatting share the browser-safe bookings module, so client and server accept the same inputs and messages use the saved condition notes.

- Product image writes use passcode-checked server uploads to the products storage bucket; never allow anonymous storage writes. Save them through the existing product form.
- The products storage bucket is private (public buckets are blocked in this workspace); serve product images through the `/api/public/product-image/$` route and store that app URL in `image_url`, never a direct storage URL.

- Public catalog reads allow anon SELECT; customer orders and bookings allow validated INSERT only, with staff reads handled by passcode-checked server functions so customer contact data is never publicly readable.
- Collection screens use settled results to preserve usable empty layouts on failed reads while separately indicating the failure; an empty table is a successful result.

- Use direct WhatsApp links for customer messaging; do not introduce Twilio settings or automated messaging endpoints, to keep administration focused on clinic and store management.

- Serve the clinic logo from `public/logo.png` and reference it as the literal
  lowercase path `"/logo.png"`; never import it through a bundled asset module,
  because the deployed host is case-sensitive and a mismatched path breaks the
  header image.

- Keep public booking submission in `src/components/BookingForm.tsx` using the generated browser client and shared payload helper; never depend on server credentials in the form. This preserves anonymous validated inserts and direct WhatsApp redirection.
