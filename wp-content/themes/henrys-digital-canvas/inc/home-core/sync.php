<?php
/**
 * Home Core — hourly WP-Cron sync from hperkins.com + reconcile-on-save + WP-CLI.
 *
 * @package henrys-digital-canvas
 */

defined( 'ABSPATH' ) || exit;

const HDC_SYNC_EVENT = 'hdc_sync_repos';

/**
 * Schedule the hourly sync event if missing.
 */
function hdc_repo_schedule_sync(): void {
	if ( ! wp_next_scheduled( HDC_SYNC_EVENT ) ) {
		wp_schedule_event( time() + 60, 'hourly', HDC_SYNC_EVENT );
	}
}
add_action( 'init', 'hdc_repo_schedule_sync' );
add_action( HDC_SYNC_EVENT, 'hdc_github_sync' );

/**
 * Clear the event when the theme is switched away.
 */
function hdc_repo_clear_sync(): void {
	$timestamp = wp_next_scheduled( HDC_SYNC_EVENT );
	if ( $timestamp ) {
		wp_unschedule_event( $timestamp, HDC_SYNC_EVENT );
	}
}
add_action( 'switch_theme', 'hdc_repo_clear_sync' );

/**
 * Pull live repos from the worker and reconcile the CPT.
 *
 * @return array{source:string,count:int}
 */
function hdc_github_sync(): array {
	$owner    = hdc_get_configured_github_owner();
	$endpoint = add_query_arg(
		array(
			'per_page' => 100,
			'username' => $owner,
		),
		hdc_get_portfolio_origin() . '/api/github/repos'
	);

	$response = wp_remote_get( $endpoint, array( 'timeout' => 5 ) );

	$live = null;
	if ( ! is_wp_error( $response ) && 200 === (int) wp_remote_retrieve_response_code( $response ) ) {
		$decoded = json_decode( wp_remote_retrieve_body( $response ), true );
		if ( is_array( $decoded ) ) {
			$live = $decoded;
		}
	}

	// Soft-fail guard: error/timeout/non-200/unparseable OR empty live array.
	if ( null === $live || array() === $live ) {
		return hdc_repo_record_fallback( null === $live ? 'fallback' : 'fallback-empty' );
	}

	$kept  = array_values( array_filter( $live, 'hdc_repo_should_keep_live' ) );
	if ( array() === $kept ) {
		return hdc_repo_record_fallback( 'fallback-empty' );
	}

	hdc_repo_suppress_begin(); // bulk writes below must not fire save_post per repo.
	foreach ( $kept as $api_repo ) {
		if ( ! is_array( $api_repo ) ) {
			continue;
		}
		$mapped = hdc_repo_map_api( $api_repo );

		$post_id = hdc_repo_find_by_github_id( (int) $mapped['github_id'] );
		if ( ! $post_id ) {
			$post_id = hdc_repo_find_by_name( (string) $mapped['name'] );
			if ( $post_id && (int) $mapped['github_id'] > 0 ) {
				update_post_meta( $post_id, 'github_id', (int) $mapped['github_id'] );
			} elseif ( ! $post_id && 0 === (int) $mapped['github_id'] ) {
				// Worker not yet redeployed with id and no name match — warn + skip create
				// to avoid duplicate posts on the next id-bearing run.
				if ( defined( 'WP_CLI' ) && WP_CLI ) {
					WP_CLI::warning( sprintf( 'No github_id and no name match for "%s"; skipped.', $mapped['name'] ) );
				}
				continue;
			}
		}

		$is_create = ! $post_id;
		if ( $is_create ) {
			$post_id = wp_insert_post(
				array(
					'post_type'   => 'hdc_repo',
					'post_status' => 'draft', // reconcile() promotes featured -> publish; new API repos are not curated/featured.
					'post_title'  => (string) $mapped['name'],
					'post_name'   => sanitize_title( (string) $mapped['name'] ),
				),
				true
			);
			if ( is_wp_error( $post_id ) ) {
				continue;
			}
			$post_id = (int) $post_id;
			update_post_meta( $post_id, 'github_id', (int) $mapped['github_id'] );
			// Defaults for a brand-new (uncurated) repo.
			update_post_meta( $post_id, 'origin', 'github' );
			update_post_meta( $post_id, 'access', 'public' );
			update_post_meta( $post_id, 'featured', 0 );
		}

		// Build the merged record (curated meta read from the post + live).
		$curated = hdc_repo_read_curated( $post_id );
		$merged  = hdc_repo_merge_live_onto_curated( $curated, $mapped );

		// Write Live fields (origin overwritten to github; description curated-preferred handled in merge).
		update_post_meta( $post_id, 'origin', (string) $merged['origin'] );
		update_post_meta( $post_id, 'stars', (int) $merged['stars'] );
		update_post_meta( $post_id, 'forks', (int) $merged['forks'] );
		update_post_meta( $post_id, 'url', esc_url_raw( (string) $merged['url'] ) );
		update_post_meta( $post_id, 'updated_at', (string) $merged['updated_at'] );
		update_post_meta( $post_id, 'language', (string) $merged['language'] );
		update_post_meta( $post_id, 'topics', hdc_repo_sanitize_topics( $merged['topics'] ?? array() ) );
		// description only on create (curated wins thereafter).
		if ( $is_create ) {
			update_post_meta( $post_id, 'description', (string) $merged['description'] );
		}
		update_post_meta( $post_id, 'last_sync_source', 'live' );

		hdc_repo_write_derived( $post_id, $merged, true );
	}

	hdc_repo_reconcile();
	hdc_repo_suppress_end();

	$status = array(
		'time'   => time(),
		'source' => 'live',
		'count'  => count( $kept ),
	);
	update_option( 'hdc_repo_sync_status', $status, false );

	return array(
		'source' => 'live',
		'count'  => count( $kept ),
	);
}

