<?php
/**
 * Home Core — pure repo logic (WordPress-free).
 *
 * No WordPress functions may be called here. Faithful PHP ports of:
 *  - src/pages/Home.tsx (summary/badge/source-badge/cta derivations, selection)
 *  - src/components/work/work-utils.ts (getRepoDisplayName, compareReposByUpdatedAtDesc)
 *  - src/hooks/useGitHubRepos.ts (mapGitHubRepos merge precedence)
 *
 * Tested by tests/repo-logic-test.php under bare `php`.
 *
 * @package henrys-digital-canvas
 */

/**
 * Mirror of isGitHubLinkedRepo: origin === 'github' OR url contains 'github.com/'.
 */
function hdc_repo_is_github_linked( array $repo ): bool {
	if ( 'github' === ( isset( $repo['origin'] ) ? (string) $repo['origin'] : '' ) ) {
		return true;
	}
	$url = isset( $repo['url'] ) ? (string) $repo['url'] : '';
	return false !== strpos( $url, 'github.com/' );
}

/**
 * Mirror of getHomeRepoSummary: whyItMatters ?? description.
 * WP post meta is '' when unset, so an empty why_it_matters falls back to description.
 */
function hdc_repo_summary( array $repo ): string {
	$why = isset( $repo['why_it_matters'] ) ? trim( (string) $repo['why_it_matters'] ) : '';
	if ( '' !== $why ) {
		return $why;
	}
	return isset( $repo['description'] ) ? (string) $repo['description'] : '';
}

/**
 * Mirror of getHomeRepoBadge.
 */
function hdc_repo_badge_label( array $repo ): string {
	if ( 'private' === ( isset( $repo['access'] ) ? (string) $repo['access'] : '' ) ) {
		return 'Private case study';
	}
	if ( hdc_repo_is_github_linked( $repo ) ) {
		return 'Open source';
	}
	return 'Curated project';
}

/**
 * Mirror of getHomeRepoSourceBadge. Returns '' instead of null so it stores as
 * empty post meta (the card CSS hides empty badge elements).
 *
 * @param bool $is_live True when the sync's last result was live (source === 'live').
 */
function hdc_repo_source_badge( array $repo, bool $is_live ): string {
	if ( 'private' === ( isset( $repo['access'] ) ? (string) $repo['access'] : '' ) ) {
		return '';
	}
	if ( $is_live ) {
		return ( 'github' === ( isset( $repo['origin'] ) ? (string) $repo['origin'] : '' ) ) ? 'Live GitHub' : '';
	}
	return hdc_repo_is_github_linked( $repo ) ? 'GitHub snapshot' : '';
}

/**
 * Mirror of getHomeRepoCtaLabel.
 */
function hdc_repo_cta_label( array $repo ): string {
	$origin = isset( $repo['origin'] ) ? (string) $repo['origin'] : '';
	$access = isset( $repo['access'] ) ? (string) $repo['access'] : '';
	if ( 'github' === $origin && 'private' !== $access ) {
		return 'View project';
	}
	return 'View case study';
}

/**
 * Mirror of getRepoDisplayName: prefer curated display name; else split the
 * kebab/snake slug into tokens, uppercasing tokens of length <= 3 and
 * capitalizing the rest.
 */
function hdc_repo_display_name( array $repo ): string {
	$display = isset( $repo['display_name'] ) ? trim( (string) $repo['display_name'] ) : '';
	if ( '' !== $display ) {
		return $display;
	}

	$name   = isset( $repo['name'] ) ? (string) $repo['name'] : '';
	$tokens = preg_split( '/[-_]/', $name );
	$tokens = array_values( array_filter( (array) $tokens, static function ( $token ) {
		return '' !== $token;
	} ) );
	$tokens = array_map(
		static function ( $token ) {
			if ( strlen( $token ) <= 3 ) {
				return strtoupper( $token );
			}
			return strtoupper( substr( $token, 0, 1 ) ) . substr( $token, 1 );
		},
		$tokens
	);

	return implode( ' ', $tokens );
}

/**
 * Mirror of mapGitHubRepos' fork/archived filter.
 */
function hdc_repo_should_keep_live( array $api_repo ): bool {
	return empty( $api_repo['fork'] ) && empty( $api_repo['archived'] );
}

/**
 * Normalize one worker /api/github/repos entry to the live fields we store.
 * pushed_at (date-only) -> updated_at, stargazers_count -> stars, etc.
 */
function hdc_repo_map_api( array $api_repo ): array {
	$pushed_at  = isset( $api_repo['pushed_at'] ) ? (string) $api_repo['pushed_at'] : '';
	$updated_at = '' !== $pushed_at ? substr( $pushed_at, 0, 10 ) : '1970-01-01';

	$topics = array();
	if ( isset( $api_repo['topics'] ) && is_array( $api_repo['topics'] ) ) {
		foreach ( $api_repo['topics'] as $topic ) {
			if ( is_string( $topic ) && '' !== $topic ) {
				$topics[] = $topic;
			}
		}
	}

	return array(
		'github_id'   => ( isset( $api_repo['id'] ) && is_numeric( $api_repo['id'] ) ) ? (int) $api_repo['id'] : 0,
		'name'        => isset( $api_repo['name'] ) ? (string) $api_repo['name'] : '',
		'description' => ( isset( $api_repo['description'] ) && is_string( $api_repo['description'] ) ) ? $api_repo['description'] : '',
		'language'    => ( isset( $api_repo['language'] ) && is_string( $api_repo['language'] ) ) ? $api_repo['language'] : '',
		'stars'       => isset( $api_repo['stargazers_count'] ) ? (int) $api_repo['stargazers_count'] : 0,
		'forks'       => isset( $api_repo['forks_count'] ) ? (int) $api_repo['forks_count'] : 0,
		'updated_at'  => $updated_at,
		'url'         => isset( $api_repo['html_url'] ) ? (string) $api_repo['html_url'] : '',
		'topics'      => $topics,
	);
}

/**
 * Merge live (API) fields onto a curated record, mirroring mapGitHubRepos
 * precedence. origin becomes 'github' (live-present); curated description wins;
 * language live ?? curated ?? 'Unknown'; topics live-if-non-empty; curated
 * featured/featured_priority/access/why_it_matters/display_name are untouched.
 */
function hdc_repo_merge_live_onto_curated( array $curated, array $live ): array {
	$merged = $curated;

	$merged['origin']     = 'github';
	$merged['stars']      = (int) ( $live['stars'] ?? 0 );
	$merged['forks']      = (int) ( $live['forks'] ?? 0 );
	$merged['url']        = (string) ( $live['url'] ?? ( $curated['url'] ?? '' ) );
	$merged['updated_at'] = (string) ( $live['updated_at'] ?? ( $curated['updated_at'] ?? '' ) );

	$live_lang    = (string) ( $live['language'] ?? '' );
	$curated_lang = (string) ( $curated['language'] ?? '' );
	$merged['language'] = '' !== $live_lang ? $live_lang : ( '' !== $curated_lang ? $curated_lang : 'Unknown' );

	if ( isset( $live['topics'] ) && is_array( $live['topics'] ) && ! empty( $live['topics'] ) ) {
		$merged['topics'] = $live['topics'];
	}

	$curated_desc = (string) ( $curated['description'] ?? '' );
	$merged['description'] = '' !== $curated_desc ? $curated_desc : (string) ( $live['description'] ?? '' );

	if ( ! empty( $live['github_id'] ) ) {
		$merged['github_id'] = (int) $live['github_id'];
	}

	return $merged;
}
