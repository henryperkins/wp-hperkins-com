<?php
/**
 * Home Core — register the Selected Work block pattern.
 *
 * @package henrys-digital-canvas
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register the Selected Work pattern (insertable; reused by the binding test
 * and, in Phase 2, by the assembled "Home" pattern).
 */
function hdc_register_selected_work_pattern(): void {
	if ( ! function_exists( 'register_block_pattern' ) ) {
		return;
	}
	register_block_pattern(
		'henrys-digital-canvas/selected-work',
		array(
			'title'      => __( 'Selected Work (synced repos)', 'henrys-digital-canvas' ),
			'categories' => array( 'featured' ),
			'content'    => hdc_selected_work_block_markup(),
		)
	);
}
add_action( 'init', 'hdc_register_selected_work_pattern' );
