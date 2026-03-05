import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Church, Clock, CalendarDays } from 'lucide-react';

interface StyleOption {
  id: string;
  name: string;
  description: string;
}

const STYLE_OPTIONS: StyleOption[] = [
  { id: 'default', name: 'Classic', description: 'The default free style — clean header row with large digits and colon separators' },
  { id: 'cards', name: 'Card Blocks', description: 'Each countdown unit in its own elevated card with event info below' },
  { id: 'flip', name: 'Flip Clock', description: 'Retro split-flap panels on a dark surface with header badge' },
  { id: 'circles', name: 'Radial Progress', description: 'Circular progress rings with centered event details' },
  { id: 'gradient', name: 'Gradient Glass', description: 'Frosted glass panels with gradient event header' },
  { id: 'bold', name: 'Bold Stack', description: 'Oversized stacked digits with prominent event title' },
  { id: 'dots', name: 'LED Dots', description: 'Green dot-matrix display with digital clock aesthetic' },
  { id: 'elegant', name: 'Elegant Serif', description: 'Refined serif typography with date above the counter' },
];

// Demo data matching the real widget fields
const demo = {
  days: 3, hours: 14, mins: 27, secs: 52,
  headerLabel: 'Next Event',
  eventTitle: 'Sunday Morning Worship',
  eventDate: 'March 8, 2026 at 10:00 AM',
  iconColor: '#6366f1',
};

const pad = (n: number) => String(n).padStart(2, '0');

const unitsFull = [
  { v: demo.days, l: 'Days', s: 'D' },
  { v: demo.hours, l: 'Hours', s: 'H' },
  { v: demo.mins, l: 'Minutes', s: 'M' },
  { v: demo.secs, l: 'Seconds', s: 'S' },
];

// ─── Style 1: Classic (default/free) ───
const ClassicStyle = () => (
  <div className="w-full rounded-2xl p-6 text-center border border-border bg-background">
    <div className="flex items-center justify-center flex-wrap gap-2 mb-1">
      <Church className="w-5 h-5" style={{ color: demo.iconColor }} />
      <span className="font-semibold text-sm text-foreground">{demo.headerLabel}:</span>
      <span className="text-sm text-muted-foreground">{demo.eventDate}</span>
    </div>
    <p className="italic text-sm text-muted-foreground mb-6">{demo.eventTitle}</p>
    <div className="flex justify-center items-center gap-1">
      {unitsFull.map((u, i) => (
        <div key={u.l} className="flex items-center">
          <div className="flex flex-col items-center" style={{ minWidth: 56 }}>
            <span className="text-4xl font-black tabular-nums leading-none text-foreground">{pad(u.v)}</span>
            <span className="text-[9px] uppercase tracking-wider mt-1.5 text-muted-foreground">{u.l}</span>
          </div>
          {i < 3 && <span className="text-2xl font-light -mt-3 text-border mx-0.5">:</span>}
        </div>
      ))}
    </div>
  </div>
);

// ─── Style 2: Card Blocks ───
const CardBlocksStyle = () => (
  <div className="w-full rounded-2xl p-6 text-center bg-background border border-border">
    <div className="flex items-center justify-center gap-2 mb-1">
      <Church className="w-5 h-5" style={{ color: demo.iconColor }} />
      <span className="font-semibold text-sm text-foreground">{demo.headerLabel}</span>
    </div>
    <p className="text-xs text-muted-foreground mb-5">{demo.eventTitle}</p>
    <div className="grid grid-cols-4 gap-2 mb-4">
      {unitsFull.map((u) => (
        <div key={u.l} className="bg-muted/60 rounded-xl py-3 text-center shadow-sm">
          <div className="text-2xl font-bold font-mono text-foreground">{pad(u.v)}</div>
          <div className="text-[8px] uppercase tracking-[0.15em] text-muted-foreground mt-1">{u.l}</div>
        </div>
      ))}
    </div>
    <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
      <CalendarDays className="w-3 h-3" />
      <span>{demo.eventDate}</span>
    </div>
  </div>
);

