<?php
/**
 * Server render for Work Detail block.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$defaults = array(
	'repo'                => '',
	'showBackLink'        => true,
	'showWhenMissingRepo' => false,
);

$attrs = wp_parse_args( $attributes, $defaults );

$query_repo = sanitize_text_field( (string) get_query_var( 'hdc_work_repo' ) );
$attr_repo  = sanitize_text_field( (string) $attrs['repo'] );
$resolved_repo = '' !== $attr_repo ? $attr_repo : $query_repo;

$config = array(
	'repo'                => $resolved_repo,
	'showBackLink'        => (bool) $attrs['showBackLink'],
	'showWhenMissingRepo' => (bool) $attrs['showWhenMissingRepo'],
	'endpointBase'        => esc_url_raw( rest_url( 'henrys-digital-canvas/v1/work/' ) ),
	'workEndpoint'        => esc_url_raw( add_query_arg( 'limit', 100, rest_url( 'henrys-digital-canvas/v1/work' ) ) ),
	'workIndexUrl'        => esc_url_raw( home_url( '/work/' ) ),
	'contactUrl'          => esc_url_raw( home_url( '/contact/' ) ),
);

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-work-detail',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>">
	<div class="hdc-work-detail__shell" data-hdc-work-detail-root>
		<p class="hdc-work-detail__status"><?php esc_html_e( 'Loading project details…', 'henrys-digital-canvas' ); ?></p>
	</div>
</section>
