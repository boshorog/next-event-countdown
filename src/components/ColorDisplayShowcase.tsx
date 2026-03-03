import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";
import SaturationCanvasPicker from "@/components/SaturationCanvasPicker";

const DEMO_COLOR = "#7C5CFC";

// ═══════════════════════════════════════════════════════
// VARIANT A — Minimal Swatch + Hex (compact row)
// ═══════════════════════════════════════════════════════
const TriggerA = ({ color, onChange }: { color: string; onChange: (c: string) => void }) => (
  <div className="flex items-center gap-3">
    <SaturationCanvasPicker
      color={color}
      onChange={onChange}
      trigger={(c) => (
        <button className="w-9 h-9 rounded-lg border border-border shadow-sm cursor-pointer hover:shadow-md transition-shadow" style={{ backgroundColor: c }} />
      )}
    />
    <Input value={color} onChange={e => onChange(e.target.value)} className="h-9 text-sm font-mono max-w-[140px]" />
  </div>
);

// ═══════════════════════════════════════════════════════
// VARIANT B — Pill Badge (swatch inside a rounded pill with label)
// ═══════════════════════════════════════════════════════
const TriggerB = ({ color, onChange }: { color: string; onChange: (c: string) => void }) => (
  <SaturationCanvasPicker
    color={color}
    onChange={onChange}
    trigger={(c) => (
      <button className="inline-flex items-center gap-2.5 h-10 pl-1.5 pr-4 rounded-full border border-border bg-card shadow-sm cursor-pointer hover:shadow-md hover:border-primary/30 transition-all">
        <span className="w-7 h-7 rounded-full flex-shrink-0 shadow-inner" style={{ backgroundColor: c }} />
        <span className="text-sm font-mono text-foreground">{c}</span>
      </button>
    )}
  />
);

// ═══════════════════════════════════════════════════════
// VARIANT C — Card Preview (large swatch with gradient overlay)
// ═══════════════════════════════════════════════════════
const TriggerC = ({ color, onChange }: { color: string; onChange: (c: string) => void }) => (
  <SaturationCanvasPicker
    color={color}
    onChange={onChange}
    trigger={(c) => (
      <button className="group relative w-full h-20 rounded-xl border border-border overflow-hidden cursor-pointer hover:shadow-lg transition-all">
        <div className="absolute inset-0" style={{ backgroundColor: c }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute bottom-2 left-3 flex items-center gap-2">
          <Palette className="w-3.5 h-3.5 text-white/80" />
          <span className="text-xs font-mono text-white/90 tracking-wide">{c}</span>
        </div>
        <div className="absolute top-2 right-2 text-[10px] font-medium text-white/60 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
          Click to edit
        </div>
      </button>
    )}
  />
);

// ═══════════════════════════════════════════════════════
// VARIANT D — Split Button (swatch left, hex right, divided)
// ═══════════════════════════════════════════════════════
const TriggerD = ({ color, onChange }: { color: string; onChange: (c: string) => void }) => (
  <div className="inline-flex rounded-lg border border-border overflow-hidden shadow-sm">
    <SaturationCanvasPicker
      color={color}
      onChange={onChange}
      trigger={(c) => (
        <button className="w-11 h-10 cursor-pointer hover:brightness-110 transition-all" style={{ backgroundColor: c }} />
      )}
    />
    <div className="flex items-center px-3 bg-card border-l border-border">
      <Input
        value={color}
        onChange={e => onChange(e.target.value)}
        className="h-7 text-xs font-mono border-0 shadow-none p-0 w-[80px] bg-transparent focus-visible:ring-0"
      />
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════
// VARIANT E — Labeled Row (label + large swatch + editable hex, like a form field)
// ═══════════════════════════════════════════════════════
const TriggerE = ({ color, onChange }: { color: string; onChange: (c: string) => void }) => (
  <div className="flex items-center gap-4">
    <SaturationCanvasPicker
      color={color}
      onChange={onChange}
      trigger={(c) => (
        <button className="w-12 h-12 rounded-xl border-2 border-border shadow-sm cursor-pointer hover:shadow-md hover:scale-105 transition-all" style={{ backgroundColor: c }} />
      )}
    />
    <div className="flex-1 space-y-1">
      <Label className="text-xs text-muted-foreground">Accent Color</Label>
      <Input value={color} onChange={e => onChange(e.target.value)} placeholder="#7FB3DC" className="font-mono h-9" />
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════
// SHOWCASE
// ═══════════════════════════════════════════════════════
const ColorDisplayShowcase = () => {
  const [cA, setCa] = useState(DEMO_COLOR);
  const [cB, setCb] = useState("#3B82F6");
  const [cC, setCc] = useState("#EF4444");
  const [cD, setCd] = useState("#22C55E");
  const [cE, setCe] = useState("#EAB308");

  const variants = [
    { id: "A", title: "Minimal Swatch + Hex", desc: "Compact row — small swatch opens picker, hex input beside it.", component: <TriggerA color={cA} onChange={setCa} /> },
    { id: "B", title: "Pill Badge", desc: "Rounded pill with inline swatch. Entire pill is clickable.", component: <TriggerB color={cB} onChange={setCb} /> },
    { id: "C", title: "Card Preview", desc: "Large color card with gradient overlay. Great for visual impact.", component: <TriggerC color={cC} onChange={setCc} /> },
    { id: "D", title: "Split Button", desc: "Swatch left, hex right — divided button feel, very compact.", component: <TriggerD color={cD} onChange={setCd} /> },
    { id: "E", title: "Labeled Row (current)", desc: "Large swatch + form field with label. Clean admin-style layout.", component: <TriggerE color={cE} onChange={setCe} /> },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Color Display Variants</h1>
        <p className="text-sm text-muted-foreground mt-1">How the accent color appears in the admin <em>before</em> opening the picker. All use Variant 2 (Saturation Canvas) on click.</p>
      </div>

      <div className="space-y-4">
        {variants.map(v => (
          <Card key={v.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Variant {v.id} — {v.title}</CardTitle>
              <p className="text-xs text-muted-foreground">{v.desc}</p>
            </CardHeader>
            <CardContent>
              {v.component}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ColorDisplayShowcase;