// ─── Style 3: Flip Clock ───
const FlipClockStyle = () => (
  <div className="w-full rounded-2xl p-6 text-center" style={{ backgroundColor: '#18181b' }}>
    <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 mb-1">
      <Church className="w-3.5 h-3.5" style={{ color: '#a78bfa' }} />
      <span className="text-xs font-medium text-white/90">{demo.headerLabel}</span>
    </div>
    <p className="text-xs text-white/50 italic mb-5">{demo.eventTitle}</p>
    <div className="flex items-center justify-center gap-2 mb-4">
      {unitsFull.map((u, i) => (
        <div key={u.l} className="flex items-center gap-2">
          <div className="min-w-[44px]">
            <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#27272a' }}>
              <div className="px-2 pt-2 pb-0.5 text-xl font-bold font-mono text-center text-white" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{pad(u.v)}</div>
              <div className="px-2 pt-0.5 pb-2 text-xl font-bold font-mono text-center text-white/80">{pad(u.v)}</div>
            </div>
            <div className="text-[8px] uppercase tracking-widest text-white/40 mt-1.5">{u.l}</div>
          </div>
          {i < 3 && <span className="text-white/20 text-lg font-light -mt-4">:</span>}
        </div>
      ))}
    </div>
    <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/40">
      <Clock className="w-3 h-3" />
      <span>{demo.eventDate}</span>
    </div>
  </div>
);

