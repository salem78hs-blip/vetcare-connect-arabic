import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CalendarX, Loader2, Phone, Search, Syringe } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lookupBookings } from "@/lib/bookings.functions";
import { formatDate, type Booking } from "@/lib/bookings";
import { animalLabel } from "@/lib/clinic";
import logo from "@/assets/vetona-logo.png.asset.json";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "متابعة حالة الأليف | VetOna" },
      {
        name: "description",
        content:
          "أدخل رقم هاتفك لمتابعة مواعيدك في عيادة VetOna البيطرية ومعرفة جرعات التطعيم القادمة وتواريخها.",
      },
      { property: "og:title", content: "متابعة حالة الأليف | VetOna" },
      {
        property: "og:description",
        content: "تابع مواعيدك وجرعات التطعيم برقم الهاتف فقط.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  const lookup = useServerFn(lookupBookings);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Booking[] | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^07\d{9}$/.test(phone)) {
      toast.error("رقم الهاتف يجب أن يكون 11 رقماً ويبدأ بـ 07");
      return;
    }
    setLoading(true);
    try {
      const data = await lookup({ data: { phone } });
      setResults(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذّر جلب الحجوزات");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto grid max-w-3xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <img
              src={logo.url}
              alt="شعار عيادة VetOna البيطرية"
              width={44}
              height={44}
              className="size-10 shrink-0 rounded-2xl bg-card object-contain p-1 ring-1 ring-border"
            />
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-display text-base font-extrabold text-primary">
                VetOna
              </span>
              <span className="block truncate text-[11px] text-muted-foreground">
                متابعة حالة الأليف
              </span>
            </span>
          </Link>
          <Button asChild variant="ghost" size="sm" className="shrink-0 rounded-2xl">
            <Link to="/">الرئيسية</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 pb-20">
        <h1 className="text-2xl font-extrabold sm:text-3xl">تابع مواعيد حيوانك</h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          أدخل رقم الهاتف الذي حجزت به، وستظهر مواعيدك وجرعات التطعيم المحددة لك من العيادة.
        </p>

        <form onSubmit={submit} className="card-soft mt-6 space-y-4 p-5 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="lookupPhone">رقم الهاتف</Label>
            <Input
              id="lookupPhone"
              inputMode="tel"
              dir="ltr"
              placeholder="07XXXXXXXXX"
              maxLength={11}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="rounded-2xl"
            />
          </div>
          <Button type="submit" size="lg" disabled={loading} className="w-full rounded-2xl">
            {loading ? (
              <>
                <Loader2 className="size-5 animate-spin" /> جارٍ البحث…
              </>
            ) : (
              <>
                <Search className="size-5" /> عرض حجوزاتي
              </>
            )}
          </Button>
        </form>

        {results !== null && (
          <section className="mt-8 space-y-3">
            {results.length === 0 ? (
              <div className="card-soft px-6 py-12 text-center">
                <span className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-secondary text-primary">
                  <CalendarX className="size-7" />
                </span>
                <h2 className="mt-4 text-base font-bold">لا يوجد حجز بهذا الرقم</h2>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  تأكد من الرقم، أو احجز موعداً جديداً من الصفحة الرئيسية.
                </p>
                <Button asChild className="mt-6 rounded-2xl">
                  <Link to="/">احجز موعداً</Link>
                </Button>
              </div>
            ) : (
              results.map((b) => (
                <article key={b.id} className="card-soft p-5">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-bold">
                        {b.catName || animalLabel(b.animalType, b.animalOther)}
                      </h2>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        موعد الزيارة: {formatDate(b.date)}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-[11px] font-bold text-secondary-foreground">
                      {animalLabel(b.animalType, b.animalOther)}
                    </span>
                  </div>

                  <div className="mt-4 rounded-2xl bg-muted p-4">
                    <h3 className="flex items-center gap-2 text-xs font-bold">
                      <Syringe className="size-4 text-primary" /> خطة التطعيم
                    </h3>
                    {b.plan && b.plan.doses.length > 0 ? (
                      <ol className="mt-3 space-y-2">
                        {b.plan.doses.map((d, i) => (
                          <li
                            key={d.id || `${d.vaccine}-${i}`}
                            className="flex items-center justify-between gap-3 rounded-xl bg-card px-3 py-2 text-xs"
                          >
                            <span className="min-w-0 truncate font-semibold">
                              {i + 1}. {d.vaccine}
                            </span>
                            <span className="shrink-0 text-muted-foreground">
                              {formatDate(d.date)}
                            </span>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        لم تُحدَّد الجرعات بعد، سيحددها الطبيب بعد الزيارة.
                      </p>
                    )}
                  </div>
                </article>
              ))
            )}
          </section>
        )}

        <p className="mt-8 text-center text-xs text-muted-foreground">
          للاستفسار: <span dir="ltr">0776 019 8800</span>
        </p>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <Phone className="mx-auto mb-2 size-4 text-primary" />
        <p>VetOna — Veterinary clinic</p>
        <Link to="/admin" className="mt-2 inline-block text-[10px] opacity-45 transition-opacity hover:opacity-80">
          دخول الموظفين
        </Link>
      </footer>
    </div>
  );
}
