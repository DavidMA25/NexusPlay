<?php
/**
 * The main template file — fallback for all pages that do not match a more
 * specific template in the WordPress Template Hierarchy.
 *
 * @package NexusPlay
 */

get_header();
?>

<div class="site-content">
    <main class="main-content" role="main" id="main">

        <?php if ( have_posts() ) : ?>

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
