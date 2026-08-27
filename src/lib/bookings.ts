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
  catName: string;
  date: string;
  createdAt: string;
  plan: VaccinationPlan | null;
};


const STORAGE_KEY = "clinic.bookings.v1";
const EVENT = "clinic-bookings-changed";

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadBookings(): Booking[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Booking[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(bookings: Booking[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeBookings(listener: () => void) {
  if (!isBrowser()) return () => {};
  window.addEventListener(EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export function addBooking(input: Omit<Booking, "id" | "createdAt" | "plan">): Booking {
  const booking: Booking = {
    ...input,
    id: newId(),
    createdAt: new Date().toISOString(),
    plan: null,
  };
  save([booking, ...loadBookings()]);
  return booking;
}

export function updatePlan(id: string, plan: VaccinationPlan | null) {
  save(loadBookings().map((b) => (b.id === id ? { ...b, plan } : b)));
}

export function removeBooking(id: string) {
  save(loadBookings().filter((b) => b.id !== id));
}

export function formatDate(value: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("ar-IQ", { year: "numeric", month: "long", day: "numeric" });
}
