import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  CalendarX,
  Loader2,
  Lock,
  MessageCircle,
  PackageOpen,
  Pencil,
  Plus,
  ShoppingBag,
  Syringe,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { animalLabel } from "@/lib/clinic";
import logo from "@/assets/vetona-logo.png.asset.json";
import {
  formatDate,
  newId,
  whatsappReminderUrl,
  type Booking,
  type VaccineDose,
} from "@/lib/bookings";
import { deleteBooking, listBookings, savePlan } from "@/lib/bookings.functions";
import {
  adminListProducts,
  deleteOrder,
  deleteProduct,
  listOrders,
  saveProduct,
  updateOrderStatus,
} from "@/lib/store.functions";
import { ORDER_STATUSES, formatPrice, orderStatusLabel, type Order, type Product } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة | VetOna" },
      {
        name: "description",
        content: "إدارة حجوزات عيادة VetOna، خطط التطعيم، منتجات المتجر وطلبات العملاء.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "لوحة الإدارة | VetOna" },
      { property: "og:description", content: "متابعة الحجوزات والمنتجات والطلبات." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [passcode, setPasscode] = useState<string | null>(null);

  if (!passcode) return <PasscodeGate onUnlock={setPasscode} />;
  return <AdminDashboard passcode={passcode} />;
}

function PasscodeGate({ onUnlock }: { onUnlock: (code: string) => void }) {
  const check = useServerFn(listBookings);
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    try {
      await check({ data: { passcode: code } });
      onUnlock(code);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "رمز الدخول غير صحيح");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form onSubmit={submit} className="card-soft w-full max-w-sm p-8 text-center">
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
        <Button type="submit" disabled={checking} className="mt-4 w-full rounded-2xl">
          {checking ? <Loader2 className="size-4 animate-spin" /> : "دخول"}
        </Button>
        <Button asChild variant="ghost" size="sm" className="mt-2 w-full rounded-2xl">
          <Link to="/">العودة للموقع</Link>
        </Button>
      </form>
    </div>
  );
}

