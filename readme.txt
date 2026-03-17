=== Next Event Countdown ===
Contributors: kindpixels
Plugin URI: https://kindpixels.dev/plugins/next-event-countdown/
Donate link: https://kindpixels.dev/donate
Tags: countdown, timer, event, church, service
Requires at least: 5.8
Tested up to: 6.9
Stable tag: 1.0.7
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A beautiful, always-accurate countdown widget that shows your congregation exactly when the next event starts — automatically.

== Description ==

**Stop manually updating countdown timers.** Next Event Countdown automatically cycles through your recurring events and always displays the one coming up next. Set it once, and it runs forever.

Perfect for churches, community centers, and any organization with a repeating weekly schedule.

= Why Next Event Countdown? =

Most countdown plugins make you pick a single date. When the event passes, the timer hits zero and stays there. Next Event Countdown is different — it knows your full schedule and always counts down to whatever's next.

* **Sunday morning service ends → timer instantly switches to Wednesday Bible study.**
* **Wednesday ends → it rolls to Friday youth group.**
* **Friday ends → back to Sunday.**

No manual updates. No expired timers. Just a clean, live countdown that's always right.

= Key Features =

* **Recurring Events** – Define one-time or weekly recurring events. The widget always shows the nearest one.
* **Multiple Counter Styles** – From minimal to bold LED, elegant serif, radial progress, and more.
* **Live Ticking** – Real-time countdown updates every second.
* **Fully Customizable** – Colors, labels, fonts, and icons — all configurable from the admin panel.
* **Responsive** – Looks great on desktop, tablet, and mobile.
* **Lightweight** – No jQuery. No bloat. Pure React compiled to a single optimized bundle.
* **Shortcode Embed** – Drop `[nxevtcd_countdown name="my-counter"]` anywhere.

= Free vs Pro =

**Free version includes:**
* 1 counter with unlimited events
* 1 countdown style
* Full color and label customization
* Recurring and one-time events
* Multiple date formats

**Pro version adds:**
* Unlimited counters
* 5+ premium countdown styles (LED Dots, Radial Progress, Gradient Glass, Card Blocks, Elegant Serif)
* Multiple locations / venues
* Priority support

For a full comparison, visit [kindpixels.dev/plugins/next-event-countdown-pro](https://kindpixels.dev/plugins/next-event-countdown-pro).

== Installation ==

1. In your WordPress dashboard, go to **Plugins → Add New**, search for **Next Event Countdown**, then click **Install Now** and **Activate**.
2. Alternatively, upload the `next-event-countdown` folder to `/wp-content/plugins/` via FTP, then activate it from the Plugins menu.
3. Go to **Next Event Countdown** in your admin sidebar to set up your first counter.
4. Add your events (e.g., Sunday Service at 10:00 AM, Wednesday Study at 7:00 PM).
5. Copy the shortcode `[nxevtcd_countdown name="my-counter"]` and paste it into any page, post, or widget area.

== Frequently Asked Questions ==

= How does it know which event to show? =

The plugin compares all your events against the current date and time, and automatically displays the one happening soonest. When that event passes, it moves to the next one — no action required.

= Can I have multiple countdowns on different pages? =

Yes, with the Pro version. Each counter gets its own shortcode, events, and style. The free version supports one counter.

= Does it work with page builders? =

Yes. The shortcode `[nxevtcd_countdown name="my-counter"]` works in Gutenberg, Elementor, WPBakery, Divi, and any builder that supports shortcodes.

= Will it slow down my site? =

No. The entire front-end is a single optimized JavaScript bundle with zero external dependencies. No jQuery, no extra HTTP requests.

= What if I have more questions? =

Check the Documentation tab inside the plugin, or visit [kindpixels.dev/support](https://kindpixels.dev/support).

== Screenshots ==

1. Admin dashboard — manage events and customize your counter.
2. Multiple countdown styles available in Pro.
3. Live countdown widget on the front end.

== Changelog ==

= 1.0.7 =
* Added Freemius checkout integration for Pro upgrades
* Improved upgrade links across admin UI and WordPress plugins page
* Minor UI refinements

= 1.0.6 =
* LED Dots counter style — improved label centering and separator alignment
* Counter style refinements across all premium styles
* Bug fixes

= 1.0.5 =
* Added premium counter styles (LED Dots, Radial Progress, Gradient Glass, Card Blocks, Elegant Serif)
* Pro/Free comparison table
* Freemius licensing integration

= 1.0.0 =
* Initial release

== Upgrade Notice ==

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

For questions or issues, visit [kindpixels.dev/support](https://kindpixels.dev/support) or use the WordPress.org support forum.

= Privacy =

This plugin does not collect personal data. All event data is stored locally in your WordPress database.
