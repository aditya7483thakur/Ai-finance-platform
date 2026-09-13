import {
  Briefcase,
  Car,
  CircleDot,
  Clapperboard,
  HeartPulse,
  Home,
  Plane,
  ShoppingBag,
  TrendingUp,
  Utensils,
  type LucideIcon,
} from "lucide-react";

export const CATEGORIES: {
  value: string;
  label: string;
  icon: LucideIcon;
  badge: string;
}[] = [
  { value: "SALARY", label: "Salary", icon: Briefcase, badge: "bg-green-100 text-green-800" },
  { value: "INVESTMENTS", label: "Investments", icon: TrendingUp, badge: "bg-teal-100 text-teal-800" },
  { value: "FOOD", label: "Food", icon: Utensils, badge: "bg-orange-100 text-orange-800" },
  { value: "TRANSPORT", label: "Transport", icon: Car, badge: "bg-blue-100 text-blue-800" },
  { value: "HOUSING", label: "Housing", icon: Home, badge: "bg-indigo-100 text-indigo-800" },
  { value: "ENTERTAINMENT", label: "Entertainment", icon: Clapperboard, badge: "bg-purple-100 text-purple-800" },
  { value: "TRAVEL", label: "Travel", icon: Plane, badge: "bg-cyan-100 text-cyan-800" },
  { value: "HEALTH", label: "Health", icon: HeartPulse, badge: "bg-red-100 text-red-800" },
  { value: "SHOPPING", label: "Shopping", icon: ShoppingBag, badge: "bg-pink-100 text-pink-800" },
  { value: "MISCELLANEOUS", label: "Miscellaneous", icon: CircleDot, badge: "bg-slate-100 text-slate-700" },
];

export const getCategory = (value?: string) =>
  CATEGORIES.find((item) => item.value === value);

export const getCategoryLabel = (value?: string) =>
  getCategory(value)?.label ?? value ?? "";

export const getCategoryBadge = (value?: string) =>
  getCategory(value)?.badge ?? "bg-slate-100 text-slate-700";
