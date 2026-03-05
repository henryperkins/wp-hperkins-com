( function () {
	const SHELL_SELECTOR = '[data-hdc-site-shell]';
	const ACTIVE_CLASS = 'is-active';
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
		const label = isApplePlatform() ? 'Cmd+K' : 'Ctrl+K';
		root.querySelectorAll( '[data-hdc-shortcut-hint]' ).forEach( function ( node ) {
			node.textContent = label;
		} );
	}

	function parseConfig( root ) {
		const raw = root.getAttribute( 'data-config' ) || '{}';
		const parsed = safeJsonParse( raw );

		return {
			navItems: Array.isArray( parsed.navItems ) ? parsed.navItems : [],
			showCommandLauncher: !! parsed.showCommandLauncher,
			enableThemeToggle: !! parsed.enableThemeToggle,
			themeStorageKey: typeof parsed.themeStorageKey === 'string' ? parsed.themeStorageKey : 'hdc-theme',
			pagesEndpoint: typeof parsed.pagesEndpoint === 'string' ? parsed.pagesEndpoint : '',
			postsEndpoint: typeof parsed.postsEndpoint === 'string' ? parsed.postsEndpoint : '',
			reposUrl: typeof parsed.reposUrl === 'string' ? parsed.reposUrl : '',
			allowedThemes: Array.isArray( parsed.allowedThemes ) ? parsed.allowedThemes : [ 'light', 'dark', 'system' ],
		};
	}

	function resolveBlogPostPayload( payload ) {
		if ( payload && typeof payload === 'object' && Array.isArray( payload.posts ) ) {
			return payload.posts;
		}

		return Array.isArray( payload ) ? payload : [];
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

		if ( ! menuTrigger || ! mobileMenu ) {
			return;
		}

		function closeMenu() {
			mobileMenu.hidden = true;
			menuTrigger.setAttribute( 'aria-expanded', 'false' );
			root.classList.remove( 'is-mobile-open' );
		}

		function toggleMenu() {
			const open = mobileMenu.hidden;
			mobileMenu.hidden = ! open;
			menuTrigger.setAttribute( 'aria-expanded', open ? 'true' : 'false' );
			root.classList.toggle( 'is-mobile-open', open );
		}

		menuTrigger.addEventListener( 'click', toggleMenu );

		root.querySelectorAll( '.hdc-site-shell__mobile-link' ).forEach( function ( link ) {
			link.addEventListener( 'click', closeMenu );
		} );

		window.addEventListener( 'resize', function () {
			if ( window.innerWidth >= 900 ) {
				closeMenu();
			}
		} );
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
		const storedTheme = window.localStorage.getItem( config.themeStorageKey );
		if ( storedTheme && config.allowedThemes.indexOf( storedTheme ) !== -1 ) {
			selectedTheme = storedTheme;
		}

		function updateThemeUI( resolvedTheme ) {
			trigger.textContent = 'Theme: ' + ( selectedTheme.charAt( 0 ).toUpperCase() + selectedTheme.slice( 1 ) );
			options.forEach( function ( option ) {
				const optionValue = option.getAttribute( 'data-hdc-theme-option' );
				const active = optionValue === selectedTheme;
				option.classList.toggle( ACTIVE_CLASS, active );
				option.setAttribute( 'aria-pressed', active ? 'true' : 'false' );
				option.setAttribute( 'data-theme-preview', resolvedTheme );
			} );
		}

		function closeMenu() {
			menu.hidden = true;
			root.classList.remove( 'is-theme-open' );
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

		trigger.addEventListener( 'click', function () {
			const opening = menu.hidden;
			menu.hidden = ! opening;
			root.classList.toggle( 'is-theme-open', opening );
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

		document.addEventListener( 'click', function ( event ) {
			if ( ! root.contains( event.target ) ) {
				closeMenu();
			}
		} );

		document.addEventListener( 'keydown', function ( event ) {
			if ( event.key === 'Escape' ) {
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

	function createItemNode( item, onSelect ) {
		const link = document.createElement( 'a' );
		link.className = 'hdc-site-shell__command-item focus-ring';
		link.href = item.url;

		const label = document.createElement( 'span' );
		label.className = 'hdc-site-shell__command-label';
		label.textContent = item.label;
		link.appendChild( label );

		if ( item.meta ) {
			const meta = document.createElement( 'span' );
			meta.className = 'hdc-site-shell__command-meta';
			meta.textContent = item.meta;
			link.appendChild( meta );
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
		const emptyState = root.querySelector( '[data-hdc-command-empty]' );

		if ( ! dialog || ! input || !pagesContainer || !postsContainer || !projectsContainer || !emptyState ) {
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

		const staticPages = config.navItems
			.map( function ( item ) {
				return {
					label: decodeHtml( item.label || '' ),
					url: item.url || '/',
					meta: 'Page',
				};
			} )
			.filter( function ( item ) {
				return item.label && item.url;
			} );

		function closeDialog() {
			dialog.hidden = true;
			document.body.classList.remove( 'hdc-command-open' );
			state.opened = false;
		}

		function openDialog() {
			dialog.hidden = false;
			document.body.classList.add( 'hdc-command-open' );
			state.opened = true;
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
				fetchJson( config.pagesEndpoint )
					.then( function ( payload ) {
						const pages = Array.isArray( payload ) ? payload : [];
						return pages.map( function ( page ) {
							return {
								label: decodeHtml( page?.title?.rendered || '' ),
								url: typeof page.link === 'string' ? page.link : '/',
								meta: 'Page',
							};
						} );
					} )
					.catch( function () {
						return [];
					} ),
				fetchJson( config.postsEndpoint )
					.then( function ( payload ) {
						return resolveBlogPostPayload( payload ).map( function ( post ) {
							const tags = Array.isArray( post?.tags ) ? post.tags.map( decodeHtml ).filter( Boolean ) : [];
							const readingTime = decodeHtml( post?.readingTime || '' );
							const tagSummary = tags.length ? tags.join( ', ' ) : '';
							const metaParts = [ 'Blog post' ];
							if ( readingTime ) {
								metaParts.push( readingTime );
							}
							if ( tagSummary ) {
								metaParts.push( tagSummary );
							}
							const meta = metaParts.join( ' · ' );

							return {
								label: decodeHtml( post?.title?.rendered || post?.title || '' ),
								url:
									typeof post?.url === 'string'
										? post.url
										: typeof post?.link === 'string'
											? post.link
											: '/',
								meta: meta,
								search: [ meta, tagSummary ].join( ' ' ),
							};
						} );
					} )
					.catch( function () {
						return [];
					} ),
				fetchJson( config.reposUrl )
					.then( function ( payload ) {
						const repos = Array.isArray( payload ) ? payload : [];
						return repos.map( function ( repo ) {
							const repoName = decodeHtml( repo?.name || '' );
							if ( ! repoName ) {
								return null;
							}
							const topics = Array.isArray( repo?.topics ) ? repo.topics.map( decodeHtml ).filter( Boolean ) : [];
							const topicSummary = topics.length ? topics.join( ', ' ) : '';
							const metaParts = [ decodeHtml( repo?.language || 'Project' ) ];
							if ( repo?.featured ) {
								metaParts.push( 'Featured' );
							}
							if ( topicSummary ) {
								metaParts.push( topicSummary );
							}
							const meta = metaParts.join( ' · ' );

							return {
								label: repoName,
								url: '/work/' + encodeURIComponent( repoName ) + '/',
								meta: meta,
								search: [ topicSummary, repo?.featured ? 'featured' : '' ].join( ' ' ),
							};
						} ).filter( Boolean );
					} )
					.catch( function () {
						return [];
					} ),
			];

			const results = await Promise.all( tasks );

			state.items.pages = dedupeByUrl( staticPages.concat( results[ 0 ] ) );
			state.items.posts = dedupeByUrl( results[ 1 ] );
			state.items.projects = dedupeByUrl( results[ 2 ] );
			render();
		}

		function renderGroup( container, items ) {
			container.innerHTML = '';
			items.slice( 0, 8 ).forEach( function ( item ) {
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
				const haystack = ( item.label + ' ' + ( item.meta || '' ) + ' ' + item.url + ' ' + ( item.search || '' ) ).toLowerCase();
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

			const total = filteredPages.length + filteredPosts.length + filteredProjects.length;
			emptyState.hidden = total !== 0;
		}

		triggers.forEach( function ( trigger ) {
			trigger.addEventListener( 'click', toggleDialog );
		} );

		closeButtons.forEach( function ( button ) {
			button.addEventListener( 'click', closeDialog );
		} );

		input.addEventListener( 'input', render );

		document.addEventListener( 'keydown', function ( event ) {
			const isShortcut = event.key.toLowerCase() === 'k' && ( event.ctrlKey || event.metaKey );
			if ( isShortcut ) {
				event.preventDefault();
				toggleDialog();
				return;
			}

			if ( event.key === 'Escape' && state.opened ) {
				closeDialog();
			}
		} );

		window.addEventListener( 'popstate', closeDialog );
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

	function updateFooterYear() {
		const year = String( new Date().getFullYear() );
		document.querySelectorAll( '[data-hdc-footer-year]' ).forEach( function ( node ) {
			node.textContent = year;
		} );
	}

	document.querySelectorAll( SHELL_SELECTOR ).forEach( initShell );
	updateFooterYear();
} )();
