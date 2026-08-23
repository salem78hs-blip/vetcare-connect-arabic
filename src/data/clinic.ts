// Mock datasets for the veterinary clinic. Shapes mirror the intended Supabase
// tables (owners, pets, appointments, medical_records, services) so wiring a
// real backend later is a drop-in replacement.

export type PetType = "cat" | "dog" | "bird" | "other";

export const petTypeLabels: Record<PetType, { label: string; emoji: string }> = {
  cat: { label: "قط", emoji: "🐱" },
  dog: { label: "كلب", emoji: "🐶" },
  bird: { label: "طائر", emoji: "🦜" },
  other: { label: "أخرى", emoji: "🐾" },
};

export type Service = {
  id: string;
  name: string;
  description: string;
  icon: "stethoscope" | "syringe" | "scissors" | "microscope" | "heart-pulse" | "bone";
  price: number;
  duration: number;
};

export const services: Service[] = [
  {
    id: "checkup",
    name: "الكشف والفحص العام",
    description: "فحص شامل لصحة أليفك مع تقرير طبي مفصل وتوصيات غذائية.",
    icon: "stethoscope",
    price: 25000,
    duration: 30,
  },
  {
    id: "vaccination",
    name: "التطعيمات واللقاحات",
    description: "جدول تطعيمات متكامل مع بطاقة تحصين رقمية وتذكيرات تلقائية.",
    icon: "syringe",
    price: 35000,
    duration: 20,
  },
  {
    id: "grooming",
    name: "الحلاقة والعناية",
    description: "حلاقة، تنظيف، وتقليم أظافر بأيدي مختصين وأدوات معقّمة.",
    icon: "scissors",
    price: 20000,
    duration: 60,
  },
  {
    id: "lab",
    name: "الفحوصات والأشعة",
    description: "مختبر داخلي وأشعة رقمية بنتائج سريعة خلال نفس الزيارة.",
    icon: "microscope",
    price: 45000,
    duration: 45,
  },
  {
    id: "surgery",
    name: "الجراحة والعمليات",
    description: "غرفة عمليات مجهّزة وتخدير آمن مع متابعة ما بعد الجراحة.",
    icon: "heart-pulse",
    price: 150000,
    duration: 120,
  },
  {
    id: "dental",
    name: "العناية بالأسنان",
    description: "تنظيف جيري، معالجة اللثة، وخلع الأسنان التالفة بأمان.",
    icon: "bone",
    price: 40000,
    duration: 40,
  },
];

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  rating: number;
  experience: number;
  initials: string;
};

export const doctors: Doctor[] = [
  {
    id: "d1",
    name: "د. سارة الحسيني",
    specialty: "طب الحيوانات الصغيرة",
    bio: "متخصصة في الباطنية والتشخيص المخبري للقطط والكلاب.",
    rating: 4.9,
    experience: 11,
    initials: "س ح",
  },
  {
    id: "d2",
    name: "د. مصطفى الجابري",
    specialty: "الجراحة والعمليات",
    bio: "جراح معتمد في العمليات العامة وجراحة العظام.",
    rating: 4.8,
    experience: 14,
    initials: "م ج",
  },
  {
    id: "d3",
    name: "د. نور الربيعي",
    specialty: "الجلدية والتطعيمات",
    bio: "خبرة واسعة في الحساسية الجلدية وبرامج التحصين.",
    rating: 4.9,
    experience: 8,
    initials: "ن ر",
  },
  {
    id: "d4",
    name: "د. علي الكرخي",
    specialty: "طب الطيور والحيوانات الأليفة الغريبة",
    bio: "رعاية متخصصة للطيور والأرانب والزواحف.",
    rating: 4.7,
    experience: 9,
    initials: "ع ك",
  },
];

export type Owner = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
};

