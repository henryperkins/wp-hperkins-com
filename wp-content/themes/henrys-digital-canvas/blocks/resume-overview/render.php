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
	'intro'       => 'Customer-facing technical consultant profile, impact highlights, and experience timeline.',
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
	'portfolioUrl'=> esc_url_raw( 'https://hperkins.com' ),
);

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-resume-overview',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>">
	<div class="hdc-resume-overview__shell" data-hdc-resume-overview-root>
		<p class="hdc-resume-overview__status"><?php esc_html_e( 'Loading resume…', 'henrys-digital-canvas' ); ?></p>
	</div>
</section>
