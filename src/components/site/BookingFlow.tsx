import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  MessageCircle,
  PawPrint,
  Sparkles,
  Stethoscope,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { ServiceIcon } from "@/components/site/service-icon";
import { cn } from "@/lib/utils";
import {
  clinic,
  doctors,
  formatIQD,
  petTypeLabels,
  services,
  timeSlots,
  type PetType,
} from "@/data/clinic";

type Draft = {
  petType: PetType | null;
  petName: string;
  petAge: string;
  petBreed: string;
  serviceId: string | null;
  doctorId: string | null;
  date: Date | undefined;
  time: string | null;
  ownerName: string;
  ownerPhone: string;
  notes: string;
};

const steps = [
  { title: "بيانات الأليف", icon: PawPrint },
  { title: "الخدمة والطبيب", icon: Stethoscope },
  { title: "التاريخ والوقت", icon: CalendarDays },
  { title: "تأكيد الحجز", icon: UserRound },
];

/** Deterministic pseudo-availability so slots feel "live" without a backend. */
function unavailableSlots(date: Date | undefined) {
  if (!date) return new Set<string>();
  const seed = date.getDate() + date.getMonth();
  return new Set(timeSlots.filter((_, i) => (i * 7 + seed) % 4 === 0));
}

function toArabicDate(date: Date) {
  return date.toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BookingFlow({
  initialServiceId,
  onDone,
}: {
  initialServiceId?: string | null;
  onDone?: () => void;
}) {
  const [step, setStep] = useState(0);
  const [ref, setRef] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>({
    petType: null,
    petName: "",
    petAge: "",
    petBreed: "",
    serviceId: initialServiceId ?? null,
    doctorId: null,
    date: undefined,
    time: null,
    ownerName: "",
    ownerPhone: "",
    notes: "",
  });

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const blocked = useMemo(() => unavailableSlots(draft.date), [draft.date]);
  const service = services.find((s) => s.id === draft.serviceId);
  const doctor = doctors.find((d) => d.id === draft.doctorId);

  function validateStep() {
    if (step === 0) {
      if (!draft.petType) return "اختر نوع الحيوان الأليف";
      if (draft.petName.trim().length < 2) return "اكتب اسم الأليف (حرفان على الأقل)";
      if (!draft.petAge.trim()) return "اكتب عمر الأليف التقريبي";
      return null;
    }
    if (step === 1) {
      if (!draft.serviceId) return "اختر نوع الخدمة المطلوبة";
      if (!draft.doctorId) return "اختر الطبيب المعالج";
      return null;
    }
    if (step === 2) {
      if (!draft.date) return "اختر تاريخ الموعد";
      if (!draft.time) return "اختر وقتاً متاحاً";
      return null;
    }
    if (draft.ownerName.trim().length < 3) return "اكتب اسم المالك بالكامل";
    if (!/^07\d{9}$/.test(draft.ownerPhone.trim()))
      return "رقم الهاتف يجب أن يبدأ بـ 07 ويكون 11 رقماً";
    return null;
  }

  function next() {
    const error = validateStep();
    if (error) {
      toast.error(error);
      return;
    }
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    const code = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    setRef(code);
    toast.success(`تم تأكيد الحجز برقم ${code}`);
  }

  const ticket = ref
    ? `مرحباً ${clinic.name}%0A رقم الحجز: ${ref}%0A الأليف: ${draft.petName}%0A الخدمة: ${service?.name ?? "-"}%0A الطبيب: ${doctor?.name ?? "-"}%0A الموعد: ${draft.date ? toArabicDate(draft.date) : ""} - ${draft.time ?? ""}`
    : "";

  if (ref) {
    return (
      <div className="py-4 text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-accent">
          <CheckCircle2 className="size-10 text-primary" />
        </div>
        <h3 className="mt-5 text-2xl font-bold">تم تأكيد حجزك بنجاح</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          سنرسل لك تذكيراً قبل الموعد. يرجى الحضور 10 دقائق مبكراً.
        </p>
        <div className="mx-auto mt-6 max-w-md card-soft p-5 text-right">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-sm text-muted-foreground">رقم الحجز</span>
            <Badge className="rounded-xl bg-primary text-primary-foreground">{ref}</Badge>
          </div>
          <dl className="mt-3 space-y-2.5 text-sm">
            <Row label="الأليف">
              {petTypeLabels[draft.petType!].emoji} {draft.petName} — {petTypeLabels[draft.petType!].label}
            </Row>
            <Row label="الخدمة">{service?.name}</Row>
            <Row label="الطبيب">{doctor?.name}</Row>
            <Row label="الموعد">
              {draft.date ? toArabicDate(draft.date) : ""} — {draft.time}
            </Row>
            <Row label="الكلفة التقديرية">{service ? formatIQD(service.price) : "-"}</Row>
          </dl>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="rounded-2xl">
            <a href={`https://wa.me/${clinic.whatsapp}?text=${ticket}`} target="_blank" rel="noreferrer">
              <MessageCircle className="size-4" />
              إرسال التذكرة عبر WhatsApp
            </a>
          </Button>
          <Button variant="outline" size="lg" className="rounded-2xl" onClick={() => onDone?.()}>
            إغلاق
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stepper */}
      <ol className="mb-6 flex items-center gap-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const active = i === step;
          const done = i < step;
          return (
            <li key={s.title} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-xl border transition-colors",
                  active && "border-primary bg-primary text-primary-foreground",
                  done && "border-primary/30 bg-accent text-primary",
                  !active && !done && "border-border bg-muted text-muted-foreground",
                )}
              >
                {done ? <CheckCircle2 className="size-4" /> : <Icon className="size-4" />}
              </div>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {s.title}
              </span>
              {i < steps.length - 1 && (
                <span className={cn("h-px flex-1", done ? "bg-primary/40" : "bg-border")} />
              )}
            </li>
          );
        })}
      </ol>

      {step === 0 && (
        <div className="space-y-5">
          <div>
            <Label className="mb-2 block">نوع الأليف</Label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(Object.keys(petTypeLabels) as PetType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("petType", t)}
                  className={cn(
                    "rounded-2xl border p-4 text-center transition-all hover:border-primary/50",
                    draft.petType === t
                      ? "border-primary bg-accent shadow-soft"
                      : "border-border bg-card",
                  )}
                >
                  <span className="block text-2xl">{petTypeLabels[t].emoji}</span>
                  <span className="mt-1 block text-sm font-medium">{petTypeLabels[t].label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="اسم الأليف">
              <Input
                value={draft.petName}
                onChange={(e) => set("petName", e.target.value)}
                placeholder="مثال: مشمش"
                maxLength={40}
              />
            </Field>
            <Field label="العمر">
              <Input
                value={draft.petAge}
                onChange={(e) => set("petAge", e.target.value)}
                placeholder="مثال: سنتان"
                maxLength={30}
              />
            </Field>
            <Field label="السلالة (اختياري)" className="sm:col-span-2">
              <Input
                value={draft.petBreed}
                onChange={(e) => set("petBreed", e.target.value)}
                placeholder="مثال: شيرازي"
                maxLength={40}
              />
            </Field>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <Label className="mb-2 block">الخدمة المطلوبة</Label>
            <div className="grid gap-3 sm:grid-cols-2">
              {services.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => set("serviceId", s.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl border p-4 text-right transition-all hover:border-primary/50",
                    draft.serviceId === s.id
                      ? "border-primary bg-accent shadow-soft"
                      : "border-border bg-card",
                  )}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                    <ServiceIcon name={s.icon} className="size-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{s.name}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {s.duration} دقيقة · {formatIQD(s.price)}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-2 block">الطبيب المعالج</Label>
            <div className="grid gap-3 sm:grid-cols-2">
              {doctors.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => set("doctorId", d.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border p-4 text-right transition-all hover:border-primary/50",
                    draft.doctorId === d.id
                      ? "border-primary bg-accent shadow-soft"
                      : "border-border bg-card",
                  )}
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-primary-foreground">
                    {d.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{d.name}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{d.specialty}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
          <div className="card-soft p-2">
            <Calendar
              mode="single"
              dir="rtl"
              selected={draft.date}
              onSelect={(d) => {
                set("date", d);
                set("time", null);
              }}
              disabled={{ before: new Date() }}
              className="mx-auto"
            />
          </div>
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4 text-primary" />
              {draft.date ? `الأوقات المتاحة — ${toArabicDate(draft.date)}` : "اختر تاريخاً لعرض الأوقات"}
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {timeSlots.map((t) => {
                const off = blocked.has(t) || !draft.date;
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={off}
                    onClick={() => set("time", t)}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-sm font-medium transition-all",
                      off && "cursor-not-allowed border-dashed border-border bg-muted text-muted-foreground/60 line-through",
                      !off && draft.time === t && "border-primary bg-primary text-primary-foreground",
                      !off && draft.time !== t && "border-border bg-card hover:border-primary/50",
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              الأوقات المشطوبة محجوزة مسبقاً. أوقات العمل: {clinic.hours}
            </p>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <Field label="اسم المالك">
              <Input
                value={draft.ownerName}
                onChange={(e) => set("ownerName", e.target.value)}
                placeholder="الاسم الثلاثي"
                maxLength={60}
              />
            </Field>
            <Field label="رقم الهاتف">
              <Input
                value={draft.ownerPhone}
                onChange={(e) => set("ownerPhone", e.target.value.replace(/\D/g, "").slice(0, 11))}
                placeholder="07XXXXXXXXX"
                inputMode="numeric"
                dir="ltr"
                className="text-right"
              />
            </Field>
            <Field label="ملاحظات (اختياري)">
              <Textarea
                value={draft.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="أي أعراض أو تفاصيل تريد إبلاغ الطبيب بها"
                maxLength={500}
                rows={4}
              />
            </Field>
          </div>
          <div className="card-soft h-fit bg-accent p-5">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <Sparkles className="size-4" /> ملخص الحجز
            </div>
            <dl className="mt-4 space-y-2.5 text-sm">
              <Row label="الأليف">
                {draft.petType ? petTypeLabels[draft.petType].emoji : ""} {draft.petName}
              </Row>
              <Row label="السلالة / العمر">{`${draft.petBreed || "غير محدد"} · ${draft.petAge}`}</Row>
              <Row label="الخدمة">{service?.name}</Row>
              <Row label="الطبيب">{doctor?.name}</Row>
              <Row label="الموعد">
                {draft.date ? toArabicDate(draft.date) : ""} — {draft.time}
              </Row>
              <Row label="الكلفة التقديرية">{service ? formatIQD(service.price) : "-"}</Row>
            </dl>
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
        <Button
          variant="ghost"
          className="rounded-2xl"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ArrowRight className="size-4" />
          السابق
        </Button>
        <span className="text-xs text-muted-foreground">الخطوة {step + 1} من 4</span>
        <Button className="rounded-2xl" onClick={next}>
          {step === 3 ? "تأكيد الحجز" : "التالي"}
          <ArrowLeft className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-2 block">{label}</Label>
      {children}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  );
}
