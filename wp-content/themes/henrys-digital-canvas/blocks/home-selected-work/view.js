( function ( wp ) {
	if ( ! wp || ! wp.element || ! window.hdcSharedUtils ) {
		return;
	}

	const element = wp.element;
	const h = element.createElement;
	const Fragment = element.Fragment;
	const useEffect = element.useEffect;
	const useMemo = element.useMemo;
	const useState = element.useState;
	const createRoot = element.createRoot;
	const legacyRender = element.render;
	const utils = window.hdcSharedUtils;
	const ensureString = utils.ensureString;
	const ensureArray = utils.ensureArray;
	const clamp = utils.clamp;
	const normalizeRepoItem = utils.normalizeRepoItem;
	const compareReposByUpdatedAtDesc = utils.compareReposByUpdatedAtDesc;
	const mapGitHubRepos = utils.mapGitHubRepos;
	const humanizeRepoName = utils.humanizeRepoName;
	const formatDate = utils.formatDate;
	const isRateLimitError = utils.isRateLimitError;
	const isOfflineError = utils.isOfflineError;
	const resolveRequestUrl = utils.resolveRequestUrl;
	const renderLucideIcon =
		utils.renderLucideIcon ||
		function () {
			return null;
		};

	const REPO_PROXY_PAGE_SIZE = 100;
	const REPO_PROXY_MAX_PAGES = 20;

	function parseConfig( section ) {
		let parsed = {};

		try {
			parsed = JSON.parse(
				section.getAttribute( 'data-config' ) || '{}'
			);
		} catch ( error ) {
			parsed = {};
		}

		return {
			title: ensureString( parsed.title, 'Selected Work' ),
			actionLabel: ensureString( parsed.actionLabel, '' ),
			actionHref: ensureString( parsed.actionHref, '' ),
			loadingLabel: ensureString(
				parsed.loadingLabel,
				'Syncing selected work...'
			),
			emptyTitle: ensureString(
				parsed.emptyTitle,
				'Selected work is updating'
			),
			emptyDescriptionLive: ensureString(
				parsed.emptyDescriptionLive,
				''
			),
			emptyDescriptionFallback: ensureString(
				parsed.emptyDescriptionFallback,
				''
			),
			repoCount: clamp(
				Number.parseInt( parsed.repoCount, 10 ) || 3,
				1,
				6
			),
			initialRepos: ensureArray( parsed.initialRepos ),
			githubUsername: ensureString(
				parsed.githubUsername,
				'henryperkins'
			),
			githubProxyUrl: ensureString(
				parsed.githubProxyUrl,
				'/api/github/repos'
			),
			workEndpoint: ensureString(
				parsed.workEndpoint,
				'/wp-json/henrys-digital-canvas/v1/work'
			),
		};
	}

	function getHomeRepoTitle( repo ) {
		return (
			ensureString( repo.displayName, '' ) ||
			humanizeRepoName( repo.name )
		);
	}

	function getHomeRepoSummary( repo ) {
		return (
			ensureString( repo.whyItMatters, '' ) ||
			ensureString( repo.description, 'Description coming soon.' )
		);
	}

	function isGitHubLinkedRepo( repo ) {
		return (
			repo.origin === 'github' ||
			/github\.com\//i.test( ensureString( repo.externalUrl, '' ) )
		);
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

	function selectFeaturedRepos( repos, repoCount ) {
		const featured = ensureArray( repos ).filter( function ( repo ) {
			return repo && repo.featured;
		} );

		const sorted = featured.slice().sort( function ( a, b ) {
			const pa =
				typeof a.featuredPriority === 'number'
					? a.featuredPriority
					: Number.MAX_SAFE_INTEGER;
			const pb =
				typeof b.featuredPriority === 'number'
					? b.featuredPriority
					: Number.MAX_SAFE_INTEGER;
			if ( pa !== pb ) {
				return pa - pb;
			}
			return compareReposByUpdatedAtDesc( a, b );
		} );

		return sorted.slice( 0, repoCount );
	}

	function StateCard( props ) {
		return h(
			'div',
			{ className: 'hdc-home-page__empty-state ember-surface' },
			h(
				'span',
				{
					'aria-hidden': 'true',
					className: 'hdc-home-page__empty-state-icon',
				},
				renderLucideIcon( h, props.iconName, {
					className: props.spinIcon
						? 'hdc-home-page__empty-state-icon-svg hdc-home-page__empty-state-icon-svg--spin'
						: 'hdc-home-page__empty-state-icon-svg',
					size: 20,
				} )
			),
			h( 'h2', { className: 'hdc-home-page__empty-title' }, props.title ),
			props.description
				? h(
						'p',
						{ className: 'hdc-home-page__empty' },
						props.description
				  )
				: null
		);
	}

	function WorkGridLoadingState( props ) {
		return h(
			Fragment,
			{},
			Array.from( { length: props.count } ).map(
				function ( item, index ) {
					return h(
						'div',
						{
							className:
								'hdc-home-page__work-card hdc-home-page__work-card--skeleton ember-surface',
							key: 'work-skeleton-' + String( index ),
						},
						h(
							'div',
							{ className: 'hdc-home-page__work-meta' },
							h( 'span', {
								className:
									'hdc-home-page__skeleton hdc-home-page__skeleton--meta',
							} ),
							h( 'span', {
								className:
									'hdc-home-page__skeleton hdc-home-page__skeleton--badge',
							} )
						),
						h( 'span', {
							className:
								'hdc-home-page__skeleton hdc-home-page__skeleton--title',
						} ),
						h( 'span', {
							className:
								'hdc-home-page__skeleton hdc-home-page__skeleton--line',
						} ),
						h( 'span', {
							className:
								'hdc-home-page__skeleton hdc-home-page__skeleton--line hdc-home-page__skeleton--line-short',
						} ),
						h(
							'div',
							{ className: 'hdc-home-page__card-footer' },
							h( 'span', {
								className:
									'hdc-home-page__skeleton hdc-home-page__skeleton--meta',
							} ),
							h( 'span', {
								className:
									'hdc-home-page__skeleton hdc-home-page__skeleton--meta',
							} )
						)
					);
				}
			)
		);
	}

	function WorkCard( props ) {
		const repo = props.repo;
		const sourceBadge = getHomeRepoSourceBadge( repo, props.source );

		return h(
			'a',
			{
				className:
					'hdc-home-page__work-card ember-surface focus-ring hdc-reveal',
				href: repo.url,
				style: { '--reveal-index': props.revealIndex },
			},
			h(
				'div',
				{ className: 'hdc-home-page__work-meta' },
				h(
					'span',
					{ className: 'hdc-home-page__work-origin' },
					h(
						'span',
						{
							'aria-hidden': 'true',
							className: 'hdc-home-page__work-origin-icon',
						},
						renderLucideIcon(
							h,
							repo.origin === 'github'
								? 'github'
								: 'briefcase-business',
							{
								className:
									'hdc-home-page__work-origin-icon-svg',
								size: 14,
							}
						)
					),
					h( 'span', {}, repo.language )
				),
				h(
					'span',
					{ className: 'hdc-home-page__badge' },
					getHomeRepoBadge( repo )
				),
				sourceBadge
					? h(
							'span',
							{
								className:
									'hdc-home-page__badge hdc-home-page__badge--outline',
							},
							sourceBadge
					  )
					: null
			),
			h(
				'h3',
				{ className: 'hdc-home-page__card-title' },
				getHomeRepoTitle( repo )
			),
			h(
				'p',
				{
					className:
						'hdc-home-page__card-copy hdc-home-page__card-copy--clamp',
				},
				getHomeRepoSummary( repo )
			),
			h(
				'div',
				{ className: 'hdc-home-page__card-footer' },
				h(
					'span',
					{ className: 'hdc-home-page__card-date' },
					h(
						'span',
						{
							'aria-hidden': 'true',
							className: 'hdc-home-page__card-date-icon',
						},
						renderLucideIcon( h, 'clock', {
							className: 'hdc-home-page__card-date-icon-svg',
							size: 12,
						} )
					),
					h(
						'span',
						{ className: 'screen-reader-text' },
						'Updated:'
					),
					formatDate( repo.updatedAt )
				),
				h(
					'span',
					{ className: 'hdc-home-page__card-cta' },
					getHomeRepoCtaLabel( repo ),
					renderActionArrow()
				)
			)
		);
	}

	async function fetchReposFromContract( config ) {
		const response = await fetch(
			resolveRequestUrl( config.workEndpoint ),
			{
				headers: { Accept: 'application/json' },
			}
		);

		if ( ! response.ok ) {
			throw new Error(
				'Work contract request failed with status ' + response.status
			);
		}

		const payload = await response.json();
		let repos = [];

		if ( payload && Array.isArray( payload.repos ) ) {
			repos = payload.repos;
		} else if ( Array.isArray( payload ) ) {
			repos = payload;
		}

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
			requestUrl.searchParams.set(
				'per_page',
				String( REPO_PROXY_PAGE_SIZE )
			);
			requestUrl.searchParams.set( 'page', String( page ) );

			const response = await fetch( requestUrl.toString(), {
				headers: { Accept: 'application/json' },
			} );
			let payload = null;

			try {
				payload = await response.json();
			} catch ( error ) {
				payload = null;
			}

			if ( ! response.ok ) {
				const requestError = new Error(
					( payload && payload.error
						? String( payload.error )
						: 'GitHub request failed' ) +
						' (status ' +
						response.status +
						')'
				);

				requestError.status = response.status;
				requestError.rateLimited =
					response.status === 429 ||
					( response.status === 403 &&
						response.headers.get(
							'x-github-ratelimit-remaining'
						) === '0' );
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
		const fallbackRepos = ensureArray( config.initialRepos )
			.map( function ( repo ) {
				return normalizeRepoItem( repo, repo );
			} )
			.sort( compareReposByUpdatedAtDesc );

		try {
			const liveRepos = await fetchGitHubReposFromProxy( config );

			return {
				items: mapGitHubRepos( liveRepos, fallbackRepos ),
				snapshotItems: fallbackRepos,
				source: 'live',
			};
		} catch ( error ) {
			let source = 'fallback-error';

			if ( isRateLimitError( error ) ) {
				source = 'fallback-ratelimit';
			} else if ( isOfflineError( error ) ) {
				source = 'fallback-offline';
			}

			if ( fallbackRepos.length > 0 ) {
				return {
					items: fallbackRepos,
					snapshotItems: fallbackRepos,
					source,
				};
			}

			const contractRepos = await fetchReposFromContract( config );
			return {
				items: contractRepos,
				snapshotItems: contractRepos,
				source,
			};
		}
	}

	function SelectedWorkApp( props ) {
		const config = props.config;
		const initialRepos = useMemo(
			function () {
				return ensureArray( config.initialRepos ).map(
					function ( repo ) {
						return normalizeRepoItem( repo, repo );
					}
				);
			},
			[ config.initialRepos ]
		);
		const [ reposState, setReposState ] = useState( {
			error: '',
			items: initialRepos,
			loading: initialRepos.length === 0,
			source: 'fallback-error',
		} );

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
							error:
								error instanceof Error
									? error.message
									: 'Selected work is temporarily unavailable.',
							items: [],
							loading: false,
							source: 'fallback-error',
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
				if ( typeof utils.initRevealObserver === 'function' ) {
					utils.initRevealObserver();
				}
			},
			[ reposState.loading, reposState.items ]
		);

		if ( reposState.loading ) {
			return h( WorkGridLoadingState, { count: config.repoCount } );
		}

		const featuredRepos = selectFeaturedRepos(
			reposState.items,
			config.repoCount
		);

		if ( featuredRepos.length ) {
			return h(
				Fragment,
				{},
				featuredRepos.map( function ( repo, repoIndex ) {
					return h( WorkCard, {
						key: repo.id || repo.name,
						repo,
						revealIndex: repoIndex,
						source: reposState.source,
					} );
				} )
			);
		}

		return h( StateCard, {
			description:
				reposState.source === 'live'
					? config.emptyDescriptionLive
					: config.emptyDescriptionFallback,
			iconName: reposState.error ? 'alert-circle' : 'inbox',
			title: config.emptyTitle,
		} );
	}

	function mountSelectedWork( section ) {
		const grid = section.querySelector(
			'[data-hdc-home-selected-work-grid]'
		);

		if ( ! grid ) {
			return;
		}

		const app = h( SelectedWorkApp, { config: parseConfig( section ) } );

		if ( typeof createRoot === 'function' ) {
			createRoot( grid ).render( app );
			return;
		}

		legacyRender( app, grid );
	}

	function init() {
		document
			.querySelectorAll( '[data-hdc-home-selected-work]' )
			.forEach( mountSelectedWork );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )( window.wp );
