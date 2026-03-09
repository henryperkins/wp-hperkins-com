<?php
/**
 * Sync static-page block ownership for Henry's Digital Canvas.
 *
 * Run with:
 * wp --path=/path/to/wp-root eval-file wp-content/themes/henrys-digital-canvas/scripts/sync_page_sources.php
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Write a sync log line.
 *
 * @param string $message Message to print.
 * @return void
 */
function hdc_sync_log( $message ) {
	echo $message . PHP_EOL;
}

/**
 * Get the leaf slug from a page path.
 *
 * @param string $path Slash-delimited page path.
 * @return string
 */
function hdc_sync_leaf_slug( $path ) {
	$segments = array_values(
		array_filter(
			explode( '/', trim( (string) $path, '/' ) )
		)
	);

	return (string) end( $segments );
}

/**
 * Upsert a single static page and keep its block composition synchronized.
 *
 * @param array $config Page sync configuration.
 * @return int
 */
function hdc_sync_static_page( array $config ) {
	$page_path = trim( (string) $config['path'], '/' );
	$page      = get_page_by_path( $page_path, OBJECT, 'page' );
	$parent_id = 0;

	if ( ! empty( $config['parent_path'] ) ) {
		$parent = get_page_by_path( trim( (string) $config['parent_path'], '/' ), OBJECT, 'page' );

		if ( $parent instanceof WP_Post ) {
			$parent_id = (int) $parent->ID;
		}
	}

	$postarr = array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_title'   => (string) $config['title'],
		'post_name'    => hdc_sync_leaf_slug( $page_path ),
		'post_parent'  => $parent_id,
		'post_content' => trim( (string) $config['content'] ),
	);

	if ( $page instanceof WP_Post ) {
		$postarr['ID'] = (int) $page->ID;
	}

	$result = wp_insert_post( wp_slash( $postarr ), true );

	if ( is_wp_error( $result ) ) {
		hdc_sync_log( 'Failed syncing page "' . $page_path . '": ' . $result->get_error_message() );
		exit( 1 );
	}

	$page_id = (int) $result;

	if ( array_key_exists( 'page_template', $config ) ) {
		$template = (string) $config['page_template'];

		if ( '' === $template ) {
			delete_post_meta( $page_id, '_wp_page_template' );
		} else {
			update_post_meta( $page_id, '_wp_page_template', $template );
		}
	}

	hdc_sync_log( sprintf( 'Synced page %-12s -> ID %d', $page_path, $page_id ) );

	return $page_id;
}

/**
 * Delete stale Site Editor template overrides so file templates remain authoritative.
 *
 * @param string[] $template_slugs Template slugs to delete.
 * @return void
 */
function hdc_delete_template_overrides( array $template_slugs ) {
	foreach ( $template_slugs as $template_slug ) {
		$templates = get_posts(
			array(
				'post_type'      => 'wp_template',
				'name'           => $template_slug,
				'post_status'    => 'any',
				'posts_per_page' => -1,
			)
		);

		if ( empty( $templates ) ) {
			hdc_sync_log( sprintf( 'No wp_template override found for %s', $template_slug ) );
			continue;
		}

		foreach ( $templates as $template_post ) {
			wp_delete_post( $template_post->ID, true );
			hdc_sync_log( sprintf( 'Deleted wp_template override %-12s (ID %d)', $template_slug, $template_post->ID ) );
		}
	}
}

$page_configs = array(
	array(
		'path'          => 'home',
		'title'         => 'Home',
		'content'       => '<!-- wp:henrys-digital-canvas/home-page /-->',
		'page_template' => 'page-no-title',
	),
	array(
		'path'          => 'work',
		'title'         => 'Work',
		'content'       => '<!-- wp:henrys-digital-canvas/work-showcase {"includeForks":true} /-->',
		'page_template' => '',
	),
	array(
		'path'          => 'resume',
		'title'         => 'Resume',
		'content'       => '<!-- wp:henrys-digital-canvas/resume-overview {"align":"wide"} /-->',
		'page_template' => '',
	),
	array(
		'path'          => 'resume/ats',
		'parent_path'   => 'resume',
		'title'         => 'ATS Resume',
		'content'       => '<!-- wp:henrys-digital-canvas/resume-ats {"align":"wide"} /-->',
		'page_template' => '',
	),
	array(
		'path'          => 'hobbies',
		'title'         => 'Hobbies',
		'content'       => '<!-- wp:henrys-digital-canvas/hobbies-moments /-->',
		'page_template' => '',
	),
	array(
		'path'          => 'blog',
		'title'         => 'Blog',
		'content'       => '<!-- wp:henrys-digital-canvas/blog-index /-->',
		'page_template' => '',
	),
	array(
		'path'          => 'about',
		'title'         => 'About',
		'content'       => '<!-- wp:henrys-digital-canvas/about-timeline /-->',
		'page_template' => '',
	),
	array(
		'path'          => 'contact',
		'title'         => 'Contact',
		'content'       => '<!-- wp:henrys-digital-canvas/contact-form /-->',
		'page_template' => '',
	),
);

$page_ids = array();

foreach ( $page_configs as $page_config ) {
	$page_ids[ $page_config['path'] ] = hdc_sync_static_page( $page_config );
}

if ( isset( $page_ids['home'] ) ) {
	update_option( 'show_on_front', 'page' );
	update_option( 'page_on_front', $page_ids['home'] );
	hdc_sync_log( sprintf( 'Configured front page -> ID %d', $page_ids['home'] ) );
}

update_option( 'page_for_posts', 0 );
hdc_sync_log( 'Unset page_for_posts so /blog/ is page-backed.' );

hdc_delete_template_overrides(
	array(
		'front-page',
		'work',
		'blog-index',
	)
);

flush_rewrite_rules();
hdc_sync_log( 'Flushed rewrite rules.' );
hdc_sync_log( 'Static page source sync complete.' );
