/**
 * Counter Size Showcase
 * 6 visual concepts for enriching the Counter Size settings area.
 * Access via ?showcase=counter-size
 */

import { useState } from "react";
import { Maximize2, Ruler, Move, RatioIcon, SlidersHorizontal, Box } from "lucide-react";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import ServiceCountdownWidget, { defaultCountdownConfig } from "./ServiceCountdownWidget";

const MiniPreview = ({ style }: { style?: React.CSSProperties }) => (
  <div className="rounded-lg border border-border overflow-hidden bg-muted/20 p-3 flex justify-center">
    <div style={style}>
      <ServiceCountdownWidget config={defaultCountdownConfig} />
    </div>
  </div>
);

// ─── Option 1: Unified Scale + Dimensions Panel ───
const Option1 = () => {
  const [scale, setScale] = useState(100);
  const [balance, setBalance] = useState(50);
  const [maxWidth, setMaxWidth] = useState(800);
  const [unit, setUnit] = useState<"px" | "%">("px");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Maximize2 className="w-4 h-4" />
          Option 1 — Scale + Max Width
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Keeps the existing scale slider + balance, adds a max-width constraint with px/% toggle
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Scale */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Overall Scale</Label>
            <span className="text-sm font-medium text-primary tabular-nums">{scale}%</span>
          </div>
          <Slider value={[scale]} onValueChange={(v) => setScale(v[0])} min={50} max={200} step={5} />
        </div>

        {/* Header/Digits Balance */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Header / Digits Balance</Label>
            <span className="text-xs text-muted-foreground tabular-nums">
              {balance === 50 ? 'Balanced' : balance < 50 ? `Header +${50 - balance}%` : `Digits +${balance - 50}%`}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider w-12 text-right">Header</span>
            <Slider value={[balance]} onValueChange={(v) => setBalance(v[0])} min={0} max={100} step={2} className="flex-1" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider w-12">Digits</span>
          </div>
        </div>

        {/* Max Width */}
        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Max Width</Label>
            <ToggleGroup type="single" value={unit} onValueChange={(v) => v && setUnit(v as "px" | "%")} size="sm" className="bg-muted rounded-lg p-0.5">
              <ToggleGroupItem value="px" className="text-xs px-2 h-7 rounded-md data-[state=on]:bg-background data-[state=on]:shadow-sm">px</ToggleGroupItem>
              <ToggleGroupItem value="%" className="text-xs px-2 h-7 rounded-md data-[state=on]:bg-background data-[state=on]:shadow-sm">%</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex items-center gap-3">
            <Slider
              value={[unit === "px" ? maxWidth : Math.round(maxWidth / 8)]}
              onValueChange={(v) => setMaxWidth(unit === "px" ? v[0] : v[0] * 8)}
              min={unit === "px" ? 300 : 30}
              max={unit === "px" ? 1200 : 100}
              step={unit === "px" ? 10 : 5}
              className="flex-1"
            />
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={unit === "px" ? maxWidth : Math.round(maxWidth / 8)}
                onChange={(e) => setMaxWidth(unit === "px" ? Number(e.target.value) : Number(e.target.value) * 8)}
                className="w-20 h-8 text-sm text-right"
              />
              <span className="text-xs text-muted-foreground w-6">{unit}</span>
            </div>
          </div>
        </div>

        <MiniPreview style={{ maxWidth: `${maxWidth}px`, transform: `scale(${scale / 100})`, transformOrigin: 'top center', width: '100%' }} />
      </CardContent>
    </Card>
  );
};

// ─── Option 2: Width × Height with Aspect Ratio Lock ───
const Option2 = () => {
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(200);
  const [lockRatio, setLockRatio] = useState(false);
  const ratio = 600 / 200;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Box className="w-4 h-4" />
          Option 2 — Width × Height with Lock
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Explicit pixel dimensions with optional aspect-ratio lock. Familiar to designers.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm">Width (px)</Label>
            <Input
              type="number"
              value={width}
              onChange={(e) => {
                const w = Number(e.target.value);
                setWidth(w);
                if (lockRatio) setHeight(Math.round(w / ratio));
              }}
              className="h-9"
            />
            <Slider value={[width]} onValueChange={(v) => { setWidth(v[0]); if (lockRatio) setHeight(Math.round(v[0] / ratio)); }} min={200} max={1200} step={10} />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Height (px)</Label>
            <Input
              type="number"
              value={height}
              onChange={(e) => {
                const h = Number(e.target.value);
                setHeight(h);
                if (lockRatio) setWidth(Math.round(h * ratio));
              }}
              className="h-9"
            />
            <Slider value={[height]} onValueChange={(v) => { setHeight(v[0]); if (lockRatio) setWidth(Math.round(v[0] * ratio)); }} min={80} max={500} step={5} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Switch checked={lockRatio} onCheckedChange={setLockRatio} />
          <Label className="text-sm flex items-center gap-1.5">
            <RatioIcon className="w-3.5 h-3.5" />
            Lock aspect ratio
          </Label>
        </div>

        <MiniPreview style={{ width: `${width}px`, height: `${height}px`, overflow: 'hidden', margin: '0 auto' }} />
      </CardContent>
    </Card>
  );
};

