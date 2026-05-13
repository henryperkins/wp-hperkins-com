<?php
/**
 * Server render for henrys-digital-canvas/home-selected-work.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$contract = function_exists( 'hdc_get_home_content_data_contract' ) ? hdc_get_home_content_data_contract() : array();
$defaults = isset( $contract['selectedWork'] ) && is_array( $contract['selectedWork'] ) ? $contract['selectedWork'] : array();

$pick = static function ( $key ) use ( $attributes, $defaults ) {
	$value = isset( $attributes[ $key ] ) ? wp_strip_all_tags( (string) $attributes[ $key ] ) : '';
	if ( '' !== trim( $value ) ) {
		return $value;
	}
	return isset( $defaults[ $key ] ) ? (string) $defaults[ $key ] : '';
};

$attr_repos   = isset( $attributes['featuredRepoNames'] ) && is_array( $attributes['featuredRepoNames'] ) ? $attributes['featuredRepoNames'] : array();
$default_repos = isset( $defaults['featuredRepoNames'] ) && is_array( $defaults['featuredRepoNames'] ) ? $defaults['featuredRepoNames'] : array();
$repos        = ! empty( $attr_repos ) ? $attr_repos : $default_repos;
$repos        = array_values( array_filter( array_map( 'sanitize_text_field', $repos ) ) );

$repo_count = isset( $attributes['repoCount'] ) ? (int) $attributes['repoCount'] : 3;
$repo_count = max( 1, min( 6, $repo_count ) );

$initial_repos = function_exists( 'hdc_read_theme_json_file' )
	? hdc_read_theme_json_file( '/blocks/work-showcase/data/repos.json', array() )
	: array();
if ( ! is_array( $initial_repos ) ) {
	$initial_repos = array();
}
$initial_repos = array_values(
	array_filter(
		array_map(
			static function ( $repo ) {
				if ( ! is_array( $repo ) || empty( $repo['name'] ) ) {
					return null;
				}
				return array(
					'name'        => sanitize_text_field( (string) $repo['name'] ),
					'displayName' => sanitize_text_field( (string) ( $repo['displayName'] ?? '' ) ),
					'description' => sanitize_text_field( (string) ( $repo['description'] ?? '' ) ),
					'language'    => sanitize_text_field( (string) ( $repo['language'] ?? '' ) ),
					'updatedAt'   => sanitize_text_field( (string) ( $repo['updatedAt'] ?? '' ) ),
					'url'         => esc_url_raw( (string) ( $repo['url'] ?? '' ) ),
					'topics'      => isset( $repo['topics'] ) && is_array( $repo['topics'] )
						? array_values( array_map( 'sanitize_text_field', $repo['topics'] ) )
						: array(),
					'featured'    => ! empty( $repo['featured'] ),
					'origin'      => sanitize_text_field( (string) ( $repo['origin'] ?? 'curated' ) ),
					'access'      => sanitize_text_field( (string) ( $repo['access'] ?? 'public' ) ),
				);
			},
			$initial_repos
		)
	)
);

$config = array(
	'title'                    => $pick( 'title' ),
	'actionLabel'             => $pick( 'actionLabel' ),
	'actionHref'              => esc_url_raw( $pick( 'actionHref' ) ),
	'featuredRepoNames'       => $repos,
	'loadingLabel'            => $pick( 'loadingLabel' ),
	'sourceLiveLabel'         => $pick( 'sourceLiveLabel' ),
	'sourceFallbackLabel'     => $pick( 'sourceFallbackLabel' ),
	'emptyTitle'              => $pick( 'emptyTitle' ),
	'emptyDescriptionLive'    => $pick( 'emptyDescriptionLive' ),
	'emptyDescriptionFallback' => $pick( 'emptyDescriptionFallback' ),
	'repoCount'               => $repo_count,
	'initialRepos'            => $initial_repos,
	'githubUsername'          => function_exists( 'hdc_get_configured_github_owner' ) ? hdc_get_configured_github_owner() : 'henryperkins',
	'githubProxyUrl'          => '/api/github/repos',
	'workEndpoint'            => esc_url_raw( rest_url( 'henrys-digital-canvas/v1/work' ) ),
);

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-home-page__section hdc-home-page__section--work',
		'id'    => 'selected-work',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>" data-hdc-home-selected-work>
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
	<div class="hdc-home-page__work-grid" data-hdc-home-selected-work-grid>
		<p class="hdc-home-page__status"><?php echo esc_html( $config['loadingLabel'] ); ?></p>
	</div>
</section>
