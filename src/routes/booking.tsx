import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BookingFlow } from "@/components/site/BookingFlow";
import { clinic } from "@/data/clinic";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "حجز موعد بيطري إلكتروني | عيادة الرفيق" },
      {
        name: "description",
        content:
          "احجز موعداً لحيوانك الأليف خلال دقيقة: اختر الخدمة والطبيب والوقت المتاح واحصل على رقم حجز فوري.",
      },
      { property: "og:title", content: "حجز موعد بيطري إلكتروني | عيادة الرفيق" },
      { property: "og:description", content: "أربع خطوات بسيطة لتأكيد موعد أليفك في العيادة." },
    ],
  }),
  component: BookingPage,
});

function BookingPage() {
  return (
    <SiteLayout>
      <section className="bg-hero-mesh">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h1 className="text-3xl font-extrabold sm:text-4xl">حجز موعد</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            املأ الخطوات التالية وسيصلك تأكيد الحجز على الواتساب. الحالات الطارئة تُستقبل مباشرة دون
            موعد.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px]">
        <Card className="rounded-3xl border-border/70">
          <CardContent className="p-6 sm:p-8">
            <BookingFlow />
          </CardContent>
        </Card>

        <aside className="space-y-4">
          <div className="card-soft p-6">
            <h2 className="text-sm font-bold">معلومات العيادة</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                {clinic.address}
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                {clinic.hours}
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                <a href={`tel:${clinic.phone}`} dir="ltr" className="hover:text-primary">
                  {clinic.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-primary" />
                <a
                  href={`https://wa.me/${clinic.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary"
                >
                  تواصل عبر واتساب
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6">
            <h2 className="text-sm font-bold text-destructive">حالة طارئة؟</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              في حالات الحوادث، التسمم، ضيق التنفس أو الولادة المتعسرة — اتصل بنا فوراً ولا تنتظر
              الحجز.
            </p>
            <a
              href={`tel:${clinic.phone}`}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground"
            >
              <Phone className="size-4" /> خط الطوارئ
            </a>
          </div>
        </aside>
      </section>
    </SiteLayout>
  );
}
