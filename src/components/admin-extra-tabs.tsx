import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Loader2, MessageCircle, Pencil, PawPrint, Phone, Plus, Tags, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { animalLabel } from "@/lib/clinic";
import { formatDate, type Booking } from "@/lib/bookings";
import { deleteCategory, saveCategory } from "@/lib/store.functions";
import type { Category } from "@/lib/store";
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
    if (!hasToken && !token.trim()) {
      toast.error("أدخل Auth Token");
      return;
    }
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

export function CategoriesManager({
  passcode,
  categories,
  onChanged,
}: {
  passcode: string;
  categories: Category[];
  onChanged: () => void;
}) {
  const save = useServerFn(saveCategory);
  const remove = useServerFn(deleteCategory);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(fn: () => Promise<unknown>, msg: string) {
    setBusy(true);
    try {
      await fn();
      toast.success(msg);
      onChanged();
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حدث خطأ");
      return false;
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mb-8 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Tags className="size-5 text-primary" />
        <h2 className="text-lg font-extrabold">أقسام المتجر</h2>
      </div>
      <form
        className="mb-4 flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          if (await run(() => save({ data: { passcode, name: newName } }), "تمت إضافة القسم"))
            setNewName("");
        }}
      >
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="اسم قسم جديد"
          maxLength={40}
          className="rounded-2xl"
        />
        <Button type="submit" disabled={busy || newName.trim().length < 2} className="rounded-2xl">
          <Plus className="size-4" /> إضافة
        </Button>
      </form>
      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">لا توجد أقسام بعد</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {categories.map((c) =>
            editId === c.id ? (
              <li key={c.id} className="flex items-center gap-1 rounded-full border bg-background p-1">
                <Input
                  value={editName}
                  autoFocus
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-8 w-36 rounded-full"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 rounded-full"
                  aria-label="حفظ القسم"
                  disabled={busy}
                  onClick={async () => {
                    if (await run(() => save({ data: { passcode, id: c.id, name: editName } }), "تم تعديل القسم"))
                      setEditId(null);
                  }}
                >
                  <Check className="size-4" />
                </Button>
                <Button size="icon" variant="ghost" className="size-8 rounded-full" aria-label="إلغاء" onClick={() => setEditId(null)}>
                  <X className="size-4" />
                </Button>
              </li>
            ) : (
              <li key={c.id} className="flex items-center gap-1 rounded-full bg-secondary py-1 pe-1 ps-4 text-sm font-bold">
                {c.name}
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7 rounded-full"
                  aria-label={`تعديل ${c.name}`}
                  onClick={() => {
                    setEditId(c.id);
                    setEditName(c.name);
                  }}
                >
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7 rounded-full text-destructive"
                  aria-label={`حذف ${c.name}`}
                  disabled={busy}
                  onClick={() => {
                    if (!confirm(`حذف قسم «${c.name}»؟ المنتجات التابعة ستبقى بدون قسم.`)) return;
                    void run(() => remove({ data: { passcode, id: c.id } }), "تم حذف القسم");
                  }}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </li>
            ),
          )}
        </ul>
      )}
    </section>
  );
}
