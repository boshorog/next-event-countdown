import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Palette, Settings2, ChevronDown, Check, Type, Settings, Frame, Crown, Church, Maximize2, CalendarDays, LayoutGrid, Rows3, Globe, Languages, Timer } from 'lucide-react';
import { BUILD_FLAGS } from '@/config/buildFlags';
import { COUNTER_STYLE_OPTIONS } from '@/components/counterStyles/types';
import { LANGUAGES, getLanguage } from '@/config/languageTranslations';
import { STYLE_RENDERERS } from '@/components/counterStyles/renderers';
import SaturationCanvasPicker from '@/components/SaturationCanvasPicker';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLicense } from '@/hooks/useLicense';
import {
  CountdownConfig,
  defaultCountdownConfig,
  ICON_OPTIONS,
  DATE_FORMAT_OPTIONS,
  DateFormatType,
  TIMEZONE_OPTIONS,
  useCountdown,
  getIconComponent,
} from '@/components/ServiceCountdownWidget';

// Custom Layers icon component with customizable layer colors
const LayersIcon = ({ firstLayerGreen = false, allLayersGreen = false, className = "" }: { 
  firstLayerGreen?: boolean; 
  allLayersGreen?: boolean; 
  className?: string;
}) => {
  const purpleColor = "hsl(var(--primary))";
  const grayColor = "hsl(215, 14%, 70%)";
  const defaultColor = "currentColor";
  
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path 
        d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" 
        stroke={allLayersGreen || firstLayerGreen ? purpleColor : defaultColor}
      />
      <path 
        d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" 
        stroke={allLayersGreen ? purpleColor : (firstLayerGreen ? grayColor : defaultColor)}
      />
      <path 
        d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" 
        stroke={allLayersGreen ? purpleColor : (firstLayerGreen ? grayColor : defaultColor)}
      />
    </svg>
  );
};

interface SettingsProposal2Props {
  currentGalleryId?: string;
  settings: {
    thumbnailStyle: string;
    accentColor: string;
    thumbnailShape: string;
    pdfIconPosition: string;
    defaultPlaceholder: string;
    thumbnailSize?: string;
    gapSize?: number;
    settingsScope?: string;
    enableThumbnailCache?: boolean;
    autoRefreshCache?: boolean;
    cacheDuration?: string;
    ratingsEnabled?: boolean;
    lightboxEnabled?: boolean;
    showFileTypeBadges?: boolean;
    showTitlesSubtitles?: boolean;
  };
  onSettingsChange: (settings: any) => void;
  countdownConfig?: CountdownConfig;
  onCountdownConfigChange?: (config: CountdownConfig) => void;
}

// Live preview component that uses the real countdown hook
const CounterStyleLivePreview = ({ config, Renderer }: { config: CountdownConfig; Renderer: React.FC<any> }) => {
  const t = useCountdown(config);
  const Icon = getIconComponent(config.icon);
  return (
    <Renderer
      days={t.days}
      hours={t.hours}
      minutes={t.minutes}
      seconds={t.seconds}
      headerLabel={t.isLive ? (config.liveLabel || "Happening Now") : config.headerLabel}
      eventTitle={t.title || 'Sunday Morning Worship'}
      eventDate={t.fullDate || 'March 8, 2026 at 10:00 AM'}
      iconColor={config.iconColor}
      icon={Icon}
      labelDays={config.labelDays || 'Days'}
      labelHours={config.labelHours || 'Hours'}
      labelMinutes={config.labelMinutes || 'Minutes'}
      labelSeconds={config.labelSeconds || 'Seconds'}
    />
  );
};

