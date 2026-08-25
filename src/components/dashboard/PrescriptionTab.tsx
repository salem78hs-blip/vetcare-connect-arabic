import { useState } from "react";
import { Plus, Printer, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { clinic, doctors, getOwner, pets, petTypeLabels } from "@/data/clinic";

type Med = { name: string; dosage: string; duration: string };

export function PrescriptionTab() {
  const [petId, setPetId] = useState(pets[0].id);
  const [doctorId, setDoctorId] = useState(doctors[0].id);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [meds, setMeds] = useState<Med[]>([{ name: "", dosage: "", duration: "" }]);

  const pet = pets.find((p) => p.id === petId)!;
  const owner = getOwner(pet.ownerId);
  const doctor = doctors.find((d) => d.id === doctorId)!;
  const validMeds = meds.filter((m) => m.name.trim());

  const setMed = (i: number, patch: Partial<Med>) =>
    setMeds((prev) => prev.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));

  const print = () => {
    if (!diagnosis.trim()) {
      toast.error("الرجاء إدخال التشخيص قبل الطباعة");
      return;
    }
    if (validMeds.length === 0) {
      toast.error("أضف دواءً واحداً على الأقل");
      return;
    }
    toast.success("جاري تحضير الوصفة للطباعة");
    setTimeout(() => window.print(), 250);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="card-soft rounded-3xl print:hidden">
        <CardHeader>
          <CardTitle className="text-base">مولّد التشخيص والوصفة الطبية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>الحيوان</Label>
              <Select value={petId} onValueChange={setPetId}>
                <SelectTrigger className="rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {petTypeLabels[p.type].emoji} {p.name} — {p.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>الطبيب المعالج</Label>
              <Select value={doctorId} onValueChange={setDoctorId}>
                <SelectTrigger className="rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>التشخيص</Label>
            <Textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="مثال: التهاب معوي حاد مع جفاف بسيط"
              className="min-h-20 rounded-2xl"
            />
          </div>

          <div className="space-y-2">
            <Label>الأدوية</Label>
            {meds.map((m, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
                <Input
                  value={m.name}
                  onChange={(e) => setMed(i, { name: e.target.value })}
                  placeholder="اسم الدواء"
                  className="rounded-2xl"
                />
                <Input
                  value={m.dosage}
                  onChange={(e) => setMed(i, { dosage: e.target.value })}
                  placeholder="الجرعة"
                  className="rounded-2xl"
                />
                <Input
                  value={m.duration}
                  onChange={(e) => setMed(i, { duration: e.target.value })}
                  placeholder="المدة"
                  className="rounded-2xl"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-2xl text-destructive"
                  onClick={() => setMeds((prev) => (prev.length > 1 ? prev.filter((_, x) => x !== i) : prev))}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="rounded-2xl"
              onClick={() => setMeds((prev) => [...prev, { name: "", dosage: "", duration: "" }])}
            >
              <Plus className="size-4" /> إضافة دواء
            </Button>
          </div>

          <div className="space-y-1.5">
            <Label>توصيات وملاحظات</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="تعليمات الرعاية المنزلية وموعد المراجعة"
              className="min-h-20 rounded-2xl"
            />
          </div>

          <Button className="w-full rounded-2xl" onClick={print}>
            <Printer className="size-4" /> طباعة الوصفة
          </Button>
        </CardContent>
      </Card>

      <div className="rounded-3xl border border-border bg-card p-6 print:border-0 print:shadow-none">
        <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="text-lg font-extrabold text-primary">{clinic.name}</p>
            <p className="text-[11px] text-muted-foreground">{clinic.address}</p>
            <p className="text-[11px] text-muted-foreground">هاتف: {clinic.phone}</p>
          </div>
          <div className="text-left text-[11px] text-muted-foreground">
            <p>وصفة طبية بيطرية</p>
            <p className="font-mono">{new Date().toISOString().slice(0, 10)}</p>
          </div>
        </div>

        <div className="grid gap-2 py-4 text-xs sm:grid-cols-2">
          <p>
            <span className="text-muted-foreground">الحيوان: </span>
            {pet.name} ({petTypeLabels[pet.type].label} — {pet.breed})
          </p>
          <p>
            <span className="text-muted-foreground">الكود: </span>
            <span className="font-mono">{pet.code}</span>
          </p>
          <p>
            <span className="text-muted-foreground">المالك: </span>
            {owner?.name} — {owner?.phone}
          </p>
          <p>
            <span className="text-muted-foreground">الوزن: </span>
            {pet.weight} كغم
          </p>
        </div>

        <div className="rounded-2xl bg-accent/60 p-4">
          <p className="text-[11px] font-bold text-muted-foreground">التشخيص</p>
          <p className="mt-1 text-sm font-semibold">{diagnosis || "—"}</p>
        </div>

        <div className="pt-4">
          <p className="text-[11px] font-bold text-muted-foreground">الأدوية الموصوفة</p>
          {validMeds.length === 0 ? (
            <p className="pt-2 text-sm text-muted-foreground">—</p>
          ) : (
            <ol className="mt-2 space-y-2 text-sm">
              {validMeds.map((m, i) => (
                <li key={i} className="rounded-2xl border border-border/70 px-3 py-2">
                  <span className="font-semibold">
                    {i + 1}. {m.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {m.dosage && ` — ${m.dosage}`}
                    {m.duration && ` — ${m.duration}`}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>

        {notes.trim() && (
          <div className="pt-4">
            <p className="text-[11px] font-bold text-muted-foreground">توصيات</p>
            <p className="mt-1 text-sm whitespace-pre-line">{notes}</p>
          </div>
        )}

        <div className="mt-6 flex items-end justify-between border-t border-border pt-4 text-xs">
          <div>
            <p className="font-bold">{doctor.name}</p>
            <p className="text-muted-foreground">{doctor.specialty}</p>
          </div>
          <p className="text-muted-foreground">التوقيع والختم</p>
        </div>
      </div>
    </div>
  );
}
