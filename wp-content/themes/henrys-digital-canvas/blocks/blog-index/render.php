<?php
/**
 * Server render for Blog Index block.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$defaults = array(
	'heading'           => 'Blog',
	'description'       => 'Writing on customer-facing engineering, AI workflows, WordPress delivery, and support-to-implementation systems.',
	'showNewsletterCta' => true,
);

$attrs = wp_parse_args( $attributes, $defaults );

$config = array(
	'heading'           => sanitize_text_field( $attrs['heading'] ),
	'description'       => sanitize_text_field( $attrs['description'] ),
	'showNewsletterCta' => (bool) $attrs['showNewsletterCta'],
	'endpoint'          => esc_url_raw( add_query_arg( 'limit', 100, rest_url( 'henrys-digital-canvas/v1/blog' ) ) ),
	'fallbackUrl'       => esc_url_raw( get_theme_file_uri( 'data/blog-posts-fallback.json' ) ),
	'blogBaseUrl'       => esc_url_raw( home_url( '/blog/' ) ),
	'contactUrl'        => esc_url_raw( home_url( '/contact/' ) ),
	'linkedinUrl'       => 'https://linkedin.com/in/henryperkins',
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
		'class' => 'hdc-blog-index',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>"<?php if ( '' !== $inline_fallback_json ) : ?> data-fallback-payload="<?php echo esc_attr( $inline_fallback_json ); ?>"<?php endif; ?>>
	<div class="hdc-blog-index__shell" data-hdc-blog-index-root>
		<p class="hdc-blog-index__status"><?php esc_html_e( 'Loading posts…', 'henrys-digital-canvas' ); ?></p>
	</div>
</section>
