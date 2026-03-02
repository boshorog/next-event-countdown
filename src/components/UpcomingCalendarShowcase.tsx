import { useState } from 'react';
import { format, addDays, isSameDay, isToday } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Sample events for demo
const today = new Date();
const sampleEvents = [
  { date: today, title: 'Morning Prayer', time: '10:00 AM', duration: 60 },
  { date: addDays(today, 1), title: 'Bible Study', time: '7:00 PM', duration: 90 },
  { date: addDays(today, 3), title: 'Sunday Service', time: '10:00 AM', duration: 120 },
  { date: addDays(today, 3), title: 'Youth Group', time: '5:00 PM', duration: 60 },
  { date: addDays(today, 5), title: 'Choir Practice', time: '6:30 PM', duration: 90 },
  { date: addDays(today, 7), title: 'Sunday Service', time: '10:00 AM', duration: 120 },
  { date: addDays(today, 9), title: 'Community Dinner', time: '6:00 PM', duration: 120 },
];

const getDays = (count: number) => Array.from({ length: count }, (_, i) => addDays(today, i));
const getEventsForDay = (date: Date) => sampleEvents.filter(e => isSameDay(e.date, date));

const EventTooltipContent = ({ events }: { events: typeof sampleEvents }) => (
  <div className="space-y-1.5">
    {events.map((e, i) => (
      <div key={i} className="text-xs">
        <span className="font-semibold">{e.title}</span>
        <br />
        <span className="opacity-75">{e.time} · {e.duration} min</span>
      </div>
    ))}
  </div>
);

