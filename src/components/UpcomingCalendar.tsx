import { useState, useMemo, useRef, useCallback } from 'react';
import { format, addDays, isSameDay, isToday, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CountdownConfig, getScheduleCandidates } from './ServiceCountdownWidget';
import { useIsMobile } from '@/hooks/use-mobile';

interface CalendarEvent {
  date: Date;
  title: string;
  time: string;
  duration: number;
}

interface UpcomingCalendarProps {
  countdownConfig: CountdownConfig;
  onResetToToday?: () => void;
  registerReset?: (fn: () => void) => void;
}

function getEventsForRange(config: CountdownConfig, startDate: Date, days: number): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const endDate = addDays(startDate, days);

  for (const s of config.schedules) {
    const candidates = getScheduleCandidates(s, startDate, days + 4);
    for (const d of candidates) {
      if (d >= startOfDay(startDate) && d < startOfDay(endDate)) {
        events.push({
          date: d,
          title: s.title,
          time: `${String(s.hour).padStart(2, '0')}:${String(s.minute).padStart(2, '0')}`,
          duration: s.duration || 60,
        });
      }
    }
  }

  for (const ev of config.specialEvents) {
    const [y, m, d] = ev.date.split('-').map(Number);
    const evDate = new Date(y, m - 1, d, ev.hour, ev.minute);
    if (evDate >= startOfDay(startDate) && evDate < startOfDay(endDate)) {
      events.push({
        date: evDate,
        title: ev.title,
        time: `${String(ev.hour).padStart(2, '0')}:${String(ev.minute).padStart(2, '0')}`,
        duration: ev.duration || 60,
      });
    }
  }

  return events;
}

const UpcomingCalendar = ({ countdownConfig, registerReset }: UpcomingCalendarProps) => {
  const isMobile = useIsMobile();
  const [offset, setOffset] = useState(0);
  const [sliding, setSliding] = useState<'left' | 'right' | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Register reset-to-today function for parent to call
  const resetToToday = useCallback(() => {
    setOffset(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, []);

  useState(() => {
    registerReset?.(resetToToday);
  });
  const VISIBLE_DAYS = isMobile ? 6 : 11;
  const TOTAL_MOBILE_DAYS = 21; // preload for swipe
  const startDate = addDays(new Date(), isMobile ? 0 : offset);
  const days = Array.from({ length: isMobile ? TOTAL_MOBILE_DAYS : VISIBLE_DAYS }, (_, i) => addDays(startDate, i));

  const allEvents = useMemo(
    () => getEventsForRange(countdownConfig, startDate, isMobile ? TOTAL_MOBILE_DAYS : VISIBLE_DAYS),
    [countdownConfig, offset, isMobile]
  );

  const getEventsForDay = (date: Date) => allEvents.filter(e => isSameDay(e.date, date));

  const navigate = useCallback((direction: 'left' | 'right') => {
    setSliding(direction);
    setTimeout(() => {
      setOffset(prev => prev + (direction === 'right' ? VISIBLE_DAYS : -VISIBLE_DAYS));
      setSliding(null);
    }, 280);
  }, [VISIBLE_DAYS]);

  // Mobile: horizontal scroll, no arrows
  if (isMobile) {
    return (
      <div
        ref={scrollRef}
        className="flex gap-1 w-full overflow-x-auto pdfg-scrollbar-hidden snap-x snap-mandatory pb-1"
      >
        {days.map((day) => {
          const events = getEventsForDay(day);
          const hasEvent = events.length > 0;
          const dayIsToday = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={`flex flex-col items-center flex-shrink-0 snap-start px-2 py-2 rounded-lg transition-all border
                ${dayIsToday
                  ? 'bg-primary text-primary-foreground border-primary min-w-[52px]'
                  : hasEvent
                    ? 'bg-primary/5 border-primary/20 min-w-[52px]'
                    : 'border-transparent min-w-[44px]'
                }`}
            >
              <span className={`text-[10px] uppercase ${dayIsToday ? 'opacity-80' : 'opacity-70'}`}>
                {format(day, 'EEE')}
              </span>
              <span className="text-sm font-bold">{format(day, 'd')}</span>
              {dayIsToday && (
                <span className="text-[8px] font-semibold uppercase tracking-wide opacity-70">
                  Today
                </span>
              )}
              {hasEvent && !dayIsToday && (
                <span className="text-[9px] mt-0.5 truncate max-w-[48px] text-primary">
                  {events[0].title.length > 6 ? events[0].title.slice(0, 6) + '…' : events[0].title}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Desktop: arrows + sliding animation
  return (
    <div className="flex items-center gap-1 w-full">
      <button
        onClick={() => navigate('left')}
        className="flex-shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        aria-label="Show previous days"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <div className="flex-1 min-w-0 overflow-visible">
        <div
          className={`flex gap-1 transition-all duration-[280ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
            sliding === 'right' ? '-translate-x-full opacity-0' :
            sliding === 'left' ? 'translate-x-full opacity-0' :
            'translate-x-0 opacity-100'
          }`}
        >
          {days.map((day) => {
            const events = getEventsForDay(day);
            const hasEvent = events.length > 0;
            const dayIsToday = isToday(day);

            return (
              <div key={day.toISOString()} className="relative flex-1 min-w-0 group">
                <button
                  className={`flex flex-col items-center w-full px-1.5 py-2 rounded-lg transition-all border
                    ${dayIsToday
                      ? 'bg-primary text-primary-foreground border-primary'
                      : hasEvent
                        ? 'bg-primary/5 border-primary/20 hover:border-primary/40'
                        : 'border-transparent hover:bg-muted/30'
                    }`}
                >
                  <span className={`text-[10px] uppercase ${dayIsToday ? 'opacity-80' : 'opacity-70'}`}>
                    {format(day, 'EEE')}
                  </span>
                  <span className="text-sm font-bold">{format(day, 'd')}</span>
                  {dayIsToday && (
                    <span className="text-[8px] font-semibold uppercase tracking-wide opacity-70">
                      Today
                    </span>
                  )}
                  {hasEvent && !dayIsToday && (
                    <span className="text-[9px] mt-0.5 truncate max-w-[56px] text-primary">
                      {events[0].title.length > 8 ? events[0].title.slice(0, 8) + '…' : events[0].title}
                    </span>
                  )}
                </button>
                {/* Hover-expand: event details card drops below the day cell */}
                {hasEvent && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
                    <div className="bg-card border border-border rounded-lg shadow-lg p-2.5">
                      <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">{format(day, 'EEEE, MMM d')}</p>
                      {events.map((e, i) => (
                        <div key={i} className="text-xs mb-1 last:mb-0">
                          <p className="font-medium leading-tight">{e.title}</p>
                          <p className="text-muted-foreground text-[10px] mt-0.5">{e.time} · {e.duration} min</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <button
        onClick={() => navigate('right')}
        className="flex-shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        aria-label="Show next days"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default UpcomingCalendar;
