<?php
/**
 * Home Core — register the repo-card block style + enqueue card CSS.
 *
 * @package henrys-digital-canvas
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register the is-style-hdc-repo-card block style for core/group.
 */
function hdc_home_core_register_block_styles(): void {
	register_block_style(
		'core/group',
		array(
			'name'  => 'hdc-repo-card',
			'label' => __( 'HDC Repo Card', 'henrys-digital-canvas' ),
		)
	);
}
add_action( 'init', 'hdc_home_core_register_block_styles' );

/**
 * Enqueue the card CSS on the front end and in the editor.
 */
function hdc_home_core_enqueue_styles(): void {
	wp_enqueue_style(
		'hdc-home-core',
		get_stylesheet_directory_uri() . '/assets/css/home-core.css',
		array(),
		hdc_asset_version( '/assets/css/home-core.css' )
	);
}
add_action( 'wp_enqueue_scripts', 'hdc_home_core_enqueue_styles', 20 );
add_action( 'enqueue_block_assets', 'hdc_home_core_enqueue_styles', 20 );
