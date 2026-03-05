import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Church } from 'lucide-react';

interface StyleOption {
  id: string;
  name: string;
  description: string;
}

const STYLE_OPTIONS: StyleOption[] = [
  { id: 'default', name: 'Classic', description: 'Clean digits with colon separators — the default free style' },
  { id: 'cards', name: 'Card Blocks', description: 'Each unit in its own rounded card with subtle shadow' },
  { id: 'flip', name: 'Flip Clock', description: 'Retro split-flap style with top/bottom halves' },
  { id: 'circles', name: 'Radial Progress', description: 'Circular progress rings around each unit' },
  { id: 'minimal', name: 'Minimal Line', description: 'Single horizontal line with thin typography' },
  { id: 'gradient', name: 'Gradient Glass', description: 'Frosted glass panels with gradient backgrounds' },
  { id: 'bold', name: 'Bold Stack', description: 'Extra-large stacked digits with thick labels' },
  { id: 'dots', name: 'LED Dots', description: 'Dot-matrix / digital clock aesthetic' },
  { id: 'elegant', name: 'Elegant Serif', description: 'Serif typography with fine divider lines' },
  { id: 'neon', name: 'Neon Glow', description: 'Glowing text with dark background, arcade feel' },
];

const demoTime = { days: 3, hours: 14, mins: 27, secs: 52 };
const pad = (n: number) => String(n).padStart(2, '0');

// ─── Individual style renderers ───

const ClassicStyle = () => (
  <div className="flex items-center justify-center gap-1 font-mono text-2xl font-bold tracking-wider" style={{ color: '#1a1a1a' }}>
    <span>{pad(demoTime.days)}</span><span className="text-muted-foreground/40">:</span>
    <span>{pad(demoTime.hours)}</span><span className="text-muted-foreground/40">:</span>
    <span>{pad(demoTime.mins)}</span><span className="text-muted-foreground/40">:</span>
    <span>{pad(demoTime.secs)}</span>
  </div>
);

const CardBlocksStyle = () => (
  <div className="flex items-center justify-center gap-2">
    {[
      { v: demoTime.days, l: 'D' },
      { v: demoTime.hours, l: 'H' },
      { v: demoTime.mins, l: 'M' },
      { v: demoTime.secs, l: 'S' },
    ].map(({ v, l }) => (
      <div key={l} className="bg-muted/60 rounded-lg px-3 py-2 text-center shadow-sm min-w-[44px]">
        <div className="text-xl font-bold font-mono">{pad(v)}</div>
        <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{l}</div>
      </div>
    ))}
  </div>
);

const FlipClockStyle = () => (
  <div className="flex items-center justify-center gap-2">
    {[demoTime.days, demoTime.hours, demoTime.mins, demoTime.secs].map((v, i) => (
      <div key={i} className="relative min-w-[40px]">
        <div className="bg-zinc-900 text-white rounded-md overflow-hidden">
          <div className="px-2 pt-2 pb-0.5 text-xl font-bold font-mono text-center border-b border-zinc-700/50">{pad(v)}</div>
          <div className="px-2 pt-0.5 pb-2 text-xl font-bold font-mono text-center opacity-90">{pad(v)}</div>
        </div>
      </div>
    ))}
  </div>
);

