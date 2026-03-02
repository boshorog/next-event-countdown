import { useState, useEffect } from "react";
import { CalendarDays, Church, Clock, Heart, BookOpen, Bell, Flame, Cross, Star } from "lucide-react";

// ─── Recurrence Types ───
export type RecurrenceType = "weekly" | "biweekly" | "monthly-dow" | "monthly-date" | "daily";

export interface ServiceSchedule {
  recurrenceType: RecurrenceType;
  day: number; // 0=Sun … 6=Sat (used for weekly, biweekly, monthly-dow)
  hour: number;
  minute: number;
  title: string;
  timezone?: string;
  duration?: number; // duration in minutes
  // biweekly: anchor date (ISO yyyy-mm-dd) to calculate odd/even weeks
  biweeklyStart?: string;
  // monthly-dow: which occurrence in month (1=first, 2=second, 3=third, 4=fourth, -1=last)
  monthlyWeek?: number;
  // monthly-date: day of month (1-31)
  monthlyDay?: number;
}

export interface SpecialEvent {
  date: string; // ISO yyyy-mm-dd
  hour: number;
  minute: number;
  title: string;
  timezone?: string;
  duration?: number; // duration in minutes
}

export const TIMEZONE_OPTIONS = [
  { value: "Pacific/Honolulu", label: "Hawaii (UTC-10)", offset: -10 },
  { value: "America/Anchorage", label: "Alaska (UTC-9)", offset: -9 },
  { value: "America/Los_Angeles", label: "Los Angeles (UTC-8)", offset: -8 },
  { value: "America/Denver", label: "Denver (UTC-7)", offset: -7 },
  { value: "America/Chicago", label: "Chicago (UTC-6)", offset: -6 },
  { value: "America/New_York", label: "New York (UTC-5)", offset: -5 },
  { value: "America/Sao_Paulo", label: "São Paulo (UTC-3)", offset: -3 },
  { value: "Atlantic/Azores", label: "Azores (UTC-1)", offset: -1 },
  { value: "UTC", label: "UTC (UTC+0)", offset: 0 },
  { value: "Europe/London", label: "London (UTC+0/+1)", offset: 0 },
  { value: "Europe/Paris", label: "Paris (UTC+1)", offset: 1 },
  { value: "Europe/Bucharest", label: "Bucharest (UTC+2)", offset: 2 },
  { value: "Europe/Moscow", label: "Moscow (UTC+3)", offset: 3 },
  { value: "Asia/Dubai", label: "Dubai (UTC+4)", offset: 4 },
  { value: "Asia/Kolkata", label: "India (UTC+5:30)", offset: 5.5 },
  { value: "Asia/Shanghai", label: "Shanghai (UTC+8)", offset: 8 },
  { value: "Asia/Tokyo", label: "Tokyo (UTC+9)", offset: 9 },
  { value: "Australia/Sydney", label: "Sydney (UTC+10/+11)", offset: 10 },
  { value: "Pacific/Auckland", label: "Auckland (UTC+12)", offset: 12 },
];

const DEFAULT_TIMEZONE = "Europe/Bucharest";

export type DateFormatType = 
  | "full"           // Sunday, March 2, 2026 at 10:00
  | "long"           // March 2, 2026 at 10:00
  | "medium"         // Mar 2, 2026 at 10:00
  | "short"          // 3/2/2026 10:00
  | "day-month"      // Sunday, March 2 at 10:00
  | "relative";      // Tomorrow at 10:00 / Today at 10:00

export const DATE_FORMAT_OPTIONS: { value: DateFormatType; label: string; example: string }[] = [
  { value: "full", label: "Full", example: "Sunday, March 2, 2026 at 10:00" },
  { value: "long", label: "Long", example: "March 2, 2026 at 10:00" },
  { value: "medium", label: "Medium", example: "Mar 2, 2026 at 10:00" },
  { value: "short", label: "Short", example: "3/2/2026 10:00" },
  { value: "day-month", label: "Day & Month", example: "Sunday, March 2 at 10:00" },
  { value: "relative", label: "Relative", example: "Tomorrow at 10:00" },
];

export interface CountdownConfig {
  icon: string;
  iconColor: string;
  headerLabel: string;
  liveLabel: string;
  dateFormat: DateFormatType;
  labelDays: string;
  labelHours: string;
  labelMinutes: string;
  labelSeconds: string;
  schedules: ServiceSchedule[];
  specialEvents: SpecialEvent[];
  bgColor: string;
  textColor: string;
  digitColor: string;
  separatorColor: string;
  labelColor: string;
  showBorder: boolean;
  headerScale: number;
}

