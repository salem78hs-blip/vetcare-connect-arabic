import { useState } from "react";
import { MessageCircle, RefreshCw, Send, Smartphone } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clinic, reminders as seedReminders, type Reminder } from "@/data/clinic";

const stateStyles: Record<Reminder["state"], string> = {
  queued: "bg-amber-100 text-amber-800",
  sent: "bg-emerald-100 text-emerald-800",
  failed: "bg-rose-100 text-rose-700",
};

const stateLabels: Record<Reminder["state"], string> = {
  queued: "في الانتظار",
  sent: "تم الإرسال",
  failed: "فشل الإرسال",
};

export function RemindersTab() {
  const [list, setList] = useState<Reminder[]>(seedReminders);

  const message = (r: Reminder) =>
    `مرحباً ${r.ownerName}، تذكير من ${clinic.name}: ${r.detail} للأليف ${r.petName} بتاريخ ${r.dueDate}. للحجز اتصل بـ ${clinic.phone}`;

  const send = (r: Reminder) => {
    setList((prev) => prev.map((x) => (x.id === r.id ? { ...x, state: "sent" } : x)));
    toast.success(`تم إرسال التذكير إلى ${r.ownerName}`, { description: r.detail });
    if (r.channel === "whatsapp") {
      window.open(`https://wa.me/964${r.phone.slice(1)}?text=${encodeURIComponent(message(r))}`, "_blank");
    }
  };

  const sendAll = () => {
    const queued = list.filter((r) => r.state !== "sent");
    if (queued.length === 0) {
      toast.info("لا توجد تذكيرات بانتظار الإرسال");
      return;
    }
    setList((prev) => prev.map((r) => ({ ...r, state: "sent" })));
    toast.success(`تم إرسال ${queued.length} تذكير بنجاح`);
  };

  return (
    <Card className="card-soft rounded-3xl">
      <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">طابور التذكيرات التلقائية</CardTitle>
          <p className="pt-1 text-xs text-muted-foreground">
            تذكيرات التطعيمات والمواعيد عبر واتساب والرسائل النصية.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-2xl"
            onClick={() => {
              setList(seedReminders);
              toast.info("تم تحديث الطابور");
            }}
          >
            <RefreshCw className="size-4" /> تحديث
          </Button>
          <Button size="sm" className="rounded-2xl" onClick={sendAll}>
            <Send className="size-4" /> إرسال الكل
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {list.map((r) => (
          <div
            key={r.id}
            className="flex flex-wrap items-center gap-3 rounded-3xl border border-border/70 bg-background/60 p-4"
          >
            <span className="flex size-10 items-center justify-center rounded-2xl bg-accent text-primary">
              {r.channel === "whatsapp" ? (
                <MessageCircle className="size-5" />
              ) : (
                <Smartphone className="size-5" />
              )}
            </span>
            <div className="min-w-40">
              <p className="text-sm font-bold">
                {r.petName} — {r.ownerName}
              </p>
              <p className="text-xs text-muted-foreground">{r.phone}</p>
            </div>
            <div className="text-xs">
              <p className="font-medium">{r.detail}</p>
              <p className="text-muted-foreground">
                {r.type === "vaccination" ? "تطعيم" : "موعد"} — {r.dueDate}
              </p>
            </div>
            <Badge className={`rounded-xl border-0 ${stateStyles[r.state]}`}>{stateLabels[r.state]}</Badge>
            <Button
              size="sm"
              variant={r.state === "failed" ? "default" : "outline"}
              className="mr-auto rounded-2xl"
              onClick={() => send(r)}
            >
              <Send className="size-4" /> {r.state === "failed" ? "إعادة المحاولة" : "إرسال"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
