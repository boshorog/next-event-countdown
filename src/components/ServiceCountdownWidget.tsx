import { useState, useEffect } from "react";
import { CalendarDays, Church, Clock, Heart, BookOpen, Bell, Flame, Cross, Star } from "lucide-react";

// ─── Config ───
export interface ServiceSchedule {
  day: number; // 0=Sun … 6=Sat
  hour: number;
  minute: number;
  title: string;
  timezone?: string; // IANA timezone, default Europe/Bucharest
}

export interface SpecialEvent {
  date: string; // ISO yyyy-mm-dd
  hour: number;
  minute: number;
  title: string;
  timezone?: string; // IANA timezone, default Europe/Bucharest
}

export const TIMEZONE_OPTIONS = [
  { value: "Pacific/Honolulu", label: "Hawaii (UTC-10)", offset: -10 },
  { value: "America/Anchorage", label: "Alaska (UTC-9)", offset: -9 },
  { value: "America/Los_Angeles", label: "Los Angeles (UTC-8)", offset: -8 },
  { value: "America/Denver", label: "Denver (UTC-7)", offset: -7 },
  { value: "America/Chicago", label: "Chicago (UTC-6)", offset: -6 },
  { value: "America/New_York", label: "New York (UTC-5)", offset: -5 },
  { value: "America/Sao_Paulo", label: "São Paulo (UTC-3)", offset: -3 },
  { value: "Atlantic/Azores", label: "Azore (UTC-1)", offset: -1 },
  { value: "UTC", label: "UTC (UTC+0)", offset: 0 },
  { value: "Europe/London", label: "Londra (UTC+0/+1)", offset: 0 },
  { value: "Europe/Paris", label: "Paris (UTC+1)", offset: 1 },
  { value: "Europe/Bucharest", label: "București (UTC+2)", offset: 2 },
  { value: "Europe/Moscow", label: "Moscova (UTC+3)", offset: 3 },
  { value: "Asia/Dubai", label: "Dubai (UTC+4)", offset: 4 },
  { value: "Asia/Kolkata", label: "India (UTC+5:30)", offset: 5.5 },
  { value: "Asia/Shanghai", label: "Shanghai (UTC+8)", offset: 8 },
  { value: "Asia/Tokyo", label: "Tokyo (UTC+9)", offset: 9 },
  { value: "Australia/Sydney", label: "Sydney (UTC+10/+11)", offset: 10 },
  { value: "Pacific/Auckland", label: "Auckland (UTC+12)", offset: 12 },
];

const DEFAULT_TIMEZONE = "Europe/Bucharest";

export interface CountdownConfig {
  icon: string;
  iconColor: string;
  headerLabel: string;
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
  icon: "CalendarDays",
  iconColor: "#6366f1",
  headerLabel: "Următorul serviciu",
  schedules: [
    { day: 0, hour: 10, minute: 0, title: "Slujba de duminică dimineața cu Masa Domnului", timezone: "Europe/Bucharest" },
    { day: 0, hour: 18, minute: 0, title: "Slujba de duminică seara", timezone: "Europe/Bucharest" },
    { day: 4, hour: 18, minute: 0, title: "Slujba de joi seara", timezone: "Europe/Bucharest" },
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
  { value: "Church", label: "Biserică", icon: Church },
  { value: "Clock", label: "Ceas", icon: Clock },
  { value: "Heart", label: "Inimă", icon: Heart },
  { value: "BookOpen", label: "Carte", icon: BookOpen },
  { value: "Bell", label: "Clopot", icon: Bell },
  { value: "Flame", label: "Flacără", icon: Flame },
  { value: "Cross", label: "Cruce", icon: Cross },
  { value: "Star", label: "Stea", icon: Star },
];

function getIconComponent(name: string) {
  return ICON_OPTIONS.find((o) => o.value === name)?.icon ?? CalendarDays;
}

// ─── Date helpers ───
const dayNames = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];
const monthNames = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];

interface NextServiceInfo {
  ms: number;
  fullDate: string;
  title: string;
  isLive: boolean;
}

const LIVE_DURATION_MS = 3 * 60 * 60 * 1000; // 3 hours

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

