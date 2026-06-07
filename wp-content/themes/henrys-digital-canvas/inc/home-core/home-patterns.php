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
 * Resume Snapshot section — static positioning and best-fit cards.
 */
function hdc_home_resume_pattern_markup(): string {
	return <<<'HTML'
<!-- wp:group {"className":"hdc-home-page__section hdc-home-page__section--resume","layout":{"type":"constrained"}} -->
<div class="wp-block-group hdc-home-page__section hdc-home-page__section--resume" id="resume-snapshot">
<!-- wp:group {"className":"hdc-home-page__section-header","layout":{"type":"flex","justifyContent":"space-between","flexWrap":"wrap"}} -->
<div class="wp-block-group hdc-home-page__section-header">
<!-- wp:heading {"className":"hdc-home-page__section-title"} -->
<h2 class="wp-block-heading hdc-home-page__section-title">Resume Snapshot</h2>
<!-- /wp:heading -->
<!-- wp:paragraph {"className":"hdc-home-page__section-link"} -->
<p class="hdc-home-page__section-link"><a href="/resume">Interactive resume</a></p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:group {"className":"hdc-home-page__resume-grid","layout":{"type":"default"}} -->
<div class="wp-block-group hdc-home-page__resume-grid">
<!-- wp:group {"className":"hdc-home-page__resume-card is-style-ember-topography","layout":{"type":"constrained"}} -->
<div class="wp-block-group hdc-home-page__resume-card is-style-ember-topography">
<!-- wp:paragraph {"className":"hdc-home-page__eyebrow hdc-home-page__eyebrow--body"} -->
<p class="hdc-home-page__eyebrow hdc-home-page__eyebrow--body">Positioning</p>
<!-- /wp:paragraph -->
<!-- wp:heading {"level":3,"className":"hdc-home-page__card-title"} -->
<h3 class="wp-block-heading hdc-home-page__card-title">Solutions Engineer | AI Workflows, WordPress, and API Integrations</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"className":"hdc-home-page__card-copy"} -->
<p class="hdc-home-page__card-copy">Customer-facing technical delivery across implementation, support, documentation, and enablement.</p>
<!-- /wp:paragraph -->
<!-- wp:group {"className":"hdc-home-page__resume-snapshot","layout":{"type":"default"}} -->
<div class="wp-block-group hdc-home-page__resume-snapshot">
<!-- wp:paragraph {"className":"hdc-home-page__resume-snapshot-label"} -->
<p class="hdc-home-page__resume-snapshot-label">Public proof of work</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"className":"hdc-home-page__resume-snapshot-items"} -->
<p class="hdc-home-page__resume-snapshot-items">Prompt Forge <span class="hdc-home-page__inline-dot">&bull;</span> HPerkins.com <span class="hdc-home-page__inline-dot">&bull;</span> wp-hperkins-com</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:group {"className":"hdc-home-page__badges","layout":{"type":"default"}} -->
<div class="wp-block-group hdc-home-page__badges"><span class="hdc-home-page__badge">Solutions Engineer</span><span class="hdc-home-page__badge">Implementation Engineer</span><span class="hdc-home-page__badge">Developer Enablement</span></div>
<!-- /wp:group -->
<!-- wp:paragraph {"className":"hdc-home-page__inline-links"} -->
<p class="hdc-home-page__inline-links"><a class="hdc-home-page__card-cta" href="/resume">Interactive resume&nbsp;&rarr;</a><a class="hdc-home-page__card-cta" href="/resume/ats">ATS / recruiter view&nbsp;&rarr;</a></p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:group {"className":"hdc-home-page__resume-card hdc-home-page__resume-card--accent is-style-ember-strong","layout":{"type":"constrained"}} -->
<div class="wp-block-group hdc-home-page__resume-card hdc-home-page__resume-card--accent is-style-ember-strong">
<!-- wp:paragraph {"className":"hdc-home-page__eyebrow hdc-home-page__eyebrow--body"} -->
<p class="hdc-home-page__eyebrow hdc-home-page__eyebrow--body">Best fit</p>
<!-- /wp:paragraph -->
<!-- wp:heading {"level":3,"className":"hdc-home-page__card-title"} -->
<h3 class="wp-block-heading hdc-home-page__card-title">Where I contribute fastest</h3>
<!-- /wp:heading -->
<!-- wp:list {"className":"hdc-home-page__list"} -->
<ul class="wp-block-list hdc-home-page__list"><!-- wp:list-item --><li>Customer-facing implementation, onboarding, and support workflows</li><!-- /wp:list-item --><!-- wp:list-item --><li>API integrations, documentation, and escalation triage</li><!-- /wp:list-item --><!-- wp:list-item --><li>AI-assisted workflow delivery grounded in WordPress and durable web systems</li><!-- /wp:list-item --></ul>
<!-- /wp:list -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->
HTML;
}

