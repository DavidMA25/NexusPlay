<?php
/**
 * Archivo del CPT Tryout — lista todos los tryouts.
 * Jerarquía: archive-tryout.php > archive.php > index.php
 *
 * @package NexusPlay
 */

get_header();
?>

<div class="site-content">
    <main class="main-content" role="main" id="main">

        <header class="page-header" style="margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid var(--color-border);">
            <h1 style="font-size:1.5rem; font-weight:800;"><?php _e( 'Tryouts', 'nexusplay' ); ?></h1>
            <p style="color:var(--color-text-muted); margin-top:0.5rem; font-size:0.9rem;">
                <?php _e( 'All NexusPlay events and tryouts.', 'nexusplay' ); ?>
            </p>
        </header>

        <!-- Status filter (simple GET param) -->
        <?php
        $current_filter = isset( $_GET['status'] ) ? sanitize_text_field( $_GET['status'] ) : '';
        $filters = [
            '' => __( 'All', 'nexusplay' ),
            'scheduled' => __( 'Upcoming', 'nexusplay' ),
            'ongoing' => __( 'Live', 'nexusplay' ),
            'finished' => __( 'Finished', 'nexusplay' ),
        ];
        ?>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.5rem;">
            <?php foreach ( $filters as $val => $label ) :
                $active = $current_filter === $val;
                $href   = $val ? add_query_arg( 'status', $val ) : remove_query_arg( 'status' );
            ?>
                <a href="<?php echo esc_url( $href ); ?>"
                   style="
                       padding: 0.375rem 0.875rem;
                       border-radius: 9999px;
                       font-size: 0.8125rem;
                       font-weight: 600;
                       border: 1px solid <?php echo $active ? 'var(--color-red)' : 'var(--color-border)'; ?>;
                       background: <?php echo $active ? 'var(--color-red-dim)' : 'var(--color-surface)'; ?>;
                       color: <?php echo $active ? 'var(--color-red)' : 'var(--color-text-muted)'; ?>;
                   ">
                    <?php echo esc_html( $label ); ?>
                </a>
            <?php endforeach; ?>
        </div>

        <?php if ( have_posts() ) : ?>

            <div class="posts-list">
                <?php while ( have_posts() ) : the_post(); ?>
                    <?php get_template_part( 'template-parts/content', 'tryout' ); ?>
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