/**
 * Read the curated + current meta of a post into the array shape the pure
 * merge/derive functions expect.
 */
function hdc_repo_read_curated( int $post_id ): array {
	return array(
		'name'              => (string) get_post_field( 'post_name', $post_id ),
		'origin'            => (string) get_post_meta( $post_id, 'origin', true ),
		'access'            => (string) get_post_meta( $post_id, 'access', true ),
		'featured'          => (bool) get_post_meta( $post_id, 'featured', true ),
		'featured_priority' => get_post_meta( $post_id, 'featured_priority', true ),
		'why_it_matters'    => (string) get_post_meta( $post_id, 'why_it_matters', true ),
		'display_name'      => (string) get_post_meta( $post_id, 'display_name', true ),
		'description'       => (string) get_post_meta( $post_id, 'description', true ),
		'language'          => (string) get_post_meta( $post_id, 'language', true ),
		'url'               => (string) get_post_meta( $post_id, 'url', true ),
		'updated_at'        => (string) get_post_meta( $post_id, 'updated_at', true ),
	);
}

/**
 * Handle a failed/empty sync: keep Live tier, downgrade source_badge to its
 * snapshot variant, record status, and exit.
 *
 * @param string $source 'fallback' or 'fallback-empty'.
 * @return array{source:string,count:int}
 */
function hdc_repo_record_fallback( string $source ): array {
	$ids = get_posts(
		array(
			'post_type'        => 'hdc_repo',
			'post_status'      => 'any',
			'numberposts'      => -1,
			'fields'           => 'ids',
			'suppress_filters' => false,
		)
	);
	foreach ( $ids as $id ) {
		$id      = (int) $id;
		$curated = hdc_repo_read_curated( $id );
		// Recompute source_badge in the non-live (snapshot) branch.
		update_post_meta( $id, 'source_badge', hdc_repo_source_badge( $curated, false ) );
		update_post_meta( $id, 'last_sync_source', $source );
	}

	update_option(
		'hdc_repo_sync_status',
		array(
			'time'   => time(),
			'source' => $source,
			'count'  => 0,
		),
		false
	);

	return array(
		'source' => $source,
		'count'  => 0,
	);
}

/**
 * When a repo is edited in admin, immediately reconcile ranks + statuses and
 * recompute its derived meta from current curated + live values.
 *
 * @param int     $post_id Post id.
 * @param WP_Post $post    Post object.
 * @param bool    $update  Whether this is an update.
 */
function hdc_repo_on_save( int $post_id, $post, bool $update ): void {
	if ( hdc_repo_is_suppressing() ) {
		return; // a sync/seed/reconcile is running; it handles derivation + reconcile.
	}
	if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
		return;
	}
	if ( 'hdc_repo' !== get_post_type( $post_id ) ) {
		return;
	}

	hdc_repo_suppress_begin();
	$status  = get_option( 'hdc_repo_sync_status', array() );
	$is_live = is_array( $status ) && 'live' === ( $status['source'] ?? '' );
	$merged  = hdc_repo_read_curated( $post_id );
	hdc_repo_write_derived( $post_id, $merged, $is_live );
	hdc_repo_reconcile();
	hdc_repo_suppress_end();
}
add_action( 'save_post_hdc_repo', 'hdc_repo_on_save', 20, 3 );

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	WP_CLI::add_command(
		'hdc sync-repos',
		function () {
			$result = hdc_github_sync();
			WP_CLI::success( sprintf( 'Sync complete: source=%s, count=%d.', $result['source'], $result['count'] ) );
		}
	);
}
