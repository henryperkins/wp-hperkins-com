<?php
/**
 * Integration check: hdc_repo CPT + every meta registered with show_in_rest.
 * Run: wp --path=/home/dev/wp-hperkins-com eval-file \
 *        wp-content/themes/henrys-digital-canvas/tests/registration-check.php
 */

$failures = 0;

if ( ! post_type_exists( 'hdc_repo' ) ) {
	echo "FAIL - hdc_repo CPT not registered\n";
	$failures++;
} else {
	echo "ok   - hdc_repo CPT registered\n";
}

$expected_meta = array(
	'github_id', 'featured', 'featured_priority', 'why_it_matters', 'display_name',
	'origin', 'access', 'description', 'language', 'stars', 'forks', 'updated_at',
	'url', 'topics', 'summary', 'badge_label', 'source_badge', 'cta_label', 'last_sync_source',
);
$registered = get_registered_meta_keys( 'post', 'hdc_repo' );
foreach ( $expected_meta as $key ) {
	if ( isset( $registered[ $key ] ) && ! empty( $registered[ $key ]['show_in_rest'] ) ) {
		echo "ok   - meta {$key} registered + show_in_rest\n";
	} else {
		echo "FAIL - meta {$key} missing or not show_in_rest\n";
		$failures++;
	}
}

echo "\n{$failures} failures\n";
