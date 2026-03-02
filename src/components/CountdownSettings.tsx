import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Check, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLicense } from "@/hooks/useLicense";
import ProBanner from "@/components/ProBanner";
import {
  CountdownConfig,
  defaultCountdownConfig,
  ICON_OPTIONS,
} from "./ServiceCountdownWidget";

// ─── StopwatchIcon ───
const StopwatchIcon = ({
  mainPurple = false,
  allPurple = false,
  className = "",
}: {
  mainPurple?: boolean;
  allPurple?: boolean;
  className?: string;
}) => {
  const purple = "hsl(270, 30%, 60%)";
  const grey = "hsl(215, 14%, 70%)";
  const defaultColor = "currentColor";

  const mainColor = allPurple || mainPurple ? purple : defaultColor;
  const secondaryColor = allPurple ? purple : grey;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 40 20"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Main stopwatch */}
      <circle cx="12" cy="12" r="7" stroke={mainColor} />
      <line x1="12" y1="5" x2="12" y2="3" stroke={mainColor} />
      <line x1="10" y1="2.5" x2="14" y2="2.5" stroke={mainColor} />
      <line x1="12" y1="12" x2="12" y2="8" stroke={mainColor} />
      <line x1="17.5" y1="5.5" x2="18.5" y2="4.5" stroke={mainColor} />
      {/* Second stopwatch (behind right) */}
      <circle cx="24" cy="12" r="5.5" stroke={secondaryColor} strokeWidth="1.2" />
      <line x1="24" y1="6.5" x2="24" y2="5" stroke={secondaryColor} strokeWidth="1.2" />
      <line x1="22.5" y1="4.5" x2="25.5" y2="4.5" stroke={secondaryColor} strokeWidth="1.2" />
      {/* Third stopwatch (behind right) */}
      <circle cx="34" cy="12" r="4.5" stroke={secondaryColor} strokeWidth="1" strokeDasharray="2 1.5" />
      <line x1="34" y1="7.5" x2="34" y2="6.5" stroke={secondaryColor} strokeWidth="1" />
    </svg>
  );
};

