import { useState, useCallback, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

interface SaturationCanvasPickerProps {
  color: string;
  onChange: (color: string) => void;
  /** Render prop for the trigger element. If not provided, uses a default swatch button. */
  trigger?: (color: string) => React.ReactNode;
}

const SaturationCanvasPicker = ({ color, onChange, trigger }: SaturationCanvasPickerProps) => {
  const hsl = hexToHSL(color);
  const canvasRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"canvas" | "hue" | null>(null);

  const handleCanvasMove = useCallback((clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const s = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const l = Math.max(0, Math.min(100, 100 - ((clientY - rect.top) / rect.height) * 100));
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

  const cursorX = hsl.s;
  const cursorY = 100 - hsl.l - (hsl.s * hsl.l / 200);

  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger ? trigger(color) : (
          <button className="w-10 h-10 rounded-lg border border-border shadow-sm cursor-pointer hover:shadow-md transition-shadow" style={{ backgroundColor: color }} />
        )}
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 space-y-3 pointer-events-auto" align="start">
        {/* SL Canvas */}
        <div
          ref={canvasRef}
          className="relative w-full h-36 rounded-lg overflow-hidden cursor-crosshair border border-border"
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
            className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg pointer-events-none -translate-x-1/2 -translate-y-1/2"
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
          className="relative h-3 rounded-full overflow-hidden cursor-pointer border border-border"
          style={{ background: "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)" }}
          onMouseDown={e => { setDragging("hue"); handleHueMove(e.clientX); }}
          onTouchStart={e => { setDragging("hue"); handleHueMove(e.touches[0].clientX); }}
        >
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg pointer-events-none"
            style={{ left: `calc(${(hsl.h / 360) * 100}% - 8px)`, backgroundColor: `hsl(${hsl.h}, 100%, 50%)` }}
          />
        </div>

        {/* Output */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md border border-border flex-shrink-0" style={{ backgroundColor: color }} />
          <Input value={color} onChange={e => onChange(e.target.value)} className="h-7 text-xs font-mono flex-1" />
          <Button variant="outline" size="sm" className="h-7 w-7 p-0 flex-shrink-0" onClick={() => navigator.clipboard.writeText(color)}>
            <Copy className="w-3 h-3" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SaturationCanvasPicker;
export { hexToHSL, hslToHex };
