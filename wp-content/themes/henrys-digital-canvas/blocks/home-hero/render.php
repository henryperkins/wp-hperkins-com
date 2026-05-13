<?php
/**
 * Server render for henrys-digital-canvas/home-hero.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$contract = function_exists( 'hdc_get_home_content_data_contract' ) ? hdc_get_home_content_data_contract() : array();
$defaults = isset( $contract['hero'] ) && is_array( $contract['hero'] ) ? $contract['hero'] : array();

$pick = static function ( $key ) use ( $attributes, $defaults ) {
	$value = isset( $attributes[ $key ] ) ? wp_strip_all_tags( (string) $attributes[ $key ] ) : '';
	if ( '' !== trim( $value ) ) {
		return $value;
	}
	return isset( $defaults[ $key ] ) ? (string) $defaults[ $key ] : '';
};

$eyebrow            = $pick( 'eyebrow' );
$title              = $pick( 'title' );
$description        = $pick( 'description' );
$primary_cta_label  = $pick( 'primaryCtaLabel' );
$primary_cta_href   = $pick( 'primaryCtaHref' );
$secondary_cta_lbl  = $pick( 'secondaryCtaLabel' );
$secondary_cta_href = $pick( 'secondaryCtaHref' );

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-home-page__hero noise hdc-reveal hdc-reveal--fade-in',
		'style' => '--reveal-index: 0;',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="hero-backdrop-editorial-amber" aria-hidden="true">
		<div class="hero-backdrop-overlay"></div>
	</div>
	<div class="hdc-home-page__hero-gradient hero-gradient-layer" aria-hidden="true"></div>
	<div class="hdc-home-page__hero-shell">
		<div class="hdc-home-page__hero-content">
			<?php if ( '' !== $eyebrow ) : ?>
				<p class="hdc-home-page__hero-eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
			<?php endif; ?>
			<h1 class="hdc-home-page__hero-title"><?php echo esc_html( $title ); ?></h1>
			<p class="hdc-home-page__hero-description"><?php echo esc_html( $description ); ?></p>
			<div class="hdc-home-page__hero-actions">
				<?php if ( '' !== $primary_cta_label ) : ?>
					<a class="hdc-home-page__button hdc-home-page__button--hero focus-ring" data-contrast-probe="hero-action-primary-home" href="<?php echo esc_url( $primary_cta_href ); ?>">
						<?php echo esc_html( $primary_cta_label ); ?>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
							<path d="M5 12h14"></path>
							<path d="m12 5 7 7-7 7"></path>
						</svg>
					</a>
				<?php endif; ?>
				<?php if ( '' !== $secondary_cta_lbl ) : ?>
					<a class="hdc-home-page__button hdc-home-page__button--secondary hdc-home-page__button--hero-secondary focus-ring" data-contrast-probe="hero-action-secondary-home" href="<?php echo esc_url( $secondary_cta_href ); ?>">
						<?php echo esc_html( $secondary_cta_lbl ); ?>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
							<path d="M5 12h14"></path>
							<path d="m12 5 7 7-7 7"></path>
						</svg>
					</a>
				<?php endif; ?>
			</div>
		</div>
	</div>
</section>
