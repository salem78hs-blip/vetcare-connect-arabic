import { createFileRoute } from "@tanstack/react-router";

import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";
import { formatDate, toWhatsappNumber, type VaccinationPlan } from "@/lib/bookings";

type Row = {
  id: string;
  owner_name: string;
  phone: string;
  pet_name: string | null;
  vaccination_plan: unknown;
};

type Reminder = {
  bookingId: string;
  ownerName: string;
  petName: string;
  phone: string;
  whatsappNumber: string;
  vaccine: string;
  dueDate: string;
  message: string;
};

function tomorrowISO() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

function buildMessage(r: Omit<Reminder, "message">) {
  return [
    `مرحباً ${r.ownerName} 👋`,
    `تذكير من عيادة VetOna البيطرية بخصوص ${r.petName ? `أليفك ${r.petName}` : "أليفك"}.`,
    `موعد جرعة ${r.vaccine || "التطعيم"} غداً بتاريخ ${formatDate(r.dueDate)}.`,
    "نرجو الحضور في الوقت المحدد، ولأي استفسار تواصل معنا.",
  ].join("\n");
}

/**
 * Daily vaccination reminder job.
 * Finds every vaccination dose whose next due date is tomorrow and prepares the
 * WhatsApp reminder payload. Sending is not wired yet — once a WhatsApp Business
 * API key is stored, POST each `message` to the provider where marked below.
 * Until then the admin dashboard's manual wa.me button remains the fallback.
 */
export const Route = createFileRoute("/api/public/cron/send-daily-whatsapp-reminders")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const unauthorized = await authenticateCronRequest(request);
        if (unauthorized) return unauthorized;

        const dueDate = tomorrowISO();
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin
          .from("bookings")
          .select("id, owner_name, phone, pet_name, vaccination_plan")
          .not("vaccination_plan", "is", null);

        if (error) {
          console.error("[reminders] query failed", error.message);
          return Response.json({ ok: false, error: "query_failed" }, { status: 500 });
        }

        const reminders: Reminder[] = [];
        for (const row of (data ?? []) as Row[]) {
          const plan = row.vaccination_plan as VaccinationPlan | null;
          if (!plan || !Array.isArray(plan.doses)) continue;
          for (const dose of plan.doses) {
            if (dose.nextDueDate !== dueDate) continue;
            const base = {
              bookingId: row.id,
              ownerName: row.owner_name,
              petName: row.pet_name ?? "",
              phone: row.phone,
              whatsappNumber: toWhatsappNumber(row.phone),
              vaccine: dose.vaccine,
              dueDate,
            };
            reminders.push({ ...base, message: buildMessage(base) });
          }
        }

        // TODO: send each reminder through the WhatsApp Business API once its key is stored.
        console.log(`[reminders] ${reminders.length} due on ${dueDate} (sending not enabled yet)`);

        return Response.json({ ok: true, dueDate, count: reminders.length, reminders });
      },
    },
  },
});
