<?php
/**
 * Theme functions for Henry's Digital Canvas child theme.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Build a cache-busting version for local theme assets.
 *
 * @param string $relative_path Relative path under the child theme directory.
 * @return string
 */
function hdc_asset_version( $relative_path ) {
	$full_path = get_stylesheet_directory() . $relative_path;

	if ( file_exists( $full_path ) ) {
		return (string) filemtime( $full_path );
	}

	return wp_get_theme()->get( 'Version' );
}

/**
 * Enqueue front-end styles.
 *
 * Loads:
 * - parent theme stylesheet
 * - migrated design fonts
 * - migrated design token/utilities stylesheet
 *
 * @return void
 */
function hdc_enqueue_frontend_styles() {
	$parent_theme = wp_get_theme( get_template() );

	wp_enqueue_style(
		'hdc-parent-style',
		get_template_directory_uri() . '/style.css',
		array(),
		$parent_theme->get( 'Version' )
	);

	wp_enqueue_style(
		'hdc-google-fonts',
		'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,500;0,8..60,600;0,8..60,700;1,8..60,400;1,8..60,500&family=JetBrains+Mono:wght@400;500&display=swap',
		array(),
		null
	);

	wp_enqueue_style(
		'hdc-design-system',
		get_stylesheet_directory_uri() . '/assets/css/design-system.css',
		array( 'hdc-parent-style', 'hdc-google-fonts' ),
		hdc_asset_version( '/assets/css/design-system.css' )
	);

	wp_enqueue_script(
		'hdc-shared-utils',
		get_stylesheet_directory_uri() . '/assets/js/hdc-shared-utils.js',
		array(),
		hdc_asset_version( '/assets/js/hdc-shared-utils.js' ),
		true
	);

	wp_enqueue_script(
		'hdc-resume-snapshot',
		get_stylesheet_directory_uri() . '/assets/js/hdc-resume-snapshot.js',
		array(),
		hdc_asset_version( '/assets/js/hdc-resume-snapshot.js' ),
		true
	);
}
add_action( 'wp_enqueue_scripts', 'hdc_enqueue_frontend_styles' );

/**
 * Enqueue editor styles so block editor matches front-end tokens.
 *
 * @return void
 */
function hdc_enqueue_editor_styles() {
	if ( ! is_admin() ) {
		return;
	}

	wp_enqueue_style(
		'hdc-google-fonts-editor',
		'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,500;0,8..60,600;0,8..60,700;1,8..60,400;1,8..60,500&family=JetBrains+Mono:wght@400;500&display=swap',
		array(),
		null
	);

	wp_enqueue_style(
		'hdc-design-system-editor',
		get_stylesheet_directory_uri() . '/assets/css/design-system.css',
		array( 'wp-edit-blocks', 'hdc-google-fonts-editor' ),
		hdc_asset_version( '/assets/css/design-system.css' )
	);
}
add_action( 'enqueue_block_assets', 'hdc_enqueue_editor_styles' );

require_once get_stylesheet_directory() . '/inc/data-contracts.php';
require_once get_stylesheet_directory() . '/inc/rest-api.php';

/**
 * Register custom Gutenberg blocks shipped by the child theme.
 *
 * @return void
 */
function hdc_register_theme_blocks() {
	$block_directories = array(
		get_stylesheet_directory() . '/blocks/home-page',
		get_stylesheet_directory() . '/blocks/digital-canvas-feed',
		get_stylesheet_directory() . '/blocks/work-showcase',
		get_stylesheet_directory() . '/blocks/site-shell',
		get_stylesheet_directory() . '/blocks/resume-overview',
		get_stylesheet_directory() . '/blocks/resume-ats',
		get_stylesheet_directory() . '/blocks/hobbies-moments',
		get_stylesheet_directory() . '/blocks/blog-index',
		get_stylesheet_directory() . '/blocks/blog-post',
		get_stylesheet_directory() . '/blocks/contact-form',
		get_stylesheet_directory() . '/blocks/work-detail',
		get_stylesheet_directory() . '/blocks/about-timeline',
		get_stylesheet_directory() . '/blocks/not-found',
	);

	foreach ( $block_directories as $block_directory ) {
		if ( file_exists( $block_directory . '/block.json' ) ) {
			register_block_type_from_metadata( $block_directory );
		}
	}
}
add_action( 'init', 'hdc_register_theme_blocks' );

