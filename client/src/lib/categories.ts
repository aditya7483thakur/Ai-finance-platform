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
  { value: "SALARY", label: "Salary", icon: Briefcase, badge: "bg-success/15 text-success" },
  { value: "INVESTMENTS", label: "Investments", icon: TrendingUp, badge: "bg-secondary/15 text-secondary" },
  { value: "FOOD", label: "Food", icon: Utensils, badge: "bg-warning/15 text-warning" },
  { value: "TRANSPORT", label: "Transport", icon: Car, badge: "bg-primary/15 text-primary" },
  { value: "HOUSING", label: "Housing", icon: Home, badge: "bg-accent/15 text-accent" },
  { value: "ENTERTAINMENT", label: "Entertainment", icon: Clapperboard, badge: "bg-secondary/10 text-secondary" },
  { value: "TRAVEL", label: "Travel", icon: Plane, badge: "bg-primary/10 text-primary" },
  { value: "HEALTH", label: "Health", icon: HeartPulse, badge: "bg-error/15 text-error" },
  { value: "SHOPPING", label: "Shopping", icon: ShoppingBag, badge: "bg-warning/20 text-warning" },
  { value: "MISCELLANEOUS", label: "Miscellaneous", icon: CircleDot, badge: "bg-muted text-muted-foreground" },
];

export const getCategory = (value?: string) =>
  CATEGORIES.find((item) => item.value === value);

export const getCategoryLabel = (value?: string) =>
  getCategory(value)?.label ?? value ?? "";

export const getCategoryBadge = (value?: string) =>
  getCategory(value)?.badge ?? "bg-muted text-muted-foreground";

export const getCategoryIconClass = (value?: string) => {
  switch (value) {
    case "SALARY":
    case "INVESTMENTS":
      return "bg-success/15 text-success";
    case "FOOD":
    case "SHOPPING":
      return "bg-warning/15 text-warning";
    case "TRANSPORT":
    case "TRAVEL":
      return "bg-emerald-400/15 text-emerald-400";
    case "ENTERTAINMENT":
    case "HOUSING":
      return "bg-violet-400/15 text-violet-400";
    case "HEALTH":
      return "bg-error/15 text-error";
    default:
      return "bg-white/5 text-muted-foreground";
  }
};
