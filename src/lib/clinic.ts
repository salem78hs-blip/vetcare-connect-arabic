export const CLINIC = {
  name: "VetOna",
  nameAr: "عيادة VetOna البيطرية",
  tagline: "Veterinary clinic",
  phones: ["07760198800", "07506041077"],
  phonesDisplay: ["0776 019 8800", "0750 604 1077"],
  address: "الحدباء سايدين البحرين",
  mapUrl: "https://maps.app.goo.gl/SsG2oowBgosxZckd9",
  instagram: "https://www.instagram.com/vetona_vet_clinic",
  tiktok: "https://www.tiktok.com/@vetona.clinic",
  facebook: "https://www.facebook.com/profile.php?id=61581091355029",
} as const;

export const ANIMAL_TYPES = [
  { value: "cat", label: "قطط" },
  { value: "dog", label: "كلاب" },
  { value: "bird", label: "طيور زينة" },
  { value: "other", label: "أخرى" },
] as const;

export function animalLabel(value: string, other?: string) {
  if (value === "other") return other?.trim() ? other.trim() : "أخرى";
  return ANIMAL_TYPES.find((t) => t.value === value)?.label ?? "أخرى";
}
