import { describe, it, expect } from "vitest";
import { formatTime, parseTimeToAnchor } from "./datetime";
import { CURRENT_TIME } from "../data/rooms";

// norm = replace the special space before AM/PM with a normal one
// norm = заменить особый пробел перед AM/PM на обычный
const norm = (s: string) => s.replace(/\u202f/g, " ");

describe("formatTime", () => {
  it("formats a morning time / форматирует утреннее время", () => {
    // d = a test date, month 9 means October (months start from 0)
    // d = тестовая дата, месяц 9 это октябрь (месяцы считаются с 0)
    const d = new Date(2026, 9, 7, 10, 0);
    expect(norm(formatTime(d))).toBe("10:00 AM");
  });

  it("formats an afternoon time with 2-digit minutes / форматирует время после обеда", () => {
    const d = new Date(2026, 9, 7, 14, 5);
    expect(norm(formatTime(d))).toBe("2:05 PM");
  });
});

describe("parseTimeToAnchor", () => {
  it("sets the hours and minutes / ставит часы и минуты", () => {
    // result = the Date made from the "HH:MM" text
    // result = дата, сделанная из текста "HH:MM"
    const result = parseTimeToAnchor("14:30");
    expect(result.getHours()).toBe(14);
    expect(result.getMinutes()).toBe(30);
  });

  it("keeps the same day as CURRENT_TIME / остаётся в тот же день, что и CURRENT_TIME", () => {
    const result = parseTimeToAnchor("08:15");
    const now = new Date(CURRENT_TIME);
    expect(result.getFullYear()).toBe(now.getFullYear());
    expect(result.getMonth()).toBe(now.getMonth());
    expect(result.getDate()).toBe(now.getDate());
  });

  it("does not change CURRENT_TIME / не меняет CURRENT_TIME", () => {
    // before = CURRENT_TIME in milliseconds before the call
    // before = CURRENT_TIME в миллисекундах до вызова
    const before = new Date(CURRENT_TIME).getTime();
    parseTimeToAnchor("23:59");
    expect(new Date(CURRENT_TIME).getTime()).toBe(before);
  });
});