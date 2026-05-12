<?php
/**
 * Server render for henrys-digital-canvas/home-resume-snapshot.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$contract = function_exists( 'hdc_get_home_content_data_contract' ) ? hdc_get_home_content_data_contract() : array();
$defaults = isset( $contract['resumeSnapshot'] ) && is_array( $contract['resumeSnapshot'] ) ? $contract['resumeSnapshot'] : array();

$pick_string = static function ( $key ) use ( $attributes, $defaults ) {
	$value = isset( $attributes[ $key ] ) ? wp_strip_all_tags( (string) $attributes[ $key ] ) : '';
	if ( '' !== trim( $value ) ) {
		return $value;
	}
	return isset( $defaults[ $key ] ) ? (string) $defaults[ $key ] : '';
};

$pick_string_list = static function ( $key ) use ( $attributes, $defaults ) {
	$source = isset( $attributes[ $key ] ) && is_array( $attributes[ $key ] ) && ! empty( $attributes[ $key ] )
		? $attributes[ $key ]
		: ( isset( $defaults[ $key ] ) && is_array( $defaults[ $key ] ) ? $defaults[ $key ] : array() );
	return array_values(
		array_filter(
			array_map(
				static function ( $item ) {
					$value = trim( wp_strip_all_tags( (string) $item ) );
					return '' !== $value ? $value : null;
				},
				$source
			)
		)
	);
};

$pick_action_links = static function () use ( $attributes, $defaults ) {
	$source = isset( $attributes['actionLinks'] ) && is_array( $attributes['actionLinks'] ) && ! empty( $attributes['actionLinks'] )
		? $attributes['actionLinks']
		: ( isset( $defaults['actionLinks'] ) && is_array( $defaults['actionLinks'] ) ? $defaults['actionLinks'] : array() );
	$normalized = array();
	foreach ( $source as $item ) {
		if ( ! is_array( $item ) ) {
			continue;
		}
		$label = trim( wp_strip_all_tags( (string) ( $item['label'] ?? '' ) ) );
		$href  = trim( (string) ( $item['href'] ?? '' ) );
		if ( '' === $label || '' === $href ) {
			continue;
		}
		$normalized[] = array(
			'label' => $label,
			'href'  => esc_url_raw( $href ),
		);
	}
	return $normalized;
};

$resume_endpoint = isset( $attributes['resumeEndpoint'] ) ? trim( (string) $attributes['resumeEndpoint'] ) : '';
if ( '' === $resume_endpoint ) {
	$resume_endpoint = esc_url_raw( rest_url( 'henrys-digital-canvas/v1/resume' ) );
}

$initial_resume = function_exists( 'hdc_get_resume_data_contract' ) ? hdc_get_resume_data_contract() : array();
if ( ! is_array( $initial_resume ) ) {
	$initial_resume = array();
}

$config = array(
	'title'               => $pick_string( 'title' ),
	'actionLabel'         => $pick_string( 'actionLabel' ),
	'actionHref'          => esc_url_raw( $pick_string( 'actionHref' ) ),
	'positioningEyebrow'  => $pick_string( 'positioningEyebrow' ),
	'label'               => $pick_string( 'label' ),
	'items'               => $pick_string_list( 'items' ),
	'bestFitEyebrow'      => $pick_string( 'bestFitEyebrow' ),
	'bestFitTitle'        => $pick_string( 'bestFitTitle' ),
	'focusAreas'          => $pick_string_list( 'focusAreas' ),
	'actionLinks'         => $pick_action_links(),
	'resumeEndpoint'      => $resume_endpoint,
	'initialResume'       => $initial_resume,
);

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-home-page__section hdc-home-page__section--resume',
		'id'    => 'resume-snapshot',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>" data-hdc-home-resume-snapshot>
	<header class="hdc-home-page__section-header">
		<h2 class="hdc-home-page__section-title"><?php echo esc_html( $config['title'] ); ?></h2>
		<?php if ( '' !== $config['actionLabel'] ) : ?>
			<a class="hdc-home-page__section-link focus-ring" href="<?php echo esc_url( $config['actionHref'] ); ?>">
				<?php echo esc_html( $config['actionLabel'] ); ?>
				<span aria-hidden="true" class="hdc-home-page__action-icon">
					<svg class="hdc-home-page__action-icon-svg" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
						<path d="M5 12h14"></path>
						<path d="m12 5 7 7-7 7"></path>
					</svg>
				</span>
			</a>
		<?php endif; ?>
	</header>
	<div class="hdc-home-page__resume-grid" data-hdc-home-resume-grid>
		<p class="hdc-home-page__status"><?php esc_html_e( 'Loading resume snapshot...', 'henrys-digital-canvas' ); ?></p>
	</div>
</section>
