<?php
/**
 * Standalone unit tests for inc/home-core/repo-logic.php.
 * Run from the theme dir:  php tests/repo-logic-test.php
 * No WordPress, no DB, no composer required.
 */

require __DIR__ . '/../inc/home-core/repo-logic.php';

$tests_run    = 0;
$tests_failed = 0;

function hdc_check( string $label, $actual, $expected ): void {
	global $tests_run, $tests_failed;
	$tests_run++;
	$a = var_export( $actual, true );
	$e = var_export( $expected, true );
	if ( $a === $e ) {
		echo "ok   - {$label}\n";
		return;
	}
	$tests_failed++;
	echo "FAIL - {$label}\n     expected: {$e}\n     actual:   {$a}\n";
}

// --- hdc_repo_is_github_linked ---
hdc_check( 'github-linked: origin github', hdc_repo_is_github_linked( array( 'origin' => 'github' ) ), true );
hdc_check( 'github-linked: curated origin + github url', hdc_repo_is_github_linked( array( 'origin' => 'curated', 'url' => 'https://github.com/henryperkins/tarot' ) ), true );
hdc_check( 'github-linked: curated, no github url', hdc_repo_is_github_linked( array( 'origin' => 'curated', 'url' => 'https://example.com/x' ) ), false );

// --- hdc_repo_summary (whyItMatters ?? description; '' treated as unset per WP meta) ---
hdc_check( 'summary: why_it_matters wins', hdc_repo_summary( array( 'why_it_matters' => 'Because X.', 'description' => 'Desc.' ) ), 'Because X.' );
hdc_check( 'summary: empty why falls back to description', hdc_repo_summary( array( 'why_it_matters' => '', 'description' => 'Desc.' ) ), 'Desc.' );
hdc_check( 'summary: missing why falls back to description', hdc_repo_summary( array( 'description' => 'Desc.' ) ), 'Desc.' );
hdc_check( 'summary: both empty -> empty', hdc_repo_summary( array() ), '' );

// --- hdc_repo_badge_label ---
hdc_check( 'badge: private', hdc_repo_badge_label( array( 'access' => 'private' ) ), 'Private case study' );
hdc_check( 'badge: github-linked -> open source', hdc_repo_badge_label( array( 'access' => 'public', 'origin' => 'github' ) ), 'Open source' );
hdc_check( 'badge: curated url github -> open source', hdc_repo_badge_label( array( 'access' => 'public', 'origin' => 'curated', 'url' => 'https://github.com/x/y' ) ), 'Open source' );
hdc_check( 'badge: curated -> curated project', hdc_repo_badge_label( array( 'access' => 'public', 'origin' => 'curated', 'url' => '' ) ), 'Curated project' );

// --- hdc_repo_source_badge (is_live flag mirrors Home.tsx source === 'live') ---
hdc_check( 'source: private -> none', hdc_repo_source_badge( array( 'access' => 'private', 'origin' => 'github' ), true ), '' );
hdc_check( 'source: live + github -> Live GitHub', hdc_repo_source_badge( array( 'access' => 'public', 'origin' => 'github' ), true ), 'Live GitHub' );
hdc_check( 'source: live + non-github origin -> none', hdc_repo_source_badge( array( 'access' => 'public', 'origin' => 'curated', 'url' => 'https://github.com/x/y' ), true ), '' );
hdc_check( 'source: snapshot + github-linked -> GitHub snapshot', hdc_repo_source_badge( array( 'access' => 'public', 'origin' => 'curated', 'url' => 'https://github.com/x/y' ), false ), 'GitHub snapshot' );
hdc_check( 'source: snapshot + not linked -> none', hdc_repo_source_badge( array( 'access' => 'public', 'origin' => 'curated', 'url' => '' ), false ), '' );

// --- hdc_repo_cta_label ---
hdc_check( 'cta: github public -> View project', hdc_repo_cta_label( array( 'origin' => 'github', 'access' => 'public' ) ), 'View project' );
hdc_check( 'cta: github private -> View case study', hdc_repo_cta_label( array( 'origin' => 'github', 'access' => 'private' ) ), 'View case study' );
hdc_check( 'cta: curated -> View case study', hdc_repo_cta_label( array( 'origin' => 'curated', 'access' => 'public' ) ), 'View case study' );

// --- hdc_repo_display_name (getRepoDisplayName: curated displayName, else title-case slug; tokens <=3 chars uppercased) ---
hdc_check( 'display: curated wins', hdc_repo_display_name( array( 'display_name' => 'HPerkins.com', 'name' => 'henry-s-digital-canvas' ) ), 'HPerkins.com' );
hdc_check( 'display: derive title-case', hdc_repo_display_name( array( 'name' => 'my-cool-project' ) ), 'MY Cool Project' );
hdc_check( 'display: short tokens uppercased', hdc_repo_display_name( array( 'name' => 'ai-cli-web-funnel' ) ), 'AI CLI WEB Funnel' );
hdc_check( 'display: underscores split too', hdc_repo_display_name( array( 'name' => 'data_sync' ) ), 'Data Sync' );

echo "\n{$tests_run} checks, {$tests_failed} failures\n";
exit( $tests_failed > 0 ? 1 : 0 );
