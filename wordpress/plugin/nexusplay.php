<?php
/**
 * Plugin Name: NexusPlay
 * Plugin URI:  https://github.com/DavidMA25/NexusPlay
 * Description: Manages the Tryouts Custom Post Type and integrates with Laravel tables (shared DB) to display participants.
 * Version:     1.0.0
 * Author:      NexusPlay Team
 * License:     GPL-2.0+
 * Text Domain: nexusplay
 */

// Bloquear acceso directo al archivo.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'NEXUSPLAY_VERSION',     '1.0.0' );
define( 'NEXUSPLAY_PLUGIN_DIR',  plugin_dir_path( __FILE__ ) );
define( 'NEXUSPLAY_PLUGIN_URL',  plugin_dir_url( __FILE__ ) );
define( 'NEXUSPLAY_PLUGIN_FILE', __FILE__ );

require_once NEXUSPLAY_PLUGIN_DIR . 'includes/class-nexusplay.php';

/**
 * Devuelve la instancia única del plugin.
 */
function nexusplay(): NexusPlay {
    return NexusPlay::get_instance();
}

nexusplay();
