<?php
/**
 * Plantilla 404.
 *
 * @package NexusPlay
 */

get_header();
?>

<div class="site-content no-sidebar">
    <main class="main-content" role="main" id="main">

        <div style="
            text-align: center;
            padding: 4rem 2rem;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius);
            position: relative;
            overflow: hidden;
        ">
            <!-- Decorative glow -->
            <div style="
                position: absolute; top: 0; left: 0; right: 0; height: 2px;
                background: linear-gradient(90deg, transparent, var(--color-red), transparent);
                opacity: 0.5;
            "></div>

            <div style="font-size: 6rem; font-weight: 900; color: var(--color-red); line-height: 1; margin-bottom: 1rem;">
                404
            </div>

            <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem;">
                <?php _e( 'Page not found', 'nexusplay' ); ?>
            </h1>

            <p style="color: var(--color-text-muted); max-width: 400px; margin: 0 auto 2rem;">
                <?php _e( 'The page you are looking for does not exist or has been moved.', 'nexusplay' ); ?>
            </p>

            <?php get_search_form(); ?>

            <a href="<?php echo esc_url( home_url( '/' ) ); ?>"
               style="
                   display: inline-block;
                   margin-top: 1.5rem;
                   background: var(--color-red);
                   color: #fff;
                   padding: 0.625rem 1.5rem;
                   border-radius: var(--radius-sm);
                   font-weight: 700;
                   font-size: 0.9rem;
               ">
                &larr; <?php _e( 'Back to home', 'nexusplay' ); ?>
            </a>
        </div>

    </main>
</div>

<?php get_footer(); ?>
