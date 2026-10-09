import { getWPGlobal } from '@/config/pluginIdentity';
import { BUILD_VARIANT } from '@/config/buildFlags';
import { useLicense } from '@/hooks/useLicense';

/**
 * Read-only licensing snapshot, shown only with ?nxevtcd_debug=1 in WP admin.
 * Helps pinpoint why a Pro install still behaves as Free.
 */
const LicenseDebugPanel = () => {
  const license = useLicense();
  let enabled = false;
  try {
    enabled = new URLSearchParams(window.location.search).get('nxevtcd_debug') === '1';
  } catch {}
  if (!enabled) return null;

  const wp = getWPGlobal();
  const server = (wp?.fsDebug ?? {}) as Record<string, unknown>;
  const rows: [string, unknown][] = [
    ['Interface bundle', BUILD_VARIANT],
    ['Detected license (interface)', license.checked ? license.status : 'checking…'],
    ['fsIsPro (server)', wp?.fsIsPro],
    ...Object.entries(server),
  ];

  return (
    <div className="mx-6 mb-6 rounded-lg border border-border bg-muted p-4 text-xs font-mono">
      <div className="mb-2 font-sans text-sm font-semibold text-foreground">License diagnostics</div>
      {!wp && <div className="text-destructive">WordPress data not found on this page.</div>}
      <table className="w-full">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="border-t border-border/60">
              <td className="py-1 pr-4 text-muted-foreground">{k}</td>
              <td className="py-1 text-foreground">{v === null || v === undefined ? '—' : String(v)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LicenseDebugPanel;
