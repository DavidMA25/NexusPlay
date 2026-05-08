<?php
/**
 * Plantilla para páginas estáticas (About, Contact, etc.)
 *
 * @package NexusPlay
 */

get_header();
?>

<div class="site-content">
    <main class="main-content" role="main" id="main">

        <?php while ( have_posts() ) : the_post(); ?>

            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

                <header style="margin-bottom:1.5rem;">
                    <h1 style="font-size:1.75rem; font-weight:800;"><?php the_title(); ?></h1>
                </header>

                <?php if ( has_post_thumbnail() ) : ?>
                    <div class="single-post-thumbnail">
                        <?php the_post_thumbnail( 'nexusplay-hero' ); ?>
                    </div>
                <?php endif; ?>

                <div class="single-post-content">
                    <?php the_content(); ?>
                    <?php
                    wp_link_pages( [
                        'before' => '<div class="page-links">' . __( 'Pages:', 'nexusplay' ),
                        'after'  => '</div>',
                    ] );
                    ?>
                </div>

            </article>

            <?php if ( comments_open() || get_comments_number() ) : ?>
                <div class="comments-area">
                    <?php comments_template(); ?>
                </div>
            <?php endif; ?>

        <?php endwhile; ?>

    </main>

    <?php get_sidebar(); ?>

</div><!-- .site-content -->

<?php get_footer(); ?>
