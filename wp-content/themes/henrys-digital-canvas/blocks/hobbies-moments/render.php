<?php
/**
 * Server render for Hobbies Moments block.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$defaults = array(
	'heading'     => 'Hobbies',
	'description' => 'Outside work, I spend time building small tools, making music, and tracking what I am learning now, recently, and next.',
);

$attrs = wp_parse_args( $attributes, $defaults );

$config = array(
	'heading'     => sanitize_text_field( $attrs['heading'] ),
	'description' => sanitize_text_field( $attrs['description'] ),
	'endpoint'    => esc_url_raw( rest_url( 'henrys-digital-canvas/v1/moments' ) ),
	'fallbackUrl' => esc_url_raw( get_theme_file_uri( 'data/moments.json' ) ),
);

$inline_fallback_path = get_theme_file_path( 'data/moments.json' );
$inline_fallback_json = '';
if ( file_exists( $inline_fallback_path ) && is_readable( $inline_fallback_path ) ) {
	$inline_fallback_contents = file_get_contents( $inline_fallback_path ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	if ( false !== $inline_fallback_contents ) {
		$inline_fallback_json = (string) $inline_fallback_contents;
	}
}

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-hobbies-moments',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>"<?php if ( '' !== $inline_fallback_json ) : ?> data-fallback-payload="<?php echo esc_attr( $inline_fallback_json ); ?>"<?php endif; ?>>
	<div class="hdc-hobbies-moments__shell" data-hdc-hobbies-moments-root>
		<p class="hdc-hobbies-moments__status"><?php esc_html_e( 'Loading moments…', 'henrys-digital-canvas' ); ?></p>
	</div>
</section>
