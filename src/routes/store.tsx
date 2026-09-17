import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Loader2, PackageOpen, Phone, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { listProducts, placeOrder } from "@/lib/store.functions";
import { formatPrice, type Product } from "@/lib/store";
import { CLINIC } from "@/lib/clinic";
import logo from "@/assets/vetona-logo.png.asset.json";

export const Route = createFileRoute("/store")({
  head: () => ({
    meta: [
      { title: "متجر مستلزمات القطط | VetOna" },
      {
        name: "description",
        content:
          "تسوّق مستلزمات القطط من عيادة VetOna: أطعمة، فيتامينات، وأدوات عناية — واطلبها مباشرة برقم هاتفك.",
      },
      { property: "og:title", content: "متجر مستلزمات القطط | VetOna" },
      {
        property: "og:description",
        content: "منتجات مختارة للقطط من عيادة VetOna مع طلب سريع.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: () => listProducts(),
  errorComponent: () => (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-lg font-bold">تعذّر تحميل المتجر</h1>
      <p className="mt-2 text-sm text-muted-foreground">حاول تحديث الصفحة مرة أخرى.</p>
      <Button asChild className="mt-6 rounded-2xl">
        <Link to="/">العودة للرئيسية</Link>
      </Button>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-lg font-bold">الصفحة غير موجودة</h1>
      <Button asChild className="mt-6 rounded-2xl">
        <Link to="/">العودة للرئيسية</Link>
      </Button>
    </div>
  ),
  component: StorePage,
});

function StorePage() {
  const products = Route.useLoaderData();
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <img
              src={logo.url}
              alt="شعار عيادة VetOna البيطرية"
              width={44}
              height={44}
              className="size-10 shrink-0 rounded-2xl bg-card object-contain p-1 ring-1 ring-border"
            />
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-display text-base font-extrabold text-primary">
                VetOna
              </span>
              <span className="block truncate text-[11px] text-muted-foreground">
                متجر مستلزمات القطط
              </span>
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-1">
            <Button asChild variant="ghost" size="sm" className="rounded-2xl">
              <Link to="/">الرئيسية</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="rounded-2xl">
              <a href={`tel:${CLINIC.phones[0]}`} aria-label="اتصل بالعيادة">
                <Phone className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 pb-20">
        <h1 className="text-2xl font-extrabold sm:text-3xl">منتجات القطط</h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          اختر المنتج المناسب لقطتك وأرسل الطلب، وسنتواصل معك لتأكيد التفاصيل والتسليم.
        </p>

        {products.length === 0 ? (
          <div className="card-soft mt-8 px-6 py-14 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-secondary text-primary">
              <PackageOpen className="size-7" />
            </span>
            <h2 className="mt-4 text-base font-bold">لا توجد منتجات معروضة حالياً</h2>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              نعمل على إضافة المنتجات قريباً، يمكنك الاتصال بنا للاستفسار عن المتوفر.
            </p>
            <Button asChild className="mt-6 rounded-2xl">
              <a href={`tel:${CLINIC.phones[0]}`}>
                <Phone className="size-4" /> اتصل بالعيادة
              </a>
            </Button>
          </div>
        ) : (
          <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <article key={p.id} className="card-soft flex flex-col overflow-hidden">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    loading="lazy"
                    className="h-40 w-full bg-muted object-cover"
                  />
                ) : (
                  <div className="flex h-40 w-full items-center justify-center bg-secondary text-primary">
                    <ShoppingBag className="size-8" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-sm font-bold">{p.name}</h2>
                  {p.description && (
                    <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                  )}
                  <p className="mt-3 text-base font-extrabold text-primary">
                    {formatPrice(p.price)}
                  </p>
                  <Button className="mt-4 w-full rounded-2xl" onClick={() => setSelected(p)}>
                    <ShoppingBag className="size-4" /> اطلب الآن
                  </Button>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        VetOna — Veterinary clinic · للاستفسار <span dir="ltr">{CLINIC.phonesDisplay[0]}</span>
      </footer>

      <OrderDialog product={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function OrderDialog({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const send = useServerFn(placeOrder);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  function close() {
    onClose();
    setDone(false);
    setName("");
    setPhone("");
    setQuantity(1);
    setNote("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!product) return;
    setSending(true);
    try {
      await send({
        data: { productId: product.id, customerName: name, phone, quantity, note },
      });
      setDone(true);
      toast.success("تم إرسال الطلب");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذّر إرسال الطلب");
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog open={Boolean(product)} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-right">
            طلب {product ? `— ${product.name}` : ""}
          </DialogTitle>
        </DialogHeader>

        {done ? (
          <div className="py-4 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-secondary text-primary">
              <Check className="size-7" />
            </span>
            <h3 className="mt-4 text-base font-bold">تم استلام طلبك</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              سنتواصل معك على <span dir="ltr">{phone}</span> لتأكيد الطلب.
            </p>
            <Button className="mt-6 rounded-2xl" onClick={close}>
              إغلاق
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderName">الاسم</Label>
              <Input
                id="orderName"
                value={name}
                maxLength={60}
                onChange={(e) => setName(e.target.value)}
                className="rounded-2xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderPhone">رقم الهاتف</Label>
              <Input
                id="orderPhone"
                inputMode="tel"
                dir="ltr"
                placeholder="07XXXXXXXXX"
                maxLength={11}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="rounded-2xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderQty">الكمية</Label>
              <Input
                id="orderQty"
                type="number"
                min={1}
                max={99}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="rounded-2xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderNote">
                ملاحظة <span className="text-muted-foreground">(اختياري)</span>
              </Label>
              <Textarea
                id="orderNote"
                value={note}
                maxLength={200}
                onChange={(e) => setNote(e.target.value)}
                className="rounded-2xl"
              />
            </div>
            {product && (
              <p className="rounded-2xl bg-muted p-3 text-center text-sm font-bold">
                الإجمالي: {formatPrice(product.price * (quantity > 0 ? quantity : 0))}
              </p>
            )}
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" className="rounded-2xl" onClick={close}>
                إلغاء
              </Button>
              <Button type="submit" disabled={sending} className="rounded-2xl">
                {sending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> جارٍ الإرسال…
                  </>
                ) : (
                  <>
                    <ShoppingBag className="size-4" /> تأكيد الطلب
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
