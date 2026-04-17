<?php
/**
 * Plantilla de resultados de búsqueda.
 *
 * @package NexusPlay
 */

get_header();
?>

<div class="site-content">
    <main class="main-content" role="main" id="main">

        <header class="page-header" style="margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid var(--color-border);">
            <h1 style="font-size:1.5rem; font-weight:800;">
                <?php
                printf(
                    /* translators: %s: search query */
                    esc_html__( 'Resultados para: "%s"', 'nexusplay' ),
                    '<span style="color:var(--color-red);">' . esc_html( get_search_query() ) . '</span>'
                );
                ?>
            </h1>
            <?php if ( have_posts() ) : ?>
                <p style="color:var(--color-text-muted); font-size:0.875rem; margin-top:0.375rem;">
                    <?php printf( _n( '%s resultado', '%s resultados', $wp_query->found_posts, 'nexusplay' ), number_format_i18n( $wp_query->found_posts ) ); ?>
                </p>
            <?php endif; ?>
        </header>

        <?php if ( have_posts() ) : ?>

            <div class="posts-list">
                <?php while ( have_posts() ) : the_post(); ?>
                    <?php get_template_part( 'template-parts/content', get_post_type() ); ?>
                <?php endwhile; ?>
            </div>

            <?php the_posts_pagination( [ 'prev_text' => '&larr;', 'next_text' => '&rarr;', 'class' => 'pagination' ] ); ?>

        <?php else : ?>
            <?php get_template_part( 'template-parts/content', 'none' ); ?>
        <?php endif; ?>

    </main>

    <?php get_sidebar(); ?>

</div>

<?php get_footer(); ?>
