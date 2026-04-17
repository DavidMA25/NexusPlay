<?php
/**
 * Plantilla de archivo (categorías, etiquetas, fechas, autores).
 *
 * @package NexusPlay
 */

get_header();
?>

<div class="site-content">
    <main class="main-content" role="main" id="main">

        <?php if ( have_posts() ) : ?>

            <header class="page-header" style="margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid var(--color-border);">
                <?php
                the_archive_title( '<h1 style="font-size:1.5rem; font-weight:800;">', '</h1>' );
                the_archive_description( '<p style="color:var(--color-text-muted); margin-top:0.5rem; font-size:0.9rem;">', '</p>' );
                ?>
            </header>

            <div class="posts-list">
                <?php while ( have_posts() ) : the_post(); ?>
                    <?php get_template_part( 'template-parts/content', get_post_type() ); ?>
                <?php endwhile; ?>
            </div>

            <?php the_posts_pagination( [
                'mid_size'  => 2,
                'prev_text' => '&larr;',
                'next_text' => '&rarr;',
                'class'     => 'pagination',
            ] ); ?>

        <?php else : ?>
            <?php get_template_part( 'template-parts/content', 'none' ); ?>
        <?php endif; ?>

    </main>

    <?php get_sidebar(); ?>

</div><!-- .site-content -->

<?php get_footer(); ?>
