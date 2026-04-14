import React from 'react';
import { Clock } from 'lucide-react';
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

const elOff = (el: string): React.CSSProperties => ({
  transform: `translate(var(--el-${el}-x, 0px), var(--el-${el}-y, 0px))`,
});

// ─── Classic (default/free) ───
export const ClassicRenderer: React.FC<CounterStyleRenderProps> = (p) => {
  const Icon = p.icon;
  const units = getUnits(p);
  return (
    <div className="w-full rounded-2xl p-6 text-center bg-background">
      {p.showHeader !== false && (
        <div className="flex items-center justify-center flex-wrap gap-2 mb-1" style={elOff('header')}>
          <Icon className="w-5 h-5" style={{ color: p.iconColor }} />
          <span className="font-semibold text-foreground" style={{ fontSize: 'var(--header-font-size, 14px)' }}>{p.headerLabel}:</span>
          {p.showDate !== false && (
            <span className="text-muted-foreground" style={{ fontSize: 'var(--header-font-size, 14px)' }}>{p.eventDate}</span>
          )}
        </div>
      )}
      {p.showTitle !== false && (
        <p className="italic text-muted-foreground mb-6" style={{ fontSize: 'var(--header-font-size, 14px)', ...elOff('title') }}>{p.eventTitle}</p>
      )}
      <div className="flex justify-center items-center gap-1" style={elOff('digits')}>
        {units.map((u, i) => (
          <div key={u.l} className="flex items-center">
            <div className="flex flex-col items-center" style={{ minWidth: 56 }}>
              <span className="tabular-nums leading-none text-foreground" style={{ fontWeight: 900, fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: 'var(--digit-font-size, 36px)' }}>{pad(u.v)}</span>
              <span className="uppercase tracking-wider text-muted-foreground" style={{ marginTop: '6px', fontSize: 'var(--label-font-size, 9px)' }}>{u.l}</span>
            </div>
            {i < 3 && (
              <span
                className="font-light text-border"
                style={{ marginTop: '-16px', marginLeft: '2px', marginRight: '2px', fontSize: 'var(--separator-font-size, calc(var(--digit-font-size, 36px) * 0.67))' }}
              >:</span>
            )}
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
      {p.showHeader !== false && (
        <div className="flex items-center justify-center gap-2 mb-1" style={elOff('header')}>
          <Icon className="w-5 h-5" style={{ color: p.iconColor }} />
          <span className="font-semibold text-foreground" style={{ fontSize: 'var(--header-font-size, 14px)' }}>{p.headerLabel}</span>
        </div>
      )}
      {p.showTitle !== false && (
        <p className="text-muted-foreground mb-5" style={{ fontSize: 'calc(var(--header-font-size, 14px) * 0.85)', ...elOff('title') }}>{p.eventTitle}</p>
      )}
      <div className="grid grid-cols-4 gap-2 mb-4 max-w-[280px] mx-auto" style={elOff('digits')}>
        {units.map((u) => (
          <div key={u.l} className="bg-muted/60 rounded-xl py-3 flex flex-col items-center justify-center shadow-sm">
            <div className="font-bold font-mono text-foreground tabular-nums" style={{ fontSize: 'var(--digit-font-size, 24px)' }}>{pad(u.v)}</div>
            <div className="uppercase text-muted-foreground mt-1" style={{ fontSize: 'var(--label-font-size, 8px)', letterSpacing: '0.15em' }}>{u.l}</div>
          </div>
        ))}
      </div>
      {p.showDate !== false && (
        <div className="flex items-center justify-center gap-1.5 text-muted-foreground" style={{ fontSize: 'var(--label-font-size, 8px)', ...elOff('date') }}>
          <Clock className="w-3 h-3" />
          <span>{p.eventDate}</span>
        </div>
      )}
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
      {p.showHeader !== false && (
        <div className="flex items-center justify-center gap-2 mb-0.5" style={elOff('header')}>
          <Icon className="w-5 h-5" style={{ color: p.iconColor }} />
          <span className="font-semibold text-foreground" style={{ fontSize: 'var(--header-font-size, 14px)' }}>{p.headerLabel}</span>
        </div>
      )}
      {p.showTitle !== false && (
        <p className="text-muted-foreground italic mb-5" style={{ fontSize: 'calc(var(--header-font-size, 14px) * 0.85)', ...elOff('title') }}>{p.eventTitle}</p>
      )}
      <div className="flex items-center justify-center gap-5 mb-4" style={{ ...elOff('digits'), ['--radial-size' as any]: '80px' }}>
        <style>{`
          @media (max-width: 480px) {
            .radial-grid { gap: 8px !important; }
            .radial-grid .radial-item { width: 68px !important; height: 68px !important; }
            .radial-grid .radial-item svg { width: 68px !important; height: 68px !important; }
            .radial-grid .radial-label { font-size: 6px !important; }
          }
        `}</style>
        {items.map(({ v, l, max }) => {
          const pct = (v / max) * 100;
          return (
            <div key={l} className="radial-item relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80" style={{ width: '100%', height: '100%' }}>
                <circle cx="40" cy="40" r={r} fill="none" stroke="currentColor" strokeWidth="3" className="text-muted/30" />
                <circle cx="40" cy="40" r={r} fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${c}`} strokeDashoffset={`${c - (c * pct) / 100}`} strokeLinecap="round" className="text-primary" />
              </svg>
              <div className="text-center z-10">
                <div className="font-bold font-mono leading-none text-foreground" style={{ fontSize: 'var(--digit-font-size, 20px)' }}>{v}</div>
                <div className="radial-label uppercase tracking-wider text-muted-foreground mt-1" style={{ fontSize: 'var(--label-font-size, 8px)' }}>{l}</div>
              </div>
            </div>
          );
        })}
      </div>
      {p.showDate !== false && (
        <p className="text-muted-foreground" style={{ fontSize: 'var(--label-font-size, 12px)', ...elOff('date') }}>{p.eventDate}</p>
      )}
    </div>
  );
};

// ─── Gradient Glass ───
export const GradientGlassRenderer: React.FC<CounterStyleRenderProps> = (p) => {
  const Icon = p.icon;
  const units = getUnits(p);
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-border max-w-sm mx-auto">
      {p.showHeader !== false && (
        <div className="px-5 py-3 flex items-center gap-2" style={{ background: `linear-gradient(135deg, ${p.iconColor}, ${p.iconColor}cc)`, ...elOff('header') }}>
          <Icon className="w-4 h-4 text-white/90" />
          <span className="font-semibold text-white" style={{ fontSize: 'var(--header-font-size, 14px)' }}>{p.headerLabel}</span>
          {p.showTitle !== false && (
            <span className="text-white/70 ml-auto" style={{ fontSize: 'calc(var(--header-font-size, 14px) * 0.85)' }}>{p.eventTitle}</span>
          )}
        </div>
      )}
      <div className="bg-background p-5 space-y-4">
        <div className="flex items-center justify-center gap-2" style={elOff('digits')}>
          {units.map((u) => (
            <div key={u.l} className="rounded-xl px-3 py-2.5 text-center min-w-[52px]" style={{ background: `linear-gradient(135deg, ${p.iconColor}1a, ${p.iconColor}1a)` }}>
              <div className="font-bold font-mono text-primary" style={{ fontSize: 'var(--digit-font-size, 20px)' }}>{pad(u.v)}</div>
              <div className="text-muted-foreground uppercase tracking-wider mt-0.5" style={{ fontSize: 'var(--label-font-size, 8px)' }}>{u.l}</div>
            </div>
          ))}
        </div>
        {p.showDate !== false && (
          <p className="text-center text-muted-foreground" style={{ fontSize: 'var(--label-font-size, 12px)', ...elOff('date') }}>{p.eventDate}</p>
        )}
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
      {p.showHeader !== false && (
        <div style={elOff('header')}>
          <Icon className="w-6 h-6 mx-auto mb-2" style={{ color: p.iconColor }} />
        </div>
      )}
      {(p.showHeader !== false || p.showDate !== false) && (
        <p className="text-muted-foreground mb-1" style={{ fontSize: 'calc(var(--header-font-size, 14px) * 0.85)', ...elOff('date') }}>
          {p.showHeader !== false && p.headerLabel}{p.showHeader !== false && p.showDate !== false && ' · '}{p.showDate !== false && p.eventDate}
        </p>
      )}
      {p.showTitle !== false && (
        <h3 className="font-black text-foreground tracking-tight mb-5" style={{ fontSize: 'var(--header-font-size, 18px)', ...elOff('title') }}>{p.eventTitle}</h3>
      )}
      <div className="flex items-center justify-center gap-5" style={elOff('digits')}>
        {units.map((u) => (
          <div key={u.l} className="text-center">
            <div className="font-black font-mono leading-none text-foreground" style={{ fontSize: 'var(--digit-font-size, 36px)' }}>{pad(u.v)}</div>
            <div className="font-bold text-muted-foreground mt-1.5 uppercase" style={{ fontSize: 'var(--label-font-size, 7px)', letterSpacing: '0.3em' }}>{u.l}</div>
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
    <div className="w-full rounded-2xl overflow-hidden max-w-sm mx-auto" style={{ backgroundColor: '#0a0a0a' }}>
      {p.showHeader !== false && (
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(34,197,94,0.2)', ...elOff('header') }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.5)' }} />
            <span className="font-mono font-semibold" style={{ color: '#22c55e', fontSize: 'var(--header-font-size, 14px)' }}>{p.headerLabel.toUpperCase()}</span>
          </div>
          {p.showTitle !== false && (
            <span className="font-mono font-medium" style={{ color: 'rgba(34,197,94,0.85)', fontSize: 'calc(var(--header-font-size, 14px) * 0.85)' }}>{p.eventTitle}</span>
          )}
        </div>
      )}
      <div className="px-5 py-5 text-center">
        <div className="flex items-center justify-center max-w-[360px] mx-auto" style={elOff('digits')}>
          {units.map((u, i) => (
            <React.Fragment key={u.l}>
              <div className="flex flex-col items-center" style={{ minWidth: 56 }}>
                <div className="font-mono font-bold tabular-nums" style={{ color: '#22c55e', textShadow: '0 0 10px rgba(34,197,94,0.4)', fontSize: 'var(--digit-font-size, 30px)' }}>
                  {pad(u.v)}
                </div>
                <span className="font-mono tracking-widest uppercase mt-1.5" style={{ color: 'rgba(34,197,94,0.7)', fontSize: 'var(--label-font-size, 9px)' }}>{u.l}</span>
              </div>
              {i < 3 && (
                <span className="font-mono font-bold mx-1 self-start" style={{ color: '#22c55e', textShadow: '0 0 10px rgba(34,197,94,0.4)', lineHeight: '36px', fontSize: 'var(--separator-font-size, calc(var(--digit-font-size, 30px) * 0.8))' }}>:</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      {p.showDate !== false && (
        <div className="px-5 py-3 text-center" style={{ borderTop: '1px solid rgba(34,197,94,0.2)', ...elOff('date') }}>
          <span className="font-mono font-medium" style={{ color: 'rgba(34,197,94,0.7)', fontSize: 'var(--label-font-size, 12px)' }}>{p.eventDate}</span>
        </div>
      )}
    </div>
  );
};

// ─── Elegant Serif ───
export const ElegantSerifRenderer: React.FC<CounterStyleRenderProps> = (p) => {
  const Icon = p.icon;
  const units = getUnits(p);
  const showLeftPanel = p.showHeader !== false || p.showTitle !== false || p.showDate !== false;
  return (
    <div className="w-full rounded-2xl p-6 bg-background flex items-center justify-center">
      <style>{`
        @media (max-width: 480px) {
          .elegant-layout { flex-direction: column !important; gap: 16px !important; }
          .elegant-layout .elegant-left { text-align: center !important; align-items: center !important; }
          .elegant-layout .elegant-divider { width: 60% !important; height: 1px !important; }
          .elegant-layout .elegant-digits { gap: 12px !important; flex-wrap: wrap; justify-content: center !important; }
          .elegant-layout .elegant-digits .elegant-sep { height: 24px !important; }
        }
      `}</style>
      <div className="elegant-layout flex items-center gap-8">
        {showLeftPanel && (
          <>
            <div className="elegant-left flex flex-col items-end text-right flex-shrink-0">
              {p.showHeader !== false && (
                <div className="flex items-center gap-2 mb-1" style={elOff('header')}>
                  <Icon className="w-4 h-4" style={{ color: p.iconColor }} />
                  <span style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 600, color: 'inherit', fontSize: 'var(--header-font-size, 14px)' }}>{p.headerLabel}</span>
                </div>
              )}
              {p.showTitle !== false && (
                <p className="italic text-muted-foreground mb-1" style={{ fontSize: 'calc(var(--header-font-size, 14px) * 0.85)', ...elOff('title') }}>{p.eventTitle}</p>
              )}
              {p.showDate !== false && (
                <div className="flex items-center gap-1.5 text-muted-foreground italic" style={{ fontSize: 'var(--label-font-size, 11px)', ...elOff('date') }}>
                  <Clock className="w-3 h-3" />
                  <span>{p.eventDate}</span>
                </div>
              )}
            </div>
            <div className="elegant-divider w-px h-16 bg-border/50 flex-shrink-0" />
          </>
        )}
        <div className="elegant-digits flex items-center gap-5 flex-1" style={elOff('digits')}>
          {units.map((u, i) => (
            <div key={u.l} className="flex items-center gap-5">
              <div className="text-center">
                <div className="font-light text-foreground" style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'var(--digit-font-size, 30px)' }}>{pad(u.v)}</div>
                <div className="tracking-[0.15em] text-muted-foreground italic mt-1" style={{ fontSize: 'var(--label-font-size, 8px)' }}>{u.l}</div>
              </div>
              {i < 3 && <div className="elegant-sep w-px h-10 bg-border/50" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Loading Bar (Rounded Pill) ───
export const LoadingBarRenderer: React.FC<CounterStyleRenderProps> = (p) => {
  const Icon = p.icon;
  const units = getUnits(p);

  // Estimate progress: assume 30-day max
  const totalSec = p.days * 86400 + p.hours * 3600 + p.minutes * 60 + p.seconds;
  const maxSec = 30 * 86400;
  const pct = Math.min(100, Math.max(1, (totalSec / maxSec) * 100));

  return (
    <div className="w-full rounded-2xl p-6 bg-background text-center space-y-4">
      <style>{`
        @keyframes stripe-reverse { 0% { background-position: 40px 0; } 100% { background-position: 0 0; } }
        .stripe-bar-rev {
          animation: stripe-reverse 1s linear infinite;
          background-size: 40px 40px;
          background-image: linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);
        }
      `}</style>
      {p.showHeader !== false && (
        <div className="flex items-center justify-center gap-2" style={elOff('header')}>
          <Icon className="w-4 h-4" style={{ color: p.iconColor }} />
          <span className="font-semibold text-foreground" style={{ fontSize: 'var(--header-font-size, 14px)' }}>{p.headerLabel}</span>
        </div>
      )}
      {p.showTitle !== false && (
        <p className="text-muted-foreground" style={{ fontSize: 'calc(var(--header-font-size, 14px) * 0.85)', ...elOff('title') }}>{p.eventTitle}</p>
      )}
      <div className="flex items-center justify-center gap-3" style={elOff('digits')}>
        {units.map((u, i) => (
          <div key={u.l} className="flex items-center gap-3">
            <div className="flex flex-col items-center" style={{ minWidth: 52 }}>
              <span className="tabular-nums leading-none text-foreground" style={{ fontWeight: 700, fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace', fontSize: 'var(--digit-font-size, 36px)' }}>{pad(u.v)}</span>
              <span className="uppercase tracking-wider text-muted-foreground" style={{ marginTop: '6px', fontSize: 'var(--label-font-size, 8px)' }}>{u.l}</span>
            </div>
            {i < 3 && (
              <span
                className="text-muted-foreground/50"
                style={{
                  fontWeight: 600,
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
                  fontSize: 'var(--separator-font-size, calc(var(--digit-font-size, 36px) * 0.75))',
                  lineHeight: 1,
                  marginTop: '-14px',
                }}
              >:</span>
            )}
          </div>
        ))}
      </div>
      <div className="relative h-6 bg-muted rounded-full overflow-hidden" style={elOff('digits')}>
        <div
          className="stripe-bar-rev absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: p.iconColor }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" style={{ fontSize: 'var(--label-font-size, 10px)', fontWeight: 700, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>{Math.round(pct)}%</div>
      </div>
      {p.showDate !== false && (
        <p className="text-muted-foreground" style={{ fontSize: 'var(--label-font-size, 10px)', ...elOff('date') }}>{p.eventDate}</p>
      )}
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
  loadingbar: LoadingBarRenderer,
};
