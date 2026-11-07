import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CalendarCheck,
  Check,
  Clock,
  Facebook,
  HeartPulse,
  Instagram,
  MapPin,
  Music2,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  Stethoscope,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/bookings";
import { BookingForm, type BookingFormValues } from "@/components/BookingForm";
import { CLINIC, animalLabel } from "@/lib/clinic";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VetOna | عيادة بيطرية — حجز موعد بخطوة واحدة" },
      {
        name: "description",
        content:
          "عيادة VetOna البيطرية: احجز موعد الفحص لقطتك أو كلبك أو طيورك بإدخال اسمك ورقم هاتفك والتاريخ.",
      },
      { property: "og:title", content: "VetOna | عيادة بيطرية" },
      { property: "og:description", content: "حجز بسيط وسريع في عيادة VetOna البيطرية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [done, setDone] = useState<BookingFormValues | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:py-4">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <img
              src="/logo.png"
              alt="شعار عيادة VetOna البيطرية"
              width={48}
              height={48}
              className="size-10 shrink-0 rounded-2xl bg-card object-contain p-1 ring-1 ring-border sm:size-11"
            />
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-display text-base font-extrabold text-primary sm:text-lg">
                VetOna
              </span>
              <span className="block truncate text-[11px] font-medium text-muted-foreground">
                عيادة بيطرية
              </span>
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-1">
            <Button asChild variant="ghost" size="sm" className="rounded-2xl">
              <Link to="/store" aria-label="متجر المنتجات">
                <ShoppingBag className="size-4" /> <span className="hidden sm:inline">المتجر</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="rounded-2xl">
              <Link to="/track" aria-label="متابعة حالة الأليف">
                <Search className="size-4" /> <span className="hidden sm:inline">المتابعة</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="rounded-2xl">
              <a href={`tel:${CLINIC.phones[0]}`} aria-label="اتصل بالعيادة">
                <Phone className="size-4" /> <span className="hidden sm:inline">اتصل</span>
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-16">
        <section className="bg-hero-mesh grid items-center gap-8 rounded-4xl px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-2 lg:px-8">
          <div className="order-2 lg:order-1">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-secondary-foreground sm:text-xs">
              <ShieldCheck className="size-3.5 shrink-0" /> رعاية بيطرية للقطط والكلاب وطيور الزينة
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              موعد لحيوانك <span className="text-brand-gradient">بخطوة واحدة</span>
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">
              فحص ومتابعة صحية في عيادة VetOna. أكمل الحقول وسنتواصل معك لتأكيد الموعد.
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm font-medium text-foreground">
              <Clock className="size-4 shrink-0 text-primary" /> استقبال يومي — يفضّل الحجز المسبق
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" className="w-full rounded-2xl sm:w-auto">
                <a href="#booking">
                  <CalendarCheck className="size-5" /> احجز الآن
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full rounded-2xl sm:w-auto">
                <a href={`tel:${CLINIC.phones[0]}`}>
                  <Phone className="size-4" /> اتصل بنا
                </a>
              </Button>
            </div>
          </div>
          <img
            src="/logo.png"
            alt="شعار عيادة VetOna: كف قطة يحوي كلباً وقطة"
            width={900}
            height={900}
            className="order-1 mx-auto w-full max-w-[190px] rounded-4xl bg-card object-contain p-4 shadow-[var(--shadow-soft)] sm:max-w-xs sm:p-6 lg:order-2"
          />
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Stethoscope, title: "فحص سريري", text: "تشخيص دقيق ومتابعة حالة ح��وانك" },
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
            <BookingForm onSaved={setDone} />
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
        <p>VetOna — Veterinary clinic · جميع الحقوق محفوظة</p>
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