export const defaultCountdownConfig: CountdownConfig = {
  icon: "Church",
  iconColor: "#6366f1",
  headerLabel: "Next Event",
  liveLabel: "Happening Now",
  dateFormat: "full",
  labelDays: "Days",
  labelHours: "Hours",
  labelMinutes: "Minutes",
  labelSeconds: "Seconds",
  schedules: [
    { recurrenceType: "weekly", day: 0, hour: 10, minute: 0, title: "Sunday Morning Worship", timezone: "America/New_York", duration: 90 },
    { recurrenceType: "weekly", day: 0, hour: 18, minute: 0, title: "Sunday Evening Youth Service", timezone: "America/New_York", duration: 60 },
    { recurrenceType: "weekly", day: 4, hour: 19, minute: 0, title: "Thursday Prayer Meeting", timezone: "America/New_York", duration: 60 },
  ],
  specialEvents: [],
  bgColor: "#ffffff",
  textColor: "#1a1a1a",
  digitColor: "#1a1a1a",
  separatorColor: "#d4d4d4",
  labelColor: "#737373",
  showBorder: true,
  headerScale: 1,
};

// ─── Icon map ───
export const ICON_OPTIONS: { value: string; label: string; icon: React.ComponentType<any> }[] = [
  { value: "CalendarDays", label: "Calendar", icon: CalendarDays },
  { value: "Church", label: "Church", icon: Church },
  { value: "Clock", label: "Clock", icon: Clock },
  { value: "Heart", label: "Heart", icon: Heart },
  { value: "BookOpen", label: "Book", icon: BookOpen },
  { value: "Bell", label: "Bell", icon: Bell },
  { value: "Flame", label: "Flame", icon: Flame },
  { value: "Cross", label: "Cross", icon: Cross },
  { value: "Star", label: "Star", icon: Star },
];

function getIconComponent(name: string) {
  return ICON_OPTIONS.find((o) => o.value === name)?.icon ?? CalendarDays;
}

// ─── Date helpers ───
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface NextServiceInfo {
  ms: number;
  fullDate: string;
  title: string;
  isLive: boolean;
}

const DEFAULT_DURATION_MS = 60 * 60 * 1000; // 1 hour fallback

