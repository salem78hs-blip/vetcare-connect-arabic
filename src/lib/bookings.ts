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

export type Booking = {
  id: string;
  ownerName: string;
  phone: string;
  animalType: string;
  animalOther?: string;
  catName: string;
  date: string;
  createdAt: string;
  plan: VaccinationPlan | null;
};

export type BookingInput = {
  ownerName: string;
  phone: string;
  animalType: string;
  animalOther?: string;
  catName?: string;
  date: string;
};

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
