<?php
/**
 * Server render for Blog Index block.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$blog_heading     = __( 'Blog', 'henrys-digital-canvas' );
$blog_description = __( 'Writing on customer-facing engineering, AI workflows, WordPress delivery, and support-to-implementation systems.', 'henrys-digital-canvas' );
$social_links     = function_exists( 'hdc_get_social_links_data_contract' ) ? hdc_get_social_links_data_contract() : array();
$github_url       = 'https://github.com/henryperkins';
$linkedin_url     = 'https://linkedin.com/in/henryperkins';

foreach ( $social_links as $social_link ) {
	$label = isset( $social_link['label'] ) ? sanitize_text_field( (string) $social_link['label'] ) : '';
	$href  = isset( $social_link['href'] ) ? esc_url_raw( (string) $social_link['href'] ) : '';

	if ( 'GitHub' === $label && '' !== $href ) {
		$github_url = $href;
	}

	if ( 'LinkedIn' === $label && '' !== $href ) {
		$linkedin_url = $href;
	}
}

$config = array(
	'endpoint'          => esc_url_raw( add_query_arg( 'limit', 100, rest_url( 'henrys-digital-canvas/v1/blog' ) ) ),
	'fallbackUrl'       => esc_url_raw( get_theme_file_uri( 'data/blog-posts-fallback.json' ) ),
	'blogBaseUrl'       => esc_url_raw( home_url( '/blog/' ) ),
	'contactUrl'        => esc_url_raw( home_url( '/contact/' ) ),
	'githubUrl'         => $github_url,
	'linkedinUrl'       => $linkedin_url,
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
	<div data-hdc-blog-index-root>
		<div>
			<section class="hdc-blog-index__hero ember-surface">
				<div class="hdc-blog-index__hero-inner">
					<header class="hdc-blog-index__intro">
						<p class="hdc-blog-index__eyebrow"><?php esc_html_e( 'Writing', 'henrys-digital-canvas' ); ?></p>
						<h1 class="hdc-blog-index__title"><?php echo esc_html( $blog_heading ); ?></h1>
						<p class="hdc-blog-index__description"><?php echo esc_html( $blog_description ); ?></p>
					</header>
				</div>
			</section>
			<div class="hdc-blog-index__content">
				<div class="hdc-blog-index__state-card">
					<h2 class="hdc-blog-index__state-title"><?php esc_html_e( 'Loading posts', 'henrys-digital-canvas' ); ?></h2>
					<p class="hdc-blog-index__state-description"><?php esc_html_e( 'Please wait while the latest posts are prepared.', 'henrys-digital-canvas' ); ?></p>
				</div>
			</div>
		</div>
	</div>
</section>
