import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CalendarShowcase = () => {
  const [date1, setDate1] = useState<Date>();
  const [date2, setDate2] = useState<Date>();
  const [date3, setDate3] = useState<Date>();
  const [date4, setDate4] = useState<Date>();

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-10">
      <div>
        <h1 className="text-2xl font-bold mb-2">Calendar / Date Picker Showcase</h1>
        <p className="text-muted-foreground">Modern calendar variants for the Special Events date picker.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Variant 1: Minimal Clean */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Variant 1 — Minimal Clean</CardTitle>
            <p className="text-xs text-muted-foreground">Soft rounded corners, subtle hover, clean typography.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-10 rounded-lg border-border",
                    !date1 && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-60" />
                  {date1 ? format(date1, "MMMM d, yyyy") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-xl shadow-lg border-border" align="start">
                <Calendar
                  mode="single"
                  selected={date1}
                  onSelect={setDate1}
                  initialFocus
                  className="p-4 pointer-events-auto"
                  classNames={{
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
                  }}
                />
              </PopoverContent>
            </Popover>
            {date1 && <p className="text-xs text-muted-foreground">Selected: {format(date1, "PPP")}</p>}
          </CardContent>
        </Card>

        {/* Variant 2: Pill-shaped with accent ring */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Variant 2 — Pill Accent</CardTitle>
            <p className="text-xs text-muted-foreground">Pill-shaped selected state with accent ring on today.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-10 rounded-full border-border px-4",
                    !date2 && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {date2 ? format(date2, "EEE, MMM d") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl border-border/50" align="start">
                <Calendar
                  mode="single"
                  selected={date2}
                  onSelect={setDate2}
                  initialFocus
                  className="p-4 pointer-events-auto"
                  classNames={{
                    months: "flex flex-col",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-bold",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-primary/10 rounded-full transition-all inline-flex items-center justify-center",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse",
                    head_row: "flex",
                    head_cell: "text-muted-foreground w-10 font-medium text-[0.7rem] uppercase",
                    row: "flex w-full mt-1",
                    cell: "h-10 w-10 text-center text-sm p-0 relative",
                    day: "h-9 w-9 p-0 font-normal rounded-full hover:bg-primary/10 hover:text-primary transition-all aria-selected:opacity-100 inline-flex items-center justify-center mx-auto",
                    day_range_end: "day-range-end",
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-full shadow-md",
                    day_today: "ring-2 ring-primary/40 font-bold text-primary",
                    day_outside: "text-muted-foreground opacity-30",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_hidden: "invisible",
                  }}
                />
              </PopoverContent>
            </Popover>
            {date2 && <p className="text-xs text-muted-foreground">Selected: {format(date2, "PPP")}</p>}
          </CardContent>
        </Card>

        {/* Variant 3: Inline always-visible calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Variant 3 — Inline Card</CardTitle>
            <p className="text-xs text-muted-foreground">Always visible inline calendar, no popover needed.</p>
          </CardHeader>
          <CardContent>
            <div className="border border-border rounded-xl p-3 bg-card">
              <Calendar
                mode="single"
                selected={date3}
                onSelect={setDate3}
                className="pointer-events-auto p-0"
                classNames={{
                  months: "flex flex-col",
                  month: "space-y-3",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-semibold",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-60 hover:opacity-100 hover:bg-accent rounded-md transition-colors inline-flex items-center justify-center",
                  nav_button_previous: "absolute left-0",
                  nav_button_next: "absolute right-0",
                  table: "w-full border-collapse",
                  head_row: "flex",
                  head_cell: "text-muted-foreground w-9 font-medium text-[0.7rem]",
                  row: "flex w-full mt-1",
                  cell: "h-9 w-9 text-center text-sm p-0 relative",
                  day: "h-9 w-9 p-0 font-normal rounded-md hover:bg-primary/10 transition-colors aria-selected:opacity-100 inline-flex items-center justify-center",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium",
                  day_today: "bg-accent text-accent-foreground font-semibold rounded-md",
                  day_outside: "text-muted-foreground opacity-30",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_hidden: "invisible",
                }}
              />
            </div>
            {date3 && <p className="text-xs text-muted-foreground mt-2">Selected: {format(date3, "PPP")}</p>}
          </CardContent>
        </Card>

        {/* Variant 4: Dark floating with glass effect */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Variant 4 — Glass Floating</CardTitle>
            <p className="text-xs text-muted-foreground">Glass-morphism style with backdrop blur and soft glow.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-10 rounded-lg bg-secondary/50 border-border/60 backdrop-blur-sm",
                    !date4 && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary/70" />
                  {date4 ? format(date4, "dd/MM/yyyy") : "dd/mm/yyyy"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-primary/20 bg-popover/95 backdrop-blur-md" align="start">
                <Calendar
                  mode="single"
                  selected={date4}
                  onSelect={setDate4}
                  initialFocus
                  className="p-4 pointer-events-auto"
                  classNames={{
                    months: "flex flex-col",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-bold tracking-tight",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-primary/15 rounded-lg transition-all inline-flex items-center justify-center",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse",
                    head_row: "flex",
                    head_cell: "text-primary/50 w-10 font-semibold text-[0.65rem] uppercase tracking-widest",
                    row: "flex w-full mt-1",
                    cell: "h-10 w-10 text-center text-sm p-0 relative",
                    day: "h-9 w-9 p-0 font-normal rounded-xl hover:bg-primary/15 hover:text-primary transition-all aria-selected:opacity-100 inline-flex items-center justify-center mx-auto",
                    day_range_end: "day-range-end",
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-xl shadow-[0_0_12px_hsl(var(--primary)/0.4)]",
                    day_today: "border-2 border-primary/30 font-bold text-primary",
                    day_outside: "text-muted-foreground opacity-20",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_hidden: "invisible",
                  }}
                />
              </PopoverContent>
            </Popover>
            {date4 && <p className="text-xs text-muted-foreground">Selected: {format(date4, "PPP")}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarShowcase;
