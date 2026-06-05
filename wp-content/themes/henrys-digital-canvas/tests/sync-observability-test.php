<?php
/**
 * Integration check: hdc_github_sync records raw fetched, attempted, applied,
 * and skipped counters from a stubbed worker response.
 *
 * Run: wp --path=/home/dev/wp-hperkins-com eval-file \
 *        wp-content/themes/henrys-digital-canvas/tests/sync-observability-test.php
 */

$GLOBALS['hdc_sync_observability_failures'] = 0;
$previous_status                            = get_option( 'hdc_repo_sync_status', null );
$had_status                                 = false !== $previous_status;
$created_ids                                = array();

function hdc_sync_observability_check( string $label, $actual, $expected ): void {
	$a = var_export( $actual, true );
	$e = var_export( $expected, true );
	if ( $a === $e ) {
		echo "ok   - {$label}\n";
		return;
	}
	$GLOBALS['hdc_sync_observability_failures']++;
	echo "FAIL - {$label}\n     expected: {$e}\n     actual:   {$a}\n";
}

remove_action( 'save_post_hdc_repo', 'hdc_repo_on_save', 20 );

$fixture_id = wp_insert_post(
	array(
		'post_type'   => 'hdc_repo',
		'post_status' => 'draft',
		'post_title'  => 'Sync Observability Fixture',
		'post_name'   => 'sync-observability-applied',
	),
	true
);

if ( is_wp_error( $fixture_id ) ) {
	add_action( 'save_post_hdc_repo', 'hdc_repo_on_save', 20, 3 );
	echo 'FAIL - could not create fixture: ' . $fixture_id->get_error_message() . "\n\n1 failures\n";
	exit( 1 );
}

$fixture_id    = (int) $fixture_id;
$created_ids[] = $fixture_id;
update_post_meta( $fixture_id, 'github_id', 770001 );
update_post_meta( $fixture_id, 'featured', 0 );
update_post_meta( $fixture_id, 'origin', 'github' );
update_post_meta( $fixture_id, 'access', 'public' );
update_post_meta( $fixture_id, 'description', 'Fixture description' );
update_post_meta( $fixture_id, 'display_name', 'Sync Observability Fixture' );

$worker_response = array(
	array(
		'id'               => 770001,
		'name'             => 'sync-observability-applied',
		'description'      => 'Live fixture description',
		'language'         => 'PHP',
		'stargazers_count' => 1,
		'forks_count'      => 0,
		'pushed_at'        => '2026-06-01T00:00:00Z',
		'html_url'         => 'https://github.com/henryperkins/sync-observability-applied',
		'topics'           => array( 'wordpress' ),
		'fork'             => false,
		'archived'         => false,
	),
	array(
		'name'             => 'sync-observability-skipped',
		'description'      => 'Missing id and no local name match',
		'language'         => 'PHP',
		'stargazers_count' => 1,
		'forks_count'      => 0,
		'pushed_at'        => '2026-06-02T00:00:00Z',
		'html_url'         => 'https://github.com/henryperkins/sync-observability-skipped',
		'topics'           => array(),
		'fork'             => false,
		'archived'         => false,
	),
	array(
		'id'       => 770003,
		'name'     => 'sync-observability-fork',
		'fork'     => true,
		'archived' => false,
	),
	array(
		'id'       => 770004,
		'name'     => 'sync-observability-archived',
		'fork'     => false,
		'archived' => true,
	),
);

$stub_worker_response = static function () use ( $worker_response ) {
	return array(
		'headers'  => array( 'content-type' => 'application/json' ),
		'body'     => wp_json_encode( $worker_response ),
		'response' => array(
			'code'    => 200,
			'message' => 'OK',
		),
		'cookies'  => array(),
	);
};
add_filter( 'pre_http_request', $stub_worker_response, 10, 3 );

$result = hdc_github_sync();
$status = get_option( 'hdc_repo_sync_status', array() );

remove_filter( 'pre_http_request', $stub_worker_response, 10 );

hdc_sync_observability_check( 'result source live', $result['source'] ?? '', 'live' );
hdc_sync_observability_check( 'result count remains attempted for compatibility', $result['count'] ?? null, 2 );
hdc_sync_observability_check( 'result fetched is raw worker array count', $result['fetched'] ?? null, 4 );
hdc_sync_observability_check( 'result attempted is post-filter count', $result['attempted'] ?? null, 2 );
hdc_sync_observability_check( 'result applied counts successful writes', $result['applied'] ?? null, 1 );
hdc_sync_observability_check( 'result skipped is attempted minus applied', $result['skipped'] ?? null, 1 );

hdc_sync_observability_check( 'status fetched is raw worker array count', $status['fetched'] ?? null, 4 );
hdc_sync_observability_check( 'status attempted is post-filter count', $status['attempted'] ?? null, 2 );
hdc_sync_observability_check( 'status applied counts successful writes', $status['applied'] ?? null, 1 );
hdc_sync_observability_check( 'status skipped is attempted minus applied', $status['skipped'] ?? null, 1 );

foreach ( $created_ids as $created_id ) {
	wp_delete_post( (int) $created_id, true );
}
if ( $had_status ) {
	update_option( 'hdc_repo_sync_status', $previous_status, false );
} else {
	delete_option( 'hdc_repo_sync_status' );
}
add_action( 'save_post_hdc_repo', 'hdc_repo_on_save', 20, 3 );

$failures = (int) $GLOBALS['hdc_sync_observability_failures'];
echo "\n{$failures} failures\n";
exit( $failures > 0 ? 1 : 0 );
