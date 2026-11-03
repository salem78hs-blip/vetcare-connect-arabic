import { createServerFn } from "@tanstack/react-start";
import { validateProductImage } from "./product-image";

export const uploadProductImage = createServerFn({ method: "POST" })
  .inputValidator((input: FormData) => {
    if (!(input instanceof FormData)) throw new Error("اختر صورة المنتج");
    return input;
  })
  .handler(async ({ data }) => {
    const { assertAdminPasscode } = await import("@/lib/admin-passcode.server");
    assertAdminPasscode(String(data.get("passcode") ?? ""));
    const file = data.get("image");
    if (!(file instanceof File)) throw new Error("اختر صورة المنتج");
    validateProductImage(file);
    const bytes = new Uint8Array(await file.arrayBuffer());
    const valid = file.type === "image/png"
      ? [137, 80, 78, 71, 13, 10, 26, 10].every((b, i) => bytes[i] === b)
      : file.type === "image/jpeg"
        ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
        : new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" &&
          new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
    if (!valid) throw new Error("الملف ليس صورة صالحة");
    const extension = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
    const path = `${crypto.randomUUID()}.${extension}`;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.storage.from("products").upload(path, bytes, {
      contentType: file.type,
      upsert: false,
    });
    if (error) {
      console.error("Product image upload failed", { message: error.message });
      throw new Error("تعذّر رفع الصورة؛ تأكد من تفعيل مخزن صور المنتجات ثم حاول مجدداً");
    }
    // The storage bucket is private (public buckets are blocked), so images
    // are served through the app's public image route instead of storage URLs.
    return { imageUrl: `/api/public/product-image/${path}` };
  });