export const owners: Owner[] = [
  { id: "o1", name: "أحمد كاظم", phone: "07701234567", email: "ahmed@example.com", address: "بغداد - الكرادة" },
  { id: "o2", name: "ليلى عبد الله", phone: "07809876543", email: "laila@example.com", address: "بغداد - المنصور" },
  { id: "o3", name: "يوسف حيدر", phone: "07512345678", email: "yousif@example.com", address: "البصرة - الجزائر" },
  { id: "o4", name: "مريم صالح", phone: "07711223344", email: "mariam@example.com", address: "أربيل - عنكاوا" },
  { id: "o5", name: "حسين العامري", phone: "07905556677", email: "hussein@example.com", address: "النجف - الحنانة" },
];

export type Vaccination = {
  name: string;
  date: string;
  nextDue: string;
  status: "done" | "due" | "upcoming";
};

export type MedicalRecord = {
  id: string;
  date: string;
  doctorId: string;
  serviceId: string;
  diagnosis: string;
  medications: { name: string; dosage: string; duration: string }[];
  notes: string;
};

export type Pet = {
  id: string;
  code: string;
  name: string;
  type: PetType;
  breed: string;
  age: string;
  weight: number;
  gender: "male" | "female";
  ownerId: string;
  lastVisit: string;
  vaccinations: Vaccination[];
  records: MedicalRecord[];
};

export const pets: Pet[] = [
  {
    id: "p1",
    code: "VET-1001",
    name: "مشمش",
    type: "cat",
    breed: "شيرازي",
    age: "سنتان",
    weight: 4.6,
    gender: "male",
    ownerId: "o1",
    lastVisit: "2026-08-14",
    vaccinations: [
      { name: "السعار", date: "2026-03-10", nextDue: "2027-03-10", status: "done" },
      { name: "الرباعي للقطط", date: "2026-05-02", nextDue: "2026-11-02", status: "done" },
      { name: "لوكيميا القطط", date: "2025-09-12", nextDue: "2026-09-01", status: "due" },
    ],
    records: [
      {
        id: "r1",
        date: "2026-08-14",
        doctorId: "d1",
        serviceId: "checkup",
        diagnosis: "التهاب بسيط في الأذن الخارجية",
        medications: [{ name: "قطرة أوتوماكس", dosage: "قطرتان", duration: "7 أيام" }],
        notes: "تنظيف الأذن يومياً وإعادة التقييم بعد أسبوع.",
      },
      {
        id: "r2",
        date: "2026-05-02",
        doctorId: "d3",
        serviceId: "vaccination",
        diagnosis: "تحصين دوري - حالة عامة ممتازة",
        medications: [],
        notes: "لا أعراض جانبية بعد اللقاح.",
      },
    ],
  },
  {
    id: "p2",
    code: "VET-1002",
    name: "روكي",
    type: "dog",
    breed: "جيرمن شيبرد",
    age: "4 سنوات",
    weight: 31.2,
    gender: "male",
    ownerId: "o2",
    lastVisit: "2026-08-20",
    vaccinations: [
      { name: "السعار", date: "2026-01-18", nextDue: "2027-01-18", status: "done" },
      { name: "الثماني للكلاب", date: "2026-06-11", nextDue: "2026-12-11", status: "upcoming" },
      { name: "طارد الديدان", date: "2026-07-30", nextDue: "2026-10-30", status: "upcoming" },
    ],
    records: [
      {
        id: "r3",
        date: "2026-08-20",
        doctorId: "d2",
        serviceId: "lab",
        diagnosis: "عرج خفيف في القائمة الخلفية - إجهاد عضلي",
        medications: [
          { name: "ميلوكسيكام", dosage: "1 مل", duration: "5 أيام" },
          { name: "مكمل الغلوكوزامين", dosage: "حبة يومياً", duration: "30 يوم" },
        ],
        notes: "تقليل النشاط البدني لمدة أسبوعين.",
      },
    ],
  },
  {
    id: "p3",
    code: "VET-1003",
    name: "لولو",
    type: "bird",
    breed: "كناري",
    age: "سنة",
    weight: 0.03,
    gender: "female",
    ownerId: "o3",
    lastVisit: "2026-07-28",
    vaccinations: [{ name: "فحص الجدري", date: "2026-07-28", nextDue: "2027-07-28", status: "done" }],
    records: [
      {
        id: "r4",
        date: "2026-07-28",
        doctorId: "d4",
        serviceId: "checkup",
        diagnosis: "تساقط ريش موسمي طبيعي",
        medications: [{ name: "فيتامين متعدد", dosage: "3 قطرات بالماء", duration: "14 يوم" }],
        notes: "زيادة التعرض لضوء الشمس غير المباشر.",
      },
    ],
  },
  {
    id: "p4",
    code: "VET-1004",
    name: "بيسي",
    type: "cat",
    breed: "شوارع مهجّن",
    age: "6 أشهر",
    weight: 2.1,
    gender: "female",
    ownerId: "o4",
    lastVisit: "2026-08-22",
    vaccinations: [
      { name: "الرباعي للقطط", date: "2026-08-22", nextDue: "2026-09-22", status: "upcoming" },
      { name: "السعار", date: "-", nextDue: "2026-09-10", status: "due" },
    ],
    records: [
      {
        id: "r5",
        date: "2026-08-22",
        doctorId: "d3",
        serviceId: "vaccination",
        diagnosis: "الجرعة الأولى من التحصين الأساسي",
        medications: [],
        notes: "مراجعة بعد شهر للجرعة الثانية.",
      },
    ],
  },
  {
    id: "p5",
    code: "VET-1005",
    name: "سيمبا",
    type: "dog",
    breed: "غولدن ريتريفر",
    age: "3 سنوات",
    weight: 27.4,
    gender: "male",
    ownerId: "o5",
    lastVisit: "2026-08-01",
    vaccinations: [
      { name: "السعار", date: "2026-02-05", nextDue: "2027-02-05", status: "done" },
      { name: "الثماني للكلاب", date: "2026-02-05", nextDue: "2026-08-30", status: "due" },
    ],
    records: [
      {
        id: "r6",
        date: "2026-08-01",
        doctorId: "d1",
        serviceId: "dental",
        diagnosis: "تكلّس جيري متوسط مع التهاب لثة",
        medications: [{ name: "مضاد حيوي كليندامايسين", dosage: "150 ملغم", duration: "7 أيام" }],
        notes: "استخدام معجون أسنان مخصص للكلاب مرتين أسبوعياً.",
      },
    ],
  },
];

