import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Pencil, Plus, Tags, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteCategory, saveCategory } from "@/lib/store.functions";
import type { Category } from "@/lib/store";

export function CategoriesManager({
  passcode,
  categories,
  onChanged,
}: {
  passcode: string;
  categories: Category[];
  onChanged: () => void;
}) {
  const save = useServerFn(saveCategory);
  const remove = useServerFn(deleteCategory);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(fn: () => Promise<unknown>, msg: string) {
    setBusy(true);
    try {
      await fn();
      toast.success(msg);
      onChanged();
      return true;
    } catch (err) {
      console.error("Category action failed:", err);
      toast.error(err instanceof Error ? err.message : "حدث خطأ");
      return false;
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mb-8 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Tags className="size-5 text-primary" />
        <h2 className="text-lg font-extrabold">أقسام المتجر</h2>
      </div>
      <form
        className="mb-4 flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          if (await run(() => save({ data: { passcode, name: newName } }), "تمت إضافة القسم"))
            setNewName("");
        }}
      >
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="اسم قسم جديد"
          maxLength={40}
          className="rounded-2xl"
        />
        <Button type="submit" disabled={busy || newName.trim().length < 2} className="rounded-2xl">
          <Plus className="size-4" /> إضافة
        </Button>
      </form>
      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">لا توجد أقسام بعد</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {categories.map((c) =>
            editId === c.id ? (
              <li
                key={c.id}
                className="flex items-center gap-1 rounded-full border bg-background p-1"
              >
                <Input
                  value={editName}
                  autoFocus
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-8 w-36 rounded-full"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 rounded-full"
                  aria-label="حفظ القسم"
                  disabled={busy}
                  onClick={async () => {
                    if (
                      await run(
                        () => save({ data: { passcode, id: c.id, name: editName } }),
                        "تم تعديل القسم",
                      )
                    )
                      setEditId(null);
                  }}
                >
                  <Check className="size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 rounded-full"
                  aria-label="إلغاء"
                  onClick={() => setEditId(null)}
                >
                  <X className="size-4" />
                </Button>
              </li>
            ) : (
              <li
                key={c.id}
                className="flex items-center gap-1 rounded-full bg-secondary py-1 pe-1 ps-4 text-sm font-bold"
              >
                {c.name}
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7 rounded-full"
                  aria-label={`تعديل ${c.name}`}
                  onClick={() => {
                    setEditId(c.id);
                    setEditName(c.name);
                  }}
                >
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7 rounded-full text-destructive"
                  aria-label={`حذف ${c.name}`}
                  disabled={busy}
                  onClick={() => {
                    if (!confirm(`حذف قسم «${c.name}»؟ المنتجات التابعة ستبقى بدون قسم.`)) return;
                    void run(() => remove({ data: { passcode, id: c.id } }), "تم حذف القسم");
                  }}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </li>
            ),
          )}
        </ul>
      )}
    </section>
  );
}
