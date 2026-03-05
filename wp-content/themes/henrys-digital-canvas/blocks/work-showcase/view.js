( function ( wp ) {
	if ( ! wp || ! wp.element ) {
		return;
	}

	const createElement = wp.element.createElement;
	const Fragment = wp.element.Fragment;
	const useEffect = wp.element.useEffect;
	const useMemo = wp.element.useMemo;
	const useState = wp.element.useState;
	const createRoot = wp.element.createRoot;
	const render = wp.element.render;
	const renderLucideIcon =
		window.hdcSharedUtils && typeof window.hdcSharedUtils.renderLucideIcon === 'function'
			? window.hdcSharedUtils.renderLucideIcon
			: function () {
				return null;
			};

	const PAGE_SIZE = 9;
	const PLACEHOLDER_DESCRIPTION = 'Description coming soon.';
	const PENDING_DESCRIPTION_PREVIEW_COUNT = 8;
	const FEATURED_CASE_STUDY_LIMIT = 6;
	const SIGNAL_ACTIVITY_WINDOW_DAYS = 30;
	const SIGNAL_LANGUAGE_WINDOW_DAYS = 90;
	const DEFAULT_SPARKLINE_WEEKS = 8;
	const MIN_SPARKLINE_WEEKS = 4;
	const MAX_SPARKLINE_WEEKS = 16;
	const ROLE_ORDER = [ 'Systems', 'Product', 'Craft', 'Performance' ];
	const ROLE_DESCRIPTION_MAP = {
		Systems: 'Architecture, integrations, data movement, and operational foundations.',
		Product: 'End-user experience, journey design, and outcomes tied to adoption.',
		Craft: 'Code quality, maintainability, testing discipline, and developer tooling.',
		Performance: 'Latency, throughput, reliability, and production hardening work.',
	};
	const ROLE_ICON_MARKER = {
		Systems: 'layers-3',
		Product: 'rocket',
		Craft: 'activity',
		Performance: 'trending-up',
	};
	const SIGNAL_LABEL_MAP = {
		tested: 'Tested',
		typed: 'Typed',
		ci: 'CI',
		docs: 'Docs',
		observability: 'Observability',
	};
	const UI_TOPICS = new Set( [
		'react',
		'vue',
		'angular',
		'next',
		'nuxt',
		'svelte',
		'frontend',
		'ui',
		'web',
		'website',
		'portfolio',
		'dashboard',
		'app',
	] );

	function h() {
		return createElement.apply( undefined, arguments );
	}

	function classNames() {
		return Array.prototype.slice
			.call( arguments )
			.filter( Boolean )
			.join( ' ' );
	}

	function clamp( value, min, max ) {
		return Math.max( min, Math.min( max, value ) );
	}

	function sanitizeString( value, fallback ) {
		if ( typeof value !== 'string' ) {
			return fallback;
		}

		const trimmed = value.trim();
		return trimmed ? trimmed : fallback;
	}

	function ensureArray( value ) {
		return Array.isArray( value ) ? value : [];
	}

	function ensureStringArray( value ) {
		return ensureArray( value )
			.map( function ( item ) {
				return typeof item === 'string' ? item.trim() : '';
			} )
			.filter( Boolean );
	}

	function parseRepoDate( dateString ) {
		if ( ! dateString ) {
			return new Date( 0 );
		}

		let normalized = String( dateString );
		if ( /^\d{4}-\d{2}-\d{2}$/.test( normalized ) ) {
			normalized = normalized + 'T12:00:00';
		}

		const parsed = new Date( normalized );
		if ( Number.isNaN( parsed.getTime() ) ) {
			return new Date( 0 );
		}

		return parsed;
	}

	function formatDateLabel( dateString ) {
		return parseRepoDate( dateString ).toLocaleDateString( undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		} );
	}

	function formatMonthLabel( dateString ) {
		return parseRepoDate( dateString ).toLocaleDateString( undefined, {
			year: 'numeric',
			month: 'long',
		} );
	}

	function getWorkDetailUrl( repoName ) {
		return '/work/' + encodeURIComponent( sanitizeString( repoName, '' ) ) + '/';
	}

	function getUpdatedAtTimestamp( dateIso ) {
		const timestamp = new Date( dateIso || '' ).getTime();
		return Number.isNaN( timestamp ) ? 0 : timestamp;
	}

	function withUpdatedAtTimestamp( repo ) {
		if ( typeof repo._updatedAtMs === 'number' && Number.isFinite( repo._updatedAtMs ) ) {
			return repo;
		}

		return Object.assign( {}, repo, {
			_updatedAtMs: getUpdatedAtTimestamp( repo.updatedAt ),
		} );
	}

	function normalizeRepo( repo ) {
		const normalizedTopics = ensureStringArray( repo.topics );
		const normalizedSignals = ensureStringArray( repo.signals );

		return withUpdatedAtTimestamp( {
			name: sanitizeString( repo.name, 'unknown-repository' ),
			description: sanitizeString( repo.description, PLACEHOLDER_DESCRIPTION ),
			language: sanitizeString( repo.language, 'Unknown' ),
			stars: Number.isFinite( Number( repo.stars ) ) ? Number( repo.stars ) : 0,
			forks: Number.isFinite( Number( repo.forks ) ) ? Number( repo.forks ) : 0,
			updatedAt: sanitizeString( repo.updatedAt, '1970-01-01' ),
			_updatedAtMs:
				typeof repo._updatedAtMs === 'number' && Number.isFinite( repo._updatedAtMs )
					? repo._updatedAtMs
					: getUpdatedAtTimestamp( repo.updatedAt ),
			url: sanitizeString( repo.url, '' ),
			defaultBranch: sanitizeString( repo.defaultBranch, '' ),
			topics: normalizedTopics,
			featured: !! repo.featured,
			demoUrl: sanitizeString( repo.demoUrl, '' ),
			learned: sanitizeString( repo.learned, '' ),
			origin: repo.origin === 'github' ? 'github' : 'curated',
			access: repo.access === 'private' ? 'private' : 'public',
			accessNote: sanitizeString( repo.accessNote, '' ),
			role: ROLE_ORDER.indexOf( repo.role ) !== -1 ? repo.role : undefined,
			whyItMatters: sanitizeString( repo.whyItMatters, '' ),
			problem: ensureStringArray( repo.problem ),
			approach: ensureStringArray( repo.approach ),
			result: ensureStringArray( repo.result ),
			highlights: ensureStringArray( repo.highlights ),
			keyFiles: ensureArray( repo.keyFiles )
				.filter( function ( item ) {
					return item && typeof item === 'object';
				} )
				.map( function ( item ) {
					return {
						path: sanitizeString( item.path, '' ),
						note: sanitizeString( item.note, '' ),
						url: sanitizeString( item.url, '' ),
					};
				} )
				.filter( function ( item ) {
					return item.path || item.note;
				} ),
			shipped: sanitizeString( repo.shipped, '' ),
			signals: normalizedSignals,
			receipts: ensureArray( repo.receipts )
				.filter( function ( item ) {
					return item && typeof item === 'object';
				} )
				.map( function ( item ) {
					return {
						label: sanitizeString( item.label, '' ),
						value: sanitizeString( item.value, '' ),
						url: sanitizeString( item.url, '' ),
					};
				} )
				.filter( function ( item ) {
					return item.label || item.value;
				} ),
			architecture:
				repo.architecture && typeof repo.architecture === 'object'
					? {
						summary: sanitizeString( repo.architecture.summary, '' ),
						bullets: ensureStringArray( repo.architecture.bullets ),
						diagramUrl: sanitizeString( repo.architecture.diagramUrl, '' ),
					}
					: undefined,
		} );
	}

	function hasCuratedDescription( description ) {
		return sanitizeString( description, '' ).toLowerCase() !== PLACEHOLDER_DESCRIPTION.toLowerCase();
	}

	function inferRole( language, topics ) {
		switch ( language ) {
			case 'Python':
				return 'Systems';
			case 'TypeScript':
				return topics.some( function ( topic ) {
					return UI_TOPICS.has( String( topic ).toLowerCase() );
				} )
					? 'Product'
					: 'Craft';
			case 'JavaScript':
				return 'Product';
			case 'PHP':
				return 'Product';
			case 'Markdown':
				return 'Craft';
			default:
				return 'Craft';
		}
	}

	function getRepoUpdatedTimestamp( repo ) {
		if ( typeof repo._updatedAtMs === 'number' && Number.isFinite( repo._updatedAtMs ) ) {
			return repo._updatedAtMs;
		}

		return getUpdatedAtTimestamp( repo.updatedAt );
	}

	function isUpdatedWithin( repo, days, referenceNow ) {
		const updatedAt = getRepoUpdatedTimestamp( repo );
		const windowMs = days * 24 * 60 * 60 * 1000;
		return updatedAt >= referenceNow - windowMs;
	}

	function compareReposByUpdatedAtDesc( a, b ) {
		const delta = getRepoUpdatedTimestamp( b ) - getRepoUpdatedTimestamp( a );
		if ( delta !== 0 ) {
			return delta;
		}

		return String( a.name ).localeCompare( String( b.name ) );
	}

	function getSignalBadges( repo ) {
		if ( repo.signals && repo.signals.length > 0 ) {
			return repo.signals;
		}

		const inferred = [];

		if ( repo.language === 'TypeScript' ) {
			inferred.push( 'typed' );
		}

		const hasDocsTopic = repo.topics.some( function ( topic ) {
			const normalized = String( topic ).toLowerCase();
			return [ 'documentation', 'docs', 'runbook', 'operations' ].indexOf( normalized ) !== -1;
		} );
		if ( hasDocsTopic ) {
			inferred.push( 'docs' );
		}

		if ( repo.origin === 'github' ) {
			inferred.push( 'ci' );
		}

		return Array.from( new Set( inferred ) );
	}

	function parseConfig( container ) {
		const rawConfig = container.getAttribute( 'data-config' ) || '{}';
		let parsed = {};

		try {
			parsed = JSON.parse( rawConfig );
		} catch ( error ) {
			parsed = {};
		}

		return {
			heading: sanitizeString( parsed.heading, 'Work' ),
			description: sanitizeString(
				parsed.description,
				'A mix of public GitHub repositories and private case studies with compare and filter controls.'
			),
			githubUsername: sanitizeString( parsed.githubUsername, 'henryperkins' ),
			repoCount: clamp( Number.parseInt( parsed.repoCount, 10 ) || 100, 1, 100 ),
			compareLimit: clamp( Number.parseInt( parsed.compareLimit, 10 ) || 2, 2, 6 ),
			includeForks: !! parsed.includeForks,
			includeArchived: !! parsed.includeArchived,
			openInNewTab: !! parsed.openInNewTab,
			showSignalsPanel: parsed.showSignalsPanel !== false,
			showActivitySparkline: parsed.showActivitySparkline !== false,
			sparklineWeeks: clamp(
				Number.parseInt( parsed.sparklineWeeks, 10 ) || DEFAULT_SPARKLINE_WEEKS,
				MIN_SPARKLINE_WEEKS,
				MAX_SPARKLINE_WEEKS
			),
			localReposUrl: sanitizeString( parsed.localReposUrl, '' ),
			repoCaseStudyDetailsUrl: sanitizeString( parsed.repoCaseStudyDetailsUrl, '' ),
		};
	}

	async function fetchJson( url ) {
		if ( ! url ) {
			throw new Error( 'Missing JSON URL' );
		}

		const response = await fetch( url, {
			headers: {
				Accept: 'application/json',
			},
		} );

		if ( ! response.ok ) {
			throw new Error( 'JSON request failed with status ' + response.status );
		}

		return response.json();
	}

	async function loadLocalRepos( config ) {
		if ( ! config.localReposUrl ) {
			return [];
		}

		const payload = await fetchJson( config.localReposUrl );
		if ( ! Array.isArray( payload ) ) {
			return [];
		}

		return payload.map( function ( repo ) {
			return normalizeRepo( repo );
		} );
	}

	async function loadRepoCaseStudyDetails( config ) {
		if ( ! config.repoCaseStudyDetailsUrl ) {
			return null;
		}

		const payload = await fetchJson( config.repoCaseStudyDetailsUrl );
		if ( ! payload || typeof payload !== 'object' || Array.isArray( payload ) ) {
			return null;
		}

		return payload;
	}

	function isRateLimitError( error ) {
		return !! ( error && error.rateLimited );
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

	function mergeRepoDetails( repo, detailsMap ) {
		const details = detailsMap && detailsMap[ repo.name ];
		if ( ! details || typeof details !== 'object' ) {
			return repo;
		}

		return normalizeRepo( Object.assign( {}, repo, details ) );
	}

	function mapGitHubRepos( apiRepos, localRepos, config ) {
		const localRepoMap = new Map();
		localRepos.forEach( function ( repo ) {
			localRepoMap.set( repo.name, repo );
		} );

		const sourceRepos = apiRepos.filter( function ( repo ) {
			if ( ! config.includeForks && repo.fork ) {
				return false;
			}
			if ( ! config.includeArchived && repo.archived ) {
				return false;
			}

			const localRepo = localRepoMap.get( repo.name );
			return Boolean( repo.language || ( localRepo && localRepo.language ) );
		} );

		const mergedRepos = sourceRepos.map( function ( repo ) {
			const localRepo = localRepoMap.get( repo.name );
			const updatedAt = repo.pushed_at
				? String( repo.pushed_at ).slice( 0, 10 )
				: localRepo
					? localRepo.updatedAt
					: '1970-01-01';
			const language = sanitizeString( repo.language, localRepo ? localRepo.language : 'Unknown' );
			const topics =
				Array.isArray( repo.topics ) && repo.topics.length > 0
					? repo.topics
					: localRepo
						? localRepo.topics
						: [];
			const localDescription = localRepo ? localRepo.description : '';
			const description = hasCuratedDescription( localDescription )
				? localDescription
				: sanitizeString( repo.description, PLACEHOLDER_DESCRIPTION );

			return normalizeRepo(
				Object.assign( {}, localRepo || {}, {
					name: sanitizeString( repo.name, localRepo ? localRepo.name : 'unknown-repository' ),
					description: description,
					language: language,
					stars: Number.isFinite( repo.stargazers_count ) ? repo.stargazers_count : 0,
					forks: Number.isFinite( repo.forks_count ) ? repo.forks_count : 0,
					updatedAt: updatedAt,
					_updatedAtMs: getUpdatedAtTimestamp( repo.pushed_at || updatedAt ),
					url: sanitizeString( repo.html_url, localRepo ? localRepo.url : '' ),
					defaultBranch: sanitizeString( repo.default_branch, localRepo ? localRepo.defaultBranch : '' ),
					topics: topics,
					featured: localRepo ? !! localRepo.featured : false,
					demoUrl: localRepo ? localRepo.demoUrl : '',
					learned: localRepo ? localRepo.learned : '',
					origin: 'github',
					access: localRepo && localRepo.access ? localRepo.access : 'public',
					accessNote: localRepo ? localRepo.accessNote : '',
					role: localRepo && localRepo.role ? localRepo.role : inferRole( language, topics ),
					whyItMatters: localRepo && localRepo.whyItMatters ? localRepo.whyItMatters : description,
					shipped:
						localRepo && localRepo.shipped
							? localRepo.shipped
							: 'Last updated ' + updatedAt,
				} )
			);
		} );

		if ( mergedRepos.length === 0 ) {
			return localRepos.slice().sort( compareReposByUpdatedAtDesc ).slice( 0, config.repoCount );
		}

		const mergedNames = new Set(
			mergedRepos.map( function ( repo ) {
				return repo.name;
			} )
		);

		const missingLocalRepos = localRepos.filter( function ( repo ) {
			return ! mergedNames.has( repo.name );
		} );

		return mergedRepos
			.concat( missingLocalRepos )
			.sort( compareReposByUpdatedAtDesc )
			.slice( 0, config.repoCount );
	}

	async function fetchGitHubRepos( config, localRepos ) {
		const params = new URLSearchParams( {
			sort: 'updated',
			per_page: String( config.repoCount ),
		} );

		const endpoint =
			'https://api.github.com/users/' +
			encodeURIComponent( config.githubUsername ) +
			'/repos?' +
			params.toString();

		const response = await fetch( endpoint, {
			headers: {
				Accept: 'application/vnd.github+json',
			},
		} );

		if ( ! response.ok ) {
			let payload = null;
			try {
				payload = await response.json();
			} catch ( error ) {
				payload = null;
			}

			const message = payload && payload.message ? String( payload.message ) : '';
			const rateRemaining = response.headers.get( 'x-ratelimit-remaining' );
			const rateLimited =
				( response.status === 403 && rateRemaining === '0' ) || /rate limit/i.test( message );

			const requestError = new Error(
				'GitHub request failed with status ' + response.status + ( message ? ': ' + message : '' )
			);
			requestError.status = response.status;
			requestError.rateLimited = rateLimited;
			throw requestError;
		}

		const payload = await response.json();
		if ( ! Array.isArray( payload ) ) {
			throw new Error( 'GitHub response format is invalid.' );
		}

		return mapGitHubRepos( payload, localRepos, config );
	}

	async function loadWorkData( config ) {
		const localReposPromise = loadLocalRepos( config );
		const detailsPromise = loadRepoCaseStudyDetails( config );

		const localReposResult = await Promise.resolve( localReposPromise ).then(
			function ( value ) {
				return { ok: true, value: value };
			},
			function () {
				return { ok: false, value: [] };
			}
		);
		const detailsResult = await Promise.resolve( detailsPromise ).then(
			function ( value ) {
				return { ok: true, value: value };
			},
			function () {
				return { ok: false, value: null };
			}
		);

		const localRepos = localReposResult.ok ? localReposResult.value : [];
		const detailsMap = detailsResult.ok ? detailsResult.value : null;

		let repos = localRepos.slice();
		let source = 'fallback-error';

		try {
			repos = await fetchGitHubRepos( config, localRepos );
			source = 'live';
		} catch ( error ) {
			if ( isRateLimitError( error ) ) {
				source = 'fallback-ratelimit';
			} else if ( isOfflineError( error ) ) {
				source = 'fallback-offline';
			} else {
				source = 'fallback-error';
			}
		}

		if ( repos.length === 0 && localRepos.length > 0 ) {
			repos = localRepos.slice();
		}

		if ( detailsMap ) {
			repos = repos.map( function ( repo ) {
				return mergeRepoDetails( repo, detailsMap );
			} );
		}

		repos = repos.map( function ( repo ) {
			return withUpdatedAtTimestamp( normalizeRepo( repo ) );
		} );

		return {
			repos: repos,
			source: source,
			detailsUnavailable: !! config.repoCaseStudyDetailsUrl && ! detailsResult.ok,
		};
	}

	function Badge( props ) {
		return h(
			'span',
			{
				className: classNames( 'hdc-work-badge', props.variant ? 'is-' + props.variant : 'is-secondary' ),
			},
			props.children
		);
	}

	function SectionIntro( props ) {
		return h(
			'div',
			{ className: 'hdc-work-section-intro' },
			h( 'h3', { className: 'hdc-work-section-title' }, props.title ),
			props.description
				? h( 'p', { className: 'hdc-work-section-description' }, props.description )
				: null
		);
	}

	function StatCard( props ) {
		return h(
			'article',
			{ className: 'hdc-work-stat-card' },
			h( 'p', { className: 'hdc-work-stat-label' }, props.label ),
			h( 'p', { className: 'hdc-work-stat-value' }, props.value ),
			props.children
		);
	}

	function EmptyState( props ) {
		return h(
			'section',
			{ className: 'hdc-work-empty-state' },
			h( 'h3', { className: 'hdc-work-empty-title' }, props.title ),
			h( 'p', { className: 'hdc-work-empty-description' }, props.description ),
			props.action || null
		);
	}

	function FiltersBar( props ) {
		return h(
			'section',
			{ className: 'hdc-work-filters' },
			h(
				'div',
				{ className: 'hdc-work-filter-row' },
				h(
					'label',
					{ className: 'hdc-work-control' },
					h( 'span', { className: 'hdc-work-control-label' }, 'Language' ),
					h(
						'select',
						{
							className: 'hdc-work-select',
							value: props.value,
							onChange: function ( event ) {
								props.onFilterChange( event.target.value );
							},
						},
						props.languages.map( function ( option ) {
							return h( 'option', { key: option, value: option }, option );
						} )
					)
				),
				h(
					'div',
					{ className: 'hdc-work-control' },
					h( 'span', { className: 'hdc-work-control-label' }, 'View' ),
					h(
						'div',
						{ className: 'hdc-work-view-toggle' },
						h(
							'button',
							{
								type: 'button',
								className: classNames( 'hdc-work-view-button', props.view === 'grid' && 'is-active' ),
								onClick: function () {
									props.onViewChange( 'grid' );
								},
							},
							'Grid'
						),
						h(
							'button',
							{
								type: 'button',
								className: classNames( 'hdc-work-view-button', props.view === 'timeline' && 'is-active' ),
								onClick: function () {
									props.onViewChange( 'timeline' );
								},
							},
							'Timeline'
						)
					)
				),
				props.view === 'grid'
					? h(
						'label',
						{ className: 'hdc-work-control' },
						h( 'span', { className: 'hdc-work-control-label' }, 'Sort' ),
						h(
							'select',
							{
								className: 'hdc-work-select',
								value: props.sort,
								onChange: function ( event ) {
									props.onSortChange( event.target.value );
								},
							},
							h( 'option', { value: 'stars' }, 'Sort by Stars' ),
							h( 'option', { value: 'updated' }, 'Sort by Updated' )
						)
					)
					: h(
						'div',
						{ className: 'hdc-work-control' },
						h( 'span', { className: 'hdc-work-control-label' }, 'Sort' ),
						h( 'p', { className: 'hdc-work-control-note' }, 'Timeline is always newest-first.' )
					),
				props.view === 'grid'
					? h(
						'div',
						{ className: 'hdc-work-control' },
						h( 'span', { className: 'hdc-work-control-label' }, 'Compare' ),
						h(
							'button',
							{
								type: 'button',
								className: 'hdc-work-button',
								onClick: props.onOpenCompare,
								disabled: props.compareSelectionVisibleCount === 0,
							},
							'Compare (',
							String( props.compareSelectionVisibleCount ),
							')'
						)
					)
					: h(
						'div',
						{ className: 'hdc-work-control' },
						h( 'span', { className: 'hdc-work-control-label' }, 'Compare' ),
						h(
							'p',
							{ className: 'hdc-work-control-note' },
							'Comparison selection is available in Grid view.'
						)
					)
			),
			props.showDetailsUnavailableMessage
				? h(
					'p',
					{ className: 'hdc-work-hint' },
					'Case-study details are temporarily unavailable. Showing standard repository data.'
				)
				: null
		);
	}

	function SignalsPanel( props ) {
		const totalActivity = props.activityBuckets.reduce( function ( sum, bucket ) {
			return sum + bucket.count;
		}, 0 );

		return h(
			'section',
			{ className: 'hdc-work-signals' },
			h( SectionIntro, {
				title: 'Engineering Signals',
				description:
					'A compact view of recent update activity, language focus, and delivery cadence.',
			} ),
			h(
				'div',
				{ className: 'hdc-work-stats-grid' },
				h(
					StatCard,
					{ label: 'Recently updated (30 days)', value: String( props.recentlyUpdatedCount ) },
					props.recentRepoPreview.length > 0
						? h(
							'p',
							{ className: 'hdc-work-stat-meta' },
							props.recentRepoPreview
								.map( function ( repo ) {
									return repo.name;
								} )
								.join( ' • ' )
						)
						: h( 'p', { className: 'hdc-work-stat-meta' }, 'No repositories updated in this window.' )
				),
				h(
					StatCard,
					{ label: 'Most active language (90 days)', value: props.activeLanguageLabel },
					props.activeLanguages.length > 0
						? h(
							'div',
							{ className: 'hdc-work-badge-row' },
							props.activeLanguages.map( function ( item ) {
								return h(
									Badge,
									{
										key: 'language-' + item[ 0 ],
										variant: 'secondary',
									},
									item[ 0 ] + ' · ' + item[ 1 ]
								);
							} )
						)
						: h( 'p', { className: 'hdc-work-stat-meta' }, 'No recent language data.' )
				),
				h(
					StatCard,
					{ label: 'Weekly activity trend', value: String( totalActivity ) + ' updates' },
					props.showActivitySparkline
						? h(
							Fragment,
							null,
							h(
								'div',
								{
									className: 'hdc-work-sparkline',
									role: 'img',
									'aria-label':
										'Recent repository activity sparkline over ' +
										String( props.sparklineWeeks ) +
										' weeks',
								},
								props.activityBuckets.map( function ( bucket ) {
									return h( 'span', {
										key: 'bucket-' + bucket.label,
										className: 'hdc-work-sparkline-bar',
										title: bucket.label + ': ' + bucket.count + ' updates',
										style: { height: bucket.height + 'px' },
									} );
								} )
							),
							h(
								'p',
								{ className: 'hdc-work-stat-meta' },
								String( props.sparklineWeeks ) +
									'-week sparkline based on repository update dates.'
							)
						)
						: h(
							'p',
							{ className: 'hdc-work-stat-meta' },
							'Sparkline graph is hidden for this block instance.'
						)
				)
			)
		);
	}

	function FeaturedCaseStudies( props ) {
		if ( props.repos.length === 0 ) {
			return null;
		}

		return h(
			'section',
			{ className: 'hdc-work-section' },
			h( SectionIntro, {
				title: 'Featured Case Studies',
				description:
					'Curated, outcome-focused write-ups: challenge, technical approach, and shipped results.',
			} ),
			h(
				'div',
				{ className: 'hdc-work-featured-grid' },
				props.repos.map( function ( repo ) {
					return h(
						'article',
						{ key: 'featured-' + repo.name, className: 'hdc-work-featured-card' },
						h(
							'div',
							{ className: 'hdc-work-featured-top' },
							h(
								'div',
								{ className: 'hdc-work-badge-row' },
								repo.role ? h( Badge, { variant: 'default' }, repo.role ) : null,
								repo.access === 'private' ? h( Badge, { variant: 'secondary' }, 'Private' ) : null
							),
							h(
								'time',
								{ className: 'hdc-work-meta-time', dateTime: repo.updatedAt },
								formatDateLabel( repo.updatedAt )
							)
						),
						h( 'h4', { className: 'hdc-work-featured-title' }, repo.name ),
						h(
							'p',
							{ className: 'hdc-work-featured-summary' },
							repo.whyItMatters || repo.description
						),
						h(
							'div',
							{ className: 'hdc-work-triptych' },
							h(
								'div',
								{ className: 'hdc-work-triptych-col' },
								h( 'p', { className: 'hdc-work-label' }, 'The Challenge' ),
								h(
									'ul',
									{ className: 'hdc-work-bullet-list' },
									( repo.problem || [] ).slice( 0, 2 ).map( function ( item, index ) {
										return h( 'li', { key: repo.name + '-problem-' + index }, item );
									} )
								)
							),
							h(
								'div',
								{ className: 'hdc-work-triptych-col' },
								h( 'p', { className: 'hdc-work-label' }, 'Technical Approach' ),
								h(
									'ul',
									{ className: 'hdc-work-bullet-list' },
									( repo.approach || [] ).slice( 0, 2 ).map( function ( item, index ) {
										return h( 'li', { key: repo.name + '-approach-' + index }, item );
									} )
								)
							),
							h(
								'div',
								{ className: 'hdc-work-triptych-col' },
								h( 'p', { className: 'hdc-work-label' }, 'Shipped Results' ),
								h(
									'ul',
									{ className: 'hdc-work-bullet-list' },
									( repo.result || [] ).slice( 0, 2 ).map( function ( item, index ) {
										return h( 'li', { key: repo.name + '-result-' + index }, item );
									} )
								)
							)
						),
						repo.highlights && repo.highlights.length
							? h(
								'div',
								{ className: 'hdc-work-badge-row' },
								repo.highlights.slice( 0, 3 ).map( function ( highlight, index ) {
									return h( Badge, { key: repo.name + '-highlight-' + index, variant: 'outline' }, highlight );
								} )
							)
							: null,
						repo.architecture && ( repo.architecture.summary || repo.architecture.bullets.length )
							? h(
								'div',
								{ className: 'hdc-work-architecture-box' },
								h( 'p', { className: 'hdc-work-label' }, 'Architecture Snapshot' ),
								repo.architecture.summary
									? h( 'p', { className: 'hdc-work-architecture-summary' }, repo.architecture.summary )
									: null,
								repo.architecture.bullets.length
									? h(
										'ul',
										{ className: 'hdc-work-bullet-list' },
										repo.architecture.bullets.slice( 0, 3 ).map( function ( bullet, index ) {
											return h( 'li', { key: repo.name + '-architecture-' + index }, bullet );
										} )
									)
									: null
							)
							: null,
						h(
							'a',
							{
								className: 'hdc-work-link-button',
								href: getWorkDetailUrl( repo.name ),
							},
							'View Case Study'
						)
					);
				} )
			)
		);
	}

	function RoleGroups( props ) {
		if ( props.groups.length === 0 ) {
			return null;
		}

		return h(
			'section',
			{ className: 'hdc-work-section' },
			h( SectionIntro, {
				title: 'Projects by Focus Area',
				description:
					'Projects grouped by systems, product delivery, craft, and performance outcomes.',
			} ),
			h(
				'div',
				{ className: 'hdc-work-role-grid' },
				props.groups.map( function ( group ) {
					return h(
						'article',
						{ key: 'role-' + group.role, className: 'hdc-work-role-card' },
						h(
							'div',
							{ className: 'hdc-work-role-header' },
							h(
								'span',
								{ className: 'hdc-work-role-icon', 'aria-hidden': 'true' },
								renderLucideIcon( h, ROLE_ICON_MARKER[ group.role ], { className: 'hdc-work-role-icon-svg', size: 16 } ) || '•'
							),
							h(
								'div',
								null,
								h( 'h4', { className: 'hdc-work-role-title' }, group.role ),
								h( 'p', { className: 'hdc-work-role-description' }, ROLE_DESCRIPTION_MAP[ group.role ] )
							)
						),
						h(
							'ul',
							{ className: 'hdc-work-list' },
							group.repos.slice( 0, 3 ).map( function ( repo ) {
								return h(
									'li',
									{ key: group.role + '-' + repo.name, className: 'hdc-work-list-item' },
									h(
										'div',
										{ className: 'hdc-work-list-item-main' },
										h(
											'a',
											{
												className: 'hdc-work-list-item-title hdc-work-inline-link',
												href: getWorkDetailUrl( repo.name ),
											},
											repo.name
										),
										h(
											'p',
											{ className: 'hdc-work-list-item-text' },
											repo.whyItMatters || repo.description
										)
									),
									h(
										'time',
										{ className: 'hdc-work-list-item-time', dateTime: repo.updatedAt },
										formatDateLabel( repo.updatedAt )
									)
								);
							} )
						)
					);
				} )
			)
		);
	}

	function BuildTimeline( props ) {
		if ( props.repos.length === 0 ) {
			return null;
		}

		return h(
			'section',
			{ className: 'hdc-work-section' },
			h( SectionIntro, {
				title: 'Build Timeline',
				description: 'Recent delivery notes from curated project metadata.',
			} ),
			h(
				'ul',
				{ className: 'hdc-work-timeline' },
				props.repos.map( function ( repo ) {
					return h(
						'li',
						{ key: 'build-' + repo.name + '-' + repo.updatedAt, className: 'hdc-work-timeline-item' },
						h(
							'div',
							{ className: 'hdc-work-timeline-head' },
							h(
								'a',
								{
									className: 'hdc-work-timeline-title hdc-work-inline-link',
									href: getWorkDetailUrl( repo.name ),
								},
								repo.name
							),
							h(
								'div',
								{ className: 'hdc-work-timeline-meta' },
								repo.role ? h( Badge, { variant: 'secondary' }, repo.role ) : null,
								h(
									'time',
									{ className: 'hdc-work-meta-time', dateTime: repo.updatedAt },
									formatDateLabel( repo.updatedAt )
								)
							)
						),
						h( 'p', { className: 'hdc-work-timeline-body' }, repo.shipped || repo.description )
					);
				} )
			)
		);
	}

	function RepoCard( props ) {
		const repo = props.repo;
		const signalBadges = getSignalBadges( repo );

		return h(
			'article',
			{ className: 'hdc-work-repo-card' },
			h(
				'div',
				{ className: 'hdc-work-repo-top' },
				h(
					'div',
					{ className: 'hdc-work-badge-row' },
					h( Badge, { variant: 'outline' }, repo.origin === 'github' ? 'GitHub' : 'Case Study' ),
					h( Badge, { variant: 'secondary' }, repo.language )
				),
				h(
					'div',
					{ className: 'hdc-work-badge-row' },
					repo.featured ? h( Badge, { variant: 'default' }, 'Featured' ) : null,
					repo.access === 'private' ? h( Badge, { variant: 'secondary' }, 'Private' ) : null
				)
			),
			h(
				'div',
				{ className: 'hdc-work-repo-title-row' },
				h(
					'h4',
					{ className: 'hdc-work-repo-title' },
					h(
						'a',
						{
							className: 'hdc-work-inline-link',
							href: getWorkDetailUrl( repo.name ),
						},
						repo.name
					)
				),
				h(
					'label',
					{ className: 'hdc-work-compare-check' },
					h( 'input', {
						type: 'checkbox',
						checked: props.compareSelected,
						onChange: function () {
							props.onToggleCompare( repo.name );
						},
						'aria-label': props.compareSelected
							? 'Remove ' + repo.name + ' from comparison'
							: 'Add ' + repo.name + ' to comparison',
					} )
				)
			),
			h( 'p', { className: 'hdc-work-repo-description' }, repo.description ),
			h(
				'a',
				{
					className: 'hdc-work-link-button',
					href: getWorkDetailUrl( repo.name ),
				},
				'View case study'
			),
			repo.topics.length > 0
				? h(
					'div',
					{ className: 'hdc-work-badge-row' },
					repo.topics.slice( 0, 4 ).map( function ( topic ) {
						return h( Badge, { key: repo.name + '-topic-' + topic, variant: 'secondary' }, topic );
					} )
				)
				: null,
			signalBadges.length > 0
				? h(
					'div',
					{ className: 'hdc-work-badge-row' },
					signalBadges.slice( 0, 3 ).map( function ( signal ) {
						return h(
							Badge,
							{ key: repo.name + '-signal-' + signal, variant: 'outline' },
							SIGNAL_LABEL_MAP[ signal ] || signal
						);
					} )
				)
				: null,
				h(
					'div',
					{ className: 'hdc-work-repo-meta' },
					h(
						'span',
						{ className: 'hdc-work-repo-meta-item' },
						h(
							'span',
							{ className: 'hdc-work-repo-meta-icon', 'aria-hidden': 'true' },
							renderLucideIcon( h, 'star', { className: 'hdc-work-repo-meta-icon-svg', size: 12 } )
						),
						h( 'span', null, String( repo.stars ) )
					),
					h(
						'span',
						{ className: 'hdc-work-repo-meta-item' },
						h(
							'span',
							{ className: 'hdc-work-repo-meta-icon', 'aria-hidden': 'true' },
							renderLucideIcon( h, 'git-fork', { className: 'hdc-work-repo-meta-icon-svg', size: 12 } )
						),
						h( 'span', null, String( repo.forks ) )
					),
					h(
						'span',
						{ className: 'hdc-work-repo-meta-item' },
						h(
							'span',
							{ className: 'hdc-work-repo-meta-icon', 'aria-hidden': 'true' },
							renderLucideIcon( h, 'clock', { className: 'hdc-work-repo-meta-icon-svg', size: 12 } )
						),
						h( 'time', { dateTime: repo.updatedAt }, formatDateLabel( repo.updatedAt ) )
					)
				)
			);
		}

	function RepositoryLibrary( props ) {
		if ( props.describedRepos.length === 0 ) {
			return h( EmptyState, {
				title: 'Descriptions in progress',
				description:
					'These repositories are indexed, but detailed summaries are still being curated.',
			} );
		}

		return h(
			'section',
			{ className: 'hdc-work-section' },
			h( SectionIntro, {
				title: 'Repository Library',
				description:
					'Browse all repositories and case studies by language, popularity, or recent updates.',
			} ),
			props.view === 'grid'
				? h(
					Fragment,
					null,
					h(
						'div',
						{ className: 'hdc-work-repo-grid' },
						props.paginatedRepos.map( function ( repo ) {
							return h( RepoCard, {
								key: 'repo-' + repo.name,
								repo: repo,
								compareSelected: props.compareSelection.indexOf( repo.name ) !== -1,
								onToggleCompare: props.onToggleCompareRepo,
								openInNewTab: props.openInNewTab,
							} );
						} )
					),
					props.totalPages > 1
						? h(
							'div',
							{ className: 'hdc-work-pagination' },
							h(
								'button',
								{
									type: 'button',
									className: 'hdc-work-button is-ghost',
									onClick: props.onPreviousPage,
									disabled: props.safePage <= 1,
								},
								'Previous'
							),
							h(
								'span',
								{ className: 'hdc-work-pagination-label', 'aria-live': 'polite' },
								'Page ',
								String( props.safePage ),
								' of ',
								String( props.totalPages )
							),
							h(
								'button',
								{
									type: 'button',
									className: 'hdc-work-button is-ghost',
									onClick: props.onNextPage,
									disabled: props.safePage >= props.totalPages,
								},
								'Next'
							)
						)
						: null
				)
				: h(
					'div',
					{ className: 'hdc-work-timeline-groups' },
					props.timelineGroups.map( function ( group ) {
						return h(
							'section',
							{ key: 'timeline-' + group.month, className: 'hdc-work-month-group' },
							h( 'h4', { className: 'hdc-work-month-title' }, group.month ),
							h(
								'ul',
								{ className: 'hdc-work-timeline' },
								group.repos.map( function ( repo ) {
									return h(
										'li',
										{ key: group.month + '-' + repo.name, className: 'hdc-work-timeline-item' },
										h(
											'div',
											{ className: 'hdc-work-timeline-head' },
											h(
												'a',
												{
													className: 'hdc-work-timeline-title hdc-work-inline-link',
													href: getWorkDetailUrl( repo.name ),
												},
												repo.name
											),
											h(
												'div',
												{ className: 'hdc-work-timeline-meta' },
												repo.role ? h( Badge, { variant: 'secondary' }, repo.role ) : null,
												h(
													'time',
													{ className: 'hdc-work-meta-time', dateTime: repo.updatedAt },
													formatDateLabel( repo.updatedAt )
												)
											)
										),
										h(
											'p',
											{ className: 'hdc-work-timeline-body' },
											repo.shipped || repo.description
										),
										h(
											'div',
											{ className: 'hdc-work-badge-row' },
											getSignalBadges( repo )
												.slice( 0, 3 )
												.map( function ( signal ) {
													return h(
														Badge,
														{
															key: repo.name + '-timeline-signal-' + signal,
															variant: 'outline',
														},
														SIGNAL_LABEL_MAP[ signal ] || signal
													);
												} )
										)
									);
								} )
							)
						);
					} )
				)
		);
	}

	function PendingReposPanel( props ) {
		if ( props.pendingPreview.length === 0 && props.hiddenPendingCount === 0 ) {
			return null;
		}

		const totalPendingCount = props.pendingPreview.length + props.hiddenPendingCount;
		const previewLabel =
			props.hiddenPendingCount > 0
				? 'Preview ' + props.pendingPreview.length + ' of ' + totalPendingCount + ' repos'
				: 'Preview ' + props.pendingPreview.length + ' repos';

		return h(
			'section',
			{ className: 'hdc-work-pending' },
			h(
				'div',
				{ className: 'hdc-work-pending-head' },
				h(
					'div',
					null,
					h( 'h3', { className: 'hdc-work-section-title' }, 'Additional Repositories' ),
					h(
						'p',
						{ className: 'hdc-work-section-description' },
						'These repositories are indexed, but the write-ups are still in progress.'
					)
				),
				h(
					'button',
					{
						type: 'button',
						className: 'hdc-work-button is-ghost',
						onClick: props.onTogglePreview,
					},
					props.isPreviewVisible ? 'Hide list' : previewLabel
				)
			),
			props.isPreviewVisible
				? h(
					Fragment,
					null,
					h(
						'ul',
						{ className: 'hdc-work-list' },
						props.pendingPreview.map( function ( repo ) {
							return h(
								'li',
								{ key: 'pending-' + repo.name, className: 'hdc-work-list-item' },
								h(
									'div',
									{ className: 'hdc-work-list-item-main' },
									h( 'p', { className: 'hdc-work-list-item-title' }, repo.name ),
									h( 'p', { className: 'hdc-work-list-item-text' }, repo.language )
								),
								h(
									'time',
									{ className: 'hdc-work-list-item-time', dateTime: repo.updatedAt },
									formatDateLabel( repo.updatedAt )
								)
							);
						} )
					),
					props.hiddenPendingCount > 0
						? h(
							'p',
							{ className: 'hdc-work-hint' },
							'+',
							String( props.hiddenPendingCount ),
							' more repositories in this filter.'
						)
						: null
				)
				: null
		);
	}

	function CompareBar( props ) {
		if ( props.count === 0 ) {
			return null;
		}

		return h(
			'div',
			{ className: 'hdc-work-compare-bar' },
			h(
				'div',
				{ className: 'hdc-work-compare-bar-inner' },
				h(
					'span',
					{ className: 'hdc-work-compare-bar-text' },
					String( props.count ),
					props.count === 1 ? ' repo selected' : ' repos selected'
				),
				h(
					'button',
					{ type: 'button', className: 'hdc-work-button', onClick: props.onOpen },
					'Compare'
				),
				h(
					'button',
					{ type: 'button', className: 'hdc-work-button is-ghost', onClick: props.onClear },
					'Clear'
				)
			)
		);
	}

	function CompareSheet( props ) {
		if ( ! props.isOpen ) {
			return null;
		}

		return h(
			'div',
			{ className: 'hdc-work-sheet-overlay', role: 'dialog', 'aria-modal': 'true' },
			h( 'button', {
				type: 'button',
				className: 'hdc-work-sheet-backdrop',
				onClick: props.onClose,
				'aria-label': 'Close comparison sheet',
			} ),
			h(
				'aside',
				{ className: 'hdc-work-sheet' },
				h(
					'div',
					{ className: 'hdc-work-sheet-header' },
					h( 'h3', { className: 'hdc-work-sheet-title' }, 'Compare Repositories' ),
					h(
						'button',
						{ type: 'button', className: 'hdc-work-button is-ghost', onClick: props.onClose },
						'Close'
					)
				),
				h(
					'p',
					{ className: 'hdc-work-sheet-description' },
					'Compare repositories across language, signals, topics, and delivery notes.'
				),
				props.comparedRepos.length === 0
					? h(
						'p',
						{ className: 'hdc-work-empty-description' },
						'Select repositories from the library using the compare checkbox.'
					)
					: h(
						'div',
						{ className: 'hdc-work-compare-grid' },
						props.comparedRepos.map( function ( repo ) {
							const signals = getSignalBadges( repo );

							return h(
								'article',
								{ key: 'compare-' + repo.name, className: 'hdc-work-compare-card' },
								h(
									'div',
									{ className: 'hdc-work-compare-card-head' },
									h( 'h4', { className: 'hdc-work-repo-title' }, repo.name ),
									repo.role ? h( Badge, { variant: 'secondary' }, repo.role ) : null
								),
								h(
									'p',
									{ className: 'hdc-work-compare-summary' },
									repo.whyItMatters || repo.description
								),
								h(
									'dl',
									{ className: 'hdc-work-detail-grid' },
									h( 'dt', { className: 'hdc-work-label' }, 'Language' ),
									h( 'dd', { className: 'hdc-work-detail-value' }, repo.language ),
									h( 'dt', { className: 'hdc-work-label' }, 'Signals' ),
									h(
										'dd',
										{ className: 'hdc-work-detail-value' },
										signals.length
											? h(
												'div',
												{ className: 'hdc-work-badge-row' },
												signals.map( function ( signal ) {
													return h(
														Badge,
														{ key: repo.name + '-compare-signal-' + signal, variant: 'outline' },
														SIGNAL_LABEL_MAP[ signal ] || signal
													);
												} )
											)
											: 'No explicit signals'
									),
									h( 'dt', { className: 'hdc-work-label' }, 'Topics' ),
									h(
										'dd',
										{ className: 'hdc-work-detail-value' },
										repo.topics.length
											? h(
												'div',
												{ className: 'hdc-work-badge-row' },
												repo.topics.slice( 0, 6 ).map( function ( topic ) {
													return h(
														Badge,
														{ key: repo.name + '-compare-topic-' + topic, variant: 'secondary' },
														topic
													);
												} )
											)
											: 'No topics'
									)
								),
								repo.receipts && repo.receipts.length > 0
									? h(
										'div',
										{ className: 'hdc-work-compare-section' },
										h( 'p', { className: 'hdc-work-label' }, 'Receipts' ),
										h(
											'ul',
											{ className: 'hdc-work-bullet-list' },
											repo.receipts.slice( 0, 2 ).map( function ( receipt ) {
												return h(
													'li',
													{ key: repo.name + '-receipt-' + receipt.label },
													h( 'strong', null, receipt.label + ': ' ),
													receipt.value
												);
											} )
										)
									)
									: null,
								repo.learned
									? h(
										'div',
										{ className: 'hdc-work-compare-section' },
										h( 'p', { className: 'hdc-work-label' }, 'What I Learned' ),
										h( 'p', { className: 'hdc-work-detail-value' }, repo.learned )
									)
									: null
							);
						} )
					)
			)
		);
	}

	function WorkShowcaseApp( props ) {
		const config = props.config;
		const [ now, setNow ] = useState( function () {
			return Date.now();
		} );
		const [ loading, setLoading ] = useState( true );
		const [ error, setError ] = useState( '' );
		const [ repos, setRepos ] = useState( [] );
		const [ source, setSource ] = useState( 'fallback-error' );
		const [ detailsUnavailable, setDetailsUnavailable ] = useState( false );
		const [ filter, setFilter ] = useState( 'All' );
		const [ sort, setSort ] = useState( 'stars' );
		const [ view, setView ] = useState( 'grid' );
		const [ page, setPage ] = useState( 1 );
		const [ showPendingRepos, setShowPendingRepos ] = useState( false );
		const [ isCompareOpen, setIsCompareOpen ] = useState( false );
		const [ compareSelection, setCompareSelection ] = useState( [] );
		const [ compareToast, setCompareToast ] = useState( '' );

		useEffect( function () {
			function handleVisibility() {
				if ( document.visibilityState === 'visible' ) {
					setNow( Date.now() );
				}
			}

			document.addEventListener( 'visibilitychange', handleVisibility );
			return function () {
				document.removeEventListener( 'visibilitychange', handleVisibility );
			};
		}, [] );

		useEffect(
			function () {
				let cancelled = false;
				setLoading( true );
				setError( '' );

				loadWorkData( config )
					.then( function ( data ) {
						if ( cancelled ) {
							return;
						}
						setRepos( data.repos );
						setSource( data.source );
						setDetailsUnavailable( data.detailsUnavailable );
						setLoading( false );
						if ( data.repos.length === 0 ) {
							setError( 'No repositories are available to display.' );
						}
					} )
					.catch( function () {
						if ( cancelled ) {
							return;
						}
						setLoading( false );
						setRepos( [] );
						setSource( 'fallback-error' );
						setError( 'Unable to load repository data.' );
						setDetailsUnavailable( true );
					} );

				return function () {
					cancelled = true;
				};
			},
			[ config ]
		);

		useEffect(
			function () {
				if ( ! isCompareOpen ) {
					return undefined;
				}

				function handleEscape( event ) {
					if ( event.key === 'Escape' ) {
						setIsCompareOpen( false );
					}
				}

				document.addEventListener( 'keydown', handleEscape );
				return function () {
					document.removeEventListener( 'keydown', handleEscape );
				};
			},
			[ isCompareOpen ]
		);

		useEffect(
			function () {
				if ( ! compareToast ) {
					return undefined;
				}

				const timeoutId = window.setTimeout( function () {
					setCompareToast( '' );
				}, 2400 );

				return function () {
					window.clearTimeout( timeoutId );
				};
			},
			[ compareToast ]
		);

		const sourceLabel = source === 'live' ? 'Synced directly from GitHub.' : 'Cached project snapshot.';
		const sourceWarning =
			source === 'fallback-ratelimit'
				? 'GitHub rate limit reached. Showing cached project snapshot.'
				: source === 'fallback-error'
					? 'Live GitHub sync is unavailable right now. Showing cached project snapshot.'
					: source === 'fallback-offline'
						? 'You are offline, so live GitHub sync is unavailable. Showing cached project snapshot.'
						: null;
		const effectiveSort = view === 'timeline' ? 'updated' : sort;

		const languages = useMemo(
			function () {
				const languageSet = new Set();
				repos.forEach( function ( repo ) {
					languageSet.add( repo.language || 'Unknown' );
				} );
				return [ 'All' ].concat( Array.from( languageSet ) );
			},
			[ repos ]
		);

		useEffect(
			function () {
				if ( filter !== 'All' && languages.indexOf( filter ) === -1 ) {
					setFilter( 'All' );
				}
			},
			[ filter, languages ]
		);

		useEffect(
			function () {
				setCompareSelection( function ( current ) {
					return current.filter( function ( repoName ) {
						return repos.some( function ( repo ) {
							return repo.name === repoName;
						} );
					} );
				} );
			},
			[ repos ]
		);

		const activeFilter = filter === 'All' || languages.indexOf( filter ) !== -1 ? filter : 'All';

		const filtered = useMemo(
			function () {
				return repos
					.filter( function ( repo ) {
						return activeFilter === 'All' || repo.language === activeFilter;
					} )
					.sort( function ( a, b ) {
						if ( effectiveSort === 'stars' ) {
							if ( b.stars !== a.stars ) {
								return b.stars - a.stars;
							}
							return a.name.localeCompare( b.name );
						}

						return compareReposByUpdatedAtDesc( a, b );
					} );
			},
			[ repos, activeFilter, effectiveSort ]
		);

		const describedRepos = useMemo(
			function () {
				return filtered.filter( function ( repo ) {
					return hasCuratedDescription( repo.description );
				} );
			},
			[ filtered ]
		);

		const reposPendingDescription = useMemo(
			function () {
				return filtered.filter( function ( repo ) {
					return ! hasCuratedDescription( repo.description );
				} );
			},
			[ filtered ]
		);

		const totalPages = Math.max( 1, Math.ceil( describedRepos.length / PAGE_SIZE ) );
		const safePage = Math.min( page, totalPages );

		useEffect(
			function () {
				if ( page > totalPages ) {
					setPage( totalPages );
				}
			},
			[ page, totalPages ]
		);

		const paginatedRepos = useMemo(
			function () {
				return describedRepos.slice( ( safePage - 1 ) * PAGE_SIZE, safePage * PAGE_SIZE );
			},
			[ describedRepos, safePage ]
		);

		const pendingPreview = useMemo(
			function () {
				return reposPendingDescription.slice( 0, PENDING_DESCRIPTION_PREVIEW_COUNT );
			},
			[ reposPendingDescription ]
		);

		const hiddenPendingCount = Math.max( 0, reposPendingDescription.length - pendingPreview.length );
		const isPendingPreviewVisible = showPendingRepos;

		const featuredCaseStudies = useMemo(
			function () {
				return describedRepos
					.filter( function ( repo ) {
						return (
							repo.featured &&
							repo.problem &&
							repo.problem.length &&
							repo.approach &&
							repo.approach.length &&
							repo.result &&
							repo.result.length
						);
					} )
					.slice( 0, FEATURED_CASE_STUDY_LIMIT );
			},
			[ describedRepos ]
		);

		const reposByRole = useMemo(
			function () {
				return ROLE_ORDER.map( function ( role ) {
					return {
						role: role,
						repos: describedRepos.filter( function ( repo ) {
							return repo.role === role;
						} ),
					};
				} ).filter( function ( group ) {
					return group.repos.length > 0;
				} );
			},
			[ describedRepos ]
		);

		const shippedTimeline = useMemo(
			function () {
				return describedRepos
					.filter( function ( repo ) {
						return Boolean( repo.shipped );
					} )
					.sort( compareReposByUpdatedAtDesc )
					.slice( 0, 8 );
			},
			[ describedRepos ]
		);

		const recentlyUpdatedRepos = useMemo(
			function () {
				return repos
					.filter( function ( repo ) {
						return isUpdatedWithin( repo, SIGNAL_ACTIVITY_WINDOW_DAYS, now );
					} )
					.sort( compareReposByUpdatedAtDesc );
			},
			[ repos, now ]
		);

		const activeLanguages = useMemo(
			function () {
				const recentRepos = repos.filter( function ( repo ) {
					return isUpdatedWithin( repo, SIGNAL_LANGUAGE_WINDOW_DAYS, now );
				} );
				const counts = new Map();

				recentRepos.forEach( function ( repo ) {
					const language = repo.language || 'Unknown';
					counts.set( language, ( counts.get( language ) || 0 ) + 1 );
				} );

				return Array.from( counts.entries() )
					.sort( function ( a, b ) {
						return b[ 1 ] - a[ 1 ];
					} )
					.slice( 0, 5 );
			},
			[ repos, now ]
		);

		const activeLanguageLabel = activeLanguages[ 0 ] ? activeLanguages[ 0 ][ 0 ] : 'N/A';

		const timelineGroups = useMemo(
			function () {
				const grouped = new Map();
				describedRepos
					.slice()
					.sort( compareReposByUpdatedAtDesc )
					.forEach( function ( repo ) {
						const month = formatMonthLabel( repo.updatedAt );
						if ( ! grouped.has( month ) ) {
							grouped.set( month, [] );
						}
						grouped.get( month ).push( repo );
					} );

				return Array.from( grouped.entries() ).map( function ( entry ) {
					return {
						month: entry[ 0 ],
						repos: entry[ 1 ],
					};
				} );
			},
			[ describedRepos ]
		);

		const comparedRepos = useMemo(
			function () {
				return compareSelection
					.map( function ( repoName ) {
						return repos.find( function ( repo ) {
							return repo.name === repoName;
						} );
					} )
					.filter( Boolean );
			},
			[ compareSelection, repos ]
		);

		const compareSelectionVisibleCount = useMemo(
			function () {
				return compareSelection.filter( function ( repoName ) {
					return repos.some( function ( repo ) {
						return repo.name === repoName;
					} );
				} ).length;
			},
			[ compareSelection, repos ]
		);

		const activityBuckets = useMemo(
			function () {
				const bucketCount = config.sparklineWeeks;
				const bucketMs = 7 * 24 * 60 * 60 * 1000;
				const buckets = Array.from( { length: bucketCount }, function ( _unused, index ) {
					return {
						count: 0,
						label: 'W' + String( index + 1 ),
					};
				} );

				repos.forEach( function ( repo ) {
					const timestamp = getRepoUpdatedTimestamp( repo );
					if ( ! Number.isFinite( timestamp ) ) {
						return;
					}

					const age = now - timestamp;
					if ( age < 0 ) {
						return;
					}

					const bucketIndex = bucketCount - 1 - Math.floor( age / bucketMs );
					if ( bucketIndex < 0 || bucketIndex >= bucketCount ) {
						return;
					}

					buckets[ bucketIndex ].count += 1;
				} );

				const peak = Math.max.apply(
					undefined,
					[ 1 ].concat(
						buckets.map( function ( bucket ) {
							return bucket.count;
						} )
					)
				);

				return buckets.map( function ( bucket ) {
					return {
						count: bucket.count,
						label: bucket.label,
						height: Math.max( 14, Math.round( ( bucket.count / peak ) * 56 ) ),
					};
				} );
			},
			[ repos, now, config.sparklineWeeks ]
		);

		const recentRepoPreview = recentlyUpdatedRepos.slice( 0, 3 );

		function handleFilterChange( value ) {
			setFilter( value );
			setPage( 1 );
			setShowPendingRepos( false );
		}

		function handleSortChange( value ) {
			setSort( value );
			setPage( 1 );
			setShowPendingRepos( false );
		}

		function handleViewChange( value ) {
			if ( value !== 'grid' && value !== 'timeline' ) {
				return;
			}

			setView( value );
			setPage( 1 );
			setShowPendingRepos( false );
			if ( value === 'timeline' ) {
				setIsCompareOpen( false );
			}
		}

		function handleToggleCompareRepo( repoName ) {
			setCompareSelection( function ( current ) {
				if ( current.indexOf( repoName ) !== -1 ) {
					setCompareToast( '' );
					return current.filter( function ( name ) {
						return name !== repoName;
					} );
				}

				if (
					! repos.some( function ( repo ) {
						return repo.name === repoName;
					} )
				) {
					return current;
				}

				if ( current.length >= config.compareLimit ) {
					const evicted = current[ 0 ];
					setCompareToast( 'Replaced ' + evicted + ' in comparison.' );
					return current.slice( 1 ).concat( [ repoName ] );
				}

				setCompareToast( '' );
				return current.concat( [ repoName ] );
			} );
		}

		function handleClearCompare() {
			setCompareSelection( [] );
			setCompareToast( '' );
		}

		return h(
			'div',
			{ className: 'hdc-work-app' },
			h(
				'header',
				{ className: 'hdc-work-hero' },
				h( 'h3', { className: 'hdc-work-heading' }, config.heading ),
				h( 'p', { className: 'hdc-work-description' }, config.description ),
				h(
					'p',
					{ className: 'hdc-work-source-label', 'aria-live': 'polite' },
					loading ? 'Syncing from GitHub…' : sourceLabel
				),
				! loading && sourceWarning
					? h( 'p', { className: 'hdc-work-source-warning' }, sourceWarning )
					: null
			),
			loading ? h( 'p', { className: 'hdc-work-status' }, 'Loading repositories…' ) : null,
			! loading && error ? h( 'p', { className: 'hdc-work-status is-error' }, error ) : null,
			! loading && ! error
				? h(
					Fragment,
					null,
					h( FiltersBar, {
						compareSelectionVisibleCount: compareSelectionVisibleCount,
						languages: languages,
						onFilterChange: handleFilterChange,
						onOpenCompare: function () {
							setIsCompareOpen( true );
						},
						onSortChange: handleSortChange,
						onViewChange: handleViewChange,
						showDetailsUnavailableMessage: detailsUnavailable,
						sort: sort,
						value: activeFilter,
						view: view,
					} ),
					config.showSignalsPanel
						? h( SignalsPanel, {
							activeLanguageLabel: activeLanguageLabel,
							activeLanguages: activeLanguages,
							activityBuckets: activityBuckets,
							recentRepoPreview: recentRepoPreview,
							recentlyUpdatedCount: recentlyUpdatedRepos.length,
							showActivitySparkline: config.showActivitySparkline,
							sparklineWeeks: config.sparklineWeeks,
						} )
						: null,
					filtered.length === 0
						? h( EmptyState, {
							title: 'No projects found',
							description: 'No repositories matched the selected language filter.',
							action: h(
								'button',
								{
									type: 'button',
									className: 'hdc-work-button is-link',
									onClick: function () {
										handleFilterChange( 'All' );
									},
								},
								'View all projects'
							),
						} )
						: h(
							Fragment,
							null,
							h( FeaturedCaseStudies, {
								repos: featuredCaseStudies,
								openInNewTab: config.openInNewTab,
							} ),
							h( RoleGroups, { groups: reposByRole, roleDescriptionMap: ROLE_DESCRIPTION_MAP } ),
							view === 'timeline' ? h( BuildTimeline, { repos: shippedTimeline } ) : null,
							h( RepositoryLibrary, {
								compareSelection: compareSelection,
								describedRepos: describedRepos,
								onNextPage: function () {
									setPage( function ( current ) {
										return Math.min( totalPages, current + 1 );
									} );
								},
								onPreviousPage: function () {
									setPage( function ( current ) {
										return Math.max( 1, current - 1 );
									} );
								},
								onToggleCompareRepo: handleToggleCompareRepo,
								paginatedRepos: paginatedRepos,
								safePage: safePage,
								timelineGroups: timelineGroups,
								totalPages: totalPages,
								view: view,
								openInNewTab: config.openInNewTab,
							} ),
							reposPendingDescription.length > 0
								? h( PendingReposPanel, {
									hiddenPendingCount: hiddenPendingCount,
									isPreviewVisible: isPendingPreviewVisible,
									onTogglePreview: function () {
										setShowPendingRepos( function ( current ) {
											return ! current;
										} );
									},
									pendingPreview: pendingPreview,
								} )
								: null,
							compareToast
								? h(
									'p',
									{
										className: 'hdc-work-toast',
										role: 'status',
										'aria-live': 'polite',
									},
									compareToast
								)
								: null
						)
				)
				: null,
			! loading && ! error && view === 'grid'
				? h( CompareBar, {
					count: compareSelectionVisibleCount,
					onClear: handleClearCompare,
					onOpen: function () {
						setIsCompareOpen( true );
					},
				} )
				: null,
			! loading && ! error && view === 'grid'
				? h( CompareSheet, {
					isOpen: isCompareOpen,
					onClose: function () {
						setIsCompareOpen( false );
					},
					comparedRepos: comparedRepos,
				} )
				: null
		);
	}

	function mountShowcase( container ) {
		const config = parseConfig( container );
		const rootNode = container.querySelector( '[data-hdc-work-root]' ) || container;
		const app = h( WorkShowcaseApp, { config: config } );

		if ( typeof createRoot === 'function' ) {
			createRoot( rootNode ).render( app );
			return;
		}

		render( app, rootNode );
	}

	document
		.querySelectorAll( '.wp-block-henrys-digital-canvas-work-showcase' )
		.forEach( mountShowcase );
} )( window.wp );
