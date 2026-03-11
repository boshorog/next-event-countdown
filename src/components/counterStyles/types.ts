export type CounterStyleId = 'default' | 'cards' | 'circles' | 'gradient' | 'bold' | 'dots' | 'elegant';

export interface CounterStyleOption {
  id: CounterStyleId;
  name: string;
  description: string;
  pro: boolean;
}

export interface CounterStyleRenderProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  headerLabel: string;
  eventTitle: string;
  eventDate: string;
  iconColor: string;
  icon: React.ComponentType<any>;
  labelDays: string;
  labelHours: string;
  labelMinutes: string;
  labelSeconds: string;
}

export const COUNTER_STYLE_OPTIONS: CounterStyleOption[] = [
  { id: 'default', name: 'Classic', description: 'Clean header row with large digits and colon separators', pro: false },
  { id: 'cards', name: 'Card Blocks', description: 'Each countdown unit in its own elevated card with event info below', pro: true },
  { id: 'circles', name: 'Radial Progress', description: 'Circular progress rings with centered event details', pro: true },
  { id: 'gradient', name: 'Gradient Glass', description: 'Frosted glass panels with gradient event header', pro: true },
  { id: 'bold', name: 'Bold Stack', description: 'Oversized stacked digits with prominent event title', pro: true },
  { id: 'dots', name: 'LED Dots', description: 'Green dot-matrix display with digital clock aesthetic', pro: true },
  { id: 'elegant', name: 'Elegant Serif', description: 'Refined serif typography with date above the counter', pro: true },
];
