<?php
/**
 * Server render for Resume ATS block.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$defaults = array(
	'heading'         => 'ATS one-page resume',
	'showPrintButton' => true,
	'showBackLink'    => true,
);

$attrs = wp_parse_args( $attributes, $defaults );

$config = array(
	'heading'         => sanitize_text_field( $attrs['heading'] ),
	'showPrintButton' => (bool) $attrs['showPrintButton'],
	'showBackLink'    => (bool) $attrs['showBackLink'],
	'endpoint'        => esc_url_raw( rest_url( 'henrys-digital-canvas/v1/resume-ats' ) ),
	'fallbackUrl'     => esc_url_raw( get_theme_file_uri( 'data/resume-ats.json' ) ),
	'resumeUrl'       => esc_url_raw( home_url( '/resume/' ) ),
);

$inline_fallback_path = get_theme_file_path( 'data/resume-ats.json' );
$inline_fallback_json = '';
if ( file_exists( $inline_fallback_path ) && is_readable( $inline_fallback_path ) ) {
	$inline_fallback_contents = file_get_contents( $inline_fallback_path ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	if ( false !== $inline_fallback_contents ) {
		$inline_fallback_json = (string) $inline_fallback_contents;
	}
}

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-resume-ats',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>"<?php if ( '' !== $inline_fallback_json ) : ?> data-fallback-payload="<?php echo esc_attr( $inline_fallback_json ); ?>"<?php endif; ?>>
	<div class="hdc-resume-ats__shell" data-hdc-resume-ats-root>
		<?php if ( '' === $inline_fallback_json ) : ?>
			<p class="hdc-resume-ats__status"><?php esc_html_e( 'Loading ATS resume…', 'henrys-digital-canvas' ); ?></p>
		<?php endif; ?>
	</div>
</section>
