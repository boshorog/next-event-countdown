import { useState } from 'react';
import { format, addDays, isSameDay, isToday } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Sample events for demo
const baseDate = new Date();
const sampleEvents = [
  { date: baseDate, title: 'Morning Prayer', time: '10:00 AM', duration: 60 },
  { date: addDays(baseDate, 1), title: 'Bible Study', time: '7:00 PM', duration: 90 },
  { date: addDays(baseDate, 3), title: 'Sunday Service', time: '10:00 AM', duration: 120 },
  { date: addDays(baseDate, 3), title: 'Youth Group', time: '5:00 PM', duration: 60 },
  { date: addDays(baseDate, 5), title: 'Choir Practice', time: '6:30 PM', duration: 90 },
  { date: addDays(baseDate, 7), title: 'Sunday Service', time: '10:00 AM', duration: 120 },
  { date: addDays(baseDate, 9), title: 'Community Dinner', time: '6:00 PM', duration: 120 },
  { date: addDays(baseDate, 12), title: 'Prayer Meeting', time: '7:00 PM', duration: 60 },
  { date: addDays(baseDate, 15), title: 'Worship Night', time: '6:00 PM', duration: 120 },
];

const getEventsForDay = (date: Date) => sampleEvents.filter(e => isSameDay(e.date, date));

const UpcomingCalendar = () => {
  const [offset, setOffset] = useState(0);
  const VISIBLE_DAYS = 11;
  const startDate = addDays(new Date(), offset);
  const days = Array.from({ length: VISIBLE_DAYS }, (_, i) => addDays(startDate, i));

  return (
    <div className="flex items-center gap-1 w-full">
      <div className="flex gap-0.5 flex-1 min-w-0">
        {days.map((day) => {
          const events = getEventsForDay(day);
          const hasEvent = events.length > 0;
          const dayIsToday = isToday(day);

          return (
            <TooltipProvider key={day.toISOString()} delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className={`flex flex-col items-center flex-1 min-w-0 py-2 group transition-all rounded-lg
                    ${dayIsToday ? 'bg-primary text-primary-foreground' : ''}`}
                  >
                    <span className={`text-[10px] uppercase font-medium ${dayIsToday ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {format(day, 'EEE')}
                    </span>
                    <span className={`text-sm font-bold my-0.5 ${dayIsToday ? 'text-primary-foreground' : 'text-foreground'}`}>
                      {format(day, 'd')}
                    </span>
                    <div className={`w-8 h-1 rounded-full transition-all ${
                      hasEvent
                        ? dayIsToday ? 'bg-primary-foreground/70' : 'bg-primary/40 group-hover:bg-primary/70'
                        : 'bg-transparent'
                    }`} />
                  </button>
                </TooltipTrigger>
                {hasEvent && (
                  <TooltipContent side="bottom">
                    <div className="space-y-1.5">
                      {events.map((e, i) => (
                        <div key={i} className="text-xs">
                          <span className="font-semibold">{e.title}</span>
                          <br />
                          <span className="opacity-75">{e.time} · {e.duration} min</span>
                        </div>
                      ))}
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
      <button
        onClick={() => setOffset(prev => prev + VISIBLE_DAYS)}
        className="flex-shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        aria-label="Show next days"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default UpcomingCalendar;
