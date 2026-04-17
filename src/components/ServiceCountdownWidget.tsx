import { useState, useEffect } from "react";
import { CalendarDays, Church, Clock, Heart, BookOpen, Bell, Star, Music, Trophy } from "lucide-react";
import { STYLE_RENDERERS } from "./counterStyles/renderers";
import MobileFitWrapper from "./MobileFitWrapper";
import { useIsMobile } from "@/hooks/use-mobile";

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
  // optional end date (ISO yyyy-mm-dd) — schedule stops after this date
  endDate?: string;
}

export interface SpecialEvent {
  date: string; // ISO yyyy-mm-dd
  hour: number;
  minute: number;
  title: string;
  timezone?: string;
  duration?: number; // duration in minutes
  imported?: boolean; // true = from ICS feed
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
  | "us-long"        // March 6, 2026 at 7:00 PM
  | "us-short"       // Fri, 6 Mar 2026, 7 PM
  | "iso-like"       // 2026-03-06 19:00
  | "europe-long"    // Friday, 6 March 2026 at 19:00
  | "europe-short"   // Fri, 6 Mar 2026, 19:00
  | "social";        // Fri, Mar 6 @ 19:00

export const DATE_FORMAT_OPTIONS: { value: DateFormatType; label: string; example: string }[] = [
  { value: "us-long", label: "US Long", example: "March 6, 2026 at 7:00 PM" },
  { value: "us-short", label: "US Short", example: "Fri, 6 Mar 2026, 7 PM" },
  { value: "iso-like", label: "ISO-like", example: "2026-03-06 19:00" },
  { value: "europe-long", label: "Europe Long", example: "Friday, 6 March 2026 at 19:00" },
  { value: "europe-short", label: "Europe Short", example: "Fri, 6 Mar 2026, 19:00" },
  { value: "social", label: "Social", example: "Fri, Mar 6 @ 19:00" },
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
  titleColor?: string;
  dateColor?: string;
  cardBgColor?: string;
  showBorder: boolean;
  headerScale: number;
  headerDigitBalance?: number; // 0-100, 50=equal, <50=header bigger, >50=digits bigger
  counterStyle?: string;
  use24h?: boolean;
  showTitle?: boolean;
  showDate?: boolean;
  borderRadius?: number;
  fullWidth?: boolean;
  defaultTimezone?: string;
  language?: string;
  dayNames?: string[];
  monthNames?: string[];
  atWord?: string;
  showLiveDuration?: boolean;
  // Granular sizing
  headerFontSize?: number;   // px
  digitFontSize?: number;    // px
  labelFontSize?: number;    // px
  separatorFontSize?: number; // px
  counterWidth?: number;     // px
  counterHeight?: number;    // px
  lockAspectRatio?: boolean;
  offsetX?: number;          // px
  offsetY?: number;          // px
  overallScale?: number;     // multiplier
  showHeader?: boolean;
  elementOffsets?: Record<string, { x: number; y: number }>;
  // ICS Calendar Feed (Pro)
  icsFeedUrl?: string;
  icsRefreshMinutes?: number;  // auto-refresh interval
  icsLastSync?: string;        // ISO timestamp
  icsImportedEvents?: SpecialEvent[]; // cached imported events
}

export const defaultCountdownConfig: CountdownConfig = {
  icon: "CalendarDays",
  iconColor: "#e79e27",
  headerLabel: "Next Event",
  liveLabel: "Happening Now",
  dateFormat: "us-long",
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
  bgColor: "transparent",
  textColor: "#1a1a1a",
  digitColor: "#1a1a1a",
  separatorColor: "#d4d4d4",
  labelColor: "#737373",
  showBorder: false,
  headerScale: 1,
};

// ─── Icon map ───
export const ICON_OPTIONS: { value: string; label: string; icon: React.ComponentType<any> }[] = [
  { value: "CalendarDays", label: "Calendar", icon: CalendarDays },
  { value: "Clock", label: "Clock", icon: Clock },
  { value: "Heart", label: "Heart", icon: Heart },
  { value: "Bell", label: "Bell", icon: Bell },
  { value: "BookOpen", label: "Book", icon: BookOpen },
  { value: "Star", label: "Star", icon: Star },
  { value: "Church", label: "Church", icon: Church },
  { value: "Music", label: "Music", icon: Music },
  { value: "Trophy", label: "Trophy", icon: Trophy },
];

export function getIconComponent(name: string) {
  return ICON_OPTIONS.find((o) => o.value === name)?.icon ?? CalendarDays;
}

// ─── Date helpers ───
const defaultDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const defaultMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface NextServiceInfo {
  ms: number;
  fullDate: string;
  title: string;
  isLive: boolean;
  totalSpanMs?: number; // total ms from previous event end to next event start
}

const DEFAULT_DURATION_MS = 60 * 60 * 1000; // 1 hour fallback

/** Build a Date object representing `hour:minute` on a given date, in the specified IANA timezone. */
function dateInTz(baseDate: Date, hour: number, minute: number, tz: string): Date {
  const y = baseDate.getFullYear();
  const m = baseDate.getMonth();
  const d = baseDate.getDate();

  // Iterative approach: start with a UTC guess, then adjust based on
  // what the target timezone actually shows at that instant.
  let guess = new Date(Date.UTC(y, m, d, hour, minute, 0));
  for (let i = 0; i < 2; i++) {
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false,
    });
    const parts = fmt.formatToParts(guess);
    const g = (t: string) => parseInt(parts.find(p => p.type === t)?.value || '0');
    const tzH = g('hour') === 24 ? 0 : g('hour');
    const shownUtc = Date.UTC(g('year'), g('month') - 1, g('day'), tzH, g('minute'), g('second'));
    const wantUtc = Date.UTC(y, m, d, hour, minute, 0);
    guess = new Date(guess.getTime() + (wantUtc - shownUtc));
  }
  return guess;
}

