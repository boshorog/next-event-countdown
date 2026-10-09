# Architecture rules
- Detect demo mode through one shared helper; demo edits stay in session storage and bypass WordPress reads/writes so public visitors cannot affect site data.
- Demo uses the Free experience, matching PDF Gallery; it never changes real licensing or injects premium code into Free builds.
- Suppress outside notices only on the countdown admin screen through its load hook and server-side body class; enqueue external page CSS so suppression does not depend on React startup.
- Embed public demos using a dedicated shortcode with no AJAX URL or nonce and an enqueued, source/origin/token-checked resize listener to keep site administration isolated.
- Measure both supported app mount IDs and debounce every content change; demos avoid viewport minimum heights so iframe resizing can grow and shrink without feedback loops.
- Copy the demo listener and admin-page stylesheet explicitly into both release builds because public directory copying is disabled to preserve Vite's generated entry page.
- Refresh Pro updates with the public Freemius get_update(false, true) method before WordPress refresh; throttle Plugins-screen checks and leave updater injection to the SDK.
- Refuse release packaging without the official Freemius SDK because silent fallback instances cannot provide licensing or Pro updates.