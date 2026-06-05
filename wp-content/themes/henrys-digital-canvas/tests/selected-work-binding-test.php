<?php
/**
 * Binding-resolution test: render the Selected Work markup against a fixture
 * hdc_repo and assert each core/post-meta binding resolves to the repo's values
 * (not empty, not the page's meta).
 *
 * Run: wp --path=/home/dev/wp-hperkins-com eval-file \
 *        wp-content/themes/henrys-digital-canvas/tests/selected-work-binding-test.php
 */

$failures = 0;

// 1) Create a published fixture repo with known meta.
$post_id = wp_insert_post(
	array(
		'post_type'   => 'hdc_repo',
		'post_status' => 'publish',
		'post_title'  => 'Tarot',
		'post_name'   => 'tarot-binding-fixture',
		'menu_order'  => 0,
	),
	true
);

if ( is_wp_error( $post_id ) ) {
	echo 'FAIL - could not create fixture: ' . $post_id->get_error_message() . "\n";
	echo "\n1 failures\n";
	return;
}

$meta = array(
	'summary'      => 'BINDING_SUMMARY_MARKER reading UX.',
	'language'     => 'JavaScript',
	'badge_label'  => 'Open source',
	'source_badge' => 'Live GitHub',
	'cta_label'    => 'View project',
	'updated_at'   => '2026-05-01',
	'url'          => 'https://github.com/henryperkins/tarot',
);
foreach ( $meta as $k => $v ) {
	update_post_meta( $post_id, $k, $v );
}

// 2) Render the markup the way the front end will (do_blocks runs the loop + bindings).
$html = do_blocks( hdc_selected_work_block_markup() );

// 3) Assertions: each bound value must appear in the output.
$checks = array(
	'summary resolves'      => 'BINDING_SUMMARY_MARKER reading UX.',
	'language resolves'     => 'JavaScript',
	'badge resolves'        => 'Open source',
	'source badge resolves' => 'Live GitHub',
	'cta text resolves'     => 'View project',
	'url resolves'          => 'https://github.com/henryperkins/tarot',
	'title resolves'        => 'Tarot',
);
foreach ( $checks as $label => $needle ) {
	if ( false !== strpos( $html, $needle ) ) {
		echo "ok   - {$label}\n";
	} else {
		echo "FAIL - {$label} (not found in rendered HTML)\n";
		$failures++;
	}
}

// 4) Negative: the summary paragraph must not be empty.
if ( false !== strpos( $html, '<p class="hdc-repo-card__summary"></p>' ) ) {
	echo "FAIL - summary paragraph rendered EMPTY (binding did not resolve)\n";
	$failures++;
} else {
	echo "ok   - summary paragraph is not empty\n";
}

// 5) Cleanup.
wp_delete_post( $post_id, true );

echo "\n{$failures} failures\n";
