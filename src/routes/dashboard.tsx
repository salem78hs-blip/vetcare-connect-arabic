import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BellRing, CalendarDays, LayoutDashboard, PawPrint, Stethoscope } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentsTab } from "@/components/dashboard/AppointmentsTab";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { PetsTab } from "@/components/dashboard/PetsTab";
import { PrescriptionTab } from "@/components/dashboard/PrescriptionTab";
import { RemindersTab } from "@/components/dashboard/RemindersTab";
import { appointments as seedAppointments, clinic, type AppointmentStatus } from "@/data/clinic";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "لوحة إدارة العيادة | عيادة الرفيق البيطرية" },
      {
        name: "description",
        content: "لوحة تحكم داخلية لإدارة المواعيد والسجلات الطبية وملفات الحيوانات والتذكيرات في عيادة الرفيق البيطرية.",
      },
      { property: "og:title", content: "لوحة إدارة العيادة البيطرية" },
      {
        property: "og:description",
        content: "إدارة المواعيد، الملفات الصحية، الوصفات الطبية، والتذكيرات التلقائية من مكان واحد.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

const tabs = [
  { value: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { value: "appointments", label: "المواعيد", icon: CalendarDays },
  { value: "pets", label: "ملفات الحيوانات", icon: PawPrint },
  { value: "prescriptions", label: "الوصفات الطبية", icon: Stethoscope },
  { value: "reminders", label: "التذكيرات", icon: BellRing },
] as const;

function DashboardPage() {
  const [data, setData] = useState(seedAppointments);

  const onStatusChange = (id: string, status: AppointmentStatus) =>
    setData((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/70 bg-card/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-gradient shadow-soft">
            <LayoutDashboard className="size-5 text-primary-foreground" />
          </span>
          <div className="leading-tight">
            <h1 className="text-base font-extrabold">لوحة إدارة العيادة</h1>
            <p className="text-[11px] text-muted-foreground">{clinic.name}</p>
          </div>
          <Badge variant="secondary" className="rounded-xl">
            وضع الطبيب
          </Badge>
          <Button asChild variant="outline" size="sm" className="mr-auto rounded-2xl">
            <Link to="/">
              الموقع العام <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="h-auto flex-wrap justify-start rounded-2xl p-1.5">
            {tabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="gap-1.5 rounded-xl px-3 py-2 text-xs sm:text-sm">
                <t.icon className="size-4" />
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab data={data} />
          </TabsContent>
          <TabsContent value="appointments">
            <AppointmentsTab data={data} onStatusChange={onStatusChange} />
          </TabsContent>
          <TabsContent value="pets">
            <PetsTab />
          </TabsContent>
          <TabsContent value="prescriptions">
            <PrescriptionTab />
          </TabsContent>
          <TabsContent value="reminders">
            <RemindersTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
