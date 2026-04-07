( function () {
	const SHELL_SELECTOR = '[data-hdc-site-shell]';
	const ACTIVE_CLASS = 'is-active';
	const DESKTOP_BREAKPOINT = 768;
	const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
	const sharedUtils = window.hdcSharedUtils || {};

	function safeJsonParse( value ) {
		try {
			return JSON.parse( value );
		} catch ( error ) {
			return {};
		}
	}

	function normalizePathname( value ) {
		if ( sharedUtils.normalizePathname ) {
			return sharedUtils.normalizePathname( value );
		}

		if ( ! value ) {
			return '/';
		}

		let normalized = String( value ).trim();

		if ( ! normalized.startsWith( '/' ) ) {
			normalized = '/' + normalized;
		}

		normalized = normalized.replace( /\/+$/, '' );
		return normalized || '/';
	}

	function decodeHtml( value ) {
		if ( sharedUtils.decodeHtml ) {
			return sharedUtils.decodeHtml( value );
		}

		if ( typeof value !== 'string' ) {
			return '';
		}

		const div = document.createElement( 'div' );

		div.innerHTML = value;
		return ( div.textContent || '' ).trim();
	}

	function getOwnerDocument( node ) {
		return node && node.ownerDocument ? node.ownerDocument : document;
	}

	function getActiveElement( node ) {
		return getOwnerDocument( node ).activeElement;
	}

	function isElementNode( target ) {
		return !! target && target.nodeType === 1;
	}

	function isApplePlatform() {
		const platform =
			( window.navigator && window.navigator.platform ) || '';
		const userAgent =
			( window.navigator && window.navigator.userAgent ) || '';

		return (
			/mac|iphone|ipad|ipod/i.test( platform ) ||
			/mac os|iphone|ipad|ipod/i.test( userAgent )
		);
	}

	function updateShortcutHints( root ) {
		const label = isApplePlatform() ? '\u2318K' : 'Ctrl+K';

		root.querySelectorAll( '[data-hdc-shortcut-hint]' ).forEach(
			function ( node ) {
				node.textContent = label;
			}
		);
	}

	function isEditableTarget( target ) {
		if ( ! isElementNode( target ) ) {
			return false;
		}

		if ( target.isContentEditable ) {
			return true;
		}

		return (
			[ 'INPUT', 'SELECT', 'TEXTAREA' ].indexOf( target.tagName ) !== -1
		);
	}

	function parseConfig( root ) {
		const raw = root.getAttribute( 'data-config' ) || '{}';
		const parsed = safeJsonParse( raw );

		return {
			navItems: Array.isArray( parsed.navItems ) ? parsed.navItems : [],
			commandPages: Array.isArray( parsed.commandPages )
				? parsed.commandPages
				: [],
			showCommandLauncher: !! parsed.showCommandLauncher,
			enableThemeToggle: !! parsed.enableThemeToggle,
			themeStorageKey:
				typeof parsed.themeStorageKey === 'string'
					? parsed.themeStorageKey
					: 'hdc-theme',
			postsEndpoint:
				typeof parsed.postsEndpoint === 'string'
					? parsed.postsEndpoint
					: '',
			reposUrl:
				typeof parsed.reposUrl === 'string' ? parsed.reposUrl : '',
			allowedThemes: Array.isArray( parsed.allowedThemes )
				? parsed.allowedThemes
				: [ 'light', 'dark', 'system' ],
		};
	}

	function getRepoDisplayName( repo ) {
		if ( repo && repo.displayName ) {
			return repo.displayName;
		}

		const name = repo && repo.name ? String( repo.name ) : '';

		return name
			.split( /[-_]/ )
			.filter( Boolean )
			.map( function ( token ) {
				if ( token.length <= 3 ) {
					return token.toUpperCase();
				}

				return token.charAt( 0 ).toUpperCase() + token.slice( 1 );
			} )
			.join( ' ' );
	}

	function resolveBlogPostPayload( payload ) {
		if (
			payload &&
			typeof payload === 'object' &&
			Array.isArray( payload.posts )
		) {
			return payload.posts;
		}

		return Array.isArray( payload ) ? payload : [];
	}

	function getBlogPostUrl( post ) {
		const slug =
			post && typeof post.slug === 'string' ? post.slug.trim() : '';

		if ( slug ) {
			return '/blog/' + encodeURIComponent( slug ) + '/';
		}

		if ( post && typeof post.url === 'string' && post.url.trim() ) {
			return post.url;
		}

		if ( post && typeof post.link === 'string' && post.link.trim() ) {
			return post.link;
		}

		return '/blog/';
	}

	function applyActiveNavigation( root ) {
		const currentPath = normalizePathname( window.location.pathname );
		const links = root.querySelectorAll( '[data-hdc-nav-link]' );

		links.forEach( function ( link ) {
			const href = link.getAttribute( 'href' ) || '/';
			let targetPath = '/';

			try {
				targetPath = normalizePathname(
					new URL( href, window.location.origin ).pathname
				);
			} catch ( error ) {
				targetPath = normalizePathname( href );
			}

			const active =
				targetPath === '/'
					? currentPath === '/'
					: currentPath.indexOf( targetPath ) === 0;

			link.classList.toggle( ACTIVE_CLASS, active );

			if ( active ) {
				link.setAttribute( 'aria-current', 'page' );
			} else {
				link.removeAttribute( 'aria-current' );
			}
		} );
	}

	function setupMobileMenu( root ) {
		const menuTrigger = root.querySelector( '[data-hdc-menu-trigger]' );
		const mobileMenu = root.querySelector( '[data-hdc-mobile-menu]' );

		if ( ! menuTrigger || ! mobileMenu ) {
			return;
		}

		const backdrop = root.querySelector( '[data-hdc-mobile-backdrop]' );
		const closeButton = root.querySelector( '[data-hdc-mobile-close]' );
		const triggerIcon = root.querySelector( '[data-hdc-menu-icon]' );
		const triggerLabel = root.querySelector( '[data-hdc-menu-label]' );
		const themeTrigger = root.querySelector( '[data-hdc-theme-trigger]' );
		const themeMenu = root.querySelector( '[data-hdc-theme-menu]' );
		const ownerDocument = getOwnerDocument( root );
		const focusableSelector =
			'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
		const mobileHideDelay = 180;
		let lastFocusedElement = null;
		let mobileHideTimer = null;
		let scrollLockActive = false;
		let previousBodyOverflow = '';
		let previousDocumentOverflow = '';

		function isMenuOpen() {
			return root.classList.contains( 'is-mobile-open' );
		}

		function getFocusableElements() {
			return Array.from(
				mobileMenu.querySelectorAll( focusableSelector )
			).filter( function ( element ) {
				return (
					element.getClientRects().length > 0 &&
					! element.hasAttribute( 'hidden' ) &&
					! element.closest( '[hidden]' )
				);
			} );
		}

		function cancelMobileHide() {
			if ( mobileHideTimer ) {
				window.clearTimeout( mobileHideTimer );
				mobileHideTimer = null;
			}
		}

		function updateScrollLock( open ) {
			if ( open ) {
				if ( ! scrollLockActive ) {
					previousBodyOverflow = document.body.style.overflow;
					previousDocumentOverflow =
						document.documentElement.style.overflow;
					scrollLockActive = true;
				}

				document.body.style.overflow = 'hidden';
				document.documentElement.style.overflow = 'hidden';
				return;
			}

			if ( scrollLockActive ) {
				document.body.style.overflow = previousBodyOverflow;
				document.documentElement.style.overflow =
					previousDocumentOverflow;
				scrollLockActive = false;
			}
		}

		function updateTriggerState( open ) {
			menuTrigger.setAttribute(
				'aria-expanded',
				open ? 'true' : 'false'
			);
			menuTrigger.setAttribute(
				'aria-label',
				open ? 'Close menu' : 'Open menu'
			);

			if ( triggerIcon ) {
				const openIcon = triggerIcon.querySelector(
					'[data-hdc-menu-icon-open]'
				);
				const closeIcon = triggerIcon.querySelector(
					'[data-hdc-menu-icon-close]'
				);

				if ( openIcon ) {
					openIcon.style.display = open ? 'none' : '';
				}

				if ( closeIcon ) {
					closeIcon.style.display = open ? '' : 'none';
				}
			}

			if ( triggerLabel ) {
				triggerLabel.textContent = open ? 'Close' : 'Menu';
			}

			mobileMenu.setAttribute( 'aria-hidden', open ? 'false' : 'true' );
			root.classList.toggle( 'is-mobile-open', open );
			document.body.classList.toggle( 'hdc-mobile-menu-open', open );
			updateScrollLock( open );
		}

		function closeThemeMenu() {
			if ( themeMenu ) {
				themeMenu.setAttribute( 'aria-hidden', 'true' );
				root.classList.remove( 'is-theme-open' );
			}

			if ( themeTrigger ) {
				themeTrigger.setAttribute( 'aria-expanded', 'false' );
			}
		}

		function closeMenu( options ) {
			const settings = options || {};

			if ( ! isMenuOpen() ) {
				updateTriggerState( false );
				return;
			}

			cancelMobileHide();
			updateTriggerState( false );
			mobileHideTimer = window.setTimeout( function () {
				mobileMenu.hidden = true;

				if ( backdrop ) {
					backdrop.hidden = true;
				}

				mobileHideTimer = null;
			}, mobileHideDelay );

			if (
				settings.returnFocus !== false &&
				lastFocusedElement &&
				typeof lastFocusedElement.focus === 'function'
			) {
				lastFocusedElement.focus();
			}

			lastFocusedElement = null;
		}

		function openMenu() {
			const activeElement = getActiveElement( root );

			lastFocusedElement =
				activeElement && typeof activeElement.focus === 'function'
					? activeElement
					: menuTrigger;

			closeThemeMenu();
			cancelMobileHide();
			mobileMenu.hidden = false;

			if ( backdrop ) {
				backdrop.hidden = false;
			}

			updateTriggerState( true );

			window.requestAnimationFrame( function () {
				const firstFocusable = getFocusableElements()[ 0 ];

				if ( firstFocusable ) {
					firstFocusable.focus();
				} else {
					mobileMenu.focus();
				}
			} );
		}

		function toggleMenu() {
			if ( isMenuOpen() ) {
				closeMenu();
			} else {
				openMenu();
			}
		}

		menuTrigger.addEventListener( 'click', toggleMenu );

		if ( backdrop ) {
			backdrop.addEventListener( 'click', function () {
				closeMenu();
			} );
		}

		if ( closeButton ) {
			closeButton.addEventListener( 'click', function () {
				closeMenu();
			} );
		}

		root.querySelectorAll( '.hdc-site-shell__mobile-link' ).forEach(
			function ( link ) {
				link.addEventListener( 'click', function () {
					closeMenu( { returnFocus: false } );
				} );
			}
		);

		root.querySelectorAll(
			'.hdc-site-shell__command-trigger--mobile'
		).forEach( function ( trigger ) {
			trigger.addEventListener( 'click', function () {
				closeMenu( { returnFocus: false } );
			} );
		} );

		root.addEventListener( 'hdc:command-open', function () {
			closeMenu( { returnFocus: false } );
		} );

		ownerDocument.addEventListener( 'keydown', function ( event ) {
			if ( ! isMenuOpen() ) {
				return;
			}

			if ( event.key === 'Escape' ) {
				event.preventDefault();
				closeMenu();
				return;
			}

			if ( event.key !== 'Tab' ) {
				return;
			}

			const focusableElements = getFocusableElements();

			if ( focusableElements.length === 0 ) {
				event.preventDefault();
				mobileMenu.focus();
				return;
			}

			const firstElement = focusableElements[ 0 ];
			const lastElement =
				focusableElements[ focusableElements.length - 1 ];
			const activeElement = getActiveElement( root );

			if ( event.shiftKey && activeElement === firstElement ) {
				event.preventDefault();
				lastElement.focus();
			} else if ( ! event.shiftKey && activeElement === lastElement ) {
				event.preventDefault();
				firstElement.focus();
			}
		} );

		window.addEventListener( 'resize', function () {
			if ( window.innerWidth >= DESKTOP_BREAKPOINT ) {
				closeMenu( { returnFocus: false } );
			}
		} );

		window.addEventListener( 'popstate', function () {
			closeMenu( { returnFocus: false } );
		} );

		mobileMenu.hidden = true;

		if ( backdrop ) {
			backdrop.hidden = true;
		}

		updateTriggerState( false );
	}

	function getSystemTheme() {
		if ( ! window.matchMedia ) {
			return 'light';
		}

		return window.matchMedia( '(prefers-color-scheme: dark)' ).matches
			? 'dark'
			: 'light';
	}

	function applyTheme( selectedTheme ) {
		const resolvedTheme =
			selectedTheme === 'system' ? getSystemTheme() : selectedTheme;
		const rootElement = document.documentElement;
		const body = document.body;
		const isDark = resolvedTheme === 'dark';

		rootElement.setAttribute( 'data-theme', resolvedTheme );
		rootElement.classList.toggle( 'dark', isDark );
		body.classList.toggle( 'dark', isDark );
		body.classList.toggle( 'is-dark-theme', isDark );

		return resolvedTheme;
	}

	function setupThemeToggle( root, config ) {
		if ( ! config.enableThemeToggle ) {
			return;
		}

		const trigger = root.querySelector( '[data-hdc-theme-trigger]' );

		if ( ! trigger ) {
			return;
		}

		const menu = root.querySelector( '[data-hdc-theme-menu]' );

		if ( ! menu ) {
			return;
		}

		const options = root.querySelectorAll( '[data-hdc-theme-option]' );

		if ( options.length === 0 ) {
			return;
		}

		const ownerDocument = getOwnerDocument( root );

		let selectedTheme = 'system';
		let focusedThemeIndex = 0;
		const storedTheme = window.localStorage.getItem(
			config.themeStorageKey
		);

		if (
			storedTheme &&
			config.allowedThemes.indexOf( storedTheme ) !== -1
		) {
			selectedTheme = storedTheme;
		}

		function getOptions() {
			return Array.from( options );
		}

		function getSelectedOptionIndex() {
			const optionIndex = getOptions().findIndex( function ( option ) {
				return (
					option.getAttribute( 'data-hdc-theme-option' ) ===
					selectedTheme
				);
			} );

			return optionIndex >= 0 ? optionIndex : 0;
		}

		function focusThemeOption( index ) {
			const themeOptions = getOptions();

			if ( ! themeOptions.length ) {
				return;
			}

			focusedThemeIndex =
				( index + themeOptions.length ) % themeOptions.length;
			themeOptions.forEach( function ( option, optionIndex ) {
				option.tabIndex = optionIndex === focusedThemeIndex ? 0 : -1;
			} );
			themeOptions[ focusedThemeIndex ].focus();
		}

		function updateThemeUI( resolvedTheme ) {
			const selectedThemeLabel =
				selectedTheme.charAt( 0 ).toUpperCase() +
				selectedTheme.slice( 1 );

			trigger.setAttribute(
				'aria-label',
				'Theme: ' + selectedThemeLabel
			);
			trigger.setAttribute( 'title', 'Theme: ' + selectedThemeLabel );
			trigger.setAttribute( 'data-current-theme', selectedTheme );
			focusedThemeIndex = getSelectedOptionIndex();

			options.forEach( function ( option, optionIndex ) {
				const optionValue = option.getAttribute(
					'data-hdc-theme-option'
				);
				const active = optionValue === selectedTheme;

				option.classList.toggle( ACTIVE_CLASS, active );
				option.setAttribute(
					'aria-checked',
					active ? 'true' : 'false'
				);
				option.tabIndex = optionIndex === focusedThemeIndex ? 0 : -1;
				option.setAttribute( 'data-theme-preview', resolvedTheme );
			} );
		}

		function isMenuOpen() {
			return root.classList.contains( 'is-theme-open' );
		}

		function closeMenu( optionsObject ) {
			const settings = optionsObject || {};

			if ( ! isMenuOpen() ) {
				trigger.setAttribute( 'aria-expanded', 'false' );
				menu.setAttribute( 'aria-hidden', 'true' );
				return;
			}

			menu.setAttribute( 'aria-hidden', 'true' );
			root.classList.remove( 'is-theme-open' );
			trigger.setAttribute( 'aria-expanded', 'false' );

			if ( settings.returnFocus !== false ) {
				trigger.focus();
			}
		}

		function openMenu() {
			menu.setAttribute( 'aria-hidden', 'false' );
			root.classList.add( 'is-theme-open' );
			trigger.setAttribute( 'aria-expanded', 'true' );
			window.requestAnimationFrame( function () {
				focusThemeOption( getSelectedOptionIndex() );
			} );
		}

		function setTheme( value ) {
			selectedTheme = value;
			window.localStorage.setItem( config.themeStorageKey, value );
			updateThemeUI( applyTheme( value ) );
			closeMenu();
		}

		updateThemeUI( applyTheme( selectedTheme ) );
		closeMenu( { returnFocus: false } );

		trigger.addEventListener( 'click', function () {
			if ( isMenuOpen() ) {
				closeMenu( { returnFocus: false } );
				return;
			}

			openMenu();
		} );

		trigger.addEventListener( 'keydown', function ( event ) {
			if (
				event.key === 'ArrowDown' ||
				event.key === 'ArrowUp' ||
				event.key === 'Enter' ||
				event.key === ' '
			) {
				event.preventDefault();

				if ( ! isMenuOpen() ) {
					openMenu();
				} else if ( event.key === 'ArrowDown' ) {
					focusThemeOption( focusedThemeIndex + 1 );
				} else if ( event.key === 'ArrowUp' ) {
					focusThemeOption( focusedThemeIndex - 1 );
				}
			}
		} );

		options.forEach( function ( option ) {
			option.addEventListener( 'click', function () {
				const value = option.getAttribute( 'data-hdc-theme-option' );

				if ( ! value || config.allowedThemes.indexOf( value ) === -1 ) {
					return;
				}

				setTheme( value );
			} );
		} );

		menu.addEventListener( 'keydown', function ( event ) {
			if ( event.key === 'Escape' ) {
				event.preventDefault();
				closeMenu();
				return;
			}

			if ( event.key === 'Tab' ) {
				closeMenu( { returnFocus: false } );
				return;
			}

			if ( event.key === 'ArrowDown' ) {
				event.preventDefault();
				focusThemeOption( focusedThemeIndex + 1 );
				return;
			}

			if ( event.key === 'ArrowUp' ) {
				event.preventDefault();
				focusThemeOption( focusedThemeIndex - 1 );
				return;
			}

			if ( event.key === 'Home' ) {
				event.preventDefault();
				focusThemeOption( 0 );
				return;
			}

			if ( event.key === 'End' ) {
				event.preventDefault();
				focusThemeOption( getOptions().length - 1 );
			}
		} );

		ownerDocument.addEventListener( 'click', function ( event ) {
			if ( ! root.contains( event.target ) ) {
				closeMenu( { returnFocus: false } );
			}
		} );

		ownerDocument.addEventListener( 'keydown', function ( event ) {
			if ( event.key === 'Escape' && isMenuOpen() ) {
				closeMenu();
			}
		} );

		if ( window.matchMedia ) {
			const mediaQuery = window.matchMedia(
				'(prefers-color-scheme: dark)'
			);
			const handleChange = function () {
				if ( selectedTheme === 'system' ) {
					updateThemeUI( applyTheme( 'system' ) );
				}
			};

			if ( typeof mediaQuery.addEventListener === 'function' ) {
				mediaQuery.addEventListener( 'change', handleChange );
			} else if ( typeof mediaQuery.addListener === 'function' ) {
				mediaQuery.addListener( handleChange );
			}
		}
	}

	async function fetchJson( url ) {
		if ( ! url ) {
			return [];
		}

		const response = await fetch( url, {
			headers: {
				Accept: 'application/json',
			},
		} );

		if ( ! response.ok ) {
			throw new Error( 'Request failed: ' + response.status );
		}

		return response.json();
	}

	function createCommandIcon( iconName ) {
		if ( ! sharedUtils.renderLucideIcon ) {
			return null;
		}

		return sharedUtils.renderLucideIcon(
			function ( tag, attrs ) {
				const children = Array.prototype.slice.call( arguments, 2 );
				const element = document.createElementNS( SVG_NAMESPACE, tag );

				if ( attrs ) {
					Object.keys( attrs ).forEach( function ( key ) {
						if ( key === 'key' ) {
							return;
						}

						const attrName = key.replace(
							/([A-Z])/g,
							function ( match ) {
								return '-' + match.toLowerCase();
							}
						);

						element.setAttribute( attrName, attrs[ key ] );
					} );
				}

				children.forEach( function ( child ) {
					if ( child && child.nodeType ) {
						element.appendChild( child );
					}
				} );

				return element;
			},
			iconName,
			{ size: 16, className: 'hdc-site-shell__command-item-icon' }
		);
	}

	function createItemNode( item, onSelect ) {
		const link = document.createElement( 'a' );

		link.className = 'hdc-site-shell__command-item focus-ring';
		link.href = item.url;

		if ( item.icon ) {
			const iconElement = createCommandIcon( item.icon );

			if ( iconElement ) {
				link.appendChild( iconElement );
			}
		}

		const label = document.createElement( 'span' );

		label.className = 'hdc-site-shell__command-label';
		label.textContent = item.label;
		link.appendChild( label );

		if ( item.shortcut ) {
			const shortcut = document.createElement( 'span' );

			shortcut.className = 'hdc-site-shell__command-shortcut';
			shortcut.textContent = item.shortcut;
			link.appendChild( shortcut );
		}

		link.addEventListener( 'click', function () {
			onSelect();
		} );

		return link;
	}

	function setupCommandPalette( root, config ) {
		if ( ! config.showCommandLauncher ) {
			return;
		}

		const dialog = root.querySelector( '[data-hdc-command-dialog]' );

		if ( ! dialog ) {
			return;
		}

		const input = root.querySelector( '[data-hdc-command-input]' );

		if ( ! input ) {
			return;
		}

		const pagesContainer = root.querySelector( '[data-hdc-command-pages]' );

		if ( ! pagesContainer ) {
			return;
		}

		const postsContainer = root.querySelector( '[data-hdc-command-posts]' );

		if ( ! postsContainer ) {
			return;
		}

		const projectsContainer = root.querySelector(
			'[data-hdc-command-projects]'
		);

		if ( ! projectsContainer ) {
			return;
		}

		const emptyState = root.querySelector( '[data-hdc-command-empty]' );

		if ( ! emptyState ) {
			return;
		}

		const triggers = root.querySelectorAll( '[data-hdc-command-trigger]' );
		const closeButtons = root.querySelectorAll(
			'[data-hdc-command-close]'
		);
		const pagesSection = root.querySelector(
			'[data-hdc-command-pages-section]'
		);
		const postsSection = root.querySelector(
			'[data-hdc-command-posts-section]'
		);
		const projectsSection = root.querySelector(
			'[data-hdc-command-projects-section]'
		);
		const ownerDocument = getOwnerDocument( root );

		const state = {
			opened: false,
			loaded: false,
			items: {
				pages: [],
				posts: [],
				projects: [],
			},
		};
		const dialogHideDelay = 180;
		const staticPages = (
			config.commandPages.length ? config.commandPages : config.navItems
		)
			.map( function ( item ) {
				return {
					label: decodeHtml( item.label || '' ),
					url: item.url || '/',
					icon: 'layout-grid',
				};
			} )
			.filter( function ( item ) {
				return item.label && item.url;
			} );
		let highlightIndex = -1;
		let dialogHideTimer = null;
		let lastDialogTrigger = null;

		function cancelDialogHide() {
			if ( dialogHideTimer ) {
				window.clearTimeout( dialogHideTimer );
				dialogHideTimer = null;
			}
		}

		function dedupeByUrl( items ) {
			const seen = new Set();

			return items.filter( function ( item ) {
				if ( seen.has( item.url ) ) {
					return false;
				}

				seen.add( item.url );
				return true;
			} );
		}

		function getAllVisibleItems() {
			return Array.from(
				dialog.querySelectorAll( '.hdc-site-shell__command-item' )
			).filter( function ( element ) {
				return (
					element.getClientRects().length > 0 &&
					! element.closest( '[hidden]' )
				);
			} );
		}

		function setHighlight( items, index ) {
			items.forEach( function ( item, itemIndex ) {
				item.classList.toggle( 'is-highlighted', itemIndex === index );
			} );

			if ( index >= 0 && index < items.length ) {
				items[ index ].scrollIntoView( { block: 'nearest' } );
			}
		}

		function clearHighlight() {
			highlightIndex = -1;
			dialog
				.querySelectorAll( '.is-highlighted' )
				.forEach( function ( element ) {
					element.classList.remove( 'is-highlighted' );
				} );
		}

		function closeDialog( options ) {
			const settings = options || {};

			cancelDialogHide();
			dialog.classList.remove( 'is-open' );
			dialog.setAttribute( 'aria-hidden', 'true' );
			document.body.classList.remove( 'hdc-command-open' );
			state.opened = false;
			clearHighlight();

			if (
				settings.returnFocus !== false &&
				lastDialogTrigger &&
				typeof lastDialogTrigger.focus === 'function'
			) {
				lastDialogTrigger.focus();
			}

			dialogHideTimer = window.setTimeout( function () {
				dialog.hidden = true;
				dialogHideTimer = null;
			}, dialogHideDelay );
		}

		function openDialog() {
			const activeElement = getActiveElement( root );

			cancelDialogHide();
			lastDialogTrigger =
				activeElement && typeof activeElement.focus === 'function'
					? activeElement
					: null;
			root.dispatchEvent( new CustomEvent( 'hdc:command-open' ) );
			dialog.hidden = false;
			dialog.classList.add( 'is-open' );
			dialog.setAttribute( 'aria-hidden', 'false' );
			document.body.classList.add( 'hdc-command-open' );
			state.opened = true;
			clearHighlight();

			window.requestAnimationFrame( function () {
				input.focus();
				input.select();
			} );
		}

		function toggleDialog() {
			if ( state.opened ) {
				closeDialog();
				return;
			}

			openDialog();

			if ( ! state.loaded ) {
				loadItems();
			}
		}

		async function loadItems() {
			state.loaded = true;

			const tasks = [
				fetchJson( config.postsEndpoint )
					.then( function ( payload ) {
						return resolveBlogPostPayload( payload ).map(
							function ( post ) {
								const tags = Array.isArray( post?.tags )
									? post.tags
											.map( decodeHtml )
											.filter( Boolean )
									: [];
								const readingTime = decodeHtml(
									post?.readingTime || ''
								);
								const tagSummary = tags.length
									? tags.join( ', ' )
									: '';

								return {
									label: decodeHtml(
										post?.title?.rendered ||
											post?.title ||
											''
									),
									url: getBlogPostUrl( post ),
									shortcut: readingTime,
									icon: 'file-text',
									search: [ readingTime, tagSummary ].join(
										' '
									),
								};
							}
						);
					} )
					.catch( function () {
						return [];
					} ),
				fetchJson( config.reposUrl )
					.then( function ( payload ) {
						let repos = [];

						if ( payload && Array.isArray( payload.repos ) ) {
							repos = payload.repos;
						} else if ( Array.isArray( payload ) ) {
							repos = payload;
						}

						return repos
							.map( function ( repo ) {
								const repoName = decodeHtml( repo?.name || '' );

								if ( ! repoName ) {
									return null;
								}

								const displayName = getRepoDisplayName( repo );
								const topics = Array.isArray( repo?.topics )
									? repo.topics
											.map( decodeHtml )
											.filter( Boolean )
									: [];
								const topicSummary = topics.length
									? topics.join( ', ' )
									: '';
								const language = decodeHtml(
									repo?.language || ''
								);

								return {
									label: displayName,
									url:
										'/work/' +
										encodeURIComponent( repoName ) +
										'/',
									shortcut: repo?.featured ? 'Featured' : '',
									icon: 'folder-git-2',
									search: [
										repoName,
										displayName,
										language,
										topicSummary,
										repo?.featured ? 'featured' : '',
									].join( ' ' ),
								};
							} )
							.filter( Boolean );
					} )
					.catch( function () {
						return [];
					} ),
			];

			const results = await Promise.all( tasks );

			state.items.pages = dedupeByUrl( staticPages );
			state.items.posts = dedupeByUrl( results[ 0 ] );
			state.items.projects = dedupeByUrl( results[ 1 ] );
			render();
		}

		function renderGroup( container, items ) {
			container.innerHTML = '';
			items.forEach( function ( item ) {
				container.appendChild(
					createItemNode( item, function () {
						closeDialog();
					} )
				);
			} );
		}

		function fuzzyScore( haystack, query ) {
			let haystackIndex = 0;
			let score = 0;
			let consecutive = 0;

			for (
				let queryIndex = 0;
				queryIndex < query.length;
				queryIndex++
			) {
				let found = false;

				while ( haystackIndex < haystack.length ) {
					if ( haystack[ haystackIndex ] === query[ queryIndex ] ) {
						score += 1 + consecutive;
						consecutive++;
						haystackIndex++;
						found = true;
						break;
					}

					consecutive = 0;
					haystackIndex++;
				}

				if ( ! found ) {
					return 0;
				}
			}

			return score;
		}

		function searchItems( items, query ) {
			if ( ! query ) {
				return items;
			}

			const normalizedQuery = query.toLowerCase();
			const scored = [];

			items.forEach( function ( item ) {
				const haystack = (
					item.label +
					' ' +
					( item.shortcut || '' ) +
					' ' +
					item.url +
					' ' +
					( item.search || '' )
				).toLowerCase();
				const score = fuzzyScore( haystack, normalizedQuery );

				if ( score > 0 ) {
					scored.push( { item, score } );
				}
			} );

			scored.sort( function ( left, right ) {
				return right.score - left.score;
			} );

			return scored.map( function ( entry ) {
				return entry.item;
			} );
		}

		function render() {
			const query = input.value.trim();
			const filteredPages = searchItems( state.items.pages, query );
			const filteredPosts = searchItems( state.items.posts, query );
			const filteredProjects = searchItems( state.items.projects, query );

			renderGroup( pagesContainer, filteredPages );
			renderGroup( postsContainer, filteredPosts );
			renderGroup( projectsContainer, filteredProjects );

			if ( pagesSection ) {
				pagesSection.hidden = filteredPages.length === 0;
			}

			if ( postsSection ) {
				postsSection.hidden = filteredPosts.length === 0;
			}

			if ( projectsSection ) {
				projectsSection.hidden = filteredProjects.length === 0;
			}

			[ pagesSection, postsSection, projectsSection ].forEach(
				function ( section ) {
					if ( section ) {
						section.classList.remove( 'is-first-visible' );
					}
				}
			);

			const firstVisibleSection = [
				pagesSection,
				postsSection,
				projectsSection,
			].find( function ( section ) {
				return section && ! section.hidden;
			} );

			if ( firstVisibleSection ) {
				firstVisibleSection.classList.add( 'is-first-visible' );
			}

			const totalVisibleItems =
				filteredPages.length +
				filteredPosts.length +
				filteredProjects.length;

			emptyState.hidden = totalVisibleItems !== 0;

			if ( state.opened && highlightIndex < 0 ) {
				const initialItems = getAllVisibleItems();

				if ( initialItems.length ) {
					highlightIndex = 0;
					setHighlight( initialItems, highlightIndex );
				}
			}

			if ( highlightIndex >= 0 ) {
				const visibleItems = getAllVisibleItems();

				if ( visibleItems.length === 0 ) {
					clearHighlight();
					return;
				}

				highlightIndex = Math.min(
					highlightIndex,
					visibleItems.length - 1
				);
				setHighlight( visibleItems, highlightIndex );
			}
		}

		state.items.pages = dedupeByUrl( staticPages );

		triggers.forEach( function ( trigger ) {
			trigger.addEventListener( 'click', toggleDialog );
		} );

		closeButtons.forEach( function ( button ) {
			button.addEventListener( 'click', closeDialog );
		} );

		input.addEventListener( 'input', function () {
			clearHighlight();
			render();
		} );

		ownerDocument.addEventListener( 'keydown', function ( event ) {
			const isShortcut =
				event.key.toLowerCase() === 'k' &&
				( event.ctrlKey || event.metaKey );

			if ( isShortcut ) {
				if (
					event.defaultPrevented ||
					isEditableTarget( event.target )
				) {
					return;
				}

				event.preventDefault();
				toggleDialog();
				return;
			}

			if ( event.key === 'Escape' && state.opened ) {
				closeDialog();
				return;
			}

			if (
				state.opened &&
				( event.key === 'ArrowDown' || event.key === 'ArrowUp' )
			) {
				event.preventDefault();

				const items = getAllVisibleItems();

				if ( items.length === 0 ) {
					return;
				}

				if ( event.key === 'ArrowDown' ) {
					highlightIndex =
						highlightIndex < items.length - 1
							? highlightIndex + 1
							: 0;
				} else {
					highlightIndex =
						highlightIndex > 0
							? highlightIndex - 1
							: items.length - 1;
				}

				setHighlight( items, highlightIndex );
				return;
			}

			if (
				state.opened &&
				event.key === 'Enter' &&
				highlightIndex >= 0
			) {
				event.preventDefault();

				const enterItems = getAllVisibleItems();

				if ( highlightIndex < enterItems.length ) {
					enterItems[ highlightIndex ].click();
				}

				return;
			}

			if ( event.key === 'Tab' && state.opened ) {
				const dialogFocusableSelector =
					'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
				const panel =
					dialog.querySelector( '[role="dialog"]' ) || dialog;
				const focusable = Array.from(
					panel.querySelectorAll( dialogFocusableSelector )
				).filter( function ( element ) {
					return (
						element.getClientRects().length > 0 &&
						! element.hasAttribute( 'hidden' ) &&
						! element.closest( '[hidden]' )
					);
				} );

				if ( focusable.length === 0 ) {
					event.preventDefault();
					return;
				}

				const first = focusable[ 0 ];
				const last = focusable[ focusable.length - 1 ];
				const activeElement = getActiveElement( root );

				if ( event.shiftKey && activeElement === first ) {
					event.preventDefault();
					last.focus();
				} else if ( ! event.shiftKey && activeElement === last ) {
					event.preventDefault();
					first.focus();
				}
			}
		} );

		window.addEventListener( 'popstate', function () {
			closeDialog();
		} );

		dialog.hidden = true;
		closeDialog();
		render();
	}

	function initShell( root ) {
		const config = parseConfig( root );

		applyActiveNavigation( root );
		updateShortcutHints( root );
		setupMobileMenu( root );
		setupThemeToggle( root, config );
		setupCommandPalette( root, config );
	}

	document.querySelectorAll( SHELL_SELECTOR ).forEach( initShell );
} )();
