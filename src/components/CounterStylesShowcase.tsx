import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Church } from 'lucide-react';
import { COUNTER_STYLE_OPTIONS } from './counterStyles/types';
import { STYLE_RENDERERS } from './counterStyles/renderers';
import type { CounterStyleRenderProps } from './counterStyles/types';

const demoProps: CounterStyleRenderProps = {
  days: 3, hours: 14, minutes: 27, seconds: 52,
  headerLabel: 'Next Event',
  eventTitle: 'Sunday Morning Worship',
  eventDate: 'March 8, 2026 at 10:00 AM',
  iconColor: '#6366f1',
  icon: Church,
  labelDays: 'Days',
  labelHours: 'Hours',
  labelMinutes: 'Minutes',
  labelSeconds: 'Seconds',
};

const CounterStylesShowcase = () => {
  const [selected, setSelected] = useState('default');
  const SelectedRenderer = STYLE_RENDERERS[selected];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          Counter Styles
          <Crown className="w-5 h-5 text-amber-500" />
        </h2>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          Choose from 8 unique countdown display styles. Each style includes the full widget layout — header, event info, countdown digits, and date.
        </p>
      </div>

      {/* Live full-size preview */}
      <Card className="border-primary/20 bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Full Preview</CardTitle>
            <Badge variant="secondary" className="text-xs">{COUNTER_STYLE_OPTIONS.find(s => s.id === selected)?.name}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {SelectedRenderer && <SelectedRenderer {...demoProps} />}
        </CardContent>
      </Card>

      {/* Style grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {COUNTER_STYLE_OPTIONS.map((style) => {
          const isSelected = selected === style.id;
          const Renderer = STYLE_RENDERERS[style.id];
          return (
            <button
              key={style.id}
              onClick={() => setSelected(style.id)}
              className={`relative text-left rounded-xl border-2 p-4 transition-all hover:shadow-md flex flex-col ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/30 bg-card'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center z-10">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <div className="space-y-3 flex flex-col flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{style.name}</span>
                  {!style.pro ? (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">Free</Badge>
                  ) : (
                    <Badge className="text-[10px] px-1.5 py-0 bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/10">Pro</Badge>
                  )}
                </div>
                {/* Mini preview */}
                <div className="rounded-lg overflow-hidden border border-border/50" style={{ transform: 'scale(0.65)', transformOrigin: 'top left', height: 130, width: '154%' }}>
                  {Renderer && <Renderer {...demoProps} />}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mt-auto">{style.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CounterStylesShowcase;
