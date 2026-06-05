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

// --- hdc_repo_should_keep_live (drop forks/archived) ---
hdc_check( 'keep: normal repo', hdc_repo_should_keep_live( array( 'fork' => false, 'archived' => false ) ), true );
hdc_check( 'keep: fork dropped', hdc_repo_should_keep_live( array( 'fork' => true, 'archived' => false ) ), false );
hdc_check( 'keep: archived dropped', hdc_repo_should_keep_live( array( 'fork' => false, 'archived' => true ) ), false );

// --- hdc_repo_map_api (worker shape -> normalized live fields; pushed_at -> updated_at date) ---
$api = array(
	'id'               => 42,
	'name'             => 'tarot',
	'description'      => 'live desc',
	'language'         => 'JavaScript',
	'stargazers_count' => 5,
	'forks_count'      => 2,
	'pushed_at'        => '2026-05-01T12:34:56Z',
	'html_url'         => 'https://github.com/henryperkins/tarot',
	'topics'           => array( 'ai', 'tarot', 7 ),
);
$mapped = hdc_repo_map_api( $api );
hdc_check( 'map: github_id', $mapped['github_id'], 42 );
hdc_check( 'map: stars from stargazers_count', $mapped['stars'], 5 );
hdc_check( 'map: forks from forks_count', $mapped['forks'], 2 );
hdc_check( 'map: updated_at = pushed_at date', $mapped['updated_at'], '2026-05-01' );
hdc_check( 'map: url from html_url', $mapped['url'], 'https://github.com/henryperkins/tarot' );
hdc_check( 'map: topics strings only', $mapped['topics'], array( 'ai', 'tarot' ) );
hdc_check( 'map: missing pushed_at -> epoch date', hdc_repo_map_api( array( 'name' => 'x' ) )['updated_at'], '1970-01-01' );

// --- hdc_repo_merge_live_onto_curated ---
$curated = array(
	'name'              => 'tarot',
	'origin'            => 'curated',          // seeded value
	'access'            => 'public',
	'featured'          => true,
	'featured_priority' => 0,
	'why_it_matters'    => 'Reading UX.',
	'display_name'      => 'Tarot',
	'description'       => 'curated desc',     // curated wins over live
	'language'          => 'JavaScript',
	'stars'             => 0,
	'forks'             => 0,
	'updated_at'        => '2026-04-04',
	'url'               => 'https://github.com/henryperkins/tarot',
	'topics'            => array( 'old' ),
);
$merged = hdc_repo_merge_live_onto_curated( $curated, $mapped );
hdc_check( 'merge: origin forced github when live-present', $merged['origin'], 'github' );
hdc_check( 'merge: description stays curated', $merged['description'], 'curated desc' );
hdc_check( 'merge: stars/forks/url/updated from live', array( $merged['stars'], $merged['forks'], $merged['updated_at'] ), array( 5, 2, '2026-05-01' ) );
hdc_check( 'merge: topics replaced by non-empty live', $merged['topics'], array( 'ai', 'tarot' ) );
hdc_check( 'merge: curated featured/access untouched', array( $merged['featured'], $merged['access'], $merged['why_it_matters'] ), array( true, 'public', 'Reading UX.' ) );
hdc_check( 'merge: empty curated description falls back to live', hdc_repo_merge_live_onto_curated( array( 'description' => '' ) + $curated, $mapped )['description'], 'live desc' );

// --- ranking: priority asc (missing -> last), then updated_at desc, then name asc ---
$repos = array(
	array( 'name' => 'zeta',  'featured' => true,  'featured_priority' => null, 'updated_at' => '2026-01-01' ),
	array( 'name' => 'alpha', 'featured' => true,  'featured_priority' => null, 'updated_at' => '2026-01-01' ), // tie w/ zeta -> alpha first
	array( 'name' => 'top',   'featured' => true,  'featured_priority' => 0,    'updated_at' => '2020-01-01' ), // explicit priority wins
	array( 'name' => 'newer', 'featured' => true,  'featured_priority' => null, 'updated_at' => '2026-09-09' ), // newest among no-priority
	array( 'name' => 'skip',  'featured' => false, 'featured_priority' => 1,    'updated_at' => '2099-01-01' ), // not featured
);
$ranked = array_map( static function ( $r ) { return $r['name']; }, hdc_repo_rank_featured( $repos ) );
hdc_check( 'rank: order', $ranked, array( 'top', 'newer', 'alpha', 'zeta' ) );
hdc_check( 'rank: drops non-featured', in_array( 'skip', $ranked, true ), false );

// --- updated timestamp helper ---
hdc_check( 'ts: valid date', hdc_repo_updated_timestamp( array( 'updated_at' => '2026-01-01' ) ) > 0, true );
hdc_check( 'ts: empty -> 0', hdc_repo_updated_timestamp( array( 'updated_at' => '' ) ), 0 );

// --- seed merge: repos.json supplies curated+snapshot; case-study map supplies why_it_matters + (winning) displayName ---
$repos_json = array(
	array(
		'name' => 'henry-s-digital-canvas', 'description' => 'Portfolio.', 'language' => 'TypeScript',
		'stars' => 1, 'forks' => 0, 'updatedAt' => '2026-04-04', 'url' => 'https://github.com/henryperkins/henry-s-digital-canvas',
		'topics' => array( 'portfolio' ), 'featured' => true, 'featuredPriority' => 0, 'origin' => 'curated', 'access' => 'public',
		// note: NO whyItMatters and NO displayName in repos.json
	),
	array( 'name' => 'bare', 'origin' => 'github', 'access' => 'public' ), // minimal entry
);
$case_study_map = array(
	'henry-s-digital-canvas' => array( 'displayName' => 'HPerkins.com', 'whyItMatters' => 'Proof surface.' ),
);
$seed = hdc_repo_build_seed( $repos_json, $case_study_map );
hdc_check( 'seed: count', count( $seed ), 2 );
hdc_check( 'seed: why_it_matters from case-study map', $seed[0]['why_it_matters'], 'Proof surface.' );
hdc_check( 'seed: display_name from case-study map (wins)', $seed[0]['display_name'], 'HPerkins.com' );
hdc_check( 'seed: snapshot stars/updated from repos.json', array( $seed[0]['stars'], $seed[0]['updated_at'] ), array( 1, '2026-04-04' ) );
hdc_check( 'seed: featured + priority', array( $seed[0]['featured'], $seed[0]['featured_priority'] ), array( true, 0 ) );
hdc_check( 'seed: minimal entry has empty why', $seed[1]['why_it_matters'], '' );
hdc_check( 'seed: minimal entry priority null', $seed[1]['featured_priority'], null );
hdc_check( 'seed: minimal entry origin preserved', $seed[1]['origin'], 'github' );

echo "\n{$tests_run} checks, {$tests_failed} failures\n";
exit( $tests_failed > 0 ? 1 : 0 );
