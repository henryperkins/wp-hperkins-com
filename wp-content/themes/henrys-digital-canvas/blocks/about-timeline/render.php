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
	'showValues'   => true,
	'showTimeline' => true,
);

$attrs = wp_parse_args( $attributes, $defaults );
$about_content = hdc_get_about_content_data_contract();

$config = array(
	'heading'         => sanitize_text_field( (string) ( $about_content['heading'] ?? 'About Henry Perkins' ) ),
	'heroDescription' => sanitize_text_field(
		(string) ( $about_content['heroDescription'] ?? 'Customer-facing technical consultant focused on AI-assisted workflows, WordPress delivery, and practical systems that help support and product teams work more clearly.' )
	),
	'intro'           => isset( $about_content['intro'] ) && is_array( $about_content['intro'] ) ? array_values( $about_content['intro'] ) : array(),
	'profile'         => isset( $about_content['profile'] ) && is_array( $about_content['profile'] ) ? $about_content['profile'] : array(),
	'sectionLabels' => isset( $about_content['sectionLabels'] ) && is_array( $about_content['sectionLabels'] ) ? $about_content['sectionLabels'] : array(),
	'capabilities'  => isset( $about_content['capabilities'] ) && is_array( $about_content['capabilities'] ) ? array_values( $about_content['capabilities'] ) : array(),
	'valueCards'    => isset( $about_content['valueCards'] ) && is_array( $about_content['valueCards'] ) ? array_values( $about_content['valueCards'] ) : array(),
	'timeline'      => isset( $about_content['timeline'] ) && is_array( $about_content['timeline'] ) ? array_values( $about_content['timeline'] ) : array(),
	'showValues'    => (bool) $attrs['showValues'],
	'showTimeline'  => (bool) $attrs['showTimeline'],
);

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-about-timeline',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>">
	<div class="hdc-about-timeline__mount" data-hdc-about-timeline-root>
		<p class="hdc-about-timeline__status"><?php esc_html_e( 'Loading about page…', 'henrys-digital-canvas' ); ?></p>
	</div>
</section>
