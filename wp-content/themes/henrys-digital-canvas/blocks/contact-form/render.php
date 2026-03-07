<?php
/**
 * Server render for Contact Form block.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$contact_content = hdc_get_contact_content_data_contract();
$social_links    = hdc_get_social_links_data_contract();
$form_content    = isset( $contact_content['form'] ) && is_array( $contact_content['form'] ) ? $contact_content['form'] : array();
$defaults        = array(
	'heading'         => (string) ( $contact_content['heading'] ?? 'Contact' ),
	'description'     => (string) ( $contact_content['description'] ?? 'Open to US remote roles and consulting conversations.' ),
	'showSocialLinks' => true,
	'submitLabel'     => (string) ( $form_content['submitLabel'] ?? 'Send Message' ),
	'submittingLabel' => (string) ( $form_content['submittingLabel'] ?? 'Sending…' ),
);

$attrs = wp_parse_args( $attributes, $defaults );

$config = array(
	'pageTitle'       => sanitize_text_field( (string) ( $contact_content['pageTitle'] ?? 'Contact — Henry Perkins' ) ),
	'heading'         => sanitize_text_field( $attrs['heading'] ),
	'description'     => sanitize_text_field( $attrs['description'] ),
	'guidance'        => isset( $contact_content['guidance'] ) && is_array( $contact_content['guidance'] ) ? $contact_content['guidance'] : array(),
	'form'            => $form_content,
	'showSocialLinks' => (bool) $attrs['showSocialLinks'],
	'submitLabel'     => sanitize_text_field( $attrs['submitLabel'] ),
	'submittingLabel' => sanitize_text_field( $attrs['submittingLabel'] ),
	'endpoint'        => esc_url_raw( home_url( '/api/contact' ) ),
	'restEndpoint'    => esc_url_raw( rest_url( 'henrys-digital-canvas/v1/contact' ) ),
	'socialLinks'     => is_array( $social_links ) ? array_values( $social_links ) : array(),
	'turnstile'       => array(
		'action'    => 'contact',
		'siteKey'   => hdc_get_turnstile_site_key(),
		'label'     => sanitize_text_field( (string) ( $form_content['labels']['verification'] ?? 'Verification' ) ),
		'hint'      => sanitize_text_field( (string) ( $form_content['hints']['verification'] ?? 'Complete the verification check before sending.' ) ),
		'requiredError' => sanitize_text_field( (string) ( $form_content['turnstileRequiredError'] ?? 'Please complete the verification check and try again.' ) ),
		'unavailableError' => sanitize_text_field( (string) ( $form_content['turnstileUnavailableError'] ?? 'Verification is unavailable right now. Please try again later.' ) ),
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
