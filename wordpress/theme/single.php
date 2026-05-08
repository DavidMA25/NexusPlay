<?php
/**
 * Plantilla para un post individual del blog.
 *
 * @package NexusPlay
 */

get_header();
?>

<div class="site-content">
    <main class="main-content" role="main" id="main">

        <?php while ( have_posts() ) : the_post(); ?>

            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

                <!-- Post header -->
                <header class="single-post-header">

                    <div class="post-card-meta" style="margin-bottom:1rem;">
                        <?php echo nexusplay_categories(); ?>
                        <span class="post-card-date"><?php nexusplay_posted_on(); ?></span>
                    </div>

                    <h1 style="font-size:2rem; font-weight:800; line-height:1.2; margin-bottom:1rem;">
                        <?php the_title(); ?>
                    </h1>

                    <?php nexusplay_posted_by(); ?>

                </header>

                <!-- Featured image -->
                <?php if ( has_post_thumbnail() ) : ?>
                    <div class="single-post-thumbnail">
                        <?php the_post_thumbnail( 'nexusplay-hero' ); ?>
                    </div>
                <?php endif; ?>

                <!-- Content -->
                <div class="single-post-content">
                    <?php the_content(); ?>
                </div>

                <!-- In-post pagination -->
                <?php
                wp_link_pages( [
                    'before'    => '<div class="page-links">' . __( 'Pages:', 'nexusplay' ),
                    'after'     => '</div>',
                    'link_before' => '<span class="page-numbers">',
                    'link_after'  => '</span>',
                ] );
                ?>

                <!-- Tags -->
                <?php
                $tags = get_the_tags();
                if ( $tags ) :
                ?>
                <div class="post-tags">
                    <?php foreach ( $tags as $tag ) : ?>
                        <a href="<?php echo esc_url( get_tag_link( $tag->term_id ) ); ?>" class="post-tag">
                            #<?php echo esc_html( $tag->name ); ?>
                        </a>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>

            </article>

            <!-- Post navigation -->
            <nav class="post-navigation" style="
                display:flex;
                justify-content:space-between;
                gap:1rem;
                margin-top:2rem;
                padding-top:1.5rem;
                border-top:1px solid var(--color-border);
                font-size:0.875rem;
            ">
                <div><?php previous_post_link( '%link', '&larr; %title' ); ?></div>
                <div><?php next_post_link( '%link', '%title &rarr;' ); ?></div>
            </nav>

            <!-- Comments -->
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
