( function ( wp ) {
	if ( ! wp || ! wp.element ) {
		return;
	}

	const createElement = wp.element.createElement;
	const Fragment = wp.element.Fragment;
	const useEffect = wp.element.useEffect;
	const useMemo = wp.element.useMemo;
	const useRef = wp.element.useRef;
	const useState = wp.element.useState;
	const createRoot = wp.element.createRoot;
	const render = wp.element.render;
	const renderLucideIcon =
		window.hdcSharedUtils && typeof window.hdcSharedUtils.renderLucideIcon === 'function'
			? window.hdcSharedUtils.renderLucideIcon
			: function () {
				return null;
			};

	const PAGE_SIZE = 6;
	const PLACEHOLDER_DESCRIPTION = 'Description coming soon.';
	const PENDING_DESCRIPTION_PREVIEW_COUNT = 8;
	const FEATURED_CASE_STUDY_LIMIT = 6;
	const SIGNAL_ACTIVITY_WINDOW_DAYS = 30;
	const SIGNAL_LANGUAGE_WINDOW_DAYS = 90;
	const DEFAULT_FILTER = 'All';
	const DEFAULT_SORT = 'stars';
	const DEFAULT_VIEW = 'grid';
	const DEFAULT_SPARKLINE_WEEKS = 8;
	const MIN_SPARKLINE_WEEKS = 4;
	const MAX_SPARKLINE_WEEKS = 16;
	const GITHUB_REPO_LIST_LIMIT = 100;
	const GITHUB_REPO_MAX_PAGES = 20;
	const RATE_LIMIT_COOLDOWN_FALLBACK_MS = 60000;
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
	const repoRateLimitCooldownByQueryKey = new Map();
	const repoProofRateLimitCooldownByQueryKey = new Map();
	const ciStatusRateLimitCooldownByQueryKey = new Map();
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
			document.querySelectorAll( '.hdc-reveal' ).forEach( function ( element ) {
				element.classList.add( 'is-visible' );
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

		document.querySelectorAll( '.hdc-reveal:not(.is-visible)' ).forEach( function ( element ) {
			revealObserver.observe( element );
		} );
	}

	function h() {
		return createElement.apply( undefined, arguments );
	}

	function classNames() {
		let output = '';

		Array.prototype.slice.call( arguments ).forEach( function ( value ) {
			if ( ! value ) {
				return;
			}

			const normalized = String( value ).trim();
			if ( ! normalized ) {
				return;
			}

			output += output ? ' ' + normalized : normalized;
		} );

		return output;
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

	function concatTextParts( items, separator ) {
		let output = '';

		ensureArray( items ).forEach( function ( item ) {
			const normalized = sanitizeString( item, '' );
			if ( ! normalized ) {
				return;
			}

			output += output ? separator + normalized : normalized;
		} );

		return output;
	}

	function parseWorkFilter( value ) {
		const normalized = typeof value === 'string' ? value.trim() : '';
		return normalized || DEFAULT_FILTER;
	}

	function parseWorkSort( value ) {
		return value === 'updated' ? 'updated' : DEFAULT_SORT;
	}

	function parseWorkView( value ) {
		return value === 'timeline' ? 'timeline' : DEFAULT_VIEW;
	}

	function parseWorkPage( value ) {
		const parsed = Number.parseInt( String( value ), 10 );
		if ( ! Number.isFinite( parsed ) || parsed < 1 ) {
			return 1;
		}

		return parsed;
	}

	function buildWorkSearchParams( options ) {
		const params = new URLSearchParams();
		if ( options.filter !== DEFAULT_FILTER ) {
			params.set( 'language', options.filter );
		}
		if ( options.sort !== DEFAULT_SORT ) {
			params.set( 'sort', options.sort );
		}
		if ( options.view !== DEFAULT_VIEW ) {
			params.set( 'view', options.view );
		}
		if ( options.view === 'grid' && options.page > 1 ) {
			params.set( 'page', String( options.page ) );
		}
		return params;
	}

	function getActivityBucketLabel( index, total ) {
		const weeksAgo = total - index - 1;

		if ( weeksAgo === 0 ) {
			return 'This week';
		}

		if ( weeksAgo === 1 ) {
			return '1 week ago';
		}

		return weeksAgo + ' weeks ago';
	}

	function readInitialWorkState() {
		if ( typeof window === 'undefined' || ! window.location ) {
			return {
				filter: DEFAULT_FILTER,
				sort: DEFAULT_SORT,
				view: DEFAULT_VIEW,
				page: 1,
			};
		}

		const params = new URLSearchParams( window.location.search );
		return {
			filter: parseWorkFilter( params.get( 'language' ) ),
			sort: parseWorkSort( params.get( 'sort' ) ),
			view: parseWorkView( params.get( 'view' ) ),
			page: parseWorkPage( params.get( 'page' ) ),
		};
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

	function formatShortDateLabel( dateString ) {
		return parseRepoDate( dateString ).toLocaleDateString( undefined, {
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
			license: sanitizeString( repo.license, '' ),
			openIssuesAndPullRequests:
				Number.isFinite( Number( repo.openIssuesAndPullRequests ) )
					? Number( repo.openIssuesAndPullRequests )
					: 0,
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
				'Selected repositories and client case studies focused on problem framing, implementation decisions, and shipped outcomes.'
			),
			githubUsername: sanitizeString( parsed.githubUsername, 'henryperkins' ),
			repoCount: clamp( Number.parseInt( parsed.repoCount, 10 ) || 100, 1, 100 ),
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
			githubProxyUrl: sanitizeString( parsed.githubProxyUrl, '/api/github/repos' ),
			githubRepoProofsProxyUrl: sanitizeString(
				parsed.githubRepoProofsProxyUrl,
				'/api/github/repo-proofs'
			),
			githubCIStatusProxyUrl: sanitizeString(
				parsed.githubCIStatusProxyUrl,
				'/api/github/ci-status'
			),
			localReposUrl: sanitizeString( parsed.localReposUrl, '' ),
			repoCaseStudyDetailsUrl: sanitizeString( parsed.repoCaseStudyDetailsUrl, '' ),
		};
	}

	function parseIntegerHeader( value ) {
		if ( ! value ) {
			return undefined;
		}

		const parsed = Number.parseInt( String( value ), 10 );
		return Number.isFinite( parsed ) ? parsed : undefined;
	}

	function parseRetryAfterSeconds( value ) {
		if ( ! value ) {
			return undefined;
		}

		const seconds = Number.parseInt( String( value ), 10 );
		if ( Number.isFinite( seconds ) ) {
			return Math.max( 0, seconds );
		}

		const retryDateMs = Date.parse( String( value ) );
		if ( Number.isFinite( retryDateMs ) ) {
			return Math.max( 0, Math.ceil( ( retryDateMs - Date.now() ) / 1000 ) );
		}

		return undefined;
	}

	function parsePayloadMessage( payload ) {
		if ( ! payload || typeof payload !== 'object' ) {
			return '';
		}

		if ( typeof payload.error === 'string' ) {
			return payload.error.trim();
		}

		if ( typeof payload.message === 'string' ) {
			return payload.message.trim();
		}

		if ( payload.details && typeof payload.details === 'object' && typeof payload.details.message === 'string' ) {
			return payload.details.message.trim();
		}

		return '';
	}

	function createGitHubProxyError( message, response, payload ) {
		const error = new Error( message );
		const status = response && Number.isFinite( response.status ) ? response.status : undefined;
		const rateLimitRemaining = response ? parseIntegerHeader( response.headers.get( 'x-github-ratelimit-remaining' ) ) : undefined;
		const rateLimitResetEpochSeconds = response ? parseIntegerHeader( response.headers.get( 'x-github-ratelimit-reset' ) ) : undefined;
		const retryAfterSeconds = response ? parseRetryAfterSeconds( response.headers.get( 'retry-after' ) ) : undefined;
		const payloadMessage = parsePayloadMessage( payload );

		error.status = status;
		error.rateLimitRemaining = rateLimitRemaining;
		error.rateLimitResetEpochSeconds = rateLimitResetEpochSeconds;
		error.retryAfterSeconds = retryAfterSeconds;
		error.rateLimited =
			status === 429 ||
			( status === 403 &&
				( rateLimitRemaining === 0 ||
					retryAfterSeconds > 0 ||
					/rate limit/i.test( message ) ||
					/rate limit/i.test( payloadMessage ) ) );
		return error;
	}

	function getRateLimitRetryAfterMs( error, fallbackMs ) {
		if ( ! isRateLimitError( error ) ) {
			return null;
		}

		const fallback = Number.isFinite( fallbackMs ) && fallbackMs > 0 ? Math.floor( fallbackMs ) : RATE_LIMIT_COOLDOWN_FALLBACK_MS;
		if ( typeof error.retryAfterSeconds === 'number' && error.retryAfterSeconds > 0 ) {
			return Math.max( 1000, error.retryAfterSeconds * 1000 );
		}

		if ( typeof error.rateLimitResetEpochSeconds === 'number' ) {
			const retryAfterMs = Math.ceil( error.rateLimitResetEpochSeconds * 1000 - Date.now() );
			if ( retryAfterMs > 0 ) {
				return Math.max( 1000, retryAfterMs );
			}
		}

		return fallback;
	}

	function getRemainingRateLimitCooldownMs( map, queryKey ) {
		const cooldownUntil = map.get( queryKey ) || 0;
		const remainingMs = cooldownUntil - Date.now();
		return Math.max( 0, remainingMs );
	}

	function setRateLimitCooldown( map, queryKey, error ) {
		const retryAfterMs = getRateLimitRetryAfterMs( error, RATE_LIMIT_COOLDOWN_FALLBACK_MS ) || RATE_LIMIT_COOLDOWN_FALLBACK_MS;
		const nextCooldownUntil = Date.now() + retryAfterMs;
		const previousCooldownUntil = map.get( queryKey ) || 0;
		map.set( queryKey, Math.max( previousCooldownUntil, nextCooldownUntil ) );
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
		if ( ! error || typeof error !== 'object' ) {
			return false;
		}

		if ( error.rateLimited ) {
			return true;
		}

		if ( error.status === 429 ) {
			return true;
		}

		if ( error.status === 403 ) {
			if ( typeof error.rateLimitRemaining === 'number' && error.rateLimitRemaining <= 0 ) {
				return true;
			}
			if ( /rate limit/i.test( String( error.message || '' ) ) ) {
				return true;
			}
		}

		return false;
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
			const license =
				repo.license &&
				typeof repo.license === 'object' &&
				(
					sanitizeString( repo.license.spdx_id, '' ) ||
					sanitizeString( repo.license.name, '' )
				);

			return normalizeRepo(
				Object.assign( {}, localRepo || {}, {
					name: sanitizeString( repo.name, localRepo ? localRepo.name : 'unknown-repository' ),
					description: description,
					language: language,
					stars: Number.isFinite( repo.stargazers_count ) ? repo.stargazers_count : 0,
					forks: Number.isFinite( repo.forks_count ) ? repo.forks_count : 0,
					openIssuesAndPullRequests: Number.isFinite( repo.open_issues_count ) ? repo.open_issues_count : 0,
					updatedAt: updatedAt,
					_updatedAtMs: getUpdatedAtTimestamp( repo.pushed_at || updatedAt ),
					url: sanitizeString( repo.html_url, localRepo ? localRepo.url : '' ),
					defaultBranch: sanitizeString( repo.default_branch, localRepo ? localRepo.defaultBranch : '' ),
					license: license || ( localRepo ? localRepo.license : '' ),
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

	function resolveRequestUrl( value ) {
		const normalized = sanitizeString( value, '' );
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

	function getRepoRateLimitCooldownQueryKey( owner ) {
		return 'github-repos:' + owner;
	}

	function normalizeLanguage( language ) {
		const normalized = typeof language === 'string' ? language.trim() : '';
		return normalized || 'Unknown';
	}

	async function fetchGitHubReposProxyPage( config, perPage, page ) {
		const requestUrl = new URL( resolveRequestUrl( config.githubProxyUrl ) );
		requestUrl.searchParams.set( 'username', config.githubUsername );
		requestUrl.searchParams.set( 'per_page', String( perPage ) );
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
			throw createGitHubProxyError( 'GitHub proxy returned invalid JSON', response, null );
		}

		if ( ! response.ok ) {
			const message = parsePayloadMessage( payload ) || 'GitHub proxy request failed';
			throw createGitHubProxyError( message + ' (status ' + response.status + ')', response, payload );
		}

		if ( ! Array.isArray( payload ) ) {
			throw createGitHubProxyError(
				'GitHub proxy response was not an array of repositories',
				response,
				payload
			);
		}

		return payload;
	}

	async function fetchGitHubRepos( config, localRepos ) {
		const perPage = GITHUB_REPO_LIST_LIMIT;
		const allRepos = [];

		for ( let page = 1; page <= GITHUB_REPO_MAX_PAGES; page += 1 ) {
			const pageRepos = await fetchGitHubReposProxyPage( config, perPage, page );
			allRepos.push.apply( allRepos, pageRepos );

			if ( pageRepos.length < perPage ) {
				break;
			}
		}

		return mapGitHubRepos( allRepos, localRepos, config );
	}

	function getRepoProofRateLimitCooldownQueryKey( owner, repoNames ) {
		return 'github-repo-proofs:' + owner + ':' + concatTextParts( repoNames, '|' );
	}

	function isRepoProofArray( value ) {
		return Array.isArray( value ) && value.every( function ( proof ) {
			return proof && typeof proof === 'object' && typeof proof.repo === 'string';
		} );
	}

	function buildRepoProofMap( proofs ) {
		const map = {};
		proofs.forEach( function ( proof ) {
			const key = String( proof.repo || '' ).toLowerCase();
			if ( ! key ) {
				return;
			}

			map[ proof.repo ] = proof;
			map[ key ] = proof;
		} );
		return map;
	}

	async function fetchGitHubRepoProofsFromProxy( config, repoNames, username ) {
		const requestUrl = new URL( resolveRequestUrl( config.githubRepoProofsProxyUrl ) );
		requestUrl.searchParams.set( 'username', username );
		repoNames.forEach( function ( repoName ) {
			requestUrl.searchParams.append( 'repo', repoName );
		} );

		const response = await fetch( requestUrl.toString(), {
			headers: {
				Accept: 'application/json',
			},
		} );

		let payload = null;
		try {
			payload = await response.json();
		} catch ( error ) {
			throw createGitHubProxyError( 'GitHub repo proofs proxy returned invalid JSON', response, null );
		}

		if ( ! response.ok ) {
			const message = parsePayloadMessage( payload ) || 'GitHub repo proofs request failed';
			throw createGitHubProxyError( message + ' (status ' + response.status + ')', response, payload );
		}

		if (
			! payload ||
			typeof payload !== 'object' ||
			typeof payload.repoCount !== 'number' ||
			typeof payload.failedRepoCount !== 'number' ||
			typeof payload.partialData !== 'boolean' ||
			! isRepoProofArray( payload.proofs )
		) {
			throw createGitHubProxyError(
				'GitHub repo proofs response had an unexpected shape',
				response,
				payload
			);
		}

		return payload;
	}

	async function loadRepoProofs( config, repoNames ) {
		const normalizedRepoNames = Array.from(
			new Set(
				repoNames
					.map( function ( repoName ) {
						return sanitizeString( repoName, '' );
					} )
					.filter( Boolean )
			)
		).sort( function ( left, right ) {
			return left.localeCompare( right );
		} );

		if ( normalizedRepoNames.length === 0 ) {
			return {
				proofsByRepoName: {},
				source: 'live',
			};
		}

		const username = sanitizeString( config.githubUsername, 'unknown' );
		const cooldownQueryKey = getRepoProofRateLimitCooldownQueryKey( username, normalizedRepoNames );

		if ( getRemainingRateLimitCooldownMs( repoProofRateLimitCooldownByQueryKey, cooldownQueryKey ) > 0 ) {
			return {
				proofsByRepoName: {},
				source: 'fallback-ratelimit',
			};
		}

		try {
			const payload = await fetchGitHubRepoProofsFromProxy( config, normalizedRepoNames, username );
			return {
				proofsByRepoName: buildRepoProofMap( payload.proofs ),
				source: 'live',
			};
		} catch ( error ) {
			if ( isRateLimitError( error ) ) {
				setRateLimitCooldown( repoProofRateLimitCooldownByQueryKey, cooldownQueryKey, error );
				return {
					proofsByRepoName: {},
					source: 'fallback-ratelimit',
				};
			}
			if ( isOfflineError( error ) ) {
				return {
					proofsByRepoName: {},
					source: 'fallback-offline',
				};
			}
			return {
				proofsByRepoName: {},
				source: 'fallback-error',
			};
		}
	}

	function isCIStatusResultArray( value ) {
		const validStatuses = [ 'passing', 'failing', 'running', 'none', 'neutral', 'unavailable' ];

		return Array.isArray( value ) && value.every( function ( entry ) {
			return (
				entry &&
				typeof entry === 'object' &&
				typeof entry.repo === 'string' &&
				typeof entry.ciStatus === 'string' &&
				validStatuses.indexOf( entry.ciStatus ) !== -1
			);
		} );
	}

	function buildCIStatusMap( results ) {
		const map = {};

		results.forEach( function ( entry ) {
			const repoName = sanitizeString( entry.repo, '' );
			if ( ! repoName ) {
				return;
			}

			map[ repoName ] = entry.ciStatus;
			map[ repoName.toLowerCase() ] = entry.ciStatus;
		} );

		return map;
	}

	async function loadCIStatus( config, repoNames ) {
		const normalizedRepoNames = Array.from(
			new Set(
				repoNames
					.map( function ( repoName ) {
						return sanitizeString( repoName, '' );
					} )
					.filter( Boolean )
			)
		).sort( function ( left, right ) {
			return left.localeCompare( right );
		} );

		if ( normalizedRepoNames.length === 0 || ! config.githubCIStatusProxyUrl ) {
			return {
				ciStatusByRepo: {},
				source: 'live',
			};
		}

		const username = sanitizeString( config.githubUsername, 'unknown' );
		const cooldownQueryKey = 'github-ci-status:' + username + ':' + concatTextParts( normalizedRepoNames, '|' );

		if ( getRemainingRateLimitCooldownMs( ciStatusRateLimitCooldownByQueryKey, cooldownQueryKey ) > 0 ) {
			return {
				ciStatusByRepo: {},
				source: 'fallback-ratelimit',
			};
		}

		try {
			const requestUrl = new URL( resolveRequestUrl( config.githubCIStatusProxyUrl ) );
			requestUrl.searchParams.set( 'username', username );
			normalizedRepoNames.forEach( function ( repoName ) {
				requestUrl.searchParams.append( 'repo', repoName );
			} );

			const response = await fetch( requestUrl.toString(), {
				headers: {
					Accept: 'application/json',
				},
			} );

			let payload = null;
			try {
				payload = await response.json();
			} catch ( error ) {
				throw createGitHubProxyError( 'GitHub CI status proxy returned invalid JSON', response, null );
			}

			if (
				! payload ||
				typeof payload !== 'object' ||
				typeof payload.repoCount !== 'number' ||
				! isCIStatusResultArray( payload.results )
			) {
				throw createGitHubProxyError(
					'GitHub CI status response had an unexpected shape',
					response,
					payload
				);
			}

			if ( ! response.ok ) {
				const message = parsePayloadMessage( payload ) || 'GitHub CI status request failed';
				throw createGitHubProxyError( message + ' (status ' + response.status + ')', response, payload );
			}

			return {
				ciStatusByRepo: buildCIStatusMap( payload.results ),
				source: 'live',
			};
		} catch ( error ) {
			if ( isRateLimitError( error ) ) {
				setRateLimitCooldown( ciStatusRateLimitCooldownByQueryKey, cooldownQueryKey, error );
				return {
					ciStatusByRepo: {},
					source: 'fallback-ratelimit',
				};
			}
			if ( isOfflineError( error ) ) {
				return {
					ciStatusByRepo: {},
					source: 'fallback-offline',
				};
			}
			return {
				ciStatusByRepo: {},
				source: 'fallback-error',
			};
		}
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
		const repoCooldownQueryKey = getRepoRateLimitCooldownQueryKey( config.githubUsername );

		if ( getRemainingRateLimitCooldownMs( repoRateLimitCooldownByQueryKey, repoCooldownQueryKey ) > 0 ) {
			source = 'fallback-ratelimit';
		} else {
			try {
				repos = await fetchGitHubRepos( config, localRepos );
				source = 'live';
			} catch ( error ) {
				if ( isRateLimitError( error ) ) {
					source = 'fallback-ratelimit';
					setRateLimitCooldown( repoRateLimitCooldownByQueryKey, repoCooldownQueryKey, error );
				} else if ( isOfflineError( error ) ) {
					source = 'fallback-offline';
				} else {
					source = 'fallback-error';
				}
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
				className: classNames(
					'hdc-work-badge',
					props.variant ? 'is-' + props.variant : 'is-secondary',
					props.className
				),
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

	function LoadingSkeleton() {
		return h(
			Fragment,
			null,
			h(
				'div',
				{ className: 'hdc-work-skeleton-filters' },
				h( 'span', { className: 'hdc-work-skeleton is-h8 is-w-20 is-rounded-pill' } ),
				h( 'span', { className: 'hdc-work-skeleton is-h8 is-w-20 is-rounded-pill' } ),
				h( 'span', { className: 'hdc-work-skeleton is-h8 is-w-20 is-rounded-pill' } ),
				h( 'span', { className: 'hdc-work-skeleton is-h8 is-w-20 is-rounded-pill' } ),
				h( 'span', { className: 'hdc-work-skeleton is-h8 is-w-20 is-rounded-pill' } ),
				h( 'span', { className: 'hdc-work-skeleton is-h9 is-w-36 is-rounded-surface is-ml-auto' } )
			),
			h(
				'div',
				{ className: 'hdc-work-skeleton-grid' },
				[ 0, 1, 2, 3, 4, 5 ].map( function ( index ) {
					return h(
						'div',
						{ key: 'skeleton-card-' + index, className: 'hdc-work-skeleton-card' },
						h(
							'div',
							{ className: 'hdc-work-skeleton-card-head' },
							h( 'span', { className: 'hdc-work-skeleton is-h5 is-w-24' } ),
							h( 'span', { className: 'hdc-work-skeleton is-h4 is-w-14' } )
						),
						h( 'span', { className: 'hdc-work-skeleton is-h6 is-w-3-4' } ),
						h( 'span', { className: 'hdc-work-skeleton is-h4 is-w-full' } ),
						h( 'span', { className: 'hdc-work-skeleton is-h4 is-w-5-6' } ),
						h(
							'div',
							{ className: 'hdc-work-skeleton-card-topics' },
							h( 'span', { className: 'hdc-work-skeleton is-h5 is-w-16 is-rounded-pill' } ),
							h( 'span', { className: 'hdc-work-skeleton is-h5 is-w-14 is-rounded-pill' } ),
							h( 'span', { className: 'hdc-work-skeleton is-h5 is-w-20 is-rounded-pill' } )
						),
						h(
							'div',
							{ className: 'hdc-work-skeleton-card-footer' },
							h( 'span', { className: 'hdc-work-skeleton is-h4 is-w-12' } ),
							h( 'span', { className: 'hdc-work-skeleton is-h4 is-w-12' } ),
							h( 'span', { className: 'hdc-work-skeleton is-h4 is-w-20' } )
						)
					);
				} )
			)
		);
	}

	function FiltersBar( props ) {
		return h(
			'section',
			{ className: 'hdc-work-filters' },
			h(
				'div',
				{ className: 'hdc-work-filter-language' },
				h( 'span', { className: 'hdc-work-control-label' }, 'Language' ),
				h(
					'div',
					{ className: 'hdc-work-chip-rail', role: 'group', 'aria-label': 'Filter by language' },
					props.languages.map( function ( option ) {
						return h(
							'button',
							{
								type: 'button',
								key: option,
								className: classNames( 'hdc-work-chip', props.value === option && 'is-active' ),
								onClick: function () {
									props.onFilterChange( option );
								},
								'aria-pressed': props.value === option ? 'true' : 'false',
							},
							option
						);
					} )
				)
			),
			h(
				'div',
				{ className: 'hdc-work-filter-row' },
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
		const recentRepoPreviewLabel = concatTextParts(
			props.recentRepoPreview.map( function ( repo ) {
				return repo.name;
			} ),
			' • '
		);

		return h(
			'section',
			{
				className: classNames( 'hdc-work-signals', 'hdc-reveal' ),
				style: { '--reveal-index': 0 },
			},
			h( SectionIntro, {
				title: 'Engineering Signals',
				description:
					'Snapshot of recent shipping activity, current language focus, and delivery cadence.',
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
							recentRepoPreviewLabel
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
							props.activeLanguages.slice( 0, 3 ).map( function ( item ) {
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
					'Curated challenge, approach, and outcome snapshots from selected work.',
			} ),
			h(
				'div',
				{ className: 'hdc-work-featured-grid' },
				props.repos.map( function ( repo, index ) {
					return h(
						'article',
						{
							key: 'featured-' + repo.name,
							className: classNames( 'hdc-work-featured-card', 'hdc-reveal' ),
							style: { '--reveal-index': index },
						},
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
								repo.highlights.slice( 0, 2 ).map( function ( highlight, index ) {
									return h( Badge, { key: repo.name + '-highlight-' + index, variant: 'outline' }, highlight );
								} )
							)
							: null,
						repo.architecture && ( repo.architecture.summary || repo.architecture.bullets.length )
							? h(
								'div',
								{ className: 'hdc-work-architecture-box' },
								h( 'p', { className: 'hdc-work-label' }, 'Architecture' ),
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
		const [ expandedRoles, setExpandedRoles ] = useState( function () {
			return new Set();
		} );
		const totalRepos = props.groups.reduce( function ( sum, group ) {
			return sum + group.repos.length;
		}, 0 );

		if ( props.groups.length === 0 ) {
			return null;
		}

		function handleToggleRole( role ) {
			setExpandedRoles( function ( previous ) {
				const next = new Set( previous );
				if ( next.has( role ) ) {
					next.delete( role );
				} else {
					next.add( role );
				}
				return next;
			} );
		}

		return h(
			'section',
			{ className: 'hdc-work-section' },
			h( SectionIntro, {
				title: 'Projects by Focus Area',
				description:
					'Quick orientation for how the work is distributed across systems, product delivery, craft, and performance.',
			} ),
			h(
				'div',
				{ className: 'hdc-work-role-grid' },
				props.groups.map( function ( group, groupIndex ) {
					const sortedRepos = group.repos.slice().sort( compareReposByUpdatedAtDesc );
					const latestRepo = sortedRepos[ 0 ] || null;
					const isExpanded = expandedRoles.has( group.role );
					const visibleRepos = isExpanded ? sortedRepos : sortedRepos.slice( 0, 2 );
					const hiddenPreviewCount = Math.max( 0, sortedRepos.length - 2 );
					const canExpand = hiddenPreviewCount > 0;
					const proportionPercent = totalRepos > 0 ? Math.round( ( sortedRepos.length / totalRepos ) * 100 ) : 0;

					return h(
						'article',
						{
							key: 'role-' + group.role,
							className: classNames( 'hdc-work-role-card', 'hdc-reveal', isExpanded && 'is-expanded' ),
							role: canExpand ? 'button' : undefined,
							'aria-expanded': canExpand ? String( isExpanded ) : undefined,
							tabIndex: canExpand ? 0 : undefined,
							style: { '--reveal-index': groupIndex },
							onClick: canExpand
								? function () {
									handleToggleRole( group.role );
								}
								: undefined,
							onKeyDown: canExpand
								? function ( event ) {
									if ( event.key === 'Enter' || event.key === ' ' ) {
										event.preventDefault();
										handleToggleRole( group.role );
									}
								}
								: undefined,
						},
						h(
							'div',
							{ className: 'hdc-work-role-proportion' },
							h( 'div', {
								className: 'hdc-work-role-proportion-fill',
								style: { width: proportionPercent + '%' },
							} )
						),
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
							'div',
							{ className: 'hdc-work-badge-row hdc-work-role-badges' },
							h(
								Badge,
								{ variant: 'secondary' },
								String( group.repos.length ),
								group.repos.length === 1 ? ' repository' : ' repositories'
							),
							latestRepo
								? h(
									Badge,
									{ variant: 'outline' },
									'Updated ',
									formatShortDateLabel( latestRepo.updatedAt )
								)
								: null
						),
						visibleRepos.length > 0
							? h(
								'div',
								{ className: 'hdc-work-role-preview' },
								h( 'p', { className: 'hdc-work-label' }, 'Recent examples' ),
								h(
									'div',
									{ className: 'hdc-work-badge-row' },
									visibleRepos.map( function ( repo ) {
										return h(
											'a',
											{
												key: group.role + '-' + repo.name,
												className: 'hdc-work-badge is-outline hdc-work-role-repo-link',
												href: getWorkDetailUrl( repo.name ),
												onClick: function ( event ) {
													event.stopPropagation();
												},
												onKeyDown: function ( event ) {
													event.stopPropagation();
												},
											},
											repo.name
										);
									} ).concat(
										! isExpanded && hiddenPreviewCount > 0
											? [
												h(
													Badge,
													{
														key: group.role + '-hidden-preview',
														variant: 'outline',
														className: 'hdc-work-role-toggle-badge',
													},
													'+',
													String( hiddenPreviewCount ),
													' more',
													h(
														'span',
														{
															className: 'hdc-work-role-badge-chevron',
															'aria-hidden': 'true',
														},
														renderLucideIcon( h, 'chevron-down', { size: 12 } )
													)
												),
											]
											: []
									).concat(
										isExpanded && canExpand
											? [
												h(
													Badge,
													{
														key: group.role + '-show-less',
														variant: 'outline',
														className: 'hdc-work-role-toggle-badge',
													},
													'Show less',
													h(
														'span',
														{
															className: 'hdc-work-role-badge-chevron',
															'aria-hidden': 'true',
														},
														renderLucideIcon( h, 'chevron-down', { size: 12 } )
													)
												),
											]
											: []
									)
								)
							)
							: null
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
				description: 'Recent shipped changes pulled from curated project metadata.',
			} ),
			h(
				'div',
				{ className: 'hdc-work-timeline-shell' },
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
			)
		);
	}

	function RepoCard( props ) {
		const repo = props.repo;
		const repoProof = props.repoProof || null;
		const ciStatusClassMap = {
			passing: 'is-ci-passing',
			failing: 'is-ci-failing',
			running: 'is-ci-running',
		};
		const communityHealthScore =
			repoProof &&
			repoProof.communityHealth &&
			typeof repoProof.communityHealth.healthPercentage === 'number'
				? repoProof.communityHealth.healthPercentage
				: null;
		const hasPublishedRelease =
			repoProof &&
			repoProof.releaseStatus === 'published' &&
			repoProof.latestRelease &&
			typeof repoProof.latestRelease.tagName === 'string';
		const visibleTopics = repo.topics.slice( 0, 3 );
		const hiddenTopicCount = Math.max( 0, repo.topics.length - visibleTopics.length );
		const ciStatusClass = props.ciStatus ? ciStatusClassMap[ props.ciStatus ] : '';
		const hasMetadataBadges =
			visibleTopics.length > 0 ||
			hiddenTopicCount > 0 ||
			typeof communityHealthScore === 'number' ||
			hasPublishedRelease ||
			!! repo.license ||
			!! ciStatusClass;

		return h(
			'article',
			{
				className: classNames( 'hdc-work-repo-card', 'hdc-reveal' ),
				style: { '--reveal-index': props.revealIndex || 0 },
			},
			h(
				'div',
				{ className: 'hdc-work-repo-head' },
				h(
					'div',
					{ className: 'hdc-work-repo-head-main' },
					h(
						'div',
						{ className: 'hdc-work-badge-row hdc-work-repo-origin-row' },
						h(
							'span',
							{ className: 'hdc-work-repo-origin-icon', 'aria-hidden': 'true' },
							renderLucideIcon(
								h,
								repo.origin === 'github' ? 'github' : 'folder-open',
								{ className: 'hdc-work-repo-origin-icon-svg', size: 14 }
							)
						),
						h( Badge, { variant: 'secondary' }, repo.language ),
						repo.featured ? h( Badge, { variant: 'default' }, 'Featured' ) : null,
						repo.access === 'private' ? h( Badge, { variant: 'secondary' }, 'Private' ) : null
					),
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
					)
				)
			),
			h( 'p', { className: 'hdc-work-repo-description' }, repo.description ),
			hasMetadataBadges
				? h(
					'div',
					{ className: 'hdc-work-badge-row', 'aria-label': 'Repository highlights' },
					visibleTopics
						.map( function ( topic ) {
							return h( Badge, { key: repo.name + '-topic-' + topic, variant: 'secondary' }, topic );
						} )
						.concat(
							hiddenTopicCount > 0
								? [ h( Badge, { key: repo.name + '-topic-hidden', variant: 'outline' }, '+' + hiddenTopicCount ) ]
								: []
						)
						.concat(
							typeof communityHealthScore === 'number'
								? [ h( Badge, { key: repo.name + '-community', variant: 'outline' }, 'Community ' + communityHealthScore + '%' ) ]
								: []
						)
						.concat(
							hasPublishedRelease
								? [ h( Badge, { key: repo.name + '-release', variant: 'outline' }, 'Release ' + repoProof.latestRelease.tagName ) ]
								: []
						)
						.concat(
							repo.license
								? [
									h(
										Badge,
										{
											key: repo.name + '-license',
											variant: 'outline',
										},
										h(
											'span',
											{ className: 'hdc-work-repo-meta-icon', 'aria-hidden': 'true' },
											renderLucideIcon( h, 'scale', { className: 'hdc-work-repo-meta-icon-svg', size: 12 } )
										),
										' ' + repo.license
									),
								]
								: []
						)
						.concat(
							ciStatusClass
								? [
									h(
										Badge,
										{
											key: repo.name + '-ci',
											variant: 'outline',
											className: ciStatusClass,
										},
										'CI ' + props.ciStatus
									),
								]
								: []
						)
				)
				: null,
			h(
				'div',
				{ className: 'hdc-work-repo-footer' },
				h(
					'div',
					{ className: 'hdc-work-repo-meta' },
					repo.origin === 'github'
						? [
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
							repo.openIssuesAndPullRequests > 0
								? h(
									'span',
									{ className: 'hdc-work-repo-meta-item' },
									h(
										'span',
										{ className: 'hdc-work-repo-meta-icon', 'aria-hidden': 'true' },
										renderLucideIcon( h, 'circle-dot', { className: 'hdc-work-repo-meta-icon-svg', size: 12 } )
									),
									h( 'span', null, String( repo.openIssuesAndPullRequests ) )
								)
								: null,
						]
						: [ h( 'span', { className: 'hdc-work-repo-meta-label' }, 'Case study' ) ],
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
				),
				h(
					'a',
					{
						className: 'hdc-work-repo-detail-link',
						href: getWorkDetailUrl( repo.name ),
					},
					'Details'
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
			h(
				'div',
				{ className: 'hdc-work-library-head' },
				h( 'h2', { className: 'hdc-work-section-title' }, 'Repository Library' ),
				h(
					'div',
					{ className: 'hdc-work-library-actions' },
					h(
						Badge,
						{ variant: 'secondary' },
						props.view === 'grid'
							? 'Showing ' + props.paginatedRepos.length + ' of ' + props.describedRepos.length + ' repositories'
							: props.timelineRepos.length + ' repositories'
					),
					props.view === 'grid' && props.totalPages > 1
						? h(
							Fragment,
							null,
							h(
								'span',
								{ className: 'hdc-work-pagination-label', 'aria-live': 'polite' },
								'Page ',
								String( props.safePage ),
								' of ',
								String( props.totalPages )
							),
							h(
								'div',
								{ className: 'hdc-work-pagination-controls' },
								h(
									'button',
									{
										type: 'button',
										className: 'hdc-work-button is-ghost',
										onClick: props.onPreviousPage,
										disabled: props.safePage <= 1,
										'aria-label': 'Previous page',
									},
									'Previous'
								),
								h(
									'button',
									{
										type: 'button',
										className: 'hdc-work-button is-ghost',
										onClick: props.onNextPage,
										disabled: props.safePage >= props.totalPages,
										'aria-label': 'Next page',
									},
									'Next'
								)
							)
						)
						: null
				)
			),
			props.view === 'grid'
				? h(
					Fragment,
					null,
					h(
						'div',
						{ className: 'hdc-work-repo-grid' },
						props.paginatedRepos.map( function ( repo, index ) {
							return h( RepoCard, {
								key: 'repo-' + repo.name,
								repo: repo,
								repoProof: props.repoProofsByRepoName[ repo.name ] || props.repoProofsByRepoName[ String( repo.name ).toLowerCase() ] || null,
								ciStatus: props.ciStatusByRepoName[ repo.name ] || props.ciStatusByRepoName[ String( repo.name ).toLowerCase() ] || null,
								openInNewTab: props.openInNewTab,
								revealIndex: index,
							} );
						} )
					)
				)
				: h(
					'div',
					{ className: 'hdc-work-timeline-shell' },
					h(
						'ul',
						{ className: 'hdc-work-timeline' },
						props.timelineRepos.map( function ( repo ) {
							const signalBadges = getSignalBadges( repo ).slice( 0, 3 );
							return h(
								'li',
								{ key: 'timeline-' + repo.name, className: 'hdc-work-timeline-item' },
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
								signalBadges.length > 0
									? h(
										'div',
										{ className: 'hdc-work-badge-row' },
										signalBadges.map( function ( signal ) {
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
									: null
							);
						} )
					)
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



	function WorkShowcaseApp( props ) {
		const config = props.config;
		const initialState = useMemo( function () {
			return readInitialWorkState();
		}, [] );
		const [ now, setNow ] = useState( function () {
			return Date.now();
		} );
		const [ loading, setLoading ] = useState( true );
		const [ error, setError ] = useState( '' );
		const [ repos, setRepos ] = useState( [] );
		const [ source, setSource ] = useState( 'fallback-error' );
		const [ detailsUnavailable, setDetailsUnavailable ] = useState( false );
		const [ repoProofsByRepoName, setRepoProofsByRepoName ] = useState( {} );
		const [ ciStatusByRepoName, setCIStatusByRepoName ] = useState( {} );
		const [ filter, setFilter ] = useState( initialState.filter );
		const [ sort, setSort ] = useState( initialState.sort );
		const [ view, setView ] = useState( initialState.view );
		const [ page, setPage ] = useState( initialState.page );
		const [ showPendingRepos, setShowPendingRepos ] = useState( false );

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
					languageSet.add( normalizeLanguage( repo.language ) );
				} );
				return [ DEFAULT_FILTER ].concat( Array.from( languageSet ) );
			},
			[ repos ]
		);

		const activeFilter = useMemo(
			function () {
				if ( filter === DEFAULT_FILTER ) {
					return DEFAULT_FILTER;
				}

				const resolved = languages.find( function ( language ) {
					return String( language ).toLowerCase() === String( filter ).toLowerCase();
				} );
				return resolved || DEFAULT_FILTER;
			},
			[ filter, languages ]
		);

		useEffect(
			function () {
				if ( activeFilter !== filter ) {
					setFilter( activeFilter );
				}
			},
			[ activeFilter, filter ]
		);

		const filtered = useMemo(
			function () {
				return repos
					.filter( function ( repo ) {
						return activeFilter === DEFAULT_FILTER || normalizeLanguage( repo.language ) === activeFilter;
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
		const isPendingPreviewVisible = activeFilter === filter ? showPendingRepos : false;

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
		const showFeaturedCaseStudies = view === 'grid' && activeFilter === DEFAULT_FILTER && featuredCaseStudies.length > 0;

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
		const showRoleGroups = view === 'grid' && activeFilter === DEFAULT_FILTER && reposByRole.length > 0;

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

		const timelineRepos = useMemo(
			function () {
				return describedRepos.slice().sort( compareReposByUpdatedAtDesc );
			},
			[ describedRepos ]
		);

		const visibleGitHubRepoNames = useMemo(
			function () {
				return ( view === 'grid' ? paginatedRepos : [] )
					.filter( function ( repo ) {
						return repo.origin === 'github' && repo.access !== 'private';
					} )
					.map( function ( repo ) {
						return repo.name;
					} );
			},
			[ paginatedRepos, view ]
		);

		const visibleGitHubRepoFingerprint = useMemo(
			function () {
				return concatTextParts(
					visibleGitHubRepoNames.slice().sort( function ( left, right ) {
						return left.localeCompare( right );
					} ),
					'|'
				);
			},
			[ visibleGitHubRepoNames ]
		);

		const activityBuckets = useMemo(
			function () {
				const bucketCount = config.sparklineWeeks;
				const bucketMs = 7 * 24 * 60 * 60 * 1000;
				const buckets = Array.from( { length: bucketCount }, function ( _unused, index ) {
					return {
						count: 0,
						label: getActivityBucketLabel( index, bucketCount ),
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

		useEffect(
			function () {
				if ( typeof window === 'undefined' || ! window.location ) {
					return;
				}

				const nextParams = buildWorkSearchParams( {
					filter: activeFilter,
					page: view === 'grid' ? safePage : 1,
					sort: sort,
					view: view,
				} );
				const nextSearch = nextParams.toString();
				const currentUrl = new URL( window.location.href );
				if ( currentUrl.search.replace( /^\?/, '' ) === nextSearch ) {
					return;
				}

				currentUrl.search = nextSearch;
				window.history.replaceState( window.history.state, '', currentUrl.toString() );
			},
			[ activeFilter, safePage, sort, view ]
		);

		useEffect(
			function () {
				let cancelled = false;

				if ( view !== 'grid' || ! visibleGitHubRepoFingerprint ) {
					setRepoProofsByRepoName( {} );
					return function () {
						cancelled = true;
					};
				}

				loadRepoProofs( config, visibleGitHubRepoNames ).then( function ( data ) {
					if ( cancelled ) {
						return;
					}

					setRepoProofsByRepoName( data.proofsByRepoName );
				} );

				return function () {
					cancelled = true;
				};
			},
			[ config, view, visibleGitHubRepoFingerprint, visibleGitHubRepoNames ]
		);

		useEffect(
			function () {
				let cancelled = false;

				if ( loading || view !== 'grid' || ! visibleGitHubRepoFingerprint ) {
					setCIStatusByRepoName( {} );
					return function () {
						cancelled = true;
					};
				}

				loadCIStatus( config, visibleGitHubRepoNames ).then( function ( data ) {
					if ( cancelled ) {
						return;
					}

					setCIStatusByRepoName( data.ciStatusByRepo );
				} );

				return function () {
					cancelled = true;
				};
			},
			[ config, loading, view, visibleGitHubRepoFingerprint, visibleGitHubRepoNames ]
		);

		useEffect(
			function () {
				if ( loading || error ) {
					return undefined;
				}

				const frameId = window.requestAnimationFrame( function () {
					initRevealObserver();
				} );

				return function () {
					window.cancelAnimationFrame( frameId );
				};
			},
			[ loading, error, page, view, activeFilter ]
		);

		function handleFilterChange( value ) {
			if (
				value === activeFilter ||
				! languages.some( function ( language ) {
					return String( language ).toLowerCase() === String( value ).toLowerCase();
				} )
			) {
				return;
			}

			setFilter( value );
			setPage( 1 );
			setShowPendingRepos( false );
		}

		function handleSortChange( value ) {
			const nextSort = parseWorkSort( value );
			if ( nextSort === sort ) {
				return;
			}

			setSort( nextSort );
			setPage( 1 );
			setShowPendingRepos( false );
		}

		function handleViewChange( value ) {
			const nextView = parseWorkView( value );
			if ( nextView === view ) {
				return;
			}

			setView( nextView );
			setPage( 1 );
			setShowPendingRepos( false );
		}

		return h(
			'div',
			{ className: 'hdc-work-app' },
			h(
				'section',
				{
					className: classNames( 'hdc-work-page-hero', 'ember-surface', 'hdc-reveal', 'is-soft' ),
					style: { '--reveal-index': 0 },
				},
				h(
					'div',
					{ className: 'app-container hdc-work-page-hero__inner' },
					h( 'p', { className: 'text-eyebrow hdc-work-page-hero__eyebrow' }, 'Portfolio' ),
					h( 'h1', { className: 'text-page-title hdc-work-page-hero__title' }, config.heading ),
					h(
						'p',
						{ className: 'text-page-lede hdc-work-page-hero__description' },
						config.description
					),
					h(
						'div',
						{ className: 'hdc-work-page-hero__meta' },
						h(
							'p',
							{ className: 'hdc-work-source-label', 'aria-live': 'polite' },
							loading ? 'Syncing from GitHub…' : sourceLabel
						),
						! loading && sourceWarning
							? h( 'p', { className: 'hdc-work-source-warning' }, sourceWarning )
							: null
					)
				)
			),
			h(
				'div',
				{ className: 'app-container hdc-work-page-body' },
				loading ? h( LoadingSkeleton ) : null,
				! loading && error ? h( 'p', { className: 'hdc-work-status is-error' }, error ) : null,
				! loading && ! error
					? h(
						Fragment,
						null,
						h( FiltersBar, {
							languages: languages,
							onFilterChange: handleFilterChange,
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
								description: 'No repositories matched that language filter.',
								action: h(
									'button',
									{
										type: 'button',
										className: 'hdc-work-button is-link',
										onClick: function () {
											handleFilterChange( DEFAULT_FILTER );
										},
									},
									'View all projects'
								),
							} )
							: h(
								Fragment,
								null,
								showFeaturedCaseStudies
									? h( FeaturedCaseStudies, {
										repos: featuredCaseStudies,
										openInNewTab: config.openInNewTab,
									} )
									: null,
								showRoleGroups
									? h( RoleGroups, { groups: reposByRole, roleDescriptionMap: ROLE_DESCRIPTION_MAP } )
									: null,
								view === 'timeline' ? h( BuildTimeline, { repos: shippedTimeline } ) : null,
								h( RepositoryLibrary, {
									ciStatusByRepoName: ciStatusByRepoName,
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
									paginatedRepos: paginatedRepos,
									repoProofsByRepoName: repoProofsByRepoName,
									safePage: safePage,
									timelineRepos: timelineRepos,
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
									: null
							)
					)
					: null
			)
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
