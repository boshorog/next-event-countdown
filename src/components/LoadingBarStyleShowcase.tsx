/**
 * Loading Bar Counter Style Showcase v3
 * 10 unique single-bar layouts with digits outside
 * Access via ?showcase=loading-bar
 */

import { useState, useEffect } from 'react';
import { Church, Clock } from 'lucide-react';

const pad = (n: number) => String(n).padStart(2, '0');

const useAnimatedSeconds = () => {
  const [s, setS] = useState(52);
  useEffect(() => { const t = setInterval(() => setS(p => (p <= 0 ? 59 : p - 1)), 1000); return () => clearInterval(t); }, []);
  return s;
};

const D = 3, H = 14, M = 27;
const headerLabel = 'Next Event';
const eventTitle = 'Sunday Morning Worship';
const eventDate = 'March 8, 2026 at 10:00 AM';
const pct = 42;

interface UnitDisplay { days: number; hours: number; minutes: number; seconds: number }

const Units = ({ u, className = '' }: { u: UnitDisplay; className?: string }) => (
  <div className={`flex items-center gap-4 ${className}`}>
    {[
      { v: u.days, l: 'Days' }, { v: u.hours, l: 'Hours' },
      { v: u.minutes, l: 'Min' }, { v: u.seconds, l: 'Sec' },
    ].map((x, i, a) => (
      <div key={x.l} className="flex items-center gap-4">
        <div className="text-center">
          <span className="font-mono font-bold text-lg tabular-nums">{pad(x.v)}</span>
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground ml-1">{x.l}</span>
        </div>
        {i < a.length - 1 && <span className="text-muted-foreground/40 font-light">:</span>}
      </div>
    ))}
  </div>
);

