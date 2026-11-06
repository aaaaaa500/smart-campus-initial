import { useMemo, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Users,
  Lock,
  Search,
  Building2,
  RotateCcw,
  CalendarDays,
  CircleDot,
} from "lucide-react";
import { rooms, bookings, CURRENT_TIME, type Room } from "@/data/rooms";
import { checkAvailability, type AvailabilityResult } from "@/lib/availability";
import { formatTime, parseTimeToAnchor } from "@/lib/datetime";
import RoomTimeline from "@/components/RoomTimeline";

export default function App() {
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [result, setResult] = useState<AvailabilityResult | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  const selectedRoom = useMemo<Room | null>(
    () => rooms.find((r) => r.id === selectedRoomId) ?? null,
    [selectedRoomId],
  );

  const candidate = useMemo(() => {
    if (!hasChecked || !result || !startTime || !endTime) return undefined;
    const s = parseTimeToAnchor(startTime);
    const e = parseTimeToAnchor(endTime);
    return { start: s, end: e, available: result.status === "available" };
  }, [hasChecked, result, startTime, endTime]);

  const handleCheck = () => {
    const res = checkAvailability(selectedRoom, startTime, endTime);
    setResult(res);
    setHasChecked(true);
  };

  const handleReset = () => {
    setSelectedRoomId("");
    setStartTime("");
    setEndTime("");
    setResult(null);
    setHasChecked(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/80 text-slate-900">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200/80 sticky top-0 z-20 shadow-sm shadow-slate-100/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Building2 size={22} />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold leading-tight tracking-tight">Smart Campus</h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-tight">Room Availability Checker</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Current time banner */}
        <div className="mb-5 flex items-center gap-2.5 text-sm text-slate-600 bg-white rounded-xl border border-slate-200/80 px-4 py-3 shadow-sm shadow-slate-100/40">
          <Clock size={16} className="text-slate-400 shrink-0" />
          <span>
            Current time:{" "}
            <strong className="text-slate-900 font-semibold">
              {CURRENT_TIME.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </strong>
            <span className="text-slate-400"> · {CURRENT_TIME.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm shadow-slate-200/30 overflow-hidden">
          {/* Room selection */}
          <section className="p-5 sm:p-6 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-3.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold shrink-0">1</span>
              <label className="text-sm font-semibold text-slate-800">
                Choose a room
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rooms.map((room) => {
                const selected = room.id === selectedRoomId;
                const blocked = room.status === "blocked";
                return (
                  <button
                    key={room.id}
                    onClick={() => {
                      setSelectedRoomId(room.id);
                      setHasChecked(false);
                      setResult(null);
                    }}
                    className={`text-left rounded-xl border p-4 transition-all duration-150 ${
                      selected
                        ? "border-slate-900 bg-slate-50 ring-2 ring-slate-900/10 shadow-sm"
                        : blocked
                        ? "border-slate-200 bg-slate-50/30 hover:bg-slate-50/60"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 hover:shadow-sm"
                    } ${blocked ? "opacity-65" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className={`font-semibold leading-tight ${selected ? "text-slate-900" : "text-slate-800"}`}>{room.name}</p>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                          <MapPin size={12} className="shrink-0" />
                          <span className="truncate">{room.building}</span>
                        </div>
                      </div>
                      {blocked ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-full ring-1 ring-rose-100 shrink-0">
                          <Lock size={11} /> Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full ring-1 ring-emerald-100 shrink-0">
                          <Users size={11} /> {room.capacity}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Time selection */}
          <section className="p-5 sm:p-6 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-3.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold shrink-0">2</span>
              <label className="text-sm font-semibold text-slate-800">
                Pick a time
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="start-time" className="text-xs font-medium text-slate-500 block mb-1.5">
                  Start time
                </label>
                <input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    setHasChecked(false);
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm bg-slate-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-slate-900/15 focus:border-slate-400 focus:bg-white"
                />
              </div>
              <div>
                <label htmlFor="end-time" className="text-xs font-medium text-slate-500 block mb-1.5">
                  End time
                </label>
                <input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    setHasChecked(false);
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm bg-slate-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-slate-900/15 focus:border-slate-400 focus:bg-white"
                />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
              <CircleDot size={11} className="shrink-0" />
              Max booking length: 120 minutes. Start time must be after the current time.
            </p>
          </section>

          {/* Action buttons */}
          <section className="p-5 sm:p-6 border-b border-slate-100">
            <div className="flex gap-3">
              <button
                onClick={handleCheck}
                disabled={!selectedRoomId || !startTime || !endTime}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white text-sm font-semibold px-4 py-3 shadow-sm shadow-slate-300/50 hover:bg-slate-800 hover:shadow-md hover:shadow-slate-300/50 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-150"
              >
                <Search size={17} />
                Check Availability
              </button>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium px-4 py-3 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all duration-150"
              >
                <RotateCcw size={15} />
                Reset
              </button>
            </div>
          </section>

          {/* Result */}
          {hasChecked && result && (
            <section className="p-5 sm:p-6">
              <div
                className={`relative rounded-2xl overflow-hidden border shadow-lg shadow-slate-200/50 ${
                  result.status === "available"
                    ? "bg-gradient-to-br from-emerald-50 via-emerald-50/70 to-white border-emerald-200"
                    : "bg-gradient-to-br from-rose-50 via-rose-50/70 to-white border-rose-200"
                }`}
              >
                {/* Top accent bar */}
                <div
                  className={`h-1.5 w-full ${
                    result.status === "available"
                      ? "bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400"
                      : "bg-gradient-to-r from-rose-400 via-rose-500 to-rose-400"
                  }`}
                />
                <div className="flex items-start gap-5 p-5 sm:p-6">
                  {/* Circular icon badge */}
                  <div className="relative shrink-0">
                    <div
                      className={`flex items-center justify-center w-16 h-16 rounded-full ring-4 ${
                        result.status === "available"
                          ? "bg-emerald-500 ring-emerald-100"
                          : "bg-rose-500 ring-rose-100"
                      }`}
                    >
                      {result.status === "available" ? (
                        <CheckCircle2 size={34} className="text-white" strokeWidth={2.5} />
                      ) : (
                        <XCircle size={34} className="text-white" strokeWidth={2.5} />
                      )}
                    </div>
                  </div>
                  {/* Content */}
                  <div className="min-w-0 flex-1 pt-1">
                    <h3
                      className={`font-extrabold text-2xl sm:text-3xl leading-tight tracking-tight ${
                        result.status === "available" ? "text-emerald-900" : "text-rose-900"
                      }`}
                    >
                      {result.status === "available" ? "Available" : "Unavailable"}
                    </h3>
                    <p
                      className={`text-sm font-medium mt-0.5 ${
                        result.status === "available" ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {result.status === "available" ? "Room available" : "Room unavailable"}
                    </p>
                    <div
                      className={`mt-3 pt-3 border-t ${
                        result.status === "available"
                          ? "border-emerald-200/60"
                          : "border-rose-200/60"
                      }`}
                    >
                      <p
                        className={`text-sm leading-relaxed ${
                          result.status === "available" ? "text-emerald-800/90" : "text-rose-800/90"
                        }`}
                      >
                        {result.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Timeline for selected room */}
          {selectedRoom && (
            <section className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2 mb-3.5">
                <CalendarDays size={15} className="text-slate-400 shrink-0" />
                <p className="text-sm font-semibold text-slate-700">
                  {selectedRoom.name} — today's schedule
                </p>
              </div>
              <RoomTimeline roomId={selectedRoom.id} candidate={candidate} />
            </section>
          )}
        </div>

        {/* Existing bookings reference */}
        {selectedRoom && (
          <div className="mt-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <CalendarDays size={12} />
              Existing bookings
            </p>
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm shadow-slate-100/40 divide-y divide-slate-100 overflow-hidden">
              {bookings.filter((b) => b.roomId === selectedRoom.id).length === 0 ? (
                <p className="px-4 py-4 text-sm text-slate-400 italic">No existing bookings for this room.</p>
              ) : (
                bookings
                  .filter((b) => b.roomId === selectedRoom.id)
                  .map((b) => (
                    <div key={b.id} className="flex items-center justify-between px-4 py-3.5 text-sm hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                        <span className="text-slate-700 truncate">{b.bookedBy}</span>
                      </div>
                      <span className="text-slate-500 tabular-nums font-medium shrink-0 ml-3">
                        {formatTime(new Date(b.start))} – {formatTime(new Date(b.end))}
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        <footer className="mt-8 text-center text-xs text-slate-400">
          Fictional sample data for demonstration purposes only.
        </footer>
      </main>
    </div>
  );
}

