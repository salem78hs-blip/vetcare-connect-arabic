import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarX, Lock, Plus, Syringe, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { animalLabel } from "@/lib/clinic";
import logo from "@/assets/vetona-logo.png.asset.json";
import {
  loadBookings,
  subscribeBookings,
  updatePlan,
  removeBooking,
  formatDate,
  newId,
  type Booking,
  type VaccineDose,
} from "@/lib/bookings";

const PASSCODE = "1234";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة | VetOna" },
      { name: "description", content: "إدارة حجوزات عيادة VetOna البيطرية وخطط التطعيم." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "لوحة الإدارة | VetOna" },
      { property: "og:description", content: "متابعة الحجوزات وتحديد خطة التطعيم القادمة." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [editing, setEditing] = useState<Booking | null>(null);

  useEffect(() => {
    const sync = () => setBookings(loadBookings());
    sync();
    return subscribeBookings(sync);
  }, []);

  if (!unlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (code === PASSCODE) setUnlocked(true);
            else toast.error("رمز غير صحيح");
          }}
          className="card-soft w-full max-w-sm p-8 text-center"
        >
          <span className="mx-auto flex size-12 items-center justify-center rounded-3xl bg-secondary text-primary">
            <Lock className="size-6" />
          </span>
          <h1 className="mt-4 text-lg font-bold">لوحة الإدارة</h1>
          <p className="mt-2 text-sm text-muted-foreground">أدخل رمز الدخول للمتابعة</p>
          <Input
            type="password"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            aria-label="رمز الدخول"
            className="mt-5 rounded-2xl text-center"
          />
          <Button type="submit" className="mt-4 w-full rounded-2xl">
            دخول
          </Button>
          <Button asChild variant="ghost" size="sm" className="mt-2 w-full rounded-2xl">
            <Link to="/">العودة للموقع</Link>
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={logo.url}
              alt="شعار VetOna"
              width={44}
              height={44}
              className="size-10 shrink-0 rounded-2xl bg-card object-contain p-1 ring-1 ring-border"
            />
            <h1 className="truncate text-lg font-extrabold sm:text-xl">الحجوزات</h1>
          </div>
          <Button asChild variant="ghost" size="sm" className="shrink-0 rounded-2xl">
            <Link to="/">الموقع</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 pb-20">
        {bookings === null ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="card-soft p-5">
                <div className="h-4 w-32 animate-pulse rounded-full bg-muted" />
                <div className="mt-3 h-3 w-48 animate-pulse rounded-full bg-muted" />
                <div className="mt-2 h-3 w-24 animate-pulse rounded-full bg-muted" />
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="card-soft px-6 py-14 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-secondary text-primary">
              <CalendarX className="size-7" />
            </span>
            <h2 className="mt-4 text-base font-bold">لا توجد حجوزات بعد</h2>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              ستظهر الحجوزات هنا مباشرة بعد أن يرسل أحد العملاء طلب موعد من الموقع.
            </p>
            <Button asChild variant="outline" className="mt-6 rounded-2xl">
              <Link to="/">فتح صفحة الحجز</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-3 lg:hidden">
              {bookings.map((b) => (
                <div key={b.id} className="card-soft p-5">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{b.ownerName}</p>
                      <a
                        href={`tel:${b.phone}`}
                        dir="ltr"
                        className="mt-0.5 block text-xs font-semibold text-primary"
                      >
                        {b.phone}
                      </a>
                    </div>
                    <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-[11px] font-bold text-secondary-foreground">
                      {animalLabel(b.animalType, b.animalOther)}
                    </span>
                  </div>
                  <dl className="mt-4 space-y-1.5 text-xs">
                    <div className="flex gap-2">
                      <dt className="text-muted-foreground">اسم الحيوان:</dt>
                      <dd className="min-w-0 truncate font-semibold">{b.catName || "—"}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-muted-foreground">الموعد:</dt>
                      <dd className="font-semibold">{formatDate(b.date)}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-muted-foreground">خطة التطعيم:</dt>
                      <dd className="min-w-0 font-semibold">
                        {b.plan && b.plan.doses.length > 0
                          ? `${b.plan.doses.length} جرعة — ${formatDate(b.plan.doses[0]!.date)}`
                          : "غير محددة"}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 rounded-2xl"
                      onClick={() => setEditing(b)}
                    >
                      <Syringe className="size-4" /> خطة التطعيم
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="حذف الحجز"
                      className="min-h-11 min-w-11 shrink-0 rounded-2xl text-destructive"
                      onClick={() => {
                        removeBooking(b.id);
                        toast.success("تم حذف الحجز");
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="card-soft hidden overflow-hidden lg:block">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">المالك</TableHead>
                  <TableHead className="text-right">الهاتف</TableHead>
                  <TableHead className="text-right">النوع</TableHead>
                  <TableHead className="text-right">اسم الحيوان</TableHead>
                  <TableHead className="text-right">الموعد</TableHead>
                  <TableHead className="text-right">خطة التطعيم</TableHead>
                  <TableHead className="text-right">إجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-semibold">{b.ownerName}</TableCell>
                    <TableCell dir="ltr" className="text-right">
                      {b.phone}
                    </TableCell>
                    <TableCell>{animalLabel(b.animalType, b.animalOther)}</TableCell>
                    <TableCell>{b.catName || "—"}</TableCell>
                    <TableCell>{formatDate(b.date)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {b.plan && b.plan.doses.length > 0
                        ? `${b.plan.doses.length} جرعة — أقربها ${formatDate(b.plan.doses[0]!.date)}`
                        : "غير محددة"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-2xl"
                          onClick={() => setEditing(b)}
                        >
                          <Syringe className="size-4" /> خطة التطعيم
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="حذف الحجز"
                          className="min-h-11 min-w-11 rounded-2xl text-destructive"
                          onClick={() => {
                            removeBooking(b.id);
                            toast.success("تم حذف الحجز");
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
      </main>

      <PlanDialog booking={editing} onClose={() => setEditing(null)} />
    </div>
  );
}

function PlanDialog({ booking, onClose }: { booking: Booking | null; onClose: () => void }) {
  const [doses, setDoses] = useState<VaccineDose[]>([]);

  useEffect(() => {
    if (booking) setDoses(booking.plan?.doses ?? []);
  }, [booking]);

  function addDose() {
    setDoses((d) => [...d, { id: newId(), vaccine: "", date: "" }]);
  }

  function update(id: string, patch: Partial<VaccineDose>) {
    setDoses((d) => d.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }

  function save() {
    if (!booking) return;
    if (doses.some((d) => !d.vaccine.trim() || !d.date)) {
      toast.error("أكمل نوع التطعيم وتاريخ كل جرعة");
      return;
    }
    const sorted = [...doses].sort((a, b) => a.date.localeCompare(b.date));
    updatePlan(booking.id, sorted.length ? { doses: sorted } : null);
    toast.success("تم حفظ خطة التطعيم");
    onClose();
  }

  return (
    <Dialog open={Boolean(booking)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-right">
            خطة التطعيم{" "}
            {booking
              ? `— ${booking.catName || animalLabel(booking.animalType, booking.animalOther)}`
              : ""}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">عدد الجرعات: {doses.length}</p>
            <Button size="sm" variant="outline" className="rounded-2xl" onClick={addDose}>
              <Plus className="size-4" /> إضافة جرعة
            </Button>
          </div>

          {doses.length === 0 ? (
            <p className="rounded-2xl bg-muted p-4 text-center text-sm text-muted-foreground">
              لا توجد جرعات، أضف الجرعة الأولى.
            </p>
          ) : (
            <div className="space-y-3">
              {doses.map((d, i) => (
                <div key={d.id} className="rounded-2xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">الجرعة {i + 1}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`حذف الجرعة ${i + 1}`}
                      className="min-h-11 min-w-11 rounded-2xl text-destructive"
                      onClick={() => setDoses((prev) => prev.filter((x) => x.id !== d.id))}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`vaccine-${d.id}`}>نوع التطعيم</Label>
                      <Input
                        id={`vaccine-${d.id}`}
                        value={d.vaccine}
                        maxLength={60}
                        onChange={(e) => update(d.id, { vaccine: e.target.value })}
                        className="rounded-2xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`date-${d.id}`}>تاريخ الجرعة</Label>
                      <Input
                        id={`date-${d.id}`}
                        type="date"
                        value={d.date}
                        onChange={(e) => update(d.id, { date: e.target.value })}
                        className="rounded-2xl"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" className="rounded-2xl" onClick={onClose}>
            إلغاء
          </Button>
          <Button className="rounded-2xl" onClick={save}>
            حفظ الخطة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
