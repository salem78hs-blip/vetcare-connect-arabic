import { createServerFn } from "@tanstack/react-start";

import type { Booking, BookingInput, VaccinationPlan } from "@/lib/bookings";
import { DEFAULT_INTERVAL_MONTHS, addMonths, normalizePhone } from "@/lib/bookings";

type Row = {
  id: string;
  owner_name: string;
  phone: string;
  animal_type: string;
  animal_other: string | null;
  pet_name: string | null;
  booking_date: string;
  vaccination_plan: unknown;
  created_at: string;
};

function toBooking(row: Row): Booking {
  const plan = row.vaccination_plan as VaccinationPlan | null;
  return {
    id: row.id,
    ownerName: row.owner_name,
    phone: row.phone,
    animalType: row.animal_type,
    animalOther: row.animal_other ?? "",
    catName: row.pet_name ?? "",
    date: row.booking_date,
    createdAt: row.created_at,
    plan: plan && Array.isArray(plan.doses) ? plan : null,
  };
}

const COLUMNS =
  "id, owner_name, phone, animal_type, animal_other, pet_name, booking_date, vaccination_plan, created_at";

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((input: BookingInput) => {
    const ownerName = String(input?.ownerName ?? "").trim();
    const phone = normalizePhone(String(input?.phone ?? ""));
    const animalType = String(input?.animalType ?? "").trim();
    const animalOther = String(input?.animalOther ?? "").trim();
    const catName = String(input?.catName ?? "").trim();
    const date = String(input?.date ?? "").trim();

    if (ownerName.length < 2) throw new Error("اكتب اسم المالك");
    if (!/^07\d{9}$/.test(phone)) throw new Error("رقم الهاتف يجب أن يكون 11 رقماً ويبدأ بـ 07");
    if (!["cat", "dog", "bird", "other"].includes(animalType)) throw new Error("اختر نوع الحيوان");
    if (animalType === "other" && animalOther.length < 2) throw new Error("اكتب نوع الحيوان");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("اختر تاريخ الموعد");

    return {
      ownerName: ownerName.slice(0, 60),
      phone,
      animalType,
      animalOther: animalType === "other" ? animalOther.slice(0, 40) : "",
      catName: catName.slice(0, 40),
      date,
    };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        owner_name: data.ownerName,
        phone: data.phone,
        animal_type: data.animalType,
        animal_other: data.animalOther || null,
        pet_name: data.catName || null,
        booking_date: data.date,
      })
      .select(COLUMNS)
      .single();

    if (error) throw new Error("تعذّر حفظ الحجز، حاول مرة أخرى");
    return toBooking(row as Row);
  });

export const lookupBookings = createServerFn({ method: "POST" })
  .inputValidator((input: { phone: string }) => {
    const phone = normalizePhone(String(input?.phone ?? ""));
    if (!/^07\d{9}$/.test(phone)) throw new Error("أدخل رقم هاتف صحيح يبدأ بـ 07");
    return { phone };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("bookings")
      .select(COLUMNS)
      .eq("phone", data.phone)
      .order("booking_date", { ascending: false });

    if (error) throw new Error("تعذّر جلب الحجوزات، حاول مرة أخرى");
    return (rows as Row[]).map(toBooking);
  });

/** Checks the staff passcode without throwing, so a wrong code is a normal result. */
export const verifyPasscode = createServerFn({ method: "POST" })
  .inputValidator((input: { passcode: string }) => ({ passcode: String(input?.passcode ?? "") }))
  .handler(async ({ data }) => {
    const { assertAdminPasscode } = await import("@/lib/admin-passcode.server");
    try {
      assertAdminPasscode(data.passcode);
      return { ok: true as const };
    } catch {
      return { ok: false as const };
    }
  });

export const listBookings = createServerFn({ method: "POST" })
  .inputValidator((input: { passcode: string }) => ({ passcode: String(input?.passcode ?? "") }))
  .handler(async ({ data }) => {
    const { assertAdminPasscode } = await import("@/lib/admin-passcode.server");
    assertAdminPasscode(data.passcode);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("bookings")
      .select(COLUMNS)
      .order("created_at", { ascending: false });

    if (error) throw new Error("تعذّر جلب الحجوزات");
    return (rows as Row[]).map(toBooking);
  });

export const savePlan = createServerFn({ method: "POST" })
  .inputValidator((input: { passcode: string; id: string; plan: VaccinationPlan | null }) => {
    const id = String(input?.id ?? "");
    if (!id) throw new Error("حجز غير معروف");
    const doses = (input?.plan?.doses ?? []).map((d) => {
      const date = String(d.date ?? "");
      const intervalMonths = [1, 3, 6, 12].includes(Number(d.intervalMonths))
        ? Number(d.intervalMonths)
        : DEFAULT_INTERVAL_MONTHS;
      const nextDueDate = /^\d{4}-\d{2}-\d{2}$/.test(String(d.nextDueDate ?? ""))
        ? String(d.nextDueDate)
        : addMonths(date, intervalMonths);
      return {
        id: String(d.id ?? ""),
        vaccine: String(d.vaccine ?? "").trim().slice(0, 60),
        date,
        intervalMonths,
        nextDueDate,
      };
    });
    if (doses.some((d) => !d.vaccine || !/^\d{4}-\d{2}-\d{2}$/.test(d.date))) {
      throw new Error("أكمل نوع التطعيم وتاريخ كل جرعة");
    }
    return {
      passcode: String(input?.passcode ?? ""),
      id,
      plan: doses.length ? { doses } : null,
    };
  })
  .handler(async ({ data }) => {
    const { assertAdminPasscode } = await import("@/lib/admin-passcode.server");
    assertAdminPasscode(data.passcode);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("bookings")
      .update({ vaccination_plan: data.plan })
      .eq("id", data.id);

    if (error) throw new Error("تعذّر حفظ خطة التطعيم");
    return { ok: true };
  });

export const deleteBooking = createServerFn({ method: "POST" })
  .inputValidator((input: { passcode: string; id: string }) => {
    const id = String(input?.id ?? "");
    if (!id) throw new Error("حجز غير معروف");
    return { passcode: String(input?.passcode ?? ""), id };
  })
  .handler(async ({ data }) => {
    const { assertAdminPasscode } = await import("@/lib/admin-passcode.server");
    assertAdminPasscode(data.passcode);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("bookings").delete().eq("id", data.id);
    if (error) throw new Error("تعذّر حذف الحجز");
    return { ok: true };
  });
