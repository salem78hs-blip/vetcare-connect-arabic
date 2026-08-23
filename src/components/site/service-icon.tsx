import {
  Stethoscope,
  Syringe,
  Scissors,
  Microscope,
  HeartPulse,
  Bone,
  type LucideIcon,
} from "lucide-react";
import type { Service } from "@/data/clinic";

const map: Record<Service["icon"], LucideIcon> = {
  stethoscope: Stethoscope,
  syringe: Syringe,
  scissors: Scissors,
  microscope: Microscope,
  "heart-pulse": HeartPulse,
  bone: Bone,
};

export function ServiceIcon({ name, className }: { name: Service["icon"]; className?: string }) {
  const Icon = map[name];
  return <Icon className={className} aria-hidden="true" />;
}
