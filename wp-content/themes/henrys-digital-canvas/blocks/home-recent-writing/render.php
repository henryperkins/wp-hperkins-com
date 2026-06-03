<?php
/**
 * Server render for henrys-digital-canvas/home-recent-writing.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$contract = function_exists( 'hdc_get_home_content_data_contract' ) ? hdc_get_home_content_data_contract() : array();
$defaults = isset( $contract['recentWriting'] ) && is_array( $contract['recentWriting'] ) ? $contract['recentWriting'] : array();

$pick = static function ( $key ) use ( $attributes, $defaults ) {
	$value = isset( $attributes[ $key ] ) ? wp_strip_all_tags( (string) $attributes[ $key ] ) : '';
	if ( '' !== trim( $value ) ) {
		return $value;
	}
	return isset( $defaults[ $key ] ) ? (string) $defaults[ $key ] : '';
};

$blog_count = isset( $attributes['blogCount'] ) ? (int) $attributes['blogCount'] : 3;
$blog_count = max( 1, min( 6, $blog_count ) );

$blog_endpoint = isset( $attributes['blogEndpoint'] ) ? trim( (string) $attributes['blogEndpoint'] ) : '';
if ( '' === $blog_endpoint ) {
	$blog_endpoint = esc_url_raw( add_query_arg( 'limit', $blog_count, rest_url( 'henrys-digital-canvas/v1/blog' ) ) );
}

$initial_posts = function_exists( 'hdc_get_blog_posts_data_contract' ) ? hdc_get_blog_posts_data_contract( $blog_count ) : array();
if ( isset( $initial_posts['posts'] ) && is_array( $initial_posts['posts'] ) ) {
	$initial_posts['posts'] = array_values(
		array_map(
			static function ( $post ) {
				if ( ! is_array( $post ) ) {
					return array();
				}
				return array(
					'id'                  => isset( $post['id'] ) ? (int) $post['id'] : 0,
					'slug'                => sanitize_title( (string) ( $post['slug'] ?? '' ) ),
					'title'               => html_entity_decode( sanitize_text_field( (string) ( $post['title'] ?? '' ) ), ENT_QUOTES, 'UTF-8' ),
					'excerpt'             => sanitize_text_field( (string) ( $post['excerpt'] ?? '' ) ),
					'date'                => sanitize_text_field( (string) ( $post['date'] ?? '' ) ),
					'readingTime'         => sanitize_text_field( (string) ( $post['readingTime'] ?? '' ) ),
					'url'                 => esc_url_raw( (string) ( $post['url'] ?? '' ) ),
					'featuredImageUrl'    => esc_url_raw( (string) ( $post['featuredImageUrl'] ?? '' ) ),
					'featuredImageAlt'    => sanitize_text_field( (string) ( $post['featuredImageAlt'] ?? '' ) ),
					'featuredImageSrcSet' => trim( wp_strip_all_tags( (string) ( $post['featuredImageSrcSet'] ?? '' ) ) ),
					'featuredImageWidth'  => isset( $post['featuredImageWidth'] ) ? (int) $post['featuredImageWidth'] : 0,
					'featuredImageHeight' => isset( $post['featuredImageHeight'] ) ? (int) $post['featuredImageHeight'] : 0,
				);
			},
			$initial_posts['posts']
		)
	);
}

$config = array(
	'title'            => $pick( 'title' ),
	'actionLabel'      => $pick( 'actionLabel' ),
	'actionHref'       => esc_url_raw( $pick( 'actionHref' ) ),
	'emptyTitle'       => $pick( 'emptyTitle' ),
	'emptyDescription' => $pick( 'emptyDescription' ),
	'errorTitle'       => $pick( 'errorTitle' ),
	'errorDescription' => $pick( 'errorDescription' ),
	'blogCount'        => $blog_count,
	'blogEndpoint'     => $blog_endpoint,
	'initialPosts'     => is_array( $initial_posts ) ? $initial_posts : array(),
);

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-home-page__section hdc-home-page__section--writing hdc-feed-section',
		'id'    => 'recent-writing',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>" data-hdc-home-recent-writing>
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
	<div class="hdc-home-page__post-stack" data-hdc-home-recent-writing-stack>
		<p class="hdc-home-page__status"><?php esc_html_e( 'Loading recent writing...', 'henrys-digital-canvas' ); ?></p>
	</div>
</section>
