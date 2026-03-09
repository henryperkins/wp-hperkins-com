<?php
/**
 * Server render for About Timeline block.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$defaults = array(
	'heading'      => 'About Henry Perkins',
	'showValues'   => true,
	'showTimeline' => true,
);

$attrs = wp_parse_args( $attributes, $defaults );
$about_content = hdc_get_about_content_data_contract();

$config = array(
	'pageTitle'    => sanitize_text_field( (string) ( $about_content['pageTitle'] ?? 'About — Henry Perkins' ) ),
	'heading'      => sanitize_text_field( $attrs['heading'] ),
	'intro'        => isset( $about_content['intro'] ) && is_array( $about_content['intro'] ) ? array_values( $about_content['intro'] ) : array(),
	'profile'      => isset( $about_content['profile'] ) && is_array( $about_content['profile'] ) ? $about_content['profile'] : array(),
	'sectionLabels' => isset( $about_content['sectionLabels'] ) && is_array( $about_content['sectionLabels'] ) ? $about_content['sectionLabels'] : array(),
	'valueCards'   => isset( $about_content['valueCards'] ) && is_array( $about_content['valueCards'] ) ? array_values( $about_content['valueCards'] ) : array(),
	'timeline'     => isset( $about_content['timeline'] ) && is_array( $about_content['timeline'] ) ? array_values( $about_content['timeline'] ) : array(),
	'showValues'   => (bool) $attrs['showValues'],
	'showTimeline' => (bool) $attrs['showTimeline'],
);

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-about-timeline',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>">
	<div class="hdc-about-timeline__shell" data-hdc-about-timeline-root>
		<p class="hdc-about-timeline__status"><?php esc_html_e( 'Loading profile…', 'henrys-digital-canvas' ); ?></p>
	</div>
</section>
