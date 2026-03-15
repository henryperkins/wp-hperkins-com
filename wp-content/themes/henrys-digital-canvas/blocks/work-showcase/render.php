<?php
/**
 * Server render for the Work Showcase block.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$defaults = array(
	'heading'                => 'Work',
	'description'            => 'Selected repositories and client case studies focused on problem framing, implementation decisions, and shipped outcomes.',
	'repoCount'              => 100,
	'includeForks'           => false,
	'includeArchived'        => false,
	'openInNewTab'           => true,
	'showSignalsPanel'       => true,
	'showActivitySparkline'  => true,
	'sparklineWeeks'         => 8,
);

$attrs = wp_parse_args( $attributes, $defaults );

$config = array(
	'heading'         => sanitize_text_field( $attrs['heading'] ),
	'description'     => sanitize_text_field( $attrs['description'] ),
	'githubUsername'  => hdc_get_configured_github_owner(),
	'repoCount'       => max( 1, min( 100, (int) $attrs['repoCount'] ) ),
	'includeForks'    => (bool) $attrs['includeForks'],
	'includeArchived' => (bool) $attrs['includeArchived'],
	'openInNewTab'    => (bool) $attrs['openInNewTab'],
	'showSignalsPanel' => (bool) $attrs['showSignalsPanel'],
	'showActivitySparkline' => (bool) $attrs['showActivitySparkline'],
	'sparklineWeeks'  => max( 4, min( 16, (int) $attrs['sparklineWeeks'] ) ),
	'githubProxyUrl'  => '/api/github/repos',
	'githubRepoProofsProxyUrl' => '/api/github/repo-proofs',
	'githubCIStatusProxyUrl' => '/api/github/ci-status',
	'githubContributorStatsProxyUrl' => '/api/github/contributor-stats',
	'githubLanguageSummaryProxyUrl' => '/api/github/language-summary',
	'localReposUrl'   => esc_url_raw( get_theme_file_uri( 'blocks/work-showcase/data/repos.json' ) ),
	'repoCaseStudyDetailsUrl' => esc_url_raw( get_theme_file_uri( 'blocks/work-showcase/data/repo-case-study-details.json' ) ),
);

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-work-showcase',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>">
	<div class="hdc-work-shell" data-hdc-work-root>
		<p class="hdc-work-status">
			<?php esc_html_e( 'Loading repositories…', 'henrys-digital-canvas' ); ?>
		</p>
	</div>
</section>
