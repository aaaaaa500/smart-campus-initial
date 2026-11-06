import { bookings, CURRENT_TIME } from "@/data/rooms";
import { formatTime } from "@/lib/datetime";
import { useMemo } from "react";

interface RoomTimelineProps {
  roomId: string;
  candidate?: { start: Date; end: Date; available: boolean };
}

// Day bounds for the timeline: 07:00 – 22:00
const DAY_START = 7;
const DAY_END = 22;
const SPAN = DAY_END - DAY_START;

function toPercent(date: Date): number {
  const d = new Date(CURRENT_TIME);
  d.setHours(date.getHours(), date.getMinutes(), 0, 0);
  const minutes = (d.getHours() - DAY_START) * 60 + d.getMinutes();
  return (minutes / (SPAN * 60)) * 100;
}

export default function RoomTimeline({ roomId, candidate }: RoomTimelineProps) {
  const roomBookings = useMemo(
    () => bookings.filter((b) => b.roomId === roomId),
    [roomId],
  );

  const hours = useMemo(
    () => Array.from({ length: SPAN + 1 }, (_, i) => DAY_START + i),
    [],
  );

  const nowPct = toPercent(CURRENT_TIME);

  return (
    <div className="w-full">
      <div className="relative h-20 w-full rounded-xl bg-slate-100/80 ring-1 ring-inset ring-slate-200/80 overflow-hidden">
        {/* Hour gridlines + labels */}
        {hours.map((h) => (
          <div
            key={h}
            className="absolute top-0 bottom-0 border-l border-slate-200/60"
            style={{ left: `${((h - DAY_START) / SPAN) * 100}%` }}
          >
            <span className="absolute top-0.5 left-1 text-[10px] text-slate-400 font-medium tabular-nums">
              {h <= 12 ? h : h - 12}
              {h < 12 ? "a" : "p"}
            </span>
          </div>
        ))}

        {/* Existing bookings */}
        {roomBookings.map((b) => {
          const left = toPercent(new Date(b.start));
          const right = toPercent(new Date(b.end));
          const width = Math.max(right - left, 1.5);
          return (
            <div
              key={b.id}
              className="absolute top-7 bottom-2.5 rounded-md bg-rose-300/70 ring-1 ring-rose-400/80 flex items-center justify-center overflow-hidden"
              style={{ left: `${left}%`, width: `${width}%` }}
              title={`${b.bookedBy} · ${formatTime(new Date(b.start))}–${formatTime(new Date(b.end))}`}
            >
              {width > 8 && (
                <span className="text-[10px] font-medium text-rose-900 px-1 truncate">
                  {b.bookedBy}
                </span>
              )}
            </div>
          );
        })}

        {/* Candidate interval */}
        {candidate && (
          <div
            className={`absolute top-7 bottom-2.5 rounded-md ring-2 flex items-center justify-center ${
              candidate.available
                ? "bg-emerald-400/50 ring-emerald-500"
                : "bg-amber-400/50 ring-amber-500"
            }`}
            style={{
              left: `${toPercent(candidate.start)}%`,
              width: `${Math.max(toPercent(candidate.end) - toPercent(candidate.start), 1.5)}%`,
            }}
          />
        )}

        {/* Current time marker */}
        {nowPct >= 0 && nowPct <= 100 && (
          <div
            className="absolute top-0 bottom-0 w-px bg-slate-900/50 z-10"
            style={{ left: `${nowPct}%` }}
          >
            <span className="absolute top-0.5 -translate-x-1/2 text-[9px] font-bold text-white bg-slate-800 px-1.5 py-0.5 rounded shadow-sm tabular-nums">
              now
            </span>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-rose-300/70 ring-1 ring-rose-400/80" />
          Booked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-emerald-400/50 ring-2 ring-emerald-500" />
          Your request
        </span>
      </div>
    </div>
  );
}

