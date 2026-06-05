<?php
/**
 * Home Core — order the Selected Work query loop by menu_order (the synced rank).
 * Core's Query Loop UI exposes only date/title ordering, so we set it server-side.
 *
 * @package henrys-digital-canvas
 */

defined( 'ABSPATH' ) || exit;

/**
 * Force orderby=menu_order ASC for the Selected Work loop. Keyed on the query
 * namespace, with a robust post_type fallback (hdc_repo is queried nowhere else).
 *
 * @param array         $query The query vars built from the block.
 * @param WP_Block|null $block The Post Template block (carries query context).
 * @return array
 */
function hdc_selected_work_query_vars( $query, $block = null ) {
	$namespace = '';
	if ( $block instanceof WP_Block && isset( $block->context['query']['namespace'] ) ) {
		$namespace = (string) $block->context['query']['namespace'];
	}
	$is_selected_work = ( 'hdc/selected-work' === $namespace )
		|| ( isset( $query['post_type'] ) && 'hdc_repo' === $query['post_type'] );

	if ( $is_selected_work ) {
		$query['orderby'] = 'menu_order';
		$query['order']   = 'ASC';
	}
	return $query;
}
add_filter( 'query_loop_block_query_vars', 'hdc_selected_work_query_vars', 10, 2 );
