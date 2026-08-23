import { createContext, useContext, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  PawPrint,
  Phone,
  LayoutDashboard,
  Menu,
  MapPin,
  Clock,
  MessageCircle,
  Stethoscope,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BookingFlow } from "@/components/site/BookingFlow";
import { clinic } from "@/data/clinic";

type BookingCtx = { openBooking: (serviceId?: string) => void };
const Ctx = createContext<BookingCtx>({ openBooking: () => {} });
export const useBooking = () => useContext(Ctx);

const navLinks = [
  { to: "/", label: "الرئيسية" },
  { to: "/services", label: "الخدمات" },
  { to: "/staff", label: "كادر الأطباء" },
  { to: "/booking", label: "حجز موعد" },
  { to: "/lookup", label: "متابعة حالة أليف" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [serviceId, setServiceId] = useState<string | undefined>(undefined);
  const [flowKey, setFlowKey] = useState(0);

  const openBooking = (id?: string) => {
    setServiceId(id);
    setFlowKey((k) => k + 1);
    setOpen(true);
  };

  return (
    <Ctx.Provider value={{ openBooking }}>
      <div className="flex min-h-screen flex-col bg-background">
        <header className="sticky top-0 z-40 border-b border-border/70 bg-card/85 backdrop-blur-md">
          <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-gradient shadow-soft">
                <PawPrint className="size-6 text-primary-foreground" />
              </span>
              <span className="leading-tight">
                <span className="block text-base font-extrabold">عيادة الرفيق</span>
                <span className="block text-[11px] text-muted-foreground">الرعاية البيطرية المتكاملة</span>
              </span>
            </Link>

            <nav className="mr-auto hidden items-center gap-1 lg:flex">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  activeOptions={{ exact: l.to === "/" }}
                  activeProps={{ className: "bg-accent text-primary" }}
                  className="rounded-xl px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="mr-auto flex items-center gap-2 lg:mr-0">
              <Button asChild variant="destructive" size="sm" className="rounded-2xl">
                <a href={`tel:${clinic.phone}`}>
                  <Phone className="size-4" />
                  <span className="hidden sm:inline">طوارئ 24/7</span>
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className="hidden rounded-2xl sm:inline-flex">
                <Link to="/dashboard">
                  <LayoutDashboard className="size-4" />
                  لوحة التحكم
                </Link>
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-2xl lg:hidden">
                    <Menu className="size-5" />
                    <span className="sr-only">القائمة</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <nav className="mt-10 flex flex-col gap-1 px-4">
                    {navLinks.map((l) => (
                      <Link
                        key={l.to}
                        to={l.to}
                        className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-accent hover:text-primary"
                      >
                        {l.label}
                      </Link>
                    ))}
                    <Link
                      to="/dashboard"
                      className="mt-2 rounded-xl bg-accent px-3 py-2.5 text-sm font-semibold text-primary"
                    >
                      لوحة التحكم
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="mt-20 border-t border-border bg-card">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-brand-gradient">
                  <PawPrint className="size-5 text-primary-foreground" />
                </span>
                <span className="text-lg font-extrabold">{clinic.name}</span>
              </div>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                فريق بيطري متخصص وتجهيزات حديثة لتشخيص ورعاية حيوانك الأليف، مع سجل طبي رقمي
                وتذكيرات تطعيم تلقائية.
              </p>
              <div className="mt-4 flex gap-2">
                <Button asChild size="sm" className="rounded-2xl">
                  <a href={`https://wa.me/${clinic.whatsapp}`} target="_blank" rel="noreferrer">
                    <MessageCircle className="size-4" /> واتساب
                  </a>
                </Button>
                <Button size="sm" variant="outline" className="rounded-2xl" onClick={() => openBooking()}>
                  <Stethoscope className="size-4" /> احجز موعداً
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold">روابط سريعة</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {navLinks.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="hover:text-primary">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold">معلومات التواصل</h3>
              <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  {clinic.address}
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span dir="ltr">{clinic.phone}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                  {clinic.hours}
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} {clinic.name} — جميع الحقوق محفوظة.
          </div>
        </footer>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto rounded-3xl sm:max-w-3xl" dir="rtl">
          <DialogHeader className="text-right">
            <DialogTitle className="text-xl">حجز موعد جديد</DialogTitle>
          </DialogHeader>
          <BookingFlow key={flowKey} initialServiceId={serviceId} onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </Ctx.Provider>
  );
}
