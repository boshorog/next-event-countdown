/**
 * Loading Bar Counter Style Showcase
 * 7 animated loading-bar-inspired countdown layouts
 * Access via ?showcase=loading-bar
 */

import { useState, useEffect } from 'react';
import { Church } from 'lucide-react';

const useAnimatedSeconds = () => {
  const [s, setS] = useState(52);
  useEffect(() => {
    const t = setInterval(() => setS(prev => (prev <= 0 ? 59 : prev - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  return s;
};

const demo = {
  days: 3, hours: 14, minutes: 27,
  headerLabel: 'Next Event',
  eventTitle: 'Sunday Morning Worship',
  eventDate: 'March 8, 2026 at 10:00 AM',
};

const units = (seconds: number) => [
  { v: demo.days, l: 'Days', max: 30 },
  { v: demo.hours, l: 'Hours', max: 24 },
  { v: demo.minutes, l: 'Minutes', max: 60 },
  { v: seconds, l: 'Seconds', max: 60 },
];

// ─── Option 1: Horizontal Stacked Bars ───
const Option1 = () => {
  const s = useAnimatedSeconds();
  const colors = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd'];
  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Church className="w-4 h-4 text-indigo-500" />
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{demo.headerLabel}</span>
      </div>
      <p className="text-sm font-semibold text-gray-800 mb-5">{demo.eventTitle}</p>
      <div className="space-y-3">
        {units(s).map((u, i) => (
          <div key={u.l} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 font-medium">{u.l}</span>
              <span className="font-bold tabular-nums text-gray-800">{String(u.v).padStart(2, '0')}</span>
            </div>
            <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-linear"
                style={{
                  width: `${(u.v / u.max) * 100}%`,
                  backgroundColor: colors[i],
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 mt-4 text-center">{demo.eventDate}</p>
    </div>
  );
};

// ─── Option 2: Neon Progress Tracks ───
const Option2 = () => {
  const s = useAnimatedSeconds();
  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-gray-950 border border-gray-800">
      <div className="text-center mb-5">
        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-1">{demo.headerLabel}</p>
        <p className="text-sm font-semibold text-white">{demo.eventTitle}</p>
      </div>
      <div className="space-y-4">
        {units(s).map((u, i) => {
          const pct = (u.v / u.max) * 100;
          const hue = 200 + i * 40;
          return (
            <div key={u.l} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">{u.l}</span>
                <span className="font-mono font-bold text-white tabular-nums">{String(u.v).padStart(2, '0')}</span>
              </div>
              <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-linear"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, hsl(${hue}, 80%, 55%), hsl(${hue + 20}, 90%, 65%))`,
                    boxShadow: `0 0 12px hsl(${hue}, 80%, 55%, 0.5)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-gray-600 mt-5 text-center">{demo.eventDate}</p>
    </div>
  );
};

// ─── Option 3: Segmented Loader ───
const Option3 = () => {
  const s = useAnimatedSeconds();
  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
      <div className="text-center mb-5">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{demo.headerLabel}</p>
        <p className="text-sm font-bold text-gray-900">{demo.eventTitle}</p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {units(s).map((u) => {
          const segments = 10;
          const filled = Math.round((u.v / u.max) * segments);
          return (
            <div key={u.l} className="text-center">
              <span className="text-2xl font-black tabular-nums text-gray-800">{String(u.v).padStart(2, '0')}</span>
              <div className="flex gap-0.5 mt-2 mb-1">
                {Array.from({ length: segments }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-1.5 rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: i < filled ? '#6366f1' : '#e5e7eb',
                      opacity: i < filled ? 1 - (i * 0.06) : 1,
                    }}
                  />
                ))}
              </div>
              <span className="text-[9px] text-gray-400 uppercase tracking-wider">{u.l}</span>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-gray-400 mt-4 text-center">{demo.eventDate}</p>
    </div>
  );
};

// ─── Option 4: Circular + Bar Combo ───
const Option4 = () => {
  const s = useAnimatedSeconds();
  const totalSec = demo.days * 86400 + demo.hours * 3600 + demo.minutes * 60 + s;
  const maxSec = 30 * 86400;
  const overallPct = Math.min((totalSec / maxSec) * 100, 100);
  const radius = 44;
  const circ = 2 * Math.PI * radius;
  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-b from-indigo-50 to-white border border-indigo-100/50">
      <div className="flex items-center gap-5">
        {/* Circle */}
        <div className="relative flex-shrink-0">
          <svg width="110" height="110" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <circle
              cx="55" cy="55" r={radius} fill="none"
              stroke="url(#grad4)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ - (overallPct / 100) * circ}
              transform="rotate(-90 55 55)"
              className="transition-all duration-1000 ease-linear"
            />
            <defs><linearGradient id="grad4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#a78bfa" /></linearGradient></defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-black text-gray-800 tabular-nums">{String(demo.days).padStart(2, '0')}</span>
            <span className="text-[8px] text-gray-400 uppercase">Days</span>
          </div>
        </div>
        {/* Bars */}
        <div className="flex-1 space-y-3">
          <div className="mb-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider">{demo.headerLabel}</p>
            <p className="text-sm font-bold text-gray-900">{demo.eventTitle}</p>
          </div>
          {units(s).slice(1).map((u, i) => {
            const colors = ['#6366f1', '#8b5cf6', '#a78bfa'];
            return (
              <div key={u.l} className="space-y-0.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400">{u.l}</span>
                  <span className="font-bold tabular-nums text-gray-700">{String(u.v).padStart(2, '0')}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${(u.v / u.max) * 100}%`, backgroundColor: colors[i] }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-[10px] text-gray-400 mt-4 text-center">{demo.eventDate}</p>
    </div>
  );
};

// ─── Option 5: Full-Width Timeline Bar ───
const Option5 = () => {
  const s = useAnimatedSeconds();
  const totalSec = demo.days * 86400 + demo.hours * 3600 + demo.minutes * 60 + s;
  const maxSec = 30 * 86400;
  const pct = Math.min((totalSec / maxSec) * 100, 100);
  return (
    <div className="w-full max-w-md mx-auto rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      {/* Progress bar as header */}
      <div className="relative h-3 bg-gray-100">
        <div
          className="h-full transition-all duration-1000 ease-linear"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)',
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-indigo-500 shadow transition-all duration-1000 ease-linear"
          style={{ left: `calc(${pct}% - 7px)` }}
        />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">{demo.headerLabel}</p>
            <p className="text-sm font-bold text-gray-900">{demo.eventTitle}</p>
          </div>
          <Church className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {units(s).map((u) => (
            <div key={u.l} className="text-center bg-gray-50 rounded-xl py-2.5 px-1">
              <span className="text-xl font-black tabular-nums text-gray-800">{String(u.v).padStart(2, '0')}</span>
              <p className="text-[8px] text-gray-400 uppercase tracking-wider mt-0.5">{u.l}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-3 text-center">{demo.eventDate}</p>
      </div>
    </div>
  );
};

// ─── Option 6: Vertical Thermometer Bars ───
const Option6 = () => {
  const s = useAnimatedSeconds();
  const colors = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd'];
  return (
    <div className="w-full max-w-sm mx-auto p-6 rounded-2xl bg-gray-950 border border-gray-800">
      <div className="text-center mb-5">
        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">{demo.headerLabel}</p>
        <p className="text-sm font-semibold text-white">{demo.eventTitle}</p>
      </div>
      <div className="flex justify-center gap-5" style={{ height: 140 }}>
        {units(s).map((u, i) => {
          const pct = (u.v / u.max) * 100;
          return (
            <div key={u.l} className="flex flex-col items-center gap-2">
              <span className="text-sm font-bold tabular-nums text-white">{String(u.v).padStart(2, '0')}</span>
              <div className="w-5 flex-1 bg-gray-800 rounded-full overflow-hidden flex flex-col-reverse">
                <div
                  className="w-full rounded-full transition-all duration-1000 ease-linear"
                  style={{
                    height: `${pct}%`,
                    background: `linear-gradient(to top, ${colors[i]}, ${colors[i]}88)`,
                    boxShadow: `0 0 10px ${colors[i]}44`,
                  }}
                />
              </div>
              <span className="text-[8px] text-gray-500 uppercase">{u.l.slice(0, 3)}</span>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-gray-600 mt-4 text-center">{demo.eventDate}</p>
    </div>
  );
};

// ─── Option 7: Gradient Runway with Pulse ───
const Option7 = () => {
  const s = useAnimatedSeconds();
  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
      <div className="flex items-center gap-2 mb-1">
        <Church className="w-4 h-4 text-white/70" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">{demo.headerLabel}</span>
      </div>
      <p className="text-sm font-bold mb-5">{demo.eventTitle}</p>
      <div className="space-y-3">
        {units(s).map((u) => {
          const pct = (u.v / u.max) * 100;
          return (
            <div key={u.l} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-white/60">{u.l}</span>
                <span className="font-mono font-bold tabular-nums">{String(u.v).padStart(2, '0')}</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-linear relative"
                  style={{
                    width: `${pct}%`,
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0.5))',
                  }}
                >
                  <div
                    className="absolute right-0 top-0 w-3 h-full rounded-full bg-white animate-pulse"
                    style={{ boxShadow: '0 0 8px rgba(255,255,255,0.8)' }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-white/40 mt-4 text-center">{demo.eventDate}</p>
    </div>
  );
};

// ─── Showcase Wrapper ───
const options = [
  { title: 'Option 1 — Horizontal Stacked Bars', desc: 'Clean horizontal bars with color-coded units, light theme', Component: Option1 },
  { title: 'Option 2 — Neon Progress Tracks', desc: 'Dark theme with glowing neon bar fills and mono font', Component: Option2 },
  { title: 'Option 3 — Segmented Loader', desc: 'Discrete dot-segments per unit with big digits above', Component: Option3 },
  { title: 'Option 4 — Circular + Bar Combo', desc: 'Days in a ring, hours/min/sec as horizontal bars alongside', Component: Option4 },
  { title: 'Option 5 — Full-Width Timeline Bar', desc: 'Overall progress bar as header with scrubber dot', Component: Option5 },
  { title: 'Option 6 — Vertical Thermometer Bars', desc: 'Tall vertical fill bars on dark background', Component: Option6 },
  { title: 'Option 7 — Gradient Runway with Pulse', desc: 'Vibrant gradient background with pulsing bar tips', Component: Option7 },
];

const LoadingBarStyleShowcase = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-5xl mx-auto space-y-14">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Bar Counter Style</h1>
        <p className="text-gray-500">7 animated loading-bar-inspired countdown layouts. All bars animate live.</p>
      </div>
      {options.map(({ title, desc, Component }, i) => (
        <div key={i} className="space-y-4">
          <div className="border-l-4 border-indigo-500 pl-4">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">{desc}</p>
          </div>
          <div className="flex justify-center py-4">
            <Component />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default LoadingBarStyleShowcase;
