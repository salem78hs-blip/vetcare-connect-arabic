import { createServerFn } from "@tanstack/react-start";

async function guard(passcode: string) {
  const { assertAdminPasscode } = await import("@/lib/admin-passcode.server");
  assertAdminPasscode(passcode);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

/** Returns saved Twilio settings; the auth token is never sent back, only whether it exists. */
export const getWhatsappSettings = createServerFn({ method: "POST" })
  .inputValidator((input: { passcode: string }) => ({ passcode: String(input?.passcode ?? "") }))
  .handler(async ({ data }) => {
    const db = await guard(data.passcode);
    const { data: row } = await db
      .from("whatsapp_settings" as never)
      .select("twilio_account_sid, twilio_auth_token, twilio_from_number")
      .eq("id", 1)
      .maybeSingle();
    const r = row as {
      twilio_account_sid: string | null;
      twilio_auth_token: string | null;
      twilio_from_number: string | null;
    } | null;
    return {
      accountSid: r?.twilio_account_sid ?? "",
      fromNumber: r?.twilio_from_number ?? "",
      hasAuthToken: Boolean(r?.twilio_auth_token),
    };
  });

export const saveWhatsappSettings = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { passcode: string; accountSid: string; authToken?: string; fromNumber: string }) => {
      const accountSid = String(input?.accountSid ?? "").trim();
      const authToken = String(input?.authToken ?? "").trim();
      const fromNumber = String(input?.fromNumber ?? "").replace(/[^\d+]/g, "");
      if (!/^AC[0-9a-fA-F]{32}$/.test(accountSid))
        throw new Error("Account SID يجب أن يبدأ بـ AC ويتكون من 34 حرفاً");
      if (authToken && authToken.length < 16) throw new Error("Auth Token غير صحيح");
      if (!/^\+\d{8,15}$/.test(fromNumber))
        throw new Error("رقم المرسل يجب أن يكون بالصيغة الدولية مثل +9647xxxxxxxxx");
      return { passcode: String(input?.passcode ?? ""), accountSid, authToken, fromNumber };
    },
  )
  .handler(async ({ data }) => {
    const db = await guard(data.passcode);
    const payload: Record<string, unknown> = {
      id: 1,
      twilio_account_sid: data.accountSid,
      twilio_from_number: data.fromNumber,
      updated_at: new Date().toISOString(),
    };
    if (data.authToken) payload["twilio_auth_token"] = data.authToken;
    const { error } = await db.from("whatsapp_settings" as never).upsert(payload as never);
    if (error) throw new Error("تعذّر حفظ الإعدادات");
    return { ok: true };
  });
