/**
 * ============================================================================
 * ICS CALENDAR FEED SETTINGS (Pro Only)
 * ============================================================================
 *
 * Lets users paste an ICS/iCal feed URL to import events from external
 * calendars (Google Calendar, Outlook, Apple Calendar, etc.).
 *
 * Features:
 * - URL input with validation
 * - Auto-refresh interval selector
 * - "Sync Now" button
 * - Last synced timestamp
 * - Count of imported events
 *
 * @module IcsCalendarFeedSettings
 * ============================================================================
 */

import { useState } from "react";
import { CalendarSync, RefreshCw, Trash2, Globe, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getWPGlobal } from "@/config/pluginIdentity";
import { fetchIcsContent, parseIcsToEvents } from "@/utils/icsParser";
import type { CountdownConfig, SpecialEvent } from "./ServiceCountdownWidget";

const REFRESH_INTERVALS = [
  { value: "15", label: "Every 15 minutes" },
  { value: "30", label: "Every 30 minutes" },
  { value: "60", label: "Every hour" },
  { value: "180", label: "Every 3 hours" },
  { value: "360", label: "Every 6 hours" },
  { value: "720", label: "Every 12 hours" },
  { value: "1440", label: "Every 24 hours" },
];

interface IcsCalendarFeedSettingsProps {
  config: CountdownConfig;
  onChange: (config: CountdownConfig) => void;
}

const IcsCalendarFeedSettings = ({ config, onChange }: IcsCalendarFeedSettingsProps) => {
  const [urlInput, setUrlInput] = useState(config.icsFeedUrl || "");
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncResult, setLastSyncResult] = useState<{ count: number } | null>(null);

  const importedCount = (config.icsImportedEvents || []).length;

  const isValidUrl = (url: string): boolean => {
    if (!url.trim()) return false;
    // Accept webcal:// or http(s):// URLs
    const normalized = url.trim().replace(/^webcal:\/\//, 'https://');
    try {
      new URL(normalized);
      return true;
    } catch {
      return false;
    }
  };

  const normalizeUrl = (url: string): string => {
    return url.trim().replace(/^webcal:\/\//, 'https://');
  };

  const handleSync = async () => {
    const feedUrl = urlInput.trim();
    if (!isValidUrl(feedUrl)) {
      setError("Please enter a valid ICS feed URL");
      return;
    }

    setSyncing(true);
    setError(null);
    setLastSyncResult(null);

    try {
      const wp = getWPGlobal();
      const wpContext = wp?.ajaxUrl && wp?.nonce
        ? { ajaxUrl: wp.ajaxUrl, nonce: wp.nonce }
        : undefined;

      const icsContent = await fetchIcsContent(normalizeUrl(feedUrl), wpContext);
      const importedEvents = parseIcsToEvents(icsContent);

      onChange({
        ...config,
        icsFeedUrl: feedUrl,
        icsImportedEvents: importedEvents,
        icsLastSync: new Date().toISOString(),
        icsRefreshMinutes: config.icsRefreshMinutes || 60,
      });

      setLastSyncResult({ count: importedEvents.length });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch ICS feed");
    } finally {
      setSyncing(false);
    }
  };

  const handleRemoveFeed = () => {
    setUrlInput("");
    setError(null);
    setLastSyncResult(null);
    onChange({
      ...config,
      icsFeedUrl: undefined,
      icsImportedEvents: undefined,
      icsLastSync: undefined,
      icsRefreshMinutes: undefined,
    });
  };

  const handleRefreshIntervalChange = (val: string) => {
    onChange({
      ...config,
      icsRefreshMinutes: parseInt(val),
    });
  };

  const formatLastSync = (iso?: string): string => {
    if (!iso) return "Never";
    try {
      const d = new Date(iso);
      const now = new Date();
      const diffMin = Math.round((now.getTime() - d.getTime()) / 60000);
      if (diffMin < 1) return "Just now";
      if (diffMin < 60) return `${diffMin} min ago`;
      if (diffMin < 1440) return `${Math.round(diffMin / 60)}h ago`;
      return d.toLocaleDateString();
    } catch {
      return "Unknown";
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="pb-2 pt-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              Calendar Feed Import
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Pro</Badge>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Import events from Google Calendar, Outlook, Apple Calendar, or any ICS feed
            </p>
          </div>
          {config.icsFeedUrl && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRemoveFeed}
              className="h-7 text-xs text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Remove
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* URL Input */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">ICS Feed URL</Label>
          <div className="flex gap-2">
            <Input
              value={urlInput}
              onChange={(e) => { setUrlInput(e.target.value); setError(null); }}
              placeholder="https://calendar.google.com/calendar/ical/…/basic.ics"
              className="h-8 text-sm flex-1"
            />
            <Button
              size="sm"
              onClick={handleSync}
              disabled={syncing || !urlInput.trim()}
              className="h-8 text-xs gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {syncing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              {config.icsFeedUrl ? "Sync Now" : "Import"}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Paste a public ICS/iCal URL · webcal:// links are also supported
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Success message */}
        {lastSyncResult && (
          <div className="flex items-center gap-2 text-xs text-primary bg-primary/10 rounded-md px-3 py-2">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            Imported {lastSyncResult.count} upcoming event{lastSyncResult.count !== 1 ? 's' : ''}
          </div>
        )}

        {/* Feed status row (shown when feed is active) */}
        {config.icsFeedUrl && (
          <div className="grid grid-cols-2 gap-3">
            {/* Refresh Interval */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> Auto-refresh
              </Label>
              <Select
                value={String(config.icsRefreshMinutes || 60)}
                onValueChange={handleRefreshIntervalChange}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REFRESH_INTERVALS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <CalendarSync className="w-3 h-3" /> Status
              </Label>
              <div className="flex items-center gap-2 h-8 px-3 rounded-md border border-border bg-muted/30 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span className="text-xs truncate">
                  {importedCount} event{importedCount !== 1 ? 's' : ''} · Synced {formatLastSync(config.icsLastSync)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Help text */}
        {!config.icsFeedUrl && (
          <div className="text-[10px] text-muted-foreground space-y-1 bg-muted/30 rounded-md px-3 py-2">
            <p className="font-medium">How to get your calendar feed URL:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-1">
              <li><strong>Google Calendar:</strong> Settings → Calendar → Integrate → Secret/Public address in iCal format</li>
              <li><strong>Outlook:</strong> Settings → Calendar → Shared calendars → Publish → ICS link</li>
              <li><strong>Apple Calendar:</strong> Calendar → File → Export or use iCloud calendar sharing</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IcsCalendarFeedSettings;
