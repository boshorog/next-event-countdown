=== KindPixels Next Event Countdown ===
Contributors: kindpixels
Plugin URI: https://kindpixels.com/plugins/next-event-countdown/
Tags: countdown, timer, event, recurring, schedule
Requires at least: 5.8
Tested up to: 6.9
Stable tag: 1.2.1
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A beautiful countdown widget that automatically shows the next upcoming event, including recurring and one-time events.

== Description ==

**Stop manually updating countdown timers!** Next Event Countdown automatically cycles through your events and always displays the one coming up next. Set it once, and it runs forever.

Whether you run a gym, a church, a school, a co-working space, a community center, or a weekly meetup — if you have events that repeat, this plugin keeps your visitors informed without any manual work.

= Real-World Examples =

* **Fitness studios** — show the next class: yoga at 6 AM → spinning at noon → HIIT at 5 PM.
* **Churches** — Sunday service ends → midweek Bible study → Friday youth group → back to Sunday.
* **Schools & universities** — next open day, parent-teacher conference, or semester start.
* **Restaurants & bars** — happy hour countdown, trivia night, live music events.
* **Co-working spaces** — networking events, workshops, community lunches.
* **Online communities** — weekly webinars, AMAs, or live streams.

= Why Next Event Countdown? =

Most countdown plugins make you pick a single date. When the event passes, the timer hits zero and stays there. Next Event Countdown is different — it knows your full schedule and always counts down to whatever's next.

No manual updates. No expired timers. Just a clean, live countdown that's always right.

= Key Features =

* **Recurring Events** – Define one-time or weekly recurring events. The widget always shows the nearest one.
* **Live Ticking** – Real-time countdown updates every second.
* **Fully Customizable** – Colors, labels, fonts, and icons — all configurable from the admin panel.
* **Responsive** – Looks great on desktop, tablet, and mobile.
* **Lightweight** – No bloat, no external dependencies. A single optimized bundle that won't slow your site down.
* **Shortcode Embed** – Drop `[nxevtcd_countdown name="my-counter"]` anywhere.

= Free vs Pro =

**Free version includes:**
* 1 counter with unlimited events
* 1 countdown style
* Full color and label customization
* Recurring and one-time events
* Multiple date formats and timezone support

**Pro version adds:**
* Additional counters for different pages or locations
* 5+ premium countdown styles
* Multiple locations / venues within the same website
* Import events from Google Calendar and Outlook
* Priority support

