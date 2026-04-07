<?php
/**
 * Server render for Home Page block.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$home_content   = hdc_get_home_content_data_contract();
$initial_posts  = hdc_get_blog_posts_data_contract( 3 );
$initial_resume = hdc_get_resume_data_contract();
$initial_repos  = hdc_read_theme_json_file( '/blocks/work-showcase/data/repos.json', array() );

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
				);
			},
			$initial_posts['posts']
		)
	);
}

if ( ! is_array( $initial_repos ) ) {
	$initial_repos = array();
}

$initial_repos = array_values(
	array_filter(
		array_map(
			static function ( $repo ) {
				if ( ! is_array( $repo ) || empty( $repo['name'] ) || empty( $repo['featured'] ) ) {
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
					'featured'    => true,
					'origin'      => sanitize_text_field( (string) ( $repo['origin'] ?? 'curated' ) ),
					'access'      => sanitize_text_field( (string) ( $repo['access'] ?? 'public' ) ),
				);
			},
			$initial_repos
		)
	)
);

$config = array(
	'hero'           => isset( $home_content['hero'] ) && is_array( $home_content['hero'] ) ? $home_content['hero'] : array(),
	'selectedWork'   => isset( $home_content['selectedWork'] ) && is_array( $home_content['selectedWork'] ) ? $home_content['selectedWork'] : array(),
	'throughline'    => isset( $home_content['throughline'] ) && is_array( $home_content['throughline'] ) ? $home_content['throughline'] : array(),
	'resumeSnapshot' => isset( $home_content['resumeSnapshot'] ) && is_array( $home_content['resumeSnapshot'] ) ? $home_content['resumeSnapshot'] : array(),
	'recentWriting'  => isset( $home_content['recentWriting'] ) && is_array( $home_content['recentWriting'] ) ? $home_content['recentWriting'] : array(),
	'contactCta'     => isset( $home_content['contactCta'] ) && is_array( $home_content['contactCta'] ) ? $home_content['contactCta'] : array(),
	'repoTitles'     => isset( $home_content['repoTitles'] ) && is_array( $home_content['repoTitles'] ) ? $home_content['repoTitles'] : array(),
	'initialPosts'   => is_array( $initial_posts ) ? $initial_posts : array(),
	'initialRepos'   => $initial_repos,
	'initialResume'  => is_array( $initial_resume ) ? $initial_resume : array(),
	'githubUsername' => hdc_get_configured_github_owner(),
	'githubProxyUrl' => '/api/github/repos',
	'workEndpoint'   => esc_url_raw( rest_url( 'henrys-digital-canvas/v1/work' ) ),
	'blogEndpoint'   => esc_url_raw( add_query_arg( 'limit', 3, rest_url( 'henrys-digital-canvas/v1/blog' ) ) ),
	'resumeEndpoint' => esc_url_raw( rest_url( 'henrys-digital-canvas/v1/resume' ) ),
	'blogCount'      => 3,
	'repoCount'      => 3,
);

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-home-page alignfull',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>">
	<div class="hdc-home-page__shell" data-hdc-home-root>
		<p class="hdc-home-page__status"><?php esc_html_e( 'Loading homepage…', 'henrys-digital-canvas' ); ?></p>
	</div>
</section>
