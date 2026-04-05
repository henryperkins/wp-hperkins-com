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
	'commentsEndpoint' => esc_url_raw( rest_url( 'wp/v2/comments' ) ),
	'commentSubmitEndpoint' => esc_url_raw( rest_url( 'henrys-digital-canvas/v1/blog-comments/submit' ) ),
	'commentSubmitEnabled'  => hdc_is_blog_comment_submit_enabled(),
	'turnstile'             => array(
		'action'           => 'comment',
		'siteKey'          => hdc_get_turnstile_site_key(),
		'label'            => __( 'Verification', 'henrys-digital-canvas' ),
		'hint'             => __( 'Verification helps protect the thread from spam.', 'henrys-digital-canvas' ),
		'requiredError'    => __( 'Please complete the verification check and try again.', 'henrys-digital-canvas' ),
		'unavailableError' => __( 'Verification is unavailable right now. Please use the original WordPress post for now.', 'henrys-digital-canvas' ),
		'expiredError'     => __( 'Verification expired before your comment could be posted. Please try again.', 'henrys-digital-canvas' ),
		'pendingError'     => __( 'Verification is still loading. Please wait a moment and try again.', 'henrys-digital-canvas' ),
	),
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
