/**
 * ============================================================================
 * ICS / iCalendar Parser
 * ============================================================================
 *
 * Parses raw .ics (RFC 5545) content into SpecialEvent objects.
 * Handles VEVENT blocks, DTSTART, DTEND, SUMMARY, RRULE expansion.
 *
 * @module icsParser
 * ============================================================================
 */

import type { SpecialEvent } from '@/components/ServiceCountdownWidget';

/** Unfold continuation lines per RFC 5545 §3.1 */
function unfold(raw: string): string {
  return raw.replace(/\r?\n[ \t]/g, '');
}

/** Parse an ICS date/datetime string → Date (UTC) */
function parseIcsDate(val: string): Date | null {
  // YYYYMMDD or YYYYMMDDTHHmmss or YYYYMMDDTHHmmssZ
  const m = val.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2}))?(Z)?$/);
  if (!m) return null;
  const [, y, mo, d, h, mi, s, z] = m;
  if (z || !h) {
    return new Date(Date.UTC(+y, +mo - 1, +d, +(h || 0), +(mi || 0), +(s || 0)));
  }
  // No Z → treat as local (we'll use as-is)
  return new Date(+y, +mo - 1, +d, +h, +mi, +s);
}

/** Extract property value, stripping params like TZID */
function propValue(line: string): string {
  const colonIdx = line.indexOf(':');
  if (colonIdx === -1) return line;
  return line.substring(colonIdx + 1).trim();
}

interface ParsedVEvent {
  summary: string;
  dtStart: Date;
  dtEnd?: Date;
  rrule?: string;
}

function extractVEvents(icsContent: string): ParsedVEvent[] {
  const unfolded = unfold(icsContent);
  const lines = unfolded.split(/\r?\n/);
  const events: ParsedVEvent[] = [];
  let inEvent = false;
  let current: Partial<ParsedVEvent> = {};

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      inEvent = true;
      current = {};
      continue;
    }
    if (line === 'END:VEVENT') {
      inEvent = false;
      if (current.summary && current.dtStart) {
        events.push(current as ParsedVEvent);
      }
      continue;
    }
    if (!inEvent) continue;

    if (line.startsWith('SUMMARY')) {
      current.summary = propValue(line);
    } else if (line.startsWith('DTSTART')) {
      const val = propValue(line);
      const d = parseIcsDate(val);
      if (d) current.dtStart = d;
    } else if (line.startsWith('DTEND')) {
      const val = propValue(line);
      const d = parseIcsDate(val);
      if (d) current.dtEnd = d;
    } else if (line.startsWith('RRULE')) {
      current.rrule = propValue(line);
    }
  }
  return events;
}

/** Expand a single RRULE into future dates (next 90 days). Supports FREQ=WEEKLY and FREQ=DAILY. */
function expandRRule(dtStart: Date, rrule: string, horizonDays = 90): Date[] {
  const now = new Date();
  const horizon = new Date(now.getTime() + horizonDays * 24 * 60 * 60 * 1000);
  const parts: Record<string, string> = {};
  rrule.split(';').forEach(p => {
    const [k, v] = p.split('=');
    if (k && v) parts[k] = v;
  });

  const freq = parts['FREQ'];
  const interval = parseInt(parts['INTERVAL'] || '1');
  const count = parts['COUNT'] ? parseInt(parts['COUNT']) : undefined;
  const until = parts['UNTIL'] ? parseIcsDate(parts['UNTIL']) : undefined;

  const dates: Date[] = [];
  let current = new Date(dtStart);
  let iterations = 0;
  const maxIterations = 500;

  while (iterations < maxIterations) {
    if (current > horizon) break;
    if (until && current > until) break;
    if (count !== undefined && iterations >= count) break;

    if (current >= now) {
      dates.push(new Date(current));
    }

    // Advance
    if (freq === 'DAILY') {
      current = new Date(current.getTime() + interval * 24 * 60 * 60 * 1000);
    } else if (freq === 'WEEKLY') {
      current = new Date(current.getTime() + interval * 7 * 24 * 60 * 60 * 1000);
    } else if (freq === 'MONTHLY') {
      const next = new Date(current);
      next.setMonth(next.getMonth() + interval);
      current = next;
    } else if (freq === 'YEARLY') {
      const next = new Date(current);
      next.setFullYear(next.getFullYear() + interval);
      current = next;
    } else {
      break; // Unsupported frequency
    }
    iterations++;
  }
  return dates;
}

/**
 * Parse ICS content and return SpecialEvent[] (future events, next 90 days).
 * All returned events have `imported: true`.
 */
export function parseIcsToEvents(icsContent: string, horizonDays = 90): (SpecialEvent & { imported: true })[] {
  const vEvents = extractVEvents(icsContent);
  const now = new Date();
  const horizon = new Date(now.getTime() + horizonDays * 24 * 60 * 60 * 1000);
  const results: (SpecialEvent & { imported: true })[] = [];

  for (const ev of vEvents) {
    const durationMin = ev.dtEnd
      ? Math.max(15, Math.round((ev.dtEnd.getTime() - ev.dtStart.getTime()) / 60000))
      : 60;

    const datesToAdd: Date[] = [];

    if (ev.rrule) {
      datesToAdd.push(...expandRRule(ev.dtStart, ev.rrule, horizonDays));
    } else {
      if (ev.dtStart >= now && ev.dtStart <= horizon) {
        datesToAdd.push(ev.dtStart);
      }
    }

    for (const d of datesToAdd) {
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      results.push({
        date: iso,
        hour: d.getHours(),
        minute: d.getMinutes(),
        title: ev.summary || 'Imported Event',
        duration: Math.min(durationMin, 480),
        imported: true,
      });
    }
  }

  // Sort by date/time
  results.sort((a, b) => {
    const da = new Date(`${a.date}T${String(a.hour).padStart(2, '0')}:${String(a.minute).padStart(2, '0')}`);
    const db = new Date(`${b.date}T${String(b.hour).padStart(2, '0')}:${String(b.minute).padStart(2, '0')}`);
    return da.getTime() - db.getTime();
  });

  return results;
}

/**
 * Fetch ICS content. In WordPress, goes through PHP AJAX proxy.
 * In dev preview, attempts direct fetch (may fail due to CORS) or uses mock data.
 */
export async function fetchIcsContent(
  url: string,
  wpContext?: { ajaxUrl: string; nonce: string }
): Promise<string> {
  if (wpContext?.ajaxUrl && wpContext?.nonce) {
    // WordPress: proxy through PHP
    const form = new FormData();
    form.append('action', 'nxevtcd_action');
    form.append('action_type', 'fetch_ics_feed');
    form.append('nonce', wpContext.nonce);
    form.append('ics_url', url);

    const res = await fetch(wpContext.ajaxUrl, { method: 'POST', credentials: 'same-origin', body: form });
    const json = await res.json();
    if (json?.success && json?.data?.ics_content) {
      return json.data.ics_content;
    }
    throw new Error(json?.data?.message || json?.data || 'Failed to fetch ICS feed');
  }

  // Dev preview: use allorigins JSON endpoint (more reliable than raw)
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const json = await res.json();
      const text = json?.contents;
      if (text && text.includes('BEGIN:VCALENDAR')) return text;
    }
  } catch {
    // continue to next attempt
  }

  // Try direct fetch (may work for some public feeds)
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    if (text.includes('BEGIN:VCALENDAR')) return text;
  } catch {
    // ignore
  }

  throw new Error('Could not fetch ICS feed. Make sure the URL is a valid public ICS/iCal feed.');
}