/** Build a Date object representing `hour:minute` on a given date, in the specified IANA timezone. */
function dateInTz(baseDate: Date, hour: number, minute: number, tz: string): Date {
  const y = baseDate.getFullYear();
  const m = String(baseDate.getMonth() + 1).padStart(2, "0");
  const d = String(baseDate.getDate()).padStart(2, "0");
  const hh = String(hour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");
  const fakeUtc = new Date(`${y}-${m}-${d}T${hh}:${mm}:00Z`);
  const tzStr = fakeUtc.toLocaleString("en-US", { timeZone: tz });
  const tzDate = new Date(tzStr);
  const offsetMs = fakeUtc.getTime() - tzDate.getTime();
  return new Date(fakeUtc.getTime() + offsetMs);
}

function formatDateStr(target: Date, hour: number, minute: number, format: DateFormatType = "full"): string {
  const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  const dow = dayNames[target.getDay()];
  const mon = monthNames[target.getMonth()];
  const monShort = mon.slice(0, 3);
  const day = target.getDate();
  const year = target.getFullYear();

  switch (format) {
    case "long":
      return `${mon} ${day}, ${year} at ${timeStr}`;
    case "medium":
      return `${monShort} ${day}, ${year} at ${timeStr}`;
    case "short":
      return `${target.getMonth() + 1}/${day}/${year} ${timeStr}`;
    case "day-month":
      return `${dow}, ${mon} ${day} at ${timeStr}`;
    case "relative": {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const targetStart = new Date(target.getFullYear(), target.getMonth(), target.getDate());
      const diffDays = Math.round((targetStart.getTime() - todayStart.getTime()) / 86400000);
      if (diffDays === 0) return `Today at ${timeStr}`;
      if (diffDays === 1) return `Tomorrow at ${timeStr}`;
      if (diffDays < 7 && diffDays > 0) return `${dow} at ${timeStr}`;
      return `${mon} ${day} at ${timeStr}`;
    }
    case "full":
    default:
      return `${dow}, ${mon} ${day}, ${year} at ${timeStr}`;
  }
}

/** Get Nth occurrence of a day-of-week in a given month/year. week=-1 means last. */
function getNthDowInMonth(year: number, month: number, dow: number, week: number): Date | null {
  if (week === -1) {
    // Last occurrence
    const lastDay = new Date(year, month + 1, 0);
    for (let d = lastDay.getDate(); d >= 1; d--) {
      const dt = new Date(year, month, d);
      if (dt.getDay() === dow) return dt;
    }
    return null;
  }
  let count = 0;
  for (let d = 1; d <= 31; d++) {
    const dt = new Date(year, month, d);
    if (dt.getMonth() !== month) break;
    if (dt.getDay() === dow) {
      count++;
      if (count === week) return dt;
    }
  }
  return null;
}

/** Generate upcoming candidate dates for a schedule. Returns up to `count` future dates. */
export function getScheduleCandidates(s: ServiceSchedule, now: Date, count: number = 3): Date[] {
  const tz = s.timezone || DEFAULT_TIMEZONE;
  const candidates: Date[] = [];

  if (s.recurrenceType === "daily") {
    for (let offset = -1; offset < count + 1; offset++) {
      const d = new Date(now);
      d.setDate(d.getDate() + offset);
      d.setHours(0, 0, 0, 0);
      candidates.push(dateInTz(d, s.hour, s.minute, tz));
    }
  } else if (s.recurrenceType === "weekly") {
    for (let weekOffset = -1; weekOffset <= count; weekOffset++) {
      const d = new Date(now);
      const diff = ((s.day - d.getDay() + 7) % 7) + weekOffset * 7;
      d.setDate(d.getDate() + diff);
      d.setHours(0, 0, 0, 0);
      candidates.push(dateInTz(d, s.hour, s.minute, tz));
    }
  } else if (s.recurrenceType === "biweekly") {
    const anchor = s.biweeklyStart ? new Date(s.biweeklyStart) : new Date("2025-01-05"); // default anchor
    for (let weekOffset = -2; weekOffset <= count * 2 + 2; weekOffset++) {
      const d = new Date(now);
      const diff = ((s.day - d.getDay() + 7) % 7) + weekOffset * 7;
      d.setDate(d.getDate() + diff);
      d.setHours(0, 0, 0, 0);
      // Check if this week aligns with the biweekly cycle
      const daysDiff = Math.round((d.getTime() - anchor.getTime()) / (1000 * 60 * 60 * 24));
      const weeksDiff = Math.floor(daysDiff / 7);
      if (weeksDiff % 2 === 0) {
        candidates.push(dateInTz(d, s.hour, s.minute, tz));
      }
    }
  } else if (s.recurrenceType === "monthly-dow") {
    const week = s.monthlyWeek || 1;
    for (let monthOffset = -1; monthOffset <= count; monthOffset++) {
      const y = now.getFullYear();
      const m = now.getMonth() + monthOffset;
      const dt = getNthDowInMonth(y + Math.floor(m / 12), ((m % 12) + 12) % 12, s.day, week);
      if (dt) candidates.push(dateInTz(dt, s.hour, s.minute, tz));
    }
  } else if (s.recurrenceType === "monthly-date") {
    const dayOfMonth = s.monthlyDay || 1;
    for (let monthOffset = -1; monthOffset <= count; monthOffset++) {
      const y = now.getFullYear();
      const m = now.getMonth() + monthOffset;
      const actualYear = y + Math.floor(m / 12);
      const actualMonth = ((m % 12) + 12) % 12;
      const lastDay = new Date(actualYear, actualMonth + 1, 0).getDate();
      const clampedDay = Math.min(dayOfMonth, lastDay);
      const dt = new Date(actualYear, actualMonth, clampedDay);
      candidates.push(dateInTz(dt, s.hour, s.minute, tz));
    }
  }

  return candidates;
}

function getNextService(schedules: ServiceSchedule[], specialEvents: SpecialEvent[], dateFormat: DateFormatType = "full"): NextServiceInfo {
  const now = new Date();
  const nowMs = now.getTime();

  // Check all schedules for live status
  for (const s of schedules) {
    const durationMs = (s.duration || 60) * 60 * 1000;
    const candidates = getScheduleCandidates(s, now, 2);
    for (const target of candidates) {
      const elapsed = nowMs - target.getTime();
      if (elapsed >= 0 && elapsed < durationMs) {
        return { ms: 0, fullDate: formatDateStr(target, s.hour, s.minute, dateFormat), title: s.title, isLive: true };
      }
    }
  }

  // Check special events for live status
  for (const ev of specialEvents) {
    const tz = ev.timezone || DEFAULT_TIMEZONE;
    const [y, m, d] = ev.date.split("-").map(Number);
    const base = new Date(y, m - 1, d);
    const durationMs = (ev.duration || 60) * 60 * 1000;
    const target = dateInTz(base, ev.hour, ev.minute, tz);
    const elapsed = nowMs - target.getTime();
    if (elapsed >= 0 && elapsed < durationMs) {
      return { ms: 0, fullDate: formatDateStr(target, ev.hour, ev.minute, dateFormat), title: ev.title, isLive: true };
    }
  }

  // Find next upcoming
  let nearest = Infinity;
  let nearestDate = "";
  let nearestTitle = "";

  for (const ev of specialEvents) {
    const tz = ev.timezone || DEFAULT_TIMEZONE;
    const [y, m, d] = ev.date.split("-").map(Number);
    const base = new Date(y, m - 1, d);
    const target = dateInTz(base, ev.hour, ev.minute, tz);
    const ms = target.getTime() - nowMs;
    if (ms > 0 && ms < nearest) {
      nearest = ms;
      nearestDate = formatDateStr(target, ev.hour, ev.minute, dateFormat);
      nearestTitle = ev.title;
    }
  }

  for (const s of schedules) {
    const candidates = getScheduleCandidates(s, now, 4);
    for (const target of candidates) {
      const ms = target.getTime() - nowMs;
      if (ms > 0 && ms < nearest) {
        nearest = ms;
        nearestDate = formatDateStr(target, s.hour, s.minute, dateFormat);
        nearestTitle = s.title;
      }
    }
  }

  return { ms: nearest, fullDate: nearestDate, title: nearestTitle, isLive: false };
}

function msToTime(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
  };
}

