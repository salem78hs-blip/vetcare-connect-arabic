import { useState } from "react";
import { FileText, Phone, Search, Syringe } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDoctor, getOwner, getService, pets, petTypeLabels, type Pet } from "@/data/clinic";

const vaccineStyles = {
  done: "bg-emerald-100 text-emerald-800",
  upcoming: "bg-amber-100 text-amber-800",
  due: "bg-rose-100 text-rose-700",
} as const;

const vaccineLabels = { done: "مكتمل", upcoming: "قادم", due: "مستحق" } as const;

export function PetsTab() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Pet | null>(null);

  const q = query.trim();
  const rows = pets.filter((p) => {
    if (!q) return true;
    const owner = getOwner(p.ownerId);
    return (
      p.name.includes(q) ||
      p.code.toLowerCase().includes(q.toLowerCase()) ||
      p.breed.includes(q) ||
      (owner?.name.includes(q) ?? false) ||
      (owner?.phone.includes(q) ?? false)
    );
  });

  return (
    <>
      <Card className="card-soft rounded-3xl">
        <CardHeader className="gap-4">
          <CardTitle className="text-base">سجل الحيوانات والمالكين</CardTitle>
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بالاسم، الكود، السلالة، أو رقم المالك"
              className="rounded-2xl pr-9"
            />
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الأليف</TableHead>
                <TableHead className="text-right">الكود</TableHead>
                <TableHead className="text-right">النوع / السلالة</TableHead>
                <TableHead className="text-right">المالك</TableHead>
                <TableHead className="text-right">آخر زيارة</TableHead>
                <TableHead className="text-right">الملف</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => {
                const owner = getOwner(p.ownerId);
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-bold">
                      <span className="ml-1">{petTypeLabels[p.type].emoji}</span>
                      {p.name}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{p.code}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {petTypeLabels[p.type].label} — {p.breed}
                    </TableCell>
                    <TableCell className="text-xs">
                      <p>{owner?.name}</p>
                      <p className="text-muted-foreground">{owner?.phone}</p>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{p.lastVisit}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="rounded-2xl" onClick={() => setActive(p)}>
                        <FileText className="size-4" /> فتح
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {rows.length === 0 && (
            <p className="p-8 text-center text-sm text-muted-foreground">لا نتائج مطابقة.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[88vh] overflow-y-auto rounded-3xl sm:max-w-2xl">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-2xl">{petTypeLabels[active.type].emoji}</span>
                  الملف الصحي — {active.name}
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-3 rounded-2xl bg-accent/60 p-4 text-xs sm:grid-cols-3">
                <p>
                  <span className="text-muted-foreground">الكود: </span>
                  <span className="font-mono">{active.code}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">السلالة: </span>
                  {active.breed}
                </p>
                <p>
                  <span className="text-muted-foreground">العمر: </span>
                  {active.age}
                </p>
                <p>
                  <span className="text-muted-foreground">الوزن: </span>
                  {active.weight} كغم
                </p>
                <p>
                  <span className="text-muted-foreground">الجنس: </span>
                  {active.gender === "male" ? "ذكر" : "أنثى"}
                </p>
                <p className="flex items-center gap-1">
                  <Phone className="size-3.5 text-muted-foreground" />
                  {getOwner(active.ownerId)?.phone}
                </p>
              </div>

              <Tabs defaultValue="records">
                <TabsList className="rounded-2xl">
                  <TabsTrigger value="records" className="rounded-xl">
                    السجل الطبي
                  </TabsTrigger>
                  <TabsTrigger value="vaccines" className="rounded-xl">
                    بطاقة التحصين
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="records" className="space-y-3 pt-3">
                  {active.records.map((r) => (
                    <div key={r.id} className="rounded-2xl border border-border/70 p-4">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono font-bold">{r.date}</span>
                        <Badge variant="secondary" className="rounded-xl">
                          {getService(r.serviceId)?.name}
                        </Badge>
                        <span className="text-muted-foreground">{getDoctor(r.doctorId)?.name}</span>
                      </div>
                      <p className="mt-2 text-sm font-semibold">{r.diagnosis}</p>
                      {r.medications.length > 0 && (
                        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                          {r.medications.map((m) => (
                            <li key={m.name}>
                              💊 {m.name} — {m.dosage} — {m.duration}
                            </li>
                          ))}
                        </ul>
                      )}
                      <p className="mt-2 text-xs text-muted-foreground">{r.notes}</p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="vaccines" className="space-y-2 pt-3">
                  {active.vaccinations.map((v) => (
                    <div
                      key={v.name}
                      className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/70 p-3 text-xs"
                    >
                      <Syringe className="size-4 text-primary" />
                      <span className="font-semibold">{v.name}</span>
                      <span className="text-muted-foreground">آخر جرعة: {v.date}</span>
                      <span className="text-muted-foreground">الجرعة القادمة: {v.nextDue}</span>
                      <Badge className={`mr-auto rounded-xl border-0 ${vaccineStyles[v.status]}`}>
                        {vaccineLabels[v.status]}
                      </Badge>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
