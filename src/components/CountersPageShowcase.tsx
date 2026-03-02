import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Check, ChevronDown, Plus, Trash2, Save, Timer, CalendarDays } from 'lucide-react';
import UpcomingCalendar from './UpcomingCalendar';
import ServiceCountdownWidget, { defaultCountdownConfig } from './ServiceCountdownWidget';
import EventScheduleManager from './EventScheduleManager';
import { GallerySelector } from './GallerySelector';

const config = defaultCountdownConfig;
const demoGalleries = [{ id: '1', name: 'Test Countdown', items: [], createdAt: new Date().toISOString() }];

// ─── Variant 1: Stacked Sections with Calendar Hero ────────────────────────────
const Variant1 = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Variant 1 — Calendar Hero</CardTitle>
      <p className="text-xs text-muted-foreground">Calendar at top spanning full width, event manager below in a clean card layout</p>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="bg-muted/30 rounded-xl p-4 space-y-4">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-muted-foreground">Counters</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground/60 rotate-[-90deg]" />
            <span className="font-medium">Test Countdown</span>
          </div>
          <Button size="sm" className="bg-primary hover:bg-primary/90 h-8">
            <Check className="w-3.5 h-3.5 mr-1.5" /> Save
          </Button>
        </div>

        {/* Calendar — full width hero */}
        <Card className="border-primary/20">
          <CardContent className="pt-4 pb-3 px-3">
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Upcoming Schedule</span>
            </div>
            <UpcomingCalendar countdownConfig={config} />
          </CardContent>
        </Card>

        <Separator />

        {/* Event cards side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Recurring Events</CardTitle>
                <Button size="sm" className="h-6 text-xs gap-1 bg-accent text-accent-foreground hover:bg-accent/80">
                  <Plus className="w-3 h-3" /> Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {config.schedules.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][s.day]} · {String(s.hour).padStart(2,'0')}:{String(s.minute).padStart(2,'0')}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Special Events</CardTitle>
                <Button size="sm" className="h-6 text-xs gap-1 bg-accent text-accent-foreground hover:bg-accent/80">
                  <Plus className="w-3 h-3" /> Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground italic">No special events added.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </CardContent>
  </Card>
);

// ─── Variant 2: Compact Dashboard ──────────────────────────────────────────────
const Variant2 = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Variant 2 — Compact Dashboard</CardTitle>
      <p className="text-xs text-muted-foreground">Calendar integrated into header area, events listed as compact rows</p>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="bg-muted/30 rounded-xl p-4 space-y-4">
        {/* Header with breadcrumb & save inline */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm">
            <Timer className="w-4 h-4 text-primary" />
            <span className="font-semibold">Test Countdown</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" /> Event
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90 h-8 text-xs">
              <Save className="w-3.5 h-3.5 mr-1" /> Save
            </Button>
          </div>
        </div>

        {/* Calendar strip */}
        <UpcomingCalendar countdownConfig={config} />

        {/* Event list — all in one card, categorized */}
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recurring</span>
            </div>
            {config.schedules.map((s, i) => (
              <div key={i} className="ml-4 flex items-center justify-between py-1.5 border-b last:border-0 border-dashed">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {['Su','Mo','Tu','We','Th','Fr','Sa'][s.day]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{String(s.hour).padStart(2,'0')}:{String(s.minute).padStart(2,'0')} · {s.duration || 60} min</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
            <div className="flex items-center gap-2 pt-2">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Special</span>
            </div>
            <p className="ml-4 text-xs text-muted-foreground italic">None yet</p>
          </CardContent>
        </Card>
      </div>
    </CardContent>
  </Card>
);

// ─── Variant 3: Sidebar Calendar ───────────────────────────────────────────────
const Variant3 = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Variant 3 — Sidebar Calendar</CardTitle>
      <p className="text-xs text-muted-foreground">Calendar in a narrow sidebar, events fill the main area</p>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="bg-muted/30 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-muted-foreground">Counters</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground/60 rotate-[-90deg]" />
            <span className="font-medium">Test Countdown</span>
          </div>
          <Button size="sm" className="bg-primary hover:bg-primary/90 h-8">
            <Check className="w-3.5 h-3.5 mr-1.5" /> Save
          </Button>
        </div>
        <div className="grid grid-cols-[1fr_280px] gap-4">
          {/* Main: events */}
          <div className="space-y-3">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Recurring Events</CardTitle>
                  <Button size="sm" className="h-6 text-xs gap-1 bg-accent text-accent-foreground hover:bg-accent/80">
                    <Plus className="w-3 h-3" /> Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {config.schedules.map((s, i) => (
                  <div key={i} className="p-2.5 border rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{s.title}</p>
                      <p className="text-xs text-muted-foreground">{['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][s.day]}s · {String(s.hour).padStart(2,'0')}:{String(s.minute).padStart(2,'0')} · {s.duration}min</p>
                    </div>
                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground cursor-pointer hover:text-destructive" />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Special Events</CardTitle>
                  <Button size="sm" className="h-6 text-xs gap-1 bg-accent text-accent-foreground hover:bg-accent/80">
                    <Plus className="w-3 h-3" /> Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground italic">No special events.</p>
              </CardContent>
            </Card>
          </div>
          {/* Sidebar: calendar */}
          <div className="space-y-3">
            <Card className="border-primary/20">
              <CardContent className="pt-3 pb-3 px-2">
                <p className="text-xs font-semibold text-center mb-2 text-primary">Schedule Overview</p>
                <UpcomingCalendar countdownConfig={config} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// ─── Variant 4: Tabbed Sections ────────────────────────────────────────────────
const Variant4 = () => {
  const [activeSection, setActiveSection] = useState<'recurring'|'special'>('recurring');
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Variant 4 — Tabbed Events</CardTitle>
        <p className="text-xs text-muted-foreground">Calendar above, events organized in tabs below to reduce visual clutter</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/30 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-muted-foreground">Counters</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground/60 rotate-[-90deg]" />
              <span className="font-medium">Test Countdown</span>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90 h-8">
              <Check className="w-3.5 h-3.5 mr-1.5" /> Save
            </Button>
          </div>

          <UpcomingCalendar countdownConfig={config} />
          <Separator />

          {/* Tab bar */}
          <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
            <button
              onClick={() => setActiveSection('recurring')}
              className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-all ${activeSection === 'recurring' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Recurring ({config.schedules.length})
            </button>
            <button
              onClick={() => setActiveSection('special')}
              className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-all ${activeSection === 'special' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Special ({config.specialEvents.length})
            </button>
          </div>

          {activeSection === 'recurring' && (
            <div className="space-y-2">
              <div className="flex justify-end">
                <Button size="sm" className="h-7 text-xs gap-1 bg-accent text-accent-foreground hover:bg-accent/80">
                  <Plus className="w-3 h-3" /> Add Recurring
                </Button>
              </div>
              {config.schedules.map((s, i) => (
                <div key={i} className="p-3 border rounded-lg flex items-center justify-between bg-background">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Timer className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{s.title}</p>
                      <p className="text-xs text-muted-foreground">Every {['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][s.day]} · {String(s.hour).padStart(2,'0')}:{String(s.minute).padStart(2,'0')}</p>
                    </div>
                  </div>
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground cursor-pointer hover:text-destructive" />
                </div>
              ))}
            </div>
          )}
          {activeSection === 'special' && (
            <div className="space-y-2">
              <div className="flex justify-end">
                <Button size="sm" className="h-7 text-xs gap-1 bg-accent text-accent-foreground hover:bg-accent/80">
                  <Plus className="w-3 h-3" /> Add Special
                </Button>
              </div>
              <p className="text-xs text-muted-foreground italic text-center py-4">No special events added yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Variant 5: Kanban-ish Columns ─────────────────────────────────────────────
const Variant5 = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Variant 5 — Three-Column Layout</CardTitle>
      <p className="text-xs text-muted-foreground">Calendar, recurring, and special events side-by-side in equal columns</p>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="bg-muted/30 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Test Countdown</span>
          </div>
          <Button size="sm" className="bg-primary hover:bg-primary/90 h-8">
            <Save className="w-3.5 h-3.5 mr-1.5" /> Save
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {/* Column 1: Calendar */}
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-primary">Schedule</CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-3">
              <UpcomingCalendar countdownConfig={config} />
            </CardContent>
          </Card>
          {/* Column 2: Recurring */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recurring</CardTitle>
                <Button size="sm" className="h-5 text-[10px] gap-0.5 px-1.5 bg-accent text-accent-foreground hover:bg-accent/80">
                  <Plus className="w-2.5 h-2.5" /> Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-1.5 px-3 pb-3">
              {config.schedules.map((s, i) => (
                <div key={i} className="p-2 rounded-md bg-muted/50 border border-border/50">
                  <p className="text-xs font-medium truncate">{s.title}</p>
                  <p className="text-[10px] text-muted-foreground">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][s.day]} {String(s.hour).padStart(2,'0')}:{String(s.minute).padStart(2,'0')}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          {/* Column 3: Special */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Special</CardTitle>
                <Button size="sm" className="h-5 text-[10px] gap-0.5 px-1.5 bg-accent text-accent-foreground hover:bg-accent/80">
                  <Plus className="w-2.5 h-2.5" /> Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <p className="text-[10px] text-muted-foreground italic">None yet</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </CardContent>
  </Card>
);

// ─── Variant 6: Minimal Flat ───────────────────────────────────────────────────
const Variant6 = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Variant 6 — Minimal Flat</CardTitle>
      <p className="text-xs text-muted-foreground">No nested cards — clean flat sections separated by subtle dividers</p>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="bg-muted/30 rounded-xl p-4 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Timer className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <span className="font-semibold">Test Countdown</span>
              <p className="text-[10px] text-muted-foreground">3 recurring · 0 special events</p>
            </div>
          </div>
          <Button size="sm" className="bg-primary hover:bg-primary/90 h-8">
            <Check className="w-3.5 h-3.5 mr-1.5" /> Save
          </Button>
        </div>

        {/* Calendar */}
        <UpcomingCalendar countdownConfig={config} />

        <div className="border-t border-dashed" />

        {/* Recurring section — flat */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recurring Events</h3>
            <Button size="sm" className="h-6 text-xs gap-1 bg-accent text-accent-foreground hover:bg-accent/80">
              <Plus className="w-3 h-3" /> Add
            </Button>
          </div>
          <div className="space-y-1">
            {config.schedules.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-primary bg-primary/10 rounded px-1.5 py-0.5">{['SUN','MON','TUE','WED','THU','FRI','SAT'][s.day]}</span>
                  <span className="text-sm">{s.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{String(s.hour).padStart(2,'0')}:{String(s.minute).padStart(2,'0')} · {s.duration}min</span>
                  <Trash2 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-pointer hover:text-destructive transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-dashed" />

        {/* Special section — flat */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Special Events</h3>
            <Button size="sm" className="h-6 text-xs gap-1 bg-accent text-accent-foreground hover:bg-accent/80">
              <Plus className="w-3 h-3" /> Add
            </Button>
          </div>
          <p className="text-xs text-muted-foreground italic pl-3">No special events added yet.</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// ─── Showcase ───────────────────────────────────────────────────────────────────
const CountersPageShowcase = () => (
  <div className="max-w-5xl mx-auto p-6 space-y-8">
    <div>
      <h1 className="text-2xl font-bold">Counters Page — Redesign Showcase</h1>
      <p className="text-muted-foreground mt-1">6 layout options using the current event data. The "Counters &gt; Test Countdown" breadcrumb and action buttons remain consistent.</p>
    </div>
    <Variant1 />
    <Variant2 />
    <Variant3 />
    <Variant4 />
    <Variant5 />
    <Variant6 />
  </div>
);

export default CountersPageShowcase;