function useCountdown(config: CountdownConfig) {
  const [state, setState] = useState(() => {
    const n = getNextService(config.schedules, config.specialEvents, config.dateFormat);
    return { ...msToTime(n.ms), fullDate: n.fullDate, title: n.title, isLive: n.isLive };
  });
  useEffect(() => {
    const tick = () => {
      const n = getNextService(config.schedules, config.specialEvents, config.dateFormat);
      setState({ ...msToTime(n.ms), fullDate: n.fullDate, title: n.title, isLive: n.isLive });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [config.schedules, config.specialEvents, config.dateFormat]);
  return state;
}

const pad = (n: number) => String(n).padStart(2, "0");

// ─── Main Widget ───
const ServiceCountdownWidget = ({ config = defaultCountdownConfig }: { config?: CountdownConfig }) => {
  const t = useCountdown(config);
  const Icon = getIconComponent(config.icon);
  const hs = config.headerScale ?? 1;

  const units = [
    { v: t.days, l: config.labelDays || "Days" },
    { v: t.hours, l: config.labelHours || "Hours" },
    { v: t.minutes, l: config.labelMinutes || "Minutes" },
    { v: t.seconds, l: config.labelSeconds || "Seconds" },
  ];

  return (
    <div
      className="w-full rounded-2xl p-8 text-center"
      style={{ backgroundColor: config.bgColor, border: config.showBorder ? '1px solid #e5e7eb' : 'none' }}
    >
      {/* Header */}
      <div className="flex items-center justify-center flex-wrap" style={{ gap: `${Math.round(10 * hs)}px`, marginBottom: '6px' }}>
        <Icon style={{ color: config.iconColor, width: `${Math.round(28 * hs)}px`, height: `${Math.round(28 * hs)}px` }} />
        <span className="font-semibold" style={{ color: config.textColor, fontSize: `${Math.round(18 * hs)}px` }}>
          {t.isLive ? `${config.liveLabel || "Happening Now"}:` : `${config.headerLabel}:`}
        </span>
        <span style={{ color: config.labelColor, fontSize: `${Math.round(18 * hs)}px` }}>
          {t.fullDate}
        </span>
      </div>

      {/* Service title */}
      {t.title && (
        <p className="italic mt-1 mb-8" style={{ color: config.labelColor, fontSize: `${Math.round(18 * hs)}px` }}>
          {t.title}
        </p>
      )}

      {/* Countdown digits */}
      <div className="flex justify-center items-center">
        {units.map((u, i) => (
          <div key={u.l} className="flex items-center">
            <div className="flex flex-col items-center" style={{ width: "clamp(72px, 18vw, 120px)" }}>
              <span
                className="text-5xl md:text-7xl font-black tabular-nums leading-none"
                style={{ color: config.digitColor, fontVariantNumeric: "tabular-nums" }}
              >
                {pad(u.v)}
              </span>
              <span
                className="text-[10px] md:text-xs uppercase tracking-wider mt-2"
                style={{ color: config.labelColor }}
              >
                {u.l}
              </span>
            </div>
            {i < units.length - 1 && (
              <span
                className="text-3xl md:text-5xl font-light -mt-4 flex-shrink-0"
                style={{ color: config.separatorColor, width: "16px", textAlign: "center" }}
              >
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCountdownWidget;
