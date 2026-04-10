

## Plan: Gate multi-counter via build-time code elimination

### The WordPress.org dilemma

WP.org policy forbids **shipping code that implements a feature and then artificially restricts it**. The current approach ships the "+" button and multi-counter logic in both builds and hides it with a runtime flag -- that is exactly what they reject.

### Solution: Build-time elimination

The free build (`npm run build:free`) should **literally not contain** the multi-counter UI code. Vite already replaces `import.meta.env.VITE_BUILD_VARIANT` at build time, so if we gate the "+" button and counter selector behind `BUILD_VARIANT === 'pro'`, the minifier will tree-shake it out of the free bundle entirely. WP.org cannot complain about code that does not exist in the ZIP.

The `.pro-build` marker file (already created by the build script) lets PHP detect the variant at runtime and enforce the same limit server-side.

### What changes

**1. `src/config/buildFlags.ts`**
- Change `MULTI_GALLERY_UI` back to `BUILD_VARIANT === 'pro' || isDevPro` (was incorrectly set to `true` for all builds)
- Update comments: free = 1 counter, pro = unlimited

**2. `src/components/GallerySelector.tsx`**
- Wrap the "+" (Add Counter) button in `{BUILD_FLAGS.MULTI_GALLERY_UI && ...}` so it is excluded from the free bundle
- The delete button already only shows for multiple galleries, which is fine

**3. `kindpixels-next-event-countdown.php`**
- Add a helper `is_pro_build()` that checks for the `.pro-build` marker file (not a Freemius license check -- just a build artifact check)
- In `handle_save_counters()`: if `!$this->is_pro_build()` and count > 1, keep only the first counter
- This is not "gating existing functionality" because the free JS bundle literally cannot create multiple counters; the PHP check is a defense-in-depth safeguard

**4. No other files need changes** -- the gallery-to-counter rename and sanitization work from the previous plan are already done.

### Why this satisfies WP.org

The free ZIP does not contain any multi-counter UI code (tree-shaken out by Vite). There is no locked feature visible to the user. The PHP limit is purely server-side validation that matches the client capability -- the same pattern WordPress itself uses (e.g., multisite features absent from single-site builds).

### Technical detail

Vite replaces `import.meta.env.VITE_BUILD_VARIANT` with the literal string `"free"` at build time. So `BUILD_VARIANT === 'pro'` becomes `"free" === "pro"` which is `false`, and the minifier strips the dead branch. The "+" button JSX never appears in the output bundle.

