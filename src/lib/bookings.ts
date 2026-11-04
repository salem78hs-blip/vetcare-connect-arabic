import { z } from "zod";
import { CLINIC, animalLabel } from "./clinic";

export type VaccineDose = {
  id: string;
  vaccine: string;
  date: string;
  /** Booster interval in months (12 = yearly, 6 = half-yearly). */
  intervalMonths?: number;
  /** Auto-calculated next due date (YYYY-MM-DD). */
  nextDueDate?: string;
};

export const DOSE_INTERVALS = [
  { value: 12, label: "كل سنة (12 شهر)" },
  { value: 6, label: "كل 6 أشهر" },
  { value: 3, label: "كل 3 أشهر" },
  { value: 1, label: "كل شهر" },
] as const;

export const DEFAULT_INTERVAL_MONTHS = 12;

/** Adds whole months to a YYYY-MM-DD date, clamping to the end of the month. */
export function addMonths(date: string, months: number) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "";
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  const target = new Date(Date.UTC(y, m - 1 + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(d, lastDay));
  return target.toISOString().slice(0, 10);
}

export type VaccinationPlan = {
  doses: VaccineDose[];
};

export const SERVICE_TYPES = [
  { value: "medical_checkup", label: "فحص طبي" },
  { value: "grooming_bathing", label: "التحميم والعناية" },
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number]["value"];

export function serviceTypeLabel(value: string) {
  return SERVICE_TYPES.find((service) => service.value === value)?.label ?? (value || "غير محددة");
}

export type Booking = {
  id: string;
  ownerName: string;
  phone: string;
  serviceType: ServiceType | "";
  serviceDescription: string;
  animalType: string;
  animalOther?: string;
  catName: string;
  date: string;
  createdAt: string;
  plan: VaccinationPlan | null;
};

export const bookingInputSchema = z.object({
  ownerName: z.string().trim().min(2, "اكتب اسم المالك").max(60, "اسم المالك طويل جداً"),
  phone: z.string().transform(normalizePhone).pipe(z.string().regex(/^07\d{9}$/, "رقم الهاتف يجب أن يكون 11 رقماً ويبدأ بـ 07")),
  serviceType: z.enum(["", "medical_checkup", "grooming_bathing"], { message: "نوع الخدمة غير صحيح" }).optional().default(""),
  serviceDescription: z.string({ error: "اكتب وصف الحالة" }).trim().min(1, "اكتب وصف الحالة").max(1000, "وصف الحالة يجب ألا يتجاوز 1000 حرف"),
  animalType: z.enum(["cat", "dog", "bird", "other"], { message: "اختر نوع الحيوان" }),
  animalOther: z.string().trim().max(40).optional().default(""),
  catName: z.string().trim().max(40).optional().default(""),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "اختر تاريخ الموعد").refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, "اختر تاريخ موعد صحيح"),
}).superRefine((value, ctx) => {
  if (value.animalType === "other" && value.animalOther.length < 2) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["animalOther"], message: "اكتب نوع الحيوان" });
  }
}).transform((value) => ({ ...value, animalOther: value.animalType === "other" ? value.animalOther : "" }));

export type BookingInput = z.input<typeof bookingInputSchema>;

export function bookingWhatsappUrl(input: BookingInput) {
  const booking = bookingInputSchema.parse(input);
  const lines = [
    "مرحباً، أود تأكيد هذا الحجز لدى عيادة VetOna:",
    `اسم العميل: ${booking.ownerName}`,
    `رقم الهاتف: ${booking.phone}`,
    `نوع الحيوان: ${animalLabel(booking.animalType, booking.animalOther)}`,
    `اسم الحيوان: ${booking.catName || "غير مذكور"}`,
    `تاريخ الحجز: ${formatDate(booking.date)}`,
    ...(booking.serviceType ? [`نوع الخدمة: ${serviceTypeLabel(booking.serviceType)}`] : []),
    ...(booking.serviceDescription ? [`وصف الحالة / ملاحظات إضافية: ${booking.serviceDescription}`] : []),
  ];
  return `https://wa.me/${toWhatsappNumber(CLINIC.phones[0])}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

/** Converts a local Iraqi number (07XXXXXXXXX) to international form for wa.me. */
export function toWhatsappNumber(phone: string) {
  const digits = normalizePhone(phone);
  if (digits.startsWith("964")) return digits;
  if (digits.startsWith("0")) return `964${digits.slice(1)}`;
  return digits;
}

/** Arabic vaccination reminder message + wa.me link for a booking. */
export function whatsappReminderUrl(booking: {
  ownerName: string;
  phone: string;
  catName?: string;
  plan: VaccinationPlan | null;
}) {
  const dose = booking.plan?.doses[0];
  const petName = booking.catName?.trim();
  const lines = [
    `مرحباً ${booking.ownerName} 👋`,
    `تذكير من عيادة VetOna البيطرية بخصوص ${petName ? `أليفك ${petName}` : "أليفك"}.`,
    dose
      ? `موعد جرعة ${dose.vaccine || "التطعيم"} بتاريخ ${formatDate(dose.date)}.`
      : "يرجى التواصل معنا لتحديد موعد الجرعة القادمة.",
    "نرجو الحضور في الوقت المحدد، ولأي استفسار تواصل معنا.",
  ];
  return `https://wa.me/${toWhatsappNumber(booking.phone)}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function formatDate(value: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("ar-IQ", { year: "numeric", month: "long", day: "numeric" });
}