/**
 * Register custom rewrite rules used by migrated dynamic routes.
 *
 * @return void
 */
function hdc_register_rewrite_rules() {
	add_rewrite_rule( '^work/([A-Za-z0-9._-]+)/?$', 'index.php?hdc_work_repo=$matches[1]', 'top' );
	add_rewrite_rule( '^blog/([a-z0-9-]+)/?$', 'index.php?hdc_blog_slug=$matches[1]', 'top' );
}
add_action( 'init', 'hdc_register_rewrite_rules' );

/**
 * Add custom query vars for migrated routes.
 *
 * @param array $vars Existing query vars.
 * @return array
 */
function hdc_register_query_vars( $vars ) {
	$vars[] = 'hdc_work_repo';
	$vars[] = 'hdc_blog_slug';
	return $vars;
}
add_filter( 'query_vars', 'hdc_register_query_vars' );

/**
 * Render dedicated Work detail template when the dynamic route is matched.
 *
 * @param string $template Template path.
 * @return string
 */
function hdc_maybe_use_work_detail_template( $template ) {
	$repo = sanitize_text_field( (string) get_query_var( 'hdc_work_repo' ) );
	if ( '' === $repo ) {
		return $template;
	}

	$work_detail_template = get_stylesheet_directory() . '/page-work-detail.php';
	if ( file_exists( $work_detail_template ) ) {
		return $work_detail_template;
	}

	return $template;
}
add_filter( 'template_include', 'hdc_maybe_use_work_detail_template' );

/**
 * Render dedicated Blog detail template when /blog/{slug} is matched.
 *
 * @param string $template Template path.
 * @return string
 */
function hdc_maybe_use_blog_detail_template( $template ) {
	$slug = sanitize_title( (string) get_query_var( 'hdc_blog_slug' ) );
	if ( '' === $slug ) {
		return $template;
	}

	$blog_detail_template = get_stylesheet_directory() . '/page-blog-detail.php';
	if ( file_exists( $blog_detail_template ) ) {
		return $blog_detail_template;
	}

	return $template;
}
add_filter( 'template_include', 'hdc_maybe_use_blog_detail_template', 11 );

/**
 * Add body class with the currently resolved work repo for client-side parity.
 *
 * @param array $classes Existing body classes.
 * @return array
 */
function hdc_add_work_repo_body_class( $classes ) {
	$repo = sanitize_text_field( (string) get_query_var( 'hdc_work_repo' ) );
	if ( '' !== $repo ) {
		$classes[] = 'hdc-work-repo-' . sanitize_html_class( strtolower( $repo ) );
	}

	$blog_slug = sanitize_title( (string) get_query_var( 'hdc_blog_slug' ) );
	if ( '' !== $blog_slug ) {
		$classes[] = 'hdc-blog-slug-' . sanitize_html_class( $blog_slug );
	}

	return $classes;
}
add_filter( 'body_class', 'hdc_add_work_repo_body_class' );

/**
 * Resolve the OSOT-aligned document title for the current route.
 *
 * @return string
 */
