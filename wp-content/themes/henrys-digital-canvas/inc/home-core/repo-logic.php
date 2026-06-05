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
