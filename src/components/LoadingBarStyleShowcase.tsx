/**
 * Loading Bar Counter Style Showcase v4
 * 10 variations: reversed animated stripes bar, large digits, full labels below
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

/* Shared stripe keyframes (reversed — stripes move right-to-left) */
const stripeCSS = `
@keyframes stripe-reverse { 0% { background-position: 40px 0; } 100% { background-position: 0 0; } }
.stripe-bar-rev {
  animation: stripe-reverse 1s linear infinite;
  background-size: 40px 40px;
  background-image: linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);
}
`;

/* Digits component: large digits, full labels below centered */
const Digits = ({ u, digitClass = 'text-3xl', labelClass = 'text-[8px]', colorClass = 'text-foreground', labelColorClass = 'text-muted-foreground', sepColorClass = 'text-muted-foreground/30' }: {
  u: UnitDisplay; digitClass?: string; labelClass?: string; colorClass?: string; labelColorClass?: string; sepColorClass?: string;
}) => (
  <div className="flex items-start justify-center gap-1">
    {[
      { v: u.days, l: 'Days' }, { v: u.hours, l: 'Hours' },
      { v: u.minutes, l: 'Minutes' }, { v: u.seconds, l: 'Seconds' },
    ].map((x, i, a) => (
      <div key={x.l} className="flex items-start">
        <div className="flex flex-col items-center" style={{ minWidth: 52 }}>
          <span className={`font-mono font-bold tabular-nums leading-none ${digitClass} ${colorClass}`}>{pad(x.v)}</span>
          <span className={`uppercase tracking-wider mt-1.5 ${labelClass} ${labelColorClass}`}>{x.l}</span>
        </div>
        {i < a.length - 1 && (
          <span className={`font-light mx-0.5 ${sepColorClass}`} style={{ fontSize: 'calc(1em * 0.67)', marginTop: 2 }}>:</span>
        )}
      </div>
    ))}
  </div>
);

