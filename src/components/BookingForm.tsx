import { useState } from "react";
import { CalendarCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { bookingInputSchema, bookingWhatsappUrl } from "@/lib/bookings";
import { ANIMAL_TYPES } from "@/lib/clinic";

const empty = {
  ownerName: "",
  phone: "",
  serviceType: "",
  serviceDescription: "",
  animalType: "cat",
  animalOther: "",
  petName: "",
  date: "",
};

export type BookingFormValues = typeof empty;

export function BookingForm({ onSaved }: { onSaved: (booking: BookingFormValues) => void }) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  function set(key: keyof typeof empty, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    const submission = {
      ...form,
      ownerName: form.ownerName,
      phone: form.phone || "",
      serviceDescription: form.serviceDescription,
      date: form.date,
      catName: form.petName || "",
    };
    const result = bookingInputSchema.safeParse(submission);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "تحقق من بيانات الحجز");
      return;
    }

    const snapshot = form;
    const whatsappUrl = bookingWhatsappUrl(result.data);

    setSaving(true);
    setForm(empty);
    onSaved(snapshot);
    toast.success("تم تجهيز الحجز وتحويلك للواتساب");
    window.location.assign(whatsappUrl);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <h2 className="text-lg font-bold">احجز موعداً</h2>

      <div className="space-y-2">
        <Label htmlFor="ownerName">اسم المالك</Label>
        <Input
          id="ownerName"
          required
          value={form.ownerName}
          maxLength={60}
          onChange={(e) => set("ownerName", e.target.value)}
          className="rounded-2xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">رقم الهاتف</Label>
        <Input
          id="phone"
          required
          inputMode="tel"
          placeholder="07XXXXXXXXX"
          value={form.phone}
          maxLength={11}
          onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
          className="rounded-2xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="serviceDescription" className="flex-wrap leading-relaxed">
          وصف الحالة <span className="text-muted-foreground">(فحص طبي، تحميم، أخرى)</span>
        </Label>
        <Textarea
          id="serviceDescription"
          required
          value={form.serviceDescription}
          onChange={(e) => set("serviceDescription", e.target.value)}
          maxLength={1000}
          rows={4}
          className="min-h-28 resize-y rounded-2xl"
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">نوع الحيوان</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {ANIMAL_TYPES.map((t) => (
            <Button
              key={t.value}
              type="button"
              variant="outline"
              onClick={() => set("animalType", t.value)}
              aria-pressed={form.animalType === t.value}
              className={`min-h-11 rounded-2xl border px-3 text-sm font-semibold transition-colors ${
                form.animalType === t.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-card text-foreground hover:bg-accent"
              }`}
            >
              {t.label}
            </Button>
          ))}
        </div>
        {form.animalType === "other" && (
          <div className="space-y-2 pt-1">
            <Label htmlFor="animalOther">اكتب نوع الحيوان</Label>
            <Input
              id="animalOther"
              autoFocus
              placeholder="مثال: أرنب، سلحفاة، هامستر…"
              value={form.animalOther}
              maxLength={40}
              onChange={(e) => set("animalOther", e.target.value)}
              className="rounded-2xl"
            />
          </div>
        )}
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="petName">
          اسم الحيوان <span className="text-muted-foreground">(اختياري)</span>
        </Label>
        <Input
          id="petName"
          value={form.petName}
          maxLength={40}
          onChange={(e) => set("petName", e.target.value)}
          className="rounded-2xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">تاريخ الموعد</Label>
        <Input
          id="date"
          required
          type="date"
          value={form.date}
          onChange={(e) => set("date", e.target.value)}
          className="rounded-2xl"
        />
      </div>

      <Button type="submit" size="lg" disabled={saving} className="w-full rounded-2xl">
        {saving ? (
          <>
            <Loader2 className="size-5 animate-spin" /> جارٍ التسجيل…
          </>
        ) : (
          <>
            <CalendarCheck className="size-5" /> تأكيد الحجز
          </>
        )}
      </Button>
    </form>
  );
}
