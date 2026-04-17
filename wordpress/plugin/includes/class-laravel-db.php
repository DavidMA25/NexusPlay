<?php
/**
 * Conexión con las tablas de Laravel (misma BD, sin prefijo wp_).
 * Solo operaciones de LECTURA.
 *
 * @package NexusPlay
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class NexusPlay_Laravel_DB {

    private wpdb $db;

    public function __construct() {
        global $wpdb;
        $this->db = $wpdb;
    }

    // -------------------------------------------------------------------------
    // TRYOUT PARTICIPANTS — referenciados por wp_post_id (ID del CPT)
    // -------------------------------------------------------------------------

    /**
     * Devuelve los participantes de un tryout con datos del usuario de Laravel.
     *
     * @param  int   $wp_post_id  ID del post del CPT Tryout en WordPress.
     * @return array<object>
     */
    public function get_participants( int $wp_post_id ): array {
        $sql = $this->db->prepare(
            "SELECT
                tp.id,
                tp.wp_post_id,
                tp.user_id,
                tp.status,
                u.name       AS user_name,
                u.email      AS user_email,
                u.nickname   AS user_nickname,
                u.avatar_url AS user_avatar,
                u.role       AS user_role
             FROM tryout_participants tp
             INNER JOIN users u ON u.id = tp.user_id
             WHERE tp.wp_post_id = %d
             ORDER BY tp.created_at ASC",
            $wp_post_id
        );

        return $this->db->get_results( $sql ) ?: [];
    }

    /**
     * Cuenta participantes de un tryout, opcionalmente filtrando por estado.
     *
     * @param  int    $wp_post_id
     * @param  string $status  '' = todos | 'registered' | 'approved' | 'rejected'
     * @return int
     */
    public function count_participants( int $wp_post_id, string $status = '' ): int {
        if ( $status ) {
            $sql = $this->db->prepare(
                "SELECT COUNT(*) FROM tryout_participants WHERE wp_post_id = %d AND status = %s",
                $wp_post_id,
                $status
            );
        } else {
            $sql = $this->db->prepare(
                "SELECT COUNT(*) FROM tryout_participants WHERE wp_post_id = %d",
                $wp_post_id
            );
        }

        return (int) $this->db->get_var( $sql );
    }

    // -------------------------------------------------------------------------
    // USERS
    // -------------------------------------------------------------------------

    public function get_user( int $user_id ): ?object {
        return $this->db->get_row( $this->db->prepare(
            "SELECT id, name, email, nickname, role, avatar_url, bio FROM users WHERE id = %d LIMIT 1",
            $user_id
        ) );
    }

    // -------------------------------------------------------------------------
    // TEAMS
    // -------------------------------------------------------------------------

    public function get_team( int $team_id ): ?object {
        return $this->db->get_row( $this->db->prepare(
            "SELECT t.*, u.name AS owner_name FROM teams t INNER JOIN users u ON u.id = t.owner_id WHERE t.id = %d LIMIT 1",
            $team_id
        ) );
    }

    /**
     * Searches teams by name (partial match) for the meta-box AJAX selector.
     * Returns up to 20 results with id, name, region and owner_name.
     *
     * @param  string $query  Partial search term.
     * @return array<object>
     */
    public function search_teams( string $query ): array {
        $like = '%' . $this->db->esc_like( $query ) . '%';
        return $this->db->get_results( $this->db->prepare(
            "SELECT t.id, t.name, t.region, u.name AS owner_name
             FROM teams t
             INNER JOIN users u ON u.id = t.owner_id
             WHERE t.name LIKE %s
             ORDER BY t.name ASC
             LIMIT 20",
            $like
        ) ) ?: [];
    }

    // -------------------------------------------------------------------------
    // Verificación de tablas
    // -------------------------------------------------------------------------

    public function tables_exist(): bool {
        foreach ( [ 'users', 'tryout_participants' ] as $table ) {
            if ( ! $this->db->get_var( $this->db->prepare( "SHOW TABLES LIKE %s", $table ) ) ) {
                return false;
            }
        }
        return true;
    }
}
