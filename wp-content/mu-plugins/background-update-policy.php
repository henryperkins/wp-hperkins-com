<?php
/**
 * Core background update policy for this install.
 *
 * WordPress core lives inside the site checkout, but core/runtime files are not
 * tracked by this repo. Without this filter, the root .git directory makes
 * WordPress skip unattended core updates.
 *
 * @package HenrysDigitalCanvas
 */

add_filter(
	'automatic_updates_is_vcs_checkout',
	static function ( $is_checkout, $context ) {
		if ( untrailingslashit( ABSPATH ) === untrailingslashit( $context ) ) {
			return false;
		}

		return $is_checkout;
	},
	10,
	2
);