const RadialStyle = () => (
  <div className="flex items-center justify-center gap-3">
    {[
      { v: demoTime.days, max: 30, l: 'D' },
      { v: demoTime.hours, max: 24, l: 'H' },
      { v: demoTime.mins, max: 60, l: 'M' },
      { v: demoTime.secs, max: 60, l: 'S' },
    ].map(({ v, max, l }) => {
      const pct = (v / max) * 100;
      const r = 18; const c = 2 * Math.PI * r;
      return (
        <div key={l} className="relative w-[48px] h-[48px] flex items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r={r} fill="none" stroke="currentColor" strokeWidth="3" className="text-muted/30" />
            <circle cx="22" cy="22" r={r} fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${c}`} strokeDashoffset={`${c - (c * pct) / 100}`} strokeLinecap="round" className="text-primary" />
          </svg>
          <div className="text-center z-10">
            <div className="text-sm font-bold font-mono leading-none">{v}</div>
            <div className="text-[8px] text-muted-foreground">{l}</div>
          </div>
        </div>
      );
    })}
  </div>
);

const MinimalLineStyle = () => (
  <div className="flex items-center justify-center gap-4 text-sm tracking-[0.2em] font-light">
    <span>{pad(demoTime.days)}<span className="text-[10px] text-muted-foreground ml-0.5">d</span></span>
    <span className="w-px h-4 bg-border" />
    <span>{pad(demoTime.hours)}<span className="text-[10px] text-muted-foreground ml-0.5">h</span></span>
    <span className="w-px h-4 bg-border" />
    <span>{pad(demoTime.mins)}<span className="text-[10px] text-muted-foreground ml-0.5">m</span></span>
    <span className="w-px h-4 bg-border" />
    <span>{pad(demoTime.secs)}<span className="text-[10px] text-muted-foreground ml-0.5">s</span></span>
  </div>
);

const GradientGlassStyle = () => (
  <div className="flex items-center justify-center gap-2">
    {[
      { v: demoTime.days, l: 'Days' },
      { v: demoTime.hours, l: 'Hrs' },
      { v: demoTime.mins, l: 'Min' },
      { v: demoTime.secs, l: 'Sec' },
    ].map(({ v, l }) => (
      <div key={l} className="rounded-xl px-3 py-2 text-center min-w-[46px]" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))', backdropFilter: 'blur(4px)' }}>
        <div className="text-xl font-bold font-mono" style={{ color: '#4f46e5' }}>{pad(v)}</div>
        <div className="text-[9px] text-muted-foreground uppercase tracking-wider">{l}</div>
      </div>
    ))}
  </div>
);

const BoldStackStyle = () => (
  <div className="flex items-center justify-center gap-4">
    {[
      { v: demoTime.days, l: 'DAYS' },
      { v: demoTime.hours, l: 'HRS' },
      { v: demoTime.mins, l: 'MIN' },
      { v: demoTime.secs, l: 'SEC' },
    ].map(({ v, l }) => (
      <div key={l} className="text-center">
        <div className="text-3xl font-black font-mono leading-none">{pad(v)}</div>
        <div className="text-[8px] font-bold tracking-[0.3em] text-muted-foreground mt-1">{l}</div>
      </div>
    ))}
  </div>
);

const LEDDotsStyle = () => (
  <div className="bg-zinc-950 rounded-lg px-4 py-3 flex items-center justify-center gap-1">
    <span className="font-mono text-2xl tracking-widest font-bold" style={{ color: '#22c55e', textShadow: '0 0 8px rgba(34,197,94,0.5)' }}>
      {pad(demoTime.days)}:{pad(demoTime.hours)}:{pad(demoTime.mins)}:{pad(demoTime.secs)}
    </span>
  </div>
);

const ElegantSerifStyle = () => (
  <div className="flex items-center justify-center gap-5">
    {[
      { v: demoTime.days, l: 'Days' },
      { v: demoTime.hours, l: 'Hours' },
      { v: demoTime.mins, l: 'Minutes' },
      { v: demoTime.secs, l: 'Seconds' },
    ].map(({ v, l }, i) => (
      <div key={l} className="flex items-center gap-5">
        <div className="text-center">
          <div className="text-2xl font-light" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>{pad(v)}</div>
          <div className="text-[9px] tracking-[0.15em] text-muted-foreground italic">{l}</div>
        </div>
        {i < 3 && <div className="w-px h-8 bg-border/60" />}
      </div>
    ))}
  </div>
);

const NeonGlowStyle = () => (
  <div className="bg-zinc-950 rounded-xl px-5 py-3 flex items-center justify-center gap-3">
    {[demoTime.days, demoTime.hours, demoTime.mins, demoTime.secs].map((v, i) => (
      <div key={i} className="flex items-center gap-3">
        <span className="text-2xl font-bold font-mono" style={{ color: '#f472b6', textShadow: '0 0 10px rgba(244,114,182,0.7), 0 0 30px rgba(244,114,182,0.3)' }}>
          {pad(v)}
        </span>
        {i < 3 && <span className="text-lg" style={{ color: '#f472b6', opacity: 0.4 }}>:</span>}
      </div>
    ))}
  </div>
);

const STYLE_RENDERERS: Record<string, React.FC> = {
  default: ClassicStyle,
  cards: CardBlocksStyle,
  flip: FlipClockStyle,
  circles: RadialStyle,
  minimal: MinimalLineStyle,
  gradient: GradientGlassStyle,
  bold: BoldStackStyle,
  dots: LEDDotsStyle,
  elegant: ElegantSerifStyle,
  neon: NeonGlowStyle,
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
          Choose from 10 unique countdown display styles. Click any option to preview it.
        </p>
      </div>

      {/* Live preview */}
      <Card className="border-primary/20 bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Live Preview</CardTitle>
            <Badge variant="secondary" className="text-xs">{STYLE_OPTIONS.find(s => s.id === selected)?.name}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-background rounded-xl border border-border p-6 space-y-3">
            {/* Simulated header */}
            <div className="flex items-center justify-center gap-2 text-sm font-medium" style={{ color: '#1a1a1a' }}>
              <Church className="w-4 h-4" style={{ color: '#6366f1' }} />
              <span>Next Event</span>
            </div>
            {/* Countdown digits */}
            <div className="py-2">
              {STYLE_RENDERERS[selected]?.({}) ?? null}
            </div>
            {/* Simulated date */}
            <p className="text-center text-xs text-muted-foreground">Sunday Morning Worship — March 8, 2026 at 10:00 AM</p>
          </div>
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
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
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
                <div className="rounded-lg bg-background border border-border/50 p-3 flex items-center justify-center min-h-[56px] overflow-hidden scale-[0.85] origin-center">
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
