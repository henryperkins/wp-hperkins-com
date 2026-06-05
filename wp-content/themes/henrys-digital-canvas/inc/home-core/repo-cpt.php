<?php
/**
 * Home Core — hdc_repo CPT + meta registration + shared write/reconcile helpers.
 *
 * @package henrys-digital-canvas
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register the non-public, admin-visible hdc_repo CPT.
 */
function hdc_repo_register_post_type(): void {
	register_post_type(
		'hdc_repo',
		array(
			'labels'       => array(
				'name'          => __( 'Repos', 'henrys-digital-canvas' ),
				'singular_name' => __( 'Repo', 'henrys-digital-canvas' ),
			),
			'public'       => false,
			// core/query gates postType on is_post_type_viewable(): a non-builtin type
			// must be publicly_queryable for the Query Loop to query it. rewrite +
			// has_archive stay off, so no public URLs/archive are created (and
			// exclude_from_search stays true via public:false) — this only lets the
			// Selected Work Query Loop use the CPT.
			'publicly_queryable' => true,
			'show_ui'      => true,
			'show_in_menu' => true,
			'show_in_rest' => true,
			'menu_icon'    => 'dashicons-archive',
			'supports'     => array( 'title', 'custom-fields' ),
			'has_archive'  => false,
			'rewrite'      => false,
		)
	);
}
add_action( 'init', 'hdc_repo_register_post_type' );

/**
 * Register all hdc_repo meta with show_in_rest + sanitizers.
 */
function hdc_repo_register_meta(): void {
	$string_keys = array(
		'why_it_matters',
		'display_name',
		'origin',
		'access',
		'description',
		'language',
		'updated_at',
		'summary',
		'badge_label',
		'source_badge',
		'cta_label',
		'last_sync_source',
	);
	foreach ( $string_keys as $key ) {
		register_post_meta(
			'hdc_repo',
			$key,
			array(
				'single'            => true,
				'type'              => 'string',
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
			)
		);
	}

	register_post_meta(
		'hdc_repo',
		'url',
		array(
			'single'            => true,
			'type'              => 'string',
			'show_in_rest'      => true,
			'sanitize_callback' => 'esc_url_raw',
		)
	);

	$int_keys = array( 'github_id', 'featured_priority', 'stars', 'forks' );
	foreach ( $int_keys as $key ) {
		register_post_meta(
			'hdc_repo',
			$key,
			array(
				'single'            => true,
				'type'              => 'integer',
				'show_in_rest'      => true,
				'sanitize_callback' => 'absint',
			)
		);
	}

	register_post_meta(
		'hdc_repo',
		'featured',
		array(
			'single'            => true,
			'type'              => 'boolean',
			'show_in_rest'      => true,
			'sanitize_callback' => 'rest_sanitize_boolean',
		)
	);

	register_post_meta(
		'hdc_repo',
		'topics',
		array(
			'single'            => true,
			'type'              => 'array',
			'show_in_rest'      => array(
				'schema' => array(
					'type'  => 'array',
					'items' => array( 'type' => 'string' ),
				),
			),
			'sanitize_callback' => 'hdc_repo_sanitize_topics',
		)
	);
}
add_action( 'init', 'hdc_repo_register_meta' );

/**
 * Sanitize the topics array meta.
 *
 * @param mixed $value Raw value.
 * @return array<int,string>
 */
function hdc_repo_sanitize_topics( $value ): array {
	if ( ! is_array( $value ) ) {
		return array();
	}
	return array_values( array_map( 'sanitize_text_field', array_filter( $value, 'is_string' ) ) );
}

/**
 * Find an hdc_repo post id by immutable github_id (0 = not found).
 */
function hdc_repo_find_by_github_id( int $github_id ): int {
	if ( $github_id <= 0 ) {
		return 0;
	}
	$found = get_posts(
		array(
			'post_type'        => 'hdc_repo',
			'post_status'      => 'any',
			'numberposts'      => 1,
			'fields'           => 'ids',
			'meta_key'         => 'github_id',
			'meta_value'       => $github_id,
			'suppress_filters' => false,
		)
	);
	return $found ? (int) $found[0] : 0;
}

