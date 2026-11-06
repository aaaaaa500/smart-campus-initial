import { CURRENT_TIME } from "@/data/rooms";

/**
 * Format a Date as e.g. "10:00 AM" (en-US, 12-hour, 2-digit minutes).
 */
export function formatTime(d: Date): string {
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Parse an "HH:MM" string (from an <input type="time">) into a Date anchored
 * to the same demo day as CURRENT_TIME. Returns a fresh Date instance.
 */
export function parseTimeToAnchor(timeValue: string): Date {
  const [h, m] = timeValue.split(":").map(Number);
  const d = new Date(CURRENT_TIME);
  d.setHours(h, m, 0, 0);
  return d;
}
