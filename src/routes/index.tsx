import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarCheck, Cat, Check, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addBooking, formatDate } from "@/lib/bookings";
import heroCat from "@/assets/hero-cat.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "عيادة القطط | حجز موعد بخطوة واحدة" },
      {
        name: "description",
        content: "عيادة مخصصة للقطط فقط: احجز موعد الفحص أو التطعيم بإدخال اسمك ورقم هاتفك واسم قطتك والتاريخ.",
      },
      { property: "og:title", content: "عيادة القطط | حجز موعد بخطوة واحدة" },
      { property: "og:description", content: "حجز بسيط وسريع لعيادة مخصصة للقطط." },
    ],
  }),
  component: HomePage,
});

const empty = { ownerName: "", phone: "", catName: "", date: "" };

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
          : form.catName.trim().length < 1
            ? "اكتب اسم القطة"
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
      catName: form.catName.trim(),
      date: form.date,
    });
    setDone(form);
    setForm(empty);
    toast.success("تم تسجيل الحجز");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6">
        <span className="flex items-center gap-2 font-bold">
          <span className="flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Cat className="size-5" />
          </span>
          عيادة القطط
        </span>
        <Button asChild variant="ghost" size="sm" className="rounded-2xl">
          <Link to="/admin">لوحة الإدارة</Link>
        </Button>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-20">
        <section className="grid items-center gap-10 py-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              <ShieldCheck className="size-3.5" /> رعاية مخصصة للقطط فقط
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
              موعد لقطتك <span className="text-primary">بخطوة واحدة</span>
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              فحص وتطعيم ومتابعة صحية للقطط. أكمل الحقول الأربعة وسنتواصل معك لتأكيد الموعد.
            </p>
          </div>
          <img
            src={heroCat}
            alt="قطة هادئة برسم بسيط بلون بنفسجي"
            width={1024}
            height={1024}
            className="mx-auto w-full max-w-sm rounded-4xl bg-accent object-cover"
          />
        </section>

        <section className="card-soft mx-auto max-w-lg p-6 sm:p-8">
          {done ? (
            <div className="text-center">
              <span className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-secondary text-primary">
                <Check className="size-7" />
              </span>
              <h2 className="mt-4 text-lg font-bold">تم استلام الحجز</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {done.catName} — {formatDate(done.date)}
              </p>
              <Button className="mt-6 rounded-2xl" onClick={() => setDone(null)}>
                حجز موعد آخر
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
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

              <div className="space-y-2">
                <Label htmlFor="catName">اسم القطة</Label>
                <Input
                  id="catName"
                  value={form.catName}
                  maxLength={40}
                  onChange={(e) => set("catName", e.target.value)}
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
      </main>
    </div>
  );
}