/**
 * Contact CTA section — ember-veil card with copy and action buttons.
 */
function hdc_home_contact_pattern_markup(): string {
	return <<<'HTML'
<!-- wp:group {"className":"hdc-home-page__section","layout":{"type":"constrained"}} -->
<div class="wp-block-group hdc-home-page__section" id="contact-cta">
<!-- wp:group {"className":"hdc-home-page__cta-card is-style-ember-veil","layout":{"type":"constrained"}} -->
<div class="wp-block-group hdc-home-page__cta-card is-style-ember-veil">
<!-- wp:group {"className":"hdc-home-page__cta-layout","layout":{"type":"default"}} -->
<div class="wp-block-group hdc-home-page__cta-layout">
<!-- wp:group {"className":"hdc-home-page__cta-body","layout":{"type":"constrained"}} -->
<div class="wp-block-group hdc-home-page__cta-body">
<!-- wp:paragraph {"className":"hdc-home-page__eyebrow hdc-home-page__eyebrow--body"} -->
<p class="hdc-home-page__eyebrow hdc-home-page__eyebrow--body">Prompt systems. React apps. WordPress fixes.</p>
<!-- /wp:paragraph -->
<!-- wp:heading {"className":"hdc-home-page__section-title"} -->
<h2 class="wp-block-heading hdc-home-page__section-title">Bring me in when the fix lives between the help desk and the codebase.</h2>
<!-- /wp:heading -->
<!-- wp:paragraph {"className":"hdc-home-page__copy"} -->
<p class="hdc-home-page__copy">I help teams turn support tickets into shipped fixes &#8212; API integrations, documentation, AI-assisted triage &#8212; so the thing that was breaking at 6 AM isn&#8217;t breaking at 6 AM tomorrow.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:buttons {"className":"hdc-home-page__cta-actions"} -->
<div class="wp-block-buttons hdc-home-page__cta-actions">
<!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="/contact">Work with me</a></div>
<!-- /wp:button -->
<!-- wp:button {"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="/resume">View resume</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->
HTML;
}

/**
 * Recent Writing section — native posts Query Loop + reading_time binding.
 */
function hdc_home_recent_writing_pattern_markup(): string {
	return <<<'HTML'
<!-- wp:group {"className":"hdc-home-page__section hdc-home-page__section--writing","layout":{"type":"constrained"}} -->
<div class="wp-block-group hdc-home-page__section hdc-home-page__section--writing" id="recent-writing">
<!-- wp:group {"className":"hdc-home-page__section-header","layout":{"type":"flex","justifyContent":"space-between","flexWrap":"wrap"}} -->
<div class="wp-block-group hdc-home-page__section-header">
<!-- wp:heading {"className":"hdc-home-page__section-title"} -->
<h2 class="wp-block-heading hdc-home-page__section-title">Recent Writing</h2>
<!-- /wp:heading -->
<!-- wp:paragraph {"className":"hdc-home-page__section-link"} -->
<p class="hdc-home-page__section-link"><a href="/blog">All posts</a></p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:query {"queryId":2,"namespace":"hdc/recent-writing","query":{"perPage":3,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","inherit":false},"align":"wide","className":"hdc-home-page__recent-writing-query"} -->
<div class="wp-block-query alignwide hdc-home-page__recent-writing-query">
<!-- wp:post-template {"className":"hdc-home-page__post-stack"} -->
<!-- wp:group {"className":"is-style-hdc-article-row","layout":{"type":"default"}} -->
<div class="wp-block-group is-style-hdc-article-row">
<!-- wp:post-featured-image {"isLink":true,"width":"112px","height":"112px","className":"hdc-home-page__post-thumb"} /-->
<!-- wp:group {"className":"hdc-home-page__post-body","layout":{"type":"constrained"}} -->
<div class="wp-block-group hdc-home-page__post-body">
<!-- wp:post-title {"level":3,"isLink":true,"className":"hdc-home-page__card-title hdc-home-page__card-title--row"} /-->
<!-- wp:post-excerpt {"moreText":"","showMoreOnNewLine":false,"excerptLength":24,"className":"hdc-home-page__card-copy hdc-home-page__card-copy--clamp"} /-->
<!-- wp:group {"className":"hdc-home-page__post-meta","layout":{"type":"flex","flexWrap":"wrap"}} -->
<div class="wp-block-group hdc-home-page__post-meta">
<!-- wp:post-date {"format":"M j, Y"} /-->
<!-- wp:paragraph {"className":"hdc-home-page__reading-time","metadata":{"bindings":{"content":{"source":"core/post-meta","args":{"key":"reading_time"}}}}} -->
<p class="hdc-home-page__reading-time"></p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->
<!-- /wp:post-template -->
<!-- wp:query-no-results -->
<!-- wp:group {"className":"hdc-home-page__empty-state is-style-ember-strong","layout":{"type":"constrained"}} -->
<div class="wp-block-group hdc-home-page__empty-state is-style-ember-strong">
<!-- wp:heading {"level":3,"className":"hdc-home-page__empty-title"} -->
<h3 class="wp-block-heading hdc-home-page__empty-title">Could not load recent writing</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"className":"hdc-home-page__empty"} -->
<p class="hdc-home-page__empty">The homepage writing feed is temporarily unavailable. Try again or visit the full blog index.</p>
<!-- /wp:paragraph -->
<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons">
<!-- wp:button {"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="/">Try again</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->
</div>
<!-- /wp:group -->
<!-- /wp:query-no-results -->
</div>
<!-- /wp:query -->
</div>
<!-- /wp:group -->
HTML;
}

/**
 * Full homepage markup in canonical order.
 */
function hdc_home_pattern_markup(): string {
	$selected_work = function_exists( 'hdc_selected_work_block_markup' ) ? hdc_selected_work_block_markup() : '';

	$selected_work_section = <<<HTML
<!-- wp:group {"className":"hdc-home-page__section hdc-home-page__section--work","layout":{"type":"constrained"}} -->
<div class="wp-block-group hdc-home-page__section hdc-home-page__section--work" id="selected-work">
<!-- wp:group {"className":"hdc-home-page__section-header","layout":{"type":"flex","justifyContent":"space-between","flexWrap":"wrap"}} -->
<div class="wp-block-group hdc-home-page__section-header">
<!-- wp:heading {"className":"hdc-home-page__section-title"} -->
<h2 class="wp-block-heading hdc-home-page__section-title">Selected Work</h2>
<!-- /wp:heading -->
<!-- wp:paragraph {"className":"hdc-home-page__section-link"} -->
<p class="hdc-home-page__section-link"><a href="/work">View all work</a></p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
{$selected_work}
</div>
<!-- /wp:group -->
HTML;

	$recent_writing = hdc_home_recent_writing_pattern_markup();

	return implode(
		"\n\n",
		array(
			hdc_home_hero_pattern_markup(),
			$selected_work_section,
			hdc_home_throughline_pattern_markup(),
			hdc_home_resume_pattern_markup(),
			$recent_writing,
			hdc_home_contact_pattern_markup(),
		)
	);
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

	register_block_pattern(
		'henrys-digital-canvas/home-resume',
		array(
			'title'      => __( 'Home Resume Snapshot', 'henrys-digital-canvas' ),
			'categories' => array( 'featured' ),
			'content'    => hdc_home_resume_pattern_markup(),
		)
	);

	register_block_pattern(
		'henrys-digital-canvas/home-contact',
		array(
			'title'      => __( 'Home Contact CTA', 'henrys-digital-canvas' ),
			'categories' => array( 'featured' ),
			'content'    => hdc_home_contact_pattern_markup(),
		)
	);

	register_block_pattern(
		'henrys-digital-canvas/home-recent-writing',
		array(
			'title'      => __( 'Home Recent Writing', 'henrys-digital-canvas' ),
			'categories' => array( 'featured' ),
			'content'    => hdc_home_recent_writing_pattern_markup(),
		)
	);

	register_block_pattern(
		'henrys-digital-canvas/home',
		array(
			'title'      => __( 'Home (full page)', 'henrys-digital-canvas' ),
			'categories' => array( 'featured' ),
			'blockTypes' => array( 'core/post-content' ),
			'content'    => hdc_home_pattern_markup(),
		)
	);
}
add_action( 'init', 'hdc_home_register_patterns' );
