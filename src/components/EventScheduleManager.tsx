import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CountdownConfig,
  TIMEZONE_OPTIONS,
  type ServiceSchedule,
  type SpecialEvent,
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

interface EventScheduleManagerProps {
  config: CountdownConfig;
  onChange: (config: CountdownConfig) => void;
}

const EventScheduleManager = ({ config, onChange }: EventScheduleManagerProps) => {
  const update = <K extends keyof CountdownConfig>(key: K, val: CountdownConfig[K]) =>
    onChange({ ...config, [key]: val });

  const updateSchedule = (idx: number, patch: Partial<ServiceSchedule>) => {
    const next = config.schedules.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    update("schedules", next);
  };

  const removeSchedule = (idx: number) => update("schedules", config.schedules.filter((_, i) => i !== idx));

  const addSchedule = () =>
    update("schedules", [...config.schedules, { day: 0, hour: 10, minute: 0, title: "New event", timezone: "Europe/Bucharest" }]);

  const updateSpecial = (idx: number, patch: Partial<SpecialEvent>) => {
    const next = config.specialEvents.map((e, i) => (i === idx ? { ...e, ...patch } : e));
    update("specialEvents", next);
  };

  const removeSpecial = (idx: number) => update("specialEvents", config.specialEvents.filter((_, i) => i !== idx));

  const addSpecial = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const iso = tomorrow.toISOString().slice(0, 10);
    update("specialEvents", [...config.specialEvents, { date: iso, hour: 10, minute: 0, title: "Special event", timezone: "Europe/Bucharest" }]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Recurring Events */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recurring Events</CardTitle>
            <Button variant="outline" size="sm" onClick={addSchedule} className="h-7 text-xs gap-1">
              <Plus className="w-3 h-3" /> Add
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Events that repeat every week on the same day and time.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {config.schedules.length === 0 && (
            <p className="text-xs text-muted-foreground italic">No recurring events added.</p>
          )}
          {config.schedules.map((s, i) => (
            <div key={i} className="p-3 border border-border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Event {i + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeSchedule(i)} className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
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
                  <Select value={s.timezone || "Europe/Bucharest"} onValueChange={(v) => updateSchedule(i, { timezone: v })}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TIMEZONE_OPTIONS.map((tz) => <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Hour</Label>
                  <Input type="number" min={0} max={23} value={s.hour} onChange={(e) => updateSchedule(i, { hour: parseInt(e.target.value) || 0 })} className="h-8 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Minute</Label>
                  <Input type="number" min={0} max={59} value={s.minute} onChange={(e) => updateSchedule(i, { minute: parseInt(e.target.value) || 0 })} className="h-8 text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Event Title</Label>
                <Input value={s.title} onChange={(v) => updateSchedule(i, { title: v.target.value })} className="h-8 text-sm" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Special (Non-Recurring) Events */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Special Events</CardTitle>
            <Button variant="outline" size="sm" onClick={addSpecial} className="h-7 text-xs gap-1">
              <Plus className="w-3 h-3" /> Add
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">One-time events on a specific date that won't repeat.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {config.specialEvents.length === 0 && (
            <p className="text-xs text-muted-foreground italic">No special events added.</p>
          )}
          {config.specialEvents.map((ev, i) => (
            <div key={i} className="p-3 border border-border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Event {i + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeSpecial(i)} className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Date</Label>
                  <Input type="date" value={ev.date} onChange={(e) => updateSpecial(i, { date: e.target.value })} className="h-8 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Timezone</Label>
                  <Select value={ev.timezone || "Europe/Bucharest"} onValueChange={(v) => updateSpecial(i, { timezone: v })}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TIMEZONE_OPTIONS.map((tz) => <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Hour</Label>
                  <Input type="number" min={0} max={23} value={ev.hour} onChange={(e) => updateSpecial(i, { hour: parseInt(e.target.value) || 0 })} className="h-8 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Minute</Label>
                  <Input type="number" min={0} max={59} value={ev.minute} onChange={(e) => updateSpecial(i, { minute: parseInt(e.target.value) || 0 })} className="h-8 text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Event Title</Label>
                <Input value={ev.title} onChange={(v) => updateSpecial(i, { title: v.target.value })} className="h-8 text-sm" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventScheduleManager;
