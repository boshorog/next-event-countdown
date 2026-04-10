/**
 * Counter Size Showcase — Combined Option 5+6
 * Granular typography + compact layout + aspect ratio lock + positioning + live preview
 * Access via ?showcase=counter-size
 */

import { useState } from "react";
import { Ruler, Lock, Unlock, Move, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import ServiceCountdownWidget, { defaultCountdownConfig } from "./ServiceCountdownWidget";
import { COUNTER_STYLE_OPTIONS, type CounterStyleId } from "./counterStyles/types";

const CounterSizeShowcase = () => {
  // Style selector
  const [styleId, setStyleId] = useState<CounterStyleId>("default");

  // Typography (from Option 5)
  const [headerSize, setHeaderSize] = useState(14);
  const [digitSize, setDigitSize] = useState(36);
  const [labelSize, setLabelSize] = useState(9);

  // Dimensions
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(220);
  const [lockRatio, setLockRatio] = useState(false);
  const baseRatio = 600 / 220;

  // Position offsets (px)
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const handleWidthChange = (w: number) => {
    setWidth(w);
    if (lockRatio) setHeight(Math.round(w / baseRatio));
  };
  const handleHeightChange = (h: number) => {
    setHeight(h);
    if (lockRatio) setWidth(Math.round(h * baseRatio));
  };

  const resetAll = () => {
    setHeaderSize(14);
    setDigitSize(36);
    setLabelSize(9);
    setWidth(600);
    setHeight(220);
    setLockRatio(false);
    setOffsetX(0);
    setOffsetY(0);
  };

  const config = {
    ...defaultCountdownConfig,
    counterStyle: styleId,
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Counter Size & Position — Combined Panel</h1>
          <p className="text-sm text-muted-foreground">
            Granular control over every element: typography, dimensions, aspect ratio, and position within the embed frame.
          </p>
        </div>

        {/* Style selector pills */}
        <div className="flex flex-wrap gap-2">
          {COUNTER_STYLE_OPTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setStyleId(s.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                styleId === s.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              {s.name}
              {s.pro && <span className="ml-1 text-[9px] opacity-60">PRO</span>}
            </button>
          ))}
        </div>

        {/* Main layout: Controls + Preview */}
        <div className="grid grid-cols-[380px_1fr] gap-6 items-start">
          {/* ─── Controls Panel ─── */}
          <Card className="sticky top-8">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  Size & Position
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={resetAll}>
                        <RotateCcw className="w-3.5 h-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reset all to defaults</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* ── Typography Section ── */}
              <div className="space-y-3">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Typography</Label>
                
                {/* Header Text */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Header Text</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={headerSize}
                        onChange={(e) => setHeaderSize(Number(e.target.value))}
                        className="w-14 h-6 text-[11px] text-right px-1.5"
                      />
                      <span className="text-[10px] text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider value={[headerSize]} onValueChange={(v) => setHeaderSize(v[0])} min={8} max={32} step={1} />
                </div>

                {/* Digit Size */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Digit Size</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={digitSize}
                        onChange={(e) => setDigitSize(Number(e.target.value))}
                        className="w-14 h-6 text-[11px] text-right px-1.5"
                      />
                      <span className="text-[10px] text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider value={[digitSize]} onValueChange={(v) => setDigitSize(v[0])} min={16} max={96} step={2} />
                </div>

                {/* Label Size */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Label Size</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={labelSize}
                        onChange={(e) => setLabelSize(Number(e.target.value))}
                        className="w-14 h-6 text-[11px] text-right px-1.5"
                      />
                      <span className="text-[10px] text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider value={[labelSize]} onValueChange={(v) => setLabelSize(v[0])} min={6} max={18} step={1} />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t" />

              {/* ── Dimensions Section ── */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Dimensions</Label>
                  <button
                    onClick={() => setLockRatio(!lockRatio)}
                    className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-md transition-colors ${
                      lockRatio
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {lockRatio ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    Lock ratio
                  </button>
                </div>

                {/* Width */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Width</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={width}
                        onChange={(e) => handleWidthChange(Number(e.target.value))}
                        className="w-16 h-6 text-[11px] text-right px-1.5"
                      />
                      <span className="text-[10px] text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider value={[width]} onValueChange={(v) => handleWidthChange(v[0])} min={200} max={1200} step={10} />
                </div>

                {/* Height */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Height</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={height}
                        onChange={(e) => handleHeightChange(Number(e.target.value))}
                        className="w-16 h-6 text-[11px] text-right px-1.5"
                      />
                      <span className="text-[10px] text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider value={[height]} onValueChange={(v) => handleHeightChange(v[0])} min={80} max={500} step={5} />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t" />

              {/* ── Position Section ── */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Move className="w-3 h-3" />
                      Position Offset
                    </span>
                  </Label>
                  {(offsetX !== 0 || offsetY !== 0) && (
                    <button
                      onClick={() => { setOffsetX(0); setOffsetY(0); }}
                      className="text-[10px] text-muted-foreground hover:text-foreground"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Visual position pad */}
                <div className="flex items-center gap-4">
                  {/* Direction pad */}
                  <div className="grid grid-cols-3 gap-0.5 w-fit">
                    <div />
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => setOffsetY((v) => v - 5)}>
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <div />
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => setOffsetX((v) => v - 5)}>
                      <ArrowLeft className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0 text-[9px] font-mono" onClick={() => { setOffsetX(0); setOffsetY(0); }}>
                      ·
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => setOffsetX((v) => v + 5)}>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                    <div />
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => setOffsetY((v) => v + 5)}>
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                    <div />
                  </div>

                  {/* Numeric inputs */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-[10px] w-4 text-muted-foreground">X</Label>
                      <Slider value={[offsetX]} onValueChange={(v) => setOffsetX(v[0])} min={-200} max={200} step={1} className="flex-1" />
                      <div className="flex items-center gap-0.5">
                        <Input
                          type="number"
                          value={offsetX}
                          onChange={(e) => setOffsetX(Number(e.target.value))}
                          className="w-14 h-6 text-[11px] text-right px-1.5"
                        />
                        <span className="text-[9px] text-muted-foreground">px</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-[10px] w-4 text-muted-foreground">Y</Label>
                      <Slider value={[offsetY]} onValueChange={(v) => setOffsetY(v[0])} min={-200} max={200} step={1} className="flex-1" />
                      <div className="flex items-center gap-0.5">
                        <Input
                          type="number"
                          value={offsetY}
                          onChange={(e) => setOffsetY(Number(e.target.value))}
                          className="w-14 h-6 text-[11px] text-right px-1.5"
                        />
                        <span className="text-[9px] text-muted-foreground">px</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ─── Live Preview ─── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                Live Preview — {width} × {height}px
                {(offsetX !== 0 || offsetY !== 0) && ` · offset (${offsetX}, ${offsetY})`}
              </Label>
              <span className="text-[10px] text-muted-foreground font-mono">
                {COUNTER_STYLE_OPTIONS.find((s) => s.id === styleId)?.name}
              </span>
            </div>
            
            {/* Preview frame simulating the iframe embed area */}
            <div
              className="relative rounded-xl border-2 border-dashed border-border bg-muted/10 overflow-hidden"
              style={{ width: `${Math.min(width, 800)}px`, height: `${height + 40}px`, maxWidth: '100%' }}
            >
              {/* Grid background for visual reference */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
              
              {/* Center crosshair */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-px h-6 bg-primary/20 absolute left-1/2 -translate-x-1/2 -top-3" />
                <div className="h-px w-6 bg-primary/20 absolute top-1/2 -translate-y-1/2 -left-3" />
              </div>

              {/* Counter widget with offset */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  marginLeft: `${offsetX}px`,
                  marginTop: `${offsetY}px`,
                }}
              >
                <div
                  style={{
                    ['--header-font-size' as string]: `${headerSize}px`,
                    ['--digit-font-size' as string]: `${digitSize}px`,
                    ['--label-font-size' as string]: `${labelSize}px`,
                  }}
                >
                  <ServiceCountdownWidget config={config} />
                </div>
              </div>
            </div>

            {/* Info hint */}
            <p className="text-[11px] text-muted-foreground italic">
              The grid and crosshair show the center of the embed frame. Use Position Offset to shift the counter from center.
              Typography sizes are CSS custom properties that each counter style renderer will consume.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterSizeShowcase;
