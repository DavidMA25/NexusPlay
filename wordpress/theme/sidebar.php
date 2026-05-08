<?php
/**
 * Sidebar del tema NexusPlay.
 * Se incluye con get_sidebar() desde las plantillas que lo necesitan.
 *
 * @package NexusPlay
 */
?>
<aside class="sidebar" role="complementary" aria-label="<?php esc_attr_e( 'Sidebar', 'nexusplay' ); ?>">

    <?php
    // Determinar qué sidebar mostrar según el tipo de página.
    if ( is_singular( 'tryout' ) || is_post_type_archive( 'tryout' ) ) {
        $sidebar_id = 'tryouts-sidebar';
    } else {
        $sidebar_id = 'blog-sidebar';
    }

    if ( is_active_sidebar( $sidebar_id ) ) :
        dynamic_sidebar( $sidebar_id );
    else :
        // Widgets por defecto si el sidebar está vacío.
        ?>

        <!-- Search -->
        <div class="widget widget_search">
            <h3 class="widget-title"><?php _e( 'Search', 'nexusplay' ); ?></h3>
            <?php get_search_form(); ?>
        </div>

        <!-- Recent Posts -->
        <div class="widget widget_recent_entries">
            <h3 class="widget-title"><?php _e( 'Recent Posts', 'nexusplay' ); ?></h3>
            <ul>
                <?php
                $recent = new WP_Query( [
                    'posts_per_page' => 5,
                    'post_status'    => 'publish',
                ] );
                while ( $recent->have_posts() ) :
                    $recent->the_post();
                    ?>
                    <li><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></li>
                <?php endwhile;
                wp_reset_postdata(); ?>
            </ul>
        </div>

        <!-- Games (tryout_game taxonomy — only on tryout pages) -->
        <?php if ( is_singular( 'tryout' ) || is_post_type_archive( 'tryout' ) ) : ?>
        <div class="widget widget_categories">
            <h3 class="widget-title"><?php _e( 'Games', 'nexusplay' ); ?></h3>
            <ul>
                <?php
                wp_list_categories( [
                    'taxonomy' => 'tryout_game',
                    'title_li' => '',
                    'show_count' => true,
                ] );
                ?>
            </ul>
        </div>
        <?php else : ?>
        <!-- Categories (standard posts) -->
        <div class="widget widget_categories">
            <h3 class="widget-title"><?php _e( 'Categories', 'nexusplay' ); ?></h3>
            <ul>
                <?php wp_list_categories( [ 'title_li' => '', 'show_count' => true ] ); ?>
            </ul>
        </div>
        <?php endif; ?>

        <!-- Nube de tags -->
        <div class="widget widget_tag_cloud">
            <h3 class="widget-title"><?php _e( 'Tags', 'nexusplay' ); ?></h3>
            <?php wp_tag_cloud( [ 'smallest' => 11, 'largest' => 16, 'unit' => 'px', 'format' => 'flat' ] ); ?>
        </div>

        <!-- Upcoming Tryouts (if plugin is active) -->
        <?php if ( post_type_exists( 'tryout' ) ) : ?>
        <div class="widget">
            <h3 class="widget-title"><?php _e( 'Upcoming Tryouts', 'nexusplay' ); ?></h3>
            <ul>
                <?php
                $tryouts = new WP_Query( [
                    'post_type'      => 'tryout',
                    'posts_per_page' => 4,
                    'post_status'    => 'publish',
                    'meta_query'     => [
                        [
                            'key'     => '_nexusplay_status',
                            'value'   => [ 'scheduled', 'ongoing' ],
                            'compare' => 'IN',
                        ],
                    ],
                ] );

                if ( $tryouts->have_posts() ) :
                    while ( $tryouts->have_posts() ) :
                        $tryouts->the_post();
                        $status = get_post_meta( get_the_ID(), '_nexusplay_status', true );
                        ?>
                        <li>
                            <a href="<?php the_permalink(); ?>">
                                <?php the_title(); ?>
                                <span class="tryout-status tryout-status-<?php echo esc_attr( $status ); ?>" style="font-size:10px; padding:2px 6px;">
                                    <?php echo esc_html( $status ); ?>
                                </span>
                            </a>
                        </li>
                    <?php endwhile;
                    wp_reset_postdata();
                else : ?>
                    <li><?php _e( 'No upcoming tryouts.', 'nexusplay' ); ?></li>
                <?php endif; ?>
            </ul>
        </div>
        <?php endif; ?>

    <?php endif; ?>

</aside><!-- .sidebar -->
