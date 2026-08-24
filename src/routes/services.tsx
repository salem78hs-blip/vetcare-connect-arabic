import { createFileRoute } from "@tanstack/react-router";
import { Clock, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteLayout, useBooking } from "@/components/site/SiteLayout";
import { ServiceIcon } from "@/components/site/service-icon";
import { formatIQD, services } from "@/data/clinic";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "الخدمات البيطرية والأسعار | عيادة الرفيق" },
      {
        name: "description",
        content:
          "قائمة خدمات عيادة الرفيق البيطرية: كشف عام، تطعيمات، حلاقة، فحوصات وأشعة، جراحة، وعناية بالأسنان مع الأسعار ومدة الزيارة.",
      },
      { property: "og:title", content: "الخدمات البيطرية والأسعار | عيادة الرفيق" },
      { property: "og:description", content: "أسعار واضحة ومدة زيارة معروفة لكل خدمة بيطرية." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { openBooking } = useBooking();

  return (
    <SiteLayout>
      <section className="bg-hero-mesh">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h1 className="text-3xl font-extrabold sm:text-4xl">الخدمات والأسعار</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            نوفّر رعاية كاملة من الفحص الروتيني حتى العمليات الجراحية. الأسعار تقديرية وقد تتغير حسب
            حالة الأليف ووزنه، ويتم إبلاغك بأي فرق قبل بدء الإجراء.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Card key={s.id} className="rounded-3xl border-border/70">
              <CardContent className="flex h-full flex-col p-6">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
                  <ServiceIcon name={s.icon} className="size-6" />
                </span>
                <h2 className="mt-4 text-lg font-bold">{s.name}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-2.5 py-1.5 font-semibold text-primary">
                    <Wallet className="size-3.5" /> {formatIQD(s.price)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-muted px-2.5 py-1.5 font-semibold text-muted-foreground">
                    <Clock className="size-3.5" /> {s.duration} دقيقة
                  </span>
                </div>
                <Button className="mt-5 rounded-2xl" onClick={() => openBooking(s.id)}>
                  احجز هذه الخدمة
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
