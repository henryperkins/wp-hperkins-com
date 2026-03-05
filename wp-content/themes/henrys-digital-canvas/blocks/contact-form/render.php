<?php
/**
 * Server render for Contact Form block.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$defaults = array(
	'heading'         => 'Contact',
	'description'     => 'Open to US remote opportunities and consulting engagements. Reach out if you want help with customer-facing technical workflows, web delivery, or AI integrations.',
	'showSocialLinks' => true,
	'submitLabel'     => 'Send Message',
	'submittingLabel' => 'Sending…',
);

$attrs = wp_parse_args( $attributes, $defaults );

$config = array(
	'heading'         => sanitize_text_field( $attrs['heading'] ),
	'description'     => sanitize_text_field( $attrs['description'] ),
	'showSocialLinks' => (bool) $attrs['showSocialLinks'],
	'submitLabel'     => sanitize_text_field( $attrs['submitLabel'] ),
	'submittingLabel' => sanitize_text_field( $attrs['submittingLabel'] ),
	'endpoint'        => esc_url_raw( home_url( '/api/contact' ) ),
	'restEndpoint'    => esc_url_raw( rest_url( 'henrys-digital-canvas/v1/contact' ) ),
	'successTitle'    => __( 'Message sent!', 'henrys-digital-canvas' ),
	'successMessage'  => __( 'Thanks for reaching out. I\'ll get back to you soon.', 'henrys-digital-canvas' ),
	'socialLinks'     => array(
		array(
			'label' => 'GitHub',
			'href'  => 'https://github.com/henryperkins',
		),
		array(
			'label' => 'LinkedIn',
			'href'  => 'https://linkedin.com/in/henryperkins',
		),
		array(
			'label' => 'Email',
			'href'  => 'mailto:henry@lakefrontdigital.io',
		),
	),
);

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-contact-form',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>">
	<div class="hdc-contact-form__shell" data-hdc-contact-form-root>
		<p class="hdc-contact-form__status"><?php esc_html_e( 'Loading form…', 'henrys-digital-canvas' ); ?></p>
	</div>
</section>
