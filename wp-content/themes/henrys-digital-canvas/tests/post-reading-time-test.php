<?php
/**
 * Integration check: native post reading_time meta registration and updates.
 *
 * Run: wp --path=/home/dev/wp-hperkins-com eval-file \
 *        wp-content/themes/henrys-digital-canvas/tests/post-reading-time-test.php
 */

$GLOBALS['hdc_post_reading_time_test_failures'] = 0;

/**
 * Record an assertion result.
 *
 * @param string $label Assertion label.
 * @param bool   $condition Assertion condition.
 * @return void
 */
function hdc_phase3_assert( $label, $condition ) {
	if ( ! $condition ) {
		$GLOBALS['hdc_post_reading_time_test_failures']++;
		echo "FAIL: {$label}\n";
		return;
	}

	echo "PASS: {$label}\n";
}

$registered = get_registered_meta_keys( 'post', 'post' );
hdc_phase3_assert( 'reading_time meta is registered for posts', isset( $registered['reading_time'] ) );
hdc_phase3_assert( 'reading_time meta is REST-visible', ! empty( $registered['reading_time']['show_in_rest'] ) );

$post_id = wp_insert_post(
	array(
		'post_type'    => 'post',
		'post_status'  => 'publish',
		'post_title'   => 'Reading Time Test',
		'post_content' => str_repeat( 'word ', 440 ),
	)
);

hdc_phase3_assert( 'test post inserted', $post_id > 0 );
hdc_phase3_assert( 'reading_time computed on save', '2 min read' === get_post_meta( $post_id, 'reading_time', true ) );

wp_update_post(
	array(
		'ID'           => $post_id,
		'post_content' => str_repeat( 'word ', 20 ),
	)
);

hdc_phase3_assert( 'reading_time recomputed on update', '1 min read' === get_post_meta( $post_id, 'reading_time', true ) );

wp_delete_post( $post_id, true );

$failures = (int) $GLOBALS['hdc_post_reading_time_test_failures'];

echo "\n{$failures} failures\n";

if ( $failures > 0 ) {
	exit( 1 );
}

echo "post reading_time checks passed\n";
