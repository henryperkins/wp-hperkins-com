<?php
/**
 * Server render for Blog Post block.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$defaults = array(
	'slug'          => '',
	'showProgress'  => true,
	'showScrollTop' => true,
);

$attrs = wp_parse_args( $attributes, $defaults );

$config = array(
	'slug'          => sanitize_title( (string) $attrs['slug'] ),
	'showProgress'  => (bool) $attrs['showProgress'],
	'showScrollTop' => (bool) $attrs['showScrollTop'],
	'endpointBase'  => esc_url_raw( rest_url( 'henrys-digital-canvas/v1/blog/' ) ),
	'postsEndpoint' => esc_url_raw( add_query_arg( 'limit', 100, rest_url( 'henrys-digital-canvas/v1/blog' ) ) ),
	'fallbackUrl'   => esc_url_raw( get_theme_file_uri( 'data/blog-posts-fallback.json' ) ),
	'blogIndexUrl'  => esc_url_raw( home_url( '/blog/' ) ),
);

$inline_fallback_path = get_theme_file_path( 'data/blog-posts-fallback.json' );
$inline_fallback_json = '';
if ( file_exists( $inline_fallback_path ) && is_readable( $inline_fallback_path ) ) {
	$inline_fallback_contents = file_get_contents( $inline_fallback_path ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	if ( false !== $inline_fallback_contents ) {
		$inline_fallback_json = (string) $inline_fallback_contents;
	}
}

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-blog-post',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>"<?php if ( '' !== $inline_fallback_json ) : ?> data-fallback-payload="<?php echo esc_attr( $inline_fallback_json ); ?>"<?php endif; ?>>
	<div class="hdc-blog-post__shell" data-hdc-blog-post-root>
		<div class="hdc-blog-post__state-card is-loading" data-hdc-blog-post-loading>
			<span class="hdc-blog-post__state-icon is-loading" aria-hidden="true"></span>
			<h2 class="hdc-blog-post__state-title"><?php esc_html_e( 'Loading', 'henrys-digital-canvas' ); ?></h2>
			<p class="hdc-blog-post__state-description"><?php esc_html_e( 'Please wait while this article is loaded.', 'henrys-digital-canvas' ); ?></p>
		</div>
	</div>
</section>
