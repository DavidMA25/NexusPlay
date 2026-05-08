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
        'primary' => __( 'Primary Menu',  'nexusplay' ),
        'footer'  => __( 'Footer Menu', 'nexusplay' ),
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
        'name'          => __( 'Blog Sidebar', 'nexusplay' ),
        'id'            => 'blog-sidebar',
        'description'   => __( 'Widgets displayed in the blog and post sidebar.', 'nexusplay' ),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ] );

    // Sidebar de Tryouts.
    register_sidebar( [
        'name'          => __( 'Tryouts Sidebar', 'nexusplay' ),
        'id'            => 'tryouts-sidebar',
        'description'   => __( 'Widgets for Tryout pages.', 'nexusplay' ),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ] );

    // Footer columna 1.
    register_sidebar( [
        'name'          => __( 'Footer — Column 1', 'nexusplay' ),
        'id'            => 'footer-1',
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ] );

    // Footer columna 2.
    register_sidebar( [
        'name'          => __( 'Footer — Column 2', 'nexusplay' ),
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


// ============================================================================
// TRYOUT ARCHIVE STATUS FILTER
// Connects ?status= GET param to the WP_Query via pre_get_posts.
// ============================================================================

function nexusplay_tryout_status_filter( WP_Query $query ): void {
    if ( is_admin() || ! $query->is_main_query() ) {
        return;
    }
    if ( ! is_post_type_archive( 'tryout' ) && ! is_tax( 'tryout_game' ) ) {
        return;
    }

    $allowed = [ 'scheduled', 'ongoing', 'finished', 'cancelled' ];
    $status  = isset( $_GET['status'] ) ? sanitize_text_field( $_GET['status'] ) : '';

    if ( $status && in_array( $status, $allowed, true ) ) {
        $query->set( 'meta_query', [
            [
                'key'     => '_nexusplay_status',
                'value'   => $status,
                'compare' => '=',
            ],
        ] );
    }
}
add_action( 'pre_get_posts', 'nexusplay_tryout_status_filter' );

// ============================================================================
// CUSTOM LOGIN PAGE — following PDF guide "Personalizando el Login"
// Styling matches the NexusPlay dark theme (--color-bg, --color-red, Inter font)
// ============================================================================

/**
 * 1. Login page styles — uses login_head to inject a <style> + Google Fonts <link>
 *    This avoids the broken wp_add_inline_style('login') pattern which requires
 *    the handle to be pre-registered, and also allows <link> tags for fonts.
 */
function nexusplay_login_head(): void {
    $font_url = esc_url( 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' );
    ?>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="<?php echo $font_url; ?>" rel="stylesheet">
    <style>
        /* ── Background & body ─────────────────────────────────── */
        body.login {
            background-color: #0a0a0a !important;
            background-image: radial-gradient(circle at 50% 0%, rgba(255,51,51,0.08) 0%, rgba(10,10,10,0) 60%) !important;
            font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
        }

        /* ── Center the login box ──────────────────────────────── */
        body.login div#login {
            padding: 5vh 0 0;
            width: 360px;
            max-width: 94vw;
        }

        /* ── Logo: hide WP image, show NexusPlay text ─────────── */
        body.login div#login h1 a {
            background-image: none !important;
            background-color: transparent !important;
            width: auto !important;
            height: auto !important;
            text-indent: 0 !important;
            display: block;
            text-align: center;
            font-family: 'Inter', sans-serif;
            font-size: 0 !important;
            font-weight: 800;
            letter-spacing: -0.03em;
            text-decoration: none;
            padding: 0 0 1.5rem;
            overflow: visible;
        }
        /* Hide any <img> inside the logo link */
        body.login div#login h1 a img { display: none !important; }
        /* Inject text via pseudo-elements */
        body.login div#login h1 a::before {
            content: 'Nexus';
            color: #ffffff;
            font-size: 2rem;
        }
        body.login div#login h1 a::after {
            content: 'Play';
            color: #FF3333;
            font-size: 2rem;
        }

        /* ── Form card ─────────────────────────────────────────── */
        body.login div#login form#loginform {
            background: #121212 !important;
            border: 1px solid #2a2a2a !important;
            border-radius: 0.75rem !important;
            padding: 2rem !important;
            box-shadow: 0 0 40px rgba(255,51,51,0.06) !important;
        }

        /* ── Labels ────────────────────────────────────────────── */
        body.login div#login form#loginform p label {
            color: #9ca3af;
            font-size: 0.8rem;
            font-weight: 500;
            letter-spacing: 0.04em;
            text-transform: uppercase;
        }

        /* ── Inputs ────────────────────────────────────────────── */
        body.login div#login form#loginform input[type="text"],
        body.login div#login form#loginform input[type="password"] {
            background: #0a0a0a !important;
            border: 1px solid #2a2a2a !important;
            border-radius: 0.5rem !important;
            color: #ffffff !important;
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            padding: 0.65rem 0.875rem !important;
            box-shadow: none !important;
            transition: border-color 0.2s;
            width: 100% !important;
            box-sizing: border-box;
        }
        body.login div#login form#loginform input[type="text"]::placeholder,
        body.login div#login form#loginform input[type="password"]::placeholder {
            color: #4b5563 !important;
            opacity: 1;
        }
        body.login div#login form#loginform input[type="text"]:focus,
        body.login div#login form#loginform input[type="password"]:focus {
            border-color: #FF3333 !important;
            box-shadow: 0 0 0 2px rgba(255,51,51,0.15) !important;
            outline: none;
        }

        /* ── Remember me ───────────────────────────────────────── */
        body.login div#login form#loginform p.forgetmenot label {
            color: #9ca3af;
            font-size: 0.8rem;
            text-transform: none;
            letter-spacing: 0;
        }
        body.login div#login form#loginform input#rememberme {
            accent-color: #FF3333;
        }

        /* ── Submit button ─────────────────────────────────────── */
        body.login div#login form#loginform p.submit input#wp-submit {
            background: #FF3333 !important;
            border: none !important;
            border-radius: 0.5rem !important;
            box-shadow: 0 0 16px rgba(255,51,51,0.25) !important;
            color: #ffffff !important;
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            font-weight: 600;
            padding: 0.65rem 2rem !important;
            text-shadow: none !important;
            transition: background 0.2s, box-shadow 0.2s;
            width: 100%;
            cursor: pointer;
        }
        body.login div#login form#loginform p.submit input#wp-submit:hover {
            background: #FF4D4D !important;
            box-shadow: 0 0 20px rgba(255,51,51,0.4) !important;
        }

        /* ── Nav links ─────────────────────────────────────────── */
        body.login div#login p#nav,
        body.login div#login p#backtoblog {
            text-align: center;
            padding: 0.25rem 0;
        }
        body.login div#login p#nav a,
        body.login div#login p#backtoblog a {
            color: #6b7280 !important;
            font-size: 0.8rem;
            text-decoration: none;
            transition: color 0.2s;
        }
        body.login div#login p#nav a:hover,
        body.login div#login p#backtoblog a:hover { color: #FF3333 !important; }

        /* ── Error & message ───────────────────────────────────── */
        body.login div#login div#login_error {
            background: rgba(255,51,51,0.08) !important;
            border-left: 3px solid #FF3333 !important;
            border-radius: 0.375rem;
            color: #fca5a5 !important;
            font-size: 0.85rem;
            padding: 0.75rem 1rem;
        }
        body.login div#login p.message {
            background: #121212 !important;
            border: 1px solid #2a2a2a !important;
            border-radius: 0.375rem;
            color: #9ca3af;
            font-size: 0.85rem;
            padding: 0.75rem 1rem;
        }
    </style>
    <?php
}
add_action( 'login_head', 'nexusplay_login_head' );