// ─── Option 3: Preset Sizes + Custom ───
const Option3 = () => {
  const [preset, setPreset] = useState<string>("medium");
  const [customWidth, setCustomWidth] = useState(600);
  const presets = {
    compact: { label: "Compact", width: 360, desc: "Sidebar / widget area" },
    medium: { label: "Medium", width: 600, desc: "Content column" },
    large: { label: "Large", width: 900, desc: "Full section" },
    full: { label: "Full Width", width: 1200, desc: "Edge to edge" },
    custom: { label: "Custom", width: customWidth, desc: "Set your own" },
  };
  const activeWidth = presets[preset as keyof typeof presets]?.width ?? 600;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <SlidersHorizontal className="w-4 h-4" />
          Option 3 — Preset Sizes
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Quick-pick common sizes with optional custom override. Best for non-technical users.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(presets).map(([key, { label, desc }]) => (
            <button
              key={key}
              onClick={() => setPreset(key)}
              className={`rounded-xl border p-3 text-left transition-all ${
                preset === key
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/30 hover:bg-muted/30'
              }`}
            >
              <span className={`text-xs font-semibold ${preset === key ? 'text-primary' : 'text-foreground'}`}>{label}</span>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{desc}</p>
            </button>
          ))}
        </div>

        {preset === "custom" && (
          <div className="flex items-center gap-3 pl-1">
            <Label className="text-sm w-16">Width</Label>
            <Slider value={[customWidth]} onValueChange={(v) => setCustomWidth(v[0])} min={200} max={1200} step={10} className="flex-1" />
            <Input type="number" value={customWidth} onChange={(e) => setCustomWidth(Number(e.target.value))} className="w-20 h-8 text-sm text-right" />
            <span className="text-xs text-muted-foreground">px</span>
          </div>
        )}

        <MiniPreview style={{ maxWidth: `${activeWidth}px`, margin: '0 auto', width: '100%' }} />
      </CardContent>
    </Card>
  );
};

// ─── Option 4: Visual Resize Handle ───
const Option4 = () => {
  const [width, setWidth] = useState(600);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Move className="w-4 h-4" />
          Option 4 — Drag to Resize
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          A visual resize handle on the preview itself. Users drag to see the result live. Most intuitive.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Slider value={[width]} onValueChange={(v) => setWidth(v[0])} min={280} max={1000} step={10} className="flex-1" />
          <span className="text-sm font-mono text-muted-foreground tabular-nums w-16 text-right">{width}px</span>
        </div>

        <div className="relative bg-muted/20 rounded-lg border border-border p-4 flex justify-center">
          <div
            className="relative border-2 border-dashed border-primary/30 rounded-lg p-4 transition-all"
            style={{ width: `${width}px`, maxWidth: '100%' }}
          >
            <ServiceCountdownWidget config={defaultCountdownConfig} />
            {/* Resize grip indicator */}
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-10 bg-primary/10 border border-primary/30 rounded-md flex items-center justify-center cursor-ew-resize">
              <div className="flex flex-col gap-0.5">
                <div className="w-0.5 h-3 bg-primary/40 rounded-full" />
                <div className="w-0.5 h-3 bg-primary/40 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          In the actual settings, the edge handle would be draggable
        </p>
      </CardContent>
    </Card>
  );
};

