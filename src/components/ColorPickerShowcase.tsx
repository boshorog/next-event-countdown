import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Pipette, Copy } from "lucide-react";

// ─── Helpers ───
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16); g = parseInt(hex[2] + hex[2], 16); b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16); g = parseInt(hex.slice(3, 5), 16); b = parseInt(hex.slice(5, 7), 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const PRESETS = [
  "#7C5CFC", "#6366F1", "#3B82F6", "#0EA5E9", "#14B8A6", "#22C55E",
  "#EAB308", "#F97316", "#EF4444", "#EC4899", "#A855F7", "#8B5CF6",
  "#0F172A", "#334155", "#64748B", "#94A3B8", "#E2E8F0", "#F8FAFC",
];

// ═══════════════════════════════════════════════════════
// VARIANT 1 — HSL Sliders + Preset Swatches
// ═══════════════════════════════════════════════════════
const Variant1 = ({ color, onChange }: { color: string; onChange: (c: string) => void }) => {
  const hsl = hexToHSL(color);
  const update = (key: "h" | "s" | "l", val: number) => {
    const next = { ...hsl, [key]: val };
    onChange(hslToHex(next.h, next.s, next.l));
  };

  return (
    <div className="space-y-5">
      {/* Preview + Hex */}
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-xl border border-border shadow-sm transition-colors" style={{ backgroundColor: color }} />
        <div className="flex-1 space-y-1">
          <Label className="text-xs text-muted-foreground">Hex Value</Label>
          <Input value={color} onChange={e => onChange(e.target.value)} className="h-8 text-sm font-mono" />
        </div>
      </div>

      {/* HSL Sliders */}
      <div className="space-y-3">
        {[
          { label: "Hue", key: "h" as const, max: 360, bg: "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)" },
          { label: "Saturation", key: "s" as const, max: 100, bg: `linear-gradient(to right, ${hslToHex(hsl.h, 0, hsl.l)}, ${hslToHex(hsl.h, 100, hsl.l)})` },
          { label: "Lightness", key: "l" as const, max: 100, bg: `linear-gradient(to right, #000000, ${hslToHex(hsl.h, hsl.s, 50)}, #ffffff)` },
        ].map(({ label, key, max, bg }) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between">
              <Label className="text-xs text-muted-foreground">{label}</Label>
              <span className="text-xs font-mono text-muted-foreground">{hsl[key]}</span>
            </div>
            <div className="relative h-3 rounded-full overflow-hidden border border-border">
              <div className="absolute inset-0 rounded-full" style={{ background: bg }} />
              <input
                type="range" min={0} max={max} value={hsl[key]}
                onChange={e => update(key, Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none"
                style={{ left: `calc(${(hsl[key] / max) * 100}% - 8px)`, backgroundColor: color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Presets */}
      <div>
        <Label className="text-xs text-muted-foreground mb-2 block">Presets</Label>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map(p => (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={cn(
                "w-7 h-7 rounded-lg border-2 transition-all flex items-center justify-center",
                color.toLowerCase() === p.toLowerCase()
                  ? "border-foreground scale-110 shadow-md"
                  : "border-transparent hover:border-border hover:scale-105"
              )}
              style={{ backgroundColor: p }}
            >
              {color.toLowerCase() === p.toLowerCase() && <Check className="w-3 h-3 text-white drop-shadow-md" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// VARIANT 2 — Saturation/Lightness Canvas + Hue Strip
// ═══════════════════════════════════════════════════════
const Variant2 = ({ color, onChange }: { color: string; onChange: (c: string) => void }) => {
  const hsl = hexToHSL(color);
  const canvasRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"canvas" | "hue" | null>(null);

  const handleCanvasMove = useCallback((clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const s = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const l = Math.max(0, Math.min(100, 100 - ((clientY - rect.top) / rect.height) * 100));
    // Convert SV-style to HSL
    const adjustedL = l * (1 - s / 200);
    const adjustedS = adjustedL === 0 || adjustedL === 100 ? 0 : ((l - adjustedL) / Math.min(adjustedL, 100 - adjustedL)) * 100;
    onChange(hslToHex(hsl.h, Math.round(Math.min(100, adjustedS)), Math.round(adjustedL)));
  }, [hsl.h, onChange]);

  const handleHueMove = useCallback((clientX: number) => {
    const rect = hueRef.current?.getBoundingClientRect();
    if (!rect) return;
    const h = Math.max(0, Math.min(360, ((clientX - rect.left) / rect.width) * 360));
    onChange(hslToHex(Math.round(h), hsl.s, hsl.l));
  }, [hsl.s, hsl.l, onChange]);

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      const y = "touches" in e ? e.touches[0].clientY : e.clientY;
      if (dragging === "canvas") handleCanvasMove(x, y);
      else handleHueMove(x);
    };
    const handleUp = () => setDragging(null);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [dragging, handleCanvasMove, handleHueMove]);

  // Calculate cursor position from HSL
  const cursorX = hsl.s;
  const cursorY = 100 - hsl.l - (hsl.s * hsl.l / 200);

  return (
    <div className="space-y-4">
      {/* SL Canvas */}
      <div
        ref={canvasRef}
        className="relative w-full h-40 rounded-xl overflow-hidden cursor-crosshair border border-border"
        style={{
          background: `
            linear-gradient(to bottom, transparent, #000),
            linear-gradient(to right, #fff, hsl(${hsl.h}, 100%, 50%))
          `,
        }}
        onMouseDown={e => { setDragging("canvas"); handleCanvasMove(e.clientX, e.clientY); }}
        onTouchStart={e => { setDragging("canvas"); handleCanvasMove(e.touches[0].clientX, e.touches[0].clientY); }}
      >
        <div
          className="absolute w-5 h-5 rounded-full border-2 border-white shadow-lg pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${Math.max(0, Math.min(100, cursorX))}%`,
            top: `${Math.max(0, Math.min(100, cursorY))}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {/* Hue Strip */}
      <div
        ref={hueRef}
        className="relative h-4 rounded-full overflow-hidden cursor-pointer border border-border"
        style={{ background: "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)" }}
        onMouseDown={e => { setDragging("hue"); handleHueMove(e.clientX); }}
        onTouchStart={e => { setDragging("hue"); handleHueMove(e.touches[0].clientX); }}
      >
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-lg pointer-events-none"
          style={{ left: `calc(${(hsl.h / 360) * 100}% - 10px)`, backgroundColor: `hsl(${hsl.h}, 100%, 50%)` }}
        />
      </div>

      {/* Output */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg border border-border shadow-sm" style={{ backgroundColor: color }} />
        <Input value={color} onChange={e => onChange(e.target.value)} className="h-8 text-sm font-mono flex-1" />
        <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => navigator.clipboard.writeText(color)}>
          <Copy className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// VARIANT 3 — Radial Color Wheel + Lightness Slider
// ═══════════════════════════════════════════════════════
const Variant3 = ({ color, onChange }: { color: string; onChange: (c: string) => void }) => {
  const hsl = hexToHSL(color);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [draggingWheel, setDraggingWheel] = useState(false);

  const handleWheelMove = useCallback((clientX: number, clientY: number) => {
    const rect = wheelRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
    const dist = Math.min(1, Math.sqrt(dx * dx + dy * dy) / (rect.width / 2));
    const sat = Math.round(dist * 100);
    onChange(hslToHex(Math.round(angle), sat, hsl.l));
  }, [hsl.l, onChange]);

  useEffect(() => {
    if (!draggingWheel) return;
    const move = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      const y = "touches" in e ? e.touches[0].clientY : e.clientY;
      handleWheelMove(x, y);
    };
    const up = () => setDraggingWheel(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); window.removeEventListener("touchmove", move); window.removeEventListener("touchend", up); };
  }, [draggingWheel, handleWheelMove]);

  // Cursor position on wheel
  const rad = (hsl.h * Math.PI) / 180;
  const dist = (hsl.s / 100) * 50; // % from center

  return (
    <div className="space-y-4">
      {/* Color wheel */}
      <div className="flex justify-center">
        <div
          ref={wheelRef}
          className="relative w-48 h-48 rounded-full cursor-crosshair border border-border"
          style={{
            background: `conic-gradient(from 0deg, 
              hsl(0, 100%, ${hsl.l}%), hsl(30, 100%, ${hsl.l}%), hsl(60, 100%, ${hsl.l}%), 
              hsl(90, 100%, ${hsl.l}%), hsl(120, 100%, ${hsl.l}%), hsl(150, 100%, ${hsl.l}%), 
              hsl(180, 100%, ${hsl.l}%), hsl(210, 100%, ${hsl.l}%), hsl(240, 100%, ${hsl.l}%), 
              hsl(270, 100%, ${hsl.l}%), hsl(300, 100%, ${hsl.l}%), hsl(330, 100%, ${hsl.l}%), 
              hsl(360, 100%, ${hsl.l}%))`,
          }}
          onMouseDown={e => { setDraggingWheel(true); handleWheelMove(e.clientX, e.clientY); }}
          onTouchStart={e => { setDraggingWheel(true); handleWheelMove(e.touches[0].clientX, e.touches[0].clientY); }}
        >
          {/* Radial saturation overlay: white center fading out */}
          <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, hsl(0,0%,${hsl.l}%) 0%, transparent 70%)` }} />
          {/* Cursor */}
          <div
            className="absolute w-5 h-5 rounded-full border-2 border-white shadow-lg pointer-events-none"
            style={{
              left: `calc(50% + ${dist * Math.cos(rad)}% - 10px)`,
              top: `calc(50% + ${dist * Math.sin(rad)}% - 10px)`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>

      {/* Lightness */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <Label className="text-xs text-muted-foreground">Lightness</Label>
          <span className="text-xs font-mono text-muted-foreground">{hsl.l}%</span>
        </div>
        <div className="relative h-3 rounded-full overflow-hidden border border-border">
          <div className="absolute inset-0" style={{ background: `linear-gradient(to right, #000, hsl(${hsl.h},${hsl.s}%,50%), #fff)` }} />
          <input type="range" min={0} max={100} value={hsl.l}
            onChange={e => onChange(hslToHex(hsl.h, hsl.s, Number(e.target.value)))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none"
            style={{ left: `calc(${hsl.l}% - 8px)`, backgroundColor: color }}
          />
        </div>
      </div>

      {/* Output */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full border border-border shadow-sm" style={{ backgroundColor: color }} />
        <div className="flex-1">
          <Input value={color} onChange={e => onChange(e.target.value)} className="h-8 text-sm font-mono" />
        </div>
        <span className="text-xs text-muted-foreground font-mono">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// VARIANT 4 — Compact Swatch Grid + Smart Shades
// ═══════════════════════════════════════════════════════
const Variant4 = ({ color, onChange }: { color: string; onChange: (c: string) => void }) => {
  const hsl = hexToHSL(color);

  // Generate shade palette from current hue
  const shades = Array.from({ length: 10 }, (_, i) => {
    const l = 95 - i * 9;
    return hslToHex(hsl.h, Math.max(20, hsl.s), Math.max(5, Math.min(95, l)));
  });

  // Hue families
  const hueStops = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  return (
    <div className="space-y-5">
      {/* Selected color large preview */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl border border-border shadow-md transition-colors" style={{ backgroundColor: color }} />
        <div className="flex-1 space-y-1">
          <Input value={color} onChange={e => onChange(e.target.value)} className="h-8 text-sm font-mono" />
          <p className="text-[10px] text-muted-foreground font-mono">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</p>
        </div>
      </div>

      {/* Hue Row */}
      <div>
        <Label className="text-xs text-muted-foreground mb-2 block">Hue Family</Label>
        <div className="flex gap-1">
          {hueStops.map(h => {
            const hex = hslToHex(h, 70, 50);
            const isActive = Math.abs(hsl.h - h) < 15 || Math.abs(hsl.h - h) > 345;
            return (
              <button
                key={h}
                onClick={() => onChange(hslToHex(h, hsl.s, hsl.l))}
                className={cn(
                  "flex-1 h-6 rounded-md transition-all border-2",
                  isActive ? "border-foreground scale-y-125 shadow-md" : "border-transparent hover:scale-y-110"
                )}
                style={{ backgroundColor: hex }}
              />
            );
          })}
        </div>
      </div>

      {/* Shades */}
      <div>
        <Label className="text-xs text-muted-foreground mb-2 block">Shades</Label>
        <div className="flex gap-1">
          {shades.map((s, i) => (
            <button
              key={i}
              onClick={() => onChange(s)}
              className={cn(
                "flex-1 h-8 rounded-lg transition-all border-2 flex items-center justify-center",
                color.toLowerCase() === s.toLowerCase()
                  ? "border-foreground scale-110 shadow-md"
                  : "border-transparent hover:scale-105"
              )}
              style={{ backgroundColor: s }}
            >
              {color.toLowerCase() === s.toLowerCase() && <Check className="w-3 h-3 text-white mix-blend-difference" />}
            </button>
          ))}
        </div>
      </div>

      {/* Quick presets */}
      <div>
        <Label className="text-xs text-muted-foreground mb-2 block">Quick Picks</Label>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.slice(0, 12).map(p => (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={cn(
                "w-7 h-7 rounded-full border-2 transition-all",
                color.toLowerCase() === p.toLowerCase() ? "border-foreground scale-110" : "border-transparent hover:border-border"
              )}
              style={{ backgroundColor: p }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// SHOWCASE WRAPPER
// ═══════════════════════════════════════════════════════
const ColorPickerShowcase = () => {
  const [color1, setColor1] = useState("#7C5CFC");
  const [color2, setColor2] = useState("#3B82F6");
  const [color3, setColor3] = useState("#22C55E");
  const [color4, setColor4] = useState("#EF4444");

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Color Picker Variants</h1>
        <p className="text-sm text-muted-foreground mt-1">Four modern approaches — pick the one that fits best.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Variant 1 — HSL Sliders
            </CardTitle>
            <p className="text-xs text-muted-foreground">Precise control with hue, saturation, and lightness sliders + preset swatches.</p>
          </CardHeader>
          <CardContent>
            <Variant1 color={color1} onChange={setColor1} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Variant 2 — Saturation Canvas
            </CardTitle>
            <p className="text-xs text-muted-foreground">Photoshop-style: drag on the canvas for saturation/brightness, strip for hue.</p>
          </CardHeader>
          <CardContent>
            <Variant2 color={color2} onChange={setColor2} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Variant 3 — Color Wheel
            </CardTitle>
            <p className="text-xs text-muted-foreground">Radial color wheel for intuitive hue/saturation selection + lightness slider.</p>
          </CardHeader>
          <CardContent>
            <Variant3 color={color3} onChange={setColor3} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Variant 4 — Swatch Grid
            </CardTitle>
            <p className="text-xs text-muted-foreground">Compact hue selector + auto-generated shade palette. Best for quick picks.</p>
          </CardHeader>
          <CardContent>
            <Variant4 color={color4} onChange={setColor4} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ColorPickerShowcase;