/**
 * 2. Replace the logo URL and title.
 *    (login_headerurl + login_headertext)
 */
function nexusplay_login_logo_url(): string {
    return home_url();
}
add_filter( 'login_headerurl', 'nexusplay_login_logo_url' );

function nexusplay_login_logo_text(): string {
    return get_bloginfo( 'name' ) . ' — ' . get_bloginfo( 'description' );
}
add_filter( 'login_headertext', 'nexusplay_login_logo_text' );

/**
 * 3. Pre-check "Remember Me" by default.
 *    (PDF §5 — login_footer + init)
 */
function nexusplay_login_check_remember_me(): void {
    add_filter( 'login_footer', 'nexusplay_rememberme_checked' );
}
add_action( 'init', 'nexusplay_login_check_remember_me' );

function nexusplay_rememberme_checked(): void {
    echo "<script>
        (function() {
            var rm = document.getElementById('rememberme');
            if (rm) rm.checked = true;
        })();
    </script>";
}

/**
 * 4. Generic error message — don't reveal whether username or password failed.
 *    (PDF §6 — login_errors)
 */
function nexusplay_login_error_message(): string {
    return __( 'Incorrect credentials. Please try again.', 'nexusplay' );
}
add_filter( 'login_errors', 'nexusplay_login_error_message' );

