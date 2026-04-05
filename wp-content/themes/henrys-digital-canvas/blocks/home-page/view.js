( function ( wp ) {
	if ( ! wp || ! wp.element ) {
		return;
	}

	const element = wp.element;
	const h = element.createElement;
	const useEffect = element.useEffect;
	const useState = element.useState;
	const createRoot = element.createRoot;
	const legacyRender = element.render;
	const renderLucideIcon =
		window.hdcSharedUtils && typeof window.hdcSharedUtils.renderLucideIcon === 'function'
			? window.hdcSharedUtils.renderLucideIcon
			: function () {
				return null;
			};

	let revealObserver = null;

	function initRevealObserver() {
		if ( typeof document === 'undefined' ) {
			return;
		}

		if ( revealObserver ) {
			revealObserver.disconnect();
			revealObserver = null;
		}

		if ( typeof IntersectionObserver === 'undefined' ) {
			document.querySelectorAll( '.hdc-reveal' ).forEach( function ( el ) {
				el.classList.add( 'is-visible' );
			} );
			return;
		}

		revealObserver = new IntersectionObserver(
			function ( entries ) {
				entries.forEach( function ( entry ) {
					if ( entry.isIntersecting ) {
						entry.target.classList.add( 'is-visible' );
						revealObserver.unobserve( entry.target );
					}
				} );
			},
			{ threshold: 0.1 }
		);

		document.querySelectorAll( '.hdc-reveal:not(.is-visible)' ).forEach( function ( el ) {
			var rect = el.getBoundingClientRect();
			var isAboveFold = rect.top < window.innerHeight && rect.bottom > 0;
			if ( isAboveFold ) {
				el.classList.add( 'is-visible' );
			} else {
				revealObserver.observe( el );
			}
		} );
	}

	const REPO_PROXY_PAGE_SIZE = 100;
	const REPO_PROXY_MAX_PAGES = 20;

	function ensureString( value, fallback ) {
		if ( typeof value !== 'string' ) {
			return fallback;
		}

		const trimmed = value.trim();
		return trimmed || fallback;
	}

	function ensureArray( value ) {
		return Array.isArray( value ) ? value : [];
	}

	function ensureObject( value ) {
		return value && typeof value === 'object' ? value : {};
	}

	function clamp( value, min, max ) {
		return Math.max( min, Math.min( max, value ) );
	}

	function stripHtml( value ) {
		if ( typeof value !== 'string' ) {
			return '';
		}

		return value.replace( /<[^>]+>/g, ' ' ).replace( /\s+/g, ' ' ).trim();
	}

	function withQuery( base, params ) {
		const separator = base.indexOf( '?' ) === -1 ? '?' : '&';
		return base + separator + params.toString();
	}

	function normalizeAppPath( value ) {
		const normalized = ensureString( value, '' );
		if ( ! normalized || '/' === normalized || '/' !== normalized.charAt( 0 ) ) {
			return normalized;
		}

		if ( 0 === normalized.indexOf( '/wp-json/' ) || 0 === normalized.indexOf( '/api/' ) ) {
			return normalized;
		}

		const suffixIndex = normalized.search( /[?#]/ );
		const path = -1 === suffixIndex ? normalized : normalized.slice( 0, suffixIndex );
		const suffix = -1 === suffixIndex ? '' : normalized.slice( suffixIndex );
		const trimmedPath = path.replace( /\/+$/, '' ) || '/';

		return trimmedPath + suffix;
	}

	function normalizePostsEndpoint( endpoint, count ) {
		const perPage = clamp( Number.parseInt( count, 10 ) || 3, 1, 10 );

		if ( ! endpoint ) {
			return '/wp-json/henrys-digital-canvas/v1/blog?limit=' + String( perPage );
		}

		try {
			const parsed = new URL( endpoint, window.location.origin );
			parsed.searchParams.set( 'limit', String( perPage ) );
			return parsed.toString();
		} catch ( error ) {
			return withQuery(
				endpoint,
				new URLSearchParams( {
					limit: String( perPage ),
				} )
			);
		}
	}

	function resolveRequestUrl( value ) {
		const normalized = ensureString( value, '' );
		if ( ! normalized ) {
			return normalized;
		}

		if ( /^https?:\/\//i.test( normalized ) ) {
			return normalized;
		}

		if ( normalized.charAt( 0 ) === '/' ) {
			return new URL( normalized, window.location.origin ).toString();
		}

		return normalized;
	}

	function parseStableDate( rawDate ) {
		const value = ensureString( rawDate, '' );
		if ( ! value ) {
			return null;
		}

		const normalized = /^\d{4}-\d{2}-\d{2}$/.test( value ) ? value + 'T12:00:00' : value;
		const date = new Date( normalized );

		return Number.isNaN( date.getTime() ) ? null : date;
	}

	function formatDate( rawDate ) {
		const date = parseStableDate( rawDate );
		if ( ! date ) {
			return '';
		}

		return date.toLocaleDateString( undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		} );
	}

	function getUpdatedAtTimestamp( value ) {
		const date = parseStableDate( value );
		const timestamp = date ? date.getTime() : 0;
		return Number.isFinite( timestamp ) ? timestamp : 0;
	}

	function humanizeRepoName( name ) {
		return String( name || '' )
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

	function getHomeRepoTitle( repo ) {
		return ensureString( repo.displayName, '' ) || humanizeRepoName( repo.name );
	}

	function getHomeRepoSummary( repo ) {
		return ensureString( repo.whyItMatters, '' ) || ensureString( repo.description, 'Description coming soon.' );
	}

	function isGitHubLinkedRepo( repo ) {
		return repo.origin === 'github' || /github\.com\//i.test( ensureString( repo.externalUrl, '' ) );
	}

	function getHomeRepoBadge( repo ) {
		if ( repo.access === 'private' ) {
			return 'Private case study';
		}

		if ( isGitHubLinkedRepo( repo ) ) {
			return 'Open source';
		}

		return 'Curated project';
	}

	function getHomeRepoSourceBadge( repo, source ) {
		if ( repo.access === 'private' ) {
			return null;
		}

		if ( source === 'live' ) {
			return repo.origin === 'github' ? 'Live GitHub' : null;
		}

		return isGitHubLinkedRepo( repo ) ? 'GitHub snapshot' : null;
	}

	function getHomeRepoCtaLabel( repo ) {
		if ( repo.origin === 'github' && repo.access !== 'private' ) {
			return 'View project';
		}

		return 'View case study';
	}

	function renderActionArrow() {
		return h(
			'span',
			{ 'aria-hidden': 'true', className: 'hdc-home-page__action-icon' },
			renderLucideIcon( h, 'arrow-right', {
				className: 'hdc-home-page__action-icon-svg',
				size: 14,
			} )
		);
	}

	function parseConfig( section ) {
		let parsed = {};
		try {
			parsed = JSON.parse( section.getAttribute( 'data-config' ) || '{}' );
		} catch ( error ) {
			parsed = {};
		}

		return {
			hero: ensureObject( parsed.hero ),
			selectedWork: ensureObject( parsed.selectedWork ),
			throughline: ensureObject( parsed.throughline ),
			resumeSnapshot: ensureObject( parsed.resumeSnapshot ),
			recentWriting: ensureObject( parsed.recentWriting ),
			contactCta: ensureObject( parsed.contactCta ),
			initialPosts: parsed.initialPosts,
			initialResume: parsed.initialResume,
			githubUsername: ensureString( parsed.githubUsername, 'henryperkins' ),
			githubProxyUrl: ensureString( parsed.githubProxyUrl, '/api/github/repos' ),
			workEndpoint: ensureString( parsed.workEndpoint, '/wp-json/henrys-digital-canvas/v1/work' ),
			blogEndpoint: ensureString( parsed.blogEndpoint, '/wp-json/henrys-digital-canvas/v1/blog?limit=3' ),
			resumeEndpoint: ensureString( parsed.resumeEndpoint, '/wp-json/henrys-digital-canvas/v1/resume' ),
			blogCount: clamp( Number.parseInt( parsed.blogCount, 10 ) || 3, 1, 6 ),
			repoCount: clamp( Number.parseInt( parsed.repoCount, 10 ) || 3, 1, 6 ),
		};
	}

	function normalizeRepoItem( repo, fallbackRepo ) {
		const sourceRepo = ensureObject( repo );
		const localRepo = ensureObject( fallbackRepo );
		const name = ensureString( sourceRepo.name, ensureString( localRepo.name, 'unnamed-repository' ) );
		const updatedAt = ensureString(
			sourceRepo.updatedAt,
			ensureString( sourceRepo.pushed_at, ensureString( localRepo.updatedAt, '' ) )
		);

		return {
			id: sourceRepo.id || localRepo.id || name,
			name: name,
			displayName: ensureString( localRepo.displayName, ensureString( sourceRepo.displayName, '' ) ),
			description: ensureString( localRepo.description, '' ) || ensureString( sourceRepo.description, 'Description coming soon.' ),
			externalUrl: ensureString(
				sourceRepo.html_url,
				ensureString( localRepo.url, ensureString( sourceRepo.url, '' ) )
			),
			language: ensureString( sourceRepo.language, ensureString( localRepo.language, 'Unknown' ) ),
			updatedAt: updatedAt,
			featured: !! localRepo.featured || !! sourceRepo.featured,
			access: ensureString( localRepo.access, sourceRepo.private ? 'private' : ensureString( sourceRepo.access, 'public' ) ),
			origin: ensureString(
				sourceRepo.origin,
				/github\.com/i.test( ensureString( sourceRepo.html_url, '' ) )
					? 'github'
					: ensureString( localRepo.origin, 'curated' )
			),
			whyItMatters: ensureString( localRepo.whyItMatters, ensureString( sourceRepo.whyItMatters, '' ) ),
			url: normalizeAppPath( '/work/' + encodeURIComponent( name ) + '/' ),
		};
	}

	function compareReposByUpdatedAtDesc( left, right ) {
		const delta = getUpdatedAtTimestamp( right.updatedAt ) - getUpdatedAtTimestamp( left.updatedAt );
		if ( delta !== 0 ) {
			return delta;
		}

		return String( left.name ).localeCompare( String( right.name ) );
	}

	function mapGitHubRepos( apiRepos, fallbackRepos ) {
		const fallbackByName = new Map();
		( fallbackRepos || [] ).forEach( function ( repo ) {
			fallbackByName.set( repo.name, repo );
		} );

		const merged = ensureArray( apiRepos )
			.filter( function ( repo ) {
				const fallbackRepo = fallbackByName.get( repo && repo.name ? repo.name : '' );
				if ( repo && repo.fork ) {
					return false;
				}
				if ( repo && repo.archived ) {
					return false;
				}

				return Boolean( ensureString( repo && repo.language, '' ) || ( fallbackRepo && fallbackRepo.language ) );
			} )
			.map( function ( repo ) {
				return normalizeRepoItem( repo, fallbackByName.get( repo && repo.name ? repo.name : '' ) );
			} );

		const mergedNames = new Set(
			merged.map( function ( repo ) {
				return repo.name;
			} )
		);
		const missingFallback = ensureArray( fallbackRepos ).filter( function ( repo ) {
			return ! mergedNames.has( repo.name );
		} );

		return merged.concat( missingFallback ).sort( compareReposByUpdatedAtDesc );
	}

	function isRateLimitError( error ) {
		if ( ! error || typeof error !== 'object' ) {
			return false;
		}

		return Boolean(
			error.rateLimited ||
			error.status === 429 ||
			( error.status === 403 && /rate limit/i.test( String( error.message || '' ) ) )
		);
	}

	function isOfflineError( error ) {
		if ( typeof navigator !== 'undefined' && navigator.onLine === false ) {
			return true;
		}

		if ( error instanceof TypeError && /failed to fetch|network|load failed/i.test( error.message ) ) {
			return true;
		}

		if ( error instanceof Error && /offline|network|failed to fetch/i.test( error.message ) ) {
			return true;
		}

		return false;
	}

	function normalizePostItem( post ) {
		const slug = ensureString( post && post.slug, '' );
		const title = stripHtml( post && ( post.title && post.title.rendered ? post.title.rendered : post.title ) ) || 'Untitled post';
		const thumbnailUrl = ensureString( post && post.featuredImageUrl, '' );

		return {
			id: post && post.id ? post.id : slug || title,
			link: slug ? normalizeAppPath( '/blog/' + encodeURIComponent( slug ) + '/' ) : normalizeAppPath( ensureString( post && post.url, '#' ) ),
			title: title,
			excerpt: stripHtml( post && post.excerpt ),
			date: ensureString( post && post.date, '' ),
			dateLabel: formatDate( post && post.date ),
			readingTime: ensureString( post && post.readingTime, '' ),
			thumbnailUrl: thumbnailUrl,
			thumbnailAlt: ensureString( post && post.featuredImageAlt, 'Featured image for ' + title ),
			thumbnailSrcSet: ensureString( post && post.featuredImageSrcSet, '' ),
		};
	}

	function normalizePostsPayload( payload, count ) {
		const posts = payload && Array.isArray( payload.posts ) ? payload.posts : Array.isArray( payload ) ? payload : [];

		return posts.slice( 0, count ).map( normalizePostItem );
	}

	function normalizeResumeData( payload ) {
		const resume = payload && payload.data ? payload.data : payload;

		return resume && typeof resume === 'object' && ! Array.isArray( resume ) ? resume : null;
	}

	async function fetchPosts( config ) {
		const endpoint = normalizePostsEndpoint( config.blogEndpoint, config.blogCount );
		const response = await fetch( endpoint, {
			headers: {
				Accept: 'application/json',
			},
		} );

		if ( ! response.ok ) {
			throw new Error( 'Post request failed with status ' + response.status );
		}

		const payload = await response.json();

		return normalizePostsPayload( payload, config.blogCount );
	}

	async function fetchReposFromContract( config ) {
		const endpoint = resolveRequestUrl( config.workEndpoint );
		const response = await fetch( endpoint, {
			headers: {
				Accept: 'application/json',
			},
		} );

		if ( ! response.ok ) {
			throw new Error( 'Work contract request failed with status ' + response.status );
		}

		const payload = await response.json();
		const repos = payload && Array.isArray( payload.repos ) ? payload.repos : Array.isArray( payload ) ? payload : [];

		return repos.map( function ( repo ) {
			return normalizeRepoItem( repo, null );
		} );
	}

	async function fetchGitHubReposFromProxy( config ) {
		const requestBaseUrl = resolveRequestUrl( config.githubProxyUrl );
		const allRepos = [];

		for ( let page = 1; page <= REPO_PROXY_MAX_PAGES; page += 1 ) {
			const requestUrl = new URL( requestBaseUrl );
			requestUrl.searchParams.set( 'username', config.githubUsername );
			requestUrl.searchParams.set( 'per_page', String( REPO_PROXY_PAGE_SIZE ) );
			requestUrl.searchParams.set( 'page', String( page ) );

			const response = await fetch( requestUrl.toString(), {
				headers: {
					Accept: 'application/json',
				},
			} );
			let payload = null;
			try {
				payload = await response.json();
			} catch ( error ) {
				payload = null;
			}

			if ( ! response.ok ) {
				const requestError = new Error(
					( payload && payload.error ? String( payload.error ) : 'GitHub request failed' ) +
						' (status ' +
						response.status +
						')'
				);
				requestError.status = response.status;
				requestError.rateLimited =
					response.status === 429 ||
					( response.status === 403 && response.headers.get( 'x-github-ratelimit-remaining' ) === '0' );
				throw requestError;
			}

			if ( ! Array.isArray( payload ) ) {
				throw new Error( 'GitHub proxy response format is invalid.' );
			}

			allRepos.push.apply( allRepos, payload );
			if ( payload.length < REPO_PROXY_PAGE_SIZE ) {
				break;
			}
		}

		return allRepos;
	}

	async function fetchRepos( config ) {
		let fallbackRepos = [];

		try {
			fallbackRepos = await fetchReposFromContract( config );
		} catch ( error ) {
			fallbackRepos = [];
		}

		try {
			const liveRepos = await fetchGitHubReposFromProxy( config );
			return {
				items: mapGitHubRepos( liveRepos, fallbackRepos ),
				source: 'live',
			};
		} catch ( error ) {
			if ( fallbackRepos.length > 0 ) {
				return {
					items: fallbackRepos.sort( compareReposByUpdatedAtDesc ),
					source: isRateLimitError( error )
						? 'fallback-ratelimit'
						: isOfflineError( error )
							? 'fallback-offline'
							: 'fallback-error',
				};
			}

			throw error;
		}
	}

	async function fetchResume( config ) {
		const response = await fetch( resolveRequestUrl( config.resumeEndpoint ), {
			headers: {
				Accept: 'application/json',
			},
		} );

		if ( ! response.ok ) {
			throw new Error( 'Resume request failed with status ' + response.status );
		}

		const payload = await response.json();
		return normalizeResumeData( payload );
	}

	function StateCard( props ) {
		const hasLinkAction = props.actionHref && props.actionLabel;
		const hasButtonAction = typeof props.onButtonClick === 'function' && props.buttonLabel;

		return h(
			'div',
			{ className: 'hdc-home-page__empty-state ember-surface' },
			h(
				'span',
				{ 'aria-hidden': 'true', className: 'hdc-home-page__empty-state-icon' },
				renderLucideIcon( h, props.iconName, {
					className: 'hdc-home-page__empty-state-icon-svg' + ( props.spinIcon ? ' hdc-home-page__empty-state-icon-svg--spin' : '' ),
					size: 20,
				} )
			),
			h( 'h2', { className: 'hdc-home-page__empty-title' }, props.title ),
			props.description ? h( 'p', { className: 'hdc-home-page__empty' }, props.description ) : null,
			hasLinkAction || hasButtonAction
				? h(
					'div',
					{ className: 'hdc-home-page__empty-actions' },
					hasButtonAction
						? h(
							'button',
							{
								className: 'hdc-home-page__retry focus-ring',
								onClick: props.onButtonClick,
								type: 'button',
							},
							props.buttonLabel
						)
						: null,
						hasLinkAction
							? h(
								'a',
								{
									className: 'hdc-home-page__text-link focus-ring',
									href: normalizeAppPath( props.actionHref ),
								},
								props.actionLabel,
								renderActionArrow()
							)
							: null
				)
				: null
		);
	}

	function EmptyStateCard( props ) {
		return h( StateCard, {
			actionHref: props.actionHref,
			actionLabel: props.actionLabel,
			description: props.description,
			iconName: 'inbox',
			title: props.title,
		} );
	}

	function ErrorStateCard( props ) {
		return h( StateCard, {
			buttonLabel: props.buttonLabel,
			description: props.description,
			iconName: 'alert-circle',
			onButtonClick: props.onButtonClick,
			title: props.title,
		} );
	}

	function RecentWritingLoadingState( props ) {
		return h( StateCard, {
			description: props.description,
			iconName: 'loader-2',
			spinIcon: true,
			title: props.title,
		} );
	}

	function WorkGridLoadingState( props ) {
		return h(
			'div',
			{ 'aria-hidden': 'true', className: 'hdc-home-page__work-grid' },
			Array.from( { length: props.count } ).map( function ( item, index ) {
				return h(
					'div',
					{
						className: 'hdc-home-page__work-card hdc-home-page__work-card--skeleton ember-surface',
						key: 'work-skeleton-' + String( index ),
					},
					h(
						'div',
						{ className: 'hdc-home-page__work-meta' },
						h( 'span', { className: 'hdc-home-page__skeleton hdc-home-page__skeleton--meta' } ),
						h( 'span', { className: 'hdc-home-page__skeleton hdc-home-page__skeleton--badge' } )
					),
					h( 'span', { className: 'hdc-home-page__skeleton hdc-home-page__skeleton--title' } ),
					h( 'span', { className: 'hdc-home-page__skeleton hdc-home-page__skeleton--line' } ),
					h( 'span', { className: 'hdc-home-page__skeleton hdc-home-page__skeleton--line hdc-home-page__skeleton--line-short' } ),
					h(
						'div',
						{ className: 'hdc-home-page__card-footer' },
						h( 'span', { className: 'hdc-home-page__skeleton hdc-home-page__skeleton--meta' } ),
						h( 'span', { className: 'hdc-home-page__skeleton hdc-home-page__skeleton--meta' } )
					)
				);
			} )
		);
	}

	function ResumeSnapshotLoadingState() {
		return h(
			'div',
			{ 'aria-hidden': 'true', className: 'hdc-home-page__resume-stack' },
			h( 'span', { className: 'hdc-home-page__skeleton hdc-home-page__skeleton--title hdc-home-page__skeleton--title-wide' } ),
			h( 'span', { className: 'hdc-home-page__skeleton hdc-home-page__skeleton--line' } ),
			h( 'span', { className: 'hdc-home-page__skeleton hdc-home-page__skeleton--line hdc-home-page__skeleton--line-short' } ),
			h(
				'div',
				{ className: 'hdc-home-page__resume-snapshot' },
				h( 'span', { className: 'hdc-home-page__skeleton hdc-home-page__skeleton--meta' } ),
				h( 'span', { className: 'hdc-home-page__skeleton hdc-home-page__skeleton--line hdc-home-page__skeleton--line-medium' } )
			),
			h(
				'div',
				{ className: 'hdc-home-page__badges', 'data-loading': 'true' },
				h( 'span', { className: 'hdc-home-page__skeleton hdc-home-page__skeleton--badge' } ),
				h( 'span', { className: 'hdc-home-page__skeleton hdc-home-page__skeleton--badge' } ),
				h( 'span', { className: 'hdc-home-page__skeleton hdc-home-page__skeleton--badge' } )
			)
		);
	}


	function HomePageApp( props ) {
		const config = props.config;
		const initialPosts = normalizePostsPayload( config.initialPosts, config.blogCount );
		const initialResume = normalizeResumeData( config.initialResume );
		const [ reposState, setReposState ] = useState( {
			error: '',
			items: [],
			loading: true,
			source: 'fallback-error',
		} );
		const [ postsState, setPostsState ] = useState( {
			error: '',
			items: initialPosts,
			loading: initialPosts.length === 0,
		} );
		const [ postsRetryCount, setPostsRetryCount ] = useState( 0 );
		const [ resumeState, setResumeState ] = useState( {
			data: initialResume,
			loading: ! initialResume,
		} );

		useEffect(
			function () {
				initRevealObserver();
			},
			[ reposState.loading, postsState.loading, resumeState.loading ]
		);

		useEffect(
			function () {
				let cancelled = false;

				fetchRepos( config )
					.then( function ( result ) {
						if ( cancelled ) {
							return;
						}

						setReposState( {
							error: '',
							items: result.items,
							loading: false,
							source: result.source,
						} );
					} )
					.catch( function ( error ) {
						if ( cancelled ) {
							return;
						}

						setReposState( {
							error: error instanceof Error ? error.message : 'Selected work is temporarily unavailable.',
							items: [],
							loading: false,
							source: 'fallback-error',
						} );
					} );

				fetchResume( config )
					.then( function ( resume ) {
						if ( cancelled ) {
							return;
						}

						setResumeState( {
							data: resume && typeof resume === 'object' ? resume : null,
							loading: false,
						} );
					} )
					.catch( function () {
						if ( cancelled ) {
							return;
						}

						setResumeState( {
							data: initialResume,
							loading: false,
						} );
					} );

				return function () {
					cancelled = true;
				};
			},
			[ config ]
		);

		useEffect(
			function () {
				let cancelled = false;

				fetchPosts( config )
					.then( function ( posts ) {
						if ( cancelled ) {
							return;
						}

						setPostsState( {
							error: '',
							items: posts,
							loading: false,
						} );
					} )
					.catch( function ( error ) {
						if ( cancelled ) {
							return;
						}

						setPostsState( {
							error: error instanceof Error ? error.message : 'Recent writing is temporarily unavailable.',
							items: initialPosts,
							loading: false,
						} );
					} );

				return function () {
					cancelled = true;
				};
			},
			[ config, postsRetryCount ]
		);

		const featuredRepos = reposState.items.filter( function ( repo ) {
			return repo.featured;
		} ).slice( 0, config.repoCount );
		const selectedWorkEmptyTitle = ensureString( config.selectedWork.emptyTitle, 'Selected work is updating' );
		const selectedWorkEmptyDescription = reposState.source === 'live'
			? ensureString(
				config.selectedWork.emptyDescriptionLive,
				'Featured work is being refreshed for the homepage. Use View all work to browse the full project library.'
			)
			: ensureString(
				config.selectedWork.emptyDescriptionFallback,
				'Featured work is not available in this snapshot. Use View all work to browse the full project library.'
			);
		const recentWritingEmptyTitle = ensureString( config.recentWriting.emptyTitle, 'Recent writing is updating' );
		const recentWritingEmptyDescription = ensureString(
			config.recentWriting.emptyDescription,
			'Recent posts are not available in the homepage feed right now. Use All posts to check the full writing index.'
		);
		const recentWritingLoadingTitle = ensureString( config.recentWriting.loadingTitle, 'Loading recent writing' );
		const recentWritingLoadingDescription = ensureString(
			config.recentWriting.loadingDescription,
			'Please wait while the latest posts are prepared for the homepage.'
		);
		const recentWritingErrorTitle = ensureString( config.recentWriting.errorTitle, 'Could not load recent writing' );
		const recentWritingErrorDescription = ensureString(
			config.recentWriting.errorDescription,
			'The homepage writing feed is temporarily unavailable. Try again or visit the full blog index.'
		);
		const recentWritingRetryLabel = ensureString( config.recentWriting.retryLabel, 'Try again' );
		const resumeSnapshotLabel = ensureString( config.resumeSnapshot.label, '' );
		const resumeSnapshotItems = ensureArray( config.resumeSnapshot.items ).filter( function ( item ) {
			return typeof item === 'string' && item.trim();
		} );
		const resume = resumeState.data;

		function handleRetryPosts() {
			setPostsState( function ( currentState ) {
				return {
					error: '',
					items: currentState.items,
					loading: currentState.items.length === 0,
				};
			} );
			setPostsRetryCount( function ( currentCount ) {
				return currentCount + 1;
			} );
		}

		return h(
			'div',
			{},
			h(
				'section',
				{ className: 'hdc-home-page__hero noise hdc-reveal hdc-reveal--fade-in', style: { '--reveal-index': 0 } },
				h(
					'div',
					{ className: 'hero-backdrop-editorial-amber', 'aria-hidden': 'true' },
					h( 'div', { className: 'hero-backdrop-overlay' } )
				),
				h( 'div', { className: 'hdc-home-page__hero-gradient hero-gradient-layer', 'aria-hidden': 'true' } ),
				h(
					'div',
					{ className: 'hdc-home-page__hero-shell' },
					h(
						'div',
						{ className: 'hdc-home-page__hero-content' },
						ensureString( config.hero.eyebrow, '' )
							? h( 'p', { className: 'hdc-home-page__hero-eyebrow' }, ensureString( config.hero.eyebrow, '' ) )
							: null,
						h( 'h1', { className: 'hdc-home-page__hero-title' }, ensureString( config.hero.title, 'Henry T. Perkins' ) ),
						h( 'p', { className: 'hdc-home-page__hero-description' }, ensureString( config.hero.description, '' ) ),
						h(
							'div',
							{ className: 'hdc-home-page__hero-actions' },
						h(
							'a',
							{
								className: 'hdc-home-page__button hdc-home-page__button--hero focus-ring',
								'data-contrast-probe': 'hero-action-primary-home',
								href: normalizeAppPath( ensureString( config.hero.primaryCtaHref, '/contact/' ) ),
							},
							ensureString( config.hero.primaryCtaLabel, 'Work with me' ),
							renderLucideIcon( h, 'arrow-right', { size: 16 } )
						),
						h(
							'a',
							{
								className: 'hdc-home-page__button hdc-home-page__button--secondary hdc-home-page__button--hero-secondary focus-ring',
								'data-contrast-probe': 'hero-action-secondary-home',
								href: normalizeAppPath( ensureString( config.hero.secondaryCtaHref, '/contact/' ) ),
							},
								ensureString( config.hero.secondaryCtaLabel, 'Work With Me' ),
								renderLucideIcon( h, 'arrow-right', { size: 16 } )
							)
						)
					)
				)
			),
			h(
				'section',
				{ className: 'hdc-home-page__section', id: 'selected-work' },
				h(
					'div',
					{ className: 'hdc-home-page__section-header' },
					h( 'h2', { className: 'hdc-home-page__section-title' }, ensureString( config.selectedWork.title, 'Selected Work' ) ),
					h(
						'a',
						{
							className: 'hdc-home-page__section-link focus-ring',
							href: normalizeAppPath( ensureString( config.selectedWork.actionHref, '/work/' ) ),
						},
						ensureString( config.selectedWork.actionLabel, 'View all work' ),
						renderActionArrow()
					)
				),
				reposState.loading
					? h( WorkGridLoadingState, { count: config.repoCount } )
					: featuredRepos.length
						? h(
							'div',
							{ className: 'hdc-home-page__work-grid' },
							featuredRepos.map( function ( repo, repoIndex ) {
								return h(
									'a',
									{
										className: 'hdc-home-page__work-card ember-surface focus-ring hdc-reveal',
										href: repo.url,
										key: repo.id || repo.name,
										style: { '--reveal-index': repoIndex },
									},
									h(
										'div',
										{ className: 'hdc-home-page__work-meta' },
										h(
											'span',
											{ className: 'hdc-home-page__work-origin' },
											h(
												'span',
												{ 'aria-hidden': 'true', className: 'hdc-home-page__work-origin-icon' },
											renderLucideIcon( h, repo.origin === 'github' ? 'github' : 'briefcase-business', {
												className: 'hdc-home-page__work-origin-icon-svg',
												size: 14,
											} )
											),
											h( 'span', {}, repo.language )
										),
										h( 'span', { className: 'hdc-home-page__badge' }, getHomeRepoBadge( repo ) ),
										getHomeRepoSourceBadge( repo, reposState.source )
											? h( 'span', { className: 'hdc-home-page__badge hdc-home-page__badge--outline' }, getHomeRepoSourceBadge( repo, reposState.source ) )
											: null
									),
									h( 'h3', { className: 'hdc-home-page__card-title' }, getHomeRepoTitle( repo ) ),
									h( 'p', { className: 'hdc-home-page__card-copy hdc-home-page__card-copy--clamp' }, getHomeRepoSummary( repo ) ),
									h(
										'div',
										{ className: 'hdc-home-page__card-footer' },
										h(
											'span',
											{ className: 'hdc-home-page__card-date' },
											h(
												'span',
												{ 'aria-hidden': 'true', className: 'hdc-home-page__card-date-icon' },
												renderLucideIcon( h, 'clock', {
													className: 'hdc-home-page__card-date-icon-svg',
													size: 12,
												} )
											),
											h( 'span', { className: 'screen-reader-text' }, 'Updated:' ),
											formatDate( repo.updatedAt )
										),
										h( 'span', { className: 'hdc-home-page__card-cta' }, getHomeRepoCtaLabel( repo ), renderActionArrow() )
									)
								);
							} )
						)
						: h( EmptyStateCard, {
							description: selectedWorkEmptyDescription,
							title: selectedWorkEmptyTitle,
						} )
			),
			h(
				'section',
				{ className: 'hdc-home-page__section', id: 'throughline' },
				h(
					'div',
					{ className: 'hdc-reveal hdc-reveal--fade-in', style: { '--reveal-index': 0 } },
					h( 'h2', { className: 'hdc-home-page__section-title hdc-home-page__section-title--intro' }, ensureString( config.throughline.title, 'From the floor to the frontier.' ) )
				),
				h(
					'div',
					{ className: 'hdc-home-page__throughline-grid' },
					h(
						'div',
						{ className: 'hdc-home-page__throughline-story surface-library-learning-paper' },
						h(
							'div',
							{ className: 'hdc-home-page__throughline-narrative' },
							ensureArray( config.throughline.paragraphs ).map( function ( paragraph, index ) {
								return h( 'p', { className: 'hdc-home-page__throughline-paragraph', key: 'tp-' + String( index ) }, ensureString( paragraph, '' ) );
							} )
						)
					),
					h(
						'div',
						{ className: 'hdc-reveal', style: { '--reveal-index': 1 } },
						h(
							'div',
							{ className: 'hdc-home-page__throughline-quote-card surface-library-ember-topography' },
							h(
								'div',
								{ className: 'hdc-home-page__throughline-quote-header' },
								renderLucideIcon( h, 'quote', { size: 18, props: { 'aria-hidden': 'true' } } ),
								h( 'span', { className: 'hdc-home-page__eyebrow' }, ensureString( ensureObject( config.throughline.quote ).eyebrow, 'A former colleague' ) )
							),
							h(
								'blockquote',
								{ className: 'hdc-home-page__throughline-blockquote' },
								h( 'p', { className: 'hdc-home-page__throughline-quote-text' }, '\u201C' + ensureString( ensureObject( config.throughline.quote ).text, '' ) + '\u201D' ),
								h( 'footer', { className: 'hdc-home-page__throughline-quote-footer' }, ensureString( ensureObject( config.throughline.quote ).attribution, '' ) )
							)
						)
					)
				)
			),
			h(
				'section',
				{ className: 'hdc-home-page__section', id: 'resume-snapshot' },
				h(
					'div',
					{ className: 'hdc-home-page__section-header' },
					h( 'h2', { className: 'hdc-home-page__section-title' }, ensureString( config.resumeSnapshot.title, 'Resume Snapshot' ) ),
					h(
						'a',
						{
							className: 'hdc-home-page__section-link focus-ring',
							href: normalizeAppPath( ensureString( config.resumeSnapshot.actionHref, '/resume/' ) ),
						},
						ensureString( config.resumeSnapshot.actionLabel, 'Interactive resume' ),
						renderActionArrow()
					)
				),
					h(
						'div',
						{ className: 'hdc-home-page__resume-grid' },
					h(
						'div',
						{ className: 'hdc-home-page__resume-card ember-surface' },
						h( 'p', { className: 'hdc-home-page__eyebrow', 'data-contrast-probe': 'ember-eyebrow-home' }, ensureString( config.resumeSnapshot.positioningEyebrow, 'Positioning' ) ),
						resumeState.loading
							? h( ResumeSnapshotLoadingState )
							: h(
							'div',
							{ className: 'hdc-home-page__resume-stack' },
							resume && resume.headline ? h( 'h3', { className: 'hdc-home-page__card-title' }, resume.headline ) : null,
							resume && resume.subheadline ? h( 'p', { className: 'hdc-home-page__card-copy', 'data-contrast-probe': 'ember-body-home' }, resume.subheadline ) : null,
								resumeSnapshotLabel || resumeSnapshotItems.length
									? h(
										'div',
										{ className: 'hdc-home-page__resume-snapshot' },
										resumeSnapshotLabel ? h( 'p', { className: 'hdc-home-page__resume-snapshot-label' }, resumeSnapshotLabel ) : null,
										resumeSnapshotItems.length
											? h(
												'p',
												{ className: 'hdc-home-page__resume-snapshot-items' },
												resumeSnapshotItems.reduce( function ( acc, item, idx ) {
													if ( idx > 0 ) {
														acc.push( h( 'span', { className: 'hdc-home-page__inline-dot', 'aria-hidden': 'true', key: 'dot-' + String( idx ) }, '\u00B7' ) );
													}
													acc.push( h( 'span', { key: 'item-' + String( idx ) }, item ) );
													return acc;
												}, [] )
											)
											: null
									)
									: null,
								resume && Array.isArray( resume.targetRoles ) && resume.targetRoles.length
									? h(
										'div',
										{ className: 'hdc-home-page__badges' },
										resume.targetRoles.map( function ( role ) {
											return h( 'span', { className: 'hdc-home-page__badge', key: role }, role );
										} )
									)
									: null,
								ensureArray( config.resumeSnapshot.actionLinks ).length
									? h(
										'div',
										{ className: 'hdc-home-page__inline-links' },
										ensureArray( config.resumeSnapshot.actionLinks ).map( function ( link, index ) {
											const normalizedLink = ensureObject( link );
											return h(
												'a',
												{
											className: 'hdc-home-page__text-link focus-ring',
											href: normalizeAppPath( ensureString( normalizedLink.href, '/resume/' ) ),
											key: ensureString( normalizedLink.href, 'resume-link-' + String( index ) ),
										},
										ensureString( normalizedLink.label, 'Learn more' ),
										renderActionArrow()
									);
										} )
									)
									: null
							)
					),
					h(
						'div',
						{ className: 'hdc-home-page__resume-card hdc-home-page__resume-card--accent ember-surface ember-surface-strong' },
						h( 'p', { className: 'hdc-home-page__eyebrow' }, ensureString( config.resumeSnapshot.bestFitEyebrow, 'Best fit' ) ),
						h( 'h3', { className: 'hdc-home-page__card-title' }, ensureString( config.resumeSnapshot.bestFitTitle, 'Where I contribute fastest' ) ),
						h(
							'ul',
							{ className: 'hdc-home-page__list list-accent-disc' },
							ensureArray( config.resumeSnapshot.focusAreas ).map( function ( area, index ) {
								return h( 'li', { key: 'focus-area-' + String( index ) }, ensureString( area, '' ) );
							} )
						)
					)
				)
			),
			h(
				'section',
				{ className: 'hdc-home-page__section hdc-feed-section', id: 'recent-writing' },
				h(
					'div',
					{ className: 'hdc-home-page__section-header' },
					h( 'h2', { className: 'hdc-home-page__section-title' }, ensureString( config.recentWriting.title, 'Recent Writing' ) ),
					h(
						'a',
						{
							className: 'hdc-home-page__section-link focus-ring',
							href: normalizeAppPath( ensureString( config.recentWriting.actionHref, '/blog/' ) ),
						},
						ensureString( config.recentWriting.actionLabel, 'All posts' ),
						renderActionArrow()
					)
				),
				postsState.loading
					? h( RecentWritingLoadingState, {
						description: recentWritingLoadingDescription,
						title: recentWritingLoadingTitle,
					} )
					: postsState.items.length
						? h(
							'div',
							{ className: 'hdc-home-page__post-stack' },
							postsState.items.map( function ( post, postIndex ) {
								return h(
									'a',
									{
										className: 'hdc-home-page__post-card focus-ring hdc-reveal hdc-reveal--slide-left',
										href: post.link,
										key: post.id,
										style: { '--reveal-index': postIndex },
									},
									post.thumbnailUrl
										? h(
											'div',
											{ className: 'hdc-home-page__post-thumb-wrap' },
											h( 'img', {
												alt: post.thumbnailAlt,
												className: 'hdc-feed-card-thumb',
												decoding: 'async',
												loading: 'lazy',
												onError: function ( e ) { e.target.style.display = 'none'; },
												sizes: '(min-width: 640px) 112px, 96px',
												src: post.thumbnailUrl,
												srcSet: post.thumbnailSrcSet || undefined,
											} )
										)
										: null,
									h(
										'div',
										{ className: 'hdc-home-page__post-body' },
										h( 'h3', { className: 'hdc-home-page__card-title hdc-home-page__card-title--row' }, post.title ),
										h( 'p', { className: 'hdc-home-page__card-copy hdc-home-page__card-copy--clamp' }, post.excerpt ),
										h(
											'div',
											{ className: 'hdc-home-page__post-meta' },
											h( 'time', { dateTime: post.date }, post.dateLabel ),
											post.readingTime ? h( 'span', {}, post.readingTime ) : null
										)
									)
								);
							} )
						)
						: postsState.error
							? h( ErrorStateCard, {
								buttonLabel: recentWritingRetryLabel,
								description: recentWritingErrorDescription,
								onButtonClick: handleRetryPosts,
								title: recentWritingErrorTitle,
							} )
						: h( EmptyStateCard, {
							description: recentWritingEmptyDescription,
							title: recentWritingEmptyTitle,
						} )
			),
			h(
				'section',
				{ className: 'hdc-home-page__section', id: 'contact-cta' },
				h(
					'div',
					{ className: 'hdc-home-page__cta-card surface-library-ember-veil' },
					h(
						'div',
						{ className: 'hdc-home-page__cta-layout' },
						h(
							'div',
							{ className: 'hdc-home-page__cta-body' },
							h( 'p', { className: 'hdc-home-page__eyebrow' }, ensureString( config.contactCta.eyebrow, 'Need a technical partner?' ) ),
							h( 'h2', { className: 'hdc-home-page__section-title' }, ensureString( config.contactCta.title, '' ) ),
							h( 'p', { className: 'hdc-home-page__copy' }, ensureString( config.contactCta.description, '' ) )
						),
						h(
							'div',
							{ className: 'hdc-home-page__cta-actions' },
							h(
								'a',
								{
								className: 'hdc-home-page__button focus-ring',
								href: normalizeAppPath( ensureString( config.contactCta.primaryCtaHref, '/contact/' ) ),
							},
								ensureString( config.contactCta.primaryCtaLabel, 'Work with me' )
							),
							h(
								'a',
								{
								className: 'hdc-home-page__button hdc-home-page__button--secondary focus-ring',
								href: normalizeAppPath( ensureString( config.contactCta.secondaryCtaHref, '/resume/' ) ),
							},
								ensureString( config.contactCta.secondaryCtaLabel, 'View resume' )
							)
						)
					)
				)
			)
		);
	}

	function mountHomePage( section ) {
		const rootNode = section.querySelector( '[data-hdc-home-root]' );
		if ( ! rootNode ) {
			return;
		}

		const app = h( HomePageApp, { config: parseConfig( section ) } );
		if ( typeof createRoot === 'function' ) {
			createRoot( rootNode ).render( app );
			return;
		}

		legacyRender( app, rootNode );
	}

	document.querySelectorAll( '.hdc-home-page' ).forEach( mountHomePage );
} )( window.wp );
