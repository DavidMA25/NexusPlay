<?php
/**
 * API REST del plugin NexusPlay.
 *
 * — Expone los meta fields del CPT en /wp/v2/tryouts (para React).
 * — Endpoint /nexusplay/v1/tryouts/{id}/participants (para React/WP).
 * — Endpoint /nexusplay/v1/tryouts/{id}/stats.
 *
 * @package NexusPlay
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class NexusPlay_REST_API {

    const NS = 'nexusplay/v1';

    private NexusPlay_Laravel_DB $db;

    public function __construct( NexusPlay_Laravel_DB $db ) {
        $this->db = $db;
    }

    // -------------------------------------------------------------------------
    // Registrar meta fields en el endpoint nativo /wp/v2/tryouts
    // -------------------------------------------------------------------------

    public function register_tryout_meta_fields(): void {
        if ( ! post_type_exists( 'tryout' ) ) {
            return;
        }

        $prefix = NexusPlay_Meta_Boxes::PREFIX;

        $fields = [
            'team_id'          => 'integer',
            'event_date'       => 'string',
            'location_type'    => 'string',
            'location_details' => 'string',
            'max_participants' => 'integer',
            'prize_pool'       => 'number',
            'tryout_status'    => 'string',   // sin prefijo para simplicidad en el frontend
        ];

        // Mapeo meta_key real → nombre en REST.
        $key_map = [
            'team_id'          => $prefix . 'team_id',
            'event_date'       => $prefix . 'event_date',
            'location_type'    => $prefix . 'location_type',
            'location_details' => $prefix . 'location_details',
            'max_participants' => $prefix . 'max_participants',
            'prize_pool'       => $prefix . 'prize_pool',
            'tryout_status'    => $prefix . 'status',
        ];

        foreach ( $fields as $rest_name => $type ) {
            $meta_key = $key_map[ $rest_name ];
            register_post_meta( 'tryout', $meta_key, [
                'show_in_rest'  => true,
                'single'        => true,
                'type'          => $type,
                'auth_callback' => fn() => current_user_can( 'edit_posts' ),
            ] );

            // Alias limpio en el objeto REST para que el frontend lo lea como `meta.tryout_status`.
            register_rest_field( 'tryout', $rest_name, [
                'get_callback' => fn( $post ) => get_post_meta( $post['id'], $meta_key, true ),
                'schema'       => [ 'type' => $type ],
            ] );
        }

        // Habilitar filtrado por tryout_status en GET /wp/v2/tryouts?tryout_status=scheduled
        add_filter( 'rest_tryout_query', [ $this, 'filter_by_tryout_status' ], 10, 2 );
    }

    /**
     * Inyecta meta_query cuando la petición REST trae ?tryout_status=…
     */
    public function filter_by_tryout_status( array $args, WP_REST_Request $request ): array {
        $status = $request->get_param( 'tryout_status' );
        if ( $status ) {
            $allowed = [ 'scheduled', 'ongoing', 'finished', 'cancelled' ];
            $status  = sanitize_text_field( $status );
            if ( in_array( $status, $allowed, true ) ) {
                $args['meta_query'][] = [
                    'key'     => NexusPlay_Meta_Boxes::PREFIX . 'status',
                    'value'   => $status,
                    'compare' => '=',
                ];
            }
        }
        return $args;
    }

    // -------------------------------------------------------------------------
    // Registrar rutas propias
    // -------------------------------------------------------------------------

    public function register_routes(): void {
        register_rest_route( self::NS, '/tryouts/(?P<id>\d+)/participants', [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => [ $this, 'get_participants' ],
            'permission_callback' => '__return_true',
            'args'                => [
                'id' => [
                    'required'          => true,
                    'validate_callback' => fn( $v ) => is_numeric( $v ) && $v > 0,
                    'sanitize_callback' => 'absint',
                ],
            ],
        ] );

        register_rest_route( self::NS, '/tryouts/(?P<id>\d+)/stats', [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => [ $this, 'get_stats' ],
            'permission_callback' => '__return_true',
            'args'                => [
                'id' => [
                    'required'          => true,
                    'validate_callback' => fn( $v ) => is_numeric( $v ) && $v > 0,
                    'sanitize_callback' => 'absint',
                ],
            ],
        ] );

        // PATCH /nexusplay/v1/tryouts/{id}/participants/{participantId}
        // Actualizar estado de un participante desde el admin de WordPress.
        register_rest_route( self::NS, '/tryouts/(?P<id>\d+)/participants/(?P<participant_id>\d+)', [
            'methods'             => WP_REST_Server::EDITABLE,
            'callback'            => [ $this, 'update_participant_status' ],
            'permission_callback' => fn() => current_user_can( 'edit_posts' ),
            'args'                => [
                'id'             => [
                    'required'          => true,
                    'validate_callback' => fn( $v ) => is_numeric( $v ) && $v > 0,
                    'sanitize_callback' => 'absint',
                ],
                'participant_id' => [
                    'required'          => true,
                    'validate_callback' => fn( $v ) => is_numeric( $v ) && $v > 0,
                    'sanitize_callback' => 'absint',
                ],
                'status' => [
                    'required'          => true,
                    'validate_callback' => fn( $v ) => in_array( $v, [ 'registered', 'approved', 'rejected' ], true ),
                    'sanitize_callback' => 'sanitize_text_field',
                ],
            ],
        ] );

        // GET /nexusplay/v1/teams/search?q=name
        // AJAX team search for the meta-box Select2 selector. Admin-only.
        register_rest_route( self::NS, '/teams/search', [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => [ $this, 'search_teams' ],
            'permission_callback' => fn() => current_user_can( 'edit_posts' ),
            'args'                => [
                'q' => [
                    'required'          => true,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => fn( $v ) => is_string( $v ) && strlen( trim( $v ) ) >= 1,
                ],
            ],
        ] );
    }

    // -------------------------------------------------------------------------
    // Callbacks
    // -------------------------------------------------------------------------

    public function get_participants( WP_REST_Request $request ): WP_REST_Response|WP_Error {
        $wp_post_id = $request->get_param( 'id' );

        if ( ! $this->db->tables_exist() ) {
            return new WP_Error( 'db_error', __( 'Laravel tables not available.', 'nexusplay' ), [ 'status' => 503 ] );
        }

        $participants = $this->db->get_participants( $wp_post_id );

        $data = array_map( fn( $p ) => [
            'id'     => (int) $p->id,
            'status' => $p->status,
            'user'   => [
                'id'       => (int) $p->user_id,
                'name'     => $p->user_name,
                'nickname' => $p->user_nickname,
                'email'    => $p->user_email,
                'avatar'   => $p->user_avatar,
                'role'     => $p->user_role,
            ],
        ], $participants );

        return new WP_REST_Response( $data, 200 );
    }

    public function get_stats( WP_REST_Request $request ): WP_REST_Response|WP_Error {
        $wp_post_id      = $request->get_param( 'id' );
        $max_participants = (int) get_post_meta( $wp_post_id, NexusPlay_Meta_Boxes::PREFIX . 'max_participants', true );

        $total    = $this->db->count_participants( $wp_post_id );
        $approved = $this->db->count_participants( $wp_post_id, 'approved' );

        return new WP_REST_Response( [
            'total'           => $total,
            'approved'        => $approved,
            'registered'      => $this->db->count_participants( $wp_post_id, 'registered' ),
            'rejected'        => $this->db->count_participants( $wp_post_id, 'rejected' ),
            'max_participants'=> $max_participants,
            'available_slots' => $max_participants ? max( 0, $max_participants - $approved ) : null,
        ], 200 );
    }

    /**
     * PATCH /nexusplay/v1/tryouts/{id}/participants/{participant_id}
     * Updates a participant status.
     * WordPress editors/admins can always do this (platform management).
     * The Laravel team owner uses the Laravel API endpoint instead.
     * Both paths are independent and intentional.
     */
    public function update_participant_status( WP_REST_Request $request ): WP_REST_Response|WP_Error {
        global $wpdb;

        $wp_post_id     = $request->get_param( 'id' );
        $participant_id = $request->get_param( 'participant_id' );
        $new_status     = $request->get_param( 'status' );

        if ( ! $this->db->tables_exist() ) {
            return new WP_Error( 'db_error', __( 'Laravel tables not available.', 'nexusplay' ), [ 'status' => 503 ] );
        }

        // Verificar que el participante existe y pertenece a este tryout.
        $participant = $wpdb->get_row( $wpdb->prepare(
            "SELECT * FROM tryout_participants WHERE id = %d AND wp_post_id = %d LIMIT 1",
            $participant_id,
            $wp_post_id
        ) );

        if ( ! $participant ) {
            return new WP_Error( 'not_found', __( 'Participant not found.', 'nexusplay' ), [ 'status' => 404 ] );
        }

        $updated = $wpdb->update(
            'tryout_participants',
            [ 'status' => $new_status, 'updated_at' => current_time( 'mysql' ) ],
            [ 'id' => $participant_id, 'wp_post_id' => $wp_post_id ],
            [ '%s', '%s' ],
            [ '%d', '%d' ]
        );

        if ( false === $updated ) {
            return new WP_Error( 'db_update_failed', __( 'Could not update status.', 'nexusplay' ), [ 'status' => 500 ] );
        }

        return new WP_REST_Response( [
            'id'         => (int) $participant_id,
            'wp_post_id' => (int) $wp_post_id,
            'status'     => $new_status,
            'message'    => __( 'Status updated successfully.', 'nexusplay' ),
        ], 200 );
    }

    /**
     * GET /nexusplay/v1/teams/search?q=…
     * Returns teams matching the search query. Used by the Select2 AJAX selector
     * in the tryout meta-box. Formatted as Select2 expects: [{id, text}].
     */
    public function search_teams( WP_REST_Request $request ): WP_REST_Response|WP_Error {
        $query = trim( $request->get_param( 'q' ) );

        if ( ! $this->db->tables_exist() ) {
            return new WP_Error( 'db_error', __( 'Laravel tables not available.', 'nexusplay' ), [ 'status' => 503 ] );
        }

        $teams = $this->db->search_teams( $query );

        // Format for Select2: { results: [ { id, text } ] }
        $results = array_map( fn( $t ) => [
            'id'     => (int) $t->id,
            'text'   => $t->name . ( $t->region ? ' (' . $t->region . ')' : '' ),
            'owner'  => $t->owner_name,
        ], $teams );

        return new WP_REST_Response( [ 'results' => $results ], 200 );
    }
}
