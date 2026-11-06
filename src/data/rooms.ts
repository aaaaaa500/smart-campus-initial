// Fictional sample room and booking data — do not modify.
// Rooms have a status: "open" means bookable, "blocked" means unavailable regardless of schedule.

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  status: "open" | "blocked";
}

export interface Booking {
  id: string;
  roomId: string;
  start: string; // ISO 8601 string
  end: string; // ISO 8601 string
  bookedBy: string;
}

// "Now" is fixed for deterministic prototype behaviour.
// 2026-10-07T10:00:00 local — keeps the demo consistent on every load.
const CURRENT_ISO = "2026-10-07T10:00:00";

export const CURRENT_TIME = new Date(CURRENT_ISO);

export const rooms: Room[] = [
  { id: "r1", name: "Athena Hall", building: "North Wing", capacity: 120, status: "open" },
  { id: "r2", name: "Tesla Lab", building: "East Wing", capacity: 40, status: "open" },
  { id: "r3", name: "Curie Room", building: "South Wing", capacity: 30, status: "open" },
  { id: "r4", name: "Newton Study", building: "West Wing", capacity: 25, status: "blocked" },
  { id: "r5", name: "Da Vinci Studio", building: "Central", capacity: 18, status: "open" },
];

// All bookings fall on the same demo day (2026-10-07).
export const bookings: Booking[] = [
  { id: "b1", roomId: "r1", start: "2026-10-07T09:00", end: "2026-10-07T10:30", bookedBy: "Intro to Algorithms" },
  { id: "b2", roomId: "r1", start: "2026-10-07T13:00", end: "2026-10-07T14:00", bookedBy: "Faculty Meeting" },
  { id: "b3", roomId: "r2", start: "2026-10-07T11:00", end: "2026-10-07T12:00", bookedBy: "Robotics Lab" },
  { id: "b4", roomId: "r3", start: "2026-10-07T10:00", end: "2026-10-07T11:30", bookedBy: "Chemistry Seminar" },
  { id: "b5", roomId: "r5", start: "2026-10-07T15:30", end: "2026-10-07T16:30", bookedBy: "Art Workshop" },
];
