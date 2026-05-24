import type { Call } from "../types";

const fmt = (iso: string) => {
  // Google Calendar expects YYYYMMDDTHHMMSSZ (UTC).
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
};

/**
 * Builds a "Add to Google Calendar" link for a call.
 */
export function googleCalendarUrl(call: Call): string {
  const start = call.start_date ?? call.application_deadline;
  const end = call.end_date ?? call.start_date ?? call.application_deadline;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: call.title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: call.subtitle ?? "",
    location: call.is_online ? "Online" : (call.location ?? ""),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
