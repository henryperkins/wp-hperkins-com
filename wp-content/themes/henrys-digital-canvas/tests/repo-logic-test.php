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

echo "\n{$tests_run} checks, {$tests_failed} failures\n";
exit( $tests_failed > 0 ? 1 : 0 );
