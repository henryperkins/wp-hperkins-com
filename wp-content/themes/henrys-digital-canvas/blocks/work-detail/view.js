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
		if ( bodyClassMatch && bodyClassMatch[1] ) {
			return sanitizeRepoSlug( bodyClassMatch[1] );
		}

		const path = String( window.location.pathname || '' ).replace( /\/+$/, '' );
		const segments = path.split( '/' ).filter( Boolean );
		const workIndex = segments.indexOf( 'work' );

		if ( workIndex !== -1 && segments[ workIndex + 1 ] ) {
			return sanitizeRepoSlug( decodeURIComponent( segments[ workIndex + 1 ] ) );
		}

		return '';
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
		if ( Number.isNaN( date.getTime() ) || date.getTime() <= 0 ) {
			return ensureString( value, '' );
		}

		return date.toLocaleDateString( undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		} );
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
				throw error;
			}

			return payload;
		} );
	}

	function resolveWorkPayload( payload ) {
		if ( payload && typeof payload === 'object' && Array.isArray( payload.repos ) ) {
			return {
				source: ensureString( payload.source, 'unknown' ),
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

	function ensureGithubRepositoryUrl( url ) {
		return /^https?:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/i.test( String( url || '' ) );
	}

	function getKeyFileUrl( repoUrl, filePath, overrideUrl, defaultBranch ) {
		if ( overrideUrl ) {
			return overrideUrl;
		}

		if ( ! ensureGithubRepositoryUrl( repoUrl ) || ! filePath ) {
			return '';
		}

		const branch = ensureString( defaultBranch, 'main' );
		return String( repoUrl ).replace( /\/+$/, '' ) + '/blob/' + encodeURIComponent( branch ) + '/' + String( filePath ).replace( /^\/+/, '' );
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
			topics: ensureArray( repo.topics ).map( String ).filter( Boolean ),
			origin: ensureString( repo.origin, 'curated' ),
			access: ensureString( repo.access, 'public' ),
			role: ensureString( repo.role, '' ),
			whyItMatters: ensureString( repo.whyItMatters, '' ),
			problem: ensureArray( repo.problem ).map( String ).filter( Boolean ),
			approach: ensureArray( repo.approach ).map( String ).filter( Boolean ),
			result: ensureArray( repo.result ).map( String ).filter( Boolean ),
			highlights: ensureArray( repo.highlights ).map( String ).filter( Boolean ),
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
						bullets: ensureArray( repo.architecture.bullets ).map( String ).filter( Boolean ),
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
		var status = error && error.status;
		if ( status === 404 ) {
			return 'not-found';
		}
		if ( status === 429 ) {
			return 'rate-limit';
		}
		if ( status >= 500 ) {
			return 'server-error';
		}
		if ( error && error.message && /fetch|network|abort|timeout/i.test( error.message ) ) {
			return 'offline';
		}
		return 'error';
	}

	function getErrorMessage( classification ) {
		if ( classification === 'not-found' ) {
			return 'Project not found';
		}
		if ( classification === 'rate-limit' ) {
			return 'GitHub API rate limit reached. Showing cached data if available.';
		}
		if ( classification === 'offline' ) {
			return 'You appear to be offline. Showing cached data if available.';
		}
		return 'Unable to load project details right now. Please try again later.';
	}

	function WorkDetailApp( props ) {
		const config = props.config;
		const [ repoSlug, setRepoSlug ] = useState( inferRepoSlug( config.repo ) );
		const [ state, setState ] = useState( {
			loading: true,
			error: '',
			errorType: '',
			data: null,
			source: 'unknown',
			detailsUnavailable: false,
		} );

		const signature = useMemo( function () {
			return JSON.stringify( config );
		}, [ config ] );

		useEffect(
			function () {
				setRepoSlug( inferRepoSlug( config.repo ) );
			},
			[ signature ]
		);

		useEffect(
			function () {
				if ( state.loading ) {
					return;
				}

				if ( state.data && state.data.name ) {
					document.title = state.data.name + ' — Henry Perkins';
					return;
				}

				if ( state.errorType === 'not-found' || ( ! state.errorType && ! state.data ) ) {
					document.title = 'Project — Henry Perkins';
				} else {
					document.title = 'Temporarily Unavailable — Henry Perkins';
				}
			},
			[ state.loading, state.data, state.errorType ]
		);

		useEffect(
			function () {
				if ( ! repoSlug ) {
					setState( {
						loading: false,
						error: config.showWhenMissingRepo ? 'Project not found' : '',
						errorType: config.showWhenMissingRepo ? 'not-found' : '',
						data: null,
						source: 'unknown',
						detailsUnavailable: false,
					} );
					return;
				}

				let cancelled = false;

				async function load() {
					setState( {
						loading: true,
						error: '',
						errorType: '',
						data: null,
						source: 'unknown',
						detailsUnavailable: false,
					} );

					try {
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
						} catch ( listError ) {
							listFetchError = listError;
							listedRepos = [];
						}

						let normalized = listedRepos.find( function ( repo ) {
							return normalizeRepoKey( repo.name ) === normalizeRepoKey( repoSlug );
						} ) || null;

						let detailsUnavailable = false;

						if ( ! normalized && listedRepos.length > 0 ) {
							if ( ! cancelled ) {
								setState( {
									loading: false,
									error: 'Project not found',
									errorType: 'not-found',
									data: null,
									source: listSource || 'unknown',
									detailsUnavailable: false,
								} );
							}
							return;
						}

						if ( normalized ) {
							try {
								const payload = await fetchJson( config.endpointBase + encodeURIComponent( repoSlug ) );
								const detailed = normalizeRepository( payload );
								if ( detailed ) {
									normalized = detailed;
								} else {
									detailsUnavailable = true;
								}
							} catch ( detailError ) {
								detailsUnavailable = true;
							}
						} else {
							try {
								const payload = await fetchJson( config.endpointBase + encodeURIComponent( repoSlug ) );
								normalized = normalizeRepository( payload );
							} catch ( detailError ) {
								detailFetchError = detailError;
								normalized = null;
							}
						}

						if ( ! cancelled ) {
							if ( normalized ) {
								setState( {
									loading: false,
									error: '',
									errorType: '',
									data: normalized,
									source: listSource || 'detail',
									detailsUnavailable: detailsUnavailable,
								} );
							} else {
								var classification = detailFetchError
									? classifyFetchError( detailFetchError )
									: listFetchError
										? classifyFetchError( listFetchError )
										: 'not-found';
								setState( {
									loading: false,
									error: getErrorMessage( classification ),
									errorType: classification,
									data: null,
									source: listSource || 'unknown',
									detailsUnavailable: false,
								} );
							}
						}
					} catch ( error ) {
						if ( ! cancelled ) {
							var outerType = classifyFetchError( error );
							setState( {
								loading: false,
								error: getErrorMessage( outerType ),
								errorType: outerType,
								data: null,
								source: 'unknown',
								detailsUnavailable: false,
							} );
						}
					}
				}

				load();

				return function () {
					cancelled = true;
				};
			},
			[ repoSlug, signature ]
		);

		if ( state.loading ) {
			return h(
				'div',
				{ className: 'hdc-work-detail__loading' },
				h( 'p', { className: 'hdc-work-detail__status' }, 'Loading project details…' ),
				h( 'div', { className: 'hdc-work-detail__skeleton hdc-work-detail__skeleton--title', 'aria-hidden': 'true' } ),
				h( 'div', { className: 'hdc-work-detail__skeleton hdc-work-detail__skeleton--line', 'aria-hidden': 'true' } ),
				h( 'div', { className: 'hdc-work-detail__skeleton hdc-work-detail__skeleton--line', 'aria-hidden': 'true' } )
			);
		}

		if ( ! repoSlug && ! config.showWhenMissingRepo ) {
			return null;
		}

			if ( state.error || ! state.data ) {
				var isNotFound = state.errorType === 'not-found' || ( ! state.errorType && ! state.data );
				var errorTitle = isNotFound ? 'Project not found' : 'Temporarily unavailable';
				var errorDescription = isNotFound
					? 'The project you are looking for could not be found. It may be private, or the link might be broken.'
					: state.error || 'Unable to load project details right now. Please try again later.';
				return h(
					'div',
					{ className: 'hdc-work-detail__error-wrap' },
					h( 'h2', { className: 'hdc-work-detail__error-title' }, errorTitle ),
					h( 'p', { className: 'hdc-work-detail__error' }, errorDescription ),
					h(
						'a',
						{ className: 'hdc-work-detail__back-link', href: config.workIndexUrl },
						h(
							'span',
							{ className: 'hdc-work-detail__back-link-icon', 'aria-hidden': 'true' },
							renderLucideIcon( h, 'arrow-left', { className: 'hdc-work-detail__back-link-icon-svg', size: 14 } )
						),
						h( 'span', null, 'Back to Work' )
					)
				);
			}

		const data = state.data;
		const sourceLabel =
			state.source === 'local-json' || state.source === 'cached-snapshot'
				? 'Cached project snapshot.'
				: 'Live project detail.';
		const sourceWarning = state.detailsUnavailable
			? 'Detailed case-study data is temporarily unavailable. Showing summary snapshot.'
			: '';
		const detailLabel = data.origin === 'github'
			? 'Public GitHub repository'
			: data.access === 'private'
				? 'Curated case study (code not public)'
				: 'Curated project';
		const hasCaseStudyBreakdown = data.problem.length || data.approach.length || data.result.length;
		const hasGitHubRepoUrl = ensureGithubRepositoryUrl( data.url );

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
				h( 'p', { className: 'hdc-work-detail__source-label' }, sourceLabel ),
				sourceWarning ? h( 'p', { className: 'hdc-work-detail__source-warning' }, sourceWarning ) : null,
				h( 'p', { className: 'hdc-work-detail__meta-line' }, detailLabel ),
			h(
				'div',
				{ className: 'hdc-work-detail__badges' },
					h( 'span', { className: 'hdc-work-detail__badge hdc-work-detail__badge--lang' }, data.language ),
					data.role ? h( 'span', { className: 'hdc-work-detail__badge hdc-work-detail__badge--role' }, data.role ) : null,
					data.access === 'private' ? h( 'span', { className: 'hdc-work-detail__badge' }, 'Private' ) : null,
					h(
						'span',
						{ className: 'hdc-work-detail__small-meta hdc-work-detail__small-meta--icon' },
						h(
							'span',
							{ className: 'hdc-work-detail__small-meta-icon', 'aria-hidden': 'true' },
							renderLucideIcon( h, 'clock', { className: 'hdc-work-detail__small-meta-icon-svg', size: 12 } )
						),
						h( 'span', null, 'Updated ' + formatDateLabel( data.updatedAt ) )
					),
					data.origin === 'github'
						? h(
							'span',
							{ className: 'hdc-work-detail__small-meta hdc-work-detail__small-meta--icon' },
							h(
								'span',
								{ className: 'hdc-work-detail__small-meta-icon', 'aria-hidden': 'true' },
								renderLucideIcon( h, 'star', { className: 'hdc-work-detail__small-meta-icon-svg', size: 12 } )
							),
							h( 'span', null, String( data.stars ) ),
							h(
								'span',
								{ className: 'hdc-work-detail__small-meta-icon', 'aria-hidden': 'true' },
								renderLucideIcon( h, 'git-fork', { className: 'hdc-work-detail__small-meta-icon-svg', size: 12 } )
							),
							h( 'span', null, String( data.forks ) )
						)
						: null
				),
			h( 'h1', { className: 'hdc-work-detail__title' }, data.name ),
			h( 'p', { className: 'hdc-work-detail__description' }, data.description ),
			data.whyItMatters
				? h(
					'section',
					{ className: 'hdc-work-detail__panel hdc-work-detail__panel--strong' },
					h( 'h2', { className: 'hdc-work-detail__section-title' }, 'Why It Matters' ),
					h( 'p', { className: 'hdc-work-detail__text' }, data.whyItMatters )
				)
				: null,
			data.topics.length
				? h(
					'div',
					{ className: 'hdc-work-detail__chips' },
					data.topics.map( function ( topic ) {
						return h( 'span', { className: 'hdc-work-detail__chip', key: 'topic-' + topic }, topic );
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
								hasGitHubRepoUrl
									? renderLucideIcon( h, 'github', { className: 'hdc-work-detail__button-icon-svg', size: 16 } )
									: renderLucideIcon( h, 'external-link', { className: 'hdc-work-detail__button-icon-svg', size: 16 } )
							),
							h( 'span', null, hasGitHubRepoUrl ? 'View on GitHub' : 'View project' )
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
			hasCaseStudyBreakdown
				? h(
					'section',
					{ className: 'hdc-work-detail__panel' },
					h( 'h2', { className: 'hdc-work-detail__section-title' }, 'Case Study Breakdown' ),
					h( 'p', { className: 'hdc-work-detail__section-desc' }, 'The Challenge → Technical Approach → Shipped Results' ),
					h(
						'div',
						{ className: 'hdc-work-detail__trio' },
						h(
							'div',
							{},
							h( 'h3', { className: 'hdc-work-detail__subhead' }, 'The Challenge' ),
							h(
								'ul',
								{ className: 'hdc-work-detail__list' },
								data.problem.map( function ( item, index ) {
									return h( 'li', { key: 'problem-' + String( index ) }, item );
								} )
							)
						),
						h(
							'div',
							{},
							h( 'h3', { className: 'hdc-work-detail__subhead' }, 'Technical Approach' ),
							h(
								'ul',
								{ className: 'hdc-work-detail__list' },
								data.approach.map( function ( item, index ) {
									return h( 'li', { key: 'approach-' + String( index ) }, item );
								} )
							)
						),
						h(
							'div',
							{},
							h( 'h3', { className: 'hdc-work-detail__subhead' }, 'Shipped Results' ),
							h(
								'ul',
								{ className: 'hdc-work-detail__list' },
								data.result.map( function ( item, index ) {
									return h( 'li', { key: 'result-' + String( index ) }, item );
								} )
							)
						)
					)
				)
				: null,
			data.highlights.length
				? h(
					'section',
					{ className: 'hdc-work-detail__panel' },
					h( 'h2', { className: 'hdc-work-detail__section-title' }, 'Highlights' ),
					h(
						'div',
						{ className: 'hdc-work-detail__chips' },
						data.highlights.map( function ( item, index ) {
							return h( 'span', { className: 'hdc-work-detail__chip', key: 'highlight-' + String( index ) }, item );
						} )
					)
				)
				: null,
			data.receipts.length
				? h(
					'section',
					{ className: 'hdc-work-detail__panel' },
					h( 'h2', { className: 'hdc-work-detail__section-title' }, 'Receipts' ),
					h(
						'div',
						{ className: 'hdc-work-detail__stack' },
						data.receipts.map( function ( receipt, index ) {
							return h(
								'article',
								{ className: 'hdc-work-detail__card', key: 'receipt-' + String( index ) },
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
				: null,
			data.architecture && ( data.architecture.summary || data.architecture.bullets.length || data.architecture.diagramUrl )
				? h(
					'section',
					{ className: 'hdc-work-detail__panel' },
					h( 'h2', { className: 'hdc-work-detail__section-title' }, 'Architecture' ),
					data.architecture.summary ? h( 'p', { className: 'hdc-work-detail__text' }, data.architecture.summary ) : null,
					data.architecture.bullets.length
						? h(
							'ul',
							{ className: 'hdc-work-detail__list' },
							data.architecture.bullets.map( function ( bullet, index ) {
								return h( 'li', { key: 'arch-' + String( index ) }, bullet );
							} )
						)
						: null,
					data.architecture.diagramUrl
						? h( 'img', { className: 'hdc-work-detail__diagram', src: data.architecture.diagramUrl, alt: data.name + ' architecture diagram', loading: 'lazy' } )
						: null
				)
				: null,
			data.keyFiles.length
				? h(
					'section',
					{ className: 'hdc-work-detail__panel' },
					h( 'h2', { className: 'hdc-work-detail__section-title' }, 'Code Tour' ),
					h( 'p', { className: 'hdc-work-detail__section-desc' }, 'Signature files and where the key logic lives.' ),
					h(
						'ul',
						{ className: 'hdc-work-detail__code-list' },
						data.keyFiles.map( function ( keyFile, index ) {
							const href = getKeyFileUrl( data.url, keyFile.path, keyFile.url, data.defaultBranch );
							return h(
								'li',
								{ key: 'keyfile-' + String( index ) },
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
				: null,
			data.shipped
				? h(
					'section',
					{ className: 'hdc-work-detail__panel' },
					h( 'h2', { className: 'hdc-work-detail__section-title' }, 'Latest Shipped Change' ),
					h( 'p', { className: 'hdc-work-detail__text' }, data.shipped ),
					h( 'p', { className: 'hdc-work-detail__small-meta' }, 'Updated ' + formatDateLabel( data.updatedAt ) )
				)
				: null,
			data.accessNote
				? h(
					'section',
					{ className: 'hdc-work-detail__panel' },
					h( 'h2', { className: 'hdc-work-detail__section-title' }, 'Availability' ),
					h( 'p', { className: 'hdc-work-detail__text' }, data.accessNote )
				)
				: null,
			data.learned
				? h(
					'section',
					{ className: 'hdc-work-detail__panel' },
					h( 'h2', { className: 'hdc-work-detail__section-title' }, 'What I Learned' ),
					h( 'p', { className: 'hdc-work-detail__text' }, data.learned )
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