const LoadingBarStyleShowcase = () => {
  const s = useAnimatedSeconds();
  const u: UnitDisplay = { days: D, hours: H, minutes: M, seconds: s };

  const styles: { name: string; render: () => JSX.Element }[] = [
    // 1 — Classic Stripe
    {
      name: 'Classic Stripe',
      render: () => (
        <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-background space-y-4">
          <style>{stripeCSS}</style>
          <div className="flex items-center gap-2 text-sm">
            <Church className="w-4 h-4 text-primary" />
            <span className="font-semibold">{headerLabel}</span>
            <span className="text-muted-foreground text-xs ml-auto">{eventDate}</span>
          </div>
          <p className="text-muted-foreground text-xs italic text-center">{eventTitle}</p>
          <Digits u={u} />
          <div className="relative h-5 bg-muted rounded-lg overflow-hidden">
            <div className="stripe-bar-rev absolute inset-y-0 left-0 rounded-lg bg-primary transition-all duration-1000" style={{ width: `${pct}%` }} />
          </div>
        </div>
      ),
    },
    // 2 — Gradient Stripe
    {
      name: 'Gradient Stripe',
      render: () => (
        <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-background space-y-4">
          <style>{stripeCSS}</style>
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <Church className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">{headerLabel}</span>
            </div>
            <p className="text-xs text-muted-foreground italic">{eventTitle}</p>
          </div>
          <Digits u={u} />
          <div className="relative h-4 bg-muted rounded-full overflow-hidden">
            <div className="stripe-bar-rev absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)' }} />
          </div>
          <p className="text-center text-[10px] text-muted-foreground">{eventDate}</p>
        </div>
      ),
    },
    // 3 — Bold Top Bar
    {
      name: 'Bold Top Bar',
      render: () => (
        <div className="w-full max-w-md mx-auto rounded-2xl bg-background overflow-hidden">
          <style>{stripeCSS}</style>
          <div className="relative h-3 bg-muted">
            <div className="stripe-bar-rev absolute inset-y-0 left-0 bg-primary transition-all duration-1000" style={{ width: `${pct}%` }} />
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Church className="w-4 h-4 text-primary" />
              <span className="font-bold text-sm">{headerLabel}</span>
              <span className="text-xs text-muted-foreground ml-auto">{eventTitle}</span>
            </div>
            <Digits u={u} digitClass="text-4xl" />
            <p className="text-center text-[10px] text-muted-foreground">{eventDate}</p>
          </div>
        </div>
      ),
    },
    // 4 — Dark Neon Stripe
    {
      name: 'Dark Neon Stripe',
      render: () => (
        <div className="w-full max-w-md mx-auto p-6 rounded-2xl space-y-4" style={{ backgroundColor: '#0f0f0f' }}>
          <style>{`
            @keyframes stripe-neon { 0% { background-position: 40px 0; } 100% { background-position: 0 0; } }
            .stripe-neon { animation: stripe-neon 0.8s linear infinite; background-size: 40px 40px;
              background-image: linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent); }
          `}</style>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#22d3ee', boxShadow: '0 0 8px #22d3ee' }} />
            <span className="font-mono font-semibold text-sm" style={{ color: '#22d3ee' }}>{headerLabel.toUpperCase()}</span>
          </div>
          <Digits u={u} digitClass="text-3xl" colorClass="" labelColorClass="" sepColorClass=""
            {...{ style: {} } as any}
          />
          <div className="flex items-start justify-center gap-1">
            {/* override with inline colored digits */}
          </div>
          {/* Custom colored digits for dark bg */}
          <div className="flex items-start justify-center gap-1">
            {[
              { v: u.days, l: 'Days' }, { v: u.hours, l: 'Hours' },
              { v: u.minutes, l: 'Minutes' }, { v: u.seconds, l: 'Seconds' },
            ].map((x, i, a) => (
              <div key={x.l} className="flex items-start">
                <div className="flex flex-col items-center" style={{ minWidth: 52 }}>
                  <span className="font-mono font-bold tabular-nums leading-none text-3xl" style={{ color: '#22d3ee', textShadow: '0 0 10px rgba(34,211,238,0.4)' }}>{pad(x.v)}</span>
                  <span className="uppercase tracking-wider mt-1.5 text-[8px]" style={{ color: 'rgba(34,211,238,0.6)' }}>{x.l}</span>
                </div>
                {i < a.length - 1 && <span className="font-light mx-0.5" style={{ color: 'rgba(34,211,238,0.3)', marginTop: 2 }}>:</span>}
              </div>
            ))}
          </div>
          <div className="relative h-4 rounded-lg overflow-hidden" style={{ backgroundColor: 'rgba(34,211,238,0.1)' }}>
            <div className="stripe-neon absolute inset-y-0 left-0 rounded-lg transition-all duration-1000"
              style={{ width: `${pct}%`, backgroundColor: '#22d3ee', boxShadow: '0 0 12px rgba(34,211,238,0.5)' }} />
          </div>
          <p className="text-center font-mono text-[10px]" style={{ color: 'rgba(34,211,238,0.5)' }}>{eventDate}</p>
        </div>
      ),
    },
    // 5 — Rounded Pill Bar
    {
      name: 'Rounded Pill',
      render: () => (
        <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-background space-y-4">
          <style>{stripeCSS}</style>
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <Church className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">{headerLabel}</span>
            </div>
            <p className="text-xs text-muted-foreground">{eventTitle}</p>
          </div>
          <Digits u={u} digitClass="text-4xl" />
          <div className="relative h-6 bg-muted rounded-full overflow-hidden">
            <div className="stripe-bar-rev absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-1000" style={{ width: `${pct}%` }} />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-muted-foreground">{pct}%</div>
          </div>
          <p className="text-center text-[10px] text-muted-foreground">{eventDate}</p>
        </div>
      ),
    },
    // 6 — Split Stripe (digits left, bar right)
    {
      name: 'Split Stripe',
      render: () => (
        <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-background space-y-3">
          <style>{stripeCSS}</style>
          <div className="flex items-center gap-2 text-sm">
            <Church className="w-4 h-4 text-primary" />
            <span className="font-semibold">{headerLabel}</span>
            <span className="text-muted-foreground text-xs">— {eventTitle}</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-start gap-0.5 flex-shrink-0">
              {[
                { v: u.days, l: 'Days' }, { v: u.hours, l: 'Hrs' },
                { v: u.minutes, l: 'Min' }, { v: u.seconds, l: 'Sec' },
              ].map((x, i, a) => (
                <div key={x.l} className="flex items-start">
                  <div className="flex flex-col items-center" style={{ minWidth: 36 }}>
                    <span className="font-mono font-bold tabular-nums text-2xl leading-none">{pad(x.v)}</span>
                    <span className="uppercase tracking-wider mt-1 text-[7px] text-muted-foreground">{x.l}</span>
                  </div>
                  {i < a.length - 1 && <span className="text-muted-foreground/30 font-light mx-0.5" style={{ marginTop: 2 }}>:</span>}
                </div>
              ))}
            </div>
            <div className="flex-1 relative h-5 bg-muted rounded-lg overflow-hidden">
              <div className="stripe-bar-rev absolute inset-y-0 left-0 rounded-lg bg-primary transition-all duration-1000" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">{eventDate}</p>
        </div>
      ),
    },
    // 7 — Double Stripe (thin + thick)
    {
      name: 'Double Line',
      render: () => (
        <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-background space-y-4">
          <style>{stripeCSS}</style>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Church className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">{headerLabel}</span>
            </div>
            <span className="text-xs text-muted-foreground italic">{eventTitle}</span>
          </div>
          <Digits u={u} digitClass="text-3xl" />
          <div className="space-y-1.5">
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded-full bg-primary/40 transition-all duration-1000" style={{ width: `${Math.min(pct + 10, 100)}%` }} />
            </div>
            <div className="relative h-4 bg-muted rounded-lg overflow-hidden">
              <div className="stripe-bar-rev absolute inset-y-0 left-0 rounded-lg bg-primary transition-all duration-1000" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <p className="text-center text-[10px] text-muted-foreground">{eventDate}</p>
        </div>
      ),
    },
    // 8 — Bottom Banner Bar
    {
      name: 'Bottom Banner',
      render: () => (
        <div className="w-full max-w-md mx-auto rounded-2xl bg-background overflow-hidden">
          <style>{stripeCSS}</style>
          <div className="p-6 space-y-4">
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-2">
                <Church className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">{headerLabel}</span>
              </div>
              <p className="text-xs text-muted-foreground italic">{eventTitle}</p>
            </div>
            <Digits u={u} digitClass="text-4xl" />
          </div>
          <div className="relative h-6 bg-muted">
            <div className="stripe-bar-rev absolute inset-y-0 left-0 bg-primary transition-all duration-1000" style={{ width: `${pct}%` }} />
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <span className="text-[9px] font-mono font-medium text-muted-foreground">0%</span>
              <span className="text-[9px] font-mono font-medium text-muted-foreground">{eventDate}</span>
            </div>
          </div>
        </div>
      ),
    },
    // 9 — Warm Gradient Stripe
    {
      name: 'Warm Gradient',
      render: () => (
        <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-background space-y-4">
          <style>{`
            @keyframes stripe-warm { 0% { background-position: 40px 0; } 100% { background-position: 0 0; } }
            .stripe-warm { animation: stripe-warm 1.2s linear infinite; background-size: 40px 40px;
              background-image: linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent); }
          `}</style>
          <div className="flex items-center gap-2 text-sm">
            <Church className="w-4 h-4" style={{ color: '#f59e0b' }} />
            <span className="font-semibold">{headerLabel}</span>
          </div>
          <p className="text-xs text-muted-foreground italic">{eventTitle}</p>
          <Digits u={u} digitClass="text-3xl" />
          <div className="relative h-5 bg-muted rounded-xl overflow-hidden">
            <div className="stripe-warm absolute inset-y-0 left-0 rounded-xl transition-all duration-1000"
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #f59e0b, #ef4444, #ec4899)' }} />
          </div>
          <p className="text-center text-[10px] text-muted-foreground">{eventDate}</p>
        </div>
      ),
    },
    // 10 — Scrubber Stripe (dot on bar end)
    {
      name: 'Scrubber Stripe',
      render: () => (
        <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-background space-y-4">
          <style>{stripeCSS}</style>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Church className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">{headerLabel}</span>
            </div>
            <span className="text-xs text-muted-foreground italic">{eventTitle}</span>
          </div>
          <Digits u={u} digitClass="text-3xl" />
          <div className="relative h-3 bg-muted rounded-full">
            <div className="stripe-bar-rev absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-1000" style={{ width: `${pct}%` }} />
            <div className="absolute top-1/2 w-5 h-5 rounded-full bg-primary border-2 border-background shadow-lg transition-all duration-1000"
              style={{ left: `${pct}%`, transform: 'translate(-50%, -50%)' }} />
          </div>
          <p className="text-center text-[10px] text-muted-foreground">{eventDate}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Loading Bar Counter — 10 Striped Layouts</h1>
          <p className="text-muted-foreground text-sm">Reversed animated stripes · large digits · full labels below</p>
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
