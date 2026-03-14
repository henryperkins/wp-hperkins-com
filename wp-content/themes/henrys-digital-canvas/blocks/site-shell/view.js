( function () {
	const SHELL_SELECTOR = '[data-hdc-site-shell]';
	const ACTIVE_CLASS = 'is-active';
	const DESKTOP_BREAKPOINT = 768;
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

	function isApplePlatform() {
		const platform = ( window.navigator && window.navigator.platform ) || '';
		const userAgent = ( window.navigator && window.navigator.userAgent ) || '';
		return /mac|iphone|ipad|ipod/i.test( platform ) || /mac os|iphone|ipad|ipod/i.test( userAgent );
	}

	function updateShortcutHints( root ) {
		const label = isApplePlatform() ? '\u2318K' : 'Ctrl+K';
		root.querySelectorAll( '[data-hdc-shortcut-hint]' ).forEach( function ( node ) {
			node.textContent = label;
		} );
	}

	function isEditableTarget( target ) {
		if ( ! target || ! ( target instanceof HTMLElement ) ) {
			return false;
		}

		if ( target.isContentEditable ) {
			return true;
		}

		return [ 'INPUT', 'SELECT', 'TEXTAREA' ].indexOf( target.tagName ) !== -1;
	}

	function parseConfig( root ) {
		const raw = root.getAttribute( 'data-config' ) || '{}';
		const parsed = safeJsonParse( raw );

		return {
			navItems: Array.isArray( parsed.navItems ) ? parsed.navItems : [],
			extraPages: Array.isArray( parsed.extraPages ) ? parsed.extraPages : [],
			showCommandLauncher: !! parsed.showCommandLauncher,
			enableThemeToggle: !! parsed.enableThemeToggle,
			themeStorageKey: typeof parsed.themeStorageKey === 'string' ? parsed.themeStorageKey : 'hdc-theme',
			postsEndpoint: typeof parsed.postsEndpoint === 'string' ? parsed.postsEndpoint : '',
			reposUrl: typeof parsed.reposUrl === 'string' ? parsed.reposUrl : '',
			allowedThemes: Array.isArray( parsed.allowedThemes ) ? parsed.allowedThemes : [ 'light', 'dark', 'system' ],
		};
	}

	function getRepoDisplayName( repo ) {
		if ( repo && repo.displayName ) {
			return repo.displayName;
		}
		var name = ( repo && repo.name ) ? String( repo.name ) : '';
		return name
			.split( /[-_]/ )
			.filter( Boolean )
			.map( function ( token ) {
				return token.length <= 3 ? token.toUpperCase() : token.charAt( 0 ).toUpperCase() + token.slice( 1 );
			} )
			.join( ' ' );
	}

	function resolveBlogPostPayload( payload ) {
		if ( payload && typeof payload === 'object' && Array.isArray( payload.posts ) ) {
			return payload.posts;
		}

		return Array.isArray( payload ) ? payload : [];
	}

	function getBlogPostUrl( post ) {
		const slug = post && typeof post.slug === 'string' ? post.slug.trim() : '';
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
				targetPath = normalizePathname( new URL( href, window.location.origin ).pathname );
			} catch ( error ) {
				targetPath = normalizePathname( href );
			}

			const active = targetPath === '/' ? currentPath === '/' : currentPath.indexOf( targetPath ) === 0;
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
		const backdrop = root.querySelector( '[data-hdc-mobile-backdrop]' );
		const closeButton = root.querySelector( '[data-hdc-mobile-close]' );
		const triggerIcon = root.querySelector( '[data-hdc-menu-icon]' );
		const triggerLabel = root.querySelector( '[data-hdc-menu-label]' );
		const themeTrigger = root.querySelector( '[data-hdc-theme-trigger]' );
		const themeMenu = root.querySelector( '[data-hdc-theme-menu]' );
		const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
		const mobileHideDelay = 180;
		let lastFocusedElement = null;
		let mobileHideTimer = null;

		if ( ! menuTrigger || ! mobileMenu ) {
			return;
		}

		function isMenuOpen() {
			return root.classList.contains( 'is-mobile-open' );
		}

		function getFocusableElements() {
			return Array.prototype.slice.call( mobileMenu.querySelectorAll( FOCUSABLE_SELECTOR ) ).filter( function ( element ) {
				return element.getClientRects().length > 0 && ! element.hasAttribute( 'hidden' ) && ! element.closest( '[hidden]' );
			} );
		}

		function cancelMobileHide() {
			if ( mobileHideTimer ) {
				window.clearTimeout( mobileHideTimer );
				mobileHideTimer = null;
			}
		}

		function updateTriggerState( open ) {
			menuTrigger.setAttribute( 'aria-expanded', open ? 'true' : 'false' );
			menuTrigger.setAttribute( 'aria-label', open ? 'Close menu' : 'Open menu' );
			if ( triggerIcon ) {
				const openIcon = triggerIcon.querySelector( '[data-hdc-menu-icon-open]' );
				const closeIcon = triggerIcon.querySelector( '[data-hdc-menu-icon-close]' );
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

			if ( settings.returnFocus !== false && lastFocusedElement && typeof lastFocusedElement.focus === 'function' ) {
				lastFocusedElement.focus();
			}

			lastFocusedElement = null;
		}

		function openMenu() {
			lastFocusedElement = document.activeElement && typeof document.activeElement.focus === 'function' ? document.activeElement : menuTrigger;
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

		root.querySelectorAll( '.hdc-site-shell__mobile-link' ).forEach( function ( link ) {
			link.addEventListener( 'click', function () {
				closeMenu( { returnFocus: false } );
			} );
		} );

		root.querySelectorAll( '.hdc-site-shell__command-trigger--mobile' ).forEach( function ( trigger ) {
			trigger.addEventListener( 'click', function () {
				closeMenu( { returnFocus: false } );
			} );
		} );

		root.addEventListener( 'hdc:command-open', function () {
			closeMenu( { returnFocus: false } );
		} );

		document.addEventListener( 'keydown', function ( event ) {
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
			const lastElement = focusableElements[ focusableElements.length - 1 ];
			const activeElement = document.activeElement;

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
		return window.matchMedia && window.matchMedia( '(prefers-color-scheme: dark)' ).matches ? 'dark' : 'light';
	}

	function applyTheme( selectedTheme ) {
		const resolvedTheme = selectedTheme === 'system' ? getSystemTheme() : selectedTheme;
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
		const menu = root.querySelector( '[data-hdc-theme-menu]' );
		const options = root.querySelectorAll( '[data-hdc-theme-option]' );

		if ( ! trigger || ! menu || options.length === 0 ) {
			return;
		}

		let selectedTheme = 'system';
		let focusedThemeIndex = 0;
		const storedTheme = window.localStorage.getItem( config.themeStorageKey );
		if ( storedTheme && config.allowedThemes.indexOf( storedTheme ) !== -1 ) {
			selectedTheme = storedTheme;
		}

		function getOptions() {
			return Array.prototype.slice.call( options );
		}

		function getSelectedOptionIndex() {
			var optionIndex = getOptions().findIndex( function ( option ) {
				return option.getAttribute( 'data-hdc-theme-option' ) === selectedTheme;
			} );

			return optionIndex >= 0 ? optionIndex : 0;
		}

		function focusThemeOption( index ) {
			var themeOptions = getOptions();
			if ( ! themeOptions.length ) {
				return;
			}

			focusedThemeIndex = ( index + themeOptions.length ) % themeOptions.length;
			themeOptions.forEach( function ( option, optionIndex ) {
				option.tabIndex = optionIndex === focusedThemeIndex ? 0 : -1;
			} );
			themeOptions[ focusedThemeIndex ].focus();
		}

		function updateThemeUI( resolvedTheme ) {
			const selectedThemeLabel = selectedTheme.charAt( 0 ).toUpperCase() + selectedTheme.slice( 1 );
			trigger.setAttribute( 'aria-label', 'Theme: ' + selectedThemeLabel );
			trigger.setAttribute( 'title', 'Theme: ' + selectedThemeLabel );
			trigger.setAttribute( 'data-current-theme', selectedTheme );
			focusedThemeIndex = getSelectedOptionIndex();
			options.forEach( function ( option, optionIndex ) {
				const optionValue = option.getAttribute( 'data-hdc-theme-option' );
				const active = optionValue === selectedTheme;
				option.classList.toggle( ACTIVE_CLASS, active );
				option.setAttribute( 'aria-checked', active ? 'true' : 'false' );
				option.tabIndex = optionIndex === focusedThemeIndex ? 0 : -1;
				option.setAttribute( 'data-theme-preview', resolvedTheme );
			} );
		}

		function isMenuOpen() {
			return root.classList.contains( 'is-theme-open' );
		}

		function closeMenu( optionsObject ) {
			var settings = optionsObject || {};
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
			const resolvedTheme = applyTheme( value );
			updateThemeUI( resolvedTheme );
			closeMenu();
		}

		const currentResolvedTheme = applyTheme( selectedTheme );
		updateThemeUI( currentResolvedTheme );
		closeMenu( { returnFocus: false } );

		trigger.addEventListener( 'click', function () {
			if ( isMenuOpen() ) {
				closeMenu( { returnFocus: false } );
				return;
			}

			openMenu();
		} );

		trigger.addEventListener( 'keydown', function ( event ) {
			if ( event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ' ) {
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

		document.addEventListener( 'click', function ( event ) {
			if ( ! root.contains( event.target ) ) {
				closeMenu( { returnFocus: false } );
			}
		} );

		document.addEventListener( 'keydown', function ( event ) {
			if ( event.key === 'Escape' && isMenuOpen() ) {
				closeMenu();
			}
		} );

		if ( window.matchMedia ) {
			const mediaQuery = window.matchMedia( '(prefers-color-scheme: dark)' );
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
				var children = Array.prototype.slice.call( arguments, 2 );
				var el = document.createElementNS( tag === 'svg' ? 'http://www.w3.org/2000/svg' : 'http://www.w3.org/2000/svg', tag );
				if ( attrs ) {
					Object.keys( attrs ).forEach( function ( key ) {
						if ( key === 'key' ) return;
						var attrName = key.replace( /([A-Z])/g, function ( m ) { return '-' + m.toLowerCase(); } );
						el.setAttribute( attrName, attrs[ key ] );
					} );
				}
				children.forEach( function ( child ) {
					if ( child && child.nodeType ) {
						el.appendChild( child );
					}
				} );
				return el;
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
			var iconEl = createCommandIcon( item.icon );
			if ( iconEl ) {
				link.appendChild( iconEl );
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
		const triggers = root.querySelectorAll( '[data-hdc-command-trigger]' );
		const closeButtons = root.querySelectorAll( '[data-hdc-command-close]' );
		const input = root.querySelector( '[data-hdc-command-input]' );
		const pagesContainer = root.querySelector( '[data-hdc-command-pages]' );
		const postsContainer = root.querySelector( '[data-hdc-command-posts]' );
		const projectsContainer = root.querySelector( '[data-hdc-command-projects]' );
		const pagesSection = root.querySelector( '[data-hdc-command-pages-section]' );
		const postsSection = root.querySelector( '[data-hdc-command-posts-section]' );
		const projectsSection = root.querySelector( '[data-hdc-command-projects-section]' );
		const emptyState = root.querySelector( '[data-hdc-command-empty]' );

		if ( ! dialog || ! input || ! pagesContainer || ! postsContainer || ! projectsContainer || ! emptyState ) {
			return;
		}

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
		let highlightIndex = -1;
		let dialogHideTimer = null;

		const staticPages = config.navItems
			.concat( config.extraPages || [] )
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

		state.items.pages = dedupeByUrl( staticPages );

		function cancelDialogHide() {
			if ( dialogHideTimer ) {
				window.clearTimeout( dialogHideTimer );
				dialogHideTimer = null;
			}
		}

		function closeDialog() {
			cancelDialogHide();
			dialog.classList.remove( 'is-open' );
			dialog.setAttribute( 'aria-hidden', 'true' );
			document.body.classList.remove( 'hdc-command-open' );
			state.opened = false;
			clearHighlight();
			dialogHideTimer = window.setTimeout( function () {
				dialog.hidden = true;
				dialogHideTimer = null;
			}, dialogHideDelay );
		}

		function openDialog() {
			cancelDialogHide();
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
			} else {
				openDialog();
				if ( ! state.loaded ) {
					loadItems();
				}
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

		async function loadItems() {
			state.loaded = true;

			const tasks = [
				fetchJson( config.postsEndpoint )
					.then( function ( payload ) {
						return resolveBlogPostPayload( payload ).map( function ( post ) {
							const tags = Array.isArray( post?.tags ) ? post.tags.map( decodeHtml ).filter( Boolean ) : [];
							const readingTime = decodeHtml( post?.readingTime || '' );
							const tagSummary = tags.length ? tags.join( ', ' ) : '';

							return {
								label: decodeHtml( post?.title?.rendered || post?.title || '' ),
								url: getBlogPostUrl( post ),
								shortcut: readingTime,
								icon: 'file-text',
								search: [ readingTime, tagSummary ].join( ' ' ),
							};
						} );
					} )
					.catch( function () {
						return [];
					} ),
				fetchJson( config.reposUrl )
					.then( function ( payload ) {
						const repos = payload && Array.isArray( payload.repos ) ? payload.repos : Array.isArray( payload ) ? payload : [];
						return repos.map( function ( repo ) {
							const repoName = decodeHtml( repo?.name || '' );
							if ( ! repoName ) {
								return null;
							}
							const displayName = getRepoDisplayName( repo );
							const topics = Array.isArray( repo?.topics ) ? repo.topics.map( decodeHtml ).filter( Boolean ) : [];
							const topicSummary = topics.length ? topics.join( ', ' ) : '';
							const language = decodeHtml( repo?.language || '' );

							return {
								label: displayName,
								url: '/work/' + encodeURIComponent( repoName ) + '/',
								shortcut: repo?.featured ? 'Featured' : '',
								icon: 'folder-git-2',
								search: [ repoName, displayName, language, topicSummary, repo?.featured ? 'featured' : '' ].join( ' ' ),
							};
						} ).filter( Boolean );
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

		function searchItems( items, query ) {
			if ( ! query ) {
				return items;
			}

			const normalizedQuery = query.toLowerCase();
			return items.filter( function ( item ) {
				const haystack = ( item.label + ' ' + ( item.shortcut || '' ) + ' ' + item.url + ' ' + ( item.search || '' ) ).toLowerCase();
				return haystack.indexOf( normalizedQuery ) !== -1;
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

			const total = filteredPages.length + filteredPosts.length + filteredProjects.length;
			emptyState.hidden = total !== 0;

			if ( highlightIndex >= 0 ) {
				var visibleItems = getAllVisibleItems();
				if ( visibleItems.length === 0 ) {
					clearHighlight();
					return;
				}
				highlightIndex = Math.min( highlightIndex, visibleItems.length - 1 );
				setHighlight( visibleItems, highlightIndex );
			}
		}

		function getAllVisibleItems() {
			return Array.prototype.slice.call(
				dialog.querySelectorAll( '.hdc-site-shell__command-item' )
			).filter( function ( element ) {
				return element.getClientRects().length > 0 && ! element.closest( '[hidden]' );
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
			dialog.querySelectorAll( '.is-highlighted' ).forEach( function ( element ) {
				element.classList.remove( 'is-highlighted' );
			} );
		}

		triggers.forEach( function ( trigger ) {
			trigger.addEventListener( 'click', toggleDialog );
		} );

		closeButtons.forEach( function ( button ) {
			button.addEventListener( 'click', closeDialog );
		} );

		input.addEventListener( 'input', function () {
			render();
			clearHighlight();
		} );

		document.addEventListener( 'keydown', function ( event ) {
			const isShortcut = event.key.toLowerCase() === 'k' && ( event.ctrlKey || event.metaKey );
			if ( isShortcut ) {
				if ( event.defaultPrevented || isEditableTarget( event.target ) ) {
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

			if ( state.opened && ( event.key === 'ArrowDown' || event.key === 'ArrowUp' ) ) {
				event.preventDefault();
				var items = getAllVisibleItems();
				if ( items.length === 0 ) {
					return;
				}
				if ( event.key === 'ArrowDown' ) {
					highlightIndex = highlightIndex < items.length - 1 ? highlightIndex + 1 : 0;
				} else {
					highlightIndex = highlightIndex > 0 ? highlightIndex - 1 : items.length - 1;
				}
				setHighlight( items, highlightIndex );
				return;
			}

			if ( state.opened && event.key === 'Enter' && highlightIndex >= 0 ) {
				event.preventDefault();
				var enterItems = getAllVisibleItems();
				if ( highlightIndex < enterItems.length ) {
					enterItems[ highlightIndex ].click();
				}
				return;
			}

			// Focus trap: keep Tab cycling within the command palette dialog.
			if ( event.key === 'Tab' && state.opened ) {
				const DIALOG_FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
				var panel = dialog.querySelector( '[role="dialog"]' ) || dialog;
				var focusable = Array.prototype.slice.call( panel.querySelectorAll( DIALOG_FOCUSABLE ) ).filter( function ( el ) {
					return el.getClientRects().length > 0 && ! el.hasAttribute( 'hidden' ) && ! el.closest( '[hidden]' );
				} );
				if ( focusable.length === 0 ) {
					event.preventDefault();
					return;
				}
				var first = focusable[ 0 ];
				var last = focusable[ focusable.length - 1 ];
				if ( event.shiftKey && document.activeElement === first ) {
					event.preventDefault();
					last.focus();
				} else if ( ! event.shiftKey && document.activeElement === last ) {
					event.preventDefault();
					first.focus();
				}
			}
		} );

		window.addEventListener( 'popstate', closeDialog );
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
