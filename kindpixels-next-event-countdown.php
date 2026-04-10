<?php
/**
 * Plugin Name: KindPixels Next Event Countdown
 * Plugin URI: https://kindpixels.com/plugins/next-event-countdown/
 * Description: A beautiful, always-accurate countdown widget that automatically shows the next upcoming event — perfect for any organization with a recurring schedule.
 * Version: 1.1.7
 * Author: KIND PIXELS
 * Author URI: https://kindpixels.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: kindpixels-next-event-countdown
 * Requires at least: 5.8
 * Tested up to: 6.9
 */
// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Prevent double-loading within this request (avoids "Cannot redeclare" fatals)
if ( defined( 'NXEVTCD_PLUGIN_LOADED' ) ) {
    return;
}
define( 'NXEVTCD_PLUGIN_LOADED', true );

define( 'NXEVTCD_VERSION', '1.1.7' );

// Freemius SDK Initialization
if ( ! function_exists( 'nxevtcd_fs' ) ) {

    // Create a helper function for easy SDK access.

    function nxevtcd_fs() {

        global $nxevtcd_fs;

        if ( ! isset( $nxevtcd_fs ) ) {

            // Include Freemius SDK.

            require_once dirname( __FILE__ ) . '/vendor/freemius/start.php';

            $nxevtcd_fs = fs_dynamic_init( array(

                'id'                  => '25492',

                'slug'                => 'kindpixels-next-event-countdown',

                'type'                => 'plugin',

                'public_key'          => 'pk_4f0cdea63e183645cd7daa2d59bd9',

                'is_premium'          => false,

                'premium_suffix'      => 'PRO',

                'has_premium_version' => true,

                'has_addons'          => false,

                'has_paid_plans'      => true,

                'is_org_compliant'    => true,

                'menu'                => array(

                    'slug'           => 'kindpixels-next-event-countdown-manager',

                    'support'        => false,

                ),

            ) );

        }

        return $nxevtcd_fs;

    }

    // Init Freemius.

    nxevtcd_fs();

    // Signal that SDK was initiated.

    do_action( 'nxevtcd_fs_loaded' );

    // Hook license change redirect
    nxevtcd_fs()->add_action( 'after_license_change', 'nxevtcd_after_license_change' );

}

/**
 * Redirect to plugin page after license activation/deactivation.
 */
function nxevtcd_after_license_change( $plan_change ) {
    if ( ! is_admin() ) {
        return;
    }
    
    set_transient( 'nxevtcd_license_changed', time(), 300 );
    
    $redirect_url = add_query_arg( array(
        'page'          => 'kindpixels-next-event-countdown-manager',
        'license_updated' => time(),
    ), admin_url( 'admin.php' ) );
    
    wp_safe_redirect( $redirect_url );
    exit;
}

