<?php
/**
 * Server render for Not Found block.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$defaults = array(
	'heading'   => 'Page not found',
	'homeLabel' => 'Go Home',
	'backLabel' => 'Go Back',
);

$attrs = wp_parse_args( $attributes, $defaults );

$request_uri = isset( $_SERVER['REQUEST_URI'] ) ? (string) wp_unslash( $_SERVER['REQUEST_URI'] ) : '/';
$path        = wp_parse_url( $request_uri, PHP_URL_PATH );
$path        = is_string( $path ) && '' !== $path ? $path : '/';
if ( '/' !== $path ) {
	$path = rtrim( $path, '/' );
	if ( '' === $path ) {
		$path = '/';
	}
}

$config = array(
	'backLabel' => sanitize_text_field( $attrs['backLabel'] ),
);

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-not-found',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>">
	<div class="hdc-not-found__shell" data-hdc-not-found-root>
		<p class="hdc-not-found__code" aria-hidden="true">404</p>
		<h1 class="hdc-not-found__title"><?php echo esc_html( sanitize_text_field( $attrs['heading'] ) ); ?></h1>
		<p class="hdc-not-found__description">
			<?php esc_html_e( 'The page', 'henrys-digital-canvas' ); ?>
			<code class="hdc-not-found__path"><?php echo esc_html( $path ); ?></code>
			<?php esc_html_e( 'does not exist.', 'henrys-digital-canvas' ); ?>
		</p>
		<div class="hdc-not-found__actions">
			<a class="hdc-not-found__button hdc-not-found__button--primary" href="<?php echo esc_url( home_url( '/' ) ); ?>">
				<span class="hdc-not-found__button-icon" aria-hidden="true">
					<svg class="hdc-not-found__button-icon-svg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
						<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
						<path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
					</svg>
				</span>
				<span><?php echo esc_html( sanitize_text_field( $attrs['homeLabel'] ) ); ?></span>
			</a>
			<button type="button" class="hdc-not-found__button hdc-not-found__button--outline" data-hdc-not-found-back>
				<span class="hdc-not-found__button-icon" aria-hidden="true">
					<svg class="hdc-not-found__button-icon-svg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
						<path d="m12 19-7-7 7-7" />
						<path d="M19 12H5" />
					</svg>
				</span>
				<span><?php echo esc_html( sanitize_text_field( $attrs['backLabel'] ) ); ?></span>
			</button>
		</div>
	</div>
</section>
