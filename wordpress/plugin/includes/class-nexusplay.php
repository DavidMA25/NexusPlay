<?php
/**
 * Clase principal del plugin NexusPlay.
 *
 * @package NexusPlay
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class NexusPlay {

    private static ?NexusPlay $instance = null;
    public NexusPlay_Laravel_DB $laravel_db;

    public static function get_instance(): self {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->load_dependencies();
        $this->register_hooks();
    }

    private function load_dependencies(): void {
        require_once NEXUSPLAY_PLUGIN_DIR . 'includes/class-laravel-db.php';
        require_once NEXUSPLAY_PLUGIN_DIR . 'includes/class-cpt-tryout.php';
        require_once NEXUSPLAY_PLUGIN_DIR . 'includes/class-meta-boxes.php';
        require_once NEXUSPLAY_PLUGIN_DIR . 'includes/class-rest-api.php';
        require_once NEXUSPLAY_PLUGIN_DIR . 'includes/class-shortcodes.php';

        $this->laravel_db = new NexusPlay_Laravel_DB();
    }

    private function register_hooks(): void {
        register_activation_hook( NEXUSPLAY_PLUGIN_FILE,   [ $this, 'activate' ] );
        register_deactivation_hook( NEXUSPLAY_PLUGIN_FILE, [ $this, 'deactivate' ] );

        $cpt = new NexusPlay_CPT_Tryout();
        add_action( 'init', [ $cpt, 'register' ] );

        $meta = new NexusPlay_Meta_Boxes( $this->laravel_db );
        add_action( 'add_meta_boxes',   [ $meta, 'add'  ] );
        add_action( 'save_post_tryout', [ $meta, 'save' ], 10, 2 );

        $rest = new NexusPlay_REST_API( $this->laravel_db );
        add_action( 'rest_api_init', [ $rest, 'register_routes' ] );
        add_action( 'rest_api_init', [ $rest, 'register_tryout_meta_fields' ] );

        $sc = new NexusPlay_Shortcodes( $this->laravel_db );
        $sc->register();

        add_action( 'init', [ $this, 'maybe_flush_rewrite' ] );

        // Cabecera HTTP para bloquear acceso a archivos PHP directamente.
        add_action( 'wp_loaded', [ $this, 'security_headers' ] );
    }

    public function activate(): void {
        ( new NexusPlay_CPT_Tryout() )->register();
        flush_rewrite_rules();
        update_option( 'nexusplay_flush_rewrite', true );
    }

    public function deactivate(): void {
        flush_rewrite_rules();
    }

    public function maybe_flush_rewrite(): void {
        if ( get_option( 'nexusplay_flush_rewrite' ) ) {
            flush_rewrite_rules();
            delete_option( 'nexusplay_flush_rewrite' );
        }
    }

    public function security_headers(): void {
        // Solo añadir cabeceras si no estamos en el admin y no es una petición de API.
        if ( is_admin() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
            return;
        }
        if ( ! headers_sent() ) {
            header( 'X-Content-Type-Options: nosniff' );
            header( 'X-Frame-Options: SAMEORIGIN' );
        }
    }
}
