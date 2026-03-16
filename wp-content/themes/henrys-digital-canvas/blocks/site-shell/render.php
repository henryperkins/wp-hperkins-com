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
	'siteTitle'           => 'Henry Perkins',
	'showCommandLauncher' => true,
	'enableThemeToggle'   => true,
);

$attrs = wp_parse_args( $attributes, $defaults );
$logo_mark_url = esc_url( get_theme_file_uri( 'assets/images/logo-mark.png' ) );

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

$command_pages = array(
	$nav_items[0],
	$nav_items[1],
	$nav_items[2],
	array(
		'label' => __( 'ATS Resume', 'henrys-digital-canvas' ),
		'url'   => home_url( '/resume/ats/' ),
	),
	$nav_items[3],
	$nav_items[4],
	$nav_items[5],
	$nav_items[6],
);

$allowed_themes = array( 'light', 'dark', 'system' );
$theme_menu_id = wp_unique_id( 'hdc-theme-menu-' );
$mobile_menu_id = wp_unique_id( 'hdc-mobile-menu-' );
$mobile_menu_title_id = $mobile_menu_id . '-title';
$mobile_menu_description_id = $mobile_menu_id . '-description';

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
	'commandPages'        => array_map(
		static function ( $item ) {
			return array(
				'label' => sanitize_text_field( $item['label'] ),
				'url'   => esc_url_raw( $item['url'] ),
			);
		},
		$command_pages
	),
	'showCommandLauncher' => (bool) $attrs['showCommandLauncher'],
	'enableThemeToggle'   => (bool) $attrs['enableThemeToggle'],
	'themeStorageKey'     => 'hdc-theme',
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
				<span class="hdc-site-shell__brand-mark" aria-hidden="true">
					<img
						class="hdc-site-shell__brand-image"
						src="<?php echo $logo_mark_url; ?>"
						alt=""
						width="44"
						height="44"
						decoding="async"
					/>
				</span>
				<span class="hdc-site-shell__brand-copy">
					<span class="hdc-site-shell__title"><?php echo esc_html( sanitize_text_field( $attrs['siteTitle'] ) ); ?></span>
				</span>
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
					<button type="button" class="hdc-site-shell__command-trigger hdc-site-shell__command-trigger--desktop focus-ring" data-hdc-command-trigger aria-label="<?php esc_attr_e( 'Open command palette', 'henrys-digital-canvas' ); ?>">
						<span class="hdc-site-shell__action-icon" aria-hidden="true">
							<svg class="hdc-site-shell__action-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
								<circle cx="11" cy="11" r="8"></circle>
								<path d="m21 21-4.35-4.35"></path>
							</svg>
						</span>
						<kbd data-hdc-shortcut-hint><?php esc_html_e( 'Ctrl+K', 'henrys-digital-canvas' ); ?></kbd>
					</button>
				<?php endif; ?>

				<?php if ( ! empty( $attrs['enableThemeToggle'] ) ) : ?>
					<div class="hdc-site-shell__theme" data-hdc-theme>
						<button type="button" class="hdc-site-shell__theme-trigger focus-ring" data-hdc-theme-trigger aria-label="<?php esc_attr_e( 'Change theme', 'henrys-digital-canvas' ); ?>" aria-expanded="false" aria-haspopup="menu" aria-controls="<?php echo esc_attr( $theme_menu_id ); ?>">
							<svg class="hdc-site-shell__theme-icon hdc-site-shell__theme-icon--sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
								<circle cx="12" cy="12" r="4"></circle>
								<path d="M12 2v2"></path>
								<path d="M12 20v2"></path>
								<path d="m4.93 4.93 1.41 1.41"></path>
								<path d="m17.66 17.66 1.41 1.41"></path>
								<path d="M2 12h2"></path>
								<path d="M20 12h2"></path>
								<path d="m6.34 17.66-1.41 1.41"></path>
								<path d="m19.07 4.93-1.41 1.41"></path>
							</svg>
							<svg class="hdc-site-shell__theme-icon hdc-site-shell__theme-icon--moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
								<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
							</svg>
							<span class="screen-reader-text"><?php esc_html_e( 'Theme', 'henrys-digital-canvas' ); ?></span>
						</button>
						<div id="<?php echo esc_attr( $theme_menu_id ); ?>" class="hdc-site-shell__theme-menu" data-hdc-theme-menu aria-hidden="true" role="menu" aria-label="<?php esc_attr_e( 'Theme', 'henrys-digital-canvas' ); ?>">
							<span class="hdc-site-shell__theme-label"><?php esc_html_e( 'Theme', 'henrys-digital-canvas' ); ?></span>
							<button type="button" class="hdc-site-shell__theme-option" data-hdc-theme-option="light" role="menuitemradio" aria-checked="false" tabindex="-1">
								<svg class="hdc-site-shell__theme-option-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
								<?php esc_html_e( 'Light', 'henrys-digital-canvas' ); ?>
							</button>
							<button type="button" class="hdc-site-shell__theme-option" data-hdc-theme-option="dark" role="menuitemradio" aria-checked="false" tabindex="-1">
								<svg class="hdc-site-shell__theme-option-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
								<?php esc_html_e( 'Dark', 'henrys-digital-canvas' ); ?>
							</button>
							<button type="button" class="hdc-site-shell__theme-option" data-hdc-theme-option="system" role="menuitemradio" aria-checked="false" tabindex="-1">
								<svg class="hdc-site-shell__theme-option-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"></path></svg>
								<?php esc_html_e( 'System', 'henrys-digital-canvas' ); ?>
							</button>
						</div>
					</div>
				<?php endif; ?>

				<button
					type="button"
					class="hdc-site-shell__menu-trigger focus-ring"
					data-hdc-menu-trigger
					aria-controls="<?php echo esc_attr( $mobile_menu_id ); ?>"
					aria-expanded="false"
					aria-haspopup="dialog"
					aria-label="<?php esc_attr_e( 'Open menu', 'henrys-digital-canvas' ); ?>"
				>
					<span class="hdc-site-shell__menu-trigger-icon" data-hdc-menu-icon aria-hidden="true">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false" data-hdc-menu-icon-open>
							<line x1="4" x2="20" y1="12" y2="12"></line>
							<line x1="4" x2="20" y1="6" y2="6"></line>
							<line x1="4" x2="20" y1="18" y2="18"></line>
						</svg>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false" data-hdc-menu-icon-close style="display:none">
							<path d="M18 6 6 18"></path>
							<path d="m6 6 12 12"></path>
						</svg>
					</span>
					<span class="hdc-site-shell__menu-trigger-text" data-hdc-menu-label><?php esc_html_e( 'Menu', 'henrys-digital-canvas' ); ?></span>
				</button>
			</div>
		</div>

	</header>

	<div class="hdc-site-shell__mobile-backdrop" data-hdc-mobile-backdrop hidden aria-hidden="true"></div>
	<section
		id="<?php echo esc_attr( $mobile_menu_id ); ?>"
		class="hdc-site-shell__mobile"
		data-hdc-mobile-menu
		role="dialog"
		aria-modal="true"
		aria-hidden="true"
		aria-labelledby="<?php echo esc_attr( $mobile_menu_title_id ); ?>"
		aria-describedby="<?php echo esc_attr( $mobile_menu_description_id ); ?>"
		tabindex="-1"
		hidden
	>
		<div class="hdc-site-shell__mobile-shell">
			<h2 id="<?php echo esc_attr( $mobile_menu_title_id ); ?>" class="screen-reader-text">
				<?php esc_html_e( 'Mobile navigation', 'henrys-digital-canvas' ); ?>
			</h2>
			<p id="<?php echo esc_attr( $mobile_menu_description_id ); ?>" class="screen-reader-text">
				<?php esc_html_e( 'Navigate the site, open the command palette, or jump to key proof points.', 'henrys-digital-canvas' ); ?>
			</p>
			<button type="button" class="hdc-site-shell__mobile-close focus-ring" data-hdc-mobile-close aria-label="<?php esc_attr_e( 'Close menu', 'henrys-digital-canvas' ); ?>">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
					<path d="M18 6 6 18"></path>
					<path d="m6 6 12 12"></path>
				</svg>
				<span class="screen-reader-text"><?php esc_html_e( 'Close', 'henrys-digital-canvas' ); ?></span>
			</button>

			<div class="hdc-site-shell__mobile-section hdc-site-shell__mobile-section--lead">
				<?php if ( ! empty( $attrs['showCommandLauncher'] ) ) : ?>
					<button type="button" class="hdc-site-shell__command-trigger hdc-site-shell__command-trigger--mobile focus-ring" data-hdc-command-trigger aria-label="<?php esc_attr_e( 'Open command palette', 'henrys-digital-canvas' ); ?>">
						<span class="hdc-site-shell__action-icon" aria-hidden="true">
							<svg class="hdc-site-shell__action-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
								<circle cx="11" cy="11" r="8"></circle>
								<path d="m21 21-4.35-4.35"></path>
							</svg>
						</span>
						<span><?php esc_html_e( 'Search site', 'henrys-digital-canvas' ); ?></span>
						<kbd data-hdc-shortcut-hint><?php esc_html_e( 'Ctrl+K', 'henrys-digital-canvas' ); ?></kbd>
					</button>
				<?php endif; ?>

				<p class="hdc-site-shell__mobile-copy">
					<?php esc_html_e( 'Jump to projects, posts, and resume in seconds.', 'henrys-digital-canvas' ); ?>
				</p>
			</div>

			<nav class="hdc-site-shell__mobile-nav" aria-label="<?php esc_attr_e( 'Mobile', 'henrys-digital-canvas' ); ?>">
				<ul class="hdc-site-shell__mobile-list">
					<?php foreach ( $nav_items as $item ) : ?>
						<li>
							<a class="hdc-site-shell__mobile-link focus-ring" data-hdc-nav-link href="<?php echo esc_url( $item['url'] ); ?>">
								<?php echo esc_html( $item['label'] ); ?>
							</a>
						</li>
					<?php endforeach; ?>
				</ul>
			</nav>

			<div class="hdc-site-shell__mobile-card">
				<p class="hdc-site-shell__mobile-card-eyebrow"><?php esc_html_e( 'Quick path', 'henrys-digital-canvas' ); ?></p>
				<h3 class="hdc-site-shell__mobile-card-title"><?php esc_html_e( 'Start with the strongest proof points.', 'henrys-digital-canvas' ); ?></h3>
				<p class="hdc-site-shell__mobile-card-copy">
					<?php esc_html_e( 'Work covers shipped outcomes, Blog covers current thinking, and Resume gives the condensed version.', 'henrys-digital-canvas' ); ?>
				</p>
			</div>
		</div>
	</section>

	<?php if ( ! empty( $attrs['showCommandLauncher'] ) ) : ?>
		<div class="hdc-site-shell__command" data-hdc-command-dialog hidden aria-hidden="true">
			<div class="hdc-site-shell__command-backdrop" data-hdc-command-close></div>
			<div class="hdc-site-shell__command-panel" role="dialog" aria-modal="true" aria-label="<?php esc_attr_e( 'Search pages, posts, and projects', 'henrys-digital-canvas' ); ?>">
				<div class="hdc-site-shell__command-header">
					<span class="hdc-site-shell__command-input-icon" aria-hidden="true">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
							<circle cx="11" cy="11" r="8"></circle>
							<path d="m21 21-4.35-4.35"></path>
						</svg>
					</span>
					<input
						type="search"
						class="hdc-site-shell__command-input focus-ring"
						data-hdc-command-input
						placeholder="<?php esc_attr_e( 'Search pages, posts, and projects...', 'henrys-digital-canvas' ); ?>"
						autocomplete="off"
					/>
				</div>
				<div class="hdc-site-shell__command-groups">
					<section data-hdc-command-pages-section>
						<h2><?php esc_html_e( 'Pages', 'henrys-digital-canvas' ); ?></h2>
						<div data-hdc-command-pages></div>
					</section>
					<section data-hdc-command-posts-section>
						<h2><?php esc_html_e( 'Blog Posts', 'henrys-digital-canvas' ); ?></h2>
						<div data-hdc-command-posts></div>
					</section>
					<section data-hdc-command-projects-section>
						<h2><?php esc_html_e( 'Projects', 'henrys-digital-canvas' ); ?></h2>
						<div data-hdc-command-projects></div>
					</section>
				</div>
				<p class="hdc-site-shell__command-empty" data-hdc-command-empty hidden>
					<?php esc_html_e( 'No results found.', 'henrys-digital-canvas' ); ?>
				</p>
			</div>
		</div>
	<?php endif; ?>
</div>
