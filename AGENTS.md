# AGENTS.md

## Project
Smart Campus room availability checker; one room checked at a time, fictional data.

## Structure
- src/lib/availability.ts: checkAvailability (booking rules)
- src/App.tsx: main UI (room picker, time inputs, result card)
- src/components/RoomTimeline.tsx: day timeline
- src/lib/datetime.ts: formatTime, parseTimeToAnchor (time helpers)
- src/data/rooms.ts: fixtures (rooms, bookings, fixed CURRENT_TIME). Do not modify, except the allowed changes below.
- src/availability.test.ts: availability tests
- src/lib/datetime.test.ts: time helper tests

## Constraints
Preserve AC1–AC6 (AC1 valid time, AC2 max 120 minutes, AC3 blocked room unbookable, AC4 overlap rules with touching allowed, AC5 booking data immutable, AC6 clear responsive user feedback, checked manually in the UI); no backend, login or booking creation.

Regression tests cover AC1–AC5. AC6 is UI-only and is verified manually.

## Engineering rules
Prefer pure functions and minimal changes; use at most 2 justified patterns.
Do not mutate booking fixtures; keep responsive UI feedback.
Malformed time input (not HH:MM) returns its own clear error message, distinct from the "unavailable" result.

## Commands
- Tests: npx vitest run
- Type check: npm run typecheck
- Lint: npm run lint
- Build: npm run build

## Forbidden
Do not change UI design, CURRENT_TIME or acceptance criteria.
Fixture exceptions (approved): add an `equipment` field to every room, and add bookings for r4. Do not change existing bookings or their times.

## Verification
Run existing tests and add focused regression tests.
Do not weaken or delete existing assertions.
Report changed files, rationale and test evidence.