function getNextService(schedules: ServiceSchedule[], specialEvents: SpecialEvent[]): NextServiceInfo {
  const now = new Date();
  const nowMs = now.getTime();

  // Check recurring schedules for live status
  for (const s of schedules) {
    const tz = s.timezone || DEFAULT_TIMEZONE;
    const candidate = new Date(now);
    const dayDiff = ((s.day - candidate.getDay() + 7) % 7);
    candidate.setDate(candidate.getDate() + dayDiff);
    candidate.setHours(0, 0, 0, 0);
    let target = dateInTz(candidate, s.hour, s.minute, tz);
    if (target > now) {
      candidate.setDate(candidate.getDate() - 7);
      target = dateInTz(candidate, s.hour, s.minute, tz);
    }
    const elapsed = nowMs - target.getTime();
    if (elapsed >= 0 && elapsed < LIVE_DURATION_MS) {
      const dateStr = `${dayNames[target.getDay()]}, ${target.getDate()} ${monthNames[target.getMonth()]} ${target.getFullYear()}, Ora ${String(s.hour).padStart(2, "0")}:${String(s.minute).padStart(2, "0")}`;
      return { ms: 0, fullDate: dateStr, title: s.title, isLive: true };
    }
  }

  // Check special events for live status
  for (const ev of specialEvents) {
    const tz = ev.timezone || DEFAULT_TIMEZONE;
    const [y, m, d] = ev.date.split("-").map(Number);
    const base = new Date(y, m - 1, d);
    const target = dateInTz(base, ev.hour, ev.minute, tz);
    const elapsed = nowMs - target.getTime();
    if (elapsed >= 0 && elapsed < LIVE_DURATION_MS) {
      const dateStr = `${dayNames[target.getDay()]}, ${target.getDate()} ${monthNames[target.getMonth()]} ${target.getFullYear()}, Ora ${String(ev.hour).padStart(2, "0")}:${String(ev.minute).padStart(2, "0")}`;
      return { ms: 0, fullDate: dateStr, title: ev.title, isLive: true };
    }
  }

  // No live service — find next upcoming
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
      nearestDate = `${dayNames[target.getDay()]}, ${target.getDate()} ${monthNames[target.getMonth()]} ${target.getFullYear()}, Ora ${String(ev.hour).padStart(2, "0")}:${String(ev.minute).padStart(2, "0")}`;
      nearestTitle = ev.title;
    }
  }

  for (const s of schedules) {
    const tz = s.timezone || DEFAULT_TIMEZONE;
    const candidate = new Date(now);
    const diff = ((s.day - candidate.getDay() + 7) % 7);
    candidate.setDate(candidate.getDate() + diff);
    candidate.setHours(0, 0, 0, 0);
    let target = dateInTz(candidate, s.hour, s.minute, tz);
    if (target.getTime() <= nowMs) {
      candidate.setDate(candidate.getDate() + 7);
      target = dateInTz(candidate, s.hour, s.minute, tz);
    }
    const ms = target.getTime() - nowMs;
    if (ms > 0 && ms < nearest) {
      nearest = ms;
      nearestDate = `${dayNames[target.getDay()]}, ${target.getDate()} ${monthNames[target.getMonth()]} ${target.getFullYear()}, Ora ${String(s.hour).padStart(2, "0")}:${String(s.minute).padStart(2, "0")}`;
      nearestTitle = s.title;
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
    const n = getNextService(config.schedules, config.specialEvents);
    return { ...msToTime(n.ms), fullDate: n.fullDate, title: n.title, isLive: n.isLive };
  });
  useEffect(() => {
    const tick = () => {
      const n = getNextService(config.schedules, config.specialEvents);
      setState({ ...msToTime(n.ms), fullDate: n.fullDate, title: n.title, isLive: n.isLive });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [config.schedules, config.specialEvents]);
  return state;
}

const pad = (n: number) => String(n).padStart(2, "0");

// ─── Main Widget (Design 3 – Separator Style, fixed width) ───
const ServiceCountdownWidget = ({ config = defaultCountdownConfig }: { config?: CountdownConfig }) => {
  const t = useCountdown(config);
  const Icon = getIconComponent(config.icon);
  const hs = config.headerScale ?? 1;

  const units = [
    { v: t.days, l: "Zile" },
    { v: t.hours, l: "Ore" },
    { v: t.minutes, l: "Minute" },
    { v: t.seconds, l: "Secunde" },
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
          {t.isLive ? "Acum:" : `${config.headerLabel}:`}
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

      {/* Countdown digits – fixed width to prevent shifting */}
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