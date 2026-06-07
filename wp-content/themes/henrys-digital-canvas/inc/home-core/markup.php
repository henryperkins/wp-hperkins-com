<?php
/**
 * Home Core — Selected Work block markup (core/query + core/post-meta bindings).
 *
 * @package henrys-digital-canvas
 */

defined( 'ABSPATH' ) || exit;

/**
 * Return the Selected Work core/query fragment. Card fields bind to hdc_repo
 * post meta via the core/post-meta source; ordering is enforced by the
 * query_loop_block_query_vars filter (Task 11). The heading uses Post Title
 * (the write path stores display_name as the title).
 */
function hdc_selected_work_block_markup(): string {
	return <<<'HTML'
<!-- wp:query {"queryId":1,"query":{"perPage":3,"pages":0,"offset":0,"postType":"hdc_repo","order":"asc","orderBy":"menu_order","inherit":false},"namespace":"hdc/selected-work","align":"wide"} -->
<div class="wp-block-query alignwide">
<!-- wp:post-template -->
<!-- wp:group {"className":"is-style-hdc-repo-card is-style-ember-topography","layout":{"type":"constrained"}} -->
<div class="wp-block-group is-style-hdc-repo-card is-style-ember-topography">
<!-- wp:group {"className":"hdc-repo-card__meta","layout":{"type":"flex","flexWrap":"wrap"}} -->
<div class="wp-block-group hdc-repo-card__meta">
<!-- wp:paragraph {"className":"hdc-repo-card__lang","metadata":{"bindings":{"content":{"source":"core/post-meta","args":{"key":"language"}}}}} -->
<p class="hdc-repo-card__lang"></p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"className":"hdc-repo-card__badge","metadata":{"bindings":{"content":{"source":"core/post-meta","args":{"key":"badge_label"}}}}} -->
<p class="hdc-repo-card__badge"></p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"className":"hdc-repo-card__source","metadata":{"bindings":{"content":{"source":"core/post-meta","args":{"key":"source_badge"}}}}} -->
<p class="hdc-repo-card__source"></p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:post-title {"level":3,"isLink":false,"className":"hdc-home-page__card-title"} /-->
<!-- wp:paragraph {"className":"hdc-repo-card__summary hdc-home-page__card-copy hdc-home-page__card-copy--clamp","metadata":{"bindings":{"content":{"source":"core/post-meta","args":{"key":"summary"}}}}} -->
<p class="hdc-repo-card__summary hdc-home-page__card-copy hdc-home-page__card-copy--clamp"></p>
<!-- /wp:paragraph -->
<!-- wp:group {"className":"hdc-repo-card__footer","layout":{"type":"flex","justifyContent":"space-between"}} -->
<div class="wp-block-group hdc-repo-card__footer">
<!-- wp:paragraph {"className":"hdc-repo-card__updated","metadata":{"bindings":{"content":{"source":"core/post-meta","args":{"key":"updated_at"}}}}} -->
<p class="hdc-repo-card__updated"></p>
<!-- /wp:paragraph -->
<!-- wp:buttons -->
<div class="wp-block-buttons">
<!-- wp:button {"metadata":{"bindings":{"text":{"source":"core/post-meta","args":{"key":"cta_label"}},"url":{"source":"core/post-meta","args":{"key":"url"}}}}} -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="#">View</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->
<!-- /wp:post-template -->
<!-- wp:query-no-results -->
<!-- wp:paragraph -->
<p>Featured work is being refreshed for the homepage. Use View all work to browse the full project library.</p>
<!-- /wp:paragraph -->
<!-- /wp:query-no-results -->
</div>
<!-- /wp:query -->
HTML;
}