// ─── Option 5: Font Size Controls (Header + Digits independently) ───
const Option5 = () => {
  const [headerSize, setHeaderSize] = useState(18);
  const [digitSize, setDigitSize] = useState(48);
  const [labelSize, setLabelSize] = useState(10);
  const [maxWidth, setMaxWidth] = useState(700);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Ruler className="w-4 h-4" />
          Option 5 — Granular Typography + Width
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Separate font size controls for header, digits, and labels — plus a max-width. Maximum control for power users.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Header Text</Label>
              <span className="text-xs text-muted-foreground tabular-nums">{headerSize}px</span>
            </div>
            <Slider value={[headerSize]} onValueChange={(v) => setHeaderSize(v[0])} min={10} max={32} step={1} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Digit Size</Label>
              <span className="text-xs text-muted-foreground tabular-nums">{digitSize}px</span>
            </div>
            <Slider value={[digitSize]} onValueChange={(v) => setDigitSize(v[0])} min={20} max={96} step={2} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Label Size</Label>
              <span className="text-xs text-muted-foreground tabular-nums">{labelSize}px</span>
            </div>
            <Slider value={[labelSize]} onValueChange={(v) => setLabelSize(v[0])} min={6} max={18} step={1} />
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Max Width</Label>
            <span className="text-xs text-muted-foreground tabular-nums">{maxWidth}px</span>
          </div>
          <Slider value={[maxWidth]} onValueChange={(v) => setMaxWidth(v[0])} min={280} max={1200} step={10} />
        </div>

        <div className="rounded-lg border border-border bg-muted/20 p-4 flex justify-center">
          <div style={{ maxWidth: `${maxWidth}px`, width: '100%' }}>
            {/* Simulated custom-sized counter */}
            <div className="w-full rounded-2xl p-6 text-center bg-background border border-border">
              <div className="flex items-center justify-center flex-wrap gap-2 mb-1">
                <span className="font-semibold" style={{ fontSize: `${headerSize}px` }}>Next Service:</span>
                <span className="text-muted-foreground" style={{ fontSize: `${headerSize}px` }}>May 25, 2025</span>
              </div>
              <p className="italic text-muted-foreground mb-6" style={{ fontSize: `${headerSize - 2}px` }}>Sunday Morning Worship</p>
              <div className="flex justify-center items-center gap-1">
                {[{ v: "12", l: "Days" }, { v: "08", l: "Hours" }, { v: "45", l: "Minutes" }, { v: "23", l: "Seconds" }].map((u, i) => (
                  <div key={u.l} className="flex items-center">
                    <div className="flex flex-col items-center" style={{ minWidth: `${digitSize * 1.2}px` }}>
                      <span className="tabular-nums leading-none text-foreground" style={{ fontSize: `${digitSize}px`, fontWeight: 900 }}>{u.v}</span>
                      <span className="uppercase tracking-wider text-muted-foreground" style={{ fontSize: `${labelSize}px`, marginTop: '6px' }}>{u.l}</span>
                    </div>
                    {i < 3 && <span className="font-light text-border" style={{ fontSize: `${digitSize * 0.6}px`, marginTop: `-${digitSize * 0.3}px` }}>:</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Option 6: Compact All-in-One Panel ───
const Option6 = () => {
  const [scale, setScale] = useState(100);
  const [balance, setBalance] = useState(50);
  const [maxWidth, setMaxWidth] = useState(800);
  const [minHeight, setMinHeight] = useState(0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <SlidersHorizontal className="w-4 h-4" />
          Option 6 — Compact Unified Panel
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Everything in a dense, single panel. All controls visible at once without scrolling. Good for power users who want quick access.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {/* Scale */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Scale</Label>
              <span className="text-[11px] font-mono text-primary">{scale}%</span>
            </div>
            <Slider value={[scale]} onValueChange={(v) => setScale(v[0])} min={50} max={200} step={5} />
          </div>

          {/* Max Width */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Max Width</Label>
              <div className="flex items-center gap-1">
                <Input type="number" value={maxWidth} onChange={(e) => setMaxWidth(Number(e.target.value))} className="w-16 h-6 text-[11px] text-right px-1.5" />
                <span className="text-[10px] text-muted-foreground">px</span>
              </div>
            </div>
            <Slider value={[maxWidth]} onValueChange={(v) => setMaxWidth(v[0])} min={280} max={1200} step={10} />
          </div>

          {/* Balance */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Header / Digits</Label>
              <span className="text-[10px] text-muted-foreground tabular-nums">
                {balance === 50 ? 'Even' : balance < 50 ? `H+${50 - balance}` : `D+${balance - 50}`}
              </span>
            </div>
            <Slider value={[balance]} onValueChange={(v) => setBalance(v[0])} min={0} max={100} step={2} />
          </div>

          {/* Min Height */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Min Height</Label>
              <div className="flex items-center gap-1">
                <Input type="number" value={minHeight} onChange={(e) => setMinHeight(Number(e.target.value))} className="w-16 h-6 text-[11px] text-right px-1.5" />
                <span className="text-[10px] text-muted-foreground">px</span>
              </div>
            </div>
            <Slider value={[minHeight]} onValueChange={(v) => setMinHeight(v[0])} min={0} max={400} step={10} />
          </div>
        </div>

        <MiniPreview style={{
          maxWidth: `${maxWidth}px`,
          minHeight: minHeight > 0 ? `${minHeight}px` : undefined,
          transform: `scale(${scale / 100})`,
          transformOrigin: 'top center',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }} />
      </CardContent>
    </Card>
  );
};

// ─── Showcase Wrapper ───
const CounterSizeShowcase = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Counter Size Settings — Design Options</h1>
          <p className="text-muted-foreground">
            6 concepts for enriching the Counter Size area with more granular controls (width, height, typography).
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Note: The "Overall Scale" and "Header/Digits Balance" already exist. These options explore how to extend them.
          </p>
        </div>

        <Option1 />
        <Option2 />
        <Option3 />
        <Option4 />
        <Option5 />
        <Option6 />
      </div>
    </div>
  );
};

export default CounterSizeShowcase;
