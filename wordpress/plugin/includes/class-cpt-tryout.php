<?php
/**
 * Registro del Custom Post Type 'tryout'.
 *
 * @package NexusPlay
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class NexusPlay_CPT_Tryout {

    const POST_TYPE    = 'tryout';
    const TAX_GAME     = 'tryout_game';

    public function register(): void {
        $this->register_post_type();
        $this->register_taxonomy();
    }

    private function register_post_type(): void {
        register_post_type( self::POST_TYPE, [
            'labels' => [
                'name'               => __( 'Tryouts',             'nexusplay' ),
                'singular_name'      => __( 'Tryout',              'nexusplay' ),
                'add_new_item'       => __( 'Add New Tryout',       'nexusplay' ),
                'edit_item'          => __( 'Edit Tryout',       'nexusplay' ),
                'not_found'          => __( 'No Tryouts found',      'nexusplay' ),
                'not_found_in_trash' => __( 'No Tryouts in Trash', 'nexusplay' ),
                'menu_name'          => __( 'Tryouts',             'nexusplay' ),
            ],
            'public'                => true,
            'publicly_queryable'    => true,
            'show_ui'               => true,
            'show_in_menu'          => true,
            'query_var'             => true,
            'rewrite'               => [ 'slug' => 'tryouts' ],
            'capability_type'       => 'post',
            'has_archive'           => true,
            'hierarchical'          => false,
            'menu_position'         => 5,
            'menu_icon'             => 'dashicons-calendar-alt',
            'supports'              => [ 'title', 'editor', 'thumbnail', 'excerpt', 'comments' ],
            'show_in_rest'          => true,
            'rest_base'             => 'tryouts',
        ] );
    }

    private function register_taxonomy(): void {
        register_taxonomy( self::TAX_GAME, [ self::POST_TYPE ], [
            'labels' => [
                'name'              => __( 'Games',              'nexusplay' ),
                'singular_name'     => __( 'Game',               'nexusplay' ),
                'menu_name'         => __( 'Games',              'nexusplay' ),
                'all_items'         => __( 'All Games',          'nexusplay' ),
                'edit_item'         => __( 'Edit Game',          'nexusplay' ),
                'view_item'         => __( 'View Game',          'nexusplay' ),
                'update_item'       => __( 'Update Game',        'nexusplay' ),
                'add_new_item'      => __( 'Add New Game',       'nexusplay' ),
                // These two lines fix the "New category name" / "Parent category" labels
                'new_item_name'     => __( 'New Game Name',      'nexusplay' ),
                'parent_item'       => __( 'Parent Game',        'nexusplay' ),
                'parent_item_colon' => __( 'Parent Game:',       'nexusplay' ),
                'search_items'      => __( 'Search Games',       'nexusplay' ),
                'not_found'         => __( 'No games found',     'nexusplay' ),
            ],
            'hierarchical'      => true,
            'show_ui'           => true,
            'show_admin_column' => true,
            'query_var'         => true,
            'rewrite'           => [ 'slug' => 'tryout-game' ],
            'show_in_rest'      => true,
        ] );
    }
}
