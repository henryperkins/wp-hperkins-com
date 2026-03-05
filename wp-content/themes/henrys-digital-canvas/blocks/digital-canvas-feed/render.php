<?php
/**
 * Server render for the Digital Canvas Feed block.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$defaults = array(
	'heading'        => 'Featured Work and Recent Writing',
	'showBlog'       => true,
	'showRepos'      => true,
	'blogCount'      => 3,
	'repoCount'      => 4,
	'postsEndpoint'  => '',
	'openInNewTab'   => false,
);

$attrs = wp_parse_args( $attributes, $defaults );

$config = array(
	'heading'        => sanitize_text_field( $attrs['heading'] ),
	'showBlog'       => (bool) $attrs['showBlog'],
	'showRepos'      => (bool) $attrs['showRepos'],
	'blogCount'      => max( 1, min( 10, (int) $attrs['blogCount'] ) ),
	'repoCount'      => max( 1, min( 10, (int) $attrs['repoCount'] ) ),
	'postsEndpoint'  => esc_url_raw( (string) $attrs['postsEndpoint'] ),
	'blogEndpoint'   => esc_url_raw( add_query_arg( 'limit', max( 1, min( 10, (int) $attrs['blogCount'] ) ), rest_url( 'henrys-digital-canvas/v1/blog' ) ) ),
	'workEndpoint'   => esc_url_raw( add_query_arg( 'limit', max( 1, min( 10, (int) $attrs['repoCount'] ) ), rest_url( 'henrys-digital-canvas/v1/work' ) ) ),
	'openInNewTab'   => (bool) $attrs['openInNewTab'],
);

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-digital-canvas-feed',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>">
	<div class="hdc-feed-shell" data-hdc-feed-root>
		<p class="hdc-feed-loading">
			<?php esc_html_e( 'Loading feed…', 'henrys-digital-canvas' ); ?>
		</p>
	</div>
</section>
