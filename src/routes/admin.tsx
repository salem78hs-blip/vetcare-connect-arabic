import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Lock, PackageOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { adminListProducts, deleteProduct, saveProduct } from "@/lib/store.functions";
import { formatPrice, type Product } from "@/lib/store";
import { uploadProductImage } from "@/lib/product-image.functions";
import { validateProductImage } from "@/lib/product-image";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة | VetOna" },
      {
        name: "description",
        content: "إدارة منتجات متجر VetOna.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "لوحة الإدارة | VetOna" },
      { property: "og:description", content: "إدارة منتجات متجر VetOna." },
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
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    if (code === "1234") {
      onUnlock(code);
    } else {
      toast.error("رمز الدخول غير صحيح");
    }
    setChecking(false);
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
  const fetchProducts = useServerFn(adminListProducts);
  const removeProduct = useServerFn(deleteProduct);

  const [products, setProducts] = useState<Product[] | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | "new" | null>(null);

  const reloadProducts = useCallback(async () => {
    try {
      setProducts(await fetchProducts({ data: { passcode } }));
    } catch {
      setProducts([]);
      toast.error("تعذّر جلب المنتجات");
    }
  }, [fetchProducts, passcode]);

  useEffect(() => {
    void reloadProducts();
  }, [reloadProducts]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src="/logo.png"
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
        <Tabs defaultValue="store">
          <TabsList className="w-full rounded-2xl">
            <TabsTrigger value="store" className="w-full rounded-2xl">
              المتجر
            </TabsTrigger>
          </TabsList>

          <TabsContent value="store" className="mt-5">
            {/* ---------- products ---------- */}
            <h2 className="mb-4 text-lg font-extrabold">منتجات المتجر</h2>
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
                      <div className="min-w-0">
                        <h2 className="text-sm font-bold">{p.name}</h2>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {categories.find((c) => c.id === p.categoryId)?.name ?? "بدون قسم"}
                        </p>
                      </div>
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
                            toast.error(error instanceof Error ? error.message : "تعذّر الح��ف");
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

      <ProductDialog
        passcode={passcode}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSaved={reloadProducts}
        categories={[]}
      />
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

function EmptyState({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
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

function ProductDialog({
  passcode,
  product,
  onClose,
  onSaved,
  categories,
}: {
  passcode: string;
  product: Product | "new" | null;
  onClose: () => void;
  onSaved: () => void;
  categories: Category[];
}) {
  const save = useServerFn(saveProduct);
  const upload = useServerFn(uploadProductImage);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "0",
    imageUrl: "",
    isAvailable: true,
    categoryId: "none",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!product) return;
    if (product === "new") {
      setForm({
        name: "",
        description: "",
        price: "0",
        imageUrl: "",
        isAvailable: true,
        categoryId: "none",
      });
    } else {
      setForm({
        name: product.name,
        description: product.description,
        price: String(product.price),
        imageUrl: product.imageUrl,
        isAvailable: product.isAvailable,
        categoryId: product.categoryId ?? "none",
      });
    }
  }, [product]);

  async function selectImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || uploading || saving) return;
    try {
      validateProductImage(file);
      setUploading(true);
      const data = new FormData();
      data.set("passcode", passcode);
      data.set("image", file);
      const result = await upload({ data });
      setForm((f) => ({ ...f, imageUrl: result.imageUrl }));
      toast.success("تم رفع الصورة");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذّر رفع الصورة");
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (uploading || saving) return;
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
          categoryId: form.categoryId === "none" ? null : form.categoryId,
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
    <Dialog
      open={Boolean(product)}
      onOpenChange={(open) => !open && !uploading && !saving && onClose()}
    >
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
            <Label>القسم</Label>
            <Select
              value={form.categoryId}
              onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}
            >
              <SelectTrigger className="rounded-2xl" aria-label="القسم">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">بدون قسم</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              صورة المنتج <span className="text-muted-foreground">(اختياري)</span>
            </Label>
            <Input
              id="pImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={uploading || saving}
              onChange={(e) => void selectImage(e)}
              className="rounded-2xl file:me-3 file:text-foreground"
            />
            {uploading ? (
              <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin motion-reduce:animate-none" /> جارٍ رفع
                الصورة…
              </p>
            ) : form.imageUrl ? (
              <img
                src={form.imageUrl}
                alt="صورة المنتج"
                className="h-36 w-full rounded-lg bg-muted object-contain"
              />
            ) : null}
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
            <Button
              type="button"
              variant="outline"
              disabled={uploading || saving}
              className="rounded-2xl"
              onClick={onClose}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={saving || uploading} className="rounded-2xl">
              {saving ? <Loader2 className="size-4 animate-spin" /> : "حفظ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
