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

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-blog-post',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>">
	<div class="hdc-blog-post__shell" data-hdc-blog-post-root>
		<p class="hdc-blog-post__status"><?php esc_html_e( 'Loading post…', 'henrys-digital-canvas' ); ?></p>
	</div>
</section>
