import { useState, useRef, useEffect } from "react";
import { Plus, Trash2, CalendarIcon, ChevronDown, ChevronRight, RefreshCw, Star } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  CountdownConfig,
  TIMEZONE_OPTIONS,
  type ServiceSchedule,
  type SpecialEvent,
  type RecurrenceType,
} from "./ServiceCountdownWidget";

const DAY_OPTIONS = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

const DAY_FULL = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];
const DAY_FULL_SINGULAR = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const RECURRENCE_OPTIONS: { value: RecurrenceType; label: string; description: string }[] = [
  { value: "weekly", label: "Weekly", description: "Every week on a specific day" },
  { value: "biweekly", label: "Bi-weekly", description: "Every two weeks" },
  { value: "monthly-dow", label: "Monthly (by day)", description: "E.g. 1st Sunday of each month" },
  { value: "monthly-date", label: "Monthly (by date)", description: "E.g. the 15th of each month" },
  { value: "daily", label: "Daily", description: "Every day at the same time" },
];

const RECURRENCE_SHORT: Record<RecurrenceType, string> = {
  weekly: "Weekly",
  biweekly: "Bi-weekly",
  "monthly-dow": "Monthly",
  "monthly-date": "Monthly",
  daily: "Daily",
};

const MONTHLY_WEEK_OPTIONS = [
  { value: "1", label: "1st" },
  { value: "2", label: "2nd" },
  { value: "3", label: "3rd" },
  { value: "4", label: "4th" },
  { value: "-1", label: "Last" },
];

const DURATION_OPTIONS = [
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
  { value: "180", label: "3 hours" },
  { value: "240", label: "4 hours" },
];

const minimalCalendarClassNames = {
  months: "flex flex-col",
  month: "space-y-4",
  caption: "flex justify-center pt-1 relative items-center",
  caption_label: "text-sm font-semibold tracking-tight",
  nav: "space-x-1 flex items-center",
  nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent rounded-lg transition-colors inline-flex items-center justify-center",
  nav_button_previous: "absolute left-1",
  nav_button_next: "absolute right-1",
  table: "w-full border-collapse",
  head_row: "flex",
  head_cell: "text-muted-foreground rounded-md w-10 font-medium text-[0.75rem] uppercase tracking-wider",
  row: "flex w-full mt-1",
  cell: "h-10 w-10 text-center text-sm p-0 relative rounded-lg focus-within:relative focus-within:z-20",
  day: "h-10 w-10 p-0 font-normal rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors aria-selected:opacity-100 inline-flex items-center justify-center",
  day_range_end: "day-range-end",
  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-lg",
  day_today: "bg-accent text-accent-foreground font-semibold",
  day_outside: "text-muted-foreground opacity-40",
  day_disabled: "text-muted-foreground opacity-50",
  day_hidden: "invisible",
};

interface EventScheduleManagerProps {
  config: CountdownConfig;
  onChange: (config: CountdownConfig) => void;
}

/** Build a human-readable summary for a recurring schedule */
function scheduleSummary(s: ServiceSchedule): string {
  const time = `${String(s.hour).padStart(2, '0')}:${String(s.minute).padStart(2, '0')}`;
  const dur = s.duration ? `${s.duration} min` : '60 min';
  const type = s.recurrenceType || 'weekly';

  if (type === 'daily') return `Daily · ${time} · ${dur}`;
  if (type === 'weekly') return `${DAY_FULL[s.day]} · ${time} · ${dur}`;
  if (type === 'biweekly') return `Every 2 wks · ${DAY_FULL[s.day]} · ${time}`;
  if (type === 'monthly-dow') {
    const w = MONTHLY_WEEK_OPTIONS.find(o => o.value === String(s.monthlyWeek || 1))?.label || '1st';
    return `${w} ${DAY_FULL_SINGULAR[s.day]} monthly · ${time}`;
  }
  if (type === 'monthly-date') return `${s.monthlyDay || 1}th monthly · ${time}`;
  return `${time} · ${dur}`;
}

/** Build a human-readable summary for a special event */
function specialSummary(ev: SpecialEvent): string {
  const time = `${String(ev.hour).padStart(2, '0')}:${String(ev.minute).padStart(2, '0')}`;
  const dur = ev.duration ? `${ev.duration} min` : '60 min';
  return `${ev.date} · ${time} · ${dur}`;
}

