<?php
/**
 * Home Core — homepage section patterns and the assembled Home pattern.
 *
 * @package henrys-digital-canvas
 */

defined( 'ABSPATH' ) || exit;

/**
 * Hero section — full-bleed inverse group + H1 + lede + two buttons.
 */
function hdc_home_hero_pattern_markup(): string {
	return <<<'HTML'
<!-- wp:group {"align":"full","className":"hdc-home-page__hero is-style-home-hero","layout":{"type":"constrained","contentSize":"64rem"}} -->
<div class="wp-block-group alignfull hdc-home-page__hero is-style-home-hero">
<!-- wp:heading {"level":1,"className":"hdc-home-page__hero-title text-page-title-inverse"} -->
<h1 class="wp-block-heading hdc-home-page__hero-title text-page-title-inverse">Retail floors. WordPress themes. Cloud platforms. Agentic AI.</h1>
<!-- /wp:heading -->
<!-- wp:paragraph {"className":"hdc-home-page__hero-description"} -->
<p class="hdc-home-page__hero-description">I&#8217;ve been learning to talk to machines since 2007 &#8212; now they&#8217;re starting to talk back.</p>
<!-- /wp:paragraph -->
<!-- wp:buttons {"className":"hdc-home-page__hero-actions"} -->
<div class="wp-block-buttons hdc-home-page__hero-actions">
<!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="/work/ai-prompt-pro">Explore Prompt Forge</a></div>
<!-- /wp:button -->
<!-- wp:button {"className":"is-style-inverse-glass"} -->
<div class="wp-block-button is-style-inverse-glass"><a class="wp-block-button__link wp-element-button" href="/contact">Work With Me</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->
</div>
<!-- /wp:group -->
HTML;
}

/**
 * Register each section pattern + the assembled Home pattern.
 */
function hdc_home_register_patterns(): void {
	if ( ! function_exists( 'register_block_pattern' ) ) {
		return;
	}

	register_block_pattern(
		'henrys-digital-canvas/home-hero',
		array(
			'title'      => __( 'Home Hero', 'henrys-digital-canvas' ),
			'categories' => array( 'featured' ),
			'content'    => hdc_home_hero_pattern_markup(),
		)
	);
}
add_action( 'init', 'hdc_home_register_patterns' );
