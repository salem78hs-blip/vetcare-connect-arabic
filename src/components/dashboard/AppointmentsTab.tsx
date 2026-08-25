import { useMemo, useState } from "react";
import { Check, CheckCheck, Search, X } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getDoctor,
  getService,
  petTypeLabels,
  statusLabels,
  type Appointment,
  type AppointmentStatus,
} from "@/data/clinic";

const statusStyles: Record<AppointmentStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-accent text-primary",
  attended: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-700",
};

export function AppointmentsTab({
  data,
  onStatusChange,
}: {
  data: Appointment[];
  onStatusChange: (id: string, status: AppointmentStatus) => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | AppointmentStatus>("all");
  const [day, setDay] = useState<"all" | string>("all");

  const days = useMemo(() => Array.from(new Set(data.map((a) => a.date))).sort(), [data]);

  const filtered = data.filter((a) => {
    const q = query.trim();
    const matchQ =
      !q ||
      a.petName.includes(q) ||
      a.ownerName.includes(q) ||
      a.ownerPhone.includes(q) ||
      a.ref.toLowerCase().includes(q.toLowerCase());
    return matchQ && (status === "all" || a.status === status) && (day === "all" || a.date === day);
  });

  const update = (a: Appointment, next: AppointmentStatus) => {
    onStatusChange(a.id, next);
    toast.success(`تم تحديث حالة الحجز ${a.ref}`, { description: statusLabels[next] });
  };

  return (
    <Card className="card-soft rounded-3xl">
      <CardHeader className="gap-4">
        <CardTitle className="text-base">إدارة المواعيد</CardTitle>
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث باسم الأليف أو المالك أو الرقم"
              className="rounded-2xl pr-9"
            />
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger className="rounded-2xl">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الحالات</SelectItem>
              {(Object.keys(statusLabels) as AppointmentStatus[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {statusLabels[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={day} onValueChange={setDay}>
            <SelectTrigger className="rounded-2xl">
              <SelectValue placeholder="اليوم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأيام</SelectItem>
              {days.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            لا توجد مواعيد مطابقة لبحثك.
          </p>
        )}

        {filtered.map((a) => (
          <div
            key={a.id}
            className="grid gap-3 rounded-3xl border border-border/70 bg-background/60 p-4 lg:grid-cols-[1fr_auto] lg:items-center"
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <span className="text-2xl">{petTypeLabels[a.petType].emoji}</span>
              <div className="min-w-36">
                <p className="text-sm font-bold">
                  {a.petName} <span className="font-mono text-[11px] text-muted-foreground">{a.ref}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {a.ownerName} — {a.ownerPhone}
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground">{getService(a.serviceId)?.name}</p>
                <p>{getDoctor(a.doctorId)?.name}</p>
              </div>
              <div className="text-xs">
                <p className="font-mono font-bold">{a.time}</p>
                <p className="text-muted-foreground">{a.date}</p>
              </div>
              <Badge className={`rounded-xl border-0 ${statusStyles[a.status]}`}>{statusLabels[a.status]}</Badge>
              {a.notes && <p className="w-full text-xs text-muted-foreground">ملاحظة: {a.notes}</p>}
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Button
                size="sm"
                variant="outline"
                className="rounded-2xl"
                disabled={a.status === "confirmed"}
                onClick={() => update(a, "confirmed")}
              >
                <Check className="size-4" /> تأكيد
              </Button>
              <Button
                size="sm"
                className="rounded-2xl"
                disabled={a.status === "attended"}
                onClick={() => update(a, "attended")}
              >
                <CheckCheck className="size-4" /> حضور
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="rounded-2xl text-destructive hover:text-destructive"
                disabled={a.status === "cancelled"}
                onClick={() => update(a, "cancelled")}
              >
                <X className="size-4" /> إلغاء
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