export type AppointmentStatus = "pending" | "confirmed" | "attended" | "cancelled";

export const statusLabels: Record<AppointmentStatus, string> = {
  pending: "بانتظار التأكيد",
  confirmed: "مؤكد",
  attended: "تم الحضور",
  cancelled: "ملغي",
};

export type Appointment = {
  id: string;
  ref: string;
  petId: string;
  petName: string;
  petType: PetType;
  ownerName: string;
  ownerPhone: string;
  doctorId: string;
  serviceId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
};

const today = "2026-08-23";
const tomorrow = "2026-08-24";

export const appointments: Appointment[] = [
  {
    id: "a1",
    ref: "BK-8241",
    petId: "p1",
    petName: "مشمش",
    petType: "cat",
    ownerName: "أحمد كاظم",
    ownerPhone: "07701234567",
    doctorId: "d1",
    serviceId: "checkup",
    date: today,
    time: "09:30",
    status: "confirmed",
  },
  {
    id: "a2",
    ref: "BK-8242",
    petId: "p2",
    petName: "روكي",
    petType: "dog",
    ownerName: "ليلى عبد الله",
    ownerPhone: "07809876543",
    doctorId: "d2",
    serviceId: "surgery",
    date: today,
    time: "11:00",
    status: "pending",
    notes: "الحالة تحتاج صيام قبل التخدير.",
  },
  {
    id: "a3",
    ref: "BK-8243",
    petId: "p4",
    petName: "بيسي",
    petType: "cat",
    ownerName: "مريم صالح",
    ownerPhone: "07711223344",
    doctorId: "d3",
    serviceId: "vaccination",
    date: today,
    time: "12:30",
    status: "attended",
  },
  {
    id: "a4",
    ref: "BK-8244",
    petId: "p3",
    petName: "لولو",
    petType: "bird",
    ownerName: "يوسف حيدر",
    ownerPhone: "07512345678",
    doctorId: "d4",
    serviceId: "checkup",
    date: today,
    time: "15:00",
    status: "confirmed",
  },
  {
    id: "a5",
    ref: "BK-8245",
    petId: "p5",
    petName: "سيمبا",
    petType: "dog",
    ownerName: "حسين العامري",
    ownerPhone: "07905556677",
    doctorId: "d1",
    serviceId: "dental",
    date: tomorrow,
    time: "10:00",
    status: "pending",
  },
  {
    id: "a6",
    ref: "BK-8246",
    petId: "p2",
    petName: "روكي",
    petType: "dog",
    ownerName: "ليلى عبد الله",
    ownerPhone: "07809876543",
    doctorId: "d3",
    serviceId: "grooming",
    date: tomorrow,
    time: "13:30",
    status: "confirmed",
  },
  {
    id: "a7",
    ref: "BK-8247",
    petId: "p1",
    petName: "مشمش",
    petType: "cat",
    ownerName: "أحمد كاظم",
    ownerPhone: "07701234567",
    doctorId: "d1",
    serviceId: "lab",
    date: "2026-08-25",
    time: "09:00",
    status: "cancelled",
  },
];

