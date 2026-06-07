<?php
/**
 * Standalone unit tests for inc/home-core/query-loop.php.
 * Run from the theme dir: php tests/query-loop-test.php
 * No WordPress, no DB, no composer required.
 *
 * @package henrys-digital-canvas
 */

define( 'ABSPATH', __DIR__ );
define( 'OBJECT', 'OBJECT' );

$hdc_query_get_page_by_path_calls = 0;

class WP_Post {
	/**
	 * Test post ID.
	 *
	 * @var int
	 */
	public $ID;

	/**
	 * Constructor.
	 *
	 * @param int $id Post ID.
	 */
	public function __construct( int $id ) {
		$this->ID = $id;
	}
}

function add_filter( $hook_name, $callback, $priority = 10, $accepted_args = 1 ): void {}

function get_page_by_path( $path, $output = OBJECT, $post_type = 'page' ) {
	global $hdc_query_get_page_by_path_calls;
	$hdc_query_get_page_by_path_calls++;

	if ( 'hello-world' === $path && 'post' === $post_type ) {
		return new WP_Post( 123 );
	}

	return null;
}

require __DIR__ . '/../inc/home-core/query-loop.php';

$tests_run    = 0;
$tests_failed = 0;

function hdc_query_check( string $label, $actual, $expected ): void {
	global $tests_run, $tests_failed;
	$tests_run++;
	$a = var_export( $actual, true );
	$e = var_export( $expected, true );
	if ( $a === $e ) {
		echo "ok   - {$label}\n";
		return;
	}

	$tests_failed++;
	echo "FAIL - {$label}\n     expected: {$e}\n     actual:   {$a}\n";
}

function hdc_query_block_with_namespace( string $namespace ) {
	return (object) array(
		'parsed_block' => array(
			'attrs' => array(
				'namespace' => $namespace,
			),
		),
	);
}

$repo_query = hdc_selected_work_query_vars(
	array(
		'post_type' => 'hdc_repo',
		'orderby'   => 'date',
		'order'     => 'DESC',
	),
	hdc_query_block_with_namespace( 'hdc/selected-work' )
);
hdc_query_check( 'selected work loop orders by synced menu_order', array( $repo_query['orderby'], $repo_query['order'] ), array( 'menu_order', 'ASC' ) );

$generic_post_query = hdc_selected_work_query_vars(
	array(
		'post_type' => 'post',
	),
	hdc_query_block_with_namespace( 'other/post-loop' )
);
hdc_query_check( 'generic post query loop keeps placeholder visible', array_key_exists( 'post__not_in', $generic_post_query ), false );

$recent_writing_query = hdc_selected_work_query_vars(
	array(
		'post_type'     => 'post',
		'post__not_in'  => array( 11, 123 ),
		'posts_per_page' => 3,
	),
	hdc_query_block_with_namespace( 'hdc/recent-writing' )
);
hdc_query_check( 'recent writing loop excludes placeholder once', $recent_writing_query['post__not_in'], array( 11, 123 ) );
hdc_query_check( 'recent writing loop preserves other query vars', $recent_writing_query['posts_per_page'], 3 );

hdc_selected_work_query_vars(
	array(
		'post_type' => 'post',
	),
	hdc_query_block_with_namespace( 'hdc/recent-writing' )
);
hdc_query_check( 'recent writing placeholder lookup is cached per request', $hdc_query_get_page_by_path_calls, 1 );

echo "\n{$tests_run} checks, {$tests_failed} failures\n";
exit( $tests_failed > 0 ? 1 : 0 );
