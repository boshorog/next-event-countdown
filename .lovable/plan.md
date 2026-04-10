

## Plan: Remove Pro restrictions from free version + Rename "gallery" to "counter" + Fix sanitization

### Problem Summary
1. **WordPress.org compliance**: The free version artificially restricts multi-counter functionality that is already implemented. WP Directory policy forbids shipping code that gates existing functionality behind a paywall.
2. **Legacy "gallery" naming**: All internal references still use "gallery" terminology from the PDF Gallery plugin this was forked from.
3. **Sanitization gap**: The `items` array inside galleries/counters is stored unsanitized (line 1014 of PHP).

### What Changes

**A. Remove all Pro-gating from free version**

- **PHP (`kindpixels-next-event-countdown.php`)**:
  - Remove the `is_pro_license()` method entirely (no longer needed for feature gating)
  - Remove the multi-counter limit in `handle_save_galleries()` (lines 1002-1005)
  - Remove the gallery_id restriction in `handle_save_countdown_config()` (lines 923-931)
  
- **Frontend (`src/config/buildFlags.ts`)**:
  - Set `MULTI_GALLERY_UI: true` unconditionally (free users get unlimited counters)
  - Keep `COUNTER_STYLES` and `ANALYTICS` as Pro-only (these are genuinely new features not present in free code)

- **Frontend (`src/components/GallerySelector.tsx`)**:
  - Remove the `BUILD_FLAGS.MULTI_GALLERY_UI` gate around the "+" button — always show it
  - Remove the Pro check in `handleCreateGallery`

**B. Rename "gallery" to "counter" everywhere**

- **PHP file**: Rename option keys `nxevtcd_galleries` to `nxevtcd_counters`, `nxevtcd_current_gallery_id` to `nxevtcd_current_counter_id`, handler names `handle_save_galleries` to `handle_save_counters`, AJAX action types `save_galleries`/`get_galleries`/`reset_galleries` to `save_counters`/`get_counters`/`reset_counters`. Add migration in `maybe_upgrade()` to copy old option values to new keys.
- **TypeScript types (`src/types/gallery.ts`)**: Rename file content — `Gallery` to `Counter`, `GalleryItem` to `CounterItem`, `GalleryState` to `CounterState`, etc. Keep the filename as-is to minimize import churn (or rename it).
- **All frontend files** referencing gallery types and AJAX action types: Update variable names and AJAX `action_type` strings.
- **Components**: `GallerySelector.tsx` renamed internally, `GalleryNotFound.tsx` references updated.

**C. Fix sanitization thoroughly**

- **`handle_save_counters` (was galleries)**: Recursively sanitize the `items` array entries instead of storing them raw. Each item's fields (`id`, `title`, `date`, `pdfUrl`, `thumbnail`, `text`, `type`) must be individually sanitized with `sanitize_text_field` or `esc_url_raw` as appropriate.
- **`handle_save_countdown_config`**: The `$config_json` on line 920 uses raw `wp_unslash` without `sanitize_text_field` — add sanitization before `json_decode` (though `sanitize_text_field` can corrupt JSON; instead validate the decoded structure recursively, which is already done via `sanitize_countdown_config`). The fix: validate the raw string is valid JSON first, then sanitize the decoded array.
- **`handle_save_settings`**: Already uses `sanitize_text_field` which may corrupt JSON with special chars. Switch to the same pattern: `wp_unslash` → `json_decode` → recursive sanitize.
- **Output escaping**: Audit all `wp_send_json_success` / `echo` calls to ensure data returned to clients is properly escaped.

**D. Version bump to 1.1.7**

Update version in PHP header, `NXEVTCD_VERSION`, `pluginIdentity.ts`, and `readme.txt` changelog.

### Files to modify
- `kindpixels-next-event-countdown.php` — Remove Pro gating, rename gallery→counter, fix sanitization, add migration, bump version
- `src/types/gallery.ts` — Rename types (Gallery→Counter, etc.)
- `src/config/buildFlags.ts` — Make MULTI_GALLERY_UI always true
- `src/components/GallerySelector.tsx` — Remove Pro gates, rename variables
- `src/pages/Index.tsx` — Update all gallery references to counter
- `src/components/PDFAdmin.tsx` — Update gallery references
- `src/components/AnalyticsModal.tsx` — Update gallery prop names
- `src/hooks/useAnalyticsTracking.ts` — Update comments
- `src/utils/analyticsApi.ts` — Update gallery_id references in comments
- `src/config/pluginIdentity.ts` — Bump version
- `readme.txt` — Bump version, add changelog

### Migration strategy (PHP)
```php
private function maybe_upgrade() {
    $stored = get_option('nxevtcd_version', '');
    if ($stored === NXEVTCD_VERSION) return;
    
    // Migrate gallery option keys to counter keys
    $old = get_option('nxevtcd_galleries');
    if ($old !== false && get_option('nxevtcd_counters') === false) {
        update_option('nxevtcd_counters', $old);
        delete_option('nxevtcd_galleries');
    }
    $old_id = get_option('nxevtcd_current_gallery_id');
    if ($old_id !== false && get_option('nxevtcd_current_counter_id') === false) {
        update_option('nxevtcd_current_counter_id', $old_id);
        delete_option('nxevtcd_current_gallery_id');
    }
    
    update_option('nxevtcd_version', NXEVTCD_VERSION);
}
```

