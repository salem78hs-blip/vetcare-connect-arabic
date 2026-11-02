export const PRODUCT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const PRODUCT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateProductImage(file: { size: number; type: string }) {
  if (!PRODUCT_IMAGE_TYPES.includes(file.type))
    throw new Error("اختر صورة JPG أو PNG أو WebP");
  if (file.size <= 0 || file.size > PRODUCT_IMAGE_MAX_BYTES)
    throw new Error("حجم الصورة يجب ألا يتجاوز 5 ميغابايت");
}