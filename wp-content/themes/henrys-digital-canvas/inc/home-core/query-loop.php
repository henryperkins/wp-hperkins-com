<?php
/**
 * Home Core — order the Selected Work query loop by menu_order (the synced rank).
 * Core's Query Loop UI exposes only date/title ordering, so we set it server-side.
 *
 * @package henrys-digital-canvas
 */

defined( 'ABSPATH' ) || exit;

/**
 * Force orderby=menu_order ASC for the Selected Work loop.
 *
 * Keyed on post_type: `hdc_repo` is queried only by this loop, so it uniquely
 * identifies it. (core/query's `namespace` attribute is NOT exposed through the
 * Post Template's block context — providesContext is query/queryId/displayLayout/
 * enhancedPagination only — so it cannot be matched here; post_type is the
 * reliable signal.)
 *
 * @param array         $query The query vars built from the block.
 * @param WP_Block|null $block The Post Template block (unused; kept for the filter signature).
 * @return array
 */
function hdc_selected_work_query_vars( $query, $block = null ) {
	if ( isset( $query['post_type'] ) && 'hdc_repo' === $query['post_type'] ) {
		$query['orderby'] = 'menu_order';
		$query['order']   = 'ASC';
	}
	return $query;
}
add_filter( 'query_loop_block_query_vars', 'hdc_selected_work_query_vars', 10, 2 );
