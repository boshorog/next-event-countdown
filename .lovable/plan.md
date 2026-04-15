

## ICS Calendar Feed Import (Pro Feature)

This feature lets users paste an ICS/iCal URL from Google Calendar, Outlook, Apple Calendar, or any system that exposes `.ics` feeds. The plugin fetches and parses events, merges them with local events, and auto-refreshes on a configurable interval.

### Architecture

Since this is a WordPress plugin (client-side React app with a PHP backend), ICS fetching must happen server-side (PHP) to avoid CORS issues. The React frontend manages configuration and triggers syncs via AJAX.

```text
┌─────────────────────────────────────────────────┐
│  React UI (Pro only)                            │
│  - ICS Feed URL input + Add button              │
│  - Feed list with status/last sync time         │
│  - "Sync Now" button per feed                   │
│  - Auto-refresh interval selector               │
│  - Imported events shown with "Imported" badge   │
└──────────────────┬──────────────────────────────┘
                   │ AJAX
┌──────────────────▼──────────────────────────────┐
│  PHP Backend                                     │
│  - fetch_ics_feed: fetches URL, parses VEVENT    │
│  - Stores imported events in wp_options          │
│  - WP-Cron for auto-refresh                      │
│  - Returns parsed events to React                │
└─────────────────────────────────────────────────┘
```

### Changes

**1. Extend CountdownConfig type** (`ServiceCountdownWidget.tsx`)
- Add `icsFeedUrl?: string` — the ICS feed URL
- Add `icsRefreshMinutes?: number` — auto-refresh interval (default 60)
- Add `icsLastSync?: string` — ISO timestamp of last sync
- Add `icsImportedEvents?: SpecialEvent[]` — cached imported events (each with an `imported: true` flag)
- Add `imported?: boolean` to `SpecialEvent` interface — labels events as imported vs local

**2. Create ICS Feed Settings UI** (`src/components/IcsCalendarFeedSettings.tsx`)
- New Pro-gated component with:
  - URL input field with validation (must end in `.ics` or contain `webcal://`)
  - Auto-refresh interval selector (15min, 30min, 1h, 3h, 6h, 12h, 24h)
  - Last synced timestamp display
  - "Sync Now" button with loading state
  - List of imported events count
- Placed inside the EventScheduleManager as a new collapsible section

**3. ICS Parsing utility** (`src/utils/icsParser.ts`)
- Client-side parser for `.ics` content (VCALENDAR/VEVENT format)
- Extracts: DTSTART, DTEND (for duration), SUMMARY (title), RRULE (for recurring)
- Converts VEVENT entries to `SpecialEvent[]` with `imported: true`
- Handles timezone conversion (TZID parameter)
- Filters to only future events (next 90 days)

**4. PHP backend handler** (in `kindpixels-next-event-countdown.php`)
- New AJAX action `nxevtcd_fetch_ics` that:
  - Accepts the ICS URL
  - Fetches via `wp_remote_get()` (handles CORS server-side)
  - Returns raw ICS content to the React app for parsing
  - Alternatively: parses server-side and returns JSON events
- WP-Cron hook for periodic background refresh

**5. Merge logic in countdown calculation** (`ServiceCountdownWidget.tsx`)
- `getNextService()` already processes both `schedules` and `specialEvents`
- Imported events (with `imported: true`) get merged into `specialEvents` array
- No change needed to countdown logic — imported events are treated identically

**6. UI labels in EventScheduleManager**
- Special events list shows a small badge: "Imported" (blue) or "Local" (default)
- Imported events are read-only (no edit, only delete to stop importing that specific one)
- "Sync Now" triggers an immediate AJAX fetch + re-parse

**7. Build flags gating** (`buildFlags.ts`)
- Add `ICS_FEED: BUILD_VARIANT === 'pro' || isDevPro` flag
- UI components conditionally rendered based on this flag

### Dev preview behavior
In dev preview mode (Lovable/localhost), the ICS fetch will use a CORS proxy or mock data since there's no PHP backend. A simulated fetch with sample ICS data will demonstrate the feature.

### What you might be missing
- **Multiple feeds**: Support for more than one ICS URL per counter (e.g., one from Google Calendar + one from Outlook)
- **Event deduplication**: If the same event exists locally and in the feed, detect duplicates by matching title + date
- **Feed validation**: Show a preview of imported events before committing
- **Error handling**: Clear error messages for invalid URLs, unreachable feeds, or malformed ICS data

