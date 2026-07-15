import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function formatUpdatedAt(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: es });
  } catch {
    return "";
  }
}

export function formatShortDate(iso: string): string {
  try {
    return format(new Date(iso), "d MMM", { locale: es });
  } catch {
    return iso;
  }
}

export function formatMetric(value: number, unit: string): string {
  const rounded = Number.isInteger(value) ? value : Math.round(value * 10) / 10;
  return `${rounded}${unit}`;
}