function hdc_get_route_document_title() {
	if ( is_admin() || is_feed() ) {
		return '';
	}

	if ( is_404() ) {
		return 'Page Not Found — Henry Perkins';
	}

	$repo = sanitize_text_field( (string) get_query_var( 'hdc_work_repo' ) );
	if ( '' !== $repo ) {
		$repo_data = hdc_get_work_repository_by_name_data_contract( $repo );
		if ( is_array( $repo_data ) && ! empty( $repo_data['name'] ) ) {
			return wp_strip_all_tags( (string) $repo_data['name'] ) . ' — Henry Perkins';
		}

		return 'Project — Henry Perkins';
	}

	$blog_slug = sanitize_title( (string) get_query_var( 'hdc_blog_slug' ) );
	if ( '' !== $blog_slug ) {
		$blog_post = hdc_get_blog_post_by_slug_data_contract( $blog_slug );
		if ( is_array( $blog_post ) && ! empty( $blog_post['title'] ) ) {
			return wp_strip_all_tags( (string) $blog_post['title'] ) . ' — Henry Perkins';
		}

		return 'Post Not Found — Henry Perkins';
	}

	if ( is_front_page() ) {
		$home_contract = hdc_get_home_content_data_contract();
		return wp_strip_all_tags( (string) ( $home_contract['pageTitle'] ?? 'Henry Perkins — Technical Portfolio' ) );
	}

	if ( is_page( 'about' ) ) {
		$about_contract = hdc_get_about_content_data_contract();
		return wp_strip_all_tags( (string) ( $about_contract['pageTitle'] ?? 'About — Henry Perkins' ) );
	}

	if ( is_page( 'contact' ) ) {
		$contact_contract = hdc_get_contact_content_data_contract();
		return wp_strip_all_tags( (string) ( $contact_contract['pageTitle'] ?? 'Contact — Henry Perkins' ) );
	}

	if ( is_page( 'work' ) ) {
		return 'Work — Henry Perkins';
	}

	if ( is_page( 'resume' ) ) {
		return 'Resume — Henry Perkins';
	}

	if ( is_page( 'ats' ) || is_page( 'resume-ats' ) ) {
		return 'ATS Resume — Henry Perkins';
	}

	if ( is_page( 'hobbies' ) ) {
		return 'Hobbies — Henry Perkins';
	}

	if ( is_page( 'blog' ) ) {
		return 'Blog — Henry Perkins';
	}

	return '';
}

/**
 * Override the browser document title to match the React OSOT routes.
 *
 * @param string $pre_title Existing short-circuit title.
 * @return string
 */
function hdc_override_document_title( $pre_title ) {
	$route_title = hdc_get_route_document_title();
	return '' !== $route_title ? $route_title : $pre_title;
}
add_filter( 'pre_get_document_title', 'hdc_override_document_title', 20 );

/**
 * Output fallback favicon links when no Site Icon is configured.
 *
 * @return void
 */
function hdc_output_favicon_links() {
	if ( has_site_icon() ) {
		return;
	}

	$favicon_relative_path = '';
	$favicon_type          = 'image/png';
	$favicon_candidates    = array(
		'/assets/images/favicon.ico' => 'image/x-icon',
		'/assets/images/favicon.png' => 'image/png',
	);

	foreach ( $favicon_candidates as $candidate_path => $candidate_type ) {
		if ( file_exists( get_stylesheet_directory() . $candidate_path ) ) {
			$favicon_relative_path = $candidate_path;
			$favicon_type          = $candidate_type;
			break;
		}
	}

	if ( '' === $favicon_relative_path ) {
		return;
	}

	$favicon_url = get_stylesheet_directory_uri() . $favicon_relative_path;
	printf(
		'<link rel="icon" href="%1$s" type="%2$s" sizes="any" />' . "\n" .
		'<link rel="shortcut icon" href="%1$s" type="%2$s" />' . "\n",
		esc_url( $favicon_url ),
		esc_attr( $favicon_type )
	);
}
add_action( 'wp_head', 'hdc_output_favicon_links', 1 );
add_action( 'admin_head', 'hdc_output_favicon_links', 1 );

/**
 * Flush rewrite rules after theme switch to register migrated routes.
 *
 * @return void
 */
function hdc_flush_rewrite_rules_after_switch() {
	hdc_register_rewrite_rules();
	flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'hdc_flush_rewrite_rules_after_switch' );