class NxEvtCd_Plugin {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
    }
    
    public function init() {
        $this->maybe_upgrade();

        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        add_action('wp_enqueue_scripts', array($this, 'register_frontend_assets'));
        add_shortcode('nxevtcd_countdown', array($this, 'display_countdown_shortcode'));
        
        // AJAX handlers
        add_action('wp_ajax_nxevtcd_action', array($this, 'handle_nxevtcd_ajax'));
        add_action('wp_ajax_nopriv_nxevtcd_action', array($this, 'handle_nxevtcd_ajax'));
        add_action('wp_ajax_nxevtcd_freemius_check', array($this, 'handle_freemius_check'));
        add_action('wp_ajax_nxevtcd_freemius_activate', array($this, 'handle_freemius_activate'));
        add_action('wp_ajax_nxevtcd_freemius_deactivate', array($this, 'handle_freemius_deactivate'));
        
        // Script filter
        add_filter('script_loader_tag', array($this, 'modify_script_tag'), 10, 3);

        // Plugin action links
        add_filter('plugin_action_links_' . plugin_basename(__FILE__), array($this, 'plugin_action_links'), 99, 1);
        add_filter('plugin_row_meta', array($this, 'plugin_row_meta'), 99, 2);
        
        // Activation redirect for onboarding
        add_action('admin_init', array($this, 'activation_redirect'));
    }
    
    /**
     * Add admin menu page
     */
    public function add_admin_menu() {
        // Custom SVG icon — countdown colon logo
        $icon_svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2731.33 2040.46"><path fill="black" d="M870.34 1020.23c0,-647.46 -364.37,-1020.23 -863.27,-1020.23 -2.37,0 -4.71,0.07 -7.07,0.08l0 454.07c2.35,-0.06 4.7,-0.1 7.07,-0.1 176.58,0 305.51,154.16 305.51,566.17 0,412.02 -128.93,566.17 -305.51,566.17 -2.37,0 -4.72,-0.04 -7.07,-0.1l0 454.07c2.36,0.02 4.7,0.08 7.07,0.08 498.9,0 863.27,-372.78 863.27,-1020.23zm990.65 0c0,647.46 364.37,1020.23 866.08,1020.23 1.43,0 2.84,-0.05 4.26,-0.05l0 -454.07c-1.42,0.02 -2.83,0.06 -4.26,0.06 -179.38,0 -308.31,-154.16 -308.31,-566.17 0,-412.02 128.93,-566.17 308.31,-566.17 1.43,0 2.84,0.04 4.26,0.06l0 -454.07c-1.43,-0 -2.83,-0.05 -4.26,-0.05 -501.71,0 -866.08,372.78 -866.08,1020.23zm-495.32 231.24c-76.61,0 -141.08,24.76 -193.4,74.28 -52.32,49.52 -78.48,114.45 -78.48,194.8 0,78.48 26.16,143.88 78.48,196.2 52.32,52.32 116.78,78.48 193.4,78.48 76.61,0 141.07,-26.16 193.39,-78.48 52.32,-52.32 78.48,-117.72 78.48,-196.2 0,-80.35 -26.16,-145.28 -78.48,-194.8 -52.32,-49.52 -116.78,-74.28 -193.39,-74.28zm-193.4 -931.94c-52.32,49.52 -78.48,114.45 -78.48,194.8 0,78.48 26.16,143.88 78.48,196.2 52.32,52.32 116.78,78.48 193.4,78.48 76.61,0 141.07,-26.16 193.39,-78.48 52.32,-52.32 78.48,-117.72 78.48,-196.2 0,-80.35 -26.16,-145.28 -78.48,-194.8 -52.32,-49.52 -116.78,-74.27 -193.39,-74.27 -76.61,0 -141.08,24.76 -193.4,74.27z"/></svg>';
        $icon_base64 = 'data:image/svg+xml;base64,' . base64_encode($icon_svg);
        
        add_menu_page(
            '',
            'Countdown',
            'manage_options',
            'kindpixels-next-event-countdown',
            array($this, 'render_admin_page'),
            $icon_base64,
            100
        );

    }
    
    /**
     * Register frontend assets for shortcode usage
     */
    public function register_frontend_assets() {
        wp_register_style('nxevtcd-frontend', false, array(), NXEVTCD_VERSION);
        wp_register_script('nxevtcd-frontend', false, array(), NXEVTCD_VERSION, true);
    }
    
    /**
     * Get asset URL (predictable filenames first, fallback to hashed)
     */
    private function get_asset_url($type) {
        $plugin_dir = plugin_dir_path(__FILE__);
        $plugin_url = plugin_dir_url(__FILE__);
        
        $predictable = $plugin_dir . 'dist/assets/index.' . $type;
        if (file_exists($predictable)) {
            return $plugin_url . 'dist/assets/index.' . $type;
        }
        
        $dist_dir = $plugin_dir . 'dist/assets/';
        if (is_dir($dist_dir)) {
            $files = scandir($dist_dir);
            foreach ($files as $file) {
                if ($type === 'js' && preg_match('/index-[a-zA-Z0-9]+\\.js$/', $file)) {
                    return $plugin_url . 'dist/assets/' . $file;
                }
                if ($type === 'css' && preg_match('/index-[a-zA-Z0-9]+\\.css$/', $file)) {
                    return $plugin_url . 'dist/assets/' . $file;
                }
            }
        }
        
        return false;
    }
    
    /**
     * Enqueue scripts and styles for admin page
     */
    public function enqueue_admin_scripts($hook_suffix) {
        if ($hook_suffix !== 'toplevel_page_kindpixels-next-event-countdown') {
            return;
        }
        
        $js_file = $this->get_asset_url('js');
        $css_file = $this->get_asset_url('css');
        
        if (!$js_file || !$css_file) {
            add_action('admin_notices', array($this, 'assets_not_found_notice'));
            return;
        }
        
        $cache_bust = NXEVTCD_VERSION;
        $license_changed_ts = get_transient( 'nxevtcd_license_changed' );
        if ( $license_changed_ts ) {
            $cache_bust = NXEVTCD_VERSION . '.' . intval( $license_changed_ts );
        }
        
        wp_enqueue_script(
            'nxevtcd-admin', 
            $js_file, 
            array( 'updates' ), 
            $cache_bust,
            true
        );
        wp_script_add_data('nxevtcd-admin', 'type', 'module');
        
        wp_enqueue_style(
            'nxevtcd-admin', 
            $css_file, 
            array(), 
            $cache_bust
        );
        
        $upload_dir = wp_upload_dir();
        
        $fs_account_url = '';
        $fs_pricing_url = '';
        $fs_is_pro      = false;
        $fs_status       = 'free';
        $fs_available    = false;
        $fs_licensed_to  = '';
        if ( function_exists('nxevtcd_fs') ) {
            $fs = nxevtcd_fs();
            if ( is_object( $fs ) ) {
                if ( method_exists( $fs, 'get_account_url' ) ) {
                    $fs_account_url = $fs->get_account_url();
                }
                // Always use our direct checkout URL instead of Freemius SDK's generated URL
                $fs_pricing_url = 'https://checkout.freemius.com/plugin/25492/plan/42185/';
                $fs_available = (
                    method_exists( $fs, 'can_use_premium_code' ) ||
                    method_exists( $fs, 'is_premium' ) ||
                    method_exists( $fs, 'is_paying' ) ||
                    method_exists( $fs, 'is_plan' ) ||
                    method_exists( $fs, 'is_trial' )
                );
                if ( method_exists( $fs, 'can_use_premium_code' ) && $fs->can_use_premium_code() ) {
                    $fs_is_pro = true; $fs_status = 'pro';
                } elseif ( method_exists( $fs, 'is_paying' ) && $fs->is_paying() ) {
                    $fs_is_pro = true; $fs_status = 'pro';
                } elseif ( method_exists( $fs, 'is_plan' ) && $fs->is_plan( 'professional', true ) ) {
                    $fs_is_pro = true; $fs_status = 'pro';
                } elseif ( method_exists( $fs, 'is_trial' ) && $fs->is_trial() ) {
                    $fs_is_pro = true; $fs_status = 'trial';
                }
                if ( $fs_is_pro && method_exists( $fs, 'get_user' ) ) {
                    $user = $fs->get_user();
                    if ( is_object( $user ) ) {
                        if ( isset( $user->email ) ) {
                            $fs_licensed_to = $user->email;
                        } elseif ( isset( $user->first ) || isset( $user->last ) ) {
                            $fs_licensed_to = trim( ( isset( $user->first ) ? $user->first : '' ) . ' ' . ( isset( $user->last ) ? $user->last : '' ) );
                        }
                    }
                }
            }
        }
        
        $update_url = '';
        if ( current_user_can( 'update_plugins' ) ) {
            $plugin_file = plugin_basename( __FILE__ );
            $update_plugins = get_site_transient( 'update_plugins' );
            if ( isset( $update_plugins->response[ $plugin_file ] ) ) {
                $update_url = wp_nonce_url(
                    self_admin_url( 'update.php?action=upgrade-plugin&plugin=' . urlencode( $plugin_file ) ),
                    'upgrade-plugin_' . $plugin_file
                );
            }
        }
        
        wp_localize_script('nxevtcd-admin', 'nxevtcdData', array(
            'isAdmin' => current_user_can('manage_options'),
            'nonce' => wp_create_nonce('nxevtcd_nonce'),
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'uploadsUrl' => isset($upload_dir['baseurl']) ? $upload_dir['baseurl'] : '',
            'fsAccountUrl' => $fs_account_url,
            'fsPricingUrl' => $fs_pricing_url,
            'fsIsPro' => $fs_is_pro,
            'fsStatus' => $fs_status,
            'fsAvailable' => $fs_available,
            'licensedTo' => $fs_licensed_to,
            'updateUrl' => $update_url,
            'pluginBasename' => plugin_basename( __FILE__ ),
        ));

        // Admin page inline styles (notice hiding + page chrome)
        $admin_inline_css = '
            body.nxevtcd-admin-page #wpbody-content > .notice,
            body.nxevtcd-admin-page #wpbody-content > .updated,
            body.nxevtcd-admin-page #wpbody-content > div.notice,
            body.nxevtcd-admin-page #wpbody-content > div.updated,
            body.nxevtcd-admin-page .wrap > .notice,
            body.nxevtcd-admin-page .wrap > .updated,
            body.nxevtcd-admin-page .notice,
            body.nxevtcd-admin-page .updated,
            body.nxevtcd-admin-page div[class*="notice"],
            body.nxevtcd-admin-page div[class*="update"] {
                display: none !important;
            }
            body.nxevtcd-admin-page .notice-error,
            body.nxevtcd-admin-page .notice-warning,
            body.nxevtcd-admin-page .update-nag {
                display: block !important;
            }
            .wrap > h1:first-child { display: none !important; }
        ';
        wp_add_inline_style('nxevtcd-admin', $admin_inline_css);

        // Admin page inline script (add body class)
        wp_add_inline_script('nxevtcd-admin', 'document.body.classList.add("nxevtcd-admin-page");', 'before');
    }
    public function assets_not_found_notice() {
        echo '<div class="notice notice-error"><p>KindPixels Next Event Countdown: Plugin assets not found. Please rebuild the plugin.</p></div>';
    }
    
    /**
     * Render the admin page
     */
    public function render_admin_page() {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('You do not have sufficient permissions to access this page.', 'kindpixels-next-event-countdown'));
        }
        
        echo '<div class="wrap nxevtcd-admin-page">';
        echo '<div id="nxevtcd-root" style="margin-top: 0;"></div>';
        echo '</div>';
    }
    
    /**
     * Shortcode to display countdown on frontend
     */
    public function display_countdown_shortcode($atts) {
        $atts = shortcode_atts(array(
            'show_admin' => 'false',
            'name' => ''
        ), $atts, 'nxevtcd_countdown');

        $index_url = plugins_url('dist/index.html', __FILE__);
        $nonce = wp_create_nonce('nxevtcd_nonce');
        $frame_token = function_exists('wp_generate_uuid4') ? wp_generate_uuid4() : uniqid('nxevtcd_', true);
        $admin = ($atts['show_admin'] === 'true' && current_user_can('manage_options')) ? 'true' : 'false';
        $ajax = admin_url('admin-ajax.php');

        $src = add_query_arg(array(
            'nonce' => $nonce,
            'ajax'  => $ajax,
            'admin' => $admin,
            'name'  => sanitize_title($atts['name']),
            'frameToken' => $frame_token,
        ), $index_url);

        // Enqueue frontend styles (CSS added only once, even with multiple shortcodes)
        wp_enqueue_style('nxevtcd-frontend');
        $frontend_css = '
    .nxevtcd-iframe-container{overflow:hidden!important;width:100%;position:relative;}
    .nxevtcd-iframe-container iframe{display:block;width:100%!important;border:0!important;overflow:hidden!important;scrolling:no!important;-webkit-overflow-scrolling:auto!important;-ms-overflow-style:none!important;scrollbar-width:none!important;}
    .nxevtcd-iframe-container iframe::-webkit-scrollbar{display:none!important;width:0!important;height:0!important;background:transparent!important;}
    @media (max-width:768px){
      .nxevtcd-iframe-container{overflow:hidden!important; width:100%!important; max-width:100%!important; box-sizing:border-box!important; position:relative!important; left:0!important; right:0!important; margin-left:0!important; margin-right:0!important; padding-left:0!important; padding-right:0!important; transform:none!important;} 
      .nxevtcd-iframe-container iframe{overflow:hidden!important;scrolling:no!important;width:100%!important;max-width:100%!important;margin:0!important;}
    }';
        wp_add_inline_style('nxevtcd-frontend', $frontend_css);

        // Enqueue frontend script and add per-instance inline JS
        wp_enqueue_script('nxevtcd-frontend');

        $iframe_id = 'nxevtcd-iframe-' . uniqid();

        $inline_js = '(function(){
      var iframe = document.getElementById("' . esc_js($iframe_id) . '");
      var container = document.getElementById("' . esc_js($iframe_id) . '-container");
      if(!iframe || !container) return;

      var token = "' . esc_js($frame_token) . '";

      var originalContainerStyle = container.getAttribute("style") || "";
      var originalIframeStyle = iframe.getAttribute("style") || "";
      var lastScrollY = 0;
      var heightBeforeFullscreen = "";
      var isFullscreen = false;

      var originalParent = null;
      var originalNextSibling = null;
      var placeholder = document.createComment("nxevtcd-fullscreen-placeholder");

      function isMobileDevice(){
        try{
          return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                 (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
        }catch(e){ return false; }
      }

      function hasTransformedAncestor(el){
        if(isMobileDevice()) return false;
        try{
          var cur = el && el.parentElement;
          while(cur && cur !== document.body){
            var st = window.getComputedStyle(cur);
            if(st){
              var t = st.transform || st.webkitTransform;
              if(t && t !== "none") return true;
              if(st.perspective && st.perspective !== "none") return true;
              if(st.filter && st.filter !== "none") return true;
            }
            cur = cur.parentElement;
          }
        }catch(err){}
        return false;
      }

      function moveContainerToBody(){
        try{
          if(container.parentNode === document.body) return;
          originalParent = container.parentNode;
          originalNextSibling = container.nextSibling;
          if(originalParent){
            originalParent.insertBefore(placeholder, container);
          }
          document.body.appendChild(container);
        }catch(err){}
      }

      function restoreContainerFromBody(){
        try{
          if(container.parentNode !== document.body) return;
          if(placeholder && placeholder.parentNode){
            placeholder.parentNode.insertBefore(container, placeholder);
            placeholder.parentNode.removeChild(placeholder);
          } else if(originalParent){
            originalParent.insertBefore(container, originalNextSibling);
          }
        }catch(err){}
      }

      function setFullscreen(on){
        try{
          if(on){
            if(isFullscreen) return;
            isFullscreen = true;

            var shouldMove = hasTransformedAncestor(container);
            container.setAttribute("data-nxevtcd-moved", shouldMove ? "1" : "0");
            if(shouldMove) moveContainerToBody();

            lastScrollY = window.scrollY || window.pageYOffset || 0;
            heightBeforeFullscreen = iframe.style.height || "";

            container.setAttribute("data-nxevtcd-fullscreen", "1");
            container.style.position = "fixed";
            container.style.top = "0";
            container.style.left = "0";
            container.style.right = "0";
            container.style.bottom = "0";
            container.style.width = "100vw";
            container.style.height = "100vh";
            container.style.maxWidth = "100vw";
            container.style.maxHeight = "100vh";
            container.style.zIndex = "2147483647";
            container.style.overflow = "hidden";
            container.style.transform = "none";
            container.style.margin = "0";
            container.style.padding = "0";
            container.style.background = "transparent";

            iframe.style.display = "block";
            iframe.style.width = "100vw";
            iframe.style.height = "100vh";
            iframe.style.maxWidth = "100vw";
            iframe.style.maxHeight = "100vh";
            iframe.style.minHeight = "100vh";
            iframe.style.overflow = "hidden";
            iframe.style.position = "fixed";
            iframe.style.top = "0";
            iframe.style.left = "0";
            iframe.style.zIndex = "2147483647";

            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";
            document.body.style.position = "fixed";
            document.body.style.width = "100%";
            document.body.style.top = "-" + lastScrollY + "px";
          } else {
            if(!isFullscreen) return;
            isFullscreen = false;

            container.removeAttribute("data-nxevtcd-fullscreen");
            container.setAttribute("style", originalContainerStyle);
            iframe.setAttribute("style", originalIframeStyle);
            if(heightBeforeFullscreen) iframe.style.height = heightBeforeFullscreen;
            iframe.style.position = "";
            iframe.style.top = "";
            iframe.style.left = "";
            iframe.style.zIndex = "";

            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
            document.body.style.top = "";

            var wasMoved = container.getAttribute("data-nxevtcd-moved") === "1";
            container.removeAttribute("data-nxevtcd-moved");
            if(wasMoved) restoreContainerFromBody();

            window.scrollTo(0, lastScrollY);
          }
        }catch(err){}
      }

      function onMsg(e){
        try{
          if(!e || !e.data) return;
          var d = e.data;
          if(!d || d.token !== token) return;

          if(d.type === "nxevtcd:height" && typeof d.height === "number"){
            if(isFullscreen) return;
            var minH = 1;
            iframe.style.height = Math.max(d.height, minH) + "px";
          }

          if(d.type === "nxevtcd:lightbox-open") setFullscreen(true);
          if(d.type === "nxevtcd:lightbox-close") setFullscreen(false);
        }catch(err){}
      }

      window.addEventListener("message", onMsg, false);

      setTimeout(function(){
        if(iframe && iframe.contentWindow){
          iframe.contentWindow.postMessage({type:"nxevtcd:height-check", token: token}, "*");
        }
      }, 700);
    })();';
        wp_add_inline_script('nxevtcd-frontend', $inline_js);

        $html  = '<div class="nxevtcd-iframe-container" id="' . esc_attr($iframe_id) . '-container" style="position:relative;width:100%;overflow:hidden;">';
        $html .= '<iframe id="' . esc_attr($iframe_id) . '" src="' . esc_url($src) . '" scrolling="no" loading="lazy" referrerpolicy="no-referrer-when-downgrade" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-downloads" style="height:1px;min-height:1px;overflow:hidden;"></iframe>';
        $html .= '</div>';

        return $html;
    }

    /**
     * Run upgrade routines on plugin updates.
     */
    private function maybe_upgrade() {
        $stored_version = get_option('nxevtcd_version', '');
        if (!empty($stored_version) && $stored_version === NXEVTCD_VERSION) {
            return;
        }

        // Migrate legacy "gallery" option keys to "counter" keys
        $old_galleries = get_option('nxevtcd_galleries');
        if ($old_galleries !== false && get_option('nxevtcd_counters') === false) {
            update_option('nxevtcd_counters', $old_galleries);
            delete_option('nxevtcd_galleries');
        }
        $old_id = get_option('nxevtcd_current_gallery_id');
        if ($old_id !== false && get_option('nxevtcd_current_counter_id') === false) {
            update_option('nxevtcd_current_counter_id', $old_id);
            delete_option('nxevtcd_current_gallery_id');
        }

        update_option('nxevtcd_version', NXEVTCD_VERSION);
    }
    
    /**
     * Plugin activation
     */
    public static function activate() {
        
        // IMPORTANT: Only store the version number. Do NOT delete or reset
        // nxevtcd_countdown_config_*, nxevtcd_settings, or nxevtcd_galleries
        // options here — they must survive plugin updates.
        update_option('nxevtcd_version', NXEVTCD_VERSION);
        
        // Set activation redirect (only on fresh install, not on update)
        if (!get_option('nxevtcd_counters') && !get_option('nxevtcd_galleries')) {
            set_transient('nxevtcd_activation_redirect', true, 30);
        }
    }
    
    /**
     * Plugin deactivation
     */
    public static function deactivate() {
        // Only remove transient metadata. Do NOT delete saved events,
        // settings, or countdown configs — user may reactivate the plugin.
        delete_option('nxevtcd_version');
    }
    
    /**
     * Redirect to plugin page after activation
     */
    public function activation_redirect() {
        if (!get_transient('nxevtcd_activation_redirect')) {
            return;
        }
        
        delete_transient('nxevtcd_activation_redirect');
        
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        if (isset($_GET['activate-multi'])) {
            return;
        }
        
        if (is_network_admin()) {
            return;
        }
        
        wp_safe_redirect(admin_url('admin.php?page=kindpixels-next-event-countdown'));
        exit;
    }
    
    /**
     * Ensure our scripts load as ES modules
     */
    public function modify_script_tag($tag, $handle, $src) {
        if (in_array($handle, array('nxevtcd-admin', 'nxevtcd-frontend'), true)) {
            // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript
            $tag = '<script type="module" src="' . esc_url($src) . '" id="' . esc_attr($handle) . '-js"></script>';
        }
        return $tag;
    }
    
    /**
     * Add links on the plugins page
     */
    public function plugin_action_links($links) {
        foreach ($links as $key => $link) {
            $plain = strtolower(wp_strip_all_tags($link));
            if (strpos($plain, 'opt out') !== false || strpos($plain, 'opt-out') !== false) {
                unset($links[$key]); continue;
            }
            if (strpos($plain, 'opt in') !== false || strpos($plain, 'opt-in') !== false || strpos($plain, 'optin') !== false) {
                unset($links[$key]); continue;
            }
            if (strpos($plain, 'upgrade') !== false) {
                unset($links[$key]); continue;
            }
            if (strpos($plain, 'visit plugin site') !== false) {
                unset($links[$key]); continue;
            }
        }
        
        $dashboard_link = '<a href="' . esc_url(admin_url('admin.php?page=kindpixels-next-event-countdown')) . '">Dashboard</a>';
        array_unshift($links, $dashboard_link);
        
        $is_pro = false;
        if (function_exists('nxevtcd_fs')) {
            $fs = nxevtcd_fs();
            if (is_object($fs) && method_exists($fs, 'is_paying') && $fs->is_paying()) {
                $is_pro = true;
            }
        }
        if (!$is_pro) {
            $upgrade_link = '<a href="https://checkout.freemius.com/plugin/25492/plan/42185/" target="_blank" style="font-weight:600;color:#d97706;">Upgrade to Pro!</a>';
            $links[] = $upgrade_link;
        }
        
        return $links;
    }
    
    /**
     * Filter row meta links on the plugins list
     */
    public function plugin_row_meta($links, $file) {
        if ($file === plugin_basename(__FILE__)) {
            foreach ($links as $key => $link) {
                $plain = strtolower(wp_strip_all_tags($link));
                if (strpos($plain, 'opt out') !== false || strpos($plain, 'opt-out') !== false) {
                    unset($links[$key]); continue;
                }
                if (strpos($plain, 'upgrade') !== false) {
                    unset($links[$key]); continue;
                }
            }
        }
        return $links;
    }
    
    /**
     * Handle AJAX requests
     */
    public function handle_nxevtcd_ajax() {
        if (!isset($_POST['nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['nonce'])), 'nxevtcd_nonce')) {
            wp_die('Security check failed');
        }
        
        $action_type = isset($_POST['action_type']) ? sanitize_text_field(wp_unslash($_POST['action_type'])) : '';
        
        switch ($action_type) {
            case 'save_settings':
                $this->handle_save_settings();
                break;
            case 'get_settings':
                $this->handle_get_settings();
                break;
            case 'save_countdown_config':
                $this->handle_save_countdown_config();
                break;
            case 'get_countdown_config':
                $this->handle_get_countdown_config();
                break;
            case 'save_counters':
            case 'save_galleries': // legacy compat
                $this->handle_save_counters();
                break;
            case 'get_counters':
            case 'get_galleries': // legacy compat
                $this->handle_get_counters();
                break;
            case 'reset_counters':
            case 'reset_galleries': // legacy compat
                $this->handle_reset_counters();
                break;
            default:
                wp_send_json_error('Invalid action');
        }
    }
    
    /**
     * Handle Freemius license check
     */
    public function handle_freemius_check() {
        if (!isset($_POST['nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['nonce'])), 'nxevtcd_nonce')) {
            wp_die('Security check failed');
        }

        $license_info = array(
            'isValid' => true,
            'isPro' => false,
            'status' => 'free'
        );

        if ( function_exists( 'nxevtcd_fs' ) ) {
            $fs = nxevtcd_fs();
            if ( is_object( $fs ) ) {
                if ( method_exists( $fs, 'can_use_premium_code' ) && $fs->can_use_premium_code() ) {
                    $license_info['isPro'] = true;
                    $license_info['status'] = 'pro';
                } elseif ( method_exists( $fs, 'is_paying' ) && $fs->is_paying() ) {
                    $license_info['isPro'] = true;
                    $license_info['status'] = 'pro';
                } elseif ( method_exists( $fs, 'is_plan' ) && $fs->is_plan( 'professional', true ) ) {
                    $license_info['isPro'] = true;
                    $license_info['status'] = 'pro';
                } elseif ( method_exists( $fs, 'is_trial' ) && $fs->is_trial() ) {
                    $license_info['status'] = 'trial';
                    $license_info['isPro'] = true;
                }
            }
        }

        wp_send_json_success( array( 'license' => $license_info ) );
    }

    /**
     * Handle Freemius license activation
     */
    public function handle_freemius_activate() {
        if (!isset($_POST['nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['nonce'])), 'nxevtcd_nonce')) {
            wp_die('Security check failed');
        }

        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => 'Insufficient permissions'));
        }
        
        $license_key = isset($_POST['license_key']) ? sanitize_text_field(wp_unslash($_POST['license_key'])) : '';
        
        if (empty($license_key)) {
            wp_send_json_error(array('message' => 'License key is required'));
            return;
        }

        if ( function_exists( 'nxevtcd_fs' ) ) {
            $fs = nxevtcd_fs();
            
            if ( ! is_object( $fs ) ) {
                wp_send_json_error( array( 'message' => 'Licensing system unavailable (Freemius not initialized).' ) );
            }

            try {
                $result  = null;

                if ( method_exists( $fs, 'activate_migrated_license' ) ) {
                    $result = $fs->activate_migrated_license( $license_key );
                } elseif ( method_exists( $fs, 'activate_license' ) ) {
                    $result = $fs->activate_license( $license_key );
                } elseif ( method_exists( $fs, 'activate_premium' ) ) {
                    $result = $fs->activate_premium( $license_key );
                }

                $pro_now = false;
                if ( method_exists( $fs, 'can_use_premium_code' ) && $fs->can_use_premium_code() ) {
                    $pro_now = true;
                } elseif ( method_exists( $fs, 'is_paying' ) && $fs->is_paying() ) {
                    $pro_now = true;
                } elseif ( method_exists( $fs, 'is_plan' ) && $fs->is_plan( 'professional', true ) ) {
                    $pro_now = true;
                } elseif ( method_exists( $fs, 'is_trial' ) && $fs->is_trial() ) {
                    $pro_now = true;
                }

                if ( $pro_now ) {
                    delete_option( 'nxevtcd_license_data' );
                    update_option( 'nxevtcd_license_key', $license_key );

                    $ts = time();
                    set_transient( 'nxevtcd_license_changed', $ts, 300 );
                    $redirect_url = add_query_arg( array(
                        'page'             => 'kindpixels-next-event-countdown',
                        'license_activated' => '1',
                        'license_updated'   => $ts,
                    ), admin_url( 'admin.php' ) );

                    wp_send_json_success( array( 
                        'message' => 'License activated successfully',
                        'pro' => true,
                        'redirect' => $redirect_url,
                    ) );
                } else {
                    $error_msg = is_wp_error( $result ) ? $result->get_error_message() : 'Activation reported success but Pro is not enabled by Freemius. Please ensure the key matches this plugin/product and try again.';
                    wp_send_json_error( array( 'message' => $error_msg, 'pro' => false ) );
                }
            } catch ( Exception $e ) {
                wp_send_json_error( array( 'message' => 'Activation failed: ' . $e->getMessage() ) );
            }
        } else {
            wp_send_json_error( array( 'message' => 'Licensing system not available' ) );
        }
    }

    /**
     * Handle Freemius license deactivation
     */
    public function handle_freemius_deactivate() {
        if (!isset($_POST['nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['nonce'])), 'nxevtcd_nonce')) {
            wp_die('Security check failed');
        }

        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => 'Insufficient permissions'));
        }

        delete_option('nxevtcd_license_key');
        delete_option('nxevtcd_license_data');

        if ( function_exists( 'nxevtcd_fs' ) ) {
            $fs = nxevtcd_fs();
            
            if ( is_object( $fs ) ) {
                try {
                    if ( method_exists( $fs, 'delete_account_event' ) ) {
                        $fs->delete_account_event();
                    }
                    if ( method_exists( $fs, 'deactivate_license' ) ) {
                        $fs->deactivate_license();
                    }
                    if ( method_exists( $fs, 'clear_all_data' ) ) {
                        $fs->clear_all_data();
                    }
                    if ( method_exists( $fs, 'skip_connection' ) ) {
                        $fs->skip_connection();
                    }
                } catch ( Exception $e ) {
                    unset( $e );
                }
            }
        }

        wp_send_json_success( array( 'message' => 'License deactivated successfully' ) );
    }
    
    private function handle_save_settings() {
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Insufficient permissions');
        }
        if (!isset($_POST['nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['nonce'])), 'nxevtcd_nonce')) {
            wp_die('Security check failed');
        }

        $settings_json = isset($_POST['settings']) ? sanitize_text_field(wp_unslash($_POST['settings'])) : '';
        $settings = json_decode($settings_json, true);

        if (json_last_error() === JSON_ERROR_NONE && is_array($settings)) {
            update_option('nxevtcd_settings', $settings);
            wp_send_json_success('Settings saved');
        } else {
            wp_send_json_error('Invalid settings data');
        }
    }

    private function handle_get_settings() {
        $defaults = array();
        $settings = get_option('nxevtcd_settings', array());
        $settings = array_merge($defaults, is_array($settings) ? $settings : array());
        wp_send_json_success(array('settings' => $settings));
    }

    private function handle_save_countdown_config() {
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Insufficient permissions');
        }
        if (!isset($_POST['nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['nonce'])), 'nxevtcd_nonce')) {
            wp_die('Security check failed');
        }

        $config_json = isset($_POST['countdown_config']) ? wp_unslash($_POST['countdown_config']) : '';
        $counter_id = isset($_POST['gallery_id']) ? sanitize_text_field(wp_unslash($_POST['gallery_id'])) : 'default';

        $config = json_decode($config_json, true);

        if (json_last_error() === JSON_ERROR_NONE && is_array($config)) {
            $sanitized = $this->sanitize_countdown_config($config);
            update_option('nxevtcd_countdown_config_' . $counter_id, $sanitized);
            wp_send_json_success('Countdown config saved');
        } else {
            wp_send_json_error('Invalid countdown config data');
        }
    }

    private function handle_get_countdown_config() {
        if (!isset($_POST['nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['nonce'])), 'nxevtcd_nonce')) {
            wp_die('Security check failed');
        }
        $gallery_id = isset($_POST['gallery_id']) ? sanitize_text_field(wp_unslash($_POST['gallery_id'])) : 'default';
        $config = get_option('nxevtcd_countdown_config_' . $gallery_id, null);
        if ($config === null) {
            // Try the default key as fallback
            $config = get_option('nxevtcd_countdown_config_default', null);
        }
        wp_send_json_success(array('countdown_config' => $config));
    }

    /**
     * Check if the current installation is a Pro license (Freemius).
     */
    private function is_pro_license() {
        if (function_exists('nxevtcd_fs')) {
            $fs = nxevtcd_fs();
            if (is_object($fs)) {
                if (method_exists($fs, 'can_use_premium_code') && $fs->can_use_premium_code()) {
                    return true;
                }
                if (method_exists($fs, 'is_paying') && $fs->is_paying()) {
                    return true;
                }
                if (method_exists($fs, 'is_plan') && $fs->is_plan('professional', true)) {
                    return true;
                }
                if (method_exists($fs, 'is_trial') && $fs->is_trial()) {
                    return true;
                }
            }
        }
        // Also check if the plugin header declares Pro (build-time flag)
        $plugin_data = get_file_data(__FILE__, array('Name' => 'Plugin Name'));
        if (!empty($plugin_data['Name']) && strpos($plugin_data['Name'], 'Pro') !== false) {
            return true;
        }
        return false;
    }

    /**
     * Handle saving galleries list.
     * Free version: limited to 1 gallery/counter.
     */
    private function handle_save_galleries() {
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Insufficient permissions');
        }

        $galleries_json = isset($_POST['galleries']) ? wp_unslash($_POST['galleries']) : '[]';
        $galleries = json_decode($galleries_json, true);

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($galleries)) {
            wp_send_json_error('Invalid galleries data');
        }

        // Server-side enforcement: free version limited to 1 counter
        if (!$this->is_pro_license() && count($galleries) > 1) {
            $galleries = array(reset($galleries)); // Keep only the first gallery
        }

        // Sanitize each gallery entry
        $sanitized = array();
        foreach ($galleries as $gallery) {
            if (!is_array($gallery)) continue;
            $sanitized[] = array(
                'id'        => isset($gallery['id']) ? sanitize_text_field($gallery['id']) : '',
                'name'      => isset($gallery['name']) ? sanitize_text_field($gallery['name']) : '',
                'items'     => isset($gallery['items']) && is_array($gallery['items']) ? $gallery['items'] : array(),
                'createdAt' => isset($gallery['createdAt']) ? sanitize_text_field($gallery['createdAt']) : '',
            );
        }

        $current_gallery_id = isset($_POST['current_gallery_id']) ? sanitize_text_field(wp_unslash($_POST['current_gallery_id'])) : '';

        update_option('nxevtcd_galleries', $sanitized);
        if ($current_gallery_id) {
            update_option('nxevtcd_current_gallery_id', $current_gallery_id);
        }

        wp_send_json_success('Galleries saved');
    }

    /**
     * Handle fetching galleries list.
     */
    private function handle_get_galleries() {
        $galleries = get_option('nxevtcd_galleries', array());
        if (!is_array($galleries)) {
            $galleries = array();
        }
        $current_gallery_id = get_option('nxevtcd_current_gallery_id', '');
        wp_send_json_success(array(
            'galleries'          => $galleries,
            'current_gallery_id' => $current_gallery_id,
        ));
    }

    /**
     * Handle resetting galleries.
     */
    private function handle_reset_galleries() {
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Insufficient permissions');
        }
        delete_option('nxevtcd_galleries');
        delete_option('nxevtcd_current_gallery_id');
        wp_send_json_success('Galleries reset');
    }

    /**
     * Recursively sanitize countdown config data per-field.
     * Strings are sanitized, booleans/integers/floats are cast, arrays are recursed.
     */
    private function sanitize_countdown_config($data) {
        if (!is_array($data)) {
            if (is_bool($data)) {
                return $data;
            }
            if (is_int($data)) {
                return intval($data);
            }
            if (is_float($data)) {
                return floatval($data);
            }
            return sanitize_text_field($data);
        }

        $sanitized = array();
        foreach ($data as $key => $value) {
            $safe_key = sanitize_text_field($key);
            if (is_array($value)) {
                $sanitized[$safe_key] = $this->sanitize_countdown_config($value);
            } elseif (is_bool($value)) {
                $sanitized[$safe_key] = (bool) $value;
            } elseif (is_int($value)) {
                $sanitized[$safe_key] = intval($value);
            } elseif (is_float($value)) {
                $sanitized[$safe_key] = floatval($value);
            } else {
                $sanitized[$safe_key] = sanitize_text_field($value);
            }
        }
        return $sanitized;
    }
}

// Initialize the plugin only if WordPress is properly loaded
if (defined('ABSPATH')) {
    register_activation_hook(__FILE__, array('NxEvtCd_Plugin', 'activate'));
    register_deactivation_hook(__FILE__, array('NxEvtCd_Plugin', 'deactivate'));
    new NxEvtCd_Plugin();
}
