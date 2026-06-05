<?php
/**
 * Binding-resolution test: render the Selected Work markup and assert every
 * core/post-meta binding resolves to a known fixture repo's values in loop context.
 *
 * Hermetic against seeded data AND the save_post reconcile hook:
 *  - The `save_post_hdc_repo` hook is removed for the duration, so inserting an
 *    unfeatured fixture does not draft it (or rewrite its title via write_derived).
 *  - The fixture is given menu_order -1 so it is the first card regardless of how
 *    many real repos are published (the loop renders 3 by menu_order ASC).
 *  - Every bound field uses a UNIQUE marker, so a passing assertion proves the
 *    fixture's binding resolved (not a coincidental match against a seeded repo).
 * Restores the hook + deletes the fixture at the end.
 *
 * Run: wp --path=/home/dev/wp-hperkins-com eval-file \
 *        wp-content/themes/henrys-digital-canvas/tests/selected-work-binding-test.php
 */

$failures = 0;

// Remove the reconcile-on-save hook so inserting an unfeatured fixture does not
// draft it (reconcile) or overwrite its title (write_derived).
remove_action( 'save_post_hdc_repo', 'hdc_repo_on_save', 20 );

// Create a published fixture ranked ahead of all real repos (menu_order -1).
$post_id = wp_insert_post(
	array(
		'post_type'   => 'hdc_repo',
		'post_status' => 'publish',
		'post_title'  => 'BindTitleMarker',
		'post_name'   => 'binding-resolution-fixture',
		'menu_order'  => -1,
	),
	true
);

if ( is_wp_error( $post_id ) ) {
	add_action( 'save_post_hdc_repo', 'hdc_repo_on_save', 20, 3 );
	echo 'FAIL - could not create fixture: ' . $post_id->get_error_message() . "\n\n1 failures\n";
	return;
}

$meta = array(
	'summary'      => 'BindSummaryMarker',
	'language'     => 'BindLangMarker',
	'badge_label'  => 'BindBadgeMarker',
	'source_badge' => 'BindSourceMarker',
	'cta_label'    => 'BindCtaMarker',
	'updated_at'   => '2026-05-01',
	'url'          => 'https://example.com/bind-url-marker',
);
foreach ( $meta as $k => $v ) {
	update_post_meta( $post_id, $k, $v );
}

// Render the markup the way the front end will (do_blocks runs the loop + bindings).
$html = do_blocks( hdc_selected_work_block_markup() );

// Each UNIQUE marker must appear → proves that field's binding resolved for the fixture.
$checks = array(
	'summary resolves'      => 'BindSummaryMarker',
	'language resolves'     => 'BindLangMarker',
	'badge resolves'        => 'BindBadgeMarker',
	'source badge resolves' => 'BindSourceMarker',
	'cta text resolves'     => 'BindCtaMarker',
	'url resolves'          => 'https://example.com/bind-url-marker',
	'title resolves'        => 'BindTitleMarker',
);
foreach ( $checks as $label => $needle ) {
	if ( false !== strpos( $html, $needle ) ) {
		echo "ok   - {$label}\n";
	} else {
		echo "FAIL - {$label} (not found in rendered HTML)\n";
		$failures++;
	}
}

// The loop rendered at least the fixture card.
if ( substr_count( $html, 'is-style-hdc-repo-card' ) >= 1 ) {
	echo "ok   - at least one card rendered\n";
} else {
	echo "FAIL - no cards rendered\n";
	$failures++;
}

// Cleanup: delete the fixture, restore the reconcile-on-save hook.
wp_delete_post( $post_id, true );
add_action( 'save_post_hdc_repo', 'hdc_repo_on_save', 20, 3 );

echo "\n{$failures} failures\n";
