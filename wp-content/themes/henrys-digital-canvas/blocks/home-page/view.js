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

	function getUpdatedAtTimestamp( value ) {
		const timestamp = new Date( value || '' ).getTime();
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

	function getHomeRepoTitle( repo, repoTitles ) {
		return ensureString( repoTitles[ repo.name ], '' ) || humanizeRepoName( repo.name );
	}

	function getHomeRepoSummary( repo ) {
		return ensureString( repo.whyItMatters, '' ) || ensureString( repo.description, 'Description coming soon.' );
	}

	function getHomeRepoBadge( repo ) {
		if ( repo.access === 'private' ) {
			return 'Private case study';
		}

		if ( repo.origin === 'github' ) {
			return 'Open source';
		}

		return 'Selected build';
	}

	function getHomeRepoCtaLabel( repo ) {
		if ( repo.origin === 'github' && repo.access !== 'private' ) {
			return 'View build';
		}

		return 'View case study';
	}

	function parseConfig( section ) {
		let parsed = {};
		try {
			parsed = JSON.parse( section.getAttribute( 'data-config' ) || '{}' );
		} catch ( error ) {
			parsed = {};
		}

		return {
			pageTitle: ensureString( parsed.pageTitle, 'Henry Perkins — Technical Portfolio' ),
			hero: ensureObject( parsed.hero ),
			selectedWork: ensureObject( parsed.selectedWork ),
			resumeSnapshot: ensureObject( parsed.resumeSnapshot ),
			recentWriting: ensureObject( parsed.recentWriting ),
			contactCta: ensureObject( parsed.contactCta ),
			repoTitles: ensureObject( parsed.repoTitles ),
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
			description: ensureString( localRepo.description, '' ) || ensureString( sourceRepo.description, 'Description coming soon.' ),
			language: ensureString( sourceRepo.language, ensureString( localRepo.language, 'Unknown' ) ),
			updatedAt: updatedAt,
			featured: !! localRepo.featured || !! sourceRepo.featured,
			access: ensureString( localRepo.access, sourceRepo.private ? 'private' : ensureString( sourceRepo.access, 'public' ) ),
			origin: ensureString(
				sourceRepo.origin,
				ensureString( localRepo.origin, /github\.com/i.test( ensureString( sourceRepo.html_url, '' ) ) ? 'github' : 'curated' )
			),
			whyItMatters: ensureString( localRepo.whyItMatters, ensureString( sourceRepo.whyItMatters, '' ) ),
			url: '/work/' + encodeURIComponent( name ) + '/',
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
		const posts = payload && Array.isArray( payload.posts ) ? payload.posts : Array.isArray( payload ) ? payload : [];

		return posts.slice( 0, config.blogCount ).map( function ( post ) {
			const slug = ensureString( post && post.slug, '' );
			const title = stripHtml( post && ( post.title && post.title.rendered ? post.title.rendered : post.title ) ) || 'Untitled post';
			const thumbnailUrl = ensureString( post && post.featuredImageUrl, '' );

			return {
				id: post.id || slug || title,
				link: slug ? '/blog/' + encodeURIComponent( slug ) + '/' : ensureString( post && post.url, '#' ),
				title: title,
				excerpt: stripHtml( post && post.excerpt ),
				dateLabel: formatDate( post && post.date ),
				readingTime: ensureString( post && post.readingTime, '' ),
				thumbnailUrl: thumbnailUrl,
				thumbnailAlt: ensureString( post && post.featuredImageAlt, title + ' featured image' ),
				thumbnailSrcSet: ensureString( post && post.featuredImageSrcSet, '' ),
			};
		} );
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
		return payload && payload.data ? payload.data : payload;
	}

	function HomePageApp( props ) {
		const config = props.config;
		const [ reposState, setReposState ] = useState( {
			error: '',
			items: [],
			loading: true,
			source: 'fallback-error',
		} );
		const [ postsState, setPostsState ] = useState( {
			error: '',
			items: [],
			loading: true,
		} );
		const [ resumeState, setResumeState ] = useState( {
			data: null,
			loading: true,
		} );

		useEffect(
			function () {
				document.title = config.pageTitle;
			},
			[ config.pageTitle ]
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
							items: [],
							loading: false,
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
							data: null,
							loading: false,
						} );
					} );

				return function () {
					cancelled = true;
				};
			},
			[ config ]
		);

		const featuredRepos = reposState.items.filter( function ( repo ) {
			return repo.featured;
		} ).slice( 0, config.repoCount );
		const visibleRepos = featuredRepos.length > 0 ? featuredRepos : reposState.items.slice( 0, config.repoCount );
		const sourceLabel = reposState.source === 'live'
			? ensureString( config.selectedWork.sourceLiveLabel, 'Selected work blends live GitHub builds with private client case studies.' )
			: ensureString( config.selectedWork.sourceFallbackLabel, 'Selected work blends private client case studies with a cached GitHub snapshot.' );
		const resume = resumeState.data;
		const latestExperience = resume && Array.isArray( resume.experience ) && resume.experience.length > 0 ? resume.experience[0] : null;

		return h(
			'div',
			{},
			h(
				'section',
				{ className: 'hdc-home-page__hero noise' },
				h(
					'div',
					{ className: 'hero-backdrop', 'aria-hidden': 'true' },
					h( 'div', { className: 'hero-backdrop-overlay' } )
				),
				h( 'div', { className: 'hdc-home-page__hero-gradient hero-gradient-layer', 'aria-hidden': 'true' } ),
				h(
					'div',
					{ className: 'hdc-home-page__hero-shell' },
					h(
						'div',
						{ className: 'hdc-home-page__hero-content' },
						h( 'p', { className: 'hdc-home-page__hero-eyebrow' }, ensureString( config.hero.eyebrow, '' ) ),
						h( 'h1', { className: 'hdc-home-page__hero-title' }, ensureString( config.hero.title, 'Henry T. Perkins' ) ),
						h( 'p', { className: 'hdc-home-page__hero-description' }, ensureString( config.hero.description, '' ) ),
						h(
							'div',
							{ className: 'hdc-home-page__hero-actions' },
							h(
								'a',
								{
									className: 'hdc-home-page__button hdc-home-page__button--hero focus-ring',
									href: ensureString( config.hero.primaryCtaHref, '/contact/' ),
								},
								ensureString( config.hero.primaryCtaLabel, 'Work with me' )
							),
							h(
								'a',
								{
									className: 'hdc-home-page__button hdc-home-page__button--secondary hdc-home-page__button--hero-secondary focus-ring',
									href: ensureString( config.hero.secondaryCtaHref, '/work/' ),
								},
								ensureString( config.hero.secondaryCtaLabel, 'View case studies' )
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
							href: ensureString( config.selectedWork.actionHref, '/work/' ),
						},
						ensureString( config.selectedWork.actionLabel, 'View all work' )
					)
				),
				h(
					'p',
					{ className: 'hdc-home-page__source' },
					reposState.loading
						? ensureString( config.selectedWork.loadingLabel, 'Syncing selected work...' )
						: sourceLabel
				),
				reposState.loading
					? h(
						'div',
						{ className: 'hdc-home-page__work-grid' },
						Array.from( { length: config.repoCount } ).map( function ( item, index ) {
							return h(
								'div',
								{
									className: 'hdc-home-page__work-card hdc-home-page__work-card--skeleton ember-surface',
									key: 'work-skeleton-' + String( index ),
								}
							);
						} )
					)
					: visibleRepos.length
						? h(
							'div',
							{ className: 'hdc-home-page__work-grid' },
							visibleRepos.map( function ( repo ) {
								return h(
									'a',
									{
										className: 'hdc-home-page__work-card ember-surface focus-ring',
										href: repo.url,
										key: repo.id || repo.name,
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
												renderLucideIcon( h, repo.origin === 'github' ? 'github' : 'briefcase', {
													className: 'hdc-home-page__work-origin-icon-svg',
													size: 14,
												} )
											),
											h( 'span', {}, repo.language )
										),
										h( 'span', { className: 'hdc-home-page__badge' }, getHomeRepoBadge( repo ) )
									),
									h( 'h3', { className: 'hdc-home-page__card-title' }, getHomeRepoTitle( repo, config.repoTitles ) ),
									h( 'p', { className: 'hdc-home-page__card-copy' }, getHomeRepoSummary( repo ) ),
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
											formatDate( repo.updatedAt )
										),
										h( 'span', { className: 'hdc-home-page__card-cta' }, getHomeRepoCtaLabel( repo ) )
									)
								);
							} )
						)
						: h( 'p', { className: 'hdc-home-page__empty' }, reposState.error || 'Selected work is temporarily unavailable.' )
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
							href: ensureString( config.resumeSnapshot.actionHref, '/resume/' ),
						},
						ensureString( config.resumeSnapshot.actionLabel, 'Interactive resume' )
					)
				),
				h(
					'div',
					{ className: 'hdc-home-page__resume-grid' },
					h(
						'div',
						{ className: 'hdc-home-page__resume-card ember-surface' },
						h( 'p', { className: 'hdc-home-page__eyebrow' }, ensureString( config.resumeSnapshot.positioningEyebrow, 'Positioning' ) ),
						resumeState.loading
							? h( 'p', { className: 'hdc-home-page__copy' }, 'Loading resume data…' )
							: h(
								'div',
								{ className: 'hdc-home-page__resume-stack' },
								resume && resume.headline ? h( 'h3', { className: 'hdc-home-page__card-title' }, resume.headline ) : null,
								resume && resume.subheadline ? h( 'p', { className: 'hdc-home-page__card-copy' }, resume.subheadline ) : null,
								latestExperience
									? h(
										'div',
										{ className: 'hdc-home-page__resume-latest' },
										h( 'p', { className: 'hdc-home-page__resume-latest-title' }, ensureString( latestExperience.title, '' ) ),
										h(
											'p',
											{ className: 'hdc-home-page__resume-latest-meta' },
											ensureString( latestExperience.company, '' ) + ' · ' + ensureString( latestExperience.period, '' )
										)
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
													href: ensureString( normalizedLink.href, '/resume/' ),
													key: ensureString( normalizedLink.href, 'resume-link-' + String( index ) ),
												},
												ensureString( normalizedLink.label, 'Learn more' )
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
						h( 'h3', { className: 'hdc-home-page__card-title' }, ensureString( config.resumeSnapshot.bestFitTitle, 'Where I plug in fastest' ) ),
						h(
							'ul',
							{ className: 'hdc-home-page__list' },
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
							href: ensureString( config.recentWriting.actionHref, '/blog/' ),
						},
						ensureString( config.recentWriting.actionLabel, 'All posts' )
					)
				),
				postsState.loading
					? h( 'p', { className: 'hdc-home-page__copy' }, 'Loading recent writing…' )
					: postsState.items.length
						? h(
							'div',
							{ className: 'hdc-home-page__post-stack' },
							postsState.items.map( function ( post ) {
								return h(
									'a',
									{
										className: 'hdc-home-page__post-card focus-ring',
										href: post.link,
										key: post.id,
									},
									post.thumbnailUrl
										? h(
											'div',
											{ className: 'hdc-home-page__post-thumb-wrap' },
											h( 'img', {
												alt: post.thumbnailAlt,
												className: 'hdc-feed-card-thumb',
												loading: 'lazy',
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
											h( 'span', {}, post.dateLabel ),
											post.readingTime ? h( 'span', {}, post.readingTime ) : null
										)
									)
								);
							} )
						)
						: h( 'p', { className: 'hdc-home-page__empty' }, postsState.error || 'Recent writing is temporarily unavailable.' )
			),
			h(
				'section',
				{ className: 'hdc-home-page__section', id: 'contact-cta' },
				h(
					'div',
					{ className: 'hdc-home-page__cta-card ember-surface ember-surface-strong' },
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
									href: ensureString( config.contactCta.primaryCtaHref, '/contact/' ),
								},
								ensureString( config.contactCta.primaryCtaLabel, 'Work with me' )
							),
							h(
								'a',
								{
									className: 'hdc-home-page__button hdc-home-page__button--secondary focus-ring',
									href: ensureString( config.contactCta.secondaryCtaHref, '/resume/' ),
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
