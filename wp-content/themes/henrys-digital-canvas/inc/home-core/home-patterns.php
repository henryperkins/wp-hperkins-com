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
 * Throughline section — narrative paper + quote surface.
 */
function hdc_home_throughline_pattern_markup(): string {
	return <<<'HTML'
<!-- wp:group {"className":"hdc-home-page__section hdc-home-page__section--throughline","layout":{"type":"constrained"}} -->
<div class="wp-block-group hdc-home-page__section hdc-home-page__section--throughline" id="throughline">
<!-- wp:heading {"className":"hdc-home-page__section-title hdc-home-page__section-title--intro"} -->
<h2 class="wp-block-heading hdc-home-page__section-title hdc-home-page__section-title--intro">From the floor to the frontier.</h2>
<!-- /wp:heading -->
<!-- wp:columns {"className":"hdc-home-page__throughline-grid"} -->
<div class="wp-block-columns hdc-home-page__throughline-grid">
<!-- wp:column {"width":"100%"} -->
<div class="wp-block-column" style="flex-basis:100%">
<!-- wp:group {"className":"hdc-home-page__throughline-story hdc-home-page__throughline-narrative is-style-learning-paper","layout":{"type":"constrained"}} -->
<div class="wp-block-group hdc-home-page__throughline-story hdc-home-page__throughline-narrative is-style-learning-paper">
<!-- wp:paragraph {"className":"hdc-home-page__throughline-paragraph"} -->
<p class="hdc-home-page__throughline-paragraph">In 2007, I was coaching high school students in Chicago on how to tell a story clearly. By 2009, I was troubleshooting hardware on a retail floor at Micro Center. By 2012, I was managing a developer community at PageLines and supporting WordPress.com users at Automattic &#8212; the company behind WordPress itself.</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"className":"hdc-home-page__throughline-paragraph"} -->
<p class="hdc-home-page__throughline-paragraph">Then I ran coffee operations. Starbucks, Sodexo &#8212; high-volume, high-stakes, no-margin-for-error environments where the system either works at 6 AM or it doesn&#8217;t. I learned more about process, escalation, and team coaching on those shifts than in any technical role I&#8217;ve ever held.</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"className":"hdc-home-page__throughline-paragraph"} -->
<p class="hdc-home-page__throughline-paragraph">Now I build AI agents and intelligent workflows. I design prompt systems. I ship React apps on Cloudflare. And I consult for teams that need someone who can scope the project, write the code, document the process, and explain it to a stakeholder who doesn&#8217;t care about the stack &#8212; they just need it to work.</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"className":"hdc-home-page__throughline-paragraph"} -->
<p class="hdc-home-page__throughline-paragraph">The tools have changed five times over. The instinct hasn&#8217;t.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:column -->
<!-- wp:column {"width":"20rem"} -->
<div class="wp-block-column" style="flex-basis:20rem">
<!-- wp:group {"className":"hdc-home-page__throughline-quote-card is-style-ember-topography","layout":{"type":"constrained"}} -->
<div class="wp-block-group hdc-home-page__throughline-quote-card is-style-ember-topography">
<!-- wp:paragraph {"className":"hdc-home-page__eyebrow"} -->
<p class="hdc-home-page__eyebrow">A former colleague</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"className":"hdc-home-page__throughline-quote-text"} -->
<p class="hdc-home-page__throughline-quote-text">&#8220;He&#8217;s always there when his community needs him.&#8221;</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"className":"hdc-home-page__throughline-quote-footer"} -->
<p class="hdc-home-page__throughline-quote-footer">PageLines recommendation</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns -->
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

	register_block_pattern(
		'henrys-digital-canvas/home-throughline',
		array(
			'title'      => __( 'Home Throughline', 'henrys-digital-canvas' ),
			'categories' => array( 'featured' ),
			'content'    => hdc_home_throughline_pattern_markup(),
		)
	);
}
add_action( 'init', 'hdc_home_register_patterns' );
