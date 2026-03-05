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

$config = array(
	'heading'      => sanitize_text_field( $attrs['heading'] ),
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
