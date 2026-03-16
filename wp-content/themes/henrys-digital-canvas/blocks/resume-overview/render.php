<?php
/**
 * Server render for Resume Overview block.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$defaults = array(
	'heading'     => 'Resume',
	'intro'       => '',
	'showAtsLink' => true,
);

$attrs = wp_parse_args( $attributes, $defaults );

$config = array(
	'heading'     => sanitize_text_field( $attrs['heading'] ),
	'intro'       => sanitize_text_field( $attrs['intro'] ),
	'showAtsLink' => (bool) $attrs['showAtsLink'],
	'endpoint'    => esc_url_raw( rest_url( 'henrys-digital-canvas/v1/resume' ) ),
	'fallbackUrl' => esc_url_raw( get_theme_file_uri( 'data/resume.json' ) ),
	'atsUrl'      => esc_url_raw( home_url( '/resume/ats/' ) ),
	'themeUri'    => esc_url_raw( get_stylesheet_directory_uri() ),
);

$inline_payload_path = get_theme_file_path( 'data/resume.json' );
$inline_payload_json = '';
if ( file_exists( $inline_payload_path ) && is_readable( $inline_payload_path ) ) {
	$inline_payload_contents = file_get_contents( $inline_payload_path ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	if ( false !== $inline_payload_contents ) {
		$inline_payload_json = (string) $inline_payload_contents;
	}
}

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-resume-overview',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>"<?php if ( '' !== $inline_payload_json ) : ?> data-inline-payload="<?php echo esc_attr( $inline_payload_json ); ?>"<?php endif; ?>>
	<div class="hdc-resume-overview__shell" data-hdc-resume-overview-root>
		<?php if ( '' === $inline_payload_json ) : ?>
			<p class="hdc-resume-overview__status"><?php esc_html_e( 'Loading resume…', 'henrys-digital-canvas' ); ?></p>
		<?php endif; ?>
	</div>
</section>
