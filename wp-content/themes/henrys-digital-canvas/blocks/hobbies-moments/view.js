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

	const CATEGORY_FILTERS = [ 'All', 'Dev', 'Music', 'Learning' ];
	const TIMEFRAME_FILTERS = [ 'All', 'Now', 'Recently', 'Next' ];
	const TIMEFRAME_ORDER = [ 'now', 'recently', 'next' ];

	const CATEGORY_MAP = {
		All: '',
		Dev: 'dev',
		Music: 'music',
		Learning: 'learning',
	};

	const TIMEFRAME_MAP = {
		All: '',
		Now: 'now',
		Recently: 'recently',
		Next: 'next',
	};

	const CATEGORY_QUERY_MAP = {
		all: 'All',
		dev: 'Dev',
		music: 'Music',
		learning: 'Learning',
	};

	const TIMEFRAME_QUERY_MAP = {
		all: 'All',
		now: 'Now',
		recently: 'Recently',
		next: 'Next',
	};

	const TIMEFRAME_META = {
		now: {
			label: 'Now',
			description: 'What I am into outside work right now.',
		},
		recently: {
			label: 'Recently',
			description: 'Recent rabbit holes, experiments, and creative routines.',
		},
		next: {
			label: 'Next',
			description: 'What I want to try, practice, and explore next.',
		},
	};

	const CATEGORY_BADGE = {
		dev: 'Dev',
		music: 'Music',
		learning: 'Learning',
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

		let inlineFallback = null;
		try {
			const raw = section.getAttribute( 'data-fallback-payload' );
			if ( raw ) {
				inlineFallback = JSON.parse( raw );
			}
		} catch ( parseError ) {
			inlineFallback = null;
		}

		return {
			heading: ensureString( parsed.heading, 'Hobbies' ),
			description: ensureString( parsed.description, '' ),
			endpoint: ensureString( parsed.endpoint, '' ),
			fallbackUrl: ensureString( parsed.fallbackUrl, '' ),
			inlineFallback: inlineFallback,
		};
	}

	function parseCategoryFilter( queryValue ) {
		if ( ! queryValue ) {
			return 'All';
		}
		return CATEGORY_QUERY_MAP[ String( queryValue ).toLowerCase() ] || 'All';
	}

	function parseTimeframeFilter( queryValue ) {
		if ( ! queryValue ) {
			return 'All';
		}
		return TIMEFRAME_QUERY_MAP[ String( queryValue ).toLowerCase() ] || 'All';
	}

	function fetchJson( url ) {
		return fetch( url, {
			headers: {
				Accept: 'application/json',
			},
		} ).then( function ( response ) {
			if ( ! response.ok ) {
				throw new Error( 'Request failed with status ' + response.status );
			}

			return response.json();
		} );
	}

	function normalizeMomentsPayload( payload ) {
		if ( payload && typeof payload === 'object' && Array.isArray( payload.items ) ) {
			return payload.items;
		}
		return Array.isArray( payload ) ? payload : [];
	}

	function filterMoments( moments, categoryFilter, timeframeFilter ) {
		const normalizedCategory = CATEGORY_MAP[ categoryFilter ] || '';
		const normalizedTimeframe = TIMEFRAME_MAP[ timeframeFilter ] || '';

		return ensureArray( moments ).filter( function ( moment ) {
			if ( normalizedCategory && moment.category !== normalizedCategory ) {
				return false;
			}
			if ( normalizedTimeframe && moment.timeframe !== normalizedTimeframe ) {
				return false;
			}
			return true;
		} );
	}

	function groupMoments( moments ) {
		const grouped = {
			now: [],
			recently: [],
			next: [],
		};

		moments.forEach( function ( moment ) {
			if ( grouped[ moment.timeframe ] ) {
				grouped[ moment.timeframe ].push( moment );
			}
		} );

		return TIMEFRAME_ORDER.map( function ( key ) {
			return {
				timeframe: key,
				items: grouped[ key ],
			};
		} ).filter( function ( group ) {
			return group.items.length > 0;
		} );
	}

	function momentMediaNode( moment ) {
		const media = moment && moment.media && typeof moment.media === 'object' ? moment.media : null;
		if ( ! media || ! media.type || ! media.src ) {
			return null;
		}

		if ( media.type === 'image' ) {
			return h( 'img', { src: media.src, alt: ensureString( media.alt, ensureString( moment.title, 'Moment image' ) ) } );
		}

		if ( media.type === 'audio' ) {
			return h(
				'audio',
				{ controls: true, preload: 'none' },
				h( 'source', { src: media.src, type: ensureString( media.mimeType, '' ) } )
			);
		}

		return h(
			'video',
			{ controls: true, preload: 'metadata' },
			h( 'source', { src: media.src, type: ensureString( media.mimeType, '' ) } )
		);
	}

	function HobbiesMomentsApp( props ) {
		const config = props.config;
		const search = new URLSearchParams( window.location.search );
		const [ state, setState ] = useState( {
			loading: true,
			error: '',
			items: [],
		} );
		const [ activeCategory, setActiveCategory ] = useState( parseCategoryFilter( search.get( 'category' ) ) );
		const [ activeTimeframe, setActiveTimeframe ] = useState( parseTimeframeFilter( search.get( 'timeframe' ) ) );
		const [ openId, setOpenId ] = useState( search.get( 'open' ) || null );

		const signature = useMemo( function () {
			return JSON.stringify( config );
		}, [ config ] );

		useEffect(
			function () {
				let cancelled = false;

				async function load() {
					setState( {
						loading: true,
						error: '',
						items: [],
					} );

					try {
						const payload = await fetchJson( config.endpoint );
						if ( ! cancelled ) {
							setState( {
								loading: false,
								error: '',
								items: normalizeMomentsPayload( payload ),
							} );
						}
						return;
					} catch ( endpointError ) {
						if ( config.inlineFallback ) {
							if ( ! cancelled ) {
								setState( {
									loading: false,
									error: '',
									items: normalizeMomentsPayload( config.inlineFallback ),
								} );
							}
							return;
						}
						try {
							const fallback = await fetchJson( config.fallbackUrl );
							if ( ! cancelled ) {
								setState( {
									loading: false,
									error: '',
									items: normalizeMomentsPayload( fallback ),
								} );
							}
						} catch ( fallbackError ) {
							if ( ! cancelled ) {
								setState( {
									loading: false,
									error: 'Unable to load hobby moments.',
									items: [],
								} );
							}
						}
					}
				}

				load();

				return function () {
					cancelled = true;
				};
			},
			[ signature ]
		);

		const filteredMoments = useMemo(
			function () {
				return filterMoments( state.items, activeCategory, activeTimeframe );
			},
			[ state.items, activeCategory, activeTimeframe ]
		);

		const grouped = useMemo(
			function () {
				return groupMoments( filteredMoments );
			},
			[ filteredMoments ]
		);

		useEffect(
			function () {
				if ( filteredMoments.length === 0 ) {
					if ( openId !== null ) {
						setOpenId( null );
					}
					return;
				}

				const exists = filteredMoments.some( function ( moment ) {
					return moment.id === openId;
				} );

				if ( ! exists ) {
					setOpenId( filteredMoments[0].id );
				}
			},
			[ filteredMoments, openId ]
		);

		useEffect(
			function () {
				const params = new URLSearchParams( window.location.search );
				params.set( 'category', ( CATEGORY_MAP[ activeCategory ] || 'all' ) );
				params.set( 'timeframe', ( TIMEFRAME_MAP[ activeTimeframe ] || 'all' ) );

				if ( openId ) {
					params.set( 'open', openId );
				} else {
					params.delete( 'open' );
				}

				const nextUrl = window.location.pathname + '?' + params.toString() + window.location.hash;
				window.history.replaceState( {}, '', nextUrl );
			},
			[ activeCategory, activeTimeframe, openId ]
		);

		if ( state.loading ) {
			return h( 'p', { className: 'hdc-hobbies-moments__status' }, 'Loading moments…' );
		}

		if ( state.error ) {
			return h( 'p', { className: 'hdc-hobbies-moments__error' }, state.error );
		}

		return h(
			'div',
			{},
			h(
				'header',
				{ className: 'hdc-hobbies-moments__hero' },
				h( 'h2', { className: 'hdc-hobbies-moments__title' }, config.heading || 'Hobbies' ),
				h( 'p', { className: 'hdc-hobbies-moments__desc' }, config.description )
			),
			h(
				'div',
				{ className: 'hdc-hobbies-moments__filters' },
				h(
					'div',
					{},
					h( 'span', { className: 'hdc-hobbies-moments__filter-label' }, 'Category' ),
					h(
						'div',
						{ className: 'hdc-hobbies-moments__chips' },
						CATEGORY_FILTERS.map( function ( filter ) {
							return h(
								'button',
								{
									type: 'button',
									className: 'hdc-hobbies-moments__chip' + ( activeCategory === filter ? ' is-active' : '' ),
									onClick: function () {
										setActiveCategory( filter );
									},
									key: 'category-' + filter,
								},
								filter
							);
						} )
					)
				),
				h(
					'div',
					{},
					h( 'span', { className: 'hdc-hobbies-moments__filter-label' }, 'Timeframe' ),
					h(
						'div',
						{ className: 'hdc-hobbies-moments__chips' },
						TIMEFRAME_FILTERS.map( function ( filter ) {
							return h(
								'button',
								{
									type: 'button',
									className: 'hdc-hobbies-moments__chip' + ( activeTimeframe === filter ? ' is-active' : '' ),
									onClick: function () {
										setActiveTimeframe( filter );
									},
									key: 'timeframe-' + filter,
								},
								filter
							);
						} )
					)
				)
			),
			grouped.length === 0
				? h( 'p', { className: 'hdc-hobbies-moments__empty' }, 'No moments found for the selected filters.' )
				: grouped.map( function ( group ) {
					const meta = TIMEFRAME_META[ group.timeframe ] || { label: group.timeframe, description: '' };
					const countLabel = group.items.length === 1 ? '1 moment' : String( group.items.length ) + ' moments';
					return h(
						'section',
						{ className: 'hdc-hobbies-moments__group', key: 'group-' + group.timeframe },
						h(
							'div',
							{ className: 'hdc-hobbies-moments__group-head' },
							h( 'h3', { className: 'hdc-hobbies-moments__group-title' }, meta.label ),
							h( 'span', { className: 'hdc-hobbies-moments__group-count' }, countLabel )
						),
						h( 'p', { className: 'hdc-hobbies-moments__group-desc' }, meta.description ),
						h(
							'div',
							{ className: 'hdc-hobbies-moments__grid' },
							group.items.map( function ( moment ) {
								const isOpen = openId === moment.id;
								const panelId = 'hdc-hobby-panel-' + String( moment.id );
								const triggerId = 'hdc-hobby-trigger-' + String( moment.id );
								return h(
									'article',
									{ className: 'hdc-hobbies-moments__card', key: moment.id },
									h(
										'div',
										{ className: 'hdc-hobbies-moments__meta' },
										h( 'span', { className: 'hdc-hobbies-moments__badge' }, CATEGORY_BADGE[ moment.category ] || 'General' ),
										h( 'span', { className: 'hdc-hobbies-moments__badge' }, ( TIMEFRAME_META[ moment.timeframe ] || {} ).label || 'Moment' )
									),
									h(
										'button',
										{
											type: 'button',
											className: 'hdc-hobbies-moments__trigger',
											id: triggerId,
											'aria-expanded': isOpen ? 'true' : 'false',
											'aria-controls': panelId,
											onClick: function () {
												setOpenId( isOpen ? null : moment.id );
											},
										},
										h( 'span', {}, ensureString( moment.title, 'Moment' ) ),
										h( 'span', {}, isOpen ? 'Hide' : 'Read' )
									),
									h( 'p', { className: 'hdc-hobbies-moments__summary' }, ensureString( moment.takeaway, '' ) ),
									isOpen
										? h(
											'div',
											{
												className: 'hdc-hobbies-moments__expanded',
												id: panelId,
												role: 'region',
												'aria-labelledby': triggerId,
											},
											h( 'p', { className: 'hdc-hobbies-moments__story' }, ensureString( moment.story, '' ) ),
											momentMediaNode( moment ) ? h( 'div', { className: 'hdc-hobbies-moments__media' }, momentMediaNode( moment ) ) : null,
											h( 'p', { className: 'hdc-hobbies-moments__takeaway-label' }, 'Key takeaway' ),
											h( 'p', { className: 'hdc-hobbies-moments__takeaway' }, ensureString( moment.takeaway, '' ) )
										)
										: null
								);
							} )
						)
					);
				} )
		);
	}

	function mountHobbiesMoments( section ) {
		const rootNode = section.querySelector( '[data-hdc-hobbies-moments-root]' );
		if ( ! rootNode ) {
			return;
		}

		const app = h( HobbiesMomentsApp, { config: parseConfig( section ) } );
		if ( typeof createRoot === 'function' ) {
			createRoot( rootNode ).render( app );
		} else {
			legacyRender( app, rootNode );
		}
	}

	document.querySelectorAll( '.hdc-hobbies-moments' ).forEach( mountHobbiesMoments );
} )( window.wp );
