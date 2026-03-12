/**
 * Preview Tab Redesign Showcase
 * 6 visual concepts for the Preview tab area (between main menu and footer).
 * Access via ?showcase=preview-tab
 */

import { useState } from "react";
import { Check, Copy, Eye, Code, ExternalLink, Smartphone, Monitor, Tablet, QrCode, Palette, Layout, Sparkles } from "lucide-react";
import ServiceCountdownWidget, { defaultCountdownConfig } from "./ServiceCountdownWidget";
import { Button } from "./ui/button";

const shortcode = `[nxevtcd_countdown]`;

// ─── Option 1: Clean Card with Device Frame ───
const Option1 = () => {
  const [copied, setCopied] = useState(false);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const widths = { desktop: "100%", tablet: "768px", mobile: "375px" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Live Preview</h3>
          <p className="text-sm text-muted-foreground">See how your countdown looks on different devices</p>
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {([
            { key: "desktop" as const, icon: Monitor, label: "Desktop" },
            { key: "tablet" as const, icon: Tablet, label: "Tablet" },
            { key: "mobile" as const, icon: Smartphone, label: "Mobile" },
          ]).map(d => (
            <button
              key={d.key}
              onClick={() => setDevice(d.key)}
              className={`p-2 rounded-md transition-colors ${device === d.key ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              title={d.label}
            >
              <d.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Device frame */}
      <div className="bg-muted/30 rounded-2xl border border-border p-6 flex justify-center">
        <div
          className="transition-all duration-300 w-full"
          style={{ maxWidth: widths[device] }}
        >
          {/* Browser chrome */}
          <div className="bg-muted rounded-t-xl px-4 py-2.5 flex items-center gap-2 border border-b-0 border-border">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
            </div>
            <div className="flex-1 bg-background rounded-md px-3 py-1 text-xs text-muted-foreground font-mono">
              yoursite.com/page
            </div>
          </div>
          <div className="border border-t-0 border-border rounded-b-xl bg-background p-6">
            <ServiceCountdownWidget config={defaultCountdownConfig} />
          </div>
        </div>
      </div>

      {/* Shortcode bar */}
      <div className="flex items-center gap-3 bg-muted/50 rounded-xl px-4 py-3 border border-border">
        <Code className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <code className="text-sm font-mono text-foreground flex-1">{shortcode}</code>
        <Button
          size="sm"
          variant={copied ? "default" : "outline"}
          onClick={() => { navigator.clipboard.writeText(shortcode); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="gap-1.5"
        >
          {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
        </Button>
      </div>
    </div>
  );
};

// ─── Option 2: Split Panel (Preview + Embed Code) ───
const Option2 = () => {
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview panel - 2/3 */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="bg-muted px-4 py-2 flex items-center gap-2 border-b border-border">
              <Eye className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Live Preview</span>
            </div>
            <div className="p-8 bg-background">
              <ServiceCountdownWidget config={defaultCountdownConfig} />
            </div>
          </div>
        </div>

        {/* Sidebar - 1/3 */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border p-5 space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Code className="w-4 h-4" />
              Embed Code
            </h4>
            <div className="bg-muted rounded-lg p-3">
              <code className="text-xs font-mono text-foreground break-all">{shortcode}</code>
            </div>
            <Button
              size="sm"
              className="w-full gap-2"
              onClick={() => { navigator.clipboard.writeText(shortcode); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            >
              {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Shortcode</>}
            </Button>
          </div>

          <div className="rounded-xl border border-border p-5 space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Quick Tips</h4>
            <ul className="text-xs text-muted-foreground space-y-2">
              <li className="flex gap-2"><span className="text-primary">•</span> Paste the shortcode in any page or post</li>
              <li className="flex gap-2"><span className="text-primary">•</span> Use the Settings tab to customize colors</li>
              <li className="flex gap-2"><span className="text-primary">•</span> Add events in the Counters tab</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Option 3: Minimal with Floating Shortcode ───
const Option3 = () => {
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-8">
      {/* Floating shortcode bar */}
      <div className="relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-2 bg-foreground text-background rounded-full px-4 py-1.5 shadow-lg">
            <code className="text-xs font-mono">{shortcode}</code>
            <button
              onClick={() => { navigator.clipboard.writeText(shortcode); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              className="hover:opacity-70 transition-opacity"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Clean preview */}
      <div className="rounded-2xl border-2 border-dashed border-border bg-muted/20 p-10 pt-8">
        <div className="flex justify-center">
          <ServiceCountdownWidget config={defaultCountdownConfig} />
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        This is exactly how your countdown will appear on the front-end
      </p>
    </div>
  );
};

// ─── Option 4: Dark Preview Canvas ───
const Option4 = () => {
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Preview
        </h3>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={() => { navigator.clipboard.writeText(shortcode); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        >
          {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> {shortcode}</>}
        </Button>
      </div>

      {/* Dark canvas */}
      <div className="rounded-2xl bg-slate-900 p-10 shadow-xl">
        <div className="bg-white rounded-xl p-6 shadow-2xl">
          <ServiceCountdownWidget config={defaultCountdownConfig} />
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Live — updates every second
        </span>
        <span>3 events configured</span>
      </div>
    </div>
  );
};

// ─── Option 5: Tabbed Preview (Light/Dark/Custom BG) ───
const Option5 = () => {
  const [copied, setCopied] = useState(false);
  const [bg, setBg] = useState<"light" | "dark" | "brand">("light");
  const bgs = { light: "#ffffff", dark: "#1a1a2e", brand: "#f0f4ff" };
  const textOn = { light: "text-foreground", dark: "text-white", brand: "text-foreground" };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-foreground">Preview</h3>
          <div className="flex gap-1 bg-muted rounded-lg p-0.5">
            {(["light", "dark", "brand"] as const).map(b => (
              <button
                key={b}
                onClick={() => setBg(b)}
                className={`px-3 py-1 text-xs rounded-md capitalize transition-colors ${bg === b ? "bg-background shadow-sm font-medium text-foreground" : "text-muted-foreground"}`}
              >
                {b === "brand" ? "Custom" : b}
              </button>
            ))}
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={() => { navigator.clipboard.writeText(shortcode); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        >
          {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Shortcode</>}
        </Button>
      </div>

      <div
        className="rounded-2xl border border-border p-10 transition-colors duration-300"
        style={{ backgroundColor: bgs[bg] }}
      >
        <div className="flex justify-center">
          <ServiceCountdownWidget config={defaultCountdownConfig} />
        </div>
      </div>

      <div className="flex items-center gap-3 bg-muted/50 rounded-lg px-4 py-2.5 border border-border">
        <Code className="w-4 h-4 text-muted-foreground" />
        <code className="text-sm font-mono text-foreground flex-1">{shortcode}</code>
      </div>
    </div>
  );
};

// ─── Option 6: Card Stack with Quick Actions ───
const Option6 = () => {
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-5">
      {/* Main preview card */}
      <div className="rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-5 py-3 flex items-center justify-between border-b border-border">
          <span className="text-sm font-medium text-foreground flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            Front-end Preview
          </span>
          <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium uppercase tracking-wider">
            Live
          </span>
        </div>
        <div className="p-8 bg-background">
          <div className="flex justify-center">
            <ServiceCountdownWidget config={defaultCountdownConfig} />
          </div>
        </div>
      </div>

      {/* Action cards row */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => { navigator.clipboard.writeText(shortcode); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="rounded-xl border border-border p-4 text-left hover:bg-muted/50 transition-colors group"
        >
          <div className="flex items-center gap-2 mb-1.5">
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />}
            <span className="text-sm font-medium text-foreground">{copied ? "Copied!" : "Copy Shortcode"}</span>
          </div>
          <code className="text-[10px] font-mono text-muted-foreground">{shortcode}</code>
        </button>

        <div className="rounded-xl border border-border p-4 text-left opacity-60">
          <div className="flex items-center gap-2 mb-1.5">
            <Palette className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Customize</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Go to Settings tab</p>
        </div>

        <div className="rounded-xl border border-border p-4 text-left opacity-60">
          <div className="flex items-center gap-2 mb-1.5">
            <Layout className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Events</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Go to Counters tab</p>
        </div>
      </div>
    </div>
  );
};

// ─── Showcase Wrapper ───
const PreviewTabShowcase = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-16">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Preview Tab Redesign Options</h1>
          <p className="text-muted-foreground">6 concepts for the preview area between the main tabs and footer.</p>
        </div>

        {([
          { title: "Option 1 — Device Frame Preview", desc: "Desktop/tablet/mobile toggle with browser chrome simulation", Component: Option1 },
          { title: "Option 2 — Split Panel Layout", desc: "2/3 preview + 1/3 embed code sidebar with tips", Component: Option2 },
          { title: "Option 3 — Minimal with Floating Shortcode", desc: "Ultra-clean with dashed border and floating pill shortcode", Component: Option3 },
          { title: "Option 4 — Dark Canvas", desc: "Dark background to make the widget pop, with live status indicator", Component: Option4 },
          { title: "Option 5 — Background Switcher", desc: "Toggle between light/dark/custom backgrounds for testing", Component: Option5 },
          { title: "Option 6 — Card Stack with Quick Actions", desc: "Preview card with action cards for shortcode, settings, and events", Component: Option6 },
        ]).map(({ title, desc, Component }, i) => (
          <div key={i} className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
            <div className="border border-border rounded-2xl p-6 bg-background">
              <Component />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviewTabShowcase;
