import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CalendarCheck,
  Check,
  Clock,
  Facebook,
  Instagram,
  MapPin,
  Music2,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addBooking, formatDate } from "@/lib/bookings";
import { ANIMAL_TYPES, CLINIC, animalLabel } from "@/lib/clinic";
import logo from "@/assets/vetona-logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VetOna | عيادة بيطرية — حجز موعد بخطوة واحدة" },
      {
        name: "description",
        content:
          "عيادة VetOna البيطرية: احجز موعد الفحص أو التطعيم لقطتك أو كلبك أو طيورك بإدخال اسمك ورقم هاتفك والتاريخ.",
      },
      { property: "og:title", content: "VetOna | عيادة بيطرية" },
      { property: "og:description", content: "حجز بسيط وسريع في عيادة VetOna البيطرية." },
    ],
  }),
  component: HomePage,
});

const empty = {
  ownerName: "",
  phone: "",
  animalType: "cat",
  animalOther: "",
  petName: "",
  date: "",
};

function HomePage() {
  const [form, setForm] = useState(empty);
  const [done, setDone] = useState<typeof empty | null>(null);

  function set(key: keyof typeof empty, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const error =
      form.ownerName.trim().length < 2
        ? "اكتب اسم المالك"
        : !/^07\d{9}$/.test(form.phone.trim())
          ? "رقم الهاتف يجب أن يكون 11 رقماً ويبدأ بـ 07"
            : !form.animalType
              ? "اختر نوع الحيوان"
              : form.animalType === "other" && form.animalOther.trim().length < 2
                ? "اكتب نوع الحيوان"
                : !form.date
                  ? "اختر تاريخ الموعد"
                  : null;
    if (error) {
      toast.error(error);
      return;
    }

    addBooking({
      ownerName: form.ownerName.trim(),
      phone: form.phone.trim(),
      animalType: form.animalType,
      animalOther: form.animalType === "other" ? form.animalOther.trim() : "",
      catName: form.petName.trim(),
      date: form.date,
    });
    setDone(form);
    setForm(empty);
    toast.success("تم تسجيل الحجز");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo.url}
            alt="شعار عيادة VetOna البيطرية"
            width={48}
            height={48}
            className="size-11 rounded-2xl bg-card object-contain p-1 ring-1 ring-border"
          />
          <span className="leading-tight">
            <span className="block font-display text-lg font-extrabold text-primary">VetOna</span>
            <span className="block text-[11px] font-medium text-muted-foreground">
              عيادة بيطرية
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm" className="rounded-2xl">
            <a href={`tel:${CLINIC.phones[0]}`}>
              <Phone className="size-4" /> اتصل
            </a>
          </Button>
          <Button asChild variant="ghost" size="sm" className="rounded-2xl">
            <Link to="/admin">الإدارة</Link>
          </Button>
          </div>
        </div>
      </header>


      <main className="mx-auto max-w-5xl px-4 pb-16">
        <section className="bg-hero-mesh grid items-center gap-10 rounded-4xl px-2 py-10 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              <ShieldCheck className="size-3.5" /> رعاية بيطرية للقطط والكلاب وطيور الزينة
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
              موعد لحيوانك <span className="text-brand-gradient">بخطوة واحدة</span>
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              فحص، تطعيم، ومتابعة صحية في عيادة VetOna. أكمل الحقول وسنتواصل معك لتأكيد الموعد.
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm font-medium text-foreground">
              <Clock className="size-4 text-primary" /> استقبال يومي — يفضّل الحجز المسبق
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild size="lg" className="rounded-2xl">
                <a href="#booking">
                  <CalendarCheck className="size-5" /> احجز الآن
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-2xl">
                <a href={`tel:${CLINIC.phones[0]}`}>
                  <Phone className="size-4" /> اتصل بنا
                </a>
              </Button>
            </div>
          </div>
          <img
            src={logo.url}
            alt="شعار عيادة VetOna: كف قطة يحوي كلباً وقطة"
            width={900}
            height={900}
            className="mx-auto w-full max-w-xs rounded-4xl bg-card object-contain p-6 shadow-[var(--shadow-soft)]"
          />
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Stethoscope, title: "فحص سريري", text: "تشخيص دقيق ومتابعة حالة حيوانك" },
            { icon: Syringe, title: "تطعيمات", text: "جدول جرعات منظّم مع تذكير بالموعد" },
            { icon: HeartPulse, title: "رعاية ومتابعة", text: "إرشادات تغذية وعناية بعد الزيارة" },
          ].map((f) => (
            <div
              key={f.title}
              className="card-soft p-5 transition-shadow hover:shadow-[var(--shadow-lift)]"
            >
              <span className="flex size-10 items-center justify-center rounded-2xl bg-secondary text-primary">
                <f.icon className="size-5" />
              </span>
              <h2 className="mt-3 text-sm font-bold">{f.title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </section>

        <section id="booking" className="card-soft mx-auto mt-10 max-w-lg p-6 sm:p-8 scroll-mt-24">
          {done ? (
            <div className="text-center">
              <span className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-secondary text-primary">
                <Check className="size-7" />
              </span>
              <h2 className="mt-4 text-lg font-bold">تم استلام الحجز</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {animalLabel(done.animalType, done.animalOther)}
                {done.petName ? ` — ${done.petName}` : ""} — {formatDate(done.date)}
              </p>
              <Button className="mt-6 rounded-2xl" onClick={() => setDone(null)}>
                حجز موعد آخر
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <h2 className="text-lg font-bold">احجز موعداً</h2>

              <div className="space-y-2">
                <Label htmlFor="ownerName">اسم المالك</Label>
                <Input
                  id="ownerName"
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
                  inputMode="tel"
                  placeholder="07XXXXXXXXX"
                  value={form.phone}
                  maxLength={11}
                  onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
                  className="rounded-2xl"
                />
              </div>

              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">نوع الحيوان</legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {ANIMAL_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => set("animalType", t.value)}
                      aria-pressed={form.animalType === t.value}
                      className={`min-h-11 rounded-2xl border px-3 text-sm font-semibold transition-colors ${
                        form.animalType === t.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-card text-foreground hover:bg-accent"
                      }`}
                    >
                      {t.label}
                    </button>
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
                  type="date"
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  className="rounded-2xl"
                />
              </div>

              <Button type="submit" size="lg" className="w-full rounded-2xl">
                <CalendarCheck className="size-5" /> تأكيد الحجز
              </Button>
            </form>
          )}
        </section>

        <section className="mt-14 grid gap-4 sm:grid-cols-3">
          <div className="card-soft p-6">
            <h2 className="flex items-center gap-2 text-base font-bold">
              <Phone className="size-4 text-primary" /> الهاتف
            </h2>
            <div className="mt-3 space-y-2">
              {CLINIC.phones.map((p, i) => (
                <a
                  key={p}
                  href={`tel:${p}`}
                  dir="ltr"
                  className="block text-sm font-semibold text-foreground transition-colors hover:text-primary"
                >
                  {CLINIC.phonesDisplay[i]}
                </a>
              ))}
            </div>
          </div>

          <div className="card-soft p-6">
            <h2 className="flex items-center gap-2 text-base font-bold">
              <MapPin className="size-4 text-primary" /> العنوان
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{CLINIC.address}</p>
            <a
              href={CLINIC.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
            >
              الموقع على الخريطة
            </a>
          </div>

          <div className="card-soft p-6">
            <h2 className="text-base font-bold">تابعنا</h2>
            <div className="mt-3 flex flex-col gap-2">
              <SocialLink href={CLINIC.instagram} label="إنستغرام">
                <Instagram className="size-4" />
              </SocialLink>
              <SocialLink href={CLINIC.tiktok} label="تيك توك">
                <Music2 className="size-4" />
              </SocialLink>
              <SocialLink href={CLINIC.facebook} label="فيسبوك">
                <Facebook className="size-4" />
              </SocialLink>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        VetOna — Veterinary clinic · جميع الحقوق محفوظة
      </footer>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-2xl px-2 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent hover:text-primary"
    >
      <span className="flex size-8 items-center justify-center rounded-2xl bg-secondary text-primary">
        {children}
      </span>
      {label}
    </a>
  );
}
