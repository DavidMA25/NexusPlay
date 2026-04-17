<?php
/**
 * Meta boxes for the Tryout CPT.
 *
 * — Main meta box (normal area): all tryout fields.
 * — Side meta box: participants read from the shared Laravel DB.
 *
 * @package NexusPlay
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class NexusPlay_Meta_Boxes {

    const PREFIX = '_nexusplay_';

    private NexusPlay_Laravel_DB $db;

    public function __construct( NexusPlay_Laravel_DB $db ) {
        $this->db = $db;
    }

    // -------------------------------------------------------------------------
    // Helper: resolve a possibly-relative Laravel storage URL to absolute.
    // Laravel saves avatar_url as '/storage/avatars/file.jpg'.
    // -------------------------------------------------------------------------

    private function resolve_asset( string $url ): string {
        if ( ! $url ) return '';
        if ( preg_match( '#^https?://#', $url ) ) return $url;

        // Use NEXUSPLAY_LARAVEL_API constant if defined in wp-config.php,
        // stripping /api to get the base server URL.
        $api_url   = defined( 'NEXUSPLAY_LARAVEL_API' )
            ? rtrim( NEXUSPLAY_LARAVEL_API, '/' )
            : 'http://localhost:8000/api';
        $base      = preg_replace( '#/api/?$#', '', $api_url );

        return $base . ( str_starts_with( $url, '/' ) ? '' : '/' ) . $url;
    }

    // -------------------------------------------------------------------------
    // Register meta boxes
    // -------------------------------------------------------------------------

    public function add(): void {
        add_meta_box(
            'nexusplay_tryout_data',
            __( 'Tryout Data', 'nexusplay' ),
            [ $this, 'render_data_box' ],
            NexusPlay_CPT_Tryout::POST_TYPE,
            'normal',
            'default'
        );

        add_meta_box(
            'nexusplay_participants',
            __( 'Participants', 'nexusplay' ),
            [ $this, 'render_participants_box' ],
            NexusPlay_CPT_Tryout::POST_TYPE,
            'side',
            'default'
        );
    }

    // -------------------------------------------------------------------------
    // Meta box: Tryout Data
    // -------------------------------------------------------------------------

    public function render_data_box( WP_Post $post ): void {
        wp_nonce_field( 'nexusplay_save_tryout_' . $post->ID, 'nexusplay_tryout_nonce' );

        $f = $this->get_fields( $post->ID );

        // Load current team for display.
        $team = null;
        if ( ! empty( $f['team_id'] ) ) {
            $team = $this->db->get_team( (int) $f['team_id'] );
        }
        ?>
        <style>
            #nexusplay_tryout_data .inside { padding: 0; }
            .np-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 0;
                border-top: 1px solid #dcdcde;
            }
            .np-field {
                padding: 12px 16px;
                border-bottom: 1px solid #dcdcde;
                border-right: 1px solid #dcdcde;
            }
            .np-field:nth-child(3n) { border-right: none; }
            .np-field-wide { grid-column: span 3; border-right: none; }
            .np-field label {
                display: block;
                font-weight: 600;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: .04em;
                color: #646970;
                margin-bottom: 6px;
            }
            .np-field input,
            .np-field select,
            .np-field textarea {
                width: 100%;
                box-sizing: border-box;
            }

            /* ── Team search widget ── */
            .np-team-search-wrap { position: relative; }
            .np-team-search-input {
                width: 100%;
                box-sizing: border-box;
                padding: 4px 8px;
                border: 1px solid #8c8f94;
                border-radius: 3px;
                font-size: 13px;
            }
            .np-team-search-input:focus { border-color: #2271b1; outline: none; box-shadow: 0 0 0 1px #2271b1; }
            .np-team-dropdown {
                display: none;
                position: absolute;
                top: 100%;
                left: 0; right: 0;
                background: #fff;
                border: 1px solid #8c8f94;
                border-top: none;
                border-radius: 0 0 3px 3px;
                max-height: 200px;
                overflow-y: auto;
                z-index: 9999;
                box-shadow: 0 4px 8px rgba(0,0,0,.15);
            }
            .np-team-dropdown.is-open { display: block; }
            .np-team-option {
                padding: 7px 10px;
                cursor: pointer;
                font-size: 12px;
                border-bottom: 1px solid #f0f0f1;
                line-height: 1.4;
            }
            .np-team-option:last-child { border-bottom: none; }
            .np-team-option:hover,
            .np-team-option.is-focused { background: #f0f6fc; }
            .np-team-option .np-team-owner { color: #646970; font-size: 11px; }
            .np-team-selected {
                margin-top: 5px;
                font-size: 11px;
                color: #2271b1;
                font-weight: 600;
                min-height: 16px;
            }
            .np-team-searching { padding: 8px 10px; font-size: 12px; color: #646970; font-style: italic; }
        </style>

        <div class="np-grid">

            <!-- Team — custom AJAX search input -->
            <div class="np-field">
                <label for="np_team_search"><?php esc_html_e( 'Team', 'nexusplay' ); ?></label>

                <div class="np-team-search-wrap">
                    <input
                        type="text"
                        id="np_team_search"
                        class="np-team-search-input"
                        autocomplete="off"
                        placeholder="<?php esc_attr_e( 'Type to search…', 'nexusplay' ); ?>"
                        value="<?php echo $team ? esc_attr( $team->name . ( $team->region ? ' (' . $team->region . ')' : '' ) ) : ''; ?>"
                    />
                    <div class="np-team-dropdown" id="np_team_dropdown"></div>
                </div>

                <!-- Hidden real input saved on form submit -->
                <input type="hidden" id="np_team_id" name="np_team_id"
                       value="<?php echo esc_attr( $f['team_id'] ); ?>" />

                <p class="np-team-selected" id="np_team_selected">
                    <?php if ( $team ) :
                        echo esc_html( '✓ ' . $team->name . ' — ' . __( 'Owner:', 'nexusplay' ) . ' ' . $team->owner_name );
                    endif; ?>
                </p>

                <script>
                jQuery( function( $ ) {
                    var restUrl = <?php echo wp_json_encode( rest_url( 'nexusplay/v1/teams/search' ) ); ?>;
                    var nonce   = <?php echo wp_json_encode( wp_create_nonce( 'wp_rest' ) ); ?>;
                    var timer   = null;

                    var $input    = $( '#np_team_search' );
                    var $hidden   = $( '#np_team_id' );
                    var $dropdown = $( '#np_team_dropdown' );
                    var $selected = $( '#np_team_selected' );

                    function closeDropdown() {
                        $dropdown.removeClass( 'is-open' ).empty();
                    }

                    function openDropdown( html ) {
                        $dropdown.html( html ).addClass( 'is-open' );
                    }

                    function selectTeam( id, label, owner ) {
                        $hidden.val( id );
                        $input.val( label );
                        $selected.text( '✓ ' + label + ( owner ? ' — <?php echo esc_js( __( 'Owner:', 'nexusplay' ) ); ?> ' + owner : '' ) );
                        closeDropdown();
                    }

                    $input.on( 'input', function() {
                        var q = $.trim( $( this ).val() );
                        clearTimeout( timer );

                        // Clear selection if user starts typing again
                        $hidden.val( '' );
                        $selected.text( '' );

                        if ( q.length < 1 ) { closeDropdown(); return; }

                        openDropdown( '<div class="np-team-searching"><?php echo esc_js( __( 'Searching…', 'nexusplay' ) ); ?></div>' );

                        timer = setTimeout( function() {
                            $.ajax( {
                                url:     restUrl,
                                method:  'GET',
                                data:    { q: q },
                                headers: { 'X-WP-Nonce': nonce },
                                success: function( data ) {
                                    var results = data.results || [];
                                    if ( ! results.length ) {
                                        openDropdown( '<div class="np-team-searching"><?php echo esc_js( __( 'No teams found.', 'nexusplay' ) ); ?></div>' );
                                        return;
                                    }
                                    var html = '';
                                    $.each( results, function( i, t ) {
                                        html += '<div class="np-team-option"'
                                            + ' data-id="'    + t.id    + '"'
                                            + ' data-label="' + $( '<div>' ).text( t.text ).html() + '"'
                                            + ' data-owner="' + $( '<div>' ).text( t.owner || '' ).html() + '"'
                                            + '>'
                                            + '<strong>' + $( '<div>' ).text( t.text ).html() + '</strong>'
                                            + ( t.owner ? '<div class="np-team-owner"><?php echo esc_js( __( 'Owner:', 'nexusplay' ) ); ?> ' + $( '<div>' ).text( t.owner ).html() + '</div>' : '' )
                                            + '</div>';
                                    } );
                                    openDropdown( html );
                                },
                                error: function() {
                                    openDropdown( '<div class="np-team-searching"><?php echo esc_js( __( 'Connection error.', 'nexusplay' ) ); ?></div>' );
                                }
                            } );
                        }, 300 );
                    } );

                    // Click on an option
                    $dropdown.on( 'click', '.np-team-option', function() {
                        selectTeam(
                            $( this ).data( 'id' ),
                            $( this ).data( 'label' ),
                            $( this ).data( 'owner' )
                        );
                    } );

                    // Close dropdown when clicking outside
                    $( document ).on( 'click', function( e ) {
                        if ( ! $( e.target ).closest( '.np-team-search-wrap' ).length ) {
                            closeDropdown();
                        }
                    } );

                    // Keyboard navigation
                    $input.on( 'keydown', function( e ) {
                        var $opts  = $dropdown.find( '.np-team-option' );
                        var $focus = $dropdown.find( '.np-team-option.is-focused' );
                        if ( e.key === 'ArrowDown' ) {
                            e.preventDefault();
                            var $next = $focus.length ? $focus.next( '.np-team-option' ) : $opts.first();
                            $opts.removeClass( 'is-focused' );
                            $next.addClass( 'is-focused' );
                        } else if ( e.key === 'ArrowUp' ) {
                            e.preventDefault();
                            var $prev = $focus.length ? $focus.prev( '.np-team-option' ) : $opts.last();
                            $opts.removeClass( 'is-focused' );
                            $prev.addClass( 'is-focused' );
                        } else if ( e.key === 'Enter' ) {
                            e.preventDefault();
                            if ( $focus.length ) {
                                selectTeam( $focus.data( 'id' ), $focus.data( 'label' ), $focus.data( 'owner' ) );
                            }
                        } else if ( e.key === 'Escape' ) {
                            closeDropdown();
                        }
                    } );
                } );
                </script>
            </div>

            <!-- Title (informative — use the native WP title field above) -->
            <div class="np-field">
                <label><?php esc_html_e( 'Title', 'nexusplay' ); ?></label>
                <p style="font-size:13px; color:#50575e; margin:0; padding-top:4px;">
                    <?php esc_html_e( 'Use the WordPress title field above.', 'nexusplay' ); ?>
                </p>
            </div>

            <!-- Status -->
            <div class="np-field">
                <label for="np_status"><?php esc_html_e( 'Status', 'nexusplay' ); ?></label>
                <select id="np_status" name="np_status">
                    <?php foreach ( [
                        'scheduled' => __( 'Scheduled',  'nexusplay' ),
                        'ongoing'   => __( 'Live',        'nexusplay' ),
                        'finished'  => __( 'Finished',    'nexusplay' ),
                        'cancelled' => __( 'Cancelled',   'nexusplay' ),
                    ] as $val => $lbl ) : ?>
                        <option value="<?php echo esc_attr( $val ); ?>" <?php selected( $f['status'], $val ); ?>>
                            <?php echo esc_html( $lbl ); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <!-- Event date -->
            <div class="np-field">
                <label for="np_event_date"><?php esc_html_e( 'Event Date', 'nexusplay' ); ?></label>
                <input type="datetime-local" id="np_event_date" name="np_event_date"
                       value="<?php echo esc_attr( $f['event_date'] ); ?>" />
            </div>

            <!-- Location type -->
            <div class="np-field">
                <label for="np_location_type"><?php esc_html_e( 'Location Type', 'nexusplay' ); ?></label>
                <select id="np_location_type" name="np_location_type">
                    <option value="online" <?php selected( $f['location_type'], 'online' ); ?>><?php esc_html_e( 'Online', 'nexusplay' ); ?></option>
                    <option value="lan"    <?php selected( $f['location_type'], 'lan' ); ?>><?php esc_html_e( 'LAN',    'nexusplay' ); ?></option>
                </select>
            </div>

            <!-- Location details -->
            <div class="np-field">
                <label for="np_location_details"><?php esc_html_e( 'Location Details', 'nexusplay' ); ?></label>
                <input type="text" id="np_location_details" name="np_location_details"
                       value="<?php echo esc_attr( $f['location_details'] ); ?>"
                       placeholder="<?php esc_attr_e( 'Server, city…', 'nexusplay' ); ?>" />
            </div>

            <!-- Max participants -->
            <div class="np-field">
                <label for="np_max_participants"><?php esc_html_e( 'Max. Participants', 'nexusplay' ); ?></label>
                <input type="number" id="np_max_participants" name="np_max_participants" min="1"
                       value="<?php echo esc_attr( $f['max_participants'] ); ?>" />
            </div>

            <!-- Prize pool -->
            <div class="np-field">
                <label for="np_prize_pool"><?php esc_html_e( 'Prize Pool (€)', 'nexusplay' ); ?></label>
                <input type="number" id="np_prize_pool" name="np_prize_pool" min="0" step="0.01"
                       value="<?php echo esc_attr( $f['prize_pool'] ); ?>" />
            </div>

        </div>
        <?php
    }

    // -------------------------------------------------------------------------
    // Meta box: Participants (side)
    // -------------------------------------------------------------------------

    public function render_participants_box( WP_Post $post ): void {
        if ( ! $this->db->tables_exist() ) {
            echo '<p style="color:#d63638;">' . esc_html__( 'Laravel tables are not available in this database.', 'nexusplay' ) . '</p>';
            return;
        }

        $wp_post_id   = $post->ID;
        $total        = $this->db->count_participants( $wp_post_id );
        $approved     = $this->db->count_participants( $wp_post_id, 'approved' );
        $registered   = $this->db->count_participants( $wp_post_id, 'registered' );
        $rejected     = $this->db->count_participants( $wp_post_id, 'rejected' );
        $participants = $this->db->get_participants( $wp_post_id );
        ?>
        <style>
            .np-stat { display:flex; justify-content:space-between; font-size:13px; padding:3px 0; }
            .np-stat strong { color:#d63638; }
            .np-participant { display:flex; align-items:center; gap:8px; padding:5px 0; border-bottom:1px solid #f0f0f1; font-size:12px; }
            .np-participant:last-child { border-bottom:none; }
            .np-av { width:28px; height:28px; border-radius:50%; object-fit:cover; flex-shrink:0; }
            .np-av-ph { width:28px; height:28px; border-radius:50%; background:#d63638; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:11px; flex-shrink:0; }
            .np-badge { font-size:10px; font-weight:700; padding:2px 5px; border-radius:3px; text-transform:uppercase; }
            .np-badge-approved   { background:#d1e7dd; color:#0f5132; }
            .np-badge-registered { background:#fff3cd; color:#664d03; }
            .np-badge-rejected   { background:#f8d7da; color:#842029; }
        </style>

        <div class="np-stat"><span><?php esc_html_e( 'Total',    'nexusplay' ); ?></span><strong><?php echo (int) $total; ?></strong></div>
        <div class="np-stat"><span><?php esc_html_e( 'Approved', 'nexusplay' ); ?></span><strong><?php echo (int) $approved; ?></strong></div>
        <div class="np-stat"><span><?php esc_html_e( 'Pending',  'nexusplay' ); ?></span><strong><?php echo (int) $registered; ?></strong></div>
        <div class="np-stat"><span><?php esc_html_e( 'Rejected', 'nexusplay' ); ?></span><strong><?php echo (int) $rejected; ?></strong></div>
        <hr style="margin:8px 0;">

        <?php if ( empty( $participants ) ) : ?>
            <p style="font-size:12px; color:#646970;"><?php esc_html_e( 'No participants yet.', 'nexusplay' ); ?></p>
        <?php else : ?>
            <?php foreach ( $participants as $p ) :
                $initial    = strtoupper( mb_substr( $p->user_name ?? 'U', 0, 1 ) );
                $avatar_src = $this->resolve_asset( $p->user_avatar ?? '' );
            ?>
            <div class="np-participant">
                <?php if ( $avatar_src ) : ?>
                    <img class="np-av"
                         src="<?php echo esc_url( $avatar_src ); ?>"
                         alt="<?php echo esc_attr( $p->user_name ); ?>">
                <?php else : ?>
                    <div class="np-av-ph"><?php echo esc_html( $initial ); ?></div>
                <?php endif; ?>
                <div style="flex:1; min-width:0;">
                    <div style="font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                        <?php echo esc_html( $p->user_name ); ?>
                    </div>
                    <span class="np-badge np-badge-<?php echo esc_attr( $p->status ); ?>">
                        <?php echo esc_html( ucfirst( $p->status ) ); ?>
                    </span>
                </div>
            </div>
            <?php endforeach; ?>
        <?php endif; ?>
        <?php
    }

    // -------------------------------------------------------------------------
    // Save — nonce + capability checks
    // -------------------------------------------------------------------------

    public function save( int $post_id, WP_Post $post ): void {
        if ( empty( $_POST['nexusplay_tryout_nonce'] ) ||
             ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nexusplay_tryout_nonce'] ) ), 'nexusplay_save_tryout_' . $post_id )
        ) {
            return;
        }

        if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) { return; }
        if ( ! current_user_can( 'edit_post', $post_id ) )    { return; }

        $allowed_statuses = [ 'scheduled', 'ongoing', 'finished', 'cancelled' ];
        $allowed_types    = [ 'online', 'lan' ];

        $map = [
            'np_team_id'          => [ 'meta' => self::PREFIX . 'team_id',          'fn' => 'absint' ],
            'np_event_date'       => [ 'meta' => self::PREFIX . 'event_date',        'fn' => 'sanitize_text_field' ],
            'np_location_details' => [ 'meta' => self::PREFIX . 'location_details',  'fn' => 'sanitize_text_field' ],
            'np_max_participants' => [ 'meta' => self::PREFIX . 'max_participants',   'fn' => 'absint' ],
            'np_prize_pool'       => [ 'meta' => self::PREFIX . 'prize_pool',         'fn' => 'floatval' ],
        ];

        foreach ( $map as $field => $cfg ) {
            if ( isset( $_POST[ $field ] ) ) {
                $value = call_user_func( $cfg['fn'], wp_unslash( $_POST[ $field ] ) );
                update_post_meta( $post_id, $cfg['meta'], $value );
            }
        }

        if ( isset( $_POST['np_status'] ) ) {
            $status = sanitize_text_field( wp_unslash( $_POST['np_status'] ) );
            update_post_meta( $post_id, self::PREFIX . 'status', in_array( $status, $allowed_statuses, true ) ? $status : 'scheduled' );
        }

        if ( isset( $_POST['np_location_type'] ) ) {
            $lt = sanitize_text_field( wp_unslash( $_POST['np_location_type'] ) );
            update_post_meta( $post_id, self::PREFIX . 'location_type', in_array( $lt, $allowed_types, true ) ? $lt : 'online' );
        }
    }

    // -------------------------------------------------------------------------
    // Helper: read all meta fields for a post
    // -------------------------------------------------------------------------

    private function get_fields( int $post_id ): array {
        $p = self::PREFIX;
        return [
            'team_id'          => get_post_meta( $post_id, $p . 'team_id',          true ),
            'event_date'       => get_post_meta( $post_id, $p . 'event_date',        true ),
            'location_type'    => get_post_meta( $post_id, $p . 'location_type',     true ) ?: 'online',
            'location_details' => get_post_meta( $post_id, $p . 'location_details',  true ),
            'max_participants' => get_post_meta( $post_id, $p . 'max_participants',   true ),
            'prize_pool'       => get_post_meta( $post_id, $p . 'prize_pool',         true ),
            'status'           => get_post_meta( $post_id, $p . 'status',             true ) ?: 'scheduled',
        ];
    }

    // -------------------------------------------------------------------------
    // Enqueue admin assets on the tryout edit screen
    // -------------------------------------------------------------------------

    public function enqueue_admin_assets( string $hook ): void {
        $screen = get_current_screen();
        if ( ! $screen || $screen->post_type !== NexusPlay_CPT_Tryout::POST_TYPE ) {
            return;
        }
        if ( ! in_array( $hook, [ 'post.php', 'post-new.php' ], true ) ) {
            return;
        }
        // jQuery is already bundled in WP admin — nothing extra needed.
        // The team-search widget is pure HTML+CSS+jQuery, no Select2 dependency.
    }
}
