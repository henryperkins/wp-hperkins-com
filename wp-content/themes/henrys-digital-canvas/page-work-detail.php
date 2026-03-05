<?php
/**
 * Template for dynamic work detail route (/work/{repo}).
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$repo = sanitize_text_field( (string) get_query_var( 'hdc_work_repo' ) );

$block_attributes = wp_json_encode(
	array(
		'repo'                => $repo,
		'showBackLink'        => true,
		'showWhenMissingRepo' => true,
	)
);
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<?php echo do_blocks( '<!-- wp:template-part {"slug":"header","tagName":"header"} /-->' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
<main class="wp-block-group hdc-work-detail-template-main">
	<?php echo do_blocks( '<!-- wp:henrys-digital-canvas/work-detail ' . $block_attributes . ' /-->' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</main>
<?php echo do_blocks( '<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
<?php wp_footer(); ?>
</body>
</html>
