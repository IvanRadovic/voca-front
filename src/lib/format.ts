// Date / value formatting helpers.

export function formatDate(value: string | null, locale = "en"): string {
  if (!value) return "-";
  return new Date(value).toLocaleDateString(
    locale === "cnr" ? "sr-Latn-ME" : "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

export function formatDateTime(value: string | null, locale = "en"): string {
  if (!value) return "-";
  return new Date(value).toLocaleString(
    locale === "cnr" ? "sr-Latn-ME" : "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}

export function isPast(value: string | null): boolean {
  if (!value) return false;
  return new Date(value).getTime() < Date.now();
}

export function formatPrice(price: number, freeLabel: string): string {
  return price > 0 ? `€${price.toFixed(2)}` : freeLabel;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
