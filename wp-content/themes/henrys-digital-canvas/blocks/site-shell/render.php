<?php
/**
 * Server render for the Site Shell block.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$defaults = array(
	'siteTitle'           => 'Henry T. Perkins',
	'tagline'             => 'Customer Success · Developer Enablement · AI Workflows',
	'showCommandLauncher' => true,
	'enableThemeToggle'   => true,
);

$attrs = wp_parse_args( $attributes, $defaults );

$nav_items = array(
	array(
		'label' => __( 'Home', 'henrys-digital-canvas' ),
		'url'   => home_url( '/' ),
	),
	array(
		'label' => __( 'Work', 'henrys-digital-canvas' ),
		'url'   => home_url( '/work/' ),
	),
	array(
		'label' => __( 'Resume', 'henrys-digital-canvas' ),
		'url'   => home_url( '/resume/' ),
	),
	array(
		'label' => __( 'Hobbies', 'henrys-digital-canvas' ),
		'url'   => home_url( '/hobbies/' ),
	),
	array(
		'label' => __( 'Blog', 'henrys-digital-canvas' ),
		'url'   => home_url( '/blog/' ),
	),
	array(
		'label' => __( 'About', 'henrys-digital-canvas' ),
		'url'   => home_url( '/about/' ),
	),
	array(
		'label' => __( 'Contact', 'henrys-digital-canvas' ),
		'url'   => home_url( '/contact/' ),
	),
);

$allowed_themes = array( 'light', 'dark', 'system' );

$config = array(
	'navItems'            => array_map(
		static function ( $item ) {
			return array(
				'label' => sanitize_text_field( $item['label'] ),
				'url'   => esc_url_raw( $item['url'] ),
			);
		},
		$nav_items
	),
	'showCommandLauncher' => (bool) $attrs['showCommandLauncher'],
	'enableThemeToggle'   => (bool) $attrs['enableThemeToggle'],
	'themeStorageKey'     => 'hdc-theme',
	'pagesEndpoint'       => esc_url_raw( rest_url( 'wp/v2/pages?per_page=100&_fields=slug,title.rendered,link' ) ),
	'postsEndpoint'       => esc_url_raw( add_query_arg( 'limit', 100, rest_url( 'henrys-digital-canvas/v1/blog' ) ) ),
	'reposUrl'            => esc_url_raw( add_query_arg( 'limit', 100, rest_url( 'henrys-digital-canvas/v1/work' ) ) ),
	'allowedThemes'       => $allowed_themes,
);

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-site-shell',
	)
);
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-hdc-site-shell data-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>">
	<header class="hdc-site-shell__header glass" data-hdc-shell-header>
		<div class="hdc-site-shell__inner">
			<a class="hdc-site-shell__brand focus-ring" href="<?php echo esc_url( home_url( '/' ) ); ?>">
				<span class="hdc-site-shell__title"><?php echo esc_html( sanitize_text_field( $attrs['siteTitle'] ) ); ?></span>
				<span class="hdc-site-shell__tagline"><?php echo esc_html( sanitize_text_field( $attrs['tagline'] ) ); ?></span>
			</a>

			<nav class="hdc-site-shell__desktop-nav" aria-label="<?php esc_attr_e( 'Primary', 'henrys-digital-canvas' ); ?>">
				<ul class="hdc-site-shell__nav-list">
					<?php foreach ( $nav_items as $item ) : ?>
						<li>
							<a class="hdc-site-shell__nav-link focus-ring" data-hdc-nav-link href="<?php echo esc_url( $item['url'] ); ?>">
								<?php echo esc_html( $item['label'] ); ?>
							</a>
						</li>
					<?php endforeach; ?>
				</ul>
			</nav>

			<div class="hdc-site-shell__actions">
				<?php if ( ! empty( $attrs['showCommandLauncher'] ) ) : ?>
					<button type="button" class="hdc-site-shell__command-trigger hdc-site-shell__command-trigger--desktop focus-ring" data-hdc-command-trigger>
						<span><?php esc_html_e( 'Search', 'henrys-digital-canvas' ); ?></span>
						<kbd data-hdc-shortcut-hint><?php esc_html_e( 'Ctrl+K', 'henrys-digital-canvas' ); ?></kbd>
					</button>
				<?php endif; ?>

				<?php if ( ! empty( $attrs['enableThemeToggle'] ) ) : ?>
					<div class="hdc-site-shell__theme" data-hdc-theme>
						<button type="button" class="hdc-site-shell__theme-trigger focus-ring" data-hdc-theme-trigger>
							<?php esc_html_e( 'Theme', 'henrys-digital-canvas' ); ?>
						</button>
						<div class="hdc-site-shell__theme-menu" data-hdc-theme-menu hidden>
							<button type="button" class="hdc-site-shell__theme-option" data-hdc-theme-option="light"><?php esc_html_e( 'Light', 'henrys-digital-canvas' ); ?></button>
							<button type="button" class="hdc-site-shell__theme-option" data-hdc-theme-option="dark"><?php esc_html_e( 'Dark', 'henrys-digital-canvas' ); ?></button>
							<button type="button" class="hdc-site-shell__theme-option" data-hdc-theme-option="system"><?php esc_html_e( 'System', 'henrys-digital-canvas' ); ?></button>
						</div>
					</div>
				<?php endif; ?>

				<button type="button" class="hdc-site-shell__menu-trigger focus-ring" data-hdc-menu-trigger aria-controls="hdc-mobile-menu" aria-expanded="false">
					<span><?php esc_html_e( 'Menu', 'henrys-digital-canvas' ); ?></span>
				</button>
			</div>
		</div>

		<div id="hdc-mobile-menu" class="hdc-site-shell__mobile" data-hdc-mobile-menu hidden>
			<ul class="hdc-site-shell__mobile-list">
				<?php foreach ( $nav_items as $item ) : ?>
					<li>
						<a class="hdc-site-shell__mobile-link focus-ring" data-hdc-nav-link href="<?php echo esc_url( $item['url'] ); ?>">
							<?php echo esc_html( $item['label'] ); ?>
						</a>
					</li>
				<?php endforeach; ?>
			</ul>
			<?php if ( ! empty( $attrs['showCommandLauncher'] ) ) : ?>
				<div class="hdc-site-shell__mobile-utility">
					<button type="button" class="hdc-site-shell__command-trigger hdc-site-shell__command-trigger--mobile focus-ring" data-hdc-command-trigger>
						<span><?php esc_html_e( 'Search', 'henrys-digital-canvas' ); ?></span>
						<kbd data-hdc-shortcut-hint><?php esc_html_e( 'Ctrl+K', 'henrys-digital-canvas' ); ?></kbd>
					</button>
				</div>
			<?php endif; ?>
		</div>
	</header>

	<?php if ( ! empty( $attrs['showCommandLauncher'] ) ) : ?>
		<div class="hdc-site-shell__command" data-hdc-command-dialog hidden>
			<div class="hdc-site-shell__command-backdrop" data-hdc-command-close></div>
			<div class="hdc-site-shell__command-panel" role="dialog" aria-modal="true" aria-label="<?php esc_attr_e( 'Search pages, posts, and projects', 'henrys-digital-canvas' ); ?>">
				<div class="hdc-site-shell__command-header">
					<input
						type="search"
						class="hdc-site-shell__command-input focus-ring"
						data-hdc-command-input
						placeholder="<?php esc_attr_e( 'Search pages, posts, and projects...', 'henrys-digital-canvas' ); ?>"
						autocomplete="off"
					/>
					<button type="button" class="hdc-site-shell__command-dismiss focus-ring" data-hdc-command-close>
						<?php esc_html_e( 'Close', 'henrys-digital-canvas' ); ?>
					</button>
				</div>
				<div class="hdc-site-shell__command-groups">
					<section>
						<h2><?php esc_html_e( 'Pages', 'henrys-digital-canvas' ); ?></h2>
						<div data-hdc-command-pages></div>
					</section>
					<section>
						<h2><?php esc_html_e( 'Blog Posts', 'henrys-digital-canvas' ); ?></h2>
						<div data-hdc-command-posts></div>
					</section>
					<section>
						<h2><?php esc_html_e( 'Projects', 'henrys-digital-canvas' ); ?></h2>
						<div data-hdc-command-projects></div>
					</section>
				</div>
				<p class="hdc-site-shell__command-empty" data-hdc-command-empty hidden>
					<?php esc_html_e( 'No matching commands found.', 'henrys-digital-canvas' ); ?>
				</p>
			</div>
		</div>
	<?php endif; ?>
</div>
