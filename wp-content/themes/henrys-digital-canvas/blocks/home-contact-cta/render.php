<?php
/**
 * Server render for henrys-digital-canvas/home-contact-cta.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$contract = function_exists( 'hdc_get_home_content_data_contract' ) ? hdc_get_home_content_data_contract() : array();
$defaults = isset( $contract['contactCta'] ) && is_array( $contract['contactCta'] ) ? $contract['contactCta'] : array();

$pick = static function ( $key ) use ( $attributes, $defaults ) {
	$value = isset( $attributes[ $key ] ) ? wp_strip_all_tags( (string) $attributes[ $key ] ) : '';
	if ( '' !== trim( $value ) ) {
		return $value;
	}
	return isset( $defaults[ $key ] ) ? (string) $defaults[ $key ] : '';
};

$eyebrow = $pick( 'eyebrow' );
$title   = $pick( 'title' );
$desc    = $pick( 'description' );
$plabel  = $pick( 'primaryCtaLabel' );
$phref   = $pick( 'primaryCtaHref' );
$slabel  = $pick( 'secondaryCtaLabel' );
$shref   = $pick( 'secondaryCtaHref' );

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-home-page__section',
		'id'    => 'contact-cta',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="hdc-home-page__cta-card surface-library-ember-veil">
		<div class="hdc-home-page__cta-layout">
			<div class="hdc-home-page__cta-body">
				<?php if ( '' !== $eyebrow ) : ?>
					<p class="hdc-home-page__eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
				<?php endif; ?>
				<h2 class="hdc-home-page__section-title"><?php echo esc_html( $title ); ?></h2>
				<p class="hdc-home-page__copy"><?php echo esc_html( $desc ); ?></p>
			</div>
			<div class="hdc-home-page__cta-actions">
				<?php if ( '' !== $plabel ) : ?>
					<a class="hdc-home-page__button focus-ring" href="<?php echo esc_url( $phref ); ?>">
						<?php echo esc_html( $plabel ); ?>
					</a>
				<?php endif; ?>
				<?php if ( '' !== $slabel ) : ?>
					<a class="hdc-home-page__button hdc-home-page__button--secondary focus-ring" href="<?php echo esc_url( $shref ); ?>">
						<?php echo esc_html( $slabel ); ?>
					</a>
				<?php endif; ?>
			</div>
		</div>
	</div>
</section>