// ─── Style 4: Radial Progress ───
const RadialStyle = () => {
  const items = [
    { ...unitsFull[0], max: 30 },
    { ...unitsFull[1], max: 24 },
    { ...unitsFull[2], max: 60 },
    { ...unitsFull[3], max: 60 },
  ];
  const r = 34; const c = 2 * Math.PI * r;
  return (
    <div className="w-full rounded-2xl p-6 text-center bg-background border border-border">
      <div className="flex items-center justify-center gap-2 mb-0.5">
        <Church className="w-5 h-5" style={{ color: demo.iconColor }} />
        <span className="font-semibold text-sm text-foreground">{demo.headerLabel}</span>
      </div>
      <p className="text-xs text-muted-foreground italic mb-5">{demo.eventTitle}</p>
      <div className="flex items-center justify-center gap-5 mb-4">
        {items.map(({ v, l, max }) => {
          const pct = (v / max) * 100;
          return (
            <div key={l} className="relative w-[80px] h-[80px] flex items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r={r} fill="none" stroke="currentColor" strokeWidth="3" className="text-muted/30" />
                <circle cx="40" cy="40" r={r} fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${c}`} strokeDashoffset={`${c - (c * pct) / 100}`} strokeLinecap="round" className="text-primary" />
              </svg>
              <div className="text-center z-10">
                <div className="text-xl font-bold font-mono leading-none text-foreground">{v}</div>
                <div className="text-[8px] uppercase tracking-wider text-muted-foreground mt-1">{l}</div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">{demo.eventDate}</p>
    </div>
  );
};

// (Minimal Line and Neon Glow removed from Pro selection)

// ─── Style 6: Gradient Glass ───
const GradientGlassStyle = () => (
  <div className="w-full rounded-2xl overflow-hidden border border-border">
    <div className="px-5 py-3 flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
      <Church className="w-4 h-4 text-white/90" />
      <span className="text-sm font-semibold text-white">{demo.headerLabel}</span>
      <span className="text-xs text-white/70 ml-auto">{demo.eventTitle}</span>
    </div>
    <div className="bg-background p-5 space-y-4">
      <div className="flex items-center justify-center gap-2">
        {unitsFull.map((u) => (
          <div key={u.l} className="rounded-xl px-3 py-2.5 text-center min-w-[52px]" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))' }}>
            <div className="text-xl font-bold font-mono text-primary">{pad(u.v)}</div>
            <div className="text-[8px] text-muted-foreground uppercase tracking-wider mt-0.5">{u.l}</div>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground">{demo.eventDate}</p>
    </div>
  </div>
);

// ─── Style 7: Bold Stack ───
const BoldStackStyle = () => (
  <div className="w-full rounded-2xl p-6 bg-background border border-border text-center">
    <Church className="w-6 h-6 mx-auto mb-2" style={{ color: demo.iconColor }} />
    <h3 className="text-lg font-black text-foreground tracking-tight">{demo.eventTitle}</h3>
    <p className="text-xs text-muted-foreground mb-5">{demo.headerLabel} · {demo.eventDate}</p>
    <div className="flex items-center justify-center gap-5">
      {unitsFull.map((u) => (
        <div key={u.l} className="text-center">
          <div className="text-4xl font-black font-mono leading-none text-foreground">{pad(u.v)}</div>
          <div className="text-[7px] font-bold tracking-[0.3em] text-muted-foreground mt-1.5 uppercase">{u.l}</div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Style 8: LED Dots ───
const LEDDotsStyle = () => (
  <div className="w-full rounded-2xl overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
    <div className="px-5 py-2.5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(34,197,94,0.15)' }}>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.5)' }} />
        <span className="text-xs font-mono" style={{ color: '#22c55e' }}>{demo.headerLabel.toUpperCase()}</span>
      </div>
      <span className="text-[10px] font-mono" style={{ color: 'rgba(34,197,94,0.5)' }}>{demo.eventTitle}</span>
    </div>
    <div className="px-5 py-5 text-center">
      <div className="font-mono text-3xl tracking-[0.15em] font-bold" style={{ color: '#22c55e', textShadow: '0 0 10px rgba(34,197,94,0.4)' }}>
        {pad(demo.days)}:{pad(demo.hours)}:{pad(demo.mins)}:{pad(demo.secs)}
      </div>
      <div className="flex justify-center gap-8 mt-2">
        {unitsFull.map((u) => (
          <span key={u.l} className="text-[8px] font-mono tracking-widest uppercase" style={{ color: 'rgba(34,197,94,0.35)' }}>{u.l}</span>
        ))}
      </div>
    </div>
    <div className="px-5 py-2 text-center" style={{ borderTop: '1px solid rgba(34,197,94,0.1)' }}>
      <span className="text-[10px] font-mono" style={{ color: 'rgba(34,197,94,0.4)' }}>{demo.eventDate}</span>
    </div>
  </div>
);

// ─── Style 9: Elegant Serif ───
const ElegantSerifStyle = () => (
  <div className="w-full rounded-2xl p-6 bg-background border border-border text-center">
    <div className="flex items-center justify-center gap-2 mb-1">
      <Church className="w-4 h-4" style={{ color: demo.iconColor }} />
      <span className="text-sm" style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 600, color: 'inherit' }}>{demo.headerLabel}</span>
    </div>
    <p className="text-xs italic text-muted-foreground mb-2">{demo.eventTitle}</p>
    <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground italic mb-4">
      <CalendarDays className="w-3 h-3" />
      <span>{demo.eventDate}</span>
    </div>
    <div className="w-16 h-px bg-border mx-auto mb-4" />
    <div className="flex items-center justify-center gap-5">
      {unitsFull.map((u, i) => (
        <div key={u.l} className="flex items-center gap-5">
          <div className="text-center">
            <div className="text-3xl font-light text-foreground" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>{pad(u.v)}</div>
            <div className="text-[8px] tracking-[0.15em] text-muted-foreground italic mt-1">{u.l}</div>
          </div>
          {i < 3 && <div className="w-px h-10 bg-border/50" />}
        </div>
      ))}
    </div>
  </div>
);

const STYLE_RENDERERS: Record<string, React.FC> = {
  default: ClassicStyle,
  cards: CardBlocksStyle,
  flip: FlipClockStyle,
  circles: RadialStyle,
  gradient: GradientGlassStyle,
  bold: BoldStackStyle,
  dots: LEDDotsStyle,
  elegant: ElegantSerifStyle,
};

const CounterStylesShowcase = () => {
  const [selected, setSelected] = useState('default');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          Counter Styles
          <Crown className="w-5 h-5 text-amber-500" />
        </h2>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          Choose from 10 unique countdown display styles. Each style includes the full widget layout — header, event info, countdown digits, and date. Click any option to preview.
        </p>
      </div>

      {/* Live full-size preview */}
      <Card className="border-primary/20 bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Full Preview</CardTitle>
            <Badge variant="secondary" className="text-xs">{STYLE_OPTIONS.find(s => s.id === selected)?.name}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {STYLE_RENDERERS[selected]?.({}) ?? null}
        </CardContent>
      </Card>

      {/* Style grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {STYLE_OPTIONS.map((style) => {
          const isSelected = selected === style.id;
          const isFree = style.id === 'default';
          const Renderer = STYLE_RENDERERS[style.id];
          return (
            <button
              key={style.id}
              onClick={() => setSelected(style.id)}
              className={`relative text-left rounded-xl border-2 p-4 transition-all hover:shadow-md ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/30 bg-card'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center z-10">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{style.name}</span>
                  {isFree ? (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">Free</Badge>
                  ) : (
                    <Badge className="text-[10px] px-1.5 py-0 bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/10">Pro</Badge>
                  )}
                </div>
                {/* Mini preview */}
                <div className="rounded-lg overflow-hidden border border-border/50" style={{ transform: 'scale(0.65)', transformOrigin: 'top left', height: 130, width: '154%' }}>
                  {Renderer && <Renderer />}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{style.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CounterStylesShowcase;
