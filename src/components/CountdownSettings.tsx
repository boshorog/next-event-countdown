import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RotateCcw, ChevronDown, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLicense } from "@/hooks/useLicense";
import ProBanner from "@/components/ProBanner";
import {
  CountdownConfig,
  defaultCountdownConfig,
  ICON_OPTIONS,
} from "./ServiceCountdownWidget";

// ─── Stopwatch Icon for scope selector ───
const StopwatchIcon = ({
  allPurple = false,
  mainPurple = false,
  className = "",
}: {
  allPurple?: boolean;
  mainPurple?: boolean;
  className?: string;
}) => {
  const purpleColor = "hsl(270, 30%, 60%)";
  const grayColor = "hsl(215, 14%, 70%)";
  const defaultColor = "currentColor";

  const mainColor = allPurple || mainPurple ? purpleColor : defaultColor;
  const secondaryColor = allPurple ? purpleColor : mainPurple ? grayColor : defaultColor;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 40 24"
      fill="none"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Main stopwatch (center-left) */}
      <circle cx="12" cy="14" r="8" stroke={mainColor} />
      <line x1="12" y1="14" x2="12" y2="9" stroke={mainColor} />
      <line x1="10" y1="3" x2="14" y2="3" stroke={mainColor} />
      <line x1="12" y1="3" x2="12" y2="6" stroke={mainColor} />
      <line x1="18.5" y1="7.5" x2="17" y2="9" stroke={mainColor} />

      {/* Second stopwatch (offset right-up) */}
      <circle cx="24" cy="12" r="6" stroke={secondaryColor} strokeWidth="1.4" opacity="0.7" />
      <line x1="24" y1="12" x2="24" y2="8.5" stroke={secondaryColor} strokeWidth="1.4" opacity="0.7" />
      <line x1="22.5" y1="4" x2="25.5" y2="4" stroke={secondaryColor} strokeWidth="1.4" opacity="0.7" />
      <line x1="24" y1="4" x2="24" y2="6" stroke={secondaryColor} strokeWidth="1.4" opacity="0.7" />

      {/* Third stopwatch (further right-up) */}
      <circle cx="33" cy="11" r="5" stroke={secondaryColor} strokeWidth="1.2" opacity="0.45" />
      <line x1="33" y1="11" x2="33" y2="8" stroke={secondaryColor} strokeWidth="1.2" opacity="0.45" />
      <line x1="31.5" y1="4.5" x2="34.5" y2="4.5" stroke={secondaryColor} strokeWidth="1.2" opacity="0.45" />
      <line x1="33" y1="4.5" x2="33" y2="6" stroke={secondaryColor} strokeWidth="1.2" opacity="0.45" />
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

const ColorField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => {
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
  onChange: (c: CountdownConfig) => void;
  currentGalleryId?: string;
}

const CountdownSettings = ({ config, onChange, currentGalleryId }: CountdownSettingsProps) => {
  const update = <K extends keyof CountdownConfig>(key: K, val: CountdownConfig[K]) =>
    onChange({ ...config, [key]: val });

  const [saveScope, setSaveScope] = useState<"current" | "all">("current");
  const { toast } = useToast();
  const license = useLicense();

  const handleSave = async () => {
    try {
      const wp = (window as any).kindpdfgData || (window as any).wpPDFGallery;
      const urlParams = new URLSearchParams(window.location.search);
      const ajaxUrl = wp?.ajaxUrl || urlParams.get("ajax");
      const nonce = wp?.nonce || urlParams.get("nonce") || "";

      if (ajaxUrl && nonce) {
        const form = new FormData();
        form.append("action", "kindpdfg_action");
        form.append("action_type", "save_countdown_settings");
        form.append("nonce", nonce);
        form.append("countdown_config", JSON.stringify(config));
        form.append("save_scope", saveScope);
        if (saveScope === "current" && currentGalleryId) {
          form.append("gallery_id", currentGalleryId);
        }
        await fetch(ajaxUrl, { method: "POST", credentials: "same-origin", body: form });
      }

      toast({
        title: "Settings Saved",
        description: "Your countdown settings have been updated successfully.",
      });
    } catch {
      toast({ title: "Saved locally", description: "Could not reach WordPress AJAX." });
    }
  };

  return (
    <div className="space-y-6">
      {license.checked && license.status === "free" ? <ProBanner className="mb-6" /> : null}

      {/* Header with Save + Scope */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Countdown Settings</h2>
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

          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange(defaultCountdownConfig)}
            className="ml-3 text-xs text-muted-foreground h-9 gap-1.5"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </Button>
        </div>
      </div>

      {/* ══ Section: Icon ══ */}
      <Card className={!license.isPro ? "opacity-50 pointer-events-none" : ""}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Icon</CardTitle>
          <p className="text-xs text-muted-foreground">Choose the icon displayed next to the countdown header.</p>
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

      {/* ══ Section: Labels ══ */}
      <Card className={!license.isPro ? "opacity-50 pointer-events-none" : ""}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Labels</CardTitle>
          <p className="text-xs text-muted-foreground">Customize text displayed in the countdown widget header.</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Header Label</Label>
            <Input
              value={config.headerLabel}
              onChange={(e) => update("headerLabel", e.target.value)}
              className="h-9 text-sm"
              placeholder="Next Event"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              This text appears before the event date. During a live event it changes to "Happening Now".
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ══ Section: Header Scale ══ */}
      <Card className={!license.isPro ? "opacity-50 pointer-events-none" : ""}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Header Size</CardTitle>
          <p className="text-xs text-muted-foreground">Scale the header area (icon, label, date, and event title).</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground">Scale</Label>
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

      {/* ══ Section: Colors ══ */}
      <Card className={!license.isPro ? "opacity-50 pointer-events-none" : ""}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Colors</CardTitle>
          <p className="text-xs text-muted-foreground">Customize the countdown widget color palette.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ColorField label="Background" value={config.bgColor} onChange={(v) => update("bgColor", v)} />
            <ColorField label="Text" value={config.textColor} onChange={(v) => update("textColor", v)} />
            <ColorField label="Digits" value={config.digitColor} onChange={(v) => update("digitColor", v)} />
            <ColorField label="Separators (:)" value={config.separatorColor} onChange={(v) => update("separatorColor", v)} />
            <ColorField label="Labels" value={config.labelColor} onChange={(v) => update("labelColor", v)} />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <Label className="text-xs font-medium text-foreground">Show Border</Label>
              <p className="text-[11px] text-muted-foreground">Display an outer border around the widget.</p>
            </div>
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
