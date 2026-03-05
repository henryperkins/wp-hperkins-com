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
	'heading'         => 'ATS One-Page Resume',
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

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-resume-ats',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>">
	<div class="hdc-resume-ats__shell" data-hdc-resume-ats-root>
		<p class="hdc-resume-ats__status"><?php esc_html_e( 'Loading ATS resume…', 'henrys-digital-canvas' ); ?></p>
	</div>
</section>
