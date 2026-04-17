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

        <!-- Tryout meta mini-grid -->
        <div style="display:flex; gap:1rem; flex-wrap:wrap; margin:0.75rem 0; font-size:0.8125rem; color:var(--color-text-muted);">
            <?php if ( $meta['event_date'] ) : ?>
                <span><?php echo esc_html( date_i18n( get_option( 'date_format' ) . ' ' . get_option( 'time_format' ), strtotime( $meta['event_date'] ) ) ); ?></span>
            <?php endif; ?>
            <?php if ( $meta['location_type'] ) : ?>
                <span><?php echo $meta['location_type'] === 'online' ? 'Online' : 'LAN'; ?></span>
            <?php endif; ?>
            <?php if ( $meta['prize_pool'] ) : ?>
                <span><?php echo esc_html( number_format( (float) $meta['prize_pool'], 2 ) ); ?> € prize pool</span>
            <?php endif; ?>
            <?php if ( $meta['max_participants'] ) : ?>
                <span><?php echo esc_html( $meta['max_participants'] ); ?> slots</span>
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
