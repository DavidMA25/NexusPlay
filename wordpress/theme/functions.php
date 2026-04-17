<?php
/**
 * Funciones y configuración del tema NexusPlay.
 *
 * @package NexusPlay
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// ============================================================================
// SETUP DEL TEMA
// ============================================================================

function nexusplay_setup(): void {
    // Traducciones.
    load_theme_textdomain( 'nexusplay', get_template_directory() . '/languages' );

    // Soporte para título automático en <head>.
    add_theme_support( 'title-tag' );

    // Soporte para imágenes destacadas.
    add_theme_support( 'post-thumbnails' );
    set_post_thumbnail_size( 800, 400, true );
    add_image_size( 'nexusplay-card', 600, 300, true );
    add_image_size( 'nexusplay-hero', 1280, 500, true );

    // HTML5 para formularios, galerías, etc.
    add_theme_support( 'html5', [
        'search-form', 'comment-form', 'comment-list',
        'gallery', 'caption', 'style', 'script',
    ] );

    // Soporte para logo personalizado.
    add_theme_support( 'custom-logo', [
        'height'      => 48,
        'width'       => 180,
        'flex-width'  => true,
        'flex-height' => true,
    ] );

    // Feed automático para posts y comentarios.
    add_theme_support( 'automatic-feed-links' );

    // Soporte para WordPress block styles (gutenberg).
    add_theme_support( 'wp-block-styles' );

    // Menús de navegación.
    register_nav_menus( [
        'primary' => __( 'Menú Principal',  'nexusplay' ),
        'footer'  => __( 'Menú del Footer', 'nexusplay' ),
    ] );
}
add_action( 'after_setup_theme', 'nexusplay_setup' );

// ============================================================================
// ANCHURA DEL CONTENIDO
// ============================================================================

function nexusplay_content_width(): void {
    $GLOBALS['content_width'] = 800;
}
add_action( 'after_setup_theme', 'nexusplay_content_width', 0 );

// ============================================================================
// REGISTRAR WIDGETS (SIDEBARS)
// ============================================================================

function nexusplay_widgets_init(): void {
    // Sidebar del blog.
    register_sidebar( [
        'name'          => __( 'Sidebar del Blog', 'nexusplay' ),
        'id'            => 'blog-sidebar',
        'description'   => __( 'Widgets que aparecen en el lateral del blog y posts.', 'nexusplay' ),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ] );

    // Sidebar de Tryouts.
    register_sidebar( [
        'name'          => __( 'Sidebar de Tryouts', 'nexusplay' ),
        'id'            => 'tryouts-sidebar',
        'description'   => __( 'Widgets para las páginas de Tryouts.', 'nexusplay' ),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ] );

    // Footer columna 1.
    register_sidebar( [
        'name'          => __( 'Footer — Columna 1', 'nexusplay' ),
        'id'            => 'footer-1',
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ] );

    // Footer columna 2.
    register_sidebar( [
        'name'          => __( 'Footer — Columna 2', 'nexusplay' ),
        'id'            => 'footer-2',
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ] );
}
add_action( 'widgets_init', 'nexusplay_widgets_init' );

// ============================================================================
// ENQUEUE DE ESTILOS Y SCRIPTS
// ============================================================================

function nexusplay_scripts(): void {
    // Hoja de estilos principal del tema.
    wp_enqueue_style(
        'nexusplay-style',
        get_stylesheet_uri(),
        [],
        wp_get_theme()->get( 'Version' )
    );

    // Fuente Inter desde Google Fonts.
    wp_enqueue_style(
        'nexusplay-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
        [],
        null
    );

    // Script del menú hamburger (móvil).
    wp_enqueue_script(
        'nexusplay-navigation',
        get_template_directory_uri() . '/assets/js/navigation.js',
        [],
        wp_get_theme()->get( 'Version' ),
        true // En el footer.
    );

    // Comentarios threaded.
    if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
        wp_enqueue_script( 'comment-reply' );
    }
}
add_action( 'wp_enqueue_scripts', 'nexusplay_scripts' );

// ============================================================================
// PERSONALIZAR EXCERPT
// ============================================================================

function nexusplay_excerpt_length(): int {
    return 25;
}
add_filter( 'excerpt_length', 'nexusplay_excerpt_length' );

function nexusplay_excerpt_more( string $more ): string {
    return '…';
}
add_filter( 'excerpt_more', 'nexusplay_excerpt_more' );

// ============================================================================
// HELPERS DE PLANTILLA
// ============================================================================

/**
 * Muestra la fecha del post en formato legible.
 */
