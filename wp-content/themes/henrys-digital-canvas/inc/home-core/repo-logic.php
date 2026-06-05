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
