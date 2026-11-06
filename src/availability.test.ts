import { describe, it, expect } from "vitest";
// CHANGE THIS LINE if your file has another name / ПОМЕНЯЙ ЭТУ СТРОКУ, если файл называется иначе
import { checkAvailability } from "./lib/availability";
import { rooms, bookings } from "./data/rooms";

// helper: find a room by id / помощник: найти комнату по id
// room = one room object, id = "r1", "r2"... / room = объект комнаты, id = "r1", "r2"...
const getRoom = (id: string) => rooms.find((room) => room.id === id)!;

// "Now" is 10:00 (CURRENT_TIME). / «Сейчас» 10:00 (CURRENT_TIME).
describe("checkAvailability", () => {
  // AC1: start >= end, or start in the past / начало >= конца, или начало в прошлом
  it("AC1-a: start equals end is unavailable / начало равно концу, занято", () => {
    expect(checkAvailability(getRoom("r5"), "11:00", "11:00").status).toBe("unavailable");
  });
  it("AC1-b: start in the past is unavailable / начало в прошлом, занято", () => {
    expect(checkAvailability(getRoom("r5"), "09:00", "09:30").status).toBe("unavailable");
  });
    it("AC1-c: start after end (reversed) is unavailable / начало позже конца, занято", () => {
    // 13:00 is in the future, so only the reversed interval can reject it
    // 13:00 в будущем, значит отклонить может только перевёрнутый интервал
    expect(checkAvailability(getRoom("r5"), "13:00", "12:00").status).toBe("unavailable");
  });

  // AC2: max 120 minutes / максимум 120 минут
  it("AC2-a: exactly 120 min is available / ровно 120 минут, свободно", () => {
    expect(checkAvailability(getRoom("r5"), "11:00", "13:00").status).toBe("available");
  });
  it("AC2-b: 121 min is unavailable / 121 минута, занято", () => {
    expect(checkAvailability(getRoom("r5"), "11:00", "13:01").status).toBe("unavailable");
  });

  // AC3: blocked room / заблокированная комната
  it("AC3: blocked room is unavailable / заблокированная комната, занято", () => {
    expect(checkAvailability(getRoom("r4"), "12:00", "13:00").status).toBe("unavailable");
  });

  // AC4: overlap rejected, touching allowed / пересечение нельзя, касание можно
  // r2 has a booking 11:00-12:00 / у r2 есть бронь 11:00-12:00
  it("AC4-a: real overlap is unavailable / настоящее пересечение, занято", () => {
    expect(checkAvailability(getRoom("r2"), "11:30", "12:30").status).toBe("unavailable");
  });
  it("AC4-b: touching at the end is available / касание в конце брони, свободно", () => {
    expect(checkAvailability(getRoom("r2"), "12:00", "13:00").status).toBe("available");
  });
  it("AC4-c: touching at the start is available / касание в начале брони, свободно", () => {
    expect(checkAvailability(getRoom("r2"), "10:30", "11:00").status).toBe("available");
  });

  // AC5: the bookings array must not change / массив bookings не должен меняться
  it("AC5: bookings array is not modified / массив bookings не изменился", () => {
    // before = copy of bookings as text before the call / before = копия bookings до вызова
    const before = JSON.stringify(bookings);
    checkAvailability(getRoom("r1"), "11:00", "12:00");
    expect(JSON.stringify(bookings)).toBe(before);
  });
});