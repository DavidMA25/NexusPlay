<?php
/**
 * Plantilla parcial: no se encontraron resultados.
 *
 * @package NexusPlay
 */
?>
<section class="no-results" style="
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: 3rem;
    text-align: center;
">
    <h2 style="font-size:1.25rem; margin-bottom:0.75rem;">
        <?php _e( 'Nothing found', 'nexusplay' ); ?>
    </h2>
    <p style="color:var(--color-text-muted); margin-bottom:1.5rem;">
        <?php _e( 'Try a different search.', 'nexusplay' ); ?>
    </p>
    <?php get_search_form(); ?>
</section>
