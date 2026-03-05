( function ( wp ) {
	if ( ! wp || ! wp.element ) {
		return;
	}

	const createElement = wp.element.createElement;
	const useEffect = wp.element.useEffect;
	const useMemo = wp.element.useMemo;
	const useState = wp.element.useState;
	const createRoot = wp.element.createRoot;
	const render = wp.element.render;
	const utils = window.hdcSharedUtils || {};
	const renderLucideIcon =
		typeof utils.renderLucideIcon === 'function'
			? utils.renderLucideIcon
			: function () {
				return null;
			};
	const REPO_PROXY_PAGE_SIZE = 100;
	const REPO_PROXY_MAX_PAGES = 20;

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

	function ensureString( value, fallback ) {
		if ( typeof value !== 'string' ) {
			return fallback;
		}

		const trimmed = value.trim();
		return trimmed || fallback;
	}

	function normalizePostsEndpoint( endpoint, count ) {
		const perPage = clamp( Number.parseInt( count, 10 ) || 3, 1, 10 );

		if ( ! endpoint ) {
			return '/wp-json/henrys-digital-canvas/v1/blog?limit=' + perPage;
		}

		try {
			const parsed = new URL( endpoint, window.location.origin );
			if ( ! parsed.searchParams.has( 'per_page' ) ) {
				parsed.searchParams.set( 'limit', String( perPage ) );
			}
			return parsed.toString();
		} catch ( error ) {
			const params = new URLSearchParams( {
				limit: String( perPage ),
			} );
			return withQuery( endpoint, params );
		}
	}

	function formatDate( rawDate ) {
		if ( ! rawDate ) {
			return '';
		}
		const date = new Date( rawDate );
		if ( Number.isNaN( date.getTime() ) ) {
			return '';
		}
		return date.toLocaleDateString( undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		} );
	}

	async function fetchPosts( config ) {
		const endpoint = normalizePostsEndpoint( config.postsEndpoint || config.blogEndpoint, config.blogCount );
		const response = await fetch( endpoint, {
			headers: {
				Accept: 'application/json',
			},
		} );

		if ( ! response.ok ) {
			throw new Error( 'Post request failed with status ' + response.status );
		}

		const payload = await response.json();
		const posts = payload && Array.isArray( payload.posts ) ? payload.posts : Array.isArray( payload ) ? payload : null;
		if ( ! posts ) {
			throw new Error( 'Post response format is invalid.' );
		}

		return posts.slice( 0, clamp( config.blogCount, 1, 10 ) ).map( function ( post ) {
			const slug = ensureString( post && post.slug, '' );
			const link = slug ? '/blog/' + encodeURIComponent( slug ) + '/' : ensureString( post && post.url, '#' );
			const title = stripHtml( post && ( post.title?.rendered || post.title ) ) || 'Untitled post';
			const excerpt = stripHtml( post && post.excerpt );

			return {
				id: post.id || link || title,
				title: title,
				excerpt: excerpt,
				link: link,
				dateLabel: formatDate( post.date ),
				readingTime: ensureString( post && post.readingTime, '' ),
			};
		} );
	}

	function resolveRequestUrl( value ) {
		const normalized = ensureString( value, '' );
		if ( ! normalized ) {
			return normalized;
		}

		if ( /^https?:\/\//i.test( normalized ) ) {
			return normalized;
		}

		if ( normalized.charAt( 0 ) === '/' && typeof window !== 'undefined' && window.location && window.location.origin ) {
			return new URL( normalized, window.location.origin ).toString();
		}

		return normalized;
	}

	function getUpdatedAtTimestamp( value ) {
		const timestamp = new Date( value || '' ).getTime();
		return Number.isFinite( timestamp ) ? timestamp : 0;
	}

	function normalizeRepoItem( repo, fallbackRepo ) {
		const sourceRepo = repo && typeof repo === 'object' ? repo : {};
		const localRepo = fallbackRepo && typeof fallbackRepo === 'object' ? fallbackRepo : {};
		const name = ensureString( sourceRepo.name, ensureString( localRepo.name, 'Unnamed repository' ) );
		const updatedAt = ensureString( sourceRepo.updatedAt, ensureString( sourceRepo.pushed_at, ensureString( localRepo.updatedAt, '' ) ) );
		const description = ensureString( localRepo.description, '' ) || ensureString( sourceRepo.description, 'No description provided.' );

		return {
			id: sourceRepo.id || localRepo.id || name,
			name: name,
			description: description,
			language: ensureString( sourceRepo.language, ensureString( localRepo.language, 'Unknown' ) ),
			url: name ? '/work/' + encodeURIComponent( name ) + '/' : '#',
			stars: Number.isFinite( Number( sourceRepo.stars || sourceRepo.stargazers_count ) ) ? Number( sourceRepo.stars || sourceRepo.stargazers_count ) : Number( localRepo.stars ) || 0,
			updatedAt: updatedAt,
			updatedLabel: formatDate( updatedAt ),
			featured: Boolean( localRepo.featured || sourceRepo.featured ),
			access: ensureString( localRepo.access, ensureString( sourceRepo.access, 'public' ) ),
		};
	}

	function mapGitHubRepos( apiRepos, fallbackRepos ) {
		const fallbackByName = new Map();
		( fallbackRepos || [] ).forEach( function ( repo ) {
			fallbackByName.set( repo.name, repo );
		} );

		const merged = ( apiRepos || [] )
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
				const fallbackRepo = fallbackByName.get( repo && repo.name ? repo.name : '' );
				return normalizeRepoItem( repo, fallbackRepo );
			} );

		const mergedNames = new Set(
			merged.map( function ( repo ) {
				return repo.name;
			} )
		);
		const missingFallback = ( fallbackRepos || [] ).filter( function ( repo ) {
			return ! mergedNames.has( repo.name );
		} );

		return merged
			.concat( missingFallback )
			.sort( function ( a, b ) {
				const delta = getUpdatedAtTimestamp( b.updatedAt ) - getUpdatedAtTimestamp( a.updatedAt );
				if ( delta !== 0 ) {
					return delta;
				}
				return String( a.name ).localeCompare( String( b.name ) );
			} );
	}

	async function fetchReposFromContract( config ) {
		const endpoint = ensureString(
			config.workEndpoint,
			'/wp-json/henrys-digital-canvas/v1/work?limit=' + String( clamp( config.repoCount, 1, 10 ) )
		);
		const response = await fetch( endpoint, {
			headers: {
				Accept: 'application/json',
			},
		} );

		if ( ! response.ok ) {
			throw new Error( 'Work contract request failed with status ' + response.status );
		}

		const payload = await response.json();
		const repos = payload && Array.isArray( payload.repos ) ? payload.repos : Array.isArray( payload ) ? payload : null;
		if ( ! repos ) {
			throw new Error( 'Work contract response format is invalid.' );
		}

		return repos.map( function ( repo ) {
			return normalizeRepoItem( repo, null );
		} );
	}

	async function fetchGitHubReposFromProxy( config ) {
		const requestBaseUrl = resolveRequestUrl( ensureString( config.githubProxyUrl, '/api/github/repos' ) );
		const allRepos = [];

		for ( let page = 1; page <= REPO_PROXY_MAX_PAGES; page += 1 ) {
			const requestUrl = new URL( requestBaseUrl );
			requestUrl.searchParams.set( 'username', ensureString( config.githubUsername, 'henryperkins' ) );
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

	function getRepoSourceLabel( source ) {
		if ( source === 'live' ) {
			return 'Public repos pulled live from GitHub (featured items may include curated case studies).';
		}
		if ( source === 'fallback-ratelimit' ) {
			return 'GitHub rate limit reached. Showing cached project snapshot.';
		}
		if ( source === 'fallback-offline' ) {
			return 'You are offline, so live GitHub sync is unavailable. Showing cached project snapshot.';
		}
		if ( source === 'fallback-error' ) {
			return 'Live GitHub sync is unavailable right now. Showing cached project snapshot.';
		}
		return 'Cached project snapshot.';
	}

	async function fetchRepos( config ) {
		const repoCount = clamp( config.repoCount, 1, 10 );
		let fallbackRepos = [];

		try {
			fallbackRepos = await fetchReposFromContract( config );
		} catch ( error ) {
			fallbackRepos = [];
		}

		try {
			const liveApiRepos = await fetchGitHubReposFromProxy( config );
			const mergedRepos = mapGitHubRepos( liveApiRepos, fallbackRepos );
			const featuredRepos = mergedRepos.filter( function ( repo ) {
				return repo.featured;
			} );
			const nonFeaturedRepos = mergedRepos.filter( function ( repo ) {
				return ! repo.featured;
			} );
			const selected = featuredRepos.concat( nonFeaturedRepos ).slice( 0, repoCount );

			return {
				repos: selected,
				source: 'live',
			};
		} catch ( error ) {
			let source = 'fallback-error';
			if ( isRateLimitError( error ) ) {
				source = 'fallback-ratelimit';
			} else if ( isOfflineError( error ) ) {
				source = 'fallback-offline';
			}

			const selectedFallback = fallbackRepos.slice( 0, repoCount );
			return {
				repos: selectedFallback,
				source: source,
			};
		}
	}

	function SectionCards( props ) {
		const items = props.items || [];
		const type = props.type;
		const openInNewTab = !! props.openInNewTab;

		if ( items.length === 0 ) {
			return createElement(
				'p',
				{ className: 'hdc-feed-empty' },
				type === 'posts' ? 'No posts found.' : 'No repositories found.'
			);
		}

		return createElement(
			'div',
			{ className: 'hdc-feed-card-grid' },
			items.map( function ( item ) {
				const meta = type === 'posts'
					? createElement(
						'span',
						{ className: 'hdc-feed-card-meta-row' },
						item.dateLabel ? createElement( 'span', { className: 'hdc-feed-card-meta-item' }, item.dateLabel ) : null,
						item.readingTime
							? createElement(
								'span',
								{ className: 'hdc-feed-card-meta-item' },
								createElement(
									'span',
									{ className: 'hdc-feed-card-meta-icon', 'aria-hidden': 'true' },
									renderLucideIcon( createElement, 'clock', { className: 'hdc-feed-card-meta-icon-svg', size: 12 } )
								),
								createElement( 'span', null, item.readingTime )
							)
							: null
					)
					: createElement(
						'span',
						{ className: 'hdc-feed-card-meta-row' },
						createElement( 'span', { className: 'hdc-feed-card-meta-item' }, item.language ),
						createElement(
							'span',
							{ className: 'hdc-feed-card-meta-item' },
							createElement(
								'span',
								{ className: 'hdc-feed-card-meta-icon', 'aria-hidden': 'true' },
								renderLucideIcon( createElement, 'star', { className: 'hdc-feed-card-meta-icon-svg', size: 12 } )
							),
							createElement( 'span', null, String( item.stars ) )
						),
						item.updatedLabel
							? createElement(
								'span',
								{ className: 'hdc-feed-card-meta-item' },
								createElement(
									'span',
									{ className: 'hdc-feed-card-meta-icon', 'aria-hidden': 'true' },
									renderLucideIcon( createElement, 'clock', { className: 'hdc-feed-card-meta-icon-svg', size: 12 } )
								),
								createElement( 'span', null, item.updatedLabel )
							)
							: null
					);

				return createElement(
					'article',
					{ className: 'hdc-feed-card', key: item.id },
					createElement(
						'a',
						{
							className: 'hdc-feed-card-link',
							href: item.link || item.url,
							target: openInNewTab ? '_blank' : undefined,
							rel: openInNewTab ? 'noopener noreferrer' : undefined,
						},
						type === 'posts' ? item.title : item.name
					),
					createElement( 'p', { className: 'hdc-feed-card-meta' }, meta ),
					createElement(
						'p',
						{ className: 'hdc-feed-card-description' },
						item.excerpt || item.description
					)
				);
			} )
		);
	}

	function FeedApp( props ) {
		const config = props.config;
		const [ state, setState ] = useState( {
			loading: true,
			error: '',
			posts: [],
			repos: [],
			repoSource: 'fallback-error',
		} );

		const configSignature = useMemo( function () {
			return JSON.stringify( config );
		}, [ config ] );

		useEffect( function () {
			document.title = 'Henry Perkins — Customer-Facing Technical Consultant';
		}, [] );

		useEffect( function () {
			let isCancelled = false;

			async function load() {
				setState( function ( current ) {
					return {
						loading: true,
						error: '',
						posts: current.posts,
						repos: current.repos,
						repoSource: current.repoSource,
					};
				} );

				const tasks = [];
				if ( config.showBlog ) {
					tasks.push( fetchPosts( config ) );
				}
				if ( config.showRepos ) {
					tasks.push( fetchRepos( config ) );
				}

				const results = await Promise.allSettled( tasks );
				if ( isCancelled ) {
					return;
				}

				const nextPosts = [];
				const nextRepos = [];
				const errors = [];
				let repoSource = 'fallback-error';
				let taskIndex = 0;

				if ( config.showBlog ) {
					const postResult = results[ taskIndex++ ];
					if ( postResult.status === 'fulfilled' ) {
						nextPosts.push.apply( nextPosts, postResult.value );
					} else {
						errors.push( 'Failed to load posts.' );
					}
				}

				if ( config.showRepos ) {
					const repoResult = results[ taskIndex++ ];
					if ( repoResult.status === 'fulfilled' ) {
						nextRepos.push.apply( nextRepos, repoResult.value.repos || [] );
						repoSource = repoResult.value.source || 'fallback-error';
					} else {
						errors.push( 'Failed to load repositories.' );
						repoSource = 'fallback-error';
					}
				}

				setState( {
					loading: false,
					error: errors.join( ' ' ),
					posts: nextPosts,
					repos: nextRepos,
					repoSource: repoSource,
				} );
			}

			load().catch( function () {
				if ( isCancelled ) {
					return;
				}
				setState( {
					loading: false,
					error: 'Unable to load feed data.',
					posts: [],
					repos: [],
					repoSource: 'fallback-error',
				} );
			} );

			return function () {
				isCancelled = true;
			};
		}, [ configSignature, config ] );

		return createElement(
			'div',
			{ className: 'hdc-feed-shell' },
			createElement( 'h3', { className: 'hdc-feed-heading' }, config.heading ),
			state.loading && createElement( 'p', { className: 'hdc-feed-loading' }, 'Loading feed…' ),
			( ! state.loading && state.error ) && createElement( 'p', { className: 'hdc-feed-error' }, state.error ),
			createElement(
				'div',
				{ className: 'hdc-feed-grid' },
				config.showRepos && createElement(
					'section',
					{ className: 'hdc-feed-section' },
					createElement(
						'div',
						{ className: 'hdc-feed-section-head' },
						createElement( 'h4', { className: 'hdc-feed-section-title' }, 'Featured Work' ),
						createElement(
							'a',
							{ className: 'hdc-feed-section-link', href: '/work/' },
							'View all'
						)
					),
					! state.loading && createElement(
						'p',
						{ className: 'hdc-feed-source' },
						getRepoSourceLabel( state.repoSource )
					),
					createElement( SectionCards, {
						type: 'repos',
						items: state.repos,
						openInNewTab: config.openInNewTab,
					} )
				),
				config.showBlog && createElement(
					'section',
					{ className: 'hdc-feed-section' },
					createElement(
						'div',
						{ className: 'hdc-feed-section-head' },
						createElement( 'h4', { className: 'hdc-feed-section-title' }, 'Recent Writing' ),
						createElement(
							'a',
							{ className: 'hdc-feed-section-link', href: '/blog/' },
							'All posts'
						)
					),
					createElement( SectionCards, {
						type: 'posts',
						items: state.posts,
						openInNewTab: config.openInNewTab,
					} )
				)
			)
		);
	}

	function mountFeed( container ) {
		if ( ! container ) {
			return;
		}

		let config = {};
		const rawConfig = container.getAttribute( 'data-config' ) || '{}';

		try {
			config = JSON.parse( rawConfig );
		} catch ( error ) {
			config = {};
		}

		const rootNode = container.querySelector( '[data-hdc-feed-root]' ) || container;
		const component = createElement( FeedApp, { config: config } );

		if ( typeof createRoot === 'function' ) {
			createRoot( rootNode ).render( component );
			return;
		}

		render( component, rootNode );
	}

	document
		.querySelectorAll( '.wp-block-henrys-digital-canvas-digital-canvas-feed' )
		.forEach( mountFeed );
} )( window.wp );