// ─── Color helpers ───
function hslToHex(hsl: string): string {
  const match = hsl.match(/hsla?\((\d+),\s*([\d.]+)%,\s*([\d.]+)%/);
  if (!match) return hsl.startsWith("#") ? hsl : "#000000";
  const h = parseInt(match[1]) / 360;
  const s = parseFloat(match[2]) / 100;
  const l = parseFloat(match[3]) / 100;
  const a2 = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h * 12) % 12;
    const color = l - a2 * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const ColorField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => {
  const hexValue = hslToHex(value);
  const [localHex, setLocalHex] = useState(hexValue);
  const [open, setOpen] = useState(false);

  const handleHexChange = (hex: string) => {
    setLocalHex(hex);
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) onChange(hex);
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Popover open={open} onOpenChange={(o) => { setOpen(o); if (o) setLocalHex(hslToHex(value)); }}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 w-full h-9 px-2 rounded-lg border border-border bg-background hover:bg-secondary/40 transition-colors">
            <span className="w-6 h-6 rounded-md border border-border shrink-0" style={{ backgroundColor: value }} />
            <span className="text-xs font-mono text-muted-foreground truncate">{hexValue}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-3 space-y-3" align="start">
          <input
            type="color"
            value={hslToHex(value)}
            onChange={(e) => { onChange(e.target.value); setLocalHex(e.target.value); }}
            className="w-full h-32 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
          />
          <div className="space-y-1">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Hex</Label>
            <Input value={localHex} onChange={(e) => handleHexChange(e.target.value)} placeholder="#000000" className="h-8 text-xs font-mono" />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

// ─── Props ───
interface CountdownSettingsProps {
  config: CountdownConfig;
  onChange: (config: CountdownConfig) => void;
}

const CountdownSettings = ({ config, onChange }: CountdownSettingsProps) => {
  const [saveScope, setSaveScope] = useState<"current" | "all">("current");
  const { toast } = useToast();
  const license = useLicense();

  const update = <K extends keyof CountdownConfig>(key: K, val: CountdownConfig[K]) =>
    onChange({ ...config, [key]: val });

  const handleSave = async () => {
    try {
      const wp = (window as any).kindpdfgData || (window as any).wpPDFGallery;
      const urlParams = new URLSearchParams(window.location.search);
      const ajaxUrl = wp?.ajaxUrl || urlParams.get("ajax");
      const nonce = wp?.nonce || urlParams.get("nonce") || "";

      if (ajaxUrl && nonce) {
        const form = new FormData();
        form.append("action", "kindpdfg_action");
        form.append("action_type", "save_settings");
        form.append("nonce", nonce);
        form.append("settings", JSON.stringify(config));
        await fetch(ajaxUrl, { method: "POST", credentials: "same-origin", body: form });
      }

      toast({ title: "Settings Saved", description: "Your countdown settings have been updated." });
    } catch {
      toast({ title: "Saved locally", description: "Could not reach WordPress AJAX." });
    }
  };

  const handleReset = () => {
    onChange(defaultCountdownConfig);
    toast({ title: "Settings Reset", description: "All settings have been restored to defaults." });
  };

  return (
    <div className="space-y-6">
      {license.checked && license.status === "free" ? <ProBanner className="mb-6" /> : null}

      {/* Header with Save + Scope */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Countdown Settings</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} className="h-9 gap-1.5 text-xs text-muted-foreground">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </Button>
          <div className={`flex items-center ${!license.isPro ? "opacity-50 pointer-events-none" : ""}`}>
            <Button
              onClick={() => { if (license.isPro) handleSave(); }}
              className="rounded-r-none bg-primary hover:bg-primary/90"
              disabled={!license.isPro}
            >
              Save Settings
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  className="rounded-l-none border-l border-primary-foreground/20 px-2 bg-primary hover:bg-primary/90"
                  disabled={!license.isPro}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={() => setSaveScope("current")}
                  className="flex items-center justify-between gap-6 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <StopwatchIcon mainPurple className="flex-shrink-0" />
                    <span>Current Counter</span>
                  </div>
                  {saveScope === "current" && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSaveScope("all")}
                  className="flex items-center justify-between gap-6 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <StopwatchIcon allPurple className="flex-shrink-0" />
                    <span>All Counters</span>
                  </div>
                  {saveScope === "all" && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Icon Section */}
      <Card className={!license.isPro ? "opacity-50 pointer-events-none" : ""}>
        <CardHeader>
          <CardTitle>Icon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Icon</Label>
              <Select value={config.icon} onValueChange={(v) => update("icon", v)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((opt) => {
                    const I = opt.icon;
                    return (
                      <SelectItem key={opt.value} value={opt.value}>
                        <span className="flex items-center gap-2">
                          <I className="w-4 h-4" /> {opt.label}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <ColorField label="Icon Color" value={config.iconColor} onChange={(v) => update("iconColor", v)} />
          </div>
        </CardContent>
      </Card>

      {/* Labels Section */}
      <Card className={!license.isPro ? "opacity-50 pointer-events-none" : ""}>
        <CardHeader>
          <CardTitle>Labels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Header Text</Label>
            <Input
              value={config.headerLabel}
              onChange={(e) => update("headerLabel", e.target.value)}
              className="h-9 text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Displayed before the date. During a live event, "Happening Now:" is shown instead.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Header Size Section */}
      <Card className={!license.isPro ? "opacity-50 pointer-events-none" : ""}>
        <CardHeader>
          <CardTitle>Header Size</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground">
                Scale (icon + text + date + title)
              </Label>
              <span className="text-xs font-mono text-muted-foreground">
                {((config.headerScale ?? 1) * 100).toFixed(0)}%
              </span>
            </div>
            <Slider
              value={[(config.headerScale ?? 1) * 100]}
              onValueChange={([v]) => update("headerScale", Math.round(v) / 100)}
              min={50}
              max={200}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>50%</span>
              <span>100%</span>
              <span>200%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Colors Section */}
      <Card className={!license.isPro ? "opacity-50 pointer-events-none" : ""}>
        <CardHeader>
          <CardTitle>Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ColorField label="Background" value={config.bgColor} onChange={(v) => update("bgColor", v)} />
            <ColorField label="Text" value={config.textColor} onChange={(v) => update("textColor", v)} />
            <ColorField label="Digits" value={config.digitColor} onChange={(v) => update("digitColor", v)} />
            <ColorField label="Separators (:)" value={config.separatorColor} onChange={(v) => update("separatorColor", v)} />
            <ColorField label="Labels" value={config.labelColor} onChange={(v) => update("labelColor", v)} />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <Label className="text-sm font-medium">Show Border</Label>
            <Switch checked={config.showBorder} onCheckedChange={(v) => update("showBorder", v)} />
          </div>
        </CardContent>
      </Card>

      {/* Bottom Save */}
      <div className="flex justify-end">
        <Button
          onClick={() => { if (license.isPro) handleSave(); }}
          className={!license.isPro ? "opacity-50 cursor-not-allowed pointer-events-none" : "bg-primary hover:bg-primary/90"}
          disabled={!license.isPro}
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default CountdownSettings;
