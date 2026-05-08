<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div class="site-wrapper">

    <header class="site-header" role="banner">
        <div class="header-inner">

            <!-- Logo -->
            <div class="site-logo">
                <?php if ( has_custom_logo() ) : ?>
                    <?php the_custom_logo(); ?>
                <?php else : ?>
                    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
                        <span class="logo-text">Nexus<span>Play</span></span>
                    </a>
                <?php endif; ?>
            </div>

            <!-- Primary navigation -->
            <nav class="main-navigation" id="site-navigation" role="navigation"
                 aria-label="<?php esc_attr_e( 'Primary Navigation', 'nexusplay' ); ?>">
                <button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false">
                    &#9776;
                    <span class="screen-reader-text"><?php _e( 'Menu', 'nexusplay' ); ?></span>
                </button>

                <?php
                wp_nav_menu( [
                    'theme_location' => 'primary',
                    'menu_id'        => 'primary-menu',
                    'container'      => false,
                    'fallback_cb'    => function() {
                        echo '<ul id="primary-menu"><li><a href="' . esc_url( home_url( '/' ) ) . '">' . __( 'Home', 'nexusplay' ) . '</a></li></ul>';
                    },
                ] );
                ?>
            </nav>

        </div><!-- .header-inner -->
    </header><!-- .site-header -->
