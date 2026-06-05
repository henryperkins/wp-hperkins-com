<?php
/**
 * Home Core — one-time seed of hdc_repo from repos.json + repo-case-study-details.json.
 * Idempotent: upserts by repo name, never clobbers an existing post's curated meta.
 *
 * @package henrys-digital-canvas
 */

defined( 'ABSPATH' ) || exit;

/**
 * Seed (or top-up) hdc_repo posts from the theme's JSON data files.
 *
 * @return array{created:int,skipped:int}
 */
function hdc_repo_seed_from_json(): array {
	$repos_json    = hdc_read_theme_json_file( '/blocks/work-showcase/data/repos.json', array() );
	$case_study    = hdc_read_theme_json_file( '/blocks/work-showcase/data/repo-case-study-details.json', array() );
	$repos_json    = is_array( $repos_json ) ? $repos_json : array();
	$case_study    = is_array( $case_study ) ? $case_study : array();

	$seed_records  = hdc_repo_build_seed( $repos_json, $case_study );
	$created       = 0;
	$skipped       = 0;

	hdc_repo_suppress_begin(); // bulk inserts/writes below must not fire save_post per repo.
	foreach ( $seed_records as $record ) {
		$existing = hdc_repo_find_by_name( (string) $record['name'] );
		if ( $existing ) {
			$skipped++;
			continue; // never re-seed / clobber curated meta.
		}

		$post_id = wp_insert_post(
			array(
				'post_type'   => 'hdc_repo',
				'post_status' => $record['featured'] ? 'publish' : 'draft',
				'post_title'  => (string) $record['name'],
				'post_name'   => sanitize_title( (string) $record['name'] ),
			),
			true
		);
		if ( is_wp_error( $post_id ) ) {
			continue;
		}
		$post_id = (int) $post_id;

		// Curated meta.
		update_post_meta( $post_id, 'featured', $record['featured'] ? 1 : 0 );
		if ( null !== $record['featured_priority'] ) {
			update_post_meta( $post_id, 'featured_priority', (int) $record['featured_priority'] );
		}
		update_post_meta( $post_id, 'origin', (string) $record['origin'] );
		update_post_meta( $post_id, 'access', (string) $record['access'] );
		update_post_meta( $post_id, 'why_it_matters', (string) $record['why_it_matters'] );

		// Initial live snapshot.
		update_post_meta( $post_id, 'description', (string) $record['description'] );
		update_post_meta( $post_id, 'language', (string) $record['language'] );
		update_post_meta( $post_id, 'stars', (int) $record['stars'] );
		update_post_meta( $post_id, 'forks', (int) $record['forks'] );
		update_post_meta( $post_id, 'updated_at', (string) $record['updated_at'] );
		update_post_meta( $post_id, 'url', esc_url_raw( (string) $record['url'] ) );
		update_post_meta( $post_id, 'topics', hdc_repo_sanitize_topics( $record['topics'] ) );
		update_post_meta( $post_id, 'last_sync_source', 'seed' );

		// Derived meta + title/slug. Seeded data is a snapshot, not live.
		$record['display_name'] = (string) $record['display_name'];
		hdc_repo_write_derived( $post_id, $record, false );

		$created++;
	}

	hdc_repo_reconcile();
	hdc_repo_suppress_end();

	return array(
		'created' => $created,
		'skipped' => $skipped,
	);
}

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	WP_CLI::add_command(
		'hdc seed-repos',
		function () {
			$result = hdc_repo_seed_from_json();
			WP_CLI::success( sprintf( 'Seed complete: %d created, %d skipped.', $result['created'], $result['skipped'] ) );
		}
	);
}
