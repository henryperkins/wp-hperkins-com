<?php
/**
 * Home Core — surface/hero/quote block styles for homepage patterns.
 *
 * @package henrys-digital-canvas
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register the is-style-* block styles the homepage patterns use.
 */
function hdc_home_register_pattern_block_styles(): void {
	$group_styles = array(
		'home-hero'        => __( 'Home Hero', 'henrys-digital-canvas' ),
		'learning-paper'   => __( 'Learning Paper', 'henrys-digital-canvas' ),
		'ember-veil'       => __( 'Ember Veil', 'henrys-digital-canvas' ),
		'ember-topography' => __( 'Ember Topography', 'henrys-digital-canvas' ),
		'hdc-quote-card'   => __( 'HDC Quote Card', 'henrys-digital-canvas' ),
		'hdc-article-row'  => __( 'HDC Article Row', 'henrys-digital-canvas' ),
		'ember-strong'     => __( 'Ember Strong', 'henrys-digital-canvas' ),
	);

	foreach ( $group_styles as $name => $label ) {
		register_block_style(
			'core/group',
			array(
				'name'  => $name,
				'label' => $label,
			)
		);
	}

	register_block_style(
		'core/button',
		array(
			'name'  => 'inverse-glass',
			'label' => __( 'Inverse Glass', 'henrys-digital-canvas' ),
		)
	);
}
add_action( 'init', 'hdc_home_register_pattern_block_styles' );