interface FormatOptions {
  dayNamesList?: string[];
  monthNamesList?: string[];
  atWordStr?: string;
}

function formatDateStr(target: Date, hour: number, minute: number, format: DateFormatType = "us-long", use24h?: boolean, opts?: FormatOptions): string {
  const dn = opts?.dayNamesList || defaultDayNames;
  const mn = opts?.monthNamesList || defaultMonthNames;
  const at = opts?.atWordStr ?? "at";
  const h24 = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  const dow = dn[target.getDay()] || defaultDayNames[target.getDay()];
  const dowShort = dow.slice(0, 3);
  const mon = mn[target.getMonth()] || defaultMonthNames[target.getMonth()];
  const monShort = mon.slice(0, 3);
  const day = target.getDate();
  const year = target.getFullYear();
  const h12 = hour % 12 || 12;
  const ampm = hour >= 12 ? "PM" : "AM";
  const time12 = minute === 0 ? `${h12} ${ampm}` : `${h12}:${String(minute).padStart(2, "0")} ${ampm}`;

  const force24 = use24h === true;
  const force12 = use24h === false;
  const timeStr = (defaultIs24: boolean) => {
    if (force24) return h24;
    if (force12) return time12;
    return defaultIs24 ? h24 : time12;
  };

  const atSep = at ? ` ${at} ` : " ";

  switch (format) {
    case "us-short":
      return `${dowShort}, ${day} ${monShort} ${year}, ${timeStr(false)}`;
    case "iso-like":
      return `${year}-${String(target.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")} ${timeStr(true)}`;
    case "europe-long":
      return `${dow}, ${day} ${mon} ${year}${atSep}${timeStr(true)}`;
    case "europe-short":
      return `${dowShort}, ${day} ${monShort} ${year}, ${timeStr(true)}`;
    case "social":
      return `${dowShort}, ${monShort} ${day} @ ${timeStr(true)}`;
    case "us-long":
    default:
      return `${mon} ${day}, ${year}${atSep}${timeStr(false)}`;
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

  // Filter out candidates past the end date
  if (s.endDate) {
    const [ey, em, ed] = s.endDate.split("-").map(Number);
    const endLimit = new Date(ey, em - 1, ed, 23, 59, 59);
    return candidates.filter(c => c <= endLimit);
  }

  return candidates;
}

function getNextService(schedules: ServiceSchedule[], specialEvents: SpecialEvent[], dateFormat: DateFormatType = "us-long", use24h?: boolean, fmtOpts?: FormatOptions): NextServiceInfo {
  const now = new Date();
  const nowMs = now.getTime();

  // Check special events for live status FIRST (they always take priority)
  for (const ev of specialEvents) {
    const tz = ev.timezone || DEFAULT_TIMEZONE;
    const [y, m, d] = ev.date.split("-").map(Number);
    const base = new Date(y, m - 1, d);
    const durationMs = (ev.duration || 60) * 60 * 1000;
    const target = dateInTz(base, ev.hour, ev.minute, tz);
    const elapsed = nowMs - target.getTime();
    if (elapsed >= 0 && elapsed < durationMs) {
      const remaining = durationMs - elapsed;
      return { ms: remaining, fullDate: formatDateStr(target, ev.hour, ev.minute, dateFormat, use24h, fmtOpts), title: ev.title, isLive: true };
    }
  }

  // Check recurring schedules for live status
  for (const s of schedules) {
    const durationMs = (s.duration || 60) * 60 * 1000;
    const candidates = getScheduleCandidates(s, now, 2);
    for (const target of candidates) {
      const elapsed = nowMs - target.getTime();
      if (elapsed >= 0 && elapsed < durationMs) {
        const remaining = durationMs - elapsed;
        return { ms: remaining, fullDate: formatDateStr(target, s.hour, s.minute, dateFormat, use24h, fmtOpts), title: s.title, isLive: true };
      }
    }
  }

  // Collect all past event end times and future event start times
  const allPastEnds: number[] = [];
  const allFutureStarts: { ms: number; date: string; title: string }[] = [];

  for (const ev of specialEvents) {
    const tz = ev.timezone || DEFAULT_TIMEZONE;
    const [y, m, d] = ev.date.split("-").map(Number);
    const base = new Date(y, m - 1, d);
    const target = dateInTz(base, ev.hour, ev.minute, tz);
    const startMs = target.getTime();
    const durationMs = (ev.duration || 60) * 60 * 1000;
    const endMs = startMs + durationMs;
    if (startMs > nowMs) {
      allFutureStarts.push({ ms: startMs - nowMs, date: formatDateStr(target, ev.hour, ev.minute, dateFormat, use24h, fmtOpts), title: ev.title });
    }
    if (endMs <= nowMs) {
      allPastEnds.push(endMs);
    }
  }

  for (const s of schedules) {
    const candidates = getScheduleCandidates(s, now, 4);
    const durationMs = (s.duration || 60) * 60 * 1000;
    for (const target of candidates) {
      const startMs = target.getTime();
      const endMs = startMs + durationMs;
      if (startMs > nowMs) {
        // Check overlap with special events
        let overlapsSpecial = false;
        for (const ev of specialEvents) {
          const tz = ev.timezone || DEFAULT_TIMEZONE;
          const [ey, em, ed] = ev.date.split("-").map(Number);
          const eBase = new Date(ey, em - 1, ed);
          const eTarget = dateInTz(eBase, ev.hour, ev.minute, tz);
          const eDurationMs = (ev.duration || 60) * 60 * 1000;
          const eStart = eTarget.getTime();
          const eEnd = eStart + eDurationMs;
          if (eStart < endMs && eEnd > startMs) {
            overlapsSpecial = true;
            break;
          }
        }
        if (!overlapsSpecial) {
          allFutureStarts.push({ ms: startMs - nowMs, date: formatDateStr(target, s.hour, s.minute, dateFormat, use24h, fmtOpts), title: s.title });
        }
      }
      if (endMs <= nowMs) {
        allPastEnds.push(endMs);
      }
    }
  }

  // Find nearest future event
  allFutureStarts.sort((a, b) => a.ms - b.ms);
  const next = allFutureStarts[0];
  if (!next) {
    return { ms: Infinity, fullDate: "", title: "", isLive: false };
  }

  // Find most recent past event end
  const prevEndMs = allPastEnds.length > 0 ? Math.max(...allPastEnds) : undefined;
  const nextStartMs = nowMs + next.ms;
  const totalSpanMs = prevEndMs !== undefined ? nextStartMs - prevEndMs : undefined;

  return { ms: next.ms, fullDate: next.date, title: next.title, isLive: false, totalSpanMs };
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

export function useCountdown(config: CountdownConfig) {
  const fmtOpts: FormatOptions = {
    dayNamesList: config.dayNames,
    monthNamesList: config.monthNames,
    atWordStr: config.atWord,
  };
  const showLiveDuration = config.showLiveDuration ?? false;

  // Merge local special events with ICS imported events
  const mergedSpecialEvents = [
    ...config.specialEvents,
    ...(config.icsImportedEvents || []),
  ];

  const [state, setState] = useState(() => {
    const n = getNextService(config.schedules, mergedSpecialEvents, config.dateFormat, config.use24h, fmtOpts);
    const ms = n.isLive && !showLiveDuration ? 0 : n.ms;
    const progressPercent = n.totalSpanMs && n.totalSpanMs > 0 ? Math.min(100, Math.max(0, ((n.totalSpanMs - n.ms) / n.totalSpanMs) * 100)) : undefined;
    return { ...msToTime(ms), fullDate: n.fullDate, title: n.title, isLive: n.isLive, progressPercent };
  });
  useEffect(() => {
    const tick = () => {
      const n = getNextService(config.schedules, mergedSpecialEvents, config.dateFormat, config.use24h, fmtOpts);
      const ms = n.isLive && !showLiveDuration ? 0 : n.ms;
      const progressPercent = n.totalSpanMs && n.totalSpanMs > 0 ? Math.min(100, Math.max(0, ((n.totalSpanMs - n.ms) / n.totalSpanMs) * 100)) : undefined;
      setState({ ...msToTime(ms), fullDate: n.fullDate, title: n.title, isLive: n.isLive, progressPercent });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [config.schedules, config.specialEvents, config.icsImportedEvents, config.dateFormat, config.use24h, config.dayNames, config.monthNames, config.atWord, showLiveDuration]);
  return state;
}

const pad = (n: number) => String(n).padStart(2, "0");

// ─── Main Widget ───
const ServiceCountdownWidget = ({ config = defaultCountdownConfig }: { config?: CountdownConfig }) => {
  const t = useCountdown(config);
  const Icon = getIconComponent(config.icon);
  const hs = config.headerScale ?? 1;
  const styleId = config.counterStyle || 'default';
  const isMobile = useIsMobile();

  const units = [
    { v: t.days, l: config.labelDays || "Days" },
    { v: t.hours, l: config.labelHours || "Hours" },
    { v: t.minutes, l: config.labelMinutes || "Minutes" },
    { v: t.seconds, l: config.labelSeconds || "Seconds" },
  ];

  // Use Pro style renderer if available and not default
  const StyledRenderer = styleId !== 'default' ? STYLE_RENDERERS[styleId] : null;

  // Sizing CSS variables
  const sizingStyle: React.CSSProperties & Record<string, string> = {};
  if (config.headerFontSize) sizingStyle['--header-font-size'] = `${config.headerFontSize}px`;
  if (config.digitFontSize) sizingStyle['--digit-font-size'] = `${config.digitFontSize}px`;
  if (config.labelFontSize) sizingStyle['--label-font-size'] = `${config.labelFontSize}px`;
  if (config.separatorFontSize) sizingStyle['--separator-font-size'] = `${config.separatorFontSize}px`;
  // On mobile: cap width to viewport (no fixed width). On desktop: respect counterWidth.
  if (config.counterWidth && !isMobile) sizingStyle.width = `${config.counterWidth}px`;
  if (config.counterHeight && !isMobile) {
    sizingStyle.height = `${config.counterHeight}px`;
    sizingStyle.display = 'flex';
    sizingStyle.alignItems = 'center';
    sizingStyle.justifyContent = 'center';
  }
  // Build combined transform from offset and scale.
  // Position offsets (offsetX/offsetY and per-element offsets) only apply on desktop.
  const transforms: string[] = [];
  if (!isMobile && (config.offsetX || config.offsetY)) {
    transforms.push(`translate(${config.offsetX || 0}px, ${config.offsetY || 0}px)`);
  }
  if (config.overallScale && config.overallScale !== 1) {
    transforms.push(`scale(${config.overallScale})`);
  }
  if (transforms.length > 0) {
    sizingStyle.transform = transforms.join(' ');
    sizingStyle.transformOrigin = 'center center';
  }
  // Element offsets as CSS variables (desktop only)
  if (!isMobile) {
    const eo = config.elementOffsets || {};
    for (const [key, val] of Object.entries(eo)) {
      if (val?.x) sizingStyle[`--el-${key}-x`] = `${val.x}px`;
      if (val?.y) sizingStyle[`--el-${key}-y`] = `${val.y}px`;
    }
  }

  if (StyledRenderer) {
    return (
      <MobileFitWrapper>
        <div style={sizingStyle}>
          <StyledRenderer
            days={t.days}
            hours={t.hours}
            minutes={t.minutes}
            seconds={t.seconds}
            headerLabel={t.isLive ? (config.liveLabel || "Happening Now") : config.headerLabel}
            eventTitle={t.title}
            eventDate={t.fullDate}
            iconColor={config.iconColor}
            icon={Icon}
            labelDays={config.labelDays || "Days"}
            labelHours={config.labelHours || "Hours"}
            labelMinutes={config.labelMinutes || "Minutes"}
            labelSeconds={config.labelSeconds || "Seconds"}
            showHeader={config.showHeader !== false}
            showTitle={config.showTitle !== false}
            showDate={config.showDate !== false}
            progressPercent={t.progressPercent}
          />
        </div>
      </MobileFitWrapper>
    );
  }

  const radius = config.borderRadius ?? 16;

  return (
    <MobileFitWrapper>
      <div style={{ overflow: 'hidden', maxWidth: '100%', boxSizing: 'border-box' as const, ...sizingStyle, width: sizingStyle.width || '100%' }}>
      <div
        className={`${config.fullWidth !== false ? 'w-full' : 'inline-block'} text-center`}
        style={{
          backgroundColor: config.bgColor,
          border: config.showBorder ? '1px solid #e5e7eb' : 'none',
          borderRadius: `${radius}px`,
          transform: hs !== 1 ? `scale(${hs})` : undefined,
          transformOrigin: 'top center',
          padding: 'clamp(16px, 4vw, 32px)',
          boxSizing: 'border-box' as const,
          maxWidth: '100%',
        }}
      >
        {/* Header */}
        {(() => {
          const bal = config.headerDigitBalance ?? 50;
          const headerFactor = 1 + (50 - bal) * 0.012;
          const digitFactor = 1 + (bal - 50) * 0.012;
          const elOffLocal = (el: string): React.CSSProperties => {
            const e = config.elementOffsets?.[el];
            return e ? { transform: `translate(${e.x}px, ${e.y}px)` } : {};
          };
          return (
            <>
              {config.showHeader !== false && (
                <div className="flex items-center justify-center flex-wrap" style={{ gap: '10px', marginBottom: '6px', transform: headerFactor !== 1 ? `scale(${headerFactor})` : undefined, transformOrigin: 'center center', ...elOffLocal('header') }}>
                  <Icon style={{ color: config.iconColor, width: '28px', height: '28px' }} />
                  <span className="font-semibold" style={{ color: config.textColor, fontSize: config.headerFontSize ? `${config.headerFontSize}px` : '18px' }}>
                    {t.isLive ? `${config.liveLabel || "Happening Now"}:` : `${config.headerLabel}:`}
                  </span>
                  {config.showDate !== false && (
                    <span style={{ color: config.labelColor, fontSize: config.headerFontSize ? `${config.headerFontSize}px` : '18px' }}>
                      {t.fullDate}
                    </span>
                  )}
                </div>
              )}

              {config.showTitle !== false && t.title && (
                <p className="italic mt-1 mb-8" style={{ color: config.labelColor, fontSize: config.headerFontSize ? `${config.headerFontSize}px` : '18px', transform: headerFactor !== 1 ? `scale(${headerFactor})` : undefined, transformOrigin: 'center center', ...elOffLocal('title') }}>
                  {t.title}
                </p>
              )}

              {/* Countdown digits */}
              <div className="flex justify-center items-center" style={{ maxWidth: '100%', overflow: 'visible', width: '100%', transform: digitFactor !== 1 ? `scale(${digitFactor})` : undefined, transformOrigin: 'center center', ...elOffLocal('digits') }}>
                {units.map((u, i) => (
                  <div key={u.l} className="flex items-center" style={{ minWidth: 0 }}>
                    <div className="flex flex-col items-center" style={{ width: "clamp(48px, 16vw, 120px)", minWidth: 0 }}>
                      <span
                        className="tabular-nums leading-none"
                        style={{ color: config.digitColor, fontVariantNumeric: "tabular-nums", fontWeight: 900, fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: config.digitFontSize ? `${config.digitFontSize}px` : 'clamp(2.5rem, 10vw, 4.5rem)' }}
                      >
                        {pad(u.v)}
                      </span>
                      <span
                        className="uppercase tracking-wider"
                        style={{ color: config.labelColor, marginTop: '8px', fontSize: config.labelFontSize ? `${config.labelFontSize}px` : 'clamp(8px, 2vw, 12px)' }}
                      >
                        {u.l}
                      </span>
                    </div>
                    {i < units.length - 1 && (
                      <span
                        className="font-light flex-shrink-0"
                        style={{ color: config.separatorColor, width: "clamp(10px, 3vw, 16px)", textAlign: "center", marginTop: '-16px', fontSize: config.separatorFontSize ? `${config.separatorFontSize}px` : 'clamp(1.5rem, 6vw, 3rem)' }}
                      >
                        :
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </>
          );
        })()}

      </div>
    </div>
    </MobileFitWrapper>
  );
};

export default ServiceCountdownWidget;