export const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

export const monthlyVisits = [
  { month: "شباط", visits: 148, revenue: 4200000 },
  { month: "آذار", visits: 176, revenue: 5100000 },
  { month: "نيسان", visits: 162, revenue: 4750000 },
  { month: "أيار", visits: 205, revenue: 6300000 },
  { month: "حزيران", visits: 231, revenue: 7100000 },
  { month: "تموز", visits: 218, revenue: 6800000 },
  { month: "آب", visits: 264, revenue: 8250000 },
];

export type Reminder = {
  id: string;
  petName: string;
  ownerName: string;
  phone: string;
  type: "vaccination" | "appointment";
  detail: string;
  dueDate: string;
  channel: "whatsapp" | "sms";
  state: "queued" | "sent" | "failed";
};

export const reminders: Reminder[] = [
  {
    id: "rm1",
    petName: "بيسي",
    ownerName: "مريم صالح",
    phone: "07711223344",
    type: "vaccination",
    detail: "لقاح السعار مستحق",
    dueDate: "2026-09-10",
    channel: "whatsapp",
    state: "queued",
  },
  {
    id: "rm2",
    petName: "سيمبا",
    ownerName: "حسين العامري",
    phone: "07905556677",
    type: "vaccination",
    detail: "الثماني للكلاب مستحق",
    dueDate: "2026-08-30",
    channel: "whatsapp",
    state: "queued",
  },
  {
    id: "rm3",
    petName: "مشمش",
    ownerName: "أحمد كاظم",
    phone: "07701234567",
    type: "vaccination",
    detail: "لقاح لوكيميا القطط",
    dueDate: "2026-09-01",
    channel: "sms",
    state: "sent",
  },
  {
    id: "rm4",
    petName: "روكي",
    ownerName: "ليلى عبد الله",
    phone: "07809876543",
    type: "appointment",
    detail: "تأكيد موعد الجراحة",
    dueDate: "2026-08-23",
    channel: "whatsapp",
    state: "failed",
  },
  {
    id: "rm5",
    petName: "لولو",
    ownerName: "يوسف حيدر",
    phone: "07512345678",
    type: "appointment",
    detail: "تذكير موعد الفحص",
    dueDate: "2026-08-23",
    channel: "whatsapp",
    state: "queued",
  },
];

export const clinic = {
  name: "عيادة الرفيق البيطرية",
  phone: "07700000911",
  whatsapp: "9647700000911",
  address: "بغداد - شارع الرواد، مقابل حديقة الزوراء",
  hours: "السبت - الخميس: 9 صباحاً - 9 مساءً | الجمعة: طوارئ فقط",
};

export function getDoctor(id: string) {
  return doctors.find((d) => d.id === id);
}

export function getService(id: string) {
  return services.find((s) => s.id === id);
}

export function getOwner(id: string) {
  return owners.find((o) => o.id === id);
}

export function formatIQD(value: number) {
  return `${value.toLocaleString("en-US")} د.ع`;
}