/**
 * Fallback lookup by repo name (slug). Used until github_id is present.
 */
function hdc_repo_find_by_name( string $name ): int {
	$name = sanitize_title( $name );
	if ( '' === $name ) {
		return 0;
	}
	$page = get_page_by_path( $name, OBJECT, 'hdc_repo' );
	return $page ? (int) $page->ID : 0;
}

/**
 * Write derived meta (summary/badge_label/source_badge/cta_label) for a repo,
 * plus title/slug. Shared by seed + sync.
 *
 * @param int   $post_id Target post.
 * @param array $repo    Merged repo record (curated + live).
 * @param bool  $is_live Whether the source was a live sync (affects source_badge).
 */
function hdc_repo_write_derived( int $post_id, array $repo, bool $is_live ): void {
	$display = hdc_repo_display_name( $repo );

	wp_update_post(
		array(
			'ID'         => $post_id,
			'post_title' => $display,
			'post_name'  => sanitize_title( (string) ( $repo['name'] ?? '' ) ),
		)
	);

	update_post_meta( $post_id, 'display_name', $display );
	update_post_meta( $post_id, 'summary', hdc_repo_summary( $repo ) );
	update_post_meta( $post_id, 'badge_label', hdc_repo_badge_label( $repo ) );
	update_post_meta( $post_id, 'source_badge', hdc_repo_source_badge( $repo, $is_live ) );
	update_post_meta( $post_id, 'cta_label', hdc_repo_cta_label( $repo ) );
}

/**
 * Re-entrancy guard so the bulk wp_update_post() calls in reconcile()/sync()/seed()
 * do not re-trigger the save_post_hdc_repo handler (which would recurse into
 * reconcile() forever). Plain begin/end (no try/finally): a leaked counter only
 * suppresses further hdc_repo saves within the same request — harmless, and it
 * resets on the next request.
 */
function hdc_repo_suppress_begin(): void {
	$GLOBALS['hdc_repo_suppress_save'] = ( $GLOBALS['hdc_repo_suppress_save'] ?? 0 ) + 1;
}
function hdc_repo_suppress_end(): void {
	if ( ! empty( $GLOBALS['hdc_repo_suppress_save'] ) ) {
		$GLOBALS['hdc_repo_suppress_save']--;
	}
}
function hdc_repo_is_suppressing(): bool {
	return ! empty( $GLOBALS['hdc_repo_suppress_save'] );
}

/**
 * Recompute menu_order rank + post_status for every hdc_repo from curated
 * featured/featured_priority. Featured -> publish + rank 0..N; else draft.
 * Shared by cron, seed, and the save_post hook. Suppresses save_post recursion.
 */
function hdc_repo_reconcile(): void {
	hdc_repo_suppress_begin();
	$ids = get_posts(
		array(
			'post_type'        => 'hdc_repo',
			'post_status'      => 'any',
			'numberposts'      => -1,
			'fields'           => 'ids',
			'suppress_filters' => false,
		)
	);

	$rows = array();
	foreach ( $ids as $id ) {
		$id     = (int) $id;
		$rows[] = array(
			'id'                => $id,
			'name'              => (string) get_post_field( 'post_name', $id ),
			'featured'          => (bool) get_post_meta( $id, 'featured', true ),
			'featured_priority' => get_post_meta( $id, 'featured_priority', true ),
			'updated_at'        => (string) get_post_meta( $id, 'updated_at', true ),
		);
	}

	$featured_ranked = hdc_repo_rank_featured( $rows );
	$featured_ids    = array();
	foreach ( array_values( $featured_ranked ) as $rank => $row ) {
		$id                 = (int) $row['id'];
		$featured_ids[ $id ] = true;
		wp_update_post(
			array(
				'ID'          => $id,
				'menu_order'  => $rank,
				'post_status' => 'publish',
			)
		);
	}

	foreach ( $rows as $row ) {
		$id = (int) $row['id'];
		if ( ! isset( $featured_ids[ $id ] ) ) {
			wp_update_post(
				array(
					'ID'          => $id,
					'post_status' => 'draft',
				)
			);
		}
	}

	hdc_repo_suppress_end();
}
