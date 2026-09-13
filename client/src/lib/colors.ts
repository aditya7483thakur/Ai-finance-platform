// Named brand colors only. For a lighter or darker look, use Tailwind
// opacity on the same token (bg-primary/10, text-error/80). Do not add
// extra identities like primaryLight.
export const colors = {
  primary: "#2679f3",
  secondary: "#0a2463",
  accent: "#4f46e5",
  success: "#16a34a",
  error: "#ef4444",
  warning: "#d97706",
} as const;

export const chartColors = [
  colors.primary,
  colors.warning,
  colors.success,
  colors.accent,
  colors.secondary,
  colors.error,
] as const;

export const applyColorVariables = () => {
  const root = document.documentElement;
  root.style.setProperty("--primary", colors.primary);
  root.style.setProperty("--secondary", colors.secondary);
  root.style.setProperty("--accent", colors.accent);
  root.style.setProperty("--success", colors.success);
  root.style.setProperty("--error", colors.error);
  root.style.setProperty("--warning", colors.warning);
  root.style.setProperty("--destructive", colors.error);
};
