( function ( wp ) {
	if ( ! wp || ! wp.element ) {
		return;
	}

	const element = wp.element;
	const h = element.createElement;
	const useEffect = element.useEffect;
	const useMemo = element.useMemo;
	const useState = element.useState;
	const createRoot = element.createRoot;
	const legacyRender = element.render;
	const utils = window.hdcSharedUtils || {};
	const renderLucideIcon =
		typeof utils.renderLucideIcon === 'function'
			? utils.renderLucideIcon
			: function () {
				return null;
			};

	const RATE_LIMIT_COOLDOWN_FALLBACK_MS = 60000;
	const repoProofRateLimitCooldownByQueryKey = new Map();

	function classNames() {
		return Array.prototype.slice
			.call( arguments )
			.filter( Boolean )
			.join( ' ' );
	}

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

	function ensureStringArray( value ) {
		return ensureArray( value )
			.map( function ( item ) {
				return ensureString( item, '' );
			} )
			.filter( Boolean );
	}

	function parseConfig( section ) {
		let parsed = {};
		try {
			parsed = JSON.parse( section.getAttribute( 'data-config' ) || '{}' );
		} catch ( error ) {
			parsed = {};
		}

		return {
			repo: ensureString( parsed.repo, '' ),
			showBackLink: !! parsed.showBackLink,
			showWhenMissingRepo: !! parsed.showWhenMissingRepo,
			endpointBase: ensureString( parsed.endpointBase, '' ),
			workEndpoint: ensureString( parsed.workEndpoint, '' ),
			workIndexUrl: ensureString( parsed.workIndexUrl, '/work/' ),
			contactUrl: ensureString( parsed.contactUrl, '/contact/' ),
			repoProofsEndpoint: ensureString( parsed.repoProofsEndpoint, '' ),
		};
	}

	function sanitizeRepoSlug( value ) {
		return String( value || '' )
			.trim()
			.replace( /[^A-Za-z0-9._-]/g, '' );
	}

	function normalizeRepoKey( value ) {
		return sanitizeRepoSlug( value ).toLowerCase();
	}

	function inferRepoSlug( explicit ) {
		const explicitSlug = sanitizeRepoSlug( explicit );
		if ( explicitSlug ) {
			return explicitSlug;
		}

		const search = new URLSearchParams( window.location.search );
		const fromQuery = sanitizeRepoSlug( search.get( 'repo' ) || '' );
		if ( fromQuery ) {
			return fromQuery;
		}

		const bodyClassMatch = document.body.className.match( /\bhdc-work-repo-([A-Za-z0-9._-]+)\b/ );
		if ( bodyClassMatch && bodyClassMatch[ 1 ] ) {
			return sanitizeRepoSlug( bodyClassMatch[ 1 ] );
		}

		const path = String( window.location.pathname || '' ).replace( /\/+$/, '' );
		const segments = path.split( '/' ).filter( Boolean );
		const workIndex = segments.indexOf( 'work' );
		if ( workIndex !== -1 && segments[ workIndex + 1 ] ) {
			return sanitizeRepoSlug( decodeURIComponent( segments[ workIndex + 1 ] ) );
		}

		return '';
	}

	function normalizeSource( value ) {
		const normalized = ensureString( value, '' ).toLowerCase();
		switch ( normalized ) {
			case 'live':
			case 'fallback-error':
			case 'fallback-offline':
			case 'fallback-ratelimit':
			case 'local-json':
			case 'cached-snapshot':
			case 'detail':
				return normalized;
			default:
				return 'unknown';
		}
	}

	function parseDateValue( value ) {
		let normalized = String( value || '' );
		if ( /^\d{4}-\d{2}-\d{2}$/.test( normalized ) ) {
			normalized += 'T12:00:00';
		}

		const parsed = new Date( normalized );
		return Number.isNaN( parsed.getTime() ) ? new Date( 0 ) : parsed;
	}

	function formatDateLabel( value ) {
		const date = parseDateValue( value );
		if ( date.getTime() <= 0 ) {
			return ensureString( value, '' );
		}

		return date.toLocaleDateString( undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		} );
	}

	function parseRepositoryUrl( repoUrl ) {
		if ( ! repoUrl ) {
			return undefined;
		}

		try {
			return new URL( repoUrl );
		} catch ( error ) {
			return undefined;
		}
	}

	function isGitHubHost( hostname ) {
		const normalizedHostname = String( hostname || '' ).toLowerCase();
		return normalizedHostname === 'github.com' || normalizedHostname === 'www.github.com';
	}

	function isGitHubRepositoryUrl( repoUrl ) {
		const parsedUrl = parseRepositoryUrl( repoUrl );
		return !! parsedUrl && isGitHubHost( parsedUrl.hostname );
	}

	function parseGitHubRepositoryCoordinates( repoUrl ) {
		const parsedUrl = parseRepositoryUrl( repoUrl );
		if ( ! parsedUrl || ! isGitHubHost( parsedUrl.hostname ) ) {
			return null;
		}

		const segments = parsedUrl.pathname.split( '/' ).filter( Boolean );
		if ( segments.length < 2 ) {
			return null;
		}

		const owner = segments[ 0 ];
		const repo = segments[ 1 ].replace( /\.git$/i, '' );
		if ( ! owner || ! repo ) {
			return null;
		}

		return {
			owner: owner,
			repo: repo,
		};
	}

	function getKeyFileUrl( repoUrl, keyFilePath, explicitUrl, defaultBranch ) {
		if ( explicitUrl ) {
			return explicitUrl;
		}

		const parsedUrl = parseRepositoryUrl( repoUrl );
		if ( ! parsedUrl || ! isGitHubHost( parsedUrl.hostname ) ) {
			return '';
		}

		const normalizedRepoBase = parsedUrl.origin + parsedUrl.pathname.replace( /\/$/, '' );
		const encodedPath = String( keyFilePath )
			.split( '/' )
			.map( function ( segment ) {
				return encodeURIComponent( segment );
			} )
			.join( '/' );

		return normalizedRepoBase + '/blob/' + ensureString( defaultBranch, 'main' ) + '/' + encodedPath;
	}

	function fetchJson( url ) {
		if ( ! url ) {
			throw new Error( 'Missing URL' );
		}

		return fetch( url, {
			headers: {
				Accept: 'application/json',
			},
		} ).then( async function ( response ) {
			let payload = null;
			try {
				payload = await response.json();
			} catch ( parseError ) {
				payload = null;
			}

			if ( ! response.ok ) {
				const error = new Error( payload && payload.message ? payload.message : 'Request failed with status ' + response.status );
				error.status = response.status;
				error.payload = payload;
				error.headers = response.headers;
				throw error;
			}

			return payload;
		} );
	}

	function resolveWorkPayload( payload ) {
		if ( payload && typeof payload === 'object' && Array.isArray( payload.repos ) ) {
			return {
				source: normalizeSource( payload.source ),
				repos: payload.repos,
			};
		}

		if ( Array.isArray( payload ) ) {
			return {
				source: 'unknown',
				repos: payload,
			};
		}

		return {
			source: 'unknown',
			repos: [],
		};
	}

	function normalizeRepository( repo ) {
		if ( ! repo || typeof repo !== 'object' ) {
			return null;
		}

		return {
			name: ensureString( repo.name, 'Unknown project' ),
			description: ensureString( repo.description, 'No description provided.' ),
			language: ensureString( repo.language, 'Unknown' ),
			stars: Number.isFinite( Number( repo.stars ) ) ? Number( repo.stars ) : 0,
			forks: Number.isFinite( Number( repo.forks ) ) ? Number( repo.forks ) : 0,
			updatedAt: ensureString( repo.updatedAt, '' ),
			url: ensureString( repo.url, '' ),
			demoUrl: ensureString( repo.demoUrl, '' ),
			defaultBranch: ensureString( repo.defaultBranch, 'main' ),
			topics: ensureStringArray( repo.topics ),
			origin: ensureString( repo.origin, 'curated' ),
			access: ensureString( repo.access, 'public' ),
			role: ensureString( repo.role, '' ),
			whyItMatters: ensureString( repo.whyItMatters, '' ),
			problem: ensureStringArray( repo.problem ),
			approach: ensureStringArray( repo.approach ),
			result: ensureStringArray( repo.result ),
			highlights: ensureStringArray( repo.highlights ),
			receipts: ensureArray( repo.receipts )
				.filter( function ( item ) {
					return item && typeof item === 'object';
				} )
				.map( function ( item ) {
					return {
						label: ensureString( item.label, '' ),
						value: ensureString( item.value, '' ),
						url: ensureString( item.url, '' ),
					};
				} )
				.filter( function ( item ) {
					return item.label || item.value;
				} ),
			architecture:
				repo.architecture && typeof repo.architecture === 'object'
					? {
						summary: ensureString( repo.architecture.summary, '' ),
						bullets: ensureStringArray( repo.architecture.bullets ),
						diagramUrl: ensureString( repo.architecture.diagramUrl, '' ),
					}
					: null,
			keyFiles: ensureArray( repo.keyFiles )
				.filter( function ( item ) {
					return item && typeof item === 'object';
				} )
				.map( function ( item ) {
					return {
						path: ensureString( item.path, '' ),
						note: ensureString( item.note, '' ),
						url: ensureString( item.url, '' ),
					};
				} )
				.filter( function ( item ) {
					return item.path || item.note;
				} ),
			shipped: ensureString( repo.shipped, '' ),
			accessNote: ensureString( repo.accessNote, '' ),
			learned: ensureString( repo.learned, '' ),
		};
	}

	function classifyFetchError( error ) {
		const status = error && error.status;
		if ( status === 404 ) {
			return 'not-found';
		}
		if ( status === 429 ) {
			return 'rate-limit';
		}
		if ( status >= 500 ) {
			return 'server-error';
		}
		if ( error && error.message && /fetch|network|offline|load failed|timeout/i.test( error.message ) ) {
			return 'offline';
		}
		return 'error';
	}

	function sourceFromError( error ) {
		const classification = classifyFetchError( error );
		if ( classification === 'rate-limit' ) {
			return 'fallback-ratelimit';
		}
		if ( classification === 'offline' ) {
			return 'fallback-offline';
		}
		if ( classification === 'not-found' ) {
			return 'live';
		}
		return 'fallback-error';
	}

	function getMissingProjectState( source ) {
		if ( source === 'fallback-offline' ) {
			return {
				title: 'Project temporarily unavailable',
				description: 'You are offline, so this project cannot be loaded right now. Reconnect and try again.',
			};
		}

		if ( source === 'fallback-ratelimit' ) {
			return {
				title: 'Project temporarily unavailable',
				description: 'GitHub API rate limit reached. This project is temporarily unavailable from the cached snapshot.',
			};
		}

		if ( source === 'fallback-error' ) {
			return {
				title: 'Project temporarily unavailable',
				description: 'Live GitHub sync is unavailable right now. This project could not be loaded from the cached snapshot.',
			};
		}

		if ( source === 'live' || source === 'local-json' || source === 'cached-snapshot' || source === 'detail' ) {
			return {
				title: 'Project not found',
				description: 'The project you are looking for could not be found. It may be private, or the link might be broken.',
			};
		}

		return {
			title: 'Project temporarily unavailable',
			description: 'The project could not be loaded right now. Please try again later.',
		};
	}

	function getRepoSourceLabel( source ) {
		return source === 'live' ? 'Synced directly from GitHub' : 'Cached project snapshot';
	}

	function getSourceWarning( source ) {
		if ( source === 'fallback-ratelimit' ) {
			return 'GitHub rate limit reached. Showing cached project snapshot.';
		}
		if ( source === 'fallback-error' ) {
			return 'Live GitHub sync is unavailable right now. Showing cached project snapshot.';
		}
		if ( source === 'fallback-offline' ) {
			return 'You are offline, so live GitHub sync is unavailable. Showing cached project snapshot.';
		}
		return null;
	}

	function parsePayloadMessage( payload ) {
		if ( payload && typeof payload === 'object' ) {
			if ( typeof payload.message === 'string' && payload.message.trim() ) {
				return payload.message.trim();
			}
			if ( typeof payload.error === 'string' && payload.error.trim() ) {
				return payload.error.trim();
			}
		}

		return '';
	}

	function createProxyError( message, response, payload ) {
		const error = new Error( message );
		error.status = response ? response.status : 0;
		error.payload = payload;
		error.headers = response ? response.headers : null;
		return error;
	}

	function isRateLimitError( error ) {
		return !! error && Number( error.status ) === 429;
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

	function getRateLimitRetryAfterMs( error, fallbackMs ) {
		if ( ! error || ! error.headers || typeof error.headers.get !== 'function' ) {
			return fallbackMs;
		}

		const retryAfterHeader = error.headers.get( 'retry-after' );
		if ( retryAfterHeader ) {
			const retryAfterSeconds = Number.parseFloat( retryAfterHeader );
			if ( Number.isFinite( retryAfterSeconds ) && retryAfterSeconds > 0 ) {
				return retryAfterSeconds * 1000;
			}
		}

		const resetHeader = error.headers.get( 'x-ratelimit-reset' );
		if ( resetHeader ) {
			const resetEpochSeconds = Number.parseFloat( resetHeader );
			if ( Number.isFinite( resetEpochSeconds ) && resetEpochSeconds > 0 ) {
				return Math.max( 0, resetEpochSeconds * 1000 - Date.now() );
			}
		}

		return fallbackMs;
	}

	function getRemainingRateLimitCooldownMs( queryKey ) {
		const cooldownUntil = repoProofRateLimitCooldownByQueryKey.get( queryKey ) || 0;
		return Math.max( 0, cooldownUntil - Date.now() );
	}

	function setRateLimitCooldown( queryKey, error ) {
		const retryAfterMs = getRateLimitRetryAfterMs( error, RATE_LIMIT_COOLDOWN_FALLBACK_MS );
		const previousCooldownUntil = repoProofRateLimitCooldownByQueryKey.get( queryKey ) || 0;
		const nextCooldownUntil = Date.now() + retryAfterMs;
		repoProofRateLimitCooldownByQueryKey.set( queryKey, Math.max( previousCooldownUntil, nextCooldownUntil ) );
	}

	function resolveRequestUrl( url ) {
		try {
			return new URL( url, window.location.origin ).toString();
		} catch ( error ) {
			return '';
		}
	}

	function isRepoProofArray( value ) {
		return Array.isArray( value ) && value.every( function ( proof ) {
			return proof && typeof proof === 'object' && typeof proof.repo === 'string';
		} );
	}

	function buildRepoProofMap( proofs ) {
		const map = {};
		proofs.forEach( function ( proof ) {
			const repoName = ensureString( proof.repo, '' );
			if ( ! repoName ) {
				return;
			}

			map[ repoName ] = proof;
			map[ repoName.toLowerCase() ] = proof;
		} );
		return map;
	}

	async function fetchGitHubRepoProofsFromProxy( config, repoName, username ) {
		const requestUrl = new URL( resolveRequestUrl( config.repoProofsEndpoint ) );
		requestUrl.searchParams.set( 'username', username );
		requestUrl.searchParams.append( 'repo', repoName );

		const response = await fetch( requestUrl.toString(), {
			headers: {
				Accept: 'application/json',
			},
		} );

		let payload = null;
		try {
			payload = await response.json();
		} catch ( error ) {
			throw createProxyError( 'GitHub repo proofs proxy returned invalid JSON', response, null );
		}

		if ( ! response.ok ) {
			const message = parsePayloadMessage( payload ) || 'GitHub repo proofs request failed';
			throw createProxyError( message + ' (status ' + response.status + ')', response, payload );
		}

		if (
			! payload ||
			typeof payload !== 'object' ||
			typeof payload.repoCount !== 'number' ||
			typeof payload.failedRepoCount !== 'number' ||
			typeof payload.partialData !== 'boolean' ||
			! isRepoProofArray( payload.proofs )
		) {
			throw createProxyError( 'GitHub repo proofs response had an unexpected shape', response, payload );
		}

		return payload;
	}

	async function loadRepoProof( config, owner, repoName ) {
		const normalizedRepoName = ensureString( repoName, '' );
		if ( ! normalizedRepoName || ! config.repoProofsEndpoint ) {
			return {
				proof: null,
				source: 'live',
			};
		}

		const username = ensureString( owner, 'henryperkins' );
		const cooldownQueryKey = 'github-repo-proofs:' + username + ':' + normalizedRepoName.toLowerCase();
		if ( getRemainingRateLimitCooldownMs( cooldownQueryKey ) > 0 ) {
			return {
				proof: null,
				source: 'fallback-ratelimit',
			};
		}

		try {
			const payload = await fetchGitHubRepoProofsFromProxy( config, normalizedRepoName, username );
			const proofsByRepoName = buildRepoProofMap( payload.proofs );
			return {
				proof: proofsByRepoName[ normalizedRepoName ] || proofsByRepoName[ normalizedRepoName.toLowerCase() ] || null,
				source: 'live',
			};
		} catch ( error ) {
			if ( isRateLimitError( error ) ) {
				setRateLimitCooldown( cooldownQueryKey, error );
				return {
					proof: null,
					source: 'fallback-ratelimit',
				};
			}
			if ( isOfflineError( error ) ) {
				return {
					proof: null,
					source: 'fallback-offline',
				};
			}
			return {
				proof: null,
				source: 'fallback-error',
			};
		}
	}

	function getRepoProofWarning( source ) {
		if ( source === 'fallback-ratelimit' ) {
			return 'GitHub proof signals are temporarily unavailable due to rate limiting.';
		}
		if ( source === 'fallback-offline' ) {
			return 'You are offline, so live GitHub proof signals are unavailable.';
		}
		if ( source === 'fallback-error' ) {
			return 'Live GitHub proof signals are temporarily unavailable.';
		}
		return null;
	}

	function buildCommunityChecklist( proof ) {
		if ( ! proof || ! proof.communityHealth || ! proof.communityHealth.files ) {
			return [];
		}

		const files = proof.communityHealth.files;
		return [
			files.hasReadme ? 'README' : null,
			files.hasLicense ? 'License' : null,
			files.hasContributing ? 'Contributing guide' : null,
			files.hasCodeOfConduct ? 'Code of conduct' : null,
			files.hasIssueTemplate ? 'Issue template' : null,
			files.hasPullRequestTemplate ? 'PR template' : null,
		].filter( Boolean );
	}

	function LoadingState() {
		return h(
			'div',
			{ className: 'hdc-work-detail__loading' },
			h( 'p', { className: 'hdc-work-detail__status' }, 'Loading project details...' ),
			h( 'div', { className: 'hdc-work-detail__skeleton hdc-work-detail__skeleton--source', 'aria-hidden': 'true' } ),
			h( 'div', { className: 'hdc-work-detail__skeleton hdc-work-detail__skeleton--title', 'aria-hidden': 'true' } ),
			h( 'div', { className: 'hdc-work-detail__skeleton hdc-work-detail__skeleton--line', 'aria-hidden': 'true' } ),
			h( 'div', { className: 'hdc-work-detail__skeleton hdc-work-detail__skeleton--line', 'aria-hidden': 'true' } ),
			h( 'div', { className: 'hdc-work-detail__skeleton hdc-work-detail__skeleton--panel', 'aria-hidden': 'true' } )
		);
	}

	function DetailSectionCard( props ) {
		return h(
			'div',
			{ className: classNames( 'hdc-work-detail__panel', props.className ) },
			h( 'h2', { className: 'hdc-work-detail__section-title' }, props.title ),
			props.description ? h( 'p', { className: 'hdc-work-detail__section-desc' }, props.description ) : null,
			props.children
		);
	}

	function SectionJumpNav( props ) {
		if ( ! props.items.length ) {
			return null;
		}

		return h(
			'section',
			{ className: 'hdc-work-detail__jump-nav' },
			h(
				'div',
				{ className: 'hdc-work-detail__panel' },
				h( 'p', { className: 'hdc-work-detail__card-label' }, 'Jump to sections' ),
				props.description ? h( 'p', { className: 'hdc-work-detail__text' }, props.description ) : null,
				h(
					'nav',
					{ className: 'hdc-work-detail__jump-nav-nav', 'aria-label': 'Jump to sections' },
					h(
						'ul',
						{ className: 'hdc-work-detail__jump-nav-list' },
						props.items.map( function ( item ) {
							return h(
								'li',
								{ key: item.href, className: 'hdc-work-detail__jump-nav-item' },
								h(
									'a',
									{ className: 'hdc-work-detail__jump-nav-link', href: item.href },
									item.label
								)
							);
						} )
					)
				)
			)
		);
	}

	function WorkDetailApp( props ) {
		const config = props.config;
		const signature = useMemo( function () {
			return JSON.stringify( config );
		}, [ config ] );
		const [ repoSlug, setRepoSlug ] = useState( inferRepoSlug( config.repo ) );
		const [ state, setState ] = useState( {
			loading: true,
			data: null,
			source: 'unknown',
			detailsUnavailable: false,
		} );
		const [ repoProofState, setRepoProofState ] = useState( {
			isLoading: false,
			proof: null,
			source: 'live',
		} );

		useEffect(
			function () {
				setRepoSlug( inferRepoSlug( config.repo ) );
			},
			[ signature ]
		);

		useEffect(
			function () {
				document.title =
					state.data && state.data.name ? state.data.name + ' — Henry Perkins' : 'Project — Henry Perkins';
			},
			[ state.data ]
		);

		useEffect(
			function () {
				if ( ! repoSlug ) {
					setState( {
						loading: false,
						data: null,
						source: 'live',
						detailsUnavailable: false,
					} );
					return;
				}

				let cancelled = false;

				async function load() {
					setState( {
						loading: true,
						data: null,
						source: 'unknown',
						detailsUnavailable: false,
					} );

					let listSource = 'unknown';
					let listedRepos = [];
					let listFetchError = null;
					let detailFetchError = null;

					try {
						const listPayload = await fetchJson( config.workEndpoint );
						const resolvedList = resolveWorkPayload( listPayload );
						listSource = resolvedList.source;
						listedRepos = ensureArray( resolvedList.repos )
							.map( normalizeRepository )
							.filter( Boolean );
					} catch ( error ) {
						listFetchError = error;
						listSource = sourceFromError( error );
					}

					let normalized =
						listedRepos.find( function ( repo ) {
							return normalizeRepoKey( repo.name ) === normalizeRepoKey( repoSlug );
						} ) || null;
					let detailsUnavailable = false;
					let detailSource = 'unknown';

					try {
						const detailPayload = await fetchJson( config.endpointBase + encodeURIComponent( repoSlug ) );
						const detailed = normalizeRepository( detailPayload );
						if ( detailed ) {
							normalized = detailed;
							detailSource = normalizeSource( detailPayload.source );
							if ( detailSource === 'unknown' ) {
								detailSource = 'local-json';
							}
						} else if ( normalized ) {
							detailsUnavailable = true;
						}
					} catch ( error ) {
						detailFetchError = error;
						if ( normalized ) {
							detailsUnavailable = true;
						}
					}

					const effectiveSource =
						detailSource !== 'unknown'
							? detailSource
							: listSource !== 'unknown'
								? listSource
								: detailFetchError
									? sourceFromError( detailFetchError )
									: listFetchError
										? sourceFromError( listFetchError )
										: 'unknown';

					if ( cancelled ) {
						return;
					}

					setState( {
						loading: false,
						data: normalized,
						source: effectiveSource,
						detailsUnavailable: detailsUnavailable,
					} );
				}

				load();

				return function () {
					cancelled = true;
				};
			},
			[ repoSlug, signature ]
		);

		const data = state.data;
		const repoCoordinates = useMemo(
			function () {
				return data ? parseGitHubRepositoryCoordinates( data.url ) : null;
			},
			[ data ]
		);
		const shouldShowRepoProofSignals = !! (
			data &&
			data.origin === 'github' &&
			repoCoordinates &&
			repoCoordinates.repo &&
			isGitHubRepositoryUrl( data.url )
		);

		useEffect(
			function () {
				let cancelled = false;

				if ( ! shouldShowRepoProofSignals ) {
					setRepoProofState( {
						isLoading: false,
						proof: null,
						source: 'live',
					} );
					return function () {
						cancelled = true;
					};
				}

				setRepoProofState( {
					isLoading: true,
					proof: null,
					source: 'loading',
				} );

				loadRepoProof( config, repoCoordinates.owner, repoCoordinates.repo ).then( function ( result ) {
					if ( cancelled ) {
						return;
					}

					setRepoProofState( {
						isLoading: false,
						proof: result.proof,
						source: result.source,
					} );
				} );

				return function () {
					cancelled = true;
				};
			},
			[
				signature,
				shouldShowRepoProofSignals,
				repoCoordinates ? repoCoordinates.owner : '',
				repoCoordinates ? repoCoordinates.repo : '',
			]
		);

		if ( state.loading ) {
			return h( LoadingState );
		}

		if ( ! repoSlug && ! config.showWhenMissingRepo ) {
			return null;
		}

		if ( ! data ) {
			const missingProjectState = getMissingProjectState( state.source );
			return h(
				'div',
				{ className: 'hdc-work-detail__error-wrap' },
				h( 'h2', { className: 'hdc-work-detail__error-title' }, missingProjectState.title ),
				h( 'p', { className: 'hdc-work-detail__error' }, missingProjectState.description ),
				h(
					'a',
					{ className: 'hdc-work-detail__button hdc-work-detail__button--outline', href: config.workIndexUrl },
					h(
						'span',
						{ className: 'hdc-work-detail__button-icon', 'aria-hidden': 'true' },
						renderLucideIcon( h, 'arrow-left', { className: 'hdc-work-detail__button-icon-svg', size: 16 } )
					),
					h( 'span', null, 'Back to Work' )
				)
			);
		}

		const repoSourceLabel = getRepoSourceLabel( state.source );
		const sourceWarning = getSourceWarning( state.source );
		const detailLabel =
			data.origin === 'github'
				? 'Public GitHub repository / ' + repoSourceLabel
				: data.access === 'private'
					? 'Curated case study (code not public)'
					: 'Curated project';
		const hasCaseStudyBreakdown = !! ( data.problem.length || data.approach.length || data.result.length );
		const architectureAvailable = !! (
			data.architecture &&
			( data.architecture.summary || data.architecture.bullets.length || data.architecture.diagramUrl )
		);
		const repoProof = repoProofState.proof;
		const repoProofWarning = getRepoProofWarning( repoProofState.source );
		const communityChecklist = buildCommunityChecklist( repoProof );
		const releaseDateLabel =
			repoProof && repoProof.latestRelease && repoProof.latestRelease.publishedAt
				? formatDateLabel( repoProof.latestRelease.publishedAt )
				: '';
		const sectionLinks = [
			data.whyItMatters ? { href: '#project-why-it-matters', label: 'Why It Matters' } : null,
			shouldShowRepoProofSignals ? { href: '#project-proof-signals', label: 'Proof Signals' } : null,
			hasCaseStudyBreakdown ? { href: '#project-case-study-breakdown', label: 'Breakdown' } : null,
			data.highlights.length ? { href: '#project-highlights', label: 'Highlights' } : null,
			data.receipts.length ? { href: '#project-receipts', label: 'Receipts' } : null,
			architectureAvailable ? { href: '#project-architecture', label: 'Architecture' } : null,
			data.keyFiles.length ? { href: '#project-code-tour', label: 'Code Tour' } : null,
			data.shipped ? { href: '#project-latest-shipped-change', label: 'Shipped Change' } : null,
			data.accessNote ? { href: '#project-availability', label: 'Availability' } : null,
			data.learned ? { href: '#project-what-i-learned', label: 'What I Learned' } : null,
		].filter( Boolean );

		return h(
			'article',
			{ className: 'hdc-work-detail__article' },
			config.showBackLink
				? h(
					'a',
					{ className: 'hdc-work-detail__back-link', href: config.workIndexUrl },
					h(
						'span',
						{ className: 'hdc-work-detail__back-link-icon', 'aria-hidden': 'true' },
						renderLucideIcon( h, 'arrow-left', { className: 'hdc-work-detail__back-link-icon-svg', size: 14 } )
					),
					h( 'span', null, 'Back to Work' )
				)
				: null,
			h( 'p', { className: 'hdc-work-detail__source-label' }, detailLabel ),
			sourceWarning ? h( 'p', { className: 'hdc-work-detail__source-warning' }, sourceWarning ) : null,
			state.detailsUnavailable
				? h(
					'p',
					{ className: 'hdc-work-detail__hint' },
					'Case-study details are temporarily unavailable. Showing standard repository data.'
				)
				: null,
			h(
				'div',
				{ className: 'hdc-work-detail__badges' },
				h( 'span', { className: 'hdc-work-detail__badge hdc-work-detail__badge--lang' }, data.language ),
				data.role
					? h( 'span', { className: 'hdc-work-detail__badge hdc-work-detail__badge--role' }, data.role )
					: null,
				data.access === 'private' ? h( 'span', { className: 'hdc-work-detail__badge' }, 'Private' ) : null,
				data.origin === 'github'
					? h(
						'span',
						{ className: 'hdc-work-detail__small-meta hdc-work-detail__small-meta--icon' },
						h(
							'span',
							{ className: 'hdc-work-detail__small-meta-icon', 'aria-hidden': 'true' },
							renderLucideIcon( h, 'star', { className: 'hdc-work-detail__small-meta-icon-svg', size: 12 } )
						),
						h( 'span', null, String( data.stars ) )
					)
					: null,
				data.origin === 'github'
					? h(
						'span',
						{ className: 'hdc-work-detail__small-meta hdc-work-detail__small-meta--icon' },
						h(
							'span',
							{ className: 'hdc-work-detail__small-meta-icon', 'aria-hidden': 'true' },
							renderLucideIcon( h, 'git-fork', { className: 'hdc-work-detail__small-meta-icon-svg', size: 12 } )
						),
						h( 'span', null, String( data.forks ) )
					)
					: null,
				h(
					'span',
					{ className: 'hdc-work-detail__small-meta hdc-work-detail__small-meta--icon' },
					h(
						'span',
						{ className: 'hdc-work-detail__small-meta-icon', 'aria-hidden': 'true' },
						renderLucideIcon( h, 'clock', { className: 'hdc-work-detail__small-meta-icon-svg', size: 12 } )
					),
					h( 'time', { dateTime: data.updatedAt }, formatDateLabel( data.updatedAt ) )
				)
			),
			h( 'h1', { className: 'hdc-work-detail__title' }, data.name ),
			h( 'p', { className: 'hdc-work-detail__description' }, data.description ),
			data.topics.length
				? h(
					'div',
					{ className: 'hdc-work-detail__chips' },
					data.topics.map( function ( topic ) {
						return h( 'span', { key: data.name + '-topic-' + topic, className: 'hdc-work-detail__chip' }, topic );
					} )
				)
				: null,
			h(
				'div',
				{ className: 'hdc-work-detail__actions' },
				data.url
					? h(
						'a',
						{
							className: 'hdc-work-detail__button hdc-work-detail__button--primary',
							href: data.url,
							target: '_blank',
							rel: 'noopener noreferrer',
						},
						h(
							'span',
							{ className: 'hdc-work-detail__button-icon', 'aria-hidden': 'true' },
							isGitHubRepositoryUrl( data.url )
								? renderLucideIcon( h, 'github', { className: 'hdc-work-detail__button-icon-svg', size: 16 } )
								: renderLucideIcon( h, 'external-link', { className: 'hdc-work-detail__button-icon-svg', size: 16 } )
						),
						h( 'span', null, isGitHubRepositoryUrl( data.url ) ? 'View on GitHub' : 'View project' )
					)
					: h(
						'a',
						{
							className: 'hdc-work-detail__button hdc-work-detail__button--primary',
							href: config.contactUrl,
						},
						h(
							'span',
							{ className: 'hdc-work-detail__button-icon', 'aria-hidden': 'true' },
							renderLucideIcon( h, 'external-link', { className: 'hdc-work-detail__button-icon-svg', size: 16 } )
						),
						h( 'span', null, 'Request a walkthrough' )
					),
				data.demoUrl
					? h(
						'a',
						{
							className: 'hdc-work-detail__button hdc-work-detail__button--outline',
							href: data.demoUrl,
							target: '_blank',
							rel: 'noopener noreferrer',
						},
						h(
							'span',
							{ className: 'hdc-work-detail__button-icon', 'aria-hidden': 'true' },
							renderLucideIcon( h, 'external-link', { className: 'hdc-work-detail__button-icon-svg', size: 16 } )
						),
						h( 'span', null, 'Live Demo' )
					)
					: null
			),
			h( SectionJumpNav, {
				items: sectionLinks,
				description: 'Skip directly to the sections that answer how the project works, what shipped, and what changed.',
			} ),
			shouldShowRepoProofSignals
				? h(
					'section',
					{ id: 'project-proof-signals', className: 'hdc-work-detail__section' },
					h(
						DetailSectionCard,
						{
							title: 'Repository Proof Signals',
							description: 'Live GitHub indicators for release cadence and community-readiness artifacts.',
						},
						repoProofState.isLoading
							? h(
								'div',
								{ className: 'hdc-work-detail__proof-loading' },
								h( 'div', { className: 'hdc-work-detail__skeleton hdc-work-detail__skeleton--line', 'aria-hidden': 'true' } ),
								h( 'div', { className: 'hdc-work-detail__skeleton hdc-work-detail__skeleton--line', 'aria-hidden': 'true' } )
							)
							: repoProof
								? h(
									'div',
									{ className: 'hdc-work-detail__proof-body' },
									h(
										'div',
										{ className: 'hdc-work-detail__proof-badges' },
										typeof repoProof.communityHealth === 'object' &&
										typeof repoProof.communityHealth.healthPercentage === 'number'
											? h(
												'span',
												{ className: 'hdc-work-detail__badge hdc-work-detail__badge--outline' },
												'Community health ' + repoProof.communityHealth.healthPercentage + '%'
											)
											: null,
										repoProof.releaseStatus === 'published' && repoProof.latestRelease
											? h(
												'span',
												{ className: 'hdc-work-detail__badge hdc-work-detail__badge--outline' },
												'Latest release ' + repoProof.latestRelease.tagName
											)
											: repoProof.releaseStatus === 'missing'
												? h(
													'span',
													{ className: 'hdc-work-detail__badge hdc-work-detail__badge--secondary' },
													'No published releases yet'
												)
												: null
									),
									h(
										'ul',
										{ className: 'hdc-work-detail__list' },
										typeof repoProof.communityHealth === 'object' &&
										typeof repoProof.communityHealth.healthPercentage === 'number'
											? h(
												'li',
												{ className: 'hdc-work-detail__list-item' },
												'Community health score: ' + repoProof.communityHealth.healthPercentage + '%.'
											)
											: h(
												'li',
												{ className: 'hdc-work-detail__list-item' },
												'Community profile score is not available for this repository.'
											),
										repoProof.releaseStatus === 'published' && repoProof.latestRelease
											? h(
												'li',
												{ className: 'hdc-work-detail__list-item' },
												'Latest published release: ' +
													repoProof.latestRelease.tagName +
													( releaseDateLabel ? ' on ' + releaseDateLabel : '' ) +
													'.'
											)
											: repoProof.releaseStatus === 'missing'
												? h(
													'li',
													{ className: 'hdc-work-detail__list-item' },
													'No published GitHub releases yet.'
												)
												: h(
													'li',
													{ className: 'hdc-work-detail__list-item' },
													'Latest release metadata is currently unavailable.'
												),
										communityChecklist.length
											? h(
												'li',
												{ className: 'hdc-work-detail__list-item' },
												'Community files detected: ' + communityChecklist.join( ', ' ) + '.'
											)
											: null
									)
								)
								: h(
									'p',
									{ className: 'hdc-work-detail__text' },
									repoProofWarning || 'Repository proof signals are temporarily unavailable.'
								)
					)
				)
				: null,
			data.whyItMatters
				? h(
					'section',
					{ id: 'project-why-it-matters', className: 'hdc-work-detail__section' },
					h(
						DetailSectionCard,
						{ title: 'Why It Matters', className: 'hdc-work-detail__panel--strong' },
						h( 'p', { className: 'hdc-work-detail__text' }, data.whyItMatters )
					)
				)
				: null,
			hasCaseStudyBreakdown
				? h(
					'section',
					{ id: 'project-case-study-breakdown', className: 'hdc-work-detail__section' },
					h(
						DetailSectionCard,
						{
							title: 'Case Study Breakdown',
							description: 'The Challenge -> Technical Approach -> Shipped Results',
						},
						h(
							'div',
							{ className: 'hdc-work-detail__trio' },
							h(
								'div',
								null,
								h( 'h3', { className: 'hdc-work-detail__subhead' }, 'The Challenge' ),
								h(
									'ul',
									{ className: 'hdc-work-detail__list' },
									data.problem.map( function ( item, index ) {
										return h( 'li', { key: data.name + '-problem-' + index, className: 'hdc-work-detail__list-item' }, item );
									} )
								)
							),
							h(
								'div',
								null,
								h( 'h3', { className: 'hdc-work-detail__subhead' }, 'Technical Approach' ),
								h(
									'ul',
									{ className: 'hdc-work-detail__list' },
									data.approach.map( function ( item, index ) {
										return h( 'li', { key: data.name + '-approach-' + index, className: 'hdc-work-detail__list-item' }, item );
									} )
								)
							),
							h(
								'div',
								null,
								h( 'h3', { className: 'hdc-work-detail__subhead' }, 'Shipped Results' ),
								h(
									'ul',
									{ className: 'hdc-work-detail__list' },
									data.result.map( function ( item, index ) {
										return h( 'li', { key: data.name + '-result-' + index, className: 'hdc-work-detail__list-item' }, item );
									} )
								)
							)
						)
					)
				)
				: null,
			data.highlights.length
				? h(
					'section',
					{ id: 'project-highlights', className: 'hdc-work-detail__section' },
					h(
						DetailSectionCard,
						{ title: 'Highlights' },
						h(
							'div',
							{ className: 'hdc-work-detail__chips' },
							data.highlights.map( function ( item, index ) {
								return h( 'span', { key: data.name + '-highlight-' + index, className: 'hdc-work-detail__chip' }, item );
							} )
						)
					)
				)
				: null,
			data.receipts.length
				? h(
					'section',
					{ id: 'project-receipts', className: 'hdc-work-detail__section' },
					h(
						DetailSectionCard,
						{ title: 'Receipts' },
						h(
							'div',
							{ className: 'hdc-work-detail__stack' },
							data.receipts.map( function ( receipt, index ) {
								return h(
									'article',
									{ key: data.name + '-receipt-' + index, className: 'hdc-work-detail__card' },
									h( 'p', { className: 'hdc-work-detail__card-label' }, receipt.label ),
									h( 'p', { className: 'hdc-work-detail__text' }, receipt.value ),
									receipt.url
										? h(
											'a',
											{
												className: 'hdc-work-detail__inline-link',
												href: receipt.url,
												target: '_blank',
												rel: 'noopener noreferrer',
											},
											'View receipt source'
										)
										: null
								);
							} )
						)
					)
				)
				: null,
			architectureAvailable
				? h(
					'section',
					{ id: 'project-architecture', className: 'hdc-work-detail__section' },
					h(
						DetailSectionCard,
						{ title: 'Architecture' },
						data.architecture.summary ? h( 'p', { className: 'hdc-work-detail__text' }, data.architecture.summary ) : null,
						data.architecture.bullets.length
							? h(
								'ul',
								{ className: 'hdc-work-detail__list' },
								data.architecture.bullets.map( function ( bullet, index ) {
									return h( 'li', { key: data.name + '-architecture-' + index, className: 'hdc-work-detail__list-item' }, bullet );
								} )
							)
							: null,
						data.architecture.diagramUrl
							? h( 'img', {
								className: 'hdc-work-detail__diagram',
								src: data.architecture.diagramUrl,
								alt: data.name + ' architecture diagram',
								loading: 'lazy',
							} )
							: null
					)
				)
				: null,
			data.keyFiles.length
				? h(
					'section',
					{ id: 'project-code-tour', className: 'hdc-work-detail__section' },
					h(
						DetailSectionCard,
						{
							title: 'Code Tour',
							description: 'Signature files and where the key logic lives.',
						},
						h(
							'ul',
							{ className: 'hdc-work-detail__code-list' },
							data.keyFiles.map( function ( keyFile, index ) {
								const href = getKeyFileUrl( data.url, keyFile.path, keyFile.url, data.defaultBranch );
								return h(
									'li',
									{ key: data.name + '-key-file-' + index },
									href
										? h(
											'a',
											{
												className: 'hdc-work-detail__mono-link',
												href: href,
												target: '_blank',
												rel: 'noopener noreferrer',
											},
											keyFile.path
										)
										: h( 'p', { className: 'hdc-work-detail__mono-text' }, keyFile.path ),
									h( 'p', { className: 'hdc-work-detail__text' }, keyFile.note )
								);
							} )
						)
					)
				)
				: null,
			data.shipped
				? h(
					'section',
					{ id: 'project-latest-shipped-change', className: 'hdc-work-detail__section' },
					h(
						DetailSectionCard,
						{ title: 'Latest Shipped Change' },
						h( 'p', { className: 'hdc-work-detail__text' }, data.shipped ),
						h( 'p', { className: 'hdc-work-detail__small-meta' }, 'Updated ' + formatDateLabel( data.updatedAt ) )
					)
				)
				: null,
			data.accessNote
				? h(
					'section',
					{ id: 'project-availability', className: 'hdc-work-detail__section' },
					h(
						DetailSectionCard,
						{ title: 'Availability' },
						h( 'p', { className: 'hdc-work-detail__text' }, data.accessNote )
					)
				)
				: null,
			data.learned
				? h(
					'section',
					{ id: 'project-what-i-learned', className: 'hdc-work-detail__section' },
					h(
						DetailSectionCard,
						{ title: 'What I Learned' },
						h( 'p', { className: 'hdc-work-detail__text' }, data.learned )
					)
				)
				: null
		);
	}

	function mountWorkDetail( section ) {
		const rootNode = section.querySelector( '[data-hdc-work-detail-root]' );
		if ( ! rootNode ) {
			return;
		}

		const app = h( WorkDetailApp, { config: parseConfig( section ) } );
		if ( typeof createRoot === 'function' ) {
			createRoot( rootNode ).render( app );
		} else {
			legacyRender( app, rootNode );
		}
	}

	document.querySelectorAll( '.hdc-work-detail' ).forEach( mountWorkDetail );
} )( window.wp );
