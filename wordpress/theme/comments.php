<?php
/**
 * Plantilla de comentarios.
 *
 * @package NexusPlay
 */

if ( post_password_required() ) {
    return;
}
?>

<div id="comments" class="comments-area">

    <?php if ( have_comments() ) : ?>

        <h2 class="comments-title">
            <?php
            printf(
                _n( '%s comentario', '%s comentarios', get_comments_number(), 'nexusplay' ),
                number_format_i18n( get_comments_number() )
            );
            ?>
        </h2>

        <ol class="comment-list">
            <?php
            wp_list_comments( [
                'style'      => 'ol',
                'short_ping' => true,
                'avatar_size'=> 40,
                'callback'   => 'nexusplay_comment_callback',
            ] );
            ?>
        </ol>

        <?php the_comments_pagination( [
            'prev_text' => '&larr;',
            'next_text' => '&rarr;',
            'class'     => 'pagination',
        ] ); ?>

    <?php endif; ?>

    <?php if ( ! comments_open() && get_comments_number() && post_type_supports( get_post_type(), 'comments' ) ) : ?>
        <p style="color:var(--color-text-muted); font-size:0.875rem; text-align:center; padding:1rem;">
            <?php _e( 'Los comentarios están cerrados.', 'nexusplay' ); ?>
        </p>
    <?php endif; ?>

    <?php
    comment_form( [
        'title_reply'         => __( 'Deja un comentario', 'nexusplay' ),
        'title_reply_to'      => __( 'Responder a %s', 'nexusplay' ),
        'cancel_reply_link'   => __( 'Cancelar', 'nexusplay' ),
        'label_submit'        => __( 'Enviar comentario', 'nexusplay' ),
        'class_submit'        => 'submit',
        'comment_notes_before'=> '',
        'comment_notes_after' => '',
    ] );
    ?>

</div>
<?php

/**
 * Callback personalizado para renderizar cada comentario con el estilo de NexusPlay.
 */
function nexusplay_comment_callback( WP_Comment $comment, array $args, int $depth ): void {
    $GLOBALS['comment'] = $comment;
    ?>
    <li id="comment-<?php comment_ID(); ?>" <?php comment_class( 'comment-item' ); ?>>
        <div class="comment-body">

            <div class="comment-author vcard">
                <?php echo get_avatar( $comment, 40, '', '', [ 'class' => 'avatar' ] ); ?>
                <span class="fn"><?php comment_author_link(); ?></span>
            </div>

            <div class="comment-meta">
                <a href="<?php echo esc_url( get_comment_link( $comment ) ); ?>" class="comment-metadata">
                    <time datetime="<?php comment_time( 'c' ); ?>">
                        <?php comment_date(); ?> <?php _e( 'a las', 'nexusplay' ); ?> <?php comment_time(); ?>
                    </time>
                </a>
                <?php if ( '0' === $comment->comment_approved ) : ?>
                    <em style="color:var(--color-text-dim); font-size:0.8rem;">
                        <?php _e( '(Pendiente de aprobación)', 'nexusplay' ); ?>
                    </em>
                <?php endif; ?>
            </div>

            <div class="comment-content">
                <?php comment_text(); ?>
            </div>

            <div class="reply">
                <?php
                comment_reply_link( array_merge( $args, [
                    'add_below' => 'comment',
                    'depth'     => $depth,
                    'max_depth' => $args['max_depth'],
                    'before'    => '',
                    'after'     => '',
                ] ) );
                ?>
            </div>

        </div>
    </li>
    <?php
}
