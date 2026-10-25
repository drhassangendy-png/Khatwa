# Khatwa / خطوة

This app runs in the existing React + Vite + TypeScript project. All implementation files are included; no backend change or external prayer-time API is required.

## Habit rules

- Build habits earn one step per completed due date. Elapsed, unrecorded due dates deduct one cumulative step, with a zero floor. Off days never count.
- Gentle mode preserves the streak after one missed due date and resets after two consecutive misses. Strict mode is off by default and resets after one.
- Two freezes per calendar month are shared by the tracked habits. A freeze neither earns nor deducts a point and protects the streak.
- Make-up records use the original due date. Quit recovery restores a past deduction only after the replacement day closes within its limit; it does not convert the past count into a successful day. One replacement quit day recovers at most one earlier day.
- Quit days succeed at or below the configured limit, including zero. Today's status is provisional until device-local midnight. Closed-day limits are retained when a limit is edited. The “days within your limit” count excludes today.
- Automatic settlement starts on creation or migration, never retroactively charging old unrecorded dates. Reopening the app settles elapsed due dates once. Previously recorded history remains in backups.
- Partial five-prayer days are neutral for points and streaks. All five checkmarks complete the habit day. Prior prayer dates are selectable for make-up.

## Scheduling and prayer calculations

Daily, weekly quota with chosen weekdays, arbitrary weekdays, and monthly date / last-day schedules share one due-date engine. A nonexistent monthly date is skipped, not moved. Fasting Monday/Thursday and Umm al-Qura White Days (13–15 Hijri, manual ±1 day) use the same engine. The Habits page shows only today's due habits. Progress provides access to all habits for editing and recovery.

A dependency-free local solar calculator uses Meeus solar-position equations and the Egyptian Survey Authority parameters (Fajr 19.5°, Isha 17.5°, standard one-shadow Asr, and Dhuhr one minute after solar noon). Calculations produce UTC instants; displayed times use the saved IANA time zone. Coordinates are explicitly supplied via browser location permission or manual entry and are never sent to an external service. At high latitudes, twilight is bounded by the midpoint of the night when sunrise and sunset exist; unavailable polar solar events are omitted with an explanation, not assigned invented times. Verify calculated times with the local mosque. Daily tracking dates and ordinary habit reminders use the device calendar and clock.

## Notifications

Web Audio chimes require a click on “Enable and test sound & notifications” after opening the app. Mute is persisted. Browser notifications require separate permission. In-app reminders remain available without system permission. Reminders require the app to be open; browsers can delay background tabs. No service worker or closed-app alarm guarantee is implied.

## Persistence and exports

Local state uses `khatwa-v1`. JSON version 3 preserves counters, closed-day limits, prayer checkmarks, make-ups, freezes, schedules, settings, location, weight and custom categories. Version 2 and legacy raw snapshots are migrated. Cloud backups remain manual and owner-protected in the existing `khatwa_backups` table. CSV is a localized, formula-safe report; JSON is the restorable format. Cloud snapshot and import size limits are enforced.

## Regression tests

Run `npx vitest run --config vitest.config.ts` from the project root. Tests cover schedules, leap years, White Days, gentle/strict streaks, freezes, settlement idempotence, quit thresholds, recovery, prayer partial days, backup migration and numerals. Prayer calculation tests also cover Egyptian-method reference fixtures, valid chronological times, device-time-zone independence, adjacent UTC dates, invalid inputs, high-latitude twilight and polar day. Reference fixtures are static; the app and tests make no prayer-service requests. These tests have been added but could not be executed by the editor toolset in this session.

Google OAuth implementation and PKCE popup flow are preserved. Provider credentials remain a Cloud Auth Settings requirement; this session does not configure or verify Google sign-in.