const LoadingBarStyleShowcase = () => {
  const s = useAnimatedSeconds();
  const u: UnitDisplay = { days: D, hours: H, minutes: M, seconds: s };

  const styles: { name: string; render: () => JSX.Element }[] = [
    // 1 — Smooth Gradient Bar with digits above
    {
      name: 'Smooth Gradient',
      render: () => (
        <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-background space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Church className="w-4 h-4 text-primary" />
            <span className="font-semibold">{headerLabel}</span>
            <span className="text-muted-foreground ml-auto text-xs">{eventDate}</span>
          </div>
          <p className="text-muted-foreground text-xs italic">{eventTitle}</p>
          <Units u={u} className="justify-center" />
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)' }}
            />
          </div>
        </div>
      ),
    },
    // 2 — Neon Glow Track
    {
      name: 'Neon Glow',
      render: () => (
        <div className="w-full max-w-md mx-auto p-6 rounded-2xl space-y-4" style={{ backgroundColor: '#0f0f0f' }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#22d3ee', boxShadow: '0 0 8px #22d3ee' }} />
            <span className="font-mono font-semibold text-sm" style={{ color: '#22d3ee' }}>{headerLabel.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-4 justify-center">
            {[{ v: u.days, l: 'D' }, { v: u.hours, l: 'H' }, { v: u.minutes, l: 'M' }, { v: u.seconds, l: 'S' }].map((x, i, a) => (
              <div key={x.l} className="flex items-center gap-4">
                <div className="text-center">
                  <span className="font-mono font-bold text-xl tabular-nums" style={{ color: '#22d3ee', textShadow: '0 0 12px rgba(34,211,238,0.5)' }}>{pad(x.v)}</span>
                  <span className="text-[8px] uppercase ml-0.5" style={{ color: 'rgba(34,211,238,0.6)' }}>{x.l}</span>
                </div>
                {i < a.length - 1 && <span style={{ color: 'rgba(34,211,238,0.3)' }}>:</span>}
              </div>
            ))}
          </div>
          <div className="relative h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(34,211,238,0.1)' }}>
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, backgroundColor: '#22d3ee', boxShadow: '0 0 12px rgba(34,211,238,0.6)' }}
            />
          </div>
          <p className="text-center font-mono text-[10px]" style={{ color: 'rgba(34,211,238,0.5)' }}>{eventDate}</p>
        </div>
      ),
    },
    // 3 — Minimal Thin Line
    {
      name: 'Minimal Line',
      render: () => (
        <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-background space-y-5">
          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">{headerLabel}</p>
            <p className="font-semibold text-sm">{eventTitle}</p>
          </div>
          <Units u={u} className="justify-center" />
          <div className="relative h-1 bg-muted rounded-full overflow-hidden">
            <div className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-1000" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-center text-[10px] text-muted-foreground">{eventDate}</p>
        </div>
      ),
    },
    // 4 — Striped Animated Bar
    {
      name: 'Animated Stripes',
      render: () => (
        <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-background space-y-4">
          <style>{`
            @keyframes stripe-move { 0% { background-position: 0 0; } 100% { background-position: 40px 0; } }
            .stripe-bar { animation: stripe-move 1s linear infinite; background-size: 40px 40px;
              background-image: linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent); }
          `}</style>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Church className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">{headerLabel}</span>
            </div>
            <span className="text-xs text-muted-foreground">{eventTitle}</span>
          </div>
          <Units u={u} className="justify-center" />
          <div className="relative h-5 bg-muted rounded-lg overflow-hidden">
            <div className="stripe-bar absolute inset-y-0 left-0 rounded-lg bg-primary transition-all duration-1000" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-center text-[10px] text-muted-foreground">{eventDate}</p>
        </div>
      ),
    },
    // 5 — Chunky Badge (digits as badge on bar)
    {
      name: 'Chunky Badge',
      render: () => (
        <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-background space-y-4">
          <div className="flex items-center gap-2">
            <Church className="w-4 h-4 text-primary" />
            <span className="font-bold text-sm">{headerLabel}</span>
          </div>
          <p className="text-xs text-muted-foreground">{eventTitle} · {eventDate}</p>
          <div className="relative h-8 bg-muted rounded-2xl overflow-hidden">
            <div className="absolute inset-y-0 left-0 rounded-2xl bg-primary transition-all duration-1000" style={{ width: `${pct}%` }} />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur rounded-full px-3 py-0.5 text-xs font-mono font-bold shadow-sm">
              {pad(u.days)}d {pad(u.hours)}h {pad(u.minutes)}m {pad(u.seconds)}s
            </div>
          </div>
        </div>
      ),
    },
    // 6 — Split Layout: digits left, bar right
    {
      name: 'Split Layout',
      render: () => (
        <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-background space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Church className="w-4 h-4 text-primary" />
            <span className="font-semibold">{headerLabel}</span>
            <span className="text-muted-foreground text-xs">— {eventTitle}</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-baseline gap-1 font-mono font-bold text-2xl tabular-nums flex-shrink-0">
              <span>{pad(u.days)}</span><span className="text-muted-foreground/40">:</span>
              <span>{pad(u.hours)}</span><span className="text-muted-foreground/40">:</span>
              <span>{pad(u.minutes)}</span><span className="text-muted-foreground/40">:</span>
              <span>{pad(u.seconds)}</span>
            </div>
            <div className="flex-1 relative h-3 bg-muted rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-1000" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">{eventDate}</p>
        </div>
      ),
    },
    // 7 — Segmented Dots Bar
    {
      name: 'Segmented Dots',
      render: () => {
        const totalDots = 20;
        const filledDots = Math.round((pct / 100) * totalDots);
        return (
          <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-background space-y-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Church className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">{headerLabel}</span>
              </div>
              <p className="text-xs text-muted-foreground italic">{eventTitle}</p>
            </div>
            <Units u={u} className="justify-center" />
            <div className="flex items-center gap-1 justify-center">
              {Array.from({ length: totalDots }).map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full transition-colors duration-300"
                  style={{ backgroundColor: i < filledDots ? 'hsl(var(--primary))' : 'hsl(var(--muted))' }} />
              ))}
            </div>
            <p className="text-center text-[10px] text-muted-foreground">{eventDate}</p>
          </div>
        );
      },
    },
    // 8 — Terminal CLI
    {
      name: 'Terminal CLI',
      render: () => {
        const filled = Math.round((pct / 100) * 30);
        const bar = '█'.repeat(filled) + '░'.repeat(30 - filled);
        return (
          <div className="w-full max-w-md mx-auto p-5 rounded-xl font-mono text-sm space-y-2" style={{ backgroundColor: '#1a1a2e', color: '#00ff88' }}>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(0,255,136,0.5)' }}>
              <span>$</span><span>countdown --event "{eventTitle}"</span>
            </div>
            <div className="text-xs" style={{ color: 'rgba(0,255,136,0.7)' }}>
              Target: {eventDate}
            </div>
            <div className="flex items-center gap-3 text-lg font-bold tabular-nums">
              <span>{pad(u.days)}d</span><span>{pad(u.hours)}h</span><span>{pad(u.minutes)}m</span><span>{pad(u.seconds)}s</span>
            </div>
            <div className="text-xs">
              [{bar}] {pct}%
            </div>
          </div>
        );
      },
    },
    // 9 — Ribbon Scrubber
    {
      name: 'Ribbon Scrubber',
      render: () => (
        <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-background space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Church className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">{headerLabel}</span>
            </div>
            <span className="text-xs text-muted-foreground italic">{eventTitle}</span>
          </div>
          <Units u={u} className="justify-center" />
          <div className="relative h-2 bg-muted rounded-full">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #f59e0b, #ef4444, #8b5cf6)' }}
            />
            <div
              className="absolute top-1/2 w-4 h-4 rounded-full border-2 border-background shadow-lg transition-all duration-1000"
              style={{ left: `${pct}%`, transform: 'translate(-50%, -50%)', background: 'linear-gradient(135deg, #f59e0b, #8b5cf6)' }}
            />
          </div>
          <p className="text-center text-[10px] text-muted-foreground">{eventDate}</p>
        </div>
      ),
    },
    // 10 — Stacked Percent
    {
      name: 'Stacked Percent',
      render: () => (
        <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-background space-y-4">
          <div className="flex items-center gap-2">
            <Church className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">{headerLabel}</span>
            <span className="text-muted-foreground text-xs ml-auto">{eventTitle}</span>
          </div>
          <div className="flex items-end justify-between">
            <Units u={u} />
            <span className="text-3xl font-black text-primary tabular-nums">{pct}%</span>
          </div>
          <div className="relative h-4 bg-muted rounded-full overflow-hidden">
            <div className="absolute inset-y-0 left-0 rounded-full bg-primary/40 transition-all duration-1000" style={{ width: `${pct + 8}%` }} />
            <div className="absolute inset-y-0 left-0 rounded-full bg-primary/80 transition-all duration-1000" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Started</span>
            <span>{eventDate}</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Loading Bar Counter — 10 Layouts</h1>
          <p className="text-muted-foreground text-sm">Single progress bar · digits outside · live ticking</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {styles.map((st, i) => (
            <div key={i} className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground px-1">#{i + 1} — {st.name}</p>
              <div className="border border-border rounded-2xl overflow-hidden shadow-sm">
                {st.render()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingBarStyleShowcase;
