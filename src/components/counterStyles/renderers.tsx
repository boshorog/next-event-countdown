import React from 'react';
import { CalendarDays, Clock } from 'lucide-react';
import type { CounterStyleRenderProps } from './types';

const pad = (n: number) => String(n).padStart(2, '0');

function getUnits(p: CounterStyleRenderProps) {
  return [
    { v: p.days, l: p.labelDays },
    { v: p.hours, l: p.labelHours },
    { v: p.minutes, l: p.labelMinutes },
    { v: p.seconds, l: p.labelSeconds },
  ];
}

// ─── Classic (default/free) ───
export const ClassicRenderer: React.FC<CounterStyleRenderProps> = (p) => {
  const Icon = p.icon;
  const units = getUnits(p);
  return (
    <div className="w-full rounded-2xl p-6 text-center bg-background">
      <div className="flex items-center justify-center flex-wrap gap-2 mb-1">
        <Icon className="w-5 h-5" style={{ color: p.iconColor }} />
        <span className="font-semibold text-sm text-foreground">{p.headerLabel}:</span>
        <span className="text-sm text-muted-foreground">{p.eventDate}</span>
      </div>
      <p className="italic text-sm text-muted-foreground mb-6">{p.eventTitle}</p>
      <div className="flex justify-center items-center gap-1">
        {units.map((u, i) => (
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
};

// ─── Card Blocks ───
export const CardBlocksRenderer: React.FC<CounterStyleRenderProps> = (p) => {
  const Icon = p.icon;
  const units = getUnits(p);
  return (
    <div className="w-full rounded-2xl p-6 text-center bg-background">
      <div className="flex items-center justify-center gap-2 mb-1">
        <Icon className="w-5 h-5" style={{ color: p.iconColor }} />
        <span className="font-semibold text-sm text-foreground">{p.headerLabel}</span>
      </div>
      <p className="text-xs text-muted-foreground mb-5">{p.eventTitle}</p>
      <div className="grid grid-cols-4 gap-2 mb-4 max-w-[280px] mx-auto">
        {units.map((u) => (
          <div key={u.l} className="bg-muted/60 rounded-xl py-3 flex flex-col items-center justify-center shadow-sm">
            <div className="text-2xl font-bold font-mono text-foreground tabular-nums">{pad(u.v)}</div>
            <div className="text-[8px] uppercase tracking-[0.15em] text-muted-foreground mt-1">{u.l}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <CalendarDays className="w-3 h-3" />
        <span>{p.eventDate}</span>
      </div>
    </div>
  );
};

// ─── Radial Progress ───
export const RadialRenderer: React.FC<CounterStyleRenderProps> = (p) => {
  const Icon = p.icon;
  const items = [
    { v: p.days, l: p.labelDays, max: 30 },
    { v: p.hours, l: p.labelHours, max: 24 },
    { v: p.minutes, l: p.labelMinutes, max: 60 },
    { v: p.seconds, l: p.labelSeconds, max: 60 },
  ];
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="w-full rounded-2xl p-6 text-center bg-background">
      <div className="flex items-center justify-center gap-2 mb-0.5">
        <Icon className="w-5 h-5" style={{ color: p.iconColor }} />
        <span className="font-semibold text-sm text-foreground">{p.headerLabel}</span>
      </div>
      <p className="text-xs text-muted-foreground italic mb-5">{p.eventTitle}</p>
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
      <p className="text-xs text-muted-foreground">{p.eventDate}</p>
    </div>
  );
};

// ─── Gradient Glass ───
export const GradientGlassRenderer: React.FC<CounterStyleRenderProps> = (p) => {
  const Icon = p.icon;
  const units = getUnits(p);
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-border">
      <div className="px-5 py-3 flex items-center gap-2" style={{ background: `linear-gradient(135deg, ${p.iconColor}, ${p.iconColor}cc)` }}>
        <Icon className="w-4 h-4 text-white/90" />
        <span className="text-sm font-semibold text-white">{p.headerLabel}</span>
        <span className="text-xs text-white/70 ml-auto">{p.eventTitle}</span>
      </div>
      <div className="bg-background p-5 space-y-4">
        <div className="flex items-center justify-center gap-2">
          {units.map((u) => (
            <div key={u.l} className="rounded-xl px-3 py-2.5 text-center min-w-[52px]" style={{ background: `linear-gradient(135deg, ${p.iconColor}1a, ${p.iconColor}1a)` }}>
              <div className="text-xl font-bold font-mono text-primary">{pad(u.v)}</div>
              <div className="text-[8px] text-muted-foreground uppercase tracking-wider mt-0.5">{u.l}</div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground">{p.eventDate}</p>
      </div>
    </div>
  );
};

// ─── Bold Stack ───
export const BoldStackRenderer: React.FC<CounterStyleRenderProps> = (p) => {
  const Icon = p.icon;
  const units = getUnits(p);
  return (
    <div className="w-full rounded-2xl p-6 bg-background text-center">
      <Icon className="w-6 h-6 mx-auto mb-2" style={{ color: p.iconColor }} />
      <h3 className="text-lg font-black text-foreground tracking-tight">{p.eventTitle}</h3>
      <p className="text-xs text-muted-foreground mb-5">{p.headerLabel} · {p.eventDate}</p>
      <div className="flex items-center justify-center gap-5">
        {units.map((u) => (
          <div key={u.l} className="text-center">
            <div className="text-4xl font-black font-mono leading-none text-foreground">{pad(u.v)}</div>
            <div className="text-[7px] font-bold tracking-[0.3em] text-muted-foreground mt-1.5 uppercase">{u.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── LED Dots ───
export const LEDDotsRenderer: React.FC<CounterStyleRenderProps> = (p) => {
  const units = getUnits(p);
  return (
    <div className="w-full rounded-2xl overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="px-5 py-2.5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(34,197,94,0.15)' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.5)' }} />
          <span className="text-xs font-mono" style={{ color: '#22c55e' }}>{p.headerLabel.toUpperCase()}</span>
        </div>
        <span className="text-[10px] font-mono" style={{ color: 'rgba(34,197,94,0.5)' }}>{p.eventTitle}</span>
      </div>
      <div className="px-5 py-5 text-center">
        <div className="font-mono text-3xl tracking-[0.15em] font-bold" style={{ color: '#22c55e', textShadow: '0 0 10px rgba(34,197,94,0.4)' }}>
          {pad(p.days)}:{pad(p.hours)}:{pad(p.minutes)}:{pad(p.seconds)}
        </div>
        <div className="flex justify-center gap-8 mt-2">
          {units.map((u) => (
            <span key={u.l} className="text-[8px] font-mono tracking-widest uppercase" style={{ color: 'rgba(34,197,94,0.35)' }}>{u.l}</span>
          ))}
        </div>
      </div>
      <div className="px-5 py-2 text-center" style={{ borderTop: '1px solid rgba(34,197,94,0.1)' }}>
        <span className="text-[10px] font-mono" style={{ color: 'rgba(34,197,94,0.4)' }}>{p.eventDate}</span>
      </div>
    </div>
  );
};

// ─── Elegant Serif ───
export const ElegantSerifRenderer: React.FC<CounterStyleRenderProps> = (p) => {
  const Icon = p.icon;
  const units = getUnits(p);
  return (
    <div className="w-full rounded-2xl p-6 bg-background">
      <div className="flex items-center gap-8">
        {/* Right-aligned header info */}
        <div className="flex flex-col items-end text-right flex-shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <Icon className="w-4 h-4" style={{ color: p.iconColor }} />
            <span className="text-sm" style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 600, color: 'inherit' }}>{p.headerLabel}</span>
          </div>
          <p className="text-xs italic text-muted-foreground mb-1">{p.eventTitle}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground italic">
            <CalendarDays className="w-3 h-3" />
            <span>{p.eventDate}</span>
          </div>
        </div>
        {/* Divider */}
        <div className="w-px h-16 bg-border/50 flex-shrink-0" />
        {/* Counter */}
        <div className="flex items-center gap-5 flex-1">
          {units.map((u, i) => (
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
    </div>
  );
};

// ─── Renderer Map ───
export const STYLE_RENDERERS: Record<string, React.FC<CounterStyleRenderProps>> = {
  default: ClassicRenderer,
  cards: CardBlocksRenderer,
  circles: RadialRenderer,
  gradient: GradientGlassRenderer,
  bold: BoldStackRenderer,
  dots: LEDDotsRenderer,
  elegant: ElegantSerifRenderer,
};
