import { useMemo } from "react";
import { CalendarCheck, Coins, PawPrint, Syringe, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  appointments as seedAppointments,
  formatIQD,
  getDoctor,
  getService,
  monthlyVisits,
  pets,
  statusLabels,
  type Appointment,
} from "@/data/clinic";

const today = "2026-08-23";

export function OverviewTab({ data }: { data: Appointment[] }) {
  const todays = useMemo(() => data.filter((a) => a.date === today), [data]);

  const revenue = todays
    .filter((a) => a.status === "attended" || a.status === "confirmed")
    .reduce((sum, a) => sum + (getService(a.serviceId)?.price ?? 0), 0);

  const dueVaccines = pets.reduce(
    (n, p) => n + p.vaccinations.filter((v) => v.status === "due").length,
    0,
  );

  const metrics = [
    {
      label: "مواعيد اليوم",
      value: `${todays.length}`,
      hint: `${todays.filter((a) => a.status === "attended").length} تم الحضور`,
      icon: CalendarCheck,
    },
    { label: "إيراد اليوم المتوقع", value: formatIQD(revenue), hint: "بناءً على الخدمات المؤكدة", icon: Coins },
    { label: "الحيوانات المسجلة", value: `${pets.length}`, hint: "ملفات صحية نشطة", icon: PawPrint },
    { label: "تطعيمات مستحقة", value: `${dueVaccines}`, hint: "تحتاج تذكير فوري", icon: Syringe },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label} className="card-soft rounded-3xl">
            <CardContent className="flex items-start gap-4 p-5">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-accent text-primary">
                <m.icon className="size-5" />
              </span>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
                <p className="text-xl font-extrabold tracking-tight">{m.value}</p>
                <p className="text-[11px] text-muted-foreground">{m.hint}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="card-soft rounded-3xl lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">حركة الزيارات الشهرية</CardTitle>
            <Badge variant="secondary" className="rounded-xl">
              <TrendingUp className="size-3.5" /> +21% مقارنة بتموز
            </Badge>
          </CardHeader>
          <CardContent className="h-72 pr-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyVisits} margin={{ top: 8, left: 8, right: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="visitsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={36} orientation="right" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid var(--color-border)",
                    direction: "rtl",
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [`${v} زيارة`, "الزيارات"]}
                />
                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  fill="url(#visitsFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-soft rounded-3xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">الإيرادات (مليون د.ع)</CardTitle>
          </CardHeader>
          <CardContent className="h-72 pr-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyVisits.map((m) => ({ month: m.month, revenue: +(m.revenue / 1_000_000).toFixed(2) }))}
                margin={{ top: 8, left: 8, right: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={30} orientation="right" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid var(--color-border)",
                    direction: "rtl",
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [`${v} مليون د.ع`, "الإيراد"]}
                />
                <Bar dataKey="revenue" fill="var(--color-primary)" radius={[10, 10, 4, 4]} maxBarSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="card-soft rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">أحدث الحجوزات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(data.length ? data : seedAppointments).slice(0, 5).map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/70 bg-background/60 px-4 py-3"
            >
              <span className="text-sm font-bold">{a.petName}</span>
              <span className="text-xs text-muted-foreground">{getService(a.serviceId)?.name}</span>
              <span className="text-xs text-muted-foreground">{getDoctor(a.doctorId)?.name}</span>
              <span className="mr-auto text-xs font-mono text-muted-foreground">
                {a.date} — {a.time}
              </span>
              <Badge variant="secondary" className="rounded-xl">
                {statusLabels[a.status]}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