const SettingsProposal2 = ({ settings, onSettingsChange, currentGalleryId, countdownConfig, onCountdownConfigChange }: SettingsProposal2Props) => {
  const config = countdownConfig || defaultCountdownConfig;
  const [localConfig, setLocalConfig] = useState<CountdownConfig>(config);
  const [activeSection, setActiveSection] = useState(BUILD_FLAGS.COUNTER_STYLES ? 'counter-styles' : 'colors');
  const [saveScope, setSaveScope] = useState<'current' | 'all'>('current');
  const { toast } = useToast();
  const license = useLicense();

  useEffect(() => {
    setLocalConfig(countdownConfig || defaultCountdownConfig);
  }, [countdownConfig]);

  const handleSave = async () => {
    onCountdownConfigChange?.(localConfig);
    onSettingsChange(settings);
    try {
      const wp = (window as any).nxevtcdData;
      const urlParams = new URLSearchParams(window.location.search);
      const ajaxUrl = wp?.ajaxUrl || urlParams.get('ajax');
      const nonce = wp?.nonce || urlParams.get('nonce') || '';

      if (ajaxUrl && nonce) {
        const form = new FormData();
        form.append('action', 'nxevtcd_action');
        form.append('action_type', 'save_settings');
        form.append('nonce', nonce);
        form.append('settings', JSON.stringify({ ...settings, countdownConfig: localConfig }));
        form.append('save_scope', saveScope);
        if (saveScope === 'current' && currentGalleryId) {
          form.append('gallery_id', currentGalleryId);
        }
        await fetch(ajaxUrl, { method: 'POST', credentials: 'same-origin', body: form });
      }

      toast({
        title: "Settings Saved",
        description: "Your countdown settings have been updated successfully",
      });
    } catch (e) {
      toast({ title: "Saved locally", description: "Could not reach WordPress AJAX." });
    }
  };

  const updateConfig = (partial: Partial<CountdownConfig>) => {
    setLocalConfig(prev => ({ ...prev, ...partial }));
  };

  const sidebarItems = [
    ...(BUILD_FLAGS.COUNTER_STYLES ? [{ id: 'counter-styles', label: 'Counter Styles', icon: LayoutGrid, pro: true }] : []),
    { id: 'colors', label: 'Colors & Icon', icon: Palette },
    { id: 'labels', label: 'Labels', icon: Type },
    { id: 'size', label: 'Counter Size', icon: Maximize2 },
    { id: 'other', label: 'Other Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'labels': {
        const currentLang = localConfig.language || 'en';
        const langData = getLanguage(currentLang);
        const configDayNames = localConfig.dayNames || langData.dayNames;
        const configMonthNames = localConfig.monthNames || langData.monthNames;
        const configAtWord = localConfig.atWord ?? langData.atWord;

        const handleLanguageChange = (code: string) => {
          const lang = getLanguage(code);
          updateConfig({
            language: code,
            labelDays: lang.days,
            labelHours: lang.hours,
            labelMinutes: lang.minutes,
            labelSeconds: lang.seconds,
            headerLabel: lang.headerLabel,
            liveLabel: lang.liveLabel,
            dayNames: [...lang.dayNames],
            monthNames: [...lang.monthNames],
            atWord: lang.atWord,
          });
        };

        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                Countdown Labels
              </CardTitle>
              <p className="text-sm text-muted-foreground">Customize all text displayed on the countdown widget</p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Language Selector */}
              <div className="space-y-1.5">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Languages className="w-4 h-4" />
                  Language
                </Label>
                <p className="text-sm text-muted-foreground mb-3">Pre-fill all labels with translations for your language</p>
                <Select value={currentLang} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Header Labels */}
              <div className="space-y-1.5 pt-6 border-t border-border">
                <Label className="text-base font-semibold">Header Labels</Label>
                <p className="text-sm text-muted-foreground mb-4">Text shown in the header area of the countdown</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="headerLabel" className="text-sm font-medium">Before Event (countdown)</Label>
                    <Input
                      id="headerLabel"
                      value={localConfig.headerLabel}
                      onChange={(e) => updateConfig({ headerLabel: e.target.value })}
                      placeholder="Next Event"
                    />
                    <p className="text-xs text-muted-foreground">Shown while counting down to the next event</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="liveLabel" className="text-sm font-medium">During Event (live)</Label>
                    <Input
                      id="liveLabel"
                      value={localConfig.liveLabel}
                      onChange={(e) => updateConfig({ liveLabel: e.target.value })}
                      placeholder="Happening Now"
                    />
                    <p className="text-xs text-muted-foreground">Shown when an event is currently live</p>
                  </div>
                </div>
              </div>

              {/* Date Format moved to Other Settings > Regional */}

              {/* "at" word for date formats */}
              <div className="space-y-1.5 pt-6 border-t border-border">
                <Label className="text-base font-semibold">Date Connector Word</Label>
                <p className="text-sm text-muted-foreground mb-3">The word used between date and time (e.g. "at" in "March 6, 2026 at 7:00 PM")</p>
                <Input
                  value={configAtWord}
                  onChange={(e) => updateConfig({ atWord: e.target.value })}
                  placeholder="at"
                  className="max-w-[120px]"
                />
              </div>

              {/* Unit Labels */}
              <div className="space-y-1.5 pt-6 border-t border-border">
                <Label className="text-base font-semibold">Countdown Unit Labels</Label>
                <p className="text-sm text-muted-foreground mb-4">Customize the text below each digit group</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="labelDays" className="text-sm">Days</Label>
                    <Input id="labelDays" value={localConfig.labelDays} onChange={(e) => updateConfig({ labelDays: e.target.value })} placeholder="Days" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="labelHours" className="text-sm">Hours</Label>
                    <Input id="labelHours" value={localConfig.labelHours} onChange={(e) => updateConfig({ labelHours: e.target.value })} placeholder="Hours" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="labelMinutes" className="text-sm">Minutes</Label>
                    <Input id="labelMinutes" value={localConfig.labelMinutes} onChange={(e) => updateConfig({ labelMinutes: e.target.value })} placeholder="Minutes" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="labelSeconds" className="text-sm">Seconds</Label>
                    <Input id="labelSeconds" value={localConfig.labelSeconds} onChange={(e) => updateConfig({ labelSeconds: e.target.value })} placeholder="Seconds" />
                  </div>
                </div>
              </div>

              {/* Day Names */}
              <div className="space-y-1.5 pt-6 border-t border-border">
                <Label className="text-base font-semibold">Day Names</Label>
                <p className="text-sm text-muted-foreground mb-4">Used in date formats that display the day of the week</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map((engName, idx) => (
                    <div key={engName} className="space-y-1">
                      <Label className="text-xs text-muted-foreground">{engName}</Label>
                      <Input
                        value={configDayNames[idx] || ''}
                        onChange={(e) => {
                          const newDays = [...configDayNames];
                          newDays[idx] = e.target.value;
                          updateConfig({ dayNames: newDays });
                        }}
                        placeholder={engName}
                        className="h-8 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Month Names */}
              <div className="space-y-1.5 pt-6 border-t border-border">
                <Label className="text-base font-semibold">Month Names</Label>
                <p className="text-sm text-muted-foreground mb-4">Used in date formats that display the month name</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {['January','February','March','April','May','June','July','August','September','October','November','December'].map((engName, idx) => (
                    <div key={engName} className="space-y-1">
                      <Label className="text-xs text-muted-foreground">{engName}</Label>
                      <Input
                        value={configMonthNames[idx] || ''}
                        onChange={(e) => {
                          const newMonths = [...configMonthNames];
                          newMonths[idx] = e.target.value;
                          updateConfig({ monthNames: newMonths });
                        }}
                        placeholder={engName}
                        className="h-8 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>
        );
      }

      case 'size':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Maximize2 className="w-5 h-5" />
                Counter Size
              </CardTitle>
              <p className="text-sm text-muted-foreground">Scale the entire countdown widget proportionally</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Counter Scale</Label>
                    <p className="text-sm text-muted-foreground">Resize header, digits, labels, and spacing together</p>
                  </div>
                  <span className="text-sm font-medium text-primary">{Math.round((localConfig.headerScale ?? 1) * 100)}%</span>
                </div>
                <Slider
                  value={[(localConfig.headerScale ?? 1) * 100]}
                  onValueChange={(v) => updateConfig({ headerScale: v[0] / 100 })}
                  min={50}
                  max={200}
                  step={5}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 'colors':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Colors & Icon
              </CardTitle>
              <p className="text-sm text-muted-foreground">Customize the visual appearance of your countdown</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Icon Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Icon</Label>
                <p className="text-sm text-muted-foreground">Choose an icon displayed in the countdown header</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                  {ICON_OPTIONS.map((opt) => {
                    const IconComp = opt.icon;
                    const isSelected = localConfig.icon === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => updateConfig({ icon: opt.value })}
                        className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors ${
                          isSelected
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                      >
                        <IconComp className="w-5 h-5" style={{ color: isSelected ? localConfig.iconColor : undefined }} />
                        <span className="text-[10px] text-muted-foreground">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Icon Color */}
              <div className="space-y-3 pt-4 border-t border-border">
                <Label className="text-base font-medium">Icon Color</Label>
                <div className="flex items-center gap-3">
                  <SaturationCanvasPicker
                    color={localConfig.iconColor}
                    onChange={(c) => updateConfig({ iconColor: c })}
                    trigger={(c) => (
                      <button className="w-9 h-9 rounded-lg border border-border shadow-sm cursor-pointer hover:shadow-md transition-shadow" style={{ backgroundColor: c }} />
                    )}
                  />
                  <Input
                    value={localConfig.iconColor}
                    onChange={(e) => updateConfig({ iconColor: e.target.value })}
                    placeholder="#6366f1"
                    className="font-mono flex-1"
                  />
                </div>
              </div>

              {/* Color Pickers Grid */}
              <div className="space-y-4 pt-4 border-t border-border">
                <Label className="text-base font-medium">Widget Colors</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Background with Transparent option */}
                  <div className="space-y-2">
                    <Label className="text-sm">Background</Label>
                    <div className="flex items-center gap-2">
                      <SaturationCanvasPicker
                        color={localConfig.bgColor === 'transparent' ? '#ffffff' : (localConfig.bgColor || '#ffffff')}
                        onChange={(c) => updateConfig({ bgColor: c })}
                        trigger={(c) => (
                          <button
                            className="w-9 h-9 rounded-lg border border-border shadow-sm cursor-pointer hover:shadow-md transition-shadow flex-shrink-0"
                            style={localConfig.bgColor === 'transparent'
                              ? { background: 'repeating-conic-gradient(#d4d4d4 0% 25%, #fff 0% 50%) 50% / 12px 12px' }
                              : { backgroundColor: c }
                            }
                          />
                        )}
                        extraContent={
                          <label className="flex items-center gap-2 text-sm cursor-pointer select-none pt-1 border-t border-border mt-1">
                            <input
                              type="checkbox"
                              checked={localConfig.bgColor === 'transparent'}
                              onChange={(e) => updateConfig({ bgColor: e.target.checked ? 'transparent' : '#ffffff' })}
                              className="rounded border-border accent-[hsl(var(--primary))]"
                            />
                            <span className="text-muted-foreground">Transparent background</span>
                          </label>
                        }
                      />
                      <Input
                        value={localConfig.bgColor === 'transparent' ? 'transparent' : (localConfig.bgColor || '')}
                        onChange={(e) => updateConfig({ bgColor: e.target.value })}
                        placeholder="#ffffff"
                        className="font-mono flex-1"
                        disabled={localConfig.bgColor === 'transparent'}
                      />
                    </div>
                  </div>
                  {[
                    { key: 'textColor', label: 'Header Text', placeholder: '#1a1a1a' },
                    { key: 'digitColor', label: 'Countdown Digits', placeholder: '#1a1a1a' },
                    { key: 'separatorColor', label: 'Separator (:)', placeholder: '#d4d4d4' },
                    { key: 'labelColor', label: 'Unit Labels', placeholder: '#737373' },
                    { key: 'titleColor', label: 'Event Title', placeholder: '#737373' },
                    { key: 'dateColor', label: 'Event Date', placeholder: '#737373' },
                    { key: 'cardBgColor', label: 'Card / Block Fill', placeholder: '#f5f5f5' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key} className="space-y-2">
                      <Label className="text-sm">{label}</Label>
                      <div className="flex items-center gap-2">
                        <SaturationCanvasPicker
                          color={(localConfig as any)[key] || placeholder}
                          onChange={(c) => updateConfig({ [key]: c } as any)}
                          trigger={(c) => (
                            <button className="w-9 h-9 rounded-lg border border-border shadow-sm cursor-pointer hover:shadow-md transition-shadow flex-shrink-0" style={{ backgroundColor: c }} />
                          )}
                        />
                        <Input
                          value={(localConfig as any)[key] || ''}
                          onChange={(e) => updateConfig({ [key]: e.target.value } as any)}
                          placeholder={placeholder}
                          className="font-mono flex-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'other':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Other Settings
              </CardTitle>
              <p className="text-sm text-muted-foreground">Additional display options for the countdown</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* ── Layout ── */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Layout</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Rows3 className="w-4 h-4 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Full Width</Label>
                      <p className="text-xs text-muted-foreground">Stretch the widget to fill its container, or wrap around content</p>
                    </div>
                  </div>
                  <Checkbox 
                    checked={localConfig.fullWidth !== false}
                    onCheckedChange={(checked) => updateConfig({ fullWidth: checked === true })}
                  />
                </div>
              </div>

              <div className="border-t border-border" />

              {/* ── Regional ── */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Regional</p>
                <div className="space-y-5">
                  {/* Date Format */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="w-4 h-4 text-muted-foreground" />
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Date Format</Label>
                        <p className="text-xs text-muted-foreground">Choose how the event date and time are displayed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Select
                        value={localConfig.dateFormat || "us-long"}
                        onValueChange={(v) => updateConfig({ dateFormat: v as DateFormatType })}
                      >
                        <SelectTrigger className="flex-1 h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DATE_FORMAT_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              <div className="flex flex-col">
                                <span className="font-medium">{opt.label}</span>
                                <span className="text-xs text-muted-foreground">{opt.example}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex items-center border border-border rounded-md overflow-hidden shrink-0">
                        <button
                          type="button"
                          onClick={() => updateConfig({ use24h: false })}
                          className={`px-3 py-2 text-sm font-medium transition-colors ${
                            localConfig.use24h !== true
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-accent'
                          }`}
                        >
                          12h
                        </button>
                        <button
                          type="button"
                          onClick={() => updateConfig({ use24h: true })}
                          className={`px-3 py-2 text-sm font-medium transition-colors ${
                            localConfig.use24h === true
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-accent'
                          }`}
                        >
                          24h
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Default Timezone */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Default Timezone</Label>
                        <p className="text-xs text-muted-foreground">Applied to all newly created events</p>
                      </div>
                    </div>
                    <Select
                      value={localConfig.defaultTimezone || "America/New_York"}
                      onValueChange={(v) => updateConfig({ defaultTimezone: v })}
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMEZONE_OPTIONS.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="border-t border-border" />

              {/* ── Visibility ── */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Visibility</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Type className="w-4 h-4 text-muted-foreground" />
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Show Event Title</Label>
                        <p className="text-xs text-muted-foreground">Display the name of the upcoming event</p>
                      </div>
                    </div>
                    <Checkbox 
                      checked={localConfig.showTitle !== false}
                      onCheckedChange={(checked) => updateConfig({ showTitle: checked === true })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="w-4 h-4 text-muted-foreground" />
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Show Event Date</Label>
                        <p className="text-xs text-muted-foreground">Display the date & time in the header</p>
                      </div>
                    </div>
                    <Checkbox 
                      checked={localConfig.showDate !== false}
                      onCheckedChange={(checked) => updateConfig({ showDate: checked === true })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Timer className="w-4 h-4 text-muted-foreground" />
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Live Event Countdown</Label>
                        <p className="text-xs text-muted-foreground">Show remaining time during a live event instead of 00:00:00</p>
                      </div>
                    </div>
                    <Checkbox 
                      checked={localConfig.showLiveDuration === true}
                      onCheckedChange={(checked) => updateConfig({ showLiveDuration: checked === true })}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border" />

              {/* ── Frame & Shape ── */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Frame & Shape</p>
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Frame className="w-4 h-4 text-muted-foreground" />
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Show Outer Frame</Label>
                        <p className="text-xs text-muted-foreground">Display a border around the countdown widget</p>
                      </div>
                    </div>
                    <Checkbox 
                      checked={localConfig.showBorder}
                      onCheckedChange={(checked) => updateConfig({ showBorder: checked === true })}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Maximize2 className="w-4 h-4 text-muted-foreground" />
                        <div className="space-y-0.5">
                          <Label className="text-sm font-medium">Corner Radius</Label>
                          <p className="text-xs text-muted-foreground">Adjust the roundness of the widget corners</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-primary">{localConfig.borderRadius ?? 16}px</span>
                    </div>
                    <Slider
                      value={[localConfig.borderRadius ?? 16]}
                      onValueChange={(v) => updateConfig({ borderRadius: v[0] })}
                      min={0}
                      max={32}
                      step={2}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'counter-styles': {
        const currentStyle = localConfig.counterStyle || 'default';
        return (
          <div className="grid grid-cols-1 gap-3">
            {COUNTER_STYLE_OPTIONS.map((style) => {
              const isSelected = currentStyle === style.id;
              const Renderer = STYLE_RENDERERS[style.id];
              return (
                <button
                  key={style.id}
                  onClick={() => updateConfig({ counterStyle: style.id })}
                  className={`relative w-full text-left rounded-xl border-2 p-4 transition-all hover:shadow-md flex flex-col ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/30 bg-card'
                  }`}
                  style={{ minHeight: 180 }}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center z-10">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-semibold text-sm">{style.name}</span>
                    {!style.pro ? (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">Free</Badge>
                    ) : (
                      <Badge className="text-[10px] px-1.5 py-0 bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/10">Pro</Badge>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto mr-6">{style.description}</span>
                  </div>
                  <div className="flex-1 flex items-center">
                    {Renderer && <div className="w-full"><CounterStyleLivePreview config={localConfig} Renderer={Renderer} /></div>}
                  </div>
                </button>
              );
            })}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Settings2 className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Countdown Settings</h2>
        </div>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-r-none border-r-0" size="lg">
                {saveScope === 'current' ? (
                  <>
                    <LayersIcon firstLayerGreen className="mr-2" />
                    Current Counter
                  </>
                ) : (
                  <>
                    <LayersIcon allLayersGreen className="mr-2" />
                    All Counters
                  </>
                )}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem 
                onClick={() => setSaveScope('current')}
                className="flex items-center justify-between gap-6 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <LayersIcon firstLayerGreen className="flex-shrink-0" />
                  <span>Current Counter</span>
                </div>
                {saveScope === 'current' && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSaveScope('all')}
                className="flex items-center justify-between gap-6 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <LayersIcon allLayersGreen className="flex-shrink-0" />
                  <span>All Counters</span>
                </div>
                {saveScope === 'all' && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            onClick={handleSave}
            className="rounded-l-none bg-primary hover:bg-primary/90"
            size="lg"
          >
            Save Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar Navigation */}
        <div className="col-span-12 lg:col-span-3">
          <Card className="sticky top-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Configuration</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                        isActive 
                          ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                          : 'text-muted-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium flex-1">{item.label}</span>
                      {'pro' in item && (item as any).pro && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-9">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsProposal2;
