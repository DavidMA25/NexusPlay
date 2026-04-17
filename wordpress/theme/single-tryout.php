<?php
/**
 * Plantilla para un Tryout individual.
 * Lee los participantes desde la API de Laravel.
 *
 * @package NexusPlay
 */

get_header();

// URL de la API de Laravel — configurable en wp-config.php.
// define( 'NEXUSPLAY_LARAVEL_API', 'http://localhost:8000/api' );
$laravel_api  = defined( 'NEXUSPLAY_LARAVEL_API' )
    ? rtrim( NEXUSPLAY_LARAVEL_API, '/' )
    : 'http://localhost:8000/api';

// Base server URL (without /api) used to resolve relative asset paths like /storage/avatars/…
$laravel_base = preg_replace( '#/api/?$#', '', $laravel_api );

/**
 * Resolves a possibly-relative avatar URL from Laravel storage to an absolute URL.
 * Laravel stores paths as '/storage/avatars/file.jpg'; we prefix the server base.
 */
$resolve_avatar = function( string $url ) use ( $laravel_base ): string {
    if ( ! $url ) return '';
    if ( preg_match( '#^https?://#', $url ) ) return $url;
    return $laravel_base . ( str_starts_with( $url, '/' ) ? '' : '/' ) . $url;
};

?>

