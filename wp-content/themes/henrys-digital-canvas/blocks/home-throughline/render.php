<?php
/**
 * Server render for henrys-digital-canvas/home-throughline.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$contract = function_exists( 'hdc_get_home_content_data_contract' ) ? hdc_get_home_content_data_contract() : array();
$defaults = isset( $contract['throughline'] ) && is_array( $contract['throughline'] ) ? $contract['throughline'] : array();

$title = '';
if ( isset( $attributes['title'] ) && '' !== trim( wp_strip_all_tags( (string) $attributes['title'] ) ) ) {
	$title = (string) $attributes['title'];
} elseif ( isset( $defaults['title'] ) ) {
	$title = (string) $defaults['title'];
}

$attr_paragraphs = isset( $attributes['paragraphs'] ) && is_array( $attributes['paragraphs'] ) ? $attributes['paragraphs'] : array();
$default_paras   = isset( $defaults['paragraphs'] ) && is_array( $defaults['paragraphs'] ) ? $defaults['paragraphs'] : array();
$paragraphs      = ! empty( $attr_paragraphs ) ? $attr_paragraphs : $default_paras;
$paragraphs      = array_values(
	array_filter(
		array_map(
			static function ( $paragraph ) {
				$value = trim( wp_strip_all_tags( (string) $paragraph ) );
				return '' !== $value ? $value : null;
			},
			$paragraphs
		)
	)
);

$attr_quote    = isset( $attributes['quote'] ) && is_array( $attributes['quote'] ) ? $attributes['quote'] : array();
$default_quote = isset( $defaults['quote'] ) && is_array( $defaults['quote'] ) ? $defaults['quote'] : array();
$pick_quote    = static function ( $key ) use ( $attr_quote, $default_quote ) {
	$value = isset( $attr_quote[ $key ] ) ? trim( wp_strip_all_tags( (string) $attr_quote[ $key ] ) ) : '';
	if ( '' !== $value ) {
		return $value;
	}
	return isset( $default_quote[ $key ] ) ? (string) $default_quote[ $key ] : '';
};

$quote_text = $pick_quote( 'text' );
$quote_attr = $pick_quote( 'attribution' );
$quote_brow = $pick_quote( 'eyebrow' );

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-home-page__section hdc-home-page__section--throughline',
		'id'    => 'throughline',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="hdc-reveal hdc-reveal--fade-in" style="--reveal-index: 0;">
		<h2 class="hdc-home-page__section-title hdc-home-page__section-title--intro"><?php echo esc_html( $title ); ?></h2>
	</div>
	<div class="hdc-home-page__throughline-grid">
		<div class="hdc-home-page__throughline-story surface-library-learning-paper">
			<div class="hdc-home-page__throughline-narrative">
				<?php foreach ( $paragraphs as $paragraph ) : ?>
					<p class="hdc-home-page__throughline-paragraph"><?php echo esc_html( $paragraph ); ?></p>
				<?php endforeach; ?>
			</div>
		</div>
		<?php if ( '' !== $quote_text ) : ?>
			<div class="hdc-reveal" style="--reveal-index: 1;">
				<div class="hdc-home-page__throughline-quote-card surface-library-ember-topography">
					<div class="hdc-home-page__throughline-quote-header">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
							<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
							<path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
						</svg>
						<?php if ( '' !== $quote_brow ) : ?>
							<span class="hdc-home-page__eyebrow"><?php echo esc_html( $quote_brow ); ?></span>
						<?php endif; ?>
					</div>
					<blockquote class="hdc-home-page__throughline-blockquote">
						<p class="hdc-home-page__throughline-quote-text">&ldquo;<?php echo esc_html( $quote_text ); ?>&rdquo;</p>
						<footer class="hdc-home-page__throughline-quote-footer"><?php echo esc_html( $quote_attr ); ?></footer>
					</blockquote>
				</div>
			</div>
		<?php endif; ?>
	</div>
</section>
