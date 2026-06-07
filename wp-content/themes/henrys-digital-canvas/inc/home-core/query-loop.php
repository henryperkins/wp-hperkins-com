<?php
/**
 * Home Core — order the Selected Work query loop by menu_order (the synced rank).
 * Core's Query Loop UI exposes only date/title ordering, so we set it server-side.
 *
 * @package henrys-digital-canvas
 */

defined( 'ABSPATH' ) || exit;

const HDC_HOME_RECENT_WRITING_QUERY_NAMESPACE = 'hdc/recent-writing';

/**
 * Return the Query Loop namespace for the block currently being filtered.
 *
 * @param WP_Block|null $block The Query Loop block instance.
 * @return string
 */
function hdc_query_loop_block_namespace( $block ): string {
	if ( ! is_object( $block ) ) {
		return '';
	}

	if ( isset( $block->parsed_block['attrs']['namespace'] ) && is_string( $block->parsed_block['attrs']['namespace'] ) ) {
		return $block->parsed_block['attrs']['namespace'];
	}

	if ( isset( $block->attributes['namespace'] ) && is_string( $block->attributes['namespace'] ) ) {
		return $block->attributes['namespace'];
	}

	return '';
}

/**
 * Force orderby=menu_order ASC for the Selected Work loop and keep the
 * homepage Recent Writing loop from surfacing the default placeholder post.
 *
 * The `hdc_repo` post type is used only by the Selected Work loop. Native
 * posts are broader, so the placeholder exclusion is scoped to the named
 * homepage Query Loop instead of every `post` Query Loop on the site.
 *
 * @param array         $query The query vars built from the block.
 * @param WP_Block|null $block The Query Loop block instance.
 * @return array
 */
function hdc_selected_work_query_vars( $query, $block = null ) {
	if ( isset( $query['post_type'] ) && 'hdc_repo' === $query['post_type'] ) {
		$query['orderby'] = 'menu_order';
		$query['order']   = 'ASC';
	}

	if (
		isset( $query['post_type'] ) &&
		'post' === $query['post_type'] &&
		HDC_HOME_RECENT_WRITING_QUERY_NAMESPACE === hdc_query_loop_block_namespace( $block )
	) {
		static $placeholder_id = null;
		if ( null === $placeholder_id ) {
			$placeholder    = get_page_by_path( 'hello-world', OBJECT, 'post' );
			$placeholder_id = $placeholder instanceof WP_Post ? (int) $placeholder->ID : 0;
		}

		if ( $placeholder_id > 0 ) {
			$query['post__not_in'] = array_values(
				array_unique(
					array_merge(
						isset( $query['post__not_in'] ) && is_array( $query['post__not_in'] ) ? $query['post__not_in'] : array(),
						array( $placeholder_id )
					)
				)
			);
		}
	}

	return $query;
}
add_filter( 'query_loop_block_query_vars', 'hdc_selected_work_query_vars', 10, 2 );
