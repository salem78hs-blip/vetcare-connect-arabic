import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarCheck,
  HeartPulse,
  Phone,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Syringe,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SiteLayout, useBooking } from "@/components/site/SiteLayout";
import { ServiceIcon } from "@/components/site/service-icon";
import { clinic, doctors, formatIQD, services } from "@/data/clinic";
import heroImage from "@/assets/hero-vet.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "عيادة الرفيق البيطرية | رعاية متكاملة لحيوانك الأليف" },
      {
        name: "description",
        content:
          "عيادة بيطرية في بغداد: كشف عام، تطعيمات، جراحة، وحلاقة، مع حجز مواعيد إلكتروني وسجل طبي رقمي لأليفك.",
      },
      { property: "og:title", content: "عيادة الرفيق البيطرية | رعاية متكاملة لحيوانك الأليف" },
      {
        property: "og:description",
        content: "احجز موعدك خلال دقيقة وتابع سجل أليفك الطبي وبطاقة التحصين الرقمية.",
      },
    ],
  }),
  component: HomePage,
});

const stats = [
  { icon: Users, value: "+4,800", label: "أليف تحت رعايتنا" },
  { icon: Syringe, value: "+12,000", label: "جرعة تحصين" },
  { icon: BadgeCheck, value: "9 سنوات", label: "خبرة في العراق" },
  { icon: Star, value: "4.9/5", label: "تقييم المراجعين" },
];

const features = [
  {
    icon: ShieldCheck,
    title: "تجهيزات معقّمة ومعتمدة",
    text: "غرف فحص وعمليات بمعايير تعقيم صارمة وأجهزة تشخيص حديثة.",
  },
  {
    icon: HeartPulse,
    title: "طوارئ على مدار الساعة",
    text: "فريق استجابة سريع لحالات الحوادث والتسمم والولادات المتعسرة.",
  },
  {
    icon: CalendarCheck,
    title: "تذكيرات تطعيم تلقائية",
    text: "نُرسل تنبيهات واتساب قبل موعد كل جرعة حتى لا يفوتك شيء.",
  },
];

const testimonials = [
  { name: "أحمد كاظم", pet: "مشمش - قط شيرازي", text: "تعامل راقٍ وتشخيص دقيق، والسجل الطبي الرقمي وفّر علي متابعة كثيرة." },
  { name: "ليلى عبد الله", pet: "روكي - جيرمن شيبرد", text: "أجروا عملية لروكي ومتابعة ما بعد الجراحة كانت ممتازة يوماً بيوم." },
  { name: "مريم صالح", pet: "بيسي - قطة", text: "التذكيرات على الواتساب رائعة، ما نسيت أي جرعة تحصين بعدها." },
];

const faqs = [
  { q: "هل أحتاج موعداً مسبقاً؟", a: "ننصح بالحجز المسبق لتقليل الانتظار، لكن حالات الطوارئ تُستقبل فوراً دون موعد." },
  { q: "ما هي أسعار الكشف؟", a: `يبدأ الكشف العام من ${formatIQD(services[0]!.price)}، وتختلف الأسعار حسب الخدمة والحالة.` },
  { q: "هل تعالجون الطيور والحيوانات الغريبة؟", a: "نعم، لدينا طبيب متخصص بطب الطيور والأرانب والزواحف." },
  { q: "كيف أتابع سجل أليفي الطبي؟", a: "من صفحة «متابعة حالة أليف» أدخل رمز الملف أو رقم هاتفك لعرض السجل وبطاقة التحصين." },
];

function HomePage() {
  const { openBooking } = useBooking();

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-hero-mesh relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <Badge className="rounded-full px-3 py-1 text-xs">
              <Sparkles className="size-3.5" /> رعاية بيطرية بمعايير عالمية
            </Badge>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              صحة <span className="text-brand-gradient">حيوانك الأليف</span> تبدأ من هنا
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {clinic.name} تقدّم الكشف العام، التطعيمات، الجراحة، الحلاقة والفحوصات المخبرية — مع
              حجز إلكتروني بسيط وسجل طبي رقمي يمكنك متابعته في أي وقت.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" className="rounded-2xl shadow-soft" onClick={() => openBooking()}>
                <CalendarCheck className="size-5" /> احجز موعداً الآن
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-2xl">
                <Link to="/lookup">
                  <Search className="size-5" /> تابع حالة أليفك
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="rounded-2xl text-destructive">
                <a href={`tel:${clinic.phone}`}>
                  <Phone className="size-5" /> طوارئ فورية
                </a>
              </Button>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">{clinic.hours}</p>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="طبيب بيطري يفحص قطاً داخل عيادة الرفيق البيطرية"
              className="h-[340px] w-full rounded-4xl object-cover shadow-soft sm:h-[440px]"
              loading="eager"
            />
            <Card className="absolute -bottom-6 start-4 w-56 rounded-3xl border-border/70 shadow-soft">
              <CardContent className="flex items-center gap-3 p-4">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-accent text-primary">
                  <HeartPulse className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-bold">استجابة الطوارئ</p>
                  <p className="text-xs text-muted-foreground">أقل من 15 دقيقة</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto -mt-2 max-w-7xl px-4 pt-14 sm:px-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card-soft flex items-center gap-3 p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
                <s.icon className="size-5" />
              </span>
              <div>
                <p className="text-lg font-extrabold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">خدماتنا الطبية</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              كل ما يحتاجه أليفك تحت سقف واحد، بأسعار واضحة ومدة زيارة معروفة مسبقاً.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-2xl">
            <Link to="/services">
              كل الخدمات <ArrowLeft className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Card key={s.id} className="group rounded-3xl border-border/70 transition-shadow hover:shadow-soft">
              <CardContent className="p-6">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-accent text-primary transition-colors group-hover:bg-brand-gradient group-hover:text-primary-foreground">
                  <ServiceIcon name={s.icon} className="size-6" />
                </span>
                <h3 className="mt-4 text-base font-bold">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">{formatIQD(s.price)}</span>
                  <Button size="sm" variant="ghost" className="rounded-xl" onClick={() => openBooking(s.id)}>
                    احجز
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-card py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-3xl border border-border/70 bg-background p-6">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-accent text-primary">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Doctors preview */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold sm:text-3xl">كادرنا الطبي</h2>
          <Button asChild variant="outline" className="rounded-2xl">
            <Link to="/staff">
              تعرّف على الفريق <ArrowLeft className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((d) => (
            <div key={d.id} className="card-soft p-6 text-center">
              <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-gradient text-lg font-bold text-primary-foreground">
                {d.initials}
              </span>
              <h3 className="mt-4 text-sm font-bold">{d.name}</h3>
              <p className="mt-1 text-xs text-primary">{d.specialty}</p>
              <p className="mt-2 text-xs text-muted-foreground">خبرة {d.experience} سنوات</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-extrabold sm:text-3xl">آراء أصحاب الحيوانات</h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="card-soft p-6">
              <Quote className="size-6 text-primary" />
              <p className="mt-3 text-sm leading-relaxed text-foreground">{t.text}</p>
              <div className="mt-4 border-t border-border pt-3">
                <p className="text-sm font-bold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.pet}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        <h2 className="text-2xl font-extrabold sm:text-3xl">أسئلة شائعة</h2>
        <Accordion type="single" collapsible className="mt-6">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-right text-sm font-bold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </SiteLayout>
  );
}