const EventScheduleManager = ({ config, onChange }: EventScheduleManagerProps) => {
  const [openRecurring, setOpenRecurring] = useState<number | null>(null);
  const [openSpecial, setOpenSpecial] = useState<number | null>(null);
  const recurringListRef = useRef<HTMLDivElement>(null);
  const specialListRef = useRef<HTMLDivElement>(null);

  const update = <K extends keyof CountdownConfig>(key: K, val: CountdownConfig[K]) =>
    onChange({ ...config, [key]: val });

  const updateSchedule = (idx: number, patch: Partial<ServiceSchedule>) => {
    const next = config.schedules.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    update("schedules", next);
  };

  const removeSchedule = (idx: number) => {
    update("schedules", config.schedules.filter((_, i) => i !== idx));
    if (openRecurring === idx) setOpenRecurring(null);
  };

  const addSchedule = () => {
    update("schedules", [...config.schedules, { recurrenceType: "weekly" as RecurrenceType, day: 0, hour: 10, minute: 0, title: "New Service", timezone: "America/New_York", duration: 60 }]);
    setOpenRecurring(config.schedules.length);
    setTimeout(() => {
      recurringListRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const updateSpecial = (idx: number, patch: Partial<SpecialEvent>) => {
    const next = config.specialEvents.map((e, i) => (i === idx ? { ...e, ...patch } : e));
    update("specialEvents", next);
  };

  const removeSpecial = (idx: number) => {
    update("specialEvents", config.specialEvents.filter((_, i) => i !== idx));
    if (openSpecial === idx) setOpenSpecial(null);
  };

  const addSpecial = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const iso = tomorrow.toISOString().slice(0, 10);
    update("specialEvents", [...config.specialEvents, { date: iso, hour: 10, minute: 0, title: "Special Service", timezone: "America/New_York", duration: 60 }]);
    setOpenSpecial(config.specialEvents.length);
    setTimeout(() => {
      specialListRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const renderRecurrenceFields = (s: ServiceSchedule, i: number) => {
    const type = s.recurrenceType || "weekly";

    return (
      <>
        {/* Recurrence type */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Recurrence</Label>
          <Select value={type} onValueChange={(v) => updateSchedule(i, { recurrenceType: v as RecurrenceType })}>
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {RECURRENCE_OPTIONS.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  <span>{r.label}</span>
                  <span className="text-muted-foreground ml-1 text-xs">— {r.description}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {type === "daily" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Timezone</Label>
              <Select value={s.timezone || "America/New_York"} onValueChange={(v) => updateSchedule(i, { timezone: v })}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIMEZONE_OPTIONS.map((tz) => <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div />
          </div>
        )}

        {(type === "weekly" || type === "biweekly") && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Day</Label>
              <Select value={String(s.day)} onValueChange={(v) => updateSchedule(i, { day: parseInt(v) })}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DAY_OPTIONS.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Timezone</Label>
              <Select value={s.timezone || "America/New_York"} onValueChange={(v) => updateSchedule(i, { timezone: v })}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIMEZONE_OPTIONS.map((tz) => <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {type === "biweekly" && (
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Starting from (anchor date)</Label>
            <Input type="date" value={s.biweeklyStart || ""} onChange={(e) => updateSchedule(i, { biweeklyStart: e.target.value })} className="h-8 text-sm" />
          </div>
        )}

        {type === "monthly-dow" && (
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Week</Label>
              <Select value={String(s.monthlyWeek || 1)} onValueChange={(v) => updateSchedule(i, { monthlyWeek: parseInt(v) })}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MONTHLY_WEEK_OPTIONS.map((w) => <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Day</Label>
              <Select value={String(s.day)} onValueChange={(v) => updateSchedule(i, { day: parseInt(v) })}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DAY_OPTIONS.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Timezone</Label>
              <Select value={s.timezone || "America/New_York"} onValueChange={(v) => updateSchedule(i, { timezone: v })}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIMEZONE_OPTIONS.map((tz) => <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {type === "monthly-date" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Day of Month</Label>
              <Input type="number" min={1} max={31} value={s.monthlyDay || 1} onChange={(e) => updateSchedule(i, { monthlyDay: parseInt(e.target.value) || 1 })} className="h-8 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Timezone</Label>
              <Select value={s.timezone || "America/New_York"} onValueChange={(v) => updateSchedule(i, { timezone: v })}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIMEZONE_OPTIONS.map((tz) => <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Time + Duration fields */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Hour</Label>
            <Input type="number" min={0} max={23} value={s.hour} onChange={(e) => updateSchedule(i, { hour: parseInt(e.target.value) || 0 })} className="h-8 text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Minute</Label>
            <Input type="number" min={0} max={59} value={s.minute} onChange={(e) => updateSchedule(i, { minute: parseInt(e.target.value) || 0 })} className="h-8 text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Duration</Label>
            <Select value={String(s.duration || 60)} onValueChange={(v) => updateSchedule(i, { duration: parseInt(v) })}>
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {DURATION_OPTIONS.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      {/* Recurring Events */}
      <Card>
        <CardHeader className="pb-2 pt-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm flex items-center gap-2"><RefreshCw className="w-4 h-4 text-primary" /> Recurring Events</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Weekly, bi-weekly, and monthly schedules</p>
            </div>
            <Button size="sm" onClick={addSchedule} className="h-7 text-xs gap-1 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-3 h-3" /> Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-1.5" ref={recurringListRef}>
          {config.schedules.length === 0 && (
            <p className="text-xs text-muted-foreground italic text-center py-6">No recurring events added.</p>
          )}
          {config.schedules.map((s, i) => {
            const isOpen = openRecurring === i;
            return (
              <Collapsible key={i} open={isOpen} onOpenChange={(open) => setOpenRecurring(open ? i : null)}>
                <div className="border border-border rounded-lg overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <button className="w-full flex items-center justify-between px-3 py-2.5 bg-primary/5 hover:bg-primary/10 transition-colors text-left">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{s.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{scheduleSummary(s)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost" size="sm"
                        onClick={(e) => { e.stopPropagation(); removeSchedule(i); }}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive flex-shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-3 pb-3 pt-1 space-y-3 border-t border-border">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground">Event Title</Label>
                        <Input value={s.title} onChange={(v) => updateSchedule(i, { title: v.target.value })} className="h-8 text-sm" />
                      </div>
                      {renderRecurrenceFields(s, i)}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}
        </CardContent>
      </Card>

      {/* Special Events */}
      <Card>
        <CardHeader className="pb-2 pt-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm flex items-center gap-2"><Star className="w-4 h-4 text-primary" /> Special Events</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">One-time events on specific dates</p>
            </div>
            <Button size="sm" onClick={addSpecial} className="h-7 text-xs gap-1 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-3 h-3" /> Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-1.5" ref={specialListRef}>
          {config.specialEvents.length === 0 && (
            <p className="text-xs text-muted-foreground italic text-center py-6">No special events added.</p>
          )}
          {config.specialEvents.map((ev, i) => {
            const isOpen = openSpecial === i;
            return (
              <Collapsible key={i} open={isOpen} onOpenChange={(open) => setOpenSpecial(open ? i : null)}>
                <div className="border border-border rounded-lg overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <button className="w-full flex items-center justify-between px-3 py-2.5 bg-primary/5 hover:bg-primary/10 transition-colors text-left">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{ev.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{specialSummary(ev)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost" size="sm"
                        onClick={(e) => { e.stopPropagation(); removeSpecial(i); }}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive flex-shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-3 pb-3 pt-1 space-y-3 border-t border-border">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground">Event Title</Label>
                        <Input value={ev.title} onChange={(v) => updateSpecial(i, { title: v.target.value })} className="h-8 text-sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-muted-foreground">Date</Label>
                          <DatePickerField value={ev.date} onChange={(date) => updateSpecial(i, { date })} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-muted-foreground">Timezone</Label>
                          <Select value={ev.timezone || "America/New_York"} onValueChange={(v) => updateSpecial(i, { timezone: v })}>
                            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {TIMEZONE_OPTIONS.map((tz) => <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-muted-foreground">Hour</Label>
                          <Input type="number" min={0} max={23} value={ev.hour} onChange={(e) => updateSpecial(i, { hour: parseInt(e.target.value) || 0 })} className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-muted-foreground">Minute</Label>
                          <Input type="number" min={0} max={59} value={ev.minute} onChange={(e) => updateSpecial(i, { minute: parseInt(e.target.value) || 0 })} className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-muted-foreground">Duration</Label>
                          <Select value={String(ev.duration || 60)} onValueChange={(v) => updateSpecial(i, { duration: parseInt(v) })}>
                            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {DURATION_OPTIONS.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

/** Minimal Clean date picker using Variant 1 calendar style */
const DatePickerField = ({ value, onChange }: { value: string; onChange: (iso: string) => void }) => {
  const parsed = value ? new Date(value + "T00:00:00") : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-8 text-sm rounded-lg border-border",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-3.5 w-3.5 opacity-60" />
          {parsed ? format(parsed, "MMMM d, yyyy") : "Select a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-xl shadow-lg border-border" align="start">
        <Calendar
          mode="single"
          selected={parsed}
          onSelect={(d) => {
            if (d) {
              const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
              onChange(iso);
            }
          }}
          initialFocus
          className="p-4 pointer-events-auto"
          classNames={minimalCalendarClassNames}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EventScheduleManager;
