<?php
/**
 * Plantilla parcial: tarjeta de Tryout para el archivo del CPT.
 *
 * @package NexusPlay
 */

$meta   = nexusplay_get_tryout_meta( get_the_ID() );
$status = $meta['status'] ?: 'scheduled';

$status_labels = [
    'scheduled' => __( 'Scheduled', 'nexusplay' ),
    'ongoing'   => __( 'Live', 'nexusplay' ),
    'finished'  => __( 'Finished', 'nexusplay' ),
    'cancelled' => __( 'Cancelled', 'nexusplay' ),
];
$status_label = $status_labels[ $status ] ?? ucfirst( $status );
?>
<article id="post-<?php the_ID(); ?>" <?php post_class( 'post-card' ); ?>>

    <?php if ( has_post_thumbnail() ) : ?>
        <a href="<?php the_permalink(); ?>" class="post-card-thumbnail" tabindex="-1" aria-hidden="true">
            <?php the_post_thumbnail( 'nexusplay-card' ); ?>
        </a>
    <?php endif; ?>

    <div class="post-card-body">

        <div class="post-card-meta">
            <span class="tryout-status tryout-status-<?php echo esc_attr( $status ); ?>">
                <?php echo esc_html( $status_label ); ?>
            </span>
            <?php
            $games = get_the_terms( get_the_ID(), 'tryout_game' );
            if ( $games && ! is_wp_error( $games ) ) :
                foreach ( $games as $game ) :
                    printf(
                        '<a href="%s" class="post-card-category">%s</a>',
                        esc_url( get_term_link( $game ) ),
                        esc_html( $game->name )
                    );
                endforeach;
            endif;
            ?>
        </div>

        <h2 class="post-card-title">
            <a href="<?php the_permalink(); ?>" rel="bookmark"><?php the_title(); ?></a>
        </h2>

        <!-- Tryout meta -->
        <div class="tryout-card-meta">
            <?php if ( $meta['event_date'] ) : ?>
                <span class="tryout-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="tryout-meta-icon"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <?php echo esc_html( wp_date( 'M j, Y g:i A', strtotime( $meta['event_date'] ) ) ); ?>
                </span>
            <?php endif; ?>
            <?php if ( $meta['location_type'] ) : ?>
                <span class="tryout-meta-item">
                    <?php if ( $meta['location_type'] === 'online' ) : ?>
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="tryout-meta-icon"><path d="M1 6s1.5-2 5.5-2 5.5 2 11.5 2 5.5-2 5.5-2"/><path d="M1 12s1.5-2 5.5-2 5.5 2 11.5 2 5.5-2 5.5-2"/><path d="M1 18s1.5-2 5.5-2 5.5 2 11.5 2 5.5-2 5.5-2"/></svg>
                        Online
                    <?php else : ?>
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="tryout-meta-icon"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        LAN
                    <?php endif; ?>
                </span>
            <?php endif; ?>
            <?php if ( $meta['prize_pool'] ) : ?>
                <span class="tryout-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="tryout-meta-icon"><polyline points="8 6 12 2 16 6"/><line x1="12" y1="2" x2="12" y2="15"/><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><line x1="8" y1="22" x2="8" y2="22"/><line x1="16" y1="22" x2="16" y2="22"/><line x1="12" y1="20" x2="12" y2="22"/></svg>
                    <?php echo esc_html( number_format( (float) $meta['prize_pool'], 0 ) ); ?> € prize pool
                </span>
            <?php endif; ?>
            <?php if ( $meta['max_participants'] ) : ?>
                <span class="tryout-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="tryout-meta-icon"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <?php echo esc_html( $meta['max_participants'] ); ?> slots
                </span>
            <?php endif; ?>
        </div>

        <p class="post-card-excerpt">
            <?php echo wp_trim_words( get_the_excerpt(), 20, '…' ); ?>
        </p>

        <div class="post-card-footer">
            <span class="post-card-date"><?php nexusplay_posted_on(); ?></span>
            <a href="<?php the_permalink(); ?>" class="btn-read-more"
               aria-label="<?php printf( esc_attr__( 'View tryout: %s', 'nexusplay' ), get_the_title() ); ?>">
                <?php _e( 'View tryout', 'nexusplay' ); ?> &rarr;
            </a>
        </div>

    </div><!-- .post-card-body -->

</article>
