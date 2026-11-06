import { bookings, CURRENT_TIME, type Room } from "@/data/rooms";
import { formatTime, parseTimeToAnchor } from "@/lib/datetime";

export type AvailabilityResult =
  | { status: "available"; message: string }
  | { status: "unavailable"; message: string };

const MAX_MINUTES = 120;

/**
 * Two intervals [aStart, aEnd) and [bStart, bEnd) overlap when each starts
 * before the other ends. Touching endpoints (aEnd === bStart) do NOT overlap.
 */
function intervalsOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

function minutesBetween(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / 60000;
}

export function checkAvailability(
  room: Room | null,
  startTime: string,
  endTime: string,
): AvailabilityResult {
  if (!room) {
    return { status: "unavailable", message: "Please select a room first." };
  }

  if (!startTime || !endTime) {
    return { status: "unavailable", message: "Please enter both a start and end time." };
  }

  const start = parseTimeToAnchor(startTime);
  const end = parseTimeToAnchor(endTime);

  // Rule: start must be before end.
  if (start.getTime() >= end.getTime()) {
    return { status: "unavailable", message: "The start time must be earlier than the end time." };
  }

  // Rule: start must be after the current time.
  if (start.getTime() <= CURRENT_TIME.getTime()) {
    return {
      status: "unavailable",
      message: `The start time must be after the current time (${formatTime(CURRENT_TIME)}).`,
    };
  }

  // Rule: no booking longer than 120 minutes.
  const duration = minutesBetween(start, end);
  if (duration > MAX_MINUTES) {
    return {
      status: "unavailable",
      message: `Bookings cannot be longer than ${MAX_MINUTES} minutes. Your request is ${Math.round(duration)} minutes.`,
    };
  }

  // Rule: a blocked room is always unavailable.
  if (room.status === "blocked") {
    return {
      status: "unavailable",
      message: `${room.name} is currently blocked and cannot be booked.`,
    };
  }

  // Rule: reject overlapping bookings (touching intervals are allowed).
  const roomBookings = bookings.filter((b) => b.roomId === room.id);

  const conflict = roomBookings.find((b) =>
    intervalsOverlap(start, end, new Date(b.start), new Date(b.end)),
  );

  if (conflict) {
    return {
      status: "unavailable",
      message: `${room.name} is booked from ${formatTime(new Date(conflict.start))} to ${formatTime(new Date(conflict.end))} (${conflict.bookedBy}).`,
    };
  }

  return {
    status: "available",
    message: `${room.name} is available from ${formatTime(start)} to ${formatTime(end)} (${Math.round(duration)} min). You can book it now.`,
  };
}
