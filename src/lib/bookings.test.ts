import { describe, it } from "node:test";
import { deepStrictEqual, strictEqual, throws } from "node:assert";
import { bookingInputSchema, bookingInsertPayload, bookingWhatsappUrl } from "./bookings";

const input = { ownerName: "سالم", phone: "07700000001", animalType: "cat" as const, date: "2026-11-05", serviceDescription: "فحص طبي" };

describe("booking condition notes", () => {
  it("accepts a required description without a service selection", () => {
    const booking = bookingInputSchema.parse(input);
    strictEqual(booking.serviceType, "");
    strictEqual(booking.serviceDescription, "فحص طبي");
  });
  it("rejects missing, empty, and whitespace-only descriptions", () => {
    for (const serviceDescription of [undefined, "", "  \n  "]) {
      strictEqual(bookingInputSchema.safeParse({ ...input, serviceDescription }).success, false);
    }
  });
  it("preserves free notes with or without either standard service", () => {
    for (const serviceType of ["", "medical_checkup", "grooming_bathing"] as const) {
      const booking = bookingInputSchema.parse({ ...input, serviceType, serviceDescription: "  لا يأكل منذ يومين\nيحتاج فحصاً  " });
      strictEqual(booking.serviceDescription, "لا يأكل منذ يومين\nيحتاج فحصاً");
      strictEqual(booking.serviceType, serviceType);
    }
  });
  it("still requires owner contact and a real appointment date", () => {
    for (const invalid of [{ ownerName: "" }, { phone: "" }, { date: "" }, { date: "2026-02-30" }]) {
      throws(() => bookingInputSchema.parse({ ...input, ...invalid }));
    }
  });
  it("rejects invalid services and excessively long descriptions", () => {
    strictEqual(bookingInputSchema.safeParse({ ...input, serviceType: "unknown" }).success, false);
    strictEqual(bookingInputSchema.safeParse({ ...input, serviceDescription: "ا".repeat(1001) }).success, false);
  });
  it("sends condition notes to the original primary clinic WhatsApp number", () => {
    const description = "لا يأكل & يحتاج عناية\nمنذ يومين";
    const url = new URL(bookingWhatsappUrl({ ...input, serviceDescription: description }));
    strictEqual(url.origin + url.pathname, "https://wa.me/9647760198800");
    strictEqual(url.searchParams.get("text")?.includes(`وصف الحالة / ملاحظات إضافية: ${description}`), true);
    strictEqual(url.searchParams.get("text")?.includes("نوع الخدمة:"), false);
    strictEqual(url.searchParams.get("text")?.includes("\\n"), false);
  });
  it("inserts using the exact bookings column names", () => {
    const payload = bookingInsertPayload(bookingInputSchema.parse({ ...input, animalType: "dog" }));
    deepStrictEqual(Object.keys(payload).sort(), [
      "animal_other",
      "animal_type",
      "booking_date",
      "owner_name",
      "pet_name",
      "phone",
      "service_description",
      "service_type",
    ]);
    strictEqual(payload.owner_name, "سالم");
    strictEqual(payload.phone, "07700000001");
    strictEqual(payload.animal_type, "dog");
    strictEqual(payload.animal_other, null);
    strictEqual(payload.pet_name, null);
    strictEqual(payload.booking_date, "2026-11-05");
    strictEqual(payload.service_description, "فحص طبي");
    for (const forbidden of ["name", "client_name", "phone_number", "pet_type", "status"]) {
      strictEqual(forbidden in payload, false);
    }
  });
  it("stores the written animal type only when other is chosen", () => {
    const payload = bookingInsertPayload(
      bookingInputSchema.parse({ ...input, animalType: "other", animalOther: "أرنب" }),
    );
    strictEqual(payload.animal_type, "other");
    strictEqual(payload.animal_other, "أرنب");
  });
});