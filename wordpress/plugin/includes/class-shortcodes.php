<?php
/**
 * Shortcodes del plugin NexusPlay.
 *
 * [nexusplay_participants id="42"]  — lista de participantes de un tryout.
 * [nexusplay_stats id="42"]         — estadísticas de inscripción.
 *
 * @package NexusPlay
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class NexusPlay_Shortcodes {

    private NexusPlay_Laravel_DB $db;

    public function __construct( NexusPlay_Laravel_DB $db ) {
        $this->db = $db;
    }

    public function register(): void {
        add_shortcode( 'nexusplay_participants', [ $this, 'participants' ] );
        add_shortcode( 'nexusplay_stats',        [ $this, 'stats'        ] );
    }

    // -------------------------------------------------------------------------
    // [nexusplay_participants id="<wp_post_id>"]
    // -------------------------------------------------------------------------

    public function participants( array $atts ): string {
        $atts       = shortcode_atts( [ 'id' => 0 ], $atts, 'nexusplay_participants' );
        $wp_post_id = absint( $atts['id'] );

        if ( ! $wp_post_id ) {
            return '<p class="np-error">' . esc_html__( 'Specify the Tryout ID.', 'nexusplay' ) . '</p>';
        }

        $participants = $this->db->get_participants( $wp_post_id );

        ob_start(); ?>
        <div class="npt-participants-list">
            <?php if ( empty( $participants ) ) : ?>
                <p><?php esc_html_e( 'No participants yet.', 'nexusplay' ); ?></p>
            <?php else : ?>
                <ul class="npt-participants">
                    <?php foreach ( $participants as $p ) :
                        $initial = strtoupper( mb_substr( $p->user_name ?? 'U', 0, 1 ) );
                    ?>
                    <li class="npt-participant npt-status-<?php echo esc_attr( $p->status ); ?>">
                        <?php if ( ! empty( $p->user_avatar ) ) : ?>
                            <img class="npt-avatar"
                                 src="<?php echo esc_url( $p->user_avatar ); ?>"
                                 alt="<?php echo esc_attr( $p->user_name ); ?>">
                        <?php else : ?>
                            <span class="npt-avatar-placeholder"><?php echo esc_html( $initial ); ?></span>
                        <?php endif; ?>
                        <span class="npt-name"><?php echo esc_html( $p->user_name ); ?></span>
                        <span class="npt-badge npt-badge-<?php echo esc_attr( $p->status ); ?>">
                            <?php echo esc_html( $p->status ); ?>
                        </span>
                    </li>
                    <?php endforeach; ?>
                </ul>
            <?php endif; ?>
        </div>
        <?php
        return ob_get_clean();
    }

    // -------------------------------------------------------------------------
    // [nexusplay_stats id="<wp_post_id>"]
    // -------------------------------------------------------------------------

    public function stats( array $atts ): string {
        $atts       = shortcode_atts( [ 'id' => 0 ], $atts, 'nexusplay_stats' );
        $wp_post_id = absint( $atts['id'] );

        if ( ! $wp_post_id ) {
            return '';
        }

        $max_participants = (int) get_post_meta( $wp_post_id, NexusPlay_Meta_Boxes::PREFIX . 'max_participants', true );
        $total            = $this->db->count_participants( $wp_post_id );
        $approved         = $this->db->count_participants( $wp_post_id, 'approved' );
        $slots            = $max_participants ? max( 0, $max_participants - $approved ) : '∞';

        ob_start(); ?>
        <div class="npt-stats">
            <div class="npt-stat-item">
                <span class="npt-stat-value"><?php echo (int) $total; ?></span>
                <span class="npt-stat-label"><?php esc_html_e( 'Registered', 'nexusplay' ); ?></span>
            </div>
            <div class="npt-stat-item">
                <span class="npt-stat-value"><?php echo (int) $approved; ?></span>
                <span class="npt-stat-label"><?php esc_html_e( 'Approved', 'nexusplay' ); ?></span>
            </div>
            <div class="npt-stat-item">
                <span class="npt-stat-value"><?php echo esc_html( $slots ); ?></span>
                <span class="npt-stat-label"><?php esc_html_e( 'Available Slots', 'nexusplay' ); ?></span>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}
