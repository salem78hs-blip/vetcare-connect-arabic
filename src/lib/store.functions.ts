import { createServerFn } from "@tanstack/react-start";

import { normalizePhone } from "@/lib/bookings";
import type { Order, Product } from "@/lib/store";

type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  image_url: string | null;
  is_available: boolean;
};

type OrderRow = {
  id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number | string;
  quantity: number;
  customer_name: string;
  phone: string;
  note: string | null;
  status: string;
  created_at: string;
};

const PRODUCT_COLUMNS = "id, name, description, price, image_url, is_available";
const ORDER_COLUMNS =
  "id, product_id, product_name, unit_price, quantity, customer_name, phone, note, status, created_at";

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    price: Number(row.price ?? 0),
    imageUrl: row.image_url ?? "",
    isAvailable: row.is_available,
  };
}

function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    unitPrice: Number(row.unit_price ?? 0),
    quantity: row.quantity,
    customerName: row.customer_name,
    phone: row.phone,
    note: row.note ?? "",
    status: row.status,
    createdAt: row.created_at,
  };
}

/* ---------------- public ---------------- */

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error("تعذّر جلب المنتجات");
  return (data as ProductRow[]).map(toProduct);
});

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      productId: string;
      customerName: string;
      phone: string;
      quantity: number;
      note?: string;
    }) => {
      const productId = String(input?.productId ?? "");
      const customerName = String(input?.customerName ?? "").trim();
      const phone = normalizePhone(String(input?.phone ?? ""));
      const quantity = Number(input?.quantity ?? 1);
      const note = String(input?.note ?? "").trim();

      if (!productId) throw new Error("اختر منتجاً");
      if (customerName.length < 2) throw new Error("اكتب اسمك");
      if (!/^07\d{9}$/.test(phone)) throw new Error("رقم الهاتف يجب أن يكون 11 رقماً ويبدأ بـ 07");
      if (!Number.isFinite(quantity) || quantity < 1 || quantity > 99)
        throw new Error("الكمية غير صحيحة");

      return {
        productId,
        customerName: customerName.slice(0, 60),
        phone,
        quantity: Math.floor(quantity),
        note: note.slice(0, 200),
      };
    },
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("id", data.productId)
      .eq("is_available", true)
      .single();

    if (productError || !product) throw new Error("المنتج غير متوفر حالياً");

    const p = toProduct(product as ProductRow);
    const { error } = await supabaseAdmin.from("orders").insert({
      product_id: p.id,
      product_name: p.name,
      unit_price: p.price,
      quantity: data.quantity,
      customer_name: data.customerName,
      phone: data.phone,
      note: data.note || null,
    });

    if (error) throw new Error("تعذّر إرسال الطلب، حاول مرة أخرى");
    return { ok: true, productName: p.name, total: p.price * data.quantity };
  });

/* ---------------- admin (passcode) ---------------- */

async function guard(passcode: string) {
  const { assertAdminPasscode } = await import("@/lib/admin-passcode.server");
  assertAdminPasscode(passcode);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const adminListProducts = createServerFn({ method: "POST" })
  .inputValidator((input: { passcode: string }) => ({ passcode: String(input?.passcode ?? "") }))
  .handler(async ({ data }) => {
    const db = await guard(data.passcode);
    const { data: rows, error } = await db
      .from("products")
      .select(PRODUCT_COLUMNS)
      .order("created_at", { ascending: false });
    if (error) throw new Error("تعذّر جلب المنتجات");
    return (rows as ProductRow[]).map(toProduct);
  });

export const saveProduct = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      passcode: string;
      id?: string | null;
      name: string;
      description?: string;
      price: number;
      imageUrl?: string;
      isAvailable: boolean;
    }) => {
      const name = String(input?.name ?? "").trim();
      const price = Number(input?.price ?? 0);
      if (name.length < 2) throw new Error("اكتب اسم المنتج");
      if (!Number.isFinite(price) || price < 0) throw new Error("اكتب سعراً صحيحاً");
      return {
        passcode: String(input?.passcode ?? ""),
        id: input?.id ? String(input.id) : null,
        name: name.slice(0, 80),
        description: String(input?.description ?? "").trim().slice(0, 300),
        price,
        imageUrl: String(input?.imageUrl ?? "").trim().slice(0, 500),
        isAvailable: Boolean(input?.isAvailable),
      };
    },
  )
  .handler(async ({ data }) => {
    const db = await guard(data.passcode);
    const payload = {
      name: data.name,
      description: data.description || null,
      price: data.price,
      image_url: data.imageUrl || null,
      is_available: data.isAvailable,
    };

    const { error } = data.id
      ? await db.from("products").update(payload).eq("id", data.id)
      : await db.from("products").insert(payload);

    if (error) throw new Error("تعذّر حفظ المنتج");
    return { ok: true };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .inputValidator((input: { passcode: string; id: string }) => {
    const id = String(input?.id ?? "");
    if (!id) throw new Error("منتج غير معروف");
    return { passcode: String(input?.passcode ?? ""), id };
  })
  .handler(async ({ data }) => {
    const db = await guard(data.passcode);
    const { error } = await db.from("products").delete().eq("id", data.id);
    if (error) throw new Error("تعذّر حذف المنتج");
    return { ok: true };
  });

export const listOrders = createServerFn({ method: "POST" })
  .inputValidator((input: { passcode: string }) => ({ passcode: String(input?.passcode ?? "") }))
  .handler(async ({ data }) => {
    const db = await guard(data.passcode);
    const { data: rows, error } = await db
      .from("orders")
      .select(ORDER_COLUMNS)
      .order("created_at", { ascending: false });
    if (error) throw new Error("تعذّر جلب الطلبات");
    return (rows as OrderRow[]).map(toOrder);
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .inputValidator((input: { passcode: string; id: string; status: string }) => {
    const id = String(input?.id ?? "");
    const status = String(input?.status ?? "");
    if (!id) throw new Error("طلب غير معروف");
    if (!["new", "confirmed", "delivered", "cancelled"].includes(status))
      throw new Error("حالة غير صحيحة");
    return { passcode: String(input?.passcode ?? ""), id, status };
  })
  .handler(async ({ data }) => {
    const db = await guard(data.passcode);
    const { error } = await db.from("orders").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error("تعذّر تحديث الطلب");
    return { ok: true };
  });

export const deleteOrder = createServerFn({ method: "POST" })
  .inputValidator((input: { passcode: string; id: string }) => {
    const id = String(input?.id ?? "");
    if (!id) throw new Error("طلب غير معروف");
    return { passcode: String(input?.passcode ?? ""), id };
  })
  .handler(async ({ data }) => {
    const db = await guard(data.passcode);
    const { error } = await db.from("orders").delete().eq("id", data.id);
    if (error) throw new Error("تعذّر حذف الطلب");
    return { ok: true };
  });
