<?php
/**
 * Server render for the home-page wrapper. Inner content is rendered children.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$home_content       = $content;
$is_legacy_fallback = '' === trim( $home_content );
$wrapper_classes    = 'hdc-home-page';

if ( $is_legacy_fallback ) {
	$wrapper_classes .= ' alignfull';
}

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => $wrapper_classes,
	)
);

if ( $is_legacy_fallback && function_exists( 'hdc_build_home_page_child_block_markup' ) ) {
	$home_content = do_blocks( hdc_build_home_page_child_block_markup() );
}
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="hdc-home-page__shell">
		<?php echo $home_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</div>
</section>
