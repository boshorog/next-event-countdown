import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, ExternalLink, Zap, Unlock, Check, MapPin } from 'lucide-react';
import { useLicense } from '@/hooks/useLicense';

interface ProBannerProps {
  className?: string;
  showComparison?: boolean;
}

const FeatureRow = ({ feature, free, pro }: { feature: string; free: boolean | string; pro: boolean | string }) => (
  <tr className="border-b border-border/50">
    <td className="py-3 px-4 text-sm">{feature}</td>
    <td className="py-3 px-4 text-center">
      {typeof free === 'boolean' ? (
        free ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <span className="w-5 h-5 text-muted-foreground/50 mx-auto">—</span>
      ) : (
        <span className="text-sm text-muted-foreground">{free}</span>
      )}
    </td>
    <td className="py-3 px-4 text-center">
      {typeof pro === 'boolean' ? (
        pro ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <span className="w-5 h-5 text-muted-foreground/50 mx-auto">—</span>
      ) : (
        <span className="text-sm font-medium text-primary">{pro}</span>
      )}
    </td>
  </tr>
);

const ProBanner = ({ className = '', showComparison = false }: ProBannerProps) => {
  const license = useLicense();

  // If our license hook confirms Pro/Trial, never render
  if (license.checked && (license.isPro || ['pro','trial','premium'].includes(String(license.status).toLowerCase()))) {
    return null;
  }

  // Show banner only in explicit WordPress admin free state
  let wpGlobal: any = null;
  try { wpGlobal = (window as any).nxevtcdData || null; } catch {}
  if (!wpGlobal) {
    try { wpGlobal = (window.parent && (window.parent as any).nxevtcdData) || null; } catch {}
  }
  const urlParams = new URLSearchParams(window.location.search);
  const hideParam = urlParams.get('hideProBanner') === 'true';
  let lsSuppress = false;
  try { lsSuppress = localStorage.getItem('nxevtcd_suppressProBanner') === '1'; } catch {}
  
  const isLikelyWpAdmin = (() => {
    try {
      const w = window as any;
      const topPath = w.top?.location?.pathname || '';
      const herePath = w.location?.pathname || '';
      const hasWrap = document?.body?.id === 'wpwrap' || document?.body?.classList?.contains('wp-admin');
      const parentDoc = w.parent?.document;
      const parentHasWrap = !!parentDoc && (parentDoc.body?.id === 'wpwrap' || parentDoc.body?.classList?.contains('wp-admin'));
      return topPath.includes('/wp-admin/') || herePath.includes('/wp-admin/') || hasWrap || parentHasWrap;
    } catch { return false; }
  })();
  
  const isAdmin = !!wpGlobal?.isAdmin || urlParams.get('admin') === 'true' || isLikelyWpAdmin;
  const fsAvailable = !!wpGlobal?.fsAvailable;
  const wpStatus = String(wpGlobal?.fsStatus ?? '').toLowerCase();
  const wpIsPro = !!(wpGlobal && (wpGlobal.fsIsPro === true || wpGlobal.fsIsPro === 'true' || wpGlobal.fsIsPro === '1' || wpGlobal.fsIsPro === 1));
  
  // Don't show if explicitly hidden
  const statusLower = String(license.status ?? '').toLowerCase();
  const isProLike = wpIsPro || license.isPro || ['pro','trial','premium'].includes(statusLower);
  if (hideParam || (lsSuppress && isProLike)) return null;
  
  const hostname = window.location.hostname;
  const isDevPreview = hostname.includes('lovable.app') || hostname.includes('lovableproject.com') || hostname === 'localhost';
  
  if (!isAdmin && !isDevPreview) return null;
  if (wpIsPro) return null;
  
  if (fsAvailable) {
    const fsStatus = String(wpStatus).toLowerCase();
    const proLike = new Set(['pro','paid','trial','premium','active_trial','trialing']);
    if (proLike.has(fsStatus)) return null;
  }

  return (
    <Card className={`border-gradient-to-r from-orange-500/20 to-red-500/20 bg-gradient-to-r from-orange-50/50 to-red-50/50 dark:from-orange-950/20 dark:to-red-950/20 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-foreground">Upgrade to KindPixels Next Event Countdown Pro</h3>
              <div className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full">
                Pro
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Manage countdowns for multiple locations with unique styles — perfect for churches, venues, and organizations with several campuses.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-orange-500" />
                <span className="text-lg font-semibold">Multiple Counters</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-orange-500" />
                <span className="text-lg font-semibold">Counter Styles</span>
              </div>
              <div className="flex items-center gap-3">
                <Unlock className="w-6 h-6 text-orange-500" />
                <span className="text-lg font-semibold">Priority Support</span>
              </div>
            </div>

            {/* Get Pro button */}
            <div className="w-full flex justify-center">
              <div className="w-full max-w-md">
                <Button 
                  className="w-full h-10 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium"
                  onClick={() => window.open('https://checkout.freemius.com/plugin/25492/plan/42185/', '_blank')}
                >
                  Get Next Event Countdown Pro
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      {showComparison && (
        <CardContent className="pt-0 pb-6">
          <div className="border-t pt-6">
            <h4 className="text-base font-semibold mb-4 flex items-center gap-2">
              Free vs Pro Comparison
              <Crown className="w-4 h-4 text-amber-500" />
            </h4>
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
                  <FeatureRow feature="Countdown Styles" free="1" pro="5+" />
                  <FeatureRow feature="Unlimited one-time and recurring events" free={true} pro={true} />
                  <FeatureRow feature="Multiple Locations / Venues" free={false} pro={true} />
                  <FeatureRow feature="Colors, Labels & Icon Customization" free={true} pro={true} />
                  <FeatureRow feature="Multiple Date Formats" free={true} pro={true} />
                  <FeatureRow feature="Priority Support" free={false} pro={true} />
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ProBanner;
