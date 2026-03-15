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

	wp_enqueue_style(
		'hdc-background-library',
		get_stylesheet_directory_uri() . '/assets/css/background-library.css',
		array( 'hdc-design-system' ),
		hdc_asset_version( '/assets/css/background-library.css' )
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
 * Resolve the current dynamic detail route and cache the backing entity.
 *
 * @return array{
 *     type:string,
 *     blogSlug:string,
 *     workRepo:string,
 *     exists:bool,
 *     entity:?array
 * }
 */
function hdc_get_resolved_detail_route() {
	static $resolved_route = null;

	if ( null !== $resolved_route ) {
		return $resolved_route;
	}

	$resolved_route = array(
		'type'     => '',
		'blogSlug' => '',
		'workRepo' => '',
		'exists'   => false,
		'entity'   => null,
	);

	$work_repo = sanitize_text_field( (string) get_query_var( 'hdc_work_repo' ) );
	if ( '' !== $work_repo ) {
		$work_entity                = hdc_get_work_repository_by_name_data_contract( $work_repo );
		$resolved_route['type']     = 'work';
		$resolved_route['workRepo'] = $work_repo;
		$resolved_route['exists']   = is_array( $work_entity ) && ! empty( $work_entity['name'] );
		$resolved_route['entity']   = $resolved_route['exists'] ? $work_entity : null;
		return $resolved_route;
	}

	$blog_slug = sanitize_title( (string) get_query_var( 'hdc_blog_slug' ) );
	if ( '' !== $blog_slug ) {
		$blog_entity                = hdc_get_blog_post_by_slug_data_contract( $blog_slug );
		$resolved_route['type']     = 'blog';
		$resolved_route['blogSlug'] = $blog_slug;
		$resolved_route['exists']   = is_array( $blog_entity ) && ! empty( $blog_entity['slug'] );
		$resolved_route['entity']   = $resolved_route['exists'] ? $blog_entity : null;
	}

	return $resolved_route;
}

/**
 * Resolve the current blog detail entity, falling back to the raw slug query var.
 *
 * @return array|null
 */
function hdc_get_current_blog_detail_entity() {
	$route = hdc_get_resolved_detail_route();
	if ( 'blog' === $route['type'] && is_array( $route['entity'] ) && ! empty( $route['entity']['slug'] ) ) {
		return $route['entity'];
	}

	$blog_slug = sanitize_title( (string) get_query_var( 'hdc_blog_slug' ) );
	if ( '' === $blog_slug ) {
		return null;
	}

	return hdc_get_blog_post_by_slug_data_contract( $blog_slug );
}

/**
 * Mark unresolved dynamic detail routes as 404 before template selection.
 *
 * @return void
 */
function hdc_maybe_set_detail_route_404() {
	$route = hdc_get_resolved_detail_route();
	if ( '' === $route['type'] || $route['exists'] ) {
		return;
	}

	global $wp_query;

	if ( $wp_query instanceof WP_Query ) {
		$wp_query->set_404();
	}

	status_header( 404 );
	nocache_headers();
}
add_action( 'template_redirect', 'hdc_maybe_set_detail_route_404' );

/**
 * Render dedicated Work detail template when the dynamic route is matched.
 *
 * @param string $template Template path.
 * @return string
 */
function hdc_maybe_use_work_detail_template( $template ) {
	$route = hdc_get_resolved_detail_route();
	if ( 'work' !== $route['type'] || ! $route['exists'] ) {
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
	$route = hdc_get_resolved_detail_route();
	if ( 'blog' !== $route['type'] ) {
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

	$route = hdc_get_resolved_detail_route();
	if ( 'work' === $route['type'] && $route['exists'] && is_array( $route['entity'] ) ) {
		if ( ! empty( $route['entity']['name'] ) ) {
			return wp_strip_all_tags( (string) $route['entity']['name'] ) . ' — Henry Perkins';
		}
	}

	$blog_entity = hdc_get_current_blog_detail_entity();
	if ( is_array( $blog_entity ) ) {
		$title = ! empty( $blog_entity['seoTitle'] ) ? (string) $blog_entity['seoTitle'] : (string) ( $blog_entity['title'] ?? '' );
		if ( '' !== trim( $title ) ) {
			return wp_strip_all_tags( $title ) . ' — Henry Perkins';
		}
	}

	if ( 'blog' === $route['type'] ) {
		return 'Post Not Found — Henry Perkins';
	}

	if ( is_404() ) {
		return 'Page Not Found — Henry Perkins';
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
 * Disable default canonical and Jetpack OG tags for custom metadata routes.
 *
 * @return void
 */
function hdc_configure_custom_metadata_head_tags() {
	if ( is_page( 'about' ) ) {
		remove_action( 'wp_head', 'rel_canonical' );
		add_filter( 'jetpack_enable_open_graph', '__return_false', 99 );
		return;
	}

	$blog_slug = sanitize_title( (string) get_query_var( 'hdc_blog_slug' ) );
	if ( '' === $blog_slug ) {
		return;
	}

	remove_action( 'wp_head', 'rel_canonical' );
	add_filter( 'jetpack_enable_open_graph', '__return_false', 99 );
}
add_action( 'template_redirect', 'hdc_configure_custom_metadata_head_tags', 1 );

/**
 * Normalize a route-relative metadata URL into an absolute site URL.
 *
 * @param string $value Raw metadata URL.
 * @return string
 */
function hdc_get_absolute_metadata_url( $value ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return '';
	}

	if ( preg_match( '#^https?://#i', $value ) ) {
		return esc_url_raw( $value );
	}

	if ( 0 === strpos( $value, '/images/' ) ) {
		$relative_path = ltrim( substr( $value, strlen( '/images/' ) ), '/' );
		return esc_url_raw( get_theme_file_uri( 'assets/images/' . $relative_path ) );
	}

	return esc_url_raw( home_url( $value ) );
}

/**
 * Output standard route metadata from a JSON data contract.
 *
 * @param array  $metadata          Route metadata contract.
 * @param string $default_canonical Default canonical path.
 * @return void
 */
function hdc_output_standard_route_metadata( $metadata, $default_canonical = '/' ) {
	if ( ! is_array( $metadata ) || empty( $metadata ) ) {
		return;
	}

	$title       = wp_strip_all_tags( (string) ( $metadata['title'] ?? '' ) );
	$description = wp_strip_all_tags( (string) ( $metadata['description'] ?? '' ) );
	$canonical   = hdc_get_absolute_metadata_url( (string) ( $metadata['canonical'] ?? $default_canonical ) );
	$open_graph  = isset( $metadata['openGraph'] ) && is_array( $metadata['openGraph'] ) ? $metadata['openGraph'] : array();
	$twitter     = isset( $metadata['twitter'] ) && is_array( $metadata['twitter'] ) ? $metadata['twitter'] : array();

	if ( '' !== $description ) {
		printf( '<meta name="description" content="%s" />' . "\n", esc_attr( $description ) );
	}

	if ( '' !== $canonical ) {
		printf( '<link rel="canonical" href="%s" />' . "\n", esc_url( $canonical ) );
	}

	$og_title       = wp_strip_all_tags( (string) ( $open_graph['title'] ?? $title ) );
	$og_description = wp_strip_all_tags( (string) ( $open_graph['description'] ?? $description ) );
	$og_type        = sanitize_text_field( (string) ( $open_graph['type'] ?? 'website' ) );
	$og_url         = hdc_get_absolute_metadata_url( (string) ( $open_graph['url'] ?? $default_canonical ) );
	$og_image       = hdc_get_absolute_metadata_url( (string) ( $open_graph['image'] ?? '' ) );
	$og_image_alt   = wp_strip_all_tags( (string) ( $open_graph['imageAlt'] ?? '' ) );

	if ( '' !== $og_title ) {
		printf( '<meta property="og:title" content="%s" />' . "\n", esc_attr( $og_title ) );
	}
	if ( '' !== $og_description ) {
		printf( '<meta property="og:description" content="%s" />' . "\n", esc_attr( $og_description ) );
	}
	if ( '' !== $og_type ) {
		printf( '<meta property="og:type" content="%s" />' . "\n", esc_attr( $og_type ) );
	}
	if ( '' !== $og_url ) {
		printf( '<meta property="og:url" content="%s" />' . "\n", esc_url( $og_url ) );
	}
	if ( '' !== $og_image ) {
		printf( '<meta property="og:image" content="%s" />' . "\n", esc_url( $og_image ) );
	}
	if ( '' !== $og_image_alt ) {
		printf( '<meta property="og:image:alt" content="%s" />' . "\n", esc_attr( $og_image_alt ) );
	}

	$twitter_card        = sanitize_text_field( (string) ( $twitter['card'] ?? 'summary_large_image' ) );
	$twitter_title       = wp_strip_all_tags( (string) ( $twitter['title'] ?? $title ) );
	$twitter_description = wp_strip_all_tags( (string) ( $twitter['description'] ?? $description ) );
	$twitter_image       = hdc_get_absolute_metadata_url( (string) ( $twitter['image'] ?? $og_image ) );

	if ( '' !== $twitter_card ) {
		printf( '<meta name="twitter:card" content="%s" />' . "\n", esc_attr( $twitter_card ) );
	}
	if ( '' !== $twitter_title ) {
		printf( '<meta name="twitter:title" content="%s" />' . "\n", esc_attr( $twitter_title ) );
	}
	if ( '' !== $twitter_description ) {
		printf( '<meta name="twitter:description" content="%s" />' . "\n", esc_attr( $twitter_description ) );
	}
	if ( '' !== $twitter_image ) {
		printf( '<meta name="twitter:image" content="%s" />' . "\n", esc_url( $twitter_image ) );
	}
}

/**
 * Output homepage metadata that mirrors the React HOME_METADATA contract.
 *
 * @return void
 */
function hdc_output_homepage_metadata() {
	if ( ! is_front_page() || is_admin() || is_feed() ) {
		return;
	}

	$home_contract = hdc_get_home_content_data_contract();
	$metadata      = isset( $home_contract['metadata'] ) && is_array( $home_contract['metadata'] ) ? $home_contract['metadata'] : array();
	hdc_output_standard_route_metadata( $metadata, '/' );
}
add_action( 'wp_head', 'hdc_output_homepage_metadata', 5 );

/**
 * Output About page metadata aligned with the React route metadata.
 *
 * @return void
 */
function hdc_output_aboutpage_metadata() {
	if ( ! is_page( 'about' ) || is_admin() || is_feed() ) {
		return;
	}

	$about_contract = hdc_get_about_content_data_contract();
	$metadata       = isset( $about_contract['metadata'] ) && is_array( $about_contract['metadata'] ) ? $about_contract['metadata'] : array();

	hdc_output_standard_route_metadata( $metadata, '/about' );
}
add_action( 'wp_head', 'hdc_output_aboutpage_metadata', 5 );

/**
 * Output blog detail metadata aligned with the React route metadata.
 *
 * @return void
 */
function hdc_output_blog_detail_metadata() {
	if ( is_admin() || is_feed() ) {
		return;
	}

	$post = hdc_get_current_blog_detail_entity();
	if ( ! is_array( $post ) || empty( $post['slug'] ) ) {
		return;
	}

	$seo_title = wp_strip_all_tags( (string) ( $post['seoTitle'] ?? '' ) );
	$title     = '' !== trim( $seo_title )
		? $seo_title
		: wp_strip_all_tags( (string) ( $post['title'] ?? '' ) );
	if ( '' === $title ) {
		$title = 'Post Not Found';
	}

	if ( ! preg_match( '/henry perkins/i', $title ) ) {
		$title .= ' — Henry Perkins';
	}

	$seo_description = wp_strip_all_tags( (string) ( $post['seoDescription'] ?? '' ) );
	$description     = '' !== trim( $seo_description )
		? $seo_description
		: wp_strip_all_tags( (string) ( $post['excerpt'] ?? '' ) );
	if ( '' === $description ) {
		$description = 'Blog post from Henry Perkins.';
	}

	$canonical   = hdc_get_portfolio_blog_detail_url( (string) ( $post['slug'] ?? '' ) );
	$og_image    = hdc_get_absolute_metadata_url( (string) ( $post['featuredImageUrl'] ?? '/images/hero-piano-ide.png' ) );
	$og_alt      = wp_strip_all_tags( (string) ( $post['featuredImageAlt'] ?? 'Henry Perkins blog post' ) );

	printf( '<meta name="description" content="%s" />' . "\n", esc_attr( $description ) );
	printf( '<link rel="canonical" href="%s" />' . "\n", esc_url( $canonical ) );
	printf( '<meta property="og:title" content="%s" />' . "\n", esc_attr( $title ) );
	printf( '<meta property="og:description" content="%s" />' . "\n", esc_attr( $description ) );
	printf( '<meta property="og:type" content="article" />' . "\n" );
	printf( '<meta property="og:url" content="%s" />' . "\n", esc_url( $canonical ) );
	printf( '<meta property="og:image" content="%s" />' . "\n", esc_url( $og_image ) );
	printf( '<meta property="og:image:alt" content="%s" />' . "\n", esc_attr( $og_alt ) );
	printf( '<meta name="twitter:card" content="summary_large_image" />' . "\n" );
	printf( '<meta name="twitter:title" content="%s" />' . "\n", esc_attr( $title ) );
	printf( '<meta name="twitter:description" content="%s" />' . "\n", esc_attr( $description ) );
	printf( '<meta name="twitter:image" content="%s" />' . "\n", esc_url( $og_image ) );
}
add_action( 'wp_head', 'hdc_output_blog_detail_metadata', 5 );

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
