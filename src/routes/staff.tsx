import { createFileRoute } from "@tanstack/react-router";
import { Award, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteLayout, useBooking } from "@/components/site/SiteLayout";
import { doctors } from "@/data/clinic";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "كادر الأطباء البيطريين | عيادة الرفيق" },
      {
        name: "description",
        content:
          "تعرّف على أطباء عيادة الرفيق البيطرية: باطنية الحيوانات الصغيرة، الجراحة، الجلدية والتطعيمات، وطب الطيور.",
      },
      { property: "og:title", content: "كادر الأطباء البيطريين | عيادة الرفيق" },
      { property: "og:description", content: "فريق بيطري متخصص بخبرة تتجاوز 40 سنة مجتمعة." },
    ],
  }),
  component: StaffPage,
});

function StaffPage() {
  const { openBooking } = useBooking();

  return (
    <SiteLayout>
      <section className="bg-hero-mesh">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h1 className="text-3xl font-extrabold sm:text-4xl">كادر الأطباء</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            أطباء مختصون بخبرة عملية طويلة، يعملون كفريق واحد لضمان أفضل تشخيص وخطة علاج لأليفك.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          {doctors.map((d) => (
            <Card key={d.id} className="rounded-3xl border-border/70">
              <CardContent className="flex gap-5 p-6">
                <span className="flex size-20 shrink-0 items-center justify-center rounded-3xl bg-brand-gradient text-xl font-bold text-primary-foreground">
                  {d.initials}
                </span>
                <div className="flex-1">
                  <h2 className="text-lg font-bold">{d.name}</h2>
                  <p className="mt-1 text-sm font-semibold text-primary">{d.specialty}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.bio}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-2.5 py-1.5 font-semibold text-primary">
                      <Star className="size-3.5" /> {d.rating}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-muted px-2.5 py-1.5 font-semibold text-muted-foreground">
                      <Award className="size-3.5" /> خبرة {d.experience} سنوات
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-4 rounded-2xl"
                    onClick={() => openBooking()}
                  >
                    احجز مع {d.name.split(" ")[1] ?? d.name}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
