export type VaccineDose = {
  id: string;
  vaccine: string;
  date: string;
};

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

export function formatDate(value: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("ar-IQ", { year: "numeric", month: "long", day: "numeric" });
}