// ─── Variant 1: Pill Strip ─────────────────────────────────────────────────────
const Variant1 = () => {
  const days = getDays(11);
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Variant 1 — Pill Strip</CardTitle>
        <p className="text-xs text-muted-foreground">Compact pills with dot indicators</p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {days.map((day) => {
            const events = getEventsForDay(day);
            const hasEvent = events.length > 0;
            const dayIsToday = isToday(day);
            return (
              <TooltipProvider key={day.toISOString()} delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`flex flex-col items-center min-w-[52px] px-2 py-2 rounded-full transition-all text-xs
                        ${dayIsToday 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : hasEvent 
                            ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        }`}
                    >
                      <span className="text-[10px] font-medium uppercase">{format(day, 'EEE')}</span>
                      <span className="text-sm font-bold">{format(day, 'd')}</span>
                      {hasEvent && (
                        <div className="flex gap-0.5 mt-0.5">
                          {events.slice(0, 3).map((_, i) => (
                            <span key={i} className={`w-1 h-1 rounded-full ${dayIsToday ? 'bg-primary-foreground' : 'bg-primary'}`} />
                          ))}
                        </div>
                      )}
                    </button>
                  </TooltipTrigger>
                  {hasEvent && (
                    <TooltipContent side="bottom"><EventTooltipContent events={events} /></TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Variant 2: Card Row ────────────────────────────────────────────────────────
const Variant2 = () => {
  const days = getDays(11);
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Variant 2 — Card Tiles</CardTitle>
        <p className="text-xs text-muted-foreground">Square tiles with accent border on event days</p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {days.map((day) => {
            const events = getEventsForDay(day);
            const hasEvent = events.length > 0;
            const dayIsToday = isToday(day);
            return (
              <TooltipProvider key={day.toISOString()} delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`flex flex-col items-center justify-center min-w-[50px] h-[54px] rounded-lg border transition-all text-xs
                        ${dayIsToday 
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                          : hasEvent 
                            ? 'border-primary/50 bg-primary/5 text-foreground hover:border-primary' 
                            : 'border-border bg-background text-muted-foreground hover:bg-muted/30'
                        }`}
                    >
                      <span className="text-[10px] uppercase opacity-70">{format(day, 'EEE')}</span>
                      <span className="text-sm font-bold">{format(day, 'd')}</span>
                    </button>
                  </TooltipTrigger>
                  {hasEvent && (
                    <TooltipContent side="bottom"><EventTooltipContent events={events} /></TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Variant 3: Timeline Dots ───────────────────────────────────────────────────
const Variant3 = () => {
  const days = getDays(11);
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Variant 3 — Timeline Dots</CardTitle>
        <p className="text-xs text-muted-foreground">Horizontal timeline with connected dots</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-0 overflow-x-auto pb-1">
          {days.map((day, idx) => {
            const events = getEventsForDay(day);
            const hasEvent = events.length > 0;
            const dayIsToday = isToday(day);
            return (
              <TooltipProvider key={day.toISOString()} delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <div className="flex flex-col items-center min-w-[48px] cursor-pointer">
                        <span className="text-[10px] text-muted-foreground uppercase mb-1">{format(day, 'EEE')}</span>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all
                          ${dayIsToday 
                            ? 'bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-1 ring-offset-background' 
                            : hasEvent 
                              ? 'bg-primary/20 text-primary' 
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {format(day, 'd')}
                        </div>
                        <span className="text-[9px] text-muted-foreground mt-1">{format(day, 'MMM')}</span>
                      </div>
                      {idx < days.length - 1 && (
                        <div className="w-3 h-px bg-border flex-shrink-0" />
                      )}
                    </div>
                  </TooltipTrigger>
                  {hasEvent && (
                    <TooltipContent side="bottom"><EventTooltipContent events={events} /></TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Variant 4: Gradient Blocks ─────────────────────────────────────────────────
const Variant4 = () => {
  const days = getDays(11);
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Variant 4 — Gradient Blocks</CardTitle>
        <p className="text-xs text-muted-foreground">Event days glow with gradient intensity by event count</p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {days.map((day) => {
            const events = getEventsForDay(day);
            const hasEvent = events.length > 0;
            const dayIsToday = isToday(day);
            const intensity = Math.min(events.length * 15 + 10, 40);
            return (
              <TooltipProvider key={day.toISOString()} delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`flex flex-col items-center justify-center min-w-[50px] h-[52px] rounded-md transition-all text-xs
                        ${dayIsToday 
                          ? 'bg-primary text-primary-foreground shadow-md' 
                          : 'text-foreground hover:opacity-80'
                        }`}
                      style={!dayIsToday ? {
                        backgroundColor: hasEvent 
                          ? `hsl(var(--primary) / ${intensity / 100})` 
                          : 'hsl(var(--muted) / 0.3)'
                      } : undefined}
                    >
                      <span className="text-[10px] uppercase opacity-70">{format(day, 'EEE')}</span>
                      <span className="text-sm font-bold">{format(day, 'd')}</span>
                    </button>
                  </TooltipTrigger>
                  {hasEvent && (
                    <TooltipContent side="bottom"><EventTooltipContent events={events} /></TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Variant 5: Underline Accent ────────────────────────────────────────────────
const Variant5 = () => {
  const days = getDays(11);
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Variant 5 — Underline Accent</CardTitle>
        <p className="text-xs text-muted-foreground">Clean text with colored underline bars for events</p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-0.5 overflow-x-auto pb-1">
          {days.map((day) => {
            const events = getEventsForDay(day);
            const hasEvent = events.length > 0;
            const dayIsToday = isToday(day);
            return (
              <TooltipProvider key={day.toISOString()} delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="flex flex-col items-center min-w-[50px] py-1.5 group transition-all">
                      <span className={`text-[10px] uppercase ${dayIsToday ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                        {format(day, 'EEE')}
                      </span>
                      <span className={`text-sm font-bold my-0.5 ${dayIsToday ? 'text-primary' : 'text-foreground'}`}>
                        {format(day, 'd')}
                      </span>
                      <div className={`w-8 h-1 rounded-full transition-all ${
                        hasEvent 
                          ? dayIsToday ? 'bg-primary' : 'bg-primary/40 group-hover:bg-primary/70' 
                          : 'bg-transparent'
                      }`} />
                    </button>
                  </TooltipTrigger>
                  {hasEvent && (
                    <TooltipContent side="bottom"><EventTooltipContent events={events} /></TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Variant 6: Mini Agenda ─────────────────────────────────────────────────────
const Variant6 = () => {
  const days = getDays(11);
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Variant 6 — Mini Agenda</CardTitle>
        <p className="text-xs text-muted-foreground">Shows first event name inline under each day</p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {days.map((day) => {
            const events = getEventsForDay(day);
            const hasEvent = events.length > 0;
            const dayIsToday = isToday(day);
            return (
              <TooltipProvider key={day.toISOString()} delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`flex flex-col items-center min-w-[60px] px-1.5 py-2 rounded-lg transition-all border
                        ${dayIsToday 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : hasEvent 
                            ? 'bg-primary/5 border-primary/20 hover:border-primary/40' 
                            : 'border-transparent hover:bg-muted/30'
                        }`}
                    >
                      <span className="text-[10px] uppercase opacity-70">{format(day, 'EEE')}</span>
                      <span className="text-sm font-bold">{format(day, 'd')}</span>
                      {hasEvent && (
                        <span className={`text-[9px] mt-0.5 truncate max-w-[56px] ${dayIsToday ? 'opacity-80' : 'text-primary'}`}>
                          {events[0].title.length > 8 ? events[0].title.slice(0, 8) + '…' : events[0].title}
                        </span>
                      )}
                    </button>
                  </TooltipTrigger>
                  {hasEvent && (
                    <TooltipContent side="bottom"><EventTooltipContent events={events} /></TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Showcase Container ─────────────────────────────────────────────────────────
const UpcomingCalendarShowcase = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upcoming Days Calendar — Showcase</h1>
        <p className="text-muted-foreground mt-1">6 horizontal calendar variants showing today + next 10 days. Hover over colored days to see event details.</p>
      </div>
      <Variant1 />
      <Variant2 />
      <Variant3 />
      <Variant4 />
      <Variant5 />
      <Variant6 />
    </div>
  );
};

export default UpcomingCalendarShowcase;
