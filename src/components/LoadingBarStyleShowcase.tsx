/**
 * Loading Bar Counter Style Showcase v2
 * 10 unique animated loading-bar countdown layouts
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
  { v: demo.minutes, l: 'Min', max: 60 },
  { v: seconds, l: 'Sec', max: 60 },
];

// ─── 1: Giant Single Bar with Embedded Digits ───
const Style1 = () => {
  const s = useAnimatedSeconds();
  const total = demo.days * 86400 + demo.hours * 3600 + demo.minutes * 60 + s;
  const pct = Math.min((total / (30 * 86400)) * 100, 100);
  return (
    <div className="w-full max-w-lg mx-auto p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Church className="w-4 h-4 text-indigo-500" />
        <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">{demo.headerLabel}</span>
      </div>
      <p className="text-sm font-bold text-gray-900 mb-4">{demo.eventTitle}</p>
      <div className="relative h-16 bg-gray-100 rounded-2xl overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-2xl transition-all duration-1000 ease-linear"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)' }}
        />
        <div className="absolute inset-0 flex items-center justify-around px-4">
          {units(s).map(u => (
            <div key={u.l} className="text-center z-10">
              <span className="text-2xl font-black tabular-nums text-white drop-shadow-md">{String(u.v).padStart(2, '0')}</span>
              <p className="text-[8px] uppercase tracking-wider text-white/80 font-medium">{u.l}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[10px] text-gray-400 mt-3 text-center">{demo.eventDate}</p>
    </div>
  );
};

// ─── 2: Mega Bar with Inline Time Chips ───
const Style2 = () => {
  const s = useAnimatedSeconds();
  const total = demo.days * 86400 + demo.hours * 3600 + demo.minutes * 60 + s;
  const pct = Math.min((total / (30 * 86400)) * 100, 100);
  return (
    <div className="w-full max-w-lg mx-auto p-6 rounded-2xl bg-gray-950 border border-gray-800">
      <div className="text-center mb-4">
        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">{demo.headerLabel}</p>
        <p className="text-sm font-semibold text-white">{demo.eventTitle}</p>
      </div>
      <div className="relative h-14 bg-gray-800 rounded-xl overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-xl transition-all duration-1000 ease-linear"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #10b981, #34d399, #6ee7b7)' }}
        />
        <div className="absolute inset-0 flex items-center justify-center gap-3 z-10">
          {units(s).map((u, i) => (
            <span key={u.l} className="flex items-center gap-1">
              <span className="text-xl font-black tabular-nums text-white">{String(u.v).padStart(2, '0')}</span>
              <span className="text-[9px] text-white/60 uppercase font-medium">{u.l}</span>
              {i < 3 && <span className="text-white/30 mx-1">:</span>}
            </span>
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-2 px-1">
        <span className="text-[9px] text-gray-600">{Math.round(pct)}% remaining</span>
        <span className="text-[9px] text-gray-600">{demo.eventDate}</span>
      </div>
    </div>
  );
};

// ─── 3: Stepped Progress Blocks ───
const Style3 = () => {
  const s = useAnimatedSeconds();
  const colors = ['#f59e0b', '#f97316', '#ef4444', '#ec4899'];
  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">{demo.headerLabel}</p>
          <p className="text-sm font-bold text-gray-900">{demo.eventTitle}</p>
        </div>
        <Church className="w-4 h-4 text-orange-400" />
      </div>
      <div className="flex gap-2">
        {units(s).map((u, i) => {
          const pct = (u.v / u.max) * 100;
          return (
            <div key={u.l} className="flex-1">
              <div className="relative h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                <div
                  className="absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-linear rounded-b-xl"
                  style={{ height: `${pct}%`, backgroundColor: colors[i], opacity: 0.85 }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                  <span className="text-2xl font-black tabular-nums text-gray-800">{String(u.v).padStart(2, '0')}</span>
                  <span className="text-[8px] text-gray-500 uppercase tracking-wider font-semibold">{u.l}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-gray-400 mt-3 text-center">{demo.eventDate}</p>
    </div>
  );
};

// ─── 4: Liquid Fill Cards ───
const Style4 = () => {
  const s = useAnimatedSeconds();
  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
      <div className="text-center mb-4">
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">{demo.headerLabel}</p>
        <p className="text-sm font-semibold text-white">{demo.eventTitle}</p>
      </div>
      <div className="flex gap-3">
        {units(s).map((u) => {
          const pct = (u.v / u.max) * 100;
          return (
            <div key={u.l} className="flex-1">
              <div className="relative h-20 bg-slate-700/50 rounded-xl overflow-hidden">
                <div
                  className="absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-linear"
                  style={{
                    height: `${pct}%`,
                    background: 'linear-gradient(to top, #3b82f6, #60a5fa)',
                    borderRadius: '0 0 12px 12px',
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-2 rounded-full"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)',
                    }}
                  />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                  <span className="text-xl font-black tabular-nums text-white drop-shadow">{String(u.v).padStart(2, '0')}</span>
                  <span className="text-[7px] text-white/60 uppercase tracking-wider">{u.l}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-slate-500 mt-3 text-center">{demo.eventDate}</p>
    </div>
  );
};

// ─── 5: Diagonal Stripe Bar ───
const Style5 = () => {
  const s = useAnimatedSeconds();
  const total = demo.days * 86400 + demo.hours * 3600 + demo.minutes * 60 + s;
  const pct = Math.min((total / (30 * 86400)) * 100, 100);
  return (
    <div className="w-full max-w-lg mx-auto p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Church className="w-4 h-4 text-violet-500" />
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">{demo.headerLabel}</p>
          <p className="text-sm font-bold text-gray-900">{demo.eventTitle}</p>
        </div>
      </div>
      <div className="relative h-12 bg-gray-100 rounded-xl overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-xl transition-all duration-1000 ease-linear"
          style={{
            width: `${pct}%`,
            background: `repeating-linear-gradient(
              -45deg,
              #7c3aed,
              #7c3aed 10px,
              #8b5cf6 10px,
              #8b5cf6 20px
            )`,
            backgroundSize: '28px 28px',
            animation: 'stripe-move 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes stripe-move { 0% { background-position: 0 0; } 100% { background-position: 28px 0; } }`}</style>
        <div className="absolute inset-0 flex items-center justify-center gap-4 z-10">
          {units(s).map((u, i) => (
            <span key={u.l} className="flex items-baseline gap-0.5">
              <span className="text-lg font-black tabular-nums text-white drop-shadow-md">{String(u.v).padStart(2, '0')}</span>
              <span className="text-[8px] text-white/70 uppercase">{u.l}</span>
              {i < 3 && <span className="text-white/40 ml-1">·</span>}
            </span>
          ))}
        </div>
      </div>
      <p className="text-[10px] text-gray-400 mt-3 text-center">{demo.eventDate}</p>
    </div>
  );
};

// ─── 6: Radial Speedometer ───
const Style6 = () => {
  const s = useAnimatedSeconds();
  const total = demo.days * 86400 + demo.hours * 3600 + demo.minutes * 60 + s;
  const pct = Math.min(total / (30 * 86400), 1);
  const angle = pct * 180;
  return (
    <div className="w-full max-w-sm mx-auto p-6 rounded-2xl bg-gray-950 border border-gray-800 text-center">
      <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-1">{demo.headerLabel}</p>
      <p className="text-sm font-semibold text-white mb-4">{demo.eventTitle}</p>
      <div className="relative mx-auto" style={{ width: 200, height: 110 }}>
        <svg width="200" height="110" viewBox="0 0 200 110">
          <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="#1e293b" strokeWidth="14" strokeLinecap="round" />
          <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="url(#speedGrad)" strokeWidth="14" strokeLinecap="round"
            strokeDasharray={`${angle / 180 * 283} 283`}
            className="transition-all duration-1000 ease-linear"
          />
          <defs>
            <linearGradient id="speedGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute bottom-0 left-0 right-0 text-center">
          <div className="flex justify-center gap-3">
            {units(s).map((u, i) => (
              <span key={u.l} className="flex items-baseline gap-0.5">
                <span className="text-lg font-black tabular-nums text-white">{String(u.v).padStart(2, '0')}</span>
                <span className="text-[7px] text-gray-500 uppercase">{u.l}</span>
                {i < 3 && <span className="text-gray-600 mx-0.5">:</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-[10px] text-gray-600 mt-3">{demo.eventDate}</p>
    </div>
  );
};

// ─── 7: Flip Row with Progress Underline ───
const Style7 = () => {
  const s = useAnimatedSeconds();
  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
      <div className="text-center mb-4">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider">{demo.headerLabel}</p>
        <p className="text-sm font-bold text-gray-900">{demo.eventTitle}</p>
      </div>
      <div className="flex gap-3">
        {units(s).map((u) => {
          const pct = (u.v / u.max) * 100;
          return (
            <div key={u.l} className="flex-1 text-center">
              <div className="bg-gray-50 rounded-xl py-3 border border-gray-100">
                <span className="text-2xl font-black tabular-nums text-gray-800">{String(u.v).padStart(2, '0')}</span>
              </div>
              <div className="h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #6366f1, #a78bfa)' }}
                />
              </div>
              <span className="text-[8px] text-gray-400 uppercase tracking-wider mt-1 block">{u.l}</span>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-gray-400 mt-4 text-center">{demo.eventDate}</p>
    </div>
  );
};

// ─── 8: Retro Terminal ───
const Style8 = () => {
  const s = useAnimatedSeconds();
  const total = demo.days * 86400 + demo.hours * 3600 + demo.minutes * 60 + s;
  const pct = Math.min((total / (30 * 86400)) * 100, 100);
  const barLen = 30;
  const filled = Math.round((pct / 100) * barLen);
  const bar = '█'.repeat(filled) + '░'.repeat(barLen - filled);
  return (
    <div className="w-full max-w-md mx-auto p-5 rounded-xl bg-black border border-green-900/50 font-mono">
      <p className="text-green-500 text-[10px] mb-1">$ countdown --event &quot;{demo.eventTitle}&quot;</p>
      <p className="text-green-400 text-xs mb-3">
        &gt; {String(demo.days).padStart(2, '0')}d {String(demo.hours).padStart(2, '0')}h {String(demo.minutes).padStart(2, '0')}m {String(s).padStart(2, '0')}s remaining
      </p>
      <p className="text-green-500/80 text-[11px] tracking-wider tabular-nums mb-1">
        [{bar}] {Math.round(pct)}%
      </p>
      <p className="text-green-900 text-[9px] mt-2">target: {demo.eventDate}</p>
    </div>
  );
};

// ─── 9: Pill Progress with Split Units ───
const Style9 = () => {
  const s = useAnimatedSeconds();
  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50">
      <div className="flex items-center gap-2 mb-4">
        <Church className="w-4 h-4 text-amber-600" />
        <div>
          <p className="text-[10px] text-amber-600/60 uppercase tracking-wider font-semibold">{demo.headerLabel}</p>
          <p className="text-sm font-bold text-gray-900">{demo.eventTitle}</p>
        </div>
      </div>
      <div className="space-y-2.5">
        {units(s).map((u) => {
          const pct = (u.v / u.max) * 100;
          return (
            <div key={u.l} className="flex items-center gap-3">
              <span className="text-xs font-bold tabular-nums text-gray-800 w-7 text-right">{String(u.v).padStart(2, '0')}</span>
              <span className="text-[9px] text-gray-400 uppercase w-8">{u.l}</span>
              <div className="flex-1 h-3 bg-white/80 rounded-full overflow-hidden border border-amber-200/40">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-linear"
                  style={{
                    width: `${pct}%`,
                    background: 'linear-gradient(90deg, #f59e0b, #fb923c)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-amber-600/40 mt-4 text-center">{demo.eventDate}</p>
    </div>
  );
};

// ─── 10: Stacked Ribbon ───
const Style10 = () => {
  const s = useAnimatedSeconds();
  return (
    <div className="w-full max-w-md mx-auto rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 px-5 py-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-white/60 uppercase tracking-wider">{demo.headerLabel}</p>
          <p className="text-sm font-bold text-white">{demo.eventTitle}</p>
        </div>
        <Church className="w-4 h-4 text-white/50" />
      </div>
      <div className="p-4 space-y-0">
        {units(s).map((u, i) => {
          const pct = (u.v / u.max) * 100;
          const colors = [
            ['#e11d48', '#f43f5e'],
            ['#f43f5e', '#fb7185'],
            ['#fb7185', '#fda4af'],
            ['#fda4af', '#fecdd3'],
          ];
          return (
            <div key={u.l} className="flex items-center gap-3 py-2" style={{ borderBottom: i < 3 ? '1px solid #f3f4f6' : 'none' }}>
              <div className="flex items-center gap-2 w-20">
                <span className="text-lg font-black tabular-nums text-gray-800">{String(u.v).padStart(2, '0')}</span>
                <span className="text-[9px] text-gray-400 uppercase">{u.l}</span>
              </div>
              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-linear"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${colors[i][0]}, ${colors[i][1]})`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-gray-400 px-5 pb-3 text-center">{demo.eventDate}</p>
    </div>
  );
};

// ─── Showcase Wrapper ───
const options = [
  { title: 'Style 1 — Giant Bar with Embedded Digits', desc: 'Full-width gradient bar with time values overlaid inside', Component: Style1 },
  { title: 'Style 2 — Mega Bar with Inline Chips', desc: 'Dark theme, green gradient bar with time + percentage readout', Component: Style2 },
  { title: 'Style 3 — Stepped Progress Blocks', desc: 'Four blocks with fill rising from bottom, warm color scheme', Component: Style3 },
  { title: 'Style 4 — Liquid Fill Cards', desc: 'Dark cards with blue liquid-fill effect and surface highlight', Component: Style4 },
  { title: 'Style 5 — Diagonal Stripe Bar', desc: 'Animated candy-stripe gradient bar with time inside', Component: Style5 },
  { title: 'Style 6 — Radial Speedometer', desc: 'Half-circle gauge with hot gradient and centered time', Component: Style6 },
  { title: 'Style 7 — Digits with Progress Underline', desc: 'Clean digit cards with individual progress bars below', Component: Style7 },
  { title: 'Style 8 — Retro Terminal', desc: 'Monospace CLI aesthetic with ASCII progress bar', Component: Style8 },
  { title: 'Style 9 — Pill Progress Rows', desc: 'Warm amber theme with labeled pill-shaped progress bars', Component: Style9 },
  { title: 'Style 10 — Stacked Ribbon', desc: 'Gradient header ribbon with rose-tinted rows and bars', Component: Style10 },
];

const LoadingBarStyleShowcase = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-5xl mx-auto space-y-14">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Bar Counter Styles v2</h1>
        <p className="text-gray-500">10 animated loading-bar-inspired countdown layouts. All bars animate live.</p>
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
