import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, MessageCircle, PawPrint, Phone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { animalLabel } from "@/lib/clinic";
import { formatDate, type Booking } from "@/lib/bookings";
import { getWhatsappSettings, saveWhatsappSettings } from "@/lib/whatsapp-settings.functions";

export function PetRecords({ bookings }: { bookings: Booking[] | null }) {
  const [q, setQ] = useState("");
  const owners = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; visits: Booking[] }>();
    for (const b of bookings ?? []) {
      const o = map.get(b.phone) ?? { name: b.ownerName, phone: b.phone, visits: [] };
      o.visits.push(b);
      map.set(b.phone, o);
    }
    const term = q.trim();
    return [...map.values()].filter(
      (o) => !term || o.name.includes(term) || o.phone.includes(term) ||
        o.visits.some((v) => v.catName.includes(term)),
    );
  }, [bookings, q]);

  if (bookings === null)
    return <div className="h-32 animate-pulse rounded-2xl bg-muted" />;

  return (
    <div className="space-y-4">
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="ابحث باسم المالك أو الهاتف أو اسم الحيوان"
        className="rounded-2xl"
      />
      {owners.length === 0 ? (
        <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          لا توجد سجلات بعد
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {owners.map((o) => (
            <div key={o.phone} className="rounded-2xl border bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="font-bold">{o.name}</p>
                <span className="flex items-center gap-1 text-sm text-muted-foreground" dir="ltr">
                  <Phone className="size-3.5" /> {o.phone}
                </span>
              </div>
              <ul className="space-y-2">
                {o.visits.map((v) => (
                  <li key={v.id} className="flex items-center justify-between gap-2 rounded-xl bg-muted/60 px-3 py-2 text-sm">
                    <span className="flex items-center gap-2">
                      <PawPrint className="size-4 text-primary" />
                      {v.catName || "بدون اسم"} · {animalLabel(v.animalType, v.animalOther)}
                    </span>
                    <span className="text-muted-foreground">
                      {formatDate(v.date)} · {v.plan?.doses.length ?? 0} جرعة
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function WhatsappSettings({ passcode }: { passcode: string }) {
  const load = useServerFn(getWhatsappSettings);
  const save = useServerFn(saveWhatsappSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sid, setSid] = useState("");
  const [token, setToken] = useState("");
  const [from, setFrom] = useState("");
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    load({ data: { passcode } })
      .then((s) => {
        setSid(s.accountSid);
        setFrom(s.fromNumber);
        setHasToken(s.hasAuthToken);
      })
      .catch(() => toast.error("تعذّر جلب الإعدادات"))
      .finally(() => setLoading(false));
  }, [load, passcode]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasToken && !token.trim()) return toast.error("أدخل Auth Token");
    setSaving(true);
    try {
      await save({ data: { passcode, accountSid: sid, authToken: token, fromNumber: from } });
      setHasToken(true);
      setToken("");
      toast.success("تم حفظ إعدادات Twilio");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذّر الحفظ");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="h-64 animate-pulse rounded-2xl bg-muted" />;

  return (
    <form onSubmit={submit} className="mx-auto max-w-xl space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">
          <MessageCircle className="size-5" />
        </span>
        <div>
          <h2 className="font-extrabold">ربط واتساب عبر Twilio</h2>
          <p className="text-sm text-muted-foreground">تُستخدم لإرسال تذكيرات التطعيم تلقائياً</p>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="tw-sid">Twilio Account SID</Label>
        <Input id="tw-sid" dir="ltr" value={sid} onChange={(e) => setSid(e.target.value)}
          placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" className="rounded-2xl" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tw-token">Auth Token</Label>
        <Input id="tw-token" dir="ltr" type="password" autoComplete="off" value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder={hasToken ? "•••••••• (محفوظ — اتركه فارغاً للإبقاء عليه)" : "Auth Token"}
          className="rounded-2xl" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tw-from">رقم المرسل (From Phone Number)</Label>
        <Input id="tw-from" dir="ltr" value={from} onChange={(e) => setFrom(e.target.value)}
          placeholder="+9647xxxxxxxxx" className="rounded-2xl" />
      </div>
      <Button type="submit" disabled={saving} className="w-full rounded-2xl">
        {saving && <Loader2 className="size-4 animate-spin" />} حفظ الإعدادات
      </Button>
    </form>
  );
}