<div class="site-content">
    <main class="main-content" role="main" id="main">

        <?php while ( have_posts() ) : the_post();

            $prefix   = '_nexusplay_';
            $status   = get_post_meta( get_the_ID(), $prefix . 'status',            true ) ?: 'scheduled';
            $team_id  = (int) get_post_meta( get_the_ID(), $prefix . 'team_id',     true );
            $ev_date  = get_post_meta( get_the_ID(), $prefix . 'event_date',        true );
            $loc_type = get_post_meta( get_the_ID(), $prefix . 'location_type',     true ) ?: 'online';
            $loc_det  = get_post_meta( get_the_ID(), $prefix . 'location_details',  true );
            $max_part = get_post_meta( get_the_ID(), $prefix . 'max_participants',  true );
            $prize    = get_post_meta( get_the_ID(), $prefix . 'prize_pool',        true );

            $status_labels = [
                'scheduled' => __( 'Scheduled', 'nexusplay' ),
                'ongoing'   => __( 'Live', 'nexusplay' ),
                'finished'  => __( 'Finished', 'nexusplay' ),
                'cancelled' => __( 'Cancelled', 'nexusplay' ),
            ];

            // Leer participantes desde Laravel API (server-side).
            $participants_data = null;
            $api_url = $laravel_api . '/tryouts/' . get_the_ID() . '/participants';
            $response = wp_remote_get( $api_url, [ 'timeout' => 5 ] );

            if ( ! is_wp_error( $response ) && wp_remote_retrieve_response_code( $response ) === 200 ) {
                $participants_data = json_decode( wp_remote_retrieve_body( $response ), true );
            }
        ?>

        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

            <!-- Cabecera del tryout -->
            <div class="tryout-header">

                <span class="tryout-status tryout-status-<?php echo esc_attr( $status ); ?>">
                    <?php echo esc_html( $status_labels[ $status ] ?? ucfirst( $status ) ); ?>
                </span>

                <?php
                $games = get_the_terms( get_the_ID(), 'tryout_game' );
                if ( $games && ! is_wp_error( $games ) ) :
                    foreach ( $games as $game ) :
                ?>
                    <a href="<?php echo esc_url( get_term_link( $game ) ); ?>" class="post-card-category" style="margin-left:0.5rem;">
                        <?php echo esc_html( $game->name ); ?>
                    </a>
                <?php
                    endforeach;
                endif;
                ?>

                <h1 style="font-size:1.75rem; font-weight:800; margin:1rem 0 0.5rem;">
                    <?php the_title(); ?>
                </h1>

                <?php if ( has_post_thumbnail() ) : ?>
                    <div style="border-radius:var(--radius-sm); overflow:hidden; margin-top:1rem;">
                        <?php the_post_thumbnail( 'nexusplay-hero' ); ?>
                    </div>
                <?php endif; ?>

                <!-- Meta grid -->
                <div class="tryout-meta-grid">

                    <?php if ( $ev_date ) : ?>
                    <div class="tryout-meta-item">
                        <span class="label"><?php esc_html_e( 'Date', 'nexusplay' ); ?></span>
                        <span class="value">
                            <?php echo esc_html( date_i18n(
                                get_option( 'date_format' ) . ' — ' . get_option( 'time_format' ),
                                strtotime( $ev_date )
                            ) ); ?>
                        </span>
                    </div>
                    <?php endif; ?>

                    <div class="tryout-meta-item">
                        <span class="label"><?php esc_html_e( 'Format', 'nexusplay' ); ?></span>
                        <span class="value">
                            <?php echo $loc_type === 'lan'
                                ? esc_html__( 'LAN', 'nexusplay' )
                                : esc_html__( 'Online', 'nexusplay' ); ?>
                        </span>
                    </div>

                    <?php if ( $loc_det ) : ?>
                    <div class="tryout-meta-item">
                        <span class="label"><?php esc_html_e( 'Location / Server', 'nexusplay' ); ?></span>
                        <span class="value"><?php echo esc_html( $loc_det ); ?></span>
                    </div>
                    <?php endif; ?>

                    <?php if ( $prize ) : ?>
                    <div class="tryout-meta-item">
                        <span class="label"><?php esc_html_e( 'Prize Pool', 'nexusplay' ); ?></span>
                        <span class="value accent"><?php echo esc_html( number_format( (float) $prize, 2 ) ); ?>€</span>
                    </div>
                    <?php endif; ?>

                    <?php if ( $max_part ) : ?>
                    <div class="tryout-meta-item">
                        <span class="label"><?php esc_html_e( 'Max. Slots', 'nexusplay' ); ?></span>
                        <span class="value"><?php echo esc_html( $max_part ); ?></span>
                    </div>
                    <?php endif; ?>

                    <?php if ( $participants_data ) :
                        $approved_count = (int) $participants_data['approved'];
                        // Only approved participants count against the cap; pending/rejected do not.
                        $available_slots = $max_part ? max( 0, (int) $max_part - $approved_count ) : null;
                    ?>
                    <div class="tryout-meta-item">
                        <span class="label"><?php esc_html_e( 'Approved', 'nexusplay' ); ?></span>
                        <span class="value accent" style="color:var(--color-green);">
                            <?php echo $approved_count; ?>
                            <?php if ( $max_part ) : ?>
                                / <?php echo esc_html( $max_part ); ?>
                            <?php endif; ?>
                        </span>
                    </div>
                    <?php if ( $available_slots !== null ) : ?>
                    <div class="tryout-meta-item">
                        <span class="label"><?php esc_html_e( 'Available Slots', 'nexusplay' ); ?></span>
                        <span class="value <?php echo $available_slots === 0 ? 'accent' : ''; ?>">
                            <?php echo $available_slots > 0 ? $available_slots : esc_html__( 'Full', 'nexusplay' ); ?>
                        </span>
                    </div>
                    <?php endif; ?>
                    <div class="tryout-meta-item">
                        <span class="label"><?php esc_html_e( 'Pending', 'nexusplay' ); ?></span>
                        <span class="value"><?php echo (int) $participants_data['registered']; ?></span>
                    </div>
                    <?php endif; ?>

                </div><!-- .tryout-meta-grid -->

            </div><!-- .tryout-header -->

            <!-- Descripción -->
            <?php if ( get_the_content() ) : ?>
            <div class="single-post-content" style="margin:1.5rem 0;">
                <?php the_content(); ?>
            </div>
            <?php endif; ?>

            <!-- Participantes desde Laravel -->
            <?php if ( $participants_data && ! empty( $participants_data['participants'] ) ) : ?>
            <section style="margin-bottom:2rem;">
                <h2 style="font-size:1.125rem; font-weight:700; margin-bottom:1rem;">
                    <?php esc_html_e( 'Participants', 'nexusplay' ); ?>
                    <span style="font-size:0.875rem; font-weight:400; color:var(--color-text-muted); margin-left:0.5rem;">
                        (<?php echo (int) $participants_data['total']; ?>)
                    </span>
                </h2>

                <ul class="npt-participants">
                    <?php foreach ( $participants_data['participants'] as $p ) :
                        $initial    = strtoupper( mb_substr( $p['user']['name'] ?? 'U', 0, 1 ) );
                        $avatar_src = $resolve_avatar( $p['user']['avatar'] ?? '' );
                    ?>
                    <li class="npt-participant">
                        <?php if ( $avatar_src ) : ?>
                            <img class="npt-avatar"
                                 src="<?php echo esc_url( $avatar_src ); ?>"
                                 alt="<?php echo esc_attr( $p['user']['name'] ); ?>">
                        <?php else : ?>
                            <span class="npt-avatar-placeholder"><?php echo esc_html( $initial ); ?></span>
                        <?php endif; ?>
                        <span class="npt-name">
                            <?php echo esc_html( $p['user']['nickname'] ?: $p['user']['name'] ); ?>
                        </span>
                        <span class="npt-badge npt-badge-<?php echo esc_attr( $p['status'] ); ?>">
                            <?php echo esc_html( ucfirst( $p['status'] ) ); ?>
                        </span>
                    </li>
                    <?php endforeach; ?>
                </ul>

            </section>
            <?php elseif ( $participants_data !== null && empty( $participants_data['participants'] ) ) : ?>
                <p style="color:var(--color-text-muted); font-size:0.875rem; margin-bottom:2rem;">
                    <?php esc_html_e( 'No participants yet.', 'nexusplay' ); ?>
                </p>
            <?php elseif ( $participants_data === null ) : ?>
                <p style="color:var(--color-text-dim); font-size:0.875rem; margin-bottom:2rem;">
                    <?php esc_html_e( 'Could not connect to server to fetch participants.', 'nexusplay' ); ?>
                </p>
            <?php endif; ?>

            <!-- Comentarios -->
            <?php if ( comments_open() || get_comments_number() ) : ?>
                <div class="comments-area">
                    <?php comments_template(); ?>
                </div>
            <?php endif; ?>

        </article>

        <?php endwhile; ?>

    </main>

    <?php get_sidebar(); ?>

</div><!-- .site-content -->

<?php get_footer(); ?>
