import { createServerFn } from "@tanstack/react-start";

import type { Booking, BookingInput, VaccinationPlan } from "@/lib/bookings";
import { DEFAULT_INTERVAL_MONTHS, addMonths, normalizePhone, bookingInputSchema } from "@/lib/bookings";

type Row = {
  id: string;
  client_name: string;
  phone_number: string;
  service_description: string;
  pet_type: string;
  pet_name: string | null;
  booking_date: string;
  status: string;
  created_at: string;
  vaccination_plan?: unknown;
};

function toBooking(row: Row): Booking {
  const plan = row.vaccination_plan as VaccinationPlan | null;
  return {
    id: row.id,
    ownerName: row.client_name,
    phone: row.phone_number,
    serviceType: "medical",
    serviceDescription: row.service_description,
    animalType: row.pet_type,
    animalOther: "",
    catName: row.pet_name ?? "",
    date: row.booking_date,
    createdAt: row.created_at,
    plan: plan && Array.isArray(plan.doses) ? plan : null,
  };
}

const COLUMNS =
  "id, client_name, phone_number, service_description, pet_type, pet_name, booking_date, status, created_at";

function isMissingBookingsSchema(error: { code?: string; message?: string } | null) {
  return (
    error?.code === "42P01" ||
    error?.code === "42703" ||
    error?.code === "PGRST204" ||
    error?.code === "PGRST205" ||
    /bookings.*not find|relation .*bookings.*does not exist|column .*does not exist|could not find the .* column/i.test(error?.message ?? "")
  );
}

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((input: BookingInput) => {
    const result = bookingInputSchema.safeParse(input);
    if (!result.success) throw new Error(result.error.issues[0]?.message ?? "تحقق من بيانات الحجز");
    return result.data;
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        client_name: data.ownerName,
        phone_number: data.phone,
        service_description: data.serviceDescription,
        pet_type: data.animalOther ? `${data.animalType}: ${data.animalOther}` : data.animalType,
        pet_name: data.catName || "",
        booking_date: data.date,
        status: "pending",
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
      .eq("phone_number", data.phone)
      .order("booking_date", { ascending: false });

    if (error) {
      if (isMissingBookingsSchema(error)) return [];
      throw new Error("تعذّر جلب الحجوزات، حاول مرة أخرى");
    }
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

    if (error) {
      if (isMissingBookingsSchema(error)) return [];
      throw new Error("تعذّر جلب الحجوزات");
    }
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

    if (error) throw new Error("تعذّر حفظ ��طة التطعيم");
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