function AdminDashboard({ passcode }: { passcode: string }) {
  const fetchBookings = useServerFn(listBookings);
  const fetchProducts = useServerFn(adminListProducts);
  const fetchOrders = useServerFn(listOrders);
  const removeBooking = useServerFn(deleteBooking);
  const removeProduct = useServerFn(deleteProduct);
  const removeOrder = useServerFn(deleteOrder);
  const setStatus = useServerFn(updateOrderStatus);

  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [editingPlan, setEditingPlan] = useState<Booking | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | "new" | null>(null);

  const reloadBookings = useCallback(async () => {
    try {
      setBookings(await fetchBookings({ data: { passcode } }));
    } catch {
      toast.error("تعذّر جلب الحجوزات");
    }
  }, [fetchBookings, passcode]);

  const reloadProducts = useCallback(async () => {
    try {
      setProducts(await fetchProducts({ data: { passcode } }));
    } catch {
      toast.error("تعذّر جلب المنتجات");
    }
  }, [fetchProducts, passcode]);

  const reloadOrders = useCallback(async () => {
    try {
      setOrders(await fetchOrders({ data: { passcode } }));
    } catch {
      toast.error("تعذّر جلب الطلبات");
    }
  }, [fetchOrders, passcode]);

  useEffect(() => {
    void reloadBookings();
    void reloadProducts();
    void reloadOrders();
  }, [reloadBookings, reloadProducts, reloadOrders]);

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
            <h1 className="truncate text-lg font-extrabold sm:text-xl">لوحة الإدارة</h1>
          </div>
          <Button asChild variant="ghost" size="sm" className="shrink-0 rounded-2xl">
            <Link to="/">الموقع</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 pb-20">
        <Tabs defaultValue="bookings">
          <TabsList className="rounded-2xl">
            <TabsTrigger value="bookings" className="rounded-2xl">
              الحجوزات
            </TabsTrigger>
            <TabsTrigger value="products" className="rounded-2xl">
              المنتجات
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-2xl">
              الطلبات
            </TabsTrigger>
          </TabsList>

          {/* ---------- bookings ---------- */}
          <TabsContent value="bookings" className="mt-5">
            {bookings === null ? (
              <SkeletonList />
            ) : bookings.length === 0 ? (
              <EmptyState
                icon={<CalendarX className="size-7" />}
                title="لا توجد حجوزات بعد"
                text="ستظهر الحجوزات هنا مباشرة بعد أن يرسل أحد العملاء طلب موعد من الموقع."
              />
            ) : (
              <div className="grid gap-3">
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
                    <dl className="mt-4 grid gap-1.5 text-xs sm:grid-cols-3">
                      <Row label="اسم الحيوان" value={b.catName || "—"} />
                      <Row label="الموعد" value={formatDate(b.date)} />
                      <Row
                        label="خطة التطعيم"
                        value={
                          (() => {
                            const firstDose = b.plan?.doses[0];
                            return firstDose
                              ? `${b.plan?.doses.length ?? 0} جرعة — ${formatDate(firstDose.date)}`
                              : "غير محددة";
                          })()
                        }
                      />
                    </dl>
                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 rounded-2xl sm:flex-none"
                        onClick={() => setEditingPlan(b)}
                      >
                        <Syringe className="size-4" /> خطة التطعيم
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="flex-1 rounded-2xl sm:flex-none"
                      >
                        <a
                          href={whatsappReminderUrl(b)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="size-4" /> إرسال تذكير واتساب
                        </a>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="حذف الحجز"
                        className="min-h-11 min-w-11 shrink-0 rounded-2xl text-destructive"
                        onClick={async () => {
                          try {
                            await removeBooking({ data: { passcode, id: b.id } });
                            toast.success("تم حذف الحجز");
                            void reloadBookings();
                          } catch (error) {
                            toast.error(error instanceof Error ? error.message : "تعذّر الحذف");
                          }
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ---------- products ---------- */}
          <TabsContent value="products" className="mt-5">
            <div className="mb-4 flex justify-end">
              <Button className="rounded-2xl" onClick={() => setEditingProduct("new")}>
                <Plus className="size-4" /> إضافة منتج
              </Button>
            </div>
            {products === null ? (
              <SkeletonList />
            ) : products.length === 0 ? (
              <EmptyState
                icon={<PackageOpen className="size-7" />}
                title="لا توجد منتجات"
                text="أضف أول منتج ليظهر في صفحة المتجر للعملاء."
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => (
                  <div key={p.id} className="card-soft p-5">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                      <h2 className="min-w-0 text-sm font-bold">{p.name}</h2>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          p.isAvailable
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {p.isAvailable ? "معروض" : "مخفي"}
                      </span>
                    </div>
                    {p.description && (
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                        {p.description}
                      </p>
                    )}
                    <p className="mt-3 text-sm font-extrabold text-primary">
                      {formatPrice(p.price)}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 rounded-2xl"
                        onClick={() => setEditingProduct(p)}
                      >
                        <Pencil className="size-4" /> تعديل
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="حذف المنتج"
                        className="min-h-11 min-w-11 shrink-0 rounded-2xl text-destructive"
                        onClick={async () => {
                          try {
                            await removeProduct({ data: { passcode, id: p.id } });
                            toast.success("تم حذف المنتج");
                            void reloadProducts();
                          } catch (error) {
                            toast.error(error instanceof Error ? error.message : "تعذّر الحذف");
                          }
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ---------- orders ---------- */}
          <TabsContent value="orders" className="mt-5">
            {orders === null ? (
              <SkeletonList />
            ) : orders.length === 0 ? (
              <EmptyState
                icon={<ShoppingBag className="size-7" />}
                title="لا توجد طلبات"
                text="ستظهر طلبات المنتجات هنا بعد أن يرسلها العملاء من صفحة المتجر."
              />
            ) : (
              <div className="grid gap-3">
                {orders.map((o) => (
                  <div key={o.id} className="card-soft p-5">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">{o.productName}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {o.customerName} —{" "}
                          <a href={`tel:${o.phone}`} dir="ltr" className="font-semibold text-primary">
                            {o.phone}
                          </a>
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-[11px] font-bold text-secondary-foreground">
                        {orderStatusLabel(o.status)}
                      </span>
                    </div>
                    <dl className="mt-4 grid gap-1.5 text-xs sm:grid-cols-3">
                      <Row label="الكمية" value={String(o.quantity)} />
                      <Row label="الإجمالي" value={formatPrice(o.unitPrice * o.quantity)} />
                      <Row label="ملاحظة" value={o.note || "—"} />
                    </dl>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <Select
                        value={o.status}
                        onValueChange={async (value) => {
                          try {
                            await setStatus({ data: { passcode, id: o.id, status: value } });
                            toast.success("تم تحديث الحالة");
                            void reloadOrders();
                          } catch (error) {
                            toast.error(error instanceof Error ? error.message : "تعذّر التحديث");
                          }
                        }}
                      >
                        <SelectTrigger className="w-40 rounded-2xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUSES.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="حذف الطلب"
                        className="min-h-11 min-w-11 rounded-2xl text-destructive"
                        onClick={async () => {
                          try {
                            await removeOrder({ data: { passcode, id: o.id } });
                            toast.success("تم حذف الطلب");
                            void reloadOrders();
                          } catch (error) {
                            toast.error(error instanceof Error ? error.message : "تعذّر الحذف");
                          }
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <PlanDialog
        passcode={passcode}
        booking={editingPlan}
        onClose={() => setEditingPlan(null)}
        onSaved={reloadBookings}
      />
      <ProductDialog
        passcode={passcode}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSaved={reloadProducts}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 text-muted-foreground">{label}:</dt>
      <dd className="min-w-0 truncate font-semibold">{value}</dd>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="card-soft p-5">
          <div className="h-4 w-32 animate-pulse rounded-full bg-muted" />
          <div className="mt-3 h-3 w-48 animate-pulse rounded-full bg-muted" />
          <div className="mt-2 h-3 w-24 animate-pulse rounded-full bg-muted" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="card-soft px-6 py-14 text-center">
      <span className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-secondary text-primary">
        {icon}
      </span>
      <h2 className="mt-4 text-base font-bold">{title}</h2>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

function PlanDialog({
  passcode,
  booking,
  onClose,
  onSaved,
}: {
  passcode: string;
  booking: Booking | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const save = useServerFn(savePlan);
  const [doses, setDoses] = useState<VaccineDose[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (booking) setDoses(booking.plan?.doses ?? []);
  }, [booking]);

  function update(id: string, patch: Partial<VaccineDose>) {
    setDoses((d) => d.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }

  async function submit() {
    if (!booking) return;
    if (doses.some((d) => !d.vaccine.trim() || !d.date)) {
      toast.error("أكمل نوع التطعيم وتاريخ كل جرعة");
      return;
    }
    const sorted = [...doses].sort((a, b) => a.date.localeCompare(b.date));
    setSaving(true);
    try {
      await save({
        data: { passcode, id: booking.id, plan: sorted.length ? { doses: sorted } : null },
      });
      toast.success("تم حفظ خطة التطعيم");
      onSaved();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذّر حفظ الخطة");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={Boolean(booking)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto rounded-3xl">
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
            <Button
              size="sm"
              variant="outline"
              className="rounded-2xl"
              onClick={() => setDoses((d) => [...d, { id: newId(), vaccine: "", date: "" }])}
            >
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
          <Button className="rounded-2xl" disabled={saving} onClick={submit}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : "حفظ الخطة"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProductDialog({
  passcode,
  product,
  onClose,
  onSaved,
}: {
  passcode: string;
  product: Product | "new" | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const save = useServerFn(saveProduct);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "0",
    imageUrl: "",
    isAvailable: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!product) return;
    if (product === "new") {
      setForm({ name: "", description: "", price: "0", imageUrl: "", isAvailable: true });
    } else {
      setForm({
        name: product.name,
        description: product.description,
        price: String(product.price),
        imageUrl: product.imageUrl,
        isAvailable: product.isAvailable,
      });
    }
  }, [product]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await save({
        data: {
          passcode,
          id: product && product !== "new" ? product.id : null,
          name: form.name,
          description: form.description,
          price: Number(form.price),
          imageUrl: form.imageUrl,
          isAvailable: form.isAvailable,
        },
      });
      toast.success("تم حفظ المنتج");
      onSaved();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذّر حفظ المنتج");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={Boolean(product)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-md overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-right">
            {product === "new" ? "إضافة منتج" : "تعديل المنتج"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pName">اسم المنتج</Label>
            <Input
              id="pName"
              value={form.name}
              maxLength={80}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="rounded-2xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pDesc">
              الوصف <span className="text-muted-foreground">(اختياري)</span>
            </Label>
            <Textarea
              id="pDesc"
              value={form.description}
              maxLength={300}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="rounded-2xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pPrice">السعر (دينار)</Label>
            <Input
              id="pPrice"
              type="number"
              min={0}
              step={250}
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="rounded-2xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pImage">
              رابط الصورة <span className="text-muted-foreground">(اختياري)</span>
            </Label>
            <Input
              id="pImage"
              dir="ltr"
              placeholder="https://…"
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              className="rounded-2xl"
            />
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-muted px-4 py-3">
            <Label htmlFor="pAvailable">عرض المنتج في المتجر</Label>
            <Switch
              id="pAvailable"
              checked={form.isAvailable}
              onCheckedChange={(v) => setForm((f) => ({ ...f, isAvailable: v }))}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" className="rounded-2xl" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" disabled={saving} className="rounded-2xl">
              {saving ? <Loader2 className="size-4 animate-spin" /> : "حفظ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
