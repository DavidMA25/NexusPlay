

    <footer class="site-footer" role="contentinfo">
        <div class="footer-inner">

            <div class="footer-grid">

                <!-- Columna marca -->
                <div class="footer-brand footer-section">
                    <div class="site-logo">
                        <?php if ( has_custom_logo() ) : ?>
                            <?php the_custom_logo(); ?>
                        <?php else : ?>
                            <a href="<?php echo esc_url( home_url( '/' ) ); ?>">
                                <span class="logo-text">Nexus<span>Play</span></span>
                            </a>
                        <?php endif; ?>
                    </div>
                    <p><?php bloginfo( 'description' ); ?></p>
                </div>

                <!-- Widget footer 1 -->
                <?php if ( is_active_sidebar( 'footer-1' ) ) : ?>
                <div class="footer-section">
                    <?php dynamic_sidebar( 'footer-1' ); ?>
                </div>
                <?php endif; ?>

                <!-- Widget footer 2 -->
                <?php if ( is_active_sidebar( 'footer-2' ) ) : ?>
                <div class="footer-section">
                    <?php dynamic_sidebar( 'footer-2' ); ?>
                </div>
                <?php endif; ?>

                <!-- Menú footer -->
                <?php if ( has_nav_menu( 'footer' ) ) : ?>
                <div class="footer-section">
                    <h4><?php _e( 'Navegación', 'nexusplay' ); ?></h4>
                    <?php
                    wp_nav_menu( [
                        'theme_location' => 'footer',
                        'container'      => false,
                        'depth'          => 1,
                        'fallback_cb'    => false,
                    ] );
                    ?>
                </div>
                <?php endif; ?>

            </div><!-- .footer-grid -->

            <div class="footer-bottom">
                <p>
                    &copy; <?php echo date( 'Y' ); ?>
                    <a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php bloginfo( 'name' ); ?></a>.
                    <?php _e( 'Todos los derechos reservados.', 'nexusplay' ); ?>
                </p>
                <p>
                    <?php
                    printf(
                        /* translators: %s: WordPress link */
                        esc_html__( 'Powered by %s', 'nexusplay' ),
                        '<a href="https://wordpress.org" rel="nofollow">WordPress</a>'
                    );
                    ?>
                </p>
            </div>

        </div><!-- .footer-inner -->
    </footer><!-- .site-footer -->

</div><!-- .site-wrapper -->

<?php wp_footer(); ?>
</body>
</html>
