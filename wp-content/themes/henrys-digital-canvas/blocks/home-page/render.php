<?php
/**
 * Server render for Home Page block.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$home_content = hdc_get_home_content_data_contract();

$config = array(
	'pageTitle'      => sanitize_text_field( (string) ( $home_content['pageTitle'] ?? 'Henry Perkins — Technical Portfolio' ) ),
	'hero'           => isset( $home_content['hero'] ) && is_array( $home_content['hero'] ) ? $home_content['hero'] : array(),
	'selectedWork'   => isset( $home_content['selectedWork'] ) && is_array( $home_content['selectedWork'] ) ? $home_content['selectedWork'] : array(),
	'resumeSnapshot' => isset( $home_content['resumeSnapshot'] ) && is_array( $home_content['resumeSnapshot'] ) ? $home_content['resumeSnapshot'] : array(),
	'recentWriting'  => isset( $home_content['recentWriting'] ) && is_array( $home_content['recentWriting'] ) ? $home_content['recentWriting'] : array(),
	'contactCta'     => isset( $home_content['contactCta'] ) && is_array( $home_content['contactCta'] ) ? $home_content['contactCta'] : array(),
	'repoTitles'     => isset( $home_content['repoTitles'] ) && is_array( $home_content['repoTitles'] ) ? $home_content['repoTitles'] : array(),
	'githubUsername' => hdc_get_first_available_config_value( array( 'HDC_GITHUB_REPO_OWNER', 'GITHUB_REPO_OWNER' ) ),
	'githubProxyUrl' => '/api/github/repos',
	'workEndpoint'   => esc_url_raw( rest_url( 'henrys-digital-canvas/v1/work' ) ),
	'blogEndpoint'   => esc_url_raw( add_query_arg( 'limit', 3, rest_url( 'henrys-digital-canvas/v1/blog' ) ) ),
	'resumeEndpoint' => esc_url_raw( rest_url( 'henrys-digital-canvas/v1/resume' ) ),
	'blogCount'      => 3,
	'repoCount'      => 3,
);

if ( '' === trim( (string) $config['githubUsername'] ) ) {
	$config['githubUsername'] = 'henryperkins';
}

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-home-page',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>">
	<div class="hdc-home-page__shell" data-hdc-home-root>
		<p class="hdc-home-page__status"><?php esc_html_e( 'Loading homepage…', 'henrys-digital-canvas' ); ?></p>
	</div>
</section>
