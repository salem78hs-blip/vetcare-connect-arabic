export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
};

export type Order = {
  id: string;
  productId: string | null;
  productName: string;
  unitPrice: number;
  quantity: number;
  customerName: string;
  phone: string;
  note: string;
  status: string;
  createdAt: string;
};

export const ORDER_STATUSES = [
  { value: "new", label: "جديد" },
  { value: "confirmed", label: "مؤكد" },
  { value: "delivered", label: "تم التسليم" },
  { value: "cancelled", label: "ملغي" },
] as const;

export function orderStatusLabel(value: string) {
  return ORDER_STATUSES.find((s) => s.value === value)?.label ?? value;
}

export function formatPrice(value: number) {
  return `${new Intl.NumberFormat("ar-IQ").format(value)} د.ع`;
}
