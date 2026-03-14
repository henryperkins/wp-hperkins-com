( function ( wp ) {
	if ( ! wp || ! wp.element ) {
		return;
	}

	const element = wp.element;
	const h = element.createElement;
	const useEffect = element.useEffect;
	const useMemo = element.useMemo;
	const useState = element.useState;
	const useRef = element.useRef;
	const createRoot = element.createRoot;
	const legacyRender = element.render;

	const utils = window.hdcSharedUtils || {};

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
			heading: ensureString( parsed.heading, 'Blog' ),
			description: ensureString( parsed.description, '' ),
			showNewsletterCta: !! parsed.showNewsletterCta,
			endpoint: ensureString( parsed.endpoint, '' ),
			fallbackUrl: ensureString( parsed.fallbackUrl, '' ),
			blogBaseUrl: ensureString( parsed.blogBaseUrl, '/blog/' ),
			contactUrl: ensureString( parsed.contactUrl, '/contact/' ),
			linkedinUrl: ensureString( parsed.linkedinUrl, 'https://linkedin.com/in/henryperkins' ),
			inlineFallback: inlineFallback,
		};
	}

	function fetchJson( url ) {
		if ( ! url ) {
			throw new Error( 'Missing URL' );
		}

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

	function parseDateValue( value ) {
		if ( utils.parseDate ) {
			return utils.parseDate( value );
		}

		const parsed = new Date( value || '' );
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

	function resolveBlogPayload( payload ) {
		if ( payload && typeof payload === 'object' && Array.isArray( payload.posts ) ) {
			return {
				source: ensureString( payload.source, 'unknown' ),
				posts: payload.posts,
			};
		}

		if ( Array.isArray( payload ) ) {
			return {
				source: 'local',
				posts: payload,
			};
		}

		return {
			source: 'unknown',
			posts: [],
		};
	}

	function normalizePost( post, index ) {
		const tags = ensureArray( post && post.tags )
			.map( function ( tag ) {
				return ensureString( String( tag ), '' );
			} )
			.filter( Boolean );
		const contentHtml = ensureString( post && post.contentHtml, '' );
		const content = ensureString( post && post.content, '' );
		const excerpt = ensureString( post && post.excerpt, '' );
		const readingTime = ensureString(
			post && post.readingTime,
			utils.estimateReadingTimeLabel ? utils.estimateReadingTimeLabel( contentHtml || content || excerpt ) : '1 min read'
		);

		return {
			slug: ensureString( post && post.slug, 'post-' + String( index + 1 ) ),
			title: ensureString( post && post.title, 'Untitled Post' ),
			excerpt: excerpt,
			date: ensureString( post && post.date, '' ),
			tags: tags.length ? tags : [ 'General' ],
			featured: !! ( post && post.featured ),
			readingTime: readingTime,
			content: content,
			contentHtml: contentHtml,
			url: ensureString( post && post.url, '' ),
			featuredImageUrl: ensureString( post && post.featuredImageUrl, '' ),
			featuredImageAlt: ensureString( post && post.featuredImageAlt, '' ),
			featuredImageSrcSet: ensureString( post && post.featuredImageSrcSet, '' ),
		};
	}

	function normalizePosts( posts ) {
		return ensureArray( posts )
			.map( normalizePost )
			.sort( function ( left, right ) {
				return parseDateValue( right.date ).getTime() - parseDateValue( left.date ).getTime();
			} );
	}

	function buildPostUrl( post, config ) {
		if ( post && post.slug ) {
			const base = ensureString( config.blogBaseUrl, '/blog/' ).replace( /\/+$/, '' );
			return base + '/' + encodeURIComponent( post.slug ) + '/';
		}

		if ( post && post.url ) {
			return post.url;
		}

		return ensureString( config.blogBaseUrl, '/blog/' );
	}

	function buildImageAlt( post ) {
		const explicitAlt = ensureString( post && post.featuredImageAlt, '' );
		if ( explicitAlt ) {
			return explicitAlt;
		}

		const title = ensureString( post && post.title, 'Blog post' );
		return title + ' featured image';
	}

	function BlogIndexApp( props ) {
		const config = props.config;
		const [ state, setState ] = useState( {
			loading: true,
			error: '',
			source: 'unknown',
			posts: [],
		} );
		const [ search, setSearch ] = useState( '' );
		const [ activeTag, setActiveTag ] = useState( 'All' );
		const chipRefs = useRef( [] );

		const signature = useMemo( function () {
			return JSON.stringify( config );
		}, [ config ] );

		useEffect( function () {
			document.title = 'Blog — Henry Perkins';
		}, [] );

		useEffect(
			function () {
				let cancelled = false;

				async function load() {
					setState( {
						loading: true,
						error: '',
						source: 'unknown',
						posts: [],
					} );

					try {
						const payload = await fetchJson( config.endpoint );
						const resolved = resolveBlogPayload( payload );

						if ( ! cancelled ) {
							setState( {
								loading: false,
								error: '',
								source: resolved.source,
								posts: normalizePosts( resolved.posts ),
							} );
						}
						return;
					} catch ( endpointError ) {
						if ( config.inlineFallback ) {
							var resolvedInline = resolveBlogPayload( config.inlineFallback );
							if ( ! cancelled ) {
								setState( {
									loading: false,
									error: '',
									source: resolvedInline.source || 'local',
									posts: normalizePosts( resolvedInline.posts ),
								} );
							}
							return;
						}
						try {
							const fallback = await fetchJson( config.fallbackUrl );
							const resolvedFallback = resolveBlogPayload( fallback );

							if ( ! cancelled ) {
								setState( {
									loading: false,
									error: '',
									source: resolvedFallback.source || 'local',
									posts: normalizePosts( resolvedFallback.posts ),
								} );
							}
						} catch ( fallbackError ) {
							if ( ! cancelled ) {
								setState( {
									loading: false,
									error: 'Unable to load blog posts.',
									source: 'unknown',
									posts: [],
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

		const featured = useMemo(
			function () {
				if ( ! state.posts.length ) {
					return null;
				}

				const marked = state.posts.find( function ( post ) {
					return !! post.featured;
				} );

				return marked || null;
			},
			[ state.posts ]
		);

		const allTags = useMemo(
			function () {
				const unique = new Set();
				state.posts.forEach( function ( post ) {
					ensureArray( post.tags ).forEach( function ( tag ) {
						unique.add( tag );
					} );
				} );

				return [ 'All' ].concat( Array.from( unique ) );
			},
			[ state.posts ]
		);

		useEffect(
			function () {
				if ( allTags.indexOf( activeTag ) === -1 ) {
					setActiveTag( 'All' );
				}
			},
			[ allTags, activeTag ]
		);

		const filtered = useMemo(
			function () {
				const normalizedSearch = search.trim().toLowerCase();
				const featuredSlug = featured ? featured.slug : '';

				return state.posts.filter( function ( post ) {
					if ( featuredSlug && post.slug === featuredSlug ) {
						return false;
					}

					const matchesSearch =
						! normalizedSearch ||
						post.title.toLowerCase().indexOf( normalizedSearch ) !== -1 ||
						post.excerpt.toLowerCase().indexOf( normalizedSearch ) !== -1;

					const matchesTag = activeTag === 'All' || post.tags.indexOf( activeTag ) !== -1;
					return matchesSearch && matchesTag;
				} );
			},
			[ state.posts, search, activeTag, featured ]
		);

		if ( state.loading ) {
			return h( 'p', { className: 'hdc-blog-index__status' }, 'Loading posts…' );
		}

		if ( state.error ) {
			return h( 'p', { className: 'hdc-blog-index__error' }, state.error );
		}

		function handleChipKeyDown( event, index, options ) {
			var next = -1;
			if ( event.key === 'ArrowRight' || event.key === 'ArrowDown' ) {
				event.preventDefault();
				next = ( index + 1 ) % options.length;
			} else if ( event.key === 'ArrowLeft' || event.key === 'ArrowUp' ) {
				event.preventDefault();
				next = ( index - 1 + options.length ) % options.length;
			} else if ( event.key === 'Home' ) {
				event.preventDefault();
				next = 0;
			} else if ( event.key === 'End' ) {
				event.preventDefault();
				next = options.length - 1;
			}
			if ( next >= 0 ) {
				setActiveTag( options[ next ] );
				if ( chipRefs.current[ next ] ) {
					chipRefs.current[ next ].focus();
				}
			}
		}

		if ( state.posts.length === 0 ) {
			return h(
				'div',
				{ className: 'hdc-blog-index__empty-wrap' },
				h( 'h1', { className: 'hdc-blog-index__title' }, config.heading || 'Blog' ),
				h( 'p', { className: 'hdc-blog-index__empty' }, 'No posts published yet.' )
			);
		}

		return h(
			'div',
			{},
			h(
				'section',
				{ className: 'hdc-blog-index__hero ember-surface' },
				h(
					'div',
					{ className: 'hdc-blog-index__hero-inner' },
					h(
						'header',
						{ className: 'hdc-blog-index__intro' },
						h( 'p', { className: 'hdc-blog-index__eyebrow' }, 'Writing' ),
						h( 'h1', { className: 'hdc-blog-index__title' }, config.heading || 'Blog' ),
						config.description ? h( 'p', { className: 'hdc-blog-index__description' }, config.description ) : null
					)
				)
			),
			h(
				'div',
				{ className: 'hdc-blog-index__content' },
				featured
					? h(
						'a',
						{
							className: 'hdc-blog-index__featured ember-surface',
							href: buildPostUrl( featured, config ),
						},
						h( 'span', { className: 'hdc-blog-index__featured-pill' }, 'Featured' ),
						featured.featuredImageUrl
							? h(
								'div',
								{ className: 'hdc-blog-index__featured-image-wrap' },
								h( 'img', {
									className: 'hdc-blog-index__featured-image',
									src: featured.featuredImageUrl,
									srcSet: featured.featuredImageSrcSet || undefined,
									sizes: '(max-width: 900px) 100vw, 1120px',
									alt: buildImageAlt( featured ),
									loading: 'eager',
									decoding: 'async',
								} )
							)
							: null,
						h( 'h3', { className: 'hdc-blog-index__featured-title' }, featured.title ),
						h( 'p', { className: 'hdc-blog-index__featured-excerpt' }, featured.excerpt ),
						h(
							'div',
							{ className: 'hdc-blog-index__featured-meta' },
							h( 'time', { dateTime: featured.date }, formatDateLabel( featured.date ) ),
							h( 'span', {}, featured.readingTime || '' ),
							h( 'span', { className: 'hdc-blog-index__featured-read' }, 'Read →' )
						)
					)
					: null,
				h(
					'div',
					{ className: 'hdc-blog-index__header-row' },
					h( 'h3', { className: 'hdc-blog-index__section-title' }, 'All Posts' )
				),
				h(
					'div',
					{ className: 'hdc-blog-index__filters' },
					h( 'input', {
						type: 'search',
						className: 'hdc-blog-index__search',
						placeholder: 'Search posts…',
						value: search,
						onChange: function ( event ) {
							setSearch( ensureString( event.target.value, '' ) );
						},
						'aria-label': 'Search blog posts',
					} ),
					h(
						'div',
						{
							className: 'hdc-blog-index__chips',
							role: 'radiogroup',
							'aria-label': 'Filter blog posts by tag',
						},
						allTags.map( function ( tag, tagIndex ) {
							const isActive = tag === activeTag;
							return h(
								'button',
								{
									type: 'button',
									role: 'radio',
									'aria-checked': isActive,
									'data-state': isActive ? 'on' : 'off',
									tabIndex: isActive ? 0 : -1,
									className: 'hdc-blog-index__chip' + ( isActive ? ' is-active' : '' ),
									onClick: function () {
										setActiveTag( tag );
									},
									onKeyDown: function ( event ) {
										handleChipKeyDown( event, tagIndex, allTags );
									},
									ref: function ( node ) {
										chipRefs.current[ tagIndex ] = node;
									},
									key: 'tag-' + tag,
								},
								tag
							);
						} )
					)
				),
				filtered.length === 0
					? h(
						'div',
						{ className: 'hdc-blog-index__empty-state' },
						h( 'h4', { className: 'hdc-blog-index__empty-title' }, 'No posts found' ),
						h(
							'p',
							{ className: 'hdc-blog-index__empty' },
							'Try a different keyword or clear active filters.'
						)
					)
					: h(
						'div',
						{ className: 'hdc-blog-index__list' },
						filtered.map( function ( post ) {
							return h(
								'a',
								{
									className: 'hdc-blog-index__card' + ( post.featuredImageUrl ? ' has-thumbnail' : '' ),
									href: buildPostUrl( post, config ),
									key: post.slug,
								},
								post.featuredImageUrl
									? h(
										'div',
										{ className: 'hdc-blog-index__card-thumb-wrap' },
										h( 'img', {
											className: 'hdc-blog-index__card-thumb',
											src: post.featuredImageUrl,
											srcSet: post.featuredImageSrcSet || undefined,
											sizes: '(max-width: 900px) 100vw, 180px',
											alt: buildImageAlt( post ),
											loading: 'lazy',
											decoding: 'async',
										} )
									)
									: null,
								h(
									'div',
									{ className: 'hdc-blog-index__card-main' },
									h( 'h4', { className: 'hdc-blog-index__card-title' }, post.title ),
									h( 'p', { className: 'hdc-blog-index__card-excerpt' }, post.excerpt ),
									h(
										'div',
										{ className: 'hdc-blog-index__tags' },
										post.tags.map( function ( tag ) {
											return h( 'span', { className: 'hdc-blog-index__tag', key: post.slug + '-tag-' + tag }, tag );
										} )
									)
								),
								h(
									'div',
									{ className: 'hdc-blog-index__card-meta' },
									h( 'time', { dateTime: post.date }, formatDateLabel( post.date ) ),
									h( 'span', {}, post.readingTime || '' )
								)
							);
						} )
					),
				config.showNewsletterCta
					? h(
						'section',
						{ className: 'hdc-blog-index__cta' },
						h( 'h3', { className: 'hdc-blog-index__cta-title' }, 'Stay updated' ),
						h(
							'p',
							{ className: 'hdc-blog-index__cta-description' },
							'I do not run a newsletter yet. The best way to catch new posts is to follow me on LinkedIn.'
						),
						h(
							'div',
							{ className: 'hdc-blog-index__cta-actions' },
							h(
								'a',
								{
									className: 'hdc-blog-index__cta-primary',
									href: config.linkedinUrl,
									target: '_blank',
									rel: 'noopener noreferrer',
								},
								'Follow on LinkedIn'
							),
							h(
								'a',
								{
									className: 'hdc-blog-index__cta-secondary',
									href: config.contactUrl,
								},
								'Reach out'
							)
						)
					)
					: null
			)
		);
	}

	function mountBlogIndex( section ) {
		const rootNode = section.querySelector( '[data-hdc-blog-index-root]' );
		if ( ! rootNode ) {
			return;
		}

		const app = h( BlogIndexApp, { config: parseConfig( section ) } );
		if ( typeof createRoot === 'function' ) {
			createRoot( rootNode ).render( app );
		} else {
			legacyRender( app, rootNode );
		}
	}

	document.querySelectorAll( '.hdc-blog-index' ).forEach( mountBlogIndex );
} )( window.wp );
