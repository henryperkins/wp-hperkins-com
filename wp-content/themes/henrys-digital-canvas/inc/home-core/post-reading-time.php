<?php
/**
 * Home Core — native post reading-time meta for Recent Writing.
 *
 * @package henrys-digital-canvas
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register REST-visible reading_time meta for native posts.
 *
 * @return void
 */
function hdc_home_core_register_reading_time_meta(): void {
	register_post_meta(
		'post',
		'reading_time',
		array(
			'type'              => 'string',
			'single'            => true,
			'show_in_rest'      => true,
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => '__return_true',
		)
	);
}
add_action( 'init', 'hdc_home_core_register_reading_time_meta' );

/**
 * Compute the reading time label for a post.
 *
 * @param int $post_id Post ID.
 * @return string
 */
function hdc_home_core_compute_post_reading_time( int $post_id ): string {
	return hdc_estimate_reading_time( (string) get_post_field( 'post_content', $post_id ) );
}

/**
 * Update reading_time meta when a native post is saved.
 *
 * @param int           $post_id Post ID.
 * @param WP_Post|null $post Post object.
 * @return void
 */
function hdc_home_core_update_post_reading_time( int $post_id, ?WP_Post $post = null ): void {
	if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
		return;
	}

	$post = $post instanceof WP_Post ? $post : get_post( $post_id );
	if ( ! $post instanceof WP_Post || 'post' !== $post->post_type ) {
		return;
	}

	update_post_meta( $post_id, 'reading_time', hdc_home_core_compute_post_reading_time( $post_id ) );
}
add_action( 'save_post_post', 'hdc_home_core_update_post_reading_time', 20, 2 );

/**
 * Backfill reading_time for existing native posts once.
 *
 * @return void
 */
function hdc_home_core_backfill_reading_time_meta(): void {
	if ( get_option( 'hdc_post_reading_time_backfilled' ) ) {
		return;
	}

	$post_ids = get_posts(
		array(
			'fields'         => 'ids',
			'numberposts'    => -1,
			'post_status'    => 'any',
			'post_type'      => 'post',
			'posts_per_page' => -1,
		)
	);

	foreach ( $post_ids as $post_id ) {
		hdc_home_core_update_post_reading_time( (int) $post_id );
	}

	update_option( 'hdc_post_reading_time_backfilled', time(), false );
}
add_action( 'init', 'hdc_home_core_backfill_reading_time_meta', 30 );