For a full comparison, visit [kindpixels.com/plugins/next-event-countdown](https://kindpixels.com/plugins/next-event-countdown).

== Installation ==

1. In your WordPress dashboard, go to **Plugins → Add New**, search for **KindPixels Next Event Countdown**, then click **Install Now** and **Activate**.
2. Alternatively, upload the `kindpixels-next-event-countdown` folder to `/wp-content/plugins/` via FTP, then activate it from the Plugins menu.
3. Go to **KindPixels Next Event Countdown** in your admin sidebar to set up your first counter.
4. Add your events (e.g., Sunday Service at 10:00 AM, Wednesday Study at 7:00 PM).
5. Copy the shortcode `[nxevtcd_countdown name="my-counter"]` and paste it into any page, post, or widget area.

== Frequently Asked Questions ==

= How does it know which event to show? =

The plugin compares all your events against the current date and time, and automatically displays the one happening soonest. When that event passes, it moves to the next one — no action required.

= Can I have multiple countdowns on different pages? =

Yes, with the Pro version. Each counter gets its own shortcode, events, and style — allowing you to show different countdowns for different pages or locations. The free version supports one counter.

= Does it work with page builders? =

Yes. The shortcode `[nxevtcd_countdown name="my-counter"]` works in Gutenberg, Elementor, WPBakery, Divi, and any builder that supports shortcodes.

= Will it slow down my site? =

No. The entire front-end is a single optimized bundle with zero external dependencies. No extra HTTP requests, no bloat.

= What if I have more questions? =

Check the Documentation tab inside the plugin, or visit [kindpixels.com/support](https://kindpixels.com/support).

== Screenshots ==

1. Admin dashboard — manage events and customize your counter.
2. Multiple countdown styles available in Pro.
3. Live countdown widget on the front end.

== Changelog ==

= 1.2.1 =
* Counter styles polishes
* Bug fixes and performance improvements

= 1.2.0 =
* New feature: ICS Calendar Feed import (Pro) — sync events from Google Calendar, Outlook, Apple Calendar, etc.
* Added "Make Recurring" action for imported events
* Multiple counter styles and sizing improvements
* Bug fixes

= 1.1.9 =
* Fixed position offset not applying when counter is embedded via shortcode
* Fixed flash of default counter style/events on frontend load — now shows a loading placeholder until saved config is ready
* Bug fixes

= 1.1.8 =
* Removed server-side counter truncation — free version no longer restricts saving multiple counters
* Added external services disclosure (Freemius, WordPress.org API) per WordPress.org guidelines
* Bug fixes

= 1.1.7 =
* Compliance fixes for WordPress.org guidelines
* Improved data sanitization: all nested counter data is now recursively sanitized before storage
* Bug fixes

= 1.1.6 =
* Fixed several WordPress Directory compliance issues
* Added Header / Digits Balance slider — shift visual emphasis between the header area and countdown digits

= 1.1.5 =
* Fixed Freemius wp.org compliance (is_premium set to false for free version)
* Replaced all inline script/style tags with proper wp_enqueue and wp_add_inline_script/style
* Improved mobile responsiveness — countdown digits now scale fluidly and no longer clip on small screens
* Bug fixes

= 1.1.3 =
* Improved mobile responsiveness — countdown no longer clips on small screens
* Fixed counter size setting persistence in frontend
* Removed extra blank space below the countdown widget
* Improved time input fields with validation highlighting
* Bug fixes

= 1.1.2 =
* Improved update resilience — events and settings are fully preserved during plugin updates
* Bug fixes

= 1.1.1 =
* Fixed shortcode frontend rendering — countdown widget now displays correctly on pages and posts
* Improved default style alignment consistency between admin preview and frontend
* Added "Live Event Countdown" toggle — show remaining event duration instead of 00:00:00
* Bug fixes and visual refinements

= 1.1.0 =
* Added multi-language support with 21 languages for all countdown labels, day names, and month names
* Reorganized Other Settings into grouped sections (Layout, Regional, Visibility, Frame & Shape)
* Added customizable day-of-week and month name labels
* Added date connector word customization for localized date formats

= 1.0.9 =
* Updated plugin documentation
* Minor copy improvements

= 1.0.8 =
* Bug fixes

= 1.0.7 =
* Refined Freemius checkout workflow for Pro upgrades
* Minor UI tweaks

= 1.0.6 =
* Counter style refinements across all premium styles
* Bug fixes

= 1.0.5 =
* Added premium counter styles (LED Dots, Radial Progress, Gradient Glass, Card Blocks, Elegant Serif)
* Pro/Free comparison table
* Freemius licensing integration

= 1.0.0 =
* Initial release

== Upgrade Notice ==

= 1.1.0 =
Multi-language support and improved settings organization.

= 1.0.8 =
Bug fixes.

= 1.0.7 =
Checkout and upgrade links now point to the correct Freemius plan.

= 1.0.5 =
New premium counter styles and Pro upgrade path.

== Additional Information ==

= Using the Shortcode =

Each counter has a unique shortcode. Copy it from the admin panel and paste it into any page or post:

`[nxevtcd_countdown name="my-counter"]`

All display settings are configured in the plugin dashboard — no shortcode parameters needed beyond the name.

= Source Code =

The full source code is available on GitHub:
https://github.com/boshorog/next-event-countdown

= Support =

For questions or issues, visit [kindpixels.com/support](https://kindpixels.com/support) or use the WordPress.org support forum.

= Privacy =

This plugin does not collect personal data. All event data is stored locally in your WordPress database.

== External services ==

This plugin relies on the following third-party services:

= Freemius =

Freemius is used for software licensing, checkout, and optional Pro upgrades. When a user initiates a Pro upgrade, the plugin redirects to the Freemius checkout page. The Freemius SDK (bundled with the plugin) may transmit site URL, plugin version, and license status to Freemius servers for license validation and update checks.

* Service provider: Freemius, Inc.
* [Terms of Service](https://freemius.com/terms/)
* [Privacy Policy](https://freemius.com/privacy/)

= WordPress.org Plugins API =

The plugin queries the WordPress.org Plugins API to check whether a newer version of the plugin is available. This request is made from the admin dashboard and sends only the plugin slug. No personal or site-specific data is transmitted.

* Service provider: WordPress.org
* API endpoint: `https://api.wordpress.org/plugins/info/1.0/`
* [Privacy Policy](https://wordpress.org/about/privacy/)