function nexusplay_posted_on(): void {
    $time = sprintf(
        '<time class="entry-date" datetime="%1$s">%2$s</time>',
        esc_attr( get_the_date( DATE_W3C ) ),
        esc_html( get_the_date() )
    );
    echo $time;
}

/**
 * Muestra el autor del post con avatar.
 */
function nexusplay_posted_by(): void {
    printf(
        '<span class="post-card-author">%s <a href="%s">%s</a></span>',
        get_avatar( get_the_author_meta( 'ID' ), 28 ),
        esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ),
        esc_html( get_the_author() )
    );
}

/**
 * Devuelve las categorías del post como badges.
 */
function nexusplay_categories(): string {
    $cats = get_the_category();
    if ( empty( $cats ) ) {
        return '';
    }
    $out = '';
    foreach ( $cats as $cat ) {
        $out .= sprintf(
            '<a href="%s" class="post-card-category">%s</a>',
            esc_url( get_category_link( $cat->term_id ) ),
            esc_html( $cat->name )
        );
    }
    return $out;
}

/**
 * Devuelve los meta del tryout de forma limpia.
 *
 * @param int $post_id
 * @return array
 */
function nexusplay_get_tryout_meta( int $post_id ): array {
    return [
        'team_id'          => get_post_meta( $post_id, '_nexusplay_team_id',           true ),
        'laravel_id'       => get_post_meta( $post_id, '_nexusplay_laravel_tryout_id', true ),
        'event_date'       => get_post_meta( $post_id, '_nexusplay_event_date',         true ),
        'location_type'    => get_post_meta( $post_id, '_nexusplay_location_type',      true ),
        'location_details' => get_post_meta( $post_id, '_nexusplay_location_details',   true ),
        'max_participants' => get_post_meta( $post_id, '_nexusplay_max_participants',    true ),
        'prize_pool'       => get_post_meta( $post_id, '_nexusplay_prize_pool',         true ),
        'status'           => get_post_meta( $post_id, '_nexusplay_status',             true ),
    ];
}

// ============================================================================
// AÑADIR CAMPOS CPT TRYOUT A LA API REST NATIVA (si el plugin está activo)
// ============================================================================

/**
 * Expone los campos meta del tryout en el endpoint REST nativo /wp/v2/tryouts.
 * Este hook complementa lo que hace el plugin; si el plugin no está activo,
 * el tema lo registra igualmente para no romper nada.
 */
function nexusplay_theme_register_tryout_rest_fields(): void {
    if ( ! post_type_exists( 'tryout' ) ) {
        return;
    }

    $fields = [
        'event_date'       => '_nexusplay_event_date',
        'location_type'    => '_nexusplay_location_type',
        'location_details' => '_nexusplay_location_details',
        'max_participants' => '_nexusplay_max_participants',
        'prize_pool'       => '_nexusplay_prize_pool',
        'tryout_status'    => '_nexusplay_status',
        'laravel_tryout_id'=> '_nexusplay_laravel_tryout_id',
    ];

    foreach ( $fields as $field_name => $meta_key ) {
        register_rest_field( 'tryout', $field_name, [
            'get_callback' => fn( $post ) => get_post_meta( $post['id'], $meta_key, true ),
            'schema'       => null,
        ] );
    }
}
add_action( 'rest_api_init', 'nexusplay_theme_register_tryout_rest_fields' );