/**
 * 5. Redirect after login:
 *    Admins → WP dashboard, everyone else → home.
 *    (PDF §7 — login_redirect)
 */
function nexusplay_login_redirect( string $redirect_to, string $request, WP_User|WP_Error $user ): string {
    if ( isset( $user->roles ) && is_array( $user->roles ) ) {
        if ( in_array( 'administrator', $user->roles, true ) ||
             in_array( 'editor', $user->roles, true ) ) {
            return admin_url();
        }
    }
    return $redirect_to ?: home_url();
}
add_filter( 'login_redirect', 'nexusplay_login_redirect', 10, 3 );

// ============================================================================
// FORCE ENGLISH DATES ON FRONTEND
// WP may be installed with es_ES locale which makes date_i18n() output Spanish.
// This filter switches the locale to en_US for all front-end date output while
// keeping the admin panel in whatever language the admin prefers.
// ============================================================================

function nexusplay_switch_locale_to_english( $locale ) {
    if ( ! is_admin() ) {
        return 'en_US';
    }
    return $locale;
}
add_filter( 'locale', 'nexusplay_switch_locale_to_english', 1 );

// ============================================================================
// TRANSLATE WIDGET TITLES STORED IN DB
// When widgets were configured while WP was in es_ES, the titles get saved in
// Spanish and the locale filter alone won't change them. This filter maps the
// common default Spanish strings to their English equivalents at render time.
// ============================================================================

function nexusplay_translate_widget_titles( string $title ): string {
    $map = [
        'Entradas recientes'    => 'Recent Posts',
        'Comentarios recientes' => 'Recent Comments',
        'Archivos'              => 'Archives',
        'Categorías'            => 'Categories',
        'Etiquetas'             => 'Tags',
        'Buscar'                => 'Search',
        'Meta'                  => 'Meta',
        'Páginas'               => 'Pages',
        'Calendario'            => 'Calendar',
        'RSS'                   => 'RSS',
    ];
    return $map[ $title ] ?? $title;
}
add_filter( 'widget_title', 'nexusplay_translate_widget_titles' );

// ============================================================================
// TRYOUT SIDEBAR: swap Categories widget taxonomy → tryout_game on tryout pages
// This runs when widgets ARE configured in the admin (dynamic_sidebar path).
// The sidebar.php fallback handles the case when no widgets are configured.
// ============================================================================

function nexusplay_tryout_widget_categories_args( array $args ): array {
    if ( is_post_type_archive( 'tryout' ) || is_singular( 'tryout' ) ) {
        $args['taxonomy'] = 'tryout_game';
    }
    return $args;
}
add_filter( 'widget_categories_args', 'nexusplay_tryout_widget_categories_args' );
add_filter( 'widget_categories_dropdown_args', 'nexusplay_tryout_widget_categories_args' );

// Rename the widget title from "Categories" → "Games" on tryout pages
function nexusplay_tryout_widget_title( string $title ): string {
    if ( ( $title === 'Categories' || $title === 'Categorías' )
        && ( is_post_type_archive( 'tryout' ) || is_singular( 'tryout' ) ) ) {
        return __( 'Games', 'nexusplay' );
    }
    return $title;
}
add_filter( 'widget_title', 'nexusplay_tryout_widget_title', 20 );
