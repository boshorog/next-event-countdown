import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Crown, Check, X, Shield, Trash2, BookOpen, FileText, Settings, Timer, Palette, HelpCircle, Zap, MapPin, CalendarDays, Repeat } from 'lucide-react';
import { useLicense } from '@/hooks/useLicense';
import { useToast } from '@/hooks/use-toast';
import { PLUGIN_VERSION } from '@/config/pluginIdentity';

interface PluginDocumentationProps {
  className?: string;
  showOnlyLicenseAndComparison?: boolean;
}

const PluginDocumentation: React.FC<PluginDocumentationProps> = ({ className, showOnlyLicenseAndComparison = false }) => {
  const license = useLicense();
  const [isRemovingLicense, setIsRemovingLicense] = useState(false);
  const { toast } = useToast();

  const getLicenseOwner = () => {
    try {
      const wpGlobal = (window as any).nxevtcdData || (window.parent as any)?.nxevtcdData;
      return wpGlobal?.licensedTo || 'Pro User';
    } catch {
      return 'Pro User';
    }
  };

  const handleRemoveLicense = async () => {
    setIsRemovingLicense(true);
    try {
      const wpGlobal = (window as any).nxevtcdData || (window.parent as any)?.nxevtcdData;
      const ajaxUrl = wpGlobal?.ajaxUrl || (window as any).ajaxurl;
      const nonce = wpGlobal?.nonce;

      if (!ajaxUrl || !nonce) {
        toast({ title: 'Unable to remove license', description: 'WordPress AJAX not available', variant: 'destructive' });
        return;
      }

      const form = new FormData();
      form.append('action', 'nxevtcd_freemius_deactivate');
      form.append('nonce', nonce);

      const response = await fetch(ajaxUrl, {
        method: 'POST',
        credentials: 'same-origin',
        body: form
      });

      const data = await response.json();

      if (data?.success) {
        toast({ title: 'License removed', description: 'Your license has been deactivated. Reloading...' });
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast({ title: 'Failed to remove license', description: data?.data?.message || 'Unknown error', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error removing license', description: 'Please try again', variant: 'destructive' });
    } finally {
      setIsRemovingLicense(false);
    }
  };

  const FeatureRow = ({ feature, free, pro }: { feature: string; free: boolean | string; pro: boolean | string }) => (
    <tr className="border-b border-border/50">
      <td className="py-3 px-4 text-sm">{feature}</td>
      <td className="py-3 px-4 text-center">
        {typeof free === 'boolean' ? (
          free ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-muted-foreground/50 mx-auto" />
        ) : (
          <span className="text-sm text-muted-foreground">{free}</span>
        )}
      </td>
      <td className="py-3 px-4 text-center">
        {typeof pro === 'boolean' ? (
          pro ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-muted-foreground/50 mx-auto" />
        ) : (
          <span className="text-sm font-medium text-primary">{pro}</span>
        )}
      </td>
    </tr>
  );

  // If showing only license and comparison (Pro tab when licensed)
  if (showOnlyLicenseAndComparison) {
    return (
      <div className={className}>
        {license.isPro && license.checked && (
          <Card className="mb-6 border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Crown className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Licensed to: <span className="text-primary">{getLicenseOwner()}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">Next Event Countdown Pro v{PLUGIN_VERSION}</p>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove License
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Pro License?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will deactivate your Pro license and revert to the Free version. You can reactivate it later using your license key.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleRemoveLicense}
                        disabled={isRemovingLicense}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        {isRemovingLicense ? 'Removing...' : 'Remove License'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Free vs Pro Comparison
              <Crown className="w-5 h-5 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="py-3 px-4 text-left text-sm font-semibold">Feature</th>
                    <th className="py-3 px-4 text-center text-sm font-semibold">Free</th>
                    <th className="py-3 px-4 text-center text-sm font-semibold">
                      <span className="inline-flex items-center gap-1">
                        Pro
                        <Crown className="w-4 h-4 text-amber-500" />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <FeatureRow feature="Number of Counters" free="1" pro="Unlimited" />
                  <FeatureRow feature="Recurring Events" free="Unlimited" pro="Unlimited" />
                  <FeatureRow feature="Special Events" free="Unlimited" pro="Unlimited" />
                  <FeatureRow feature="Countdown Styles" free="1" pro="Multiple" />
                  <FeatureRow feature="Multiple Locations / Venues" free={false} pro={true} />
                  <FeatureRow feature="Colors, Labels & Icon Customization" free={true} pro={true} />
                  <FeatureRow feature="Multiple Date Formats" free={true} pro={true} />
                  <FeatureRow feature="Priority Support" free={false} pro={true} />
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <BookOpen className="w-5 h-5" />
            Next Event Countdown Documentation
            <Badge variant="secondary" className="ml-2">v{PLUGIN_VERSION}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">

            {/* Getting Started */}
            <AccordionItem value="getting-started">
              <AccordionTrigger className="text-base font-semibold">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  Getting Started
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6 text-sm">
                  <div>
                    <h4 className="font-medium mb-3 text-base border-b border-border pb-2">1. Set Up Your Events</h4>
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-2">
                      <li>Go to the <strong>Counters</strong> tab</li>
                      <li>Add <strong>Recurring Events</strong> (e.g., weekly services) or <strong>Special Events</strong> (one-time dates)</li>
                      <li>Configure event times, days, and durations</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-base border-b border-border pb-2">2. Customize Appearance</h4>
                    <p className="text-muted-foreground ml-2">
                      Visit the <strong>Settings</strong> tab to adjust labels, colors, icon, date format, and display options for your countdown widget.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-base border-b border-border pb-2">3. Embed Your Countdown</h4>
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-2">
                      <li>Copy the shortcode from the <strong>Preview</strong> tab</li>
                      <li>Paste <code className="bg-muted px-1 rounded">[nxevtcd_countdown]</code> into any page or post</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Event Types */}
            <AccordionItem value="event-types">
              <AccordionTrigger className="text-base font-semibold">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-cyan-500" />
                  Event Types
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Recurring Events</h4>
                    <p className="text-muted-foreground mb-2">
                      Events that repeat on a schedule. Ideal for regular services, classes, or meetings.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li><strong>Weekly:</strong> Same day every week (e.g., Sunday at 10 AM)</li>
                      <li><strong>Biweekly:</strong> Every two weeks</li>
                      <li><strong>Monthly:</strong> Same date each month</li>
                      <li><strong>Daily:</strong> Every day at the same time</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Special Events</h4>
                    <p className="text-muted-foreground">
                      One-time events with a specific date and time. Great for holidays, conferences, concerts, or any unique occasion. 
                      Special events take priority over recurring events when they're the next upcoming event.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Recurrence Patterns */}
            <AccordionItem value="recurrence">
              <AccordionTrigger className="text-base font-semibold">
                <div className="flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-green-500" />
                  Recurrence & Duration
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Recurrence Patterns</h4>
                    <p className="text-muted-foreground">
                      Configure how often your events repeat. The countdown automatically calculates 
                      the next occurrence based on the recurrence pattern.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Event Duration</h4>
                    <p className="text-muted-foreground">
                      Set how long each event lasts. During an active event, the widget switches from 
                      "Next Event" countdown to "Happening Now" mode, showing a live indicator instead.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Settings & Customization */}
            <AccordionItem value="settings">
              <AccordionTrigger className="text-base font-semibold">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-slate-500" />
                  Settings & Customization
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Labels</h4>
                    <p className="text-muted-foreground">
                      Customize all text on the widget: header labels for countdown and live states, 
                      countdown unit labels (days, hours, minutes, seconds), and choose from 6 date formats 
                      including US, European, ISO, and social styles.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Colors & Icon</h4>
                    <p className="text-muted-foreground">
                      Set custom colors for the accent, background, text, and countdown numbers using 
                      the built-in color picker. Choose from a selection of icons to display alongside the countdown.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Other Settings</h4>
                    <p className="text-muted-foreground">
                      Toggle the outer frame border around the countdown widget for a cleaner or more defined look.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Shortcodes */}
            <AccordionItem value="shortcodes">
              <AccordionTrigger className="text-base font-semibold">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-500" />
                  Shortcodes
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Basic Usage</h4>
                    <code className="block bg-muted p-3 rounded text-xs">
                      [nxevtcd_countdown]
                    </code>
                    <p className="text-muted-foreground mt-2">Displays the default countdown widget.</p>
                  </div>
                  {license.isPro && (
                    <div>
                      <h4 className="font-medium mb-2">Specific Counter (Pro)</h4>
                      <code className="block bg-muted p-3 rounded text-xs">
                        [nxevtcd_countdown name="downtown-campus"]
                      </code>
                      <p className="text-muted-foreground mt-2">
                        Displays a specific counter by name. Use lowercase with hyphens. 
                        This allows you to show different countdowns for different locations on separate pages.
                      </p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Free vs Pro Comparison */}
            <AccordionItem value="comparison">
              <AccordionTrigger className="text-base font-semibold">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-500" />
                  Free vs Pro Comparison
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="py-3 px-4 text-left text-sm font-semibold">Feature</th>
                        <th className="py-3 px-4 text-center text-sm font-semibold">Free</th>
                        <th className="py-3 px-4 text-center text-sm font-semibold">
                          <span className="inline-flex items-center gap-1">
                            Pro
                            <Crown className="w-4 h-4 text-amber-500" />
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <FeatureRow feature="Number of Counters" free="1" pro="Unlimited" />
                      <FeatureRow feature="Recurring Events" free="Unlimited" pro="Unlimited" />
                      <FeatureRow feature="Special Events" free="Unlimited" pro="Unlimited" />
                      <FeatureRow feature="Countdown Styles" free="1" pro="Multiple" />
                      <FeatureRow feature="Multiple Locations / Venues" free={false} pro={true} />
                      <FeatureRow feature="Colors, Labels & Icon Customization" free={true} pro={true} />
                      <FeatureRow feature="Multiple Date Formats" free={true} pro={true} />
                      <FeatureRow feature="Priority Support" free={false} pro={true} />
                    </tbody>
                  </table>
                </div>
                {!license.isPro && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/20">
                    <p className="text-sm text-center">
                      <a 
                        href="https://checkout.freemius.com/plugin/18355/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                      >
                        Upgrade to Pro →
                      </a>
                    </p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Troubleshooting */}
            <AccordionItem value="troubleshooting">
              <AccordionTrigger className="text-base font-semibold">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-red-500" />
                  Troubleshooting
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Countdown Not Showing</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Verify you have at least one active event configured in the <strong>Counters</strong> tab</li>
                      <li>Make sure the shortcode <code className="bg-muted px-1 rounded">[nxevtcd_countdown]</code> is correct</li>
                      <li>Check for JavaScript errors in the browser console</li>
                      <li>Ensure no theme or plugin conflicts</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Wrong Time Displayed</h4>
                    <p className="text-muted-foreground">
                      The countdown uses your WordPress timezone settings. Go to <strong>Settings → General</strong> 
                      in WordPress to verify your timezone is correct.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Events Not Saving</h4>
                    <p className="text-muted-foreground">
                      Make sure you click the <strong>Save</strong> button after making changes. 
                      If issues persist, check your browser's console for errors and ensure your WordPress 
                      admin nonce hasn't expired (try refreshing the page).
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Support */}
            <AccordionItem value="support">
              <AccordionTrigger className="text-base font-semibold">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-teal-500" />
                  Support & Resources
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Getting Help</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li><strong>Documentation:</strong> You're reading it!</li>
                      <li><strong>WordPress Forums:</strong> Community support for free users</li>
                      <li><strong>Priority Support:</strong> Email support for Pro users</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Useful Links</h4>
                    <ul className="space-y-2">
                      <li>
                        <a href="https://kindpixels.com/plugins/next-event-countdown/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          Plugin Website →
                        </a>
                      </li>
                      <li>
                        <a href="https://checkout.freemius.com/plugin/18355/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          Upgrade to Pro →
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Next Event Countdown v{PLUGIN_VERSION} • Made in Romania by Kind Pixels
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default PluginDocumentation;
