<?php
/**
 * Standalone unit tests for inc/home-core/repo-cpt.php helpers.
 * Run from the theme dir: php tests/repo-cpt-test.php
 * No WordPress, no DB, no composer required.
 *
 * @package henrys-digital-canvas
 */

define( 'ABSPATH', __DIR__ );

function add_action( $hook_name, $callback, $priority = 10, $accepted_args = 1 ): void {}

require __DIR__ . '/../inc/home-core/repo-cpt.php';

$tests_run    = 0;
$tests_failed = 0;

function hdc_repo_cpt_check( string $label, $actual, $expected ): void {
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

hdc_repo_cpt_check( 'signed int: preserves zero priority', hdc_repo_sanitize_signed_int( '0' ), 0 );
hdc_repo_cpt_check( 'signed int: preserves negative priority', hdc_repo_sanitize_signed_int( '-2' ), -2 );
hdc_repo_cpt_check( 'signed int: clears empty string', hdc_repo_sanitize_signed_int( '' ), '' );
hdc_repo_cpt_check( 'signed int: clears null', hdc_repo_sanitize_signed_int( null ), '' );
hdc_repo_cpt_check( 'signed int: clears non-numeric value', hdc_repo_sanitize_signed_int( 'later' ), '' );

echo "\n{$tests_run} checks, {$tests_failed} failures\n";
exit( $tests_failed > 0 ? 1 : 0 );
