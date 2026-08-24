import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Pill,
  Search,
  ShieldAlert,
  Syringe,
  TriangleAlert,
  Weight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteLayout } from "@/components/site/SiteLayout";
import { cn } from "@/lib/utils";
import {
  getDoctor,
  getOwner,
  getService,
  petTypeLabels,
  pets,
  type Pet,
  type Vaccination,
} from "@/data/clinic";

export const Route = createFileRoute("/lookup")({
  head: () => ({
    meta: [
      { title: "متابعة حالة أليفك وبطاقة التحصين | عيادة الرفيق" },
      {
        name: "description",
        content:
          "أدخل رمز ملف أليفك أو رقم هاتفك لعرض السجل الطبي، الأدوية الموصوفة، وبطاقة التطعيمات الرقمية.",
      },
      { property: "og:title", content: "متابعة حالة أليفك وبطاقة التحصين | عيادة الرفيق" },
      { property: "og:description", content: "سجل طبي رقمي لكل أليف مع حالة كل جرعة تحصين." },
    ],
  }),
  component: LookupPage,
});

const vaccineStyles: Record<Vaccination["status"], { label: string; className: string }> = {
  done: { label: "مكتمل", className: "bg-accent text-primary" },
  upcoming: { label: "قريباً", className: "bg-muted text-muted-foreground" },
  due: { label: "مستحق", className: "bg-destructive/10 text-destructive" },
};

function findPets(query: string): Pet[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return pets.filter((p) => {
    const owner = getOwner(p.ownerId);
    return (
      p.code.toLowerCase() === q ||
      p.code.toLowerCase().includes(q) ||
      p.name.includes(query.trim()) ||
      owner?.phone === q
    );
  });
}

function LookupPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Pet[] | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length < 3) {
      toast.error("أدخل رمز ملف صحيح أو رقم هاتف (3 أحرف على الأقل)");
      return;
    }
    const found = findPets(query);
    setResults(found);
    if (found.length === 0) toast.error("لم نجد أي ملف مطابق، تحقّق من الرمز أو الرقم");
    else toast.success(`تم العثور على ${found.length} ملف`);
  };

  return (
    <SiteLayout>
      <section className="bg-hero-mesh">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h1 className="text-3xl font-extrabold sm:text-4xl">متابعة حالة أليفك</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            أدخل رمز الملف الموجود على وصل الزيارة (مثال: VET-1001) أو رقم هاتفك المسجّل لدينا.
          </p>

          <form onSubmit={submit} className="mt-6 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Label htmlFor="q" className="mb-2 block text-xs">
                رمز الملف أو رقم الهاتف
              </Label>
              <Input
                id="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="VET-1001 أو 07701234567"
                className="h-12 rounded-2xl bg-card"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 rounded-2xl">
              <Search className="size-4" /> بحث
            </Button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">
            للتجربة: VET-1001 · VET-1002 · 07711223344
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {results === null && (
          <div className="card-soft flex flex-col items-center gap-3 p-12 text-center">
            <ClipboardList className="size-10 text-primary" />
            <p className="text-sm text-muted-foreground">
              نتائج البحث ستظهر هنا مع السجل الطبي وبطاقة التحصين.
            </p>
          </div>
        )}

        {results !== null && results.length === 0 && (
          <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-10 text-center">
            <TriangleAlert className="mx-auto size-9 text-destructive" />
            <p className="mt-3 text-sm font-semibold">لا يوجد ملف مطابق</p>
            <p className="mt-1 text-sm text-muted-foreground">
              تواصل مع الاستقبال للتأكد من رمز الملف الخاص بأليفك.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {results?.map((pet) => (
            <PetDossier key={pet.id} pet={pet} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

function PetDossier({ pet }: { pet: Pet }) {
  const owner = getOwner(pet.ownerId);
  const meta = petTypeLabels[pet.type];

  return (
    <Card className="overflow-hidden rounded-3xl border-border/70">
      <div className="flex flex-wrap items-center gap-4 border-b border-border bg-accent/50 p-6">
        <span className="flex size-16 items-center justify-center rounded-3xl bg-card text-3xl shadow-soft">
          {meta.emoji}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold">{pet.name}</h2>
            <Badge variant="secondary" className="rounded-full">
              {pet.code}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {meta.label} · {pet.breed} · {pet.age} · {pet.gender === "male" ? "ذكر" : "أنثى"}
          </p>
        </div>
        <div className="grid gap-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Weight className="size-3.5 text-primary" /> {pet.weight} كغم
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5 text-primary" /> آخر زيارة {pet.lastVisit}
          </span>
          <span>المالك: {owner?.name}</span>
        </div>
      </div>

      <CardContent className="p-6">
        <Tabs defaultValue="records" dir="rtl">
          <TabsList className="rounded-2xl">
            <TabsTrigger value="records" className="rounded-xl">
              السجل الطبي
            </TabsTrigger>
            <TabsTrigger value="vaccines" className="rounded-xl">
              بطاقة التحصين
            </TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="mt-5 space-y-4">
            {pet.records.map((r) => (
              <div key={r.id} className="rounded-3xl border border-border/70 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="rounded-full">{getService(r.serviceId)?.name}</Badge>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                  <span className="text-xs text-muted-foreground">· {getDoctor(r.doctorId)?.name}</span>
                </div>
                <p className="mt-3 text-sm font-semibold">التشخيص: {r.diagnosis}</p>
                {r.medications.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {r.medications.map((m) => (
                      <li
                        key={m.name}
                        className="flex flex-wrap items-center gap-2 rounded-2xl bg-muted/60 px-3 py-2 text-xs"
                      >
                        <Pill className="size-3.5 text-primary" />
                        <span className="font-semibold">{m.name}</span>
                        <span className="text-muted-foreground">
                          {m.dosage} — {m.duration}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  ملاحظات الطبيب: {r.notes}
                </p>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="vaccines" className="mt-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {pet.vaccinations.map((v) => {
                const style = vaccineStyles[v.status];
                return (
                  <div key={v.name} className="rounded-3xl border border-border/70 p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-sm font-bold">
                        <Syringe className="size-4 text-primary" /> {v.name}
                      </span>
                      <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold", style.className)}>
                        {style.label}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5" /> آخر جرعة: {v.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ShieldAlert className="size-3.5" /> الجرعة القادمة: {v.nextDue}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
