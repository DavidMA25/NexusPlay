<?php
/**
 * Plantilla parcial: tarjeta de post estándar.
 * Se usa en el loop del blog (index.php, archive.php, etc.)
 *
 * @package NexusPlay
 */
?>
<article id="post-<?php the_ID(); ?>" <?php post_class( 'post-card' ); ?>>

    <?php if ( has_post_thumbnail() ) : ?>
        <a href="<?php the_permalink(); ?>" class="post-card-thumbnail" tabindex="-1" aria-hidden="true">
            <?php the_post_thumbnail( 'nexusplay-card' ); ?>
        </a>
    <?php endif; ?>

    <div class="post-card-body">

        <div class="post-card-meta">
            <?php echo nexusplay_categories(); ?>
            <span class="post-card-date"><?php nexusplay_posted_on(); ?></span>
        </div>

        <h2 class="post-card-title">
            <a href="<?php the_permalink(); ?>" rel="bookmark"><?php the_title(); ?></a>
        </h2>

        <p class="post-card-excerpt">
            <?php echo wp_trim_words( get_the_excerpt(), 25, '…' ); ?>
        </p>

        <div class="post-card-footer">
            <?php nexusplay_posted_by(); ?>
            <a href="<?php the_permalink(); ?>" class="btn-read-more" aria-label="<?php printf( esc_attr__( 'Leer más: %s', 'nexusplay' ), get_the_title() ); ?>">
                <?php _e( 'Leer más', 'nexusplay' ); ?> &rarr;
            </a>
        </div>

    </div><!-- .post-card-body -->

</article>
