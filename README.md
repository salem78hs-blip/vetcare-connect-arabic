# Clinic Harmony

Build a modern, full-featured, and highly interactive Veterinary Clinic Management System and Public Website in Arabic (RTL direction).

The project consists of two primary parts:

Public Patient/Client Website (Homepage, Service Booking, Pet Health Tracker Lookup, Emergency Info).

Internal Admin & Doctor Dashboard (/admin or /dashboard) for managing appointments, medical records, pet profiles, and clinic operations.

🎨 Design System & Visual Guidelines

Direction: Full RTL layout (dir="rtl"), font family: Tajawal or Cairo (Google Fonts).

Color Palette:

Primary Accent: Teal / Emerald (#0d9488, #0f766e)

Secondary Accent: Soft Mint (#f0fdf4, #ccfbf1)

Background: Clean Off-White (#f8fafc)

Dark Elements / Text: Slate (#0f172a, #334155)

UI Feel: Friendly, hygienic, professional, and accessible. Use rounded corners (rounded-2xl), subtle shadows, clean badges, Lucide React icons, and clear call-to-action buttons.

🌐 Part 1: Public Client Portal (Website)

Header & Navigation:

Clinic Logo with a cute paw / medical icon.

Navigation links: الرئيسية (Home), الخدمات (Services), كادر الأطباء (Medical Staff), حجز موعد (Book Appointment), متابعة حالة أليف (Pet Lookup).

Quick Emergency Call Badge ("طوارئ 24/7" button with phone icon).

"لوحة التحكم" button linking to /dashboard.

Hero Section:

Compelling Arabic headline: "الرعاية المتكاملة التي يستحقها أليفك"

Subheading: "خدمات بيطرية متطورة، أطباء متخصصون، ونظام حجز سلس ومباشر."

Dual CTAs: "احجز موعداً الآن" (opens interactive modal) & "تواصل معنا عبر WhatsApp".

Hero Image/Illustration placeholder showing a warm veterinary environment.

Services Grid:

Interactive cards with icons & descriptions:

🩺 الكشف الفحص العام (General Checkup)

💉 التطعيمات واللقاحات (Vaccinations)

✂️ الحلاقة والعناية (Grooming & Spa)

🔬 الفحوصات والأشعة (Lab & X-Ray)

🩺 الجراحة والعمليات (Surgery)

🦷 العناية بالأسنان (Dental Care)

Clicking any service opens the booking wizard pre-selected with that service.

Multi-Step Interactive Booking Modal/Wizard:

Step 1: Pet Details: Select Pet Type (Cat 🐱, Dog 🐶, Bird 🦜, Other 🐾), Pet Name, and Age/Breed.

Step 2: Service & Doctor Selection: Choose service type and preferred doctor.

Step 3: Date & Time: Interactive calendar picker showing real-time available time slots.

Step 4: Owner Details & Confirmation: Owner Name, Phone Number, optional notes. Upon confirmation, show a styled success screen with booking ref code + "إرسال التذكرة عبر WhatsApp" button.

Pet Medical Lookup (متابعة سجل الأليف):

Input field to search by Pet ID or Owner Phone Number.

Displays a clean digital vaccination card and upcoming appointment status.

📊 Part 2: Admin & Doctor Dashboard (/dashboard)

Provide a tabbed or sidebar layout containing:

Overview & Analytics:

Metric Cards: مواعيد اليوم (Today's Appointments), المرضى الجدد (New Pets), الجلسات المكتملة (Completed Visits), إجمالي الإيرادات (Total Revenue).

Interactive Bar/Line Chart mockup for monthly visits trend.

Upcoming appointments list with quick status change buttons (تأكيد / تم الحضور / إلغاء).

Appointments Calendar & List Management:

View mode toggle: List View vs. Day/Week Calendar View.

Filter by Doctor, Status, or Date.

"إضافة حجز يدوي" (Add Walk-in Appointment) modal.

Pet & Owner CRM (إدارة المرضى والأليفين):

Searchable table of owners and their registered pets.

Clicking a pet opens a Detailed Pet Health Dossier:

Owner info & contact details.

Medical History timeline (past visits, diagnoses, prescribed medications).

Vaccination schedule with progress bars.

Uploaded medical files/images placeholder.

Digital Prescription & Diagnosis Generator (شاشة الطبيب):

Form for doctors during consultation:

Select Patient / Pet.

Symptoms & Diagnosis notes.

Prescribed Medications (name, dosage, duration).

Next Visit / Vaccination due date.

"طباعة الوصفة الطبية" (Print Prescription) button generating a styled printable PDF-like receipt with clinic letterhead.

Automated Reminders & WhatsApp Queue:

Table showing pending vaccination reminders and appointment confirmations.

Toggle switches for auto-SMS/WhatsApp triggers.

🛠️ Technical Implementation Details

Build using React, Tailwind CSS, and Lucide Icons (or FontAwesome).

Provide complete mock datasets (Pets, Appointments, Doctors, Services) so the entire app works flawlessly visually and interactively out of the box.

Ensure all forms have client-side validation and toast notifications (using sonner or react-hot-toast).

Structure pages so backend integration with Supabase (Tables: owners, pets, appointments, medical_records, services) can be easily connected.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e95a30ee-933d-41f1-8cda-ceb7f6562f46).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
