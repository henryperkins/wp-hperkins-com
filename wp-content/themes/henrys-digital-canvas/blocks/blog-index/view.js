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

	function hideBrokenImage( event ) {
		if ( event && event.target ) {
			event.target.style.display = 'none';
		}
	}

	var blogRevealObserver = null;

	function initBlogReveals() {
		if ( blogRevealObserver ) {
			blogRevealObserver.disconnect();
			blogRevealObserver = null;
		}

		var elements = document.querySelectorAll( '.hdc-blog-reveal:not(.is-visible)' );
		if ( ! elements.length ) {
			return;
		}

		if ( typeof IntersectionObserver === 'undefined' ) {
			elements.forEach( function ( el ) {
				el.classList.add( 'is-visible' );
			} );
			return;
		}

		blogRevealObserver = new IntersectionObserver(
			function ( entries ) {
				entries.forEach( function ( entry ) {
					if ( entry.isIntersecting ) {
						entry.target.classList.add( 'is-visible' );
						blogRevealObserver.unobserve( entry.target );
					}
				} );
			},
			{ threshold: 0.1 }
		);

		elements.forEach( function ( el ) {
			var rect = el.getBoundingClientRect();
			var isAboveFold = rect.top < window.innerHeight && rect.bottom > 0;
			if ( isAboveFold ) {
				el.classList.add( 'is-visible' );
			} else {
				blogRevealObserver.observe( el );
			}
		} );
	}

	function BlogSharePanel( props ) {
		const shareUrl = window.location.origin + ( props.blogUrl || '/blog/' );
		const copyState = useState( 'idle' );
		const copyLabel = copyState[ 0 ];
		const setCopyLabel = copyState[ 1 ];

		function handleCopy() {
			if ( navigator.clipboard && navigator.clipboard.writeText ) {
				navigator.clipboard.writeText( shareUrl ).then(
					function () { setCopyLabel( 'success' ); },
					function () { setCopyLabel( 'error' ); }
				);
			} else {
				try {
					const ta = document.createElement( 'textarea' );
					ta.value = shareUrl;
					ta.style.position = 'fixed';
					ta.style.opacity = '0';
					document.body.appendChild( ta );
					ta.select();
					document.execCommand( 'copy' );
					document.body.removeChild( ta );
					setCopyLabel( 'success' );
				} catch ( err ) {
					setCopyLabel( 'error' );
				}
			}
			setTimeout( function () { setCopyLabel( 'idle' ); }, 2000 );
		}

		var buttonText = copyLabel === 'success' ? 'Blog link copied' : copyLabel === 'error' ? 'Copy failed' : 'Copy blog link';
		var buttonIcon = copyLabel === 'success' ? 'check' : 'share-2';
		var buttonClass = 'hdc-blog-index__share-copy-btn';
		if ( copyLabel === 'success' ) {
			buttonClass += ' hdc-blog-index__share-copy-btn--success';
		} else if ( copyLabel === 'error' ) {
			buttonClass += ' hdc-blog-index__share-copy-btn--error';
		}

		var linkedInShareUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent( shareUrl );
		var emailShareUrl = 'mailto:?subject=' + encodeURIComponent( 'Blog \u2014 Henry Perkins' ) + '&body=' + encodeURIComponent( 'Writing on customer-facing engineering, AI workflows, WordPress delivery, and support-to-implementation systems.\n\n' + shareUrl );

		return h(
			'div',
			{ className: 'hdc-blog-index__share-panel' },
			h( 'h3', { className: 'hdc-blog-index__cta-title' }, 'Share the blog' ),
			h( 'p', { className: 'hdc-blog-index__cta-description' }, 'Share the main blog landing page on LinkedIn or by email.' ),
			h(
				'div',
				{ className: 'hdc-blog-index__share-actions' },
				h(
					'button',
					{
						type: 'button',
						className: buttonClass,
						'aria-label': buttonText,
						onClick: handleCopy,
					},
					utils.renderLucideIcon
						? utils.renderLucideIcon( h, buttonIcon, { size: 14 } )
						: null,
					h( 'span', {}, buttonText )
				),
				h(
					'a',
					{
						className: 'hdc-blog-index__cta-social-link',
						href: linkedInShareUrl,
						target: '_blank',
						rel: 'noopener noreferrer',
					},
					utils.renderLucideIcon
						? utils.renderLucideIcon( h, 'linkedin', { size: 16 } )
						: null,
					h( 'span', {}, 'Share on LinkedIn' )
				),
				h(
					'a',
					{
						className: 'hdc-blog-index__cta-social-link',
						href: emailShareUrl,
						target: '_blank',
						rel: 'noopener noreferrer',
					},
					utils.renderLucideIcon
						? utils.renderLucideIcon( h, 'mail', { size: 16 } )
						: null,
					h( 'span', {}, 'Email blog' )
				)
			)
		);
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
		const [ visibleCount, setVisibleCount ] = useState( 6 );
		const [ retryCount, setRetryCount ] = useState( 0 );
		const chipRefs = useRef( [] );

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
			[ signature, retryCount ]
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

		useEffect( function () {
			if ( ! state.loading && state.posts.length > 0 ) {
				requestAnimationFrame( function () {
					initBlogReveals();
				} );
			}
		}, [ state.loading, state.posts.length, visibleCount ] );

		useEffect( function () {
			if ( state.loading || ! state.posts.length ) {
				return;
			}
			var existing = document.getElementById( 'hdc-blog-jsonld' );
			if ( existing ) {
				existing.remove();
			}
			var items = state.posts.map( function ( post, index ) {
				return {
					'@type': 'ListItem',
					position: index + 1,
					url: window.location.origin + config.blogBaseUrl + post.slug + '/',
				};
			} );
			var ld = {
				'@context': 'https://schema.org',
				'@type': 'ItemList',
				itemListElement: items,
			};
			var script = document.createElement( 'script' );
			script.type = 'application/ld+json';
			script.id = 'hdc-blog-jsonld';
			script.textContent = JSON.stringify( ld );
			document.head.appendChild( script );
			return function () {
				var el = document.getElementById( 'hdc-blog-jsonld' );
				if ( el ) {
					el.remove();
				}
			};
		}, [ state.posts, config.blogBaseUrl ] );

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

		var latestPost = state.posts[ 0 ] || null;
		var currentlyShowing = Math.min( visibleCount, filtered.length );
		var publishedPostCountLabel = state.posts.length === 1
			? '1 published note'
			: state.posts.length + ' published notes';
		var topicCountLabel = allTags.length > 1
			? ( allTags.length - 1 ) + ' topics'
			: null;
		var archiveSummaryLabel = filtered.length > visibleCount
			? 'Showing ' + currentlyShowing + ' of ' + filtered.length
			: filtered.length === 1
				? '1 archive post ready to read'
				: filtered.length + ' archive posts ready to read';
		var normalizedSearchTrimmed = search.trim();
		var normalizedSearchLower = normalizedSearchTrimmed.toLowerCase();
		var browseDescription = normalizedSearchLower
			? 'Showing posts that match "' + normalizedSearchTrimmed + '".'
			: activeTag !== 'All'
				? 'Showing posts tagged ' + activeTag + '.'
				: 'Search by keyword or filter by topic to move through the archive.';

		if ( state.loading ) {
			return h(
				'div',
				{ className: 'hdc-blog-index__state-card' },
				h(
					'span',
					{ className: 'hdc-blog-index__state-icon-badge', 'aria-hidden': 'true' },
					utils.renderLucideIcon ? utils.renderLucideIcon( h, 'loader-2', { className: 'hdc-blog-index__state-icon hdc-blog-index__spin', size: 18 } ) : null
				),
				h( 'p', { className: 'hdc-blog-index__state-title' }, 'Loading posts' ),
				h( 'p', { className: 'hdc-blog-index__state-description' }, 'Fetching the latest writing\u2026' )
			);
		}

		if ( state.error ) {
			return h(
				'div',
				{ className: 'hdc-blog-index__state-card' },
				h(
					'span',
					{ className: 'hdc-blog-index__state-icon-badge', 'aria-hidden': 'true' },
					utils.renderLucideIcon ? utils.renderLucideIcon( h, 'alert-circle', { className: 'hdc-blog-index__state-icon', size: 18 } ) : null
				),
				h( 'p', { className: 'hdc-blog-index__state-title' }, 'Could not load blog posts' ),
				h( 'p', { className: 'hdc-blog-index__state-description' }, state.error ),
				h(
					'button',
					{
						type: 'button',
						className: 'hdc-blog-index__retry',
						onClick: function () {
							setRetryCount( function ( c ) { return c + 1; } );
						},
					},
					'Try again'
				)
			);
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
				{ className: 'hdc-blog-index__hero ember-surface hdc-blog-reveal hdc-blog-reveal--fade-up-soft', style: { '--reveal-index': 0 } },
				h(
					'div',
					{ className: 'hdc-blog-index__hero-inner' },
					h(
						'header',
						{ className: 'hdc-blog-index__intro' },
						h( 'p', { className: 'hdc-blog-index__eyebrow' }, 'Writing' ),
						h( 'h1', { className: 'hdc-blog-index__title' }, config.heading || 'Blog' ),
						config.description ? h( 'p', { className: 'hdc-blog-index__description' }, config.description ) : null,
						state.posts.length > 0 ? h(
							'p',
							{ className: 'hdc-blog-index__hero-meta', 'data-probe': 'hero-meta-blog' },
							publishedPostCountLabel,
							latestPost ? h( 'span', { className: 'hdc-blog-index__meta-sep', 'aria-hidden': 'true' }, ' \u00b7 ' ) : null,
							latestPost ? h( 'span', {}, 'Latest ', h( 'time', { dateTime: latestPost.date }, formatDateLabel( latestPost.date ) ) ) : null,
							topicCountLabel ? h( 'span', { className: 'hdc-blog-index__meta-sep', 'aria-hidden': 'true' }, ' \u00b7 ' ) : null,
							topicCountLabel
						) : null
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
							className: 'hdc-blog-index__featured ember-surface focus-ring hdc-blog-reveal',
							href: buildPostUrl( featured, config ),
							style: { '--reveal-index': 0 },
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
									fetchPriority: 'high',
									decoding: 'async',
									onError: hideBrokenImage,
								} )
							)
							: null,
						h( 'h2', { className: 'hdc-blog-index__featured-title' }, featured.title ),
						h( 'p', { className: 'hdc-blog-index__featured-excerpt' }, featured.excerpt ),
						h(
							'div',
							{ className: 'hdc-blog-index__featured-meta' },
							utils.renderLucideIcon
								? utils.renderLucideIcon( h, 'clock', { size: 12 } )
								: null,
							h( 'time', { dateTime: featured.date }, formatDateLabel( featured.date ) ),
							h( 'span', {}, featured.readingTime || '' ),
							h(
								'span',
								{ className: 'hdc-blog-index__featured-read' },
								'Read ',
								utils.renderLucideIcon
									? utils.renderLucideIcon( h, 'arrow-right', { size: 14 } )
									: null
							)
						)
					)
					: null,
				h(
					'section',
					{ className: 'hdc-blog-index__browse-card surface-inset-soft hdc-blog-reveal', style: { '--reveal-index': 0 } },
					h(
						'div',
						{ className: 'hdc-blog-index__browse-header' },
						h(
							'div',
							{ className: 'hdc-blog-index__browse-header-left' },
							h( 'p', { className: 'hdc-blog-index__eyebrow' }, 'Browse the archive' ),
							h( 'h3', { className: 'hdc-blog-index__section-title' }, 'All Posts' ),
							h( 'p', { className: 'hdc-blog-index__browse-description' }, browseDescription )
						),
						h(
							'div',
							{ className: 'hdc-blog-index__browse-badges' },
							h( 'span', { className: 'hdc-blog-index__badge' }, archiveSummaryLabel ),
							normalizedSearchLower
								? h( 'span', { className: 'hdc-blog-index__badge' }, 'Search: ' + normalizedSearchTrimmed )
								: activeTag !== 'All'
									? h( 'span', { className: 'hdc-blog-index__badge' }, 'Tag: ' + activeTag )
									: latestPost
										? h( 'span', { className: 'hdc-blog-index__badge' }, 'Latest ' + formatDateLabel( latestPost.date ) )
										: null
						)
					),
					h(
						'div',
						{ className: 'hdc-blog-index__filters' },
					h(
						'div',
						{ className: 'hdc-blog-index__search-wrap' },
						utils.renderLucideIcon
							? utils.renderLucideIcon( h, 'search', { size: 16, className: 'hdc-blog-index__search-icon' } )
							: null,
						h( 'input', {
							type: 'search',
							className: 'hdc-blog-index__search',
							placeholder: 'Search posts\u2026',
							value: search,
							onChange: function ( event ) {
								setVisibleCount( 6 );
								setSearch( ensureString( event.target.value, '' ) );
							},
							'aria-label': 'Search blog posts',
						} )
					),
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
										setVisibleCount( 6 );
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
				)
				),
				filtered.length === 0
					? h(
						'div',
						{ className: 'hdc-blog-index__empty-state' },
						h(
							'div',
							{ className: 'hdc-blog-index__empty-icon-badge' },
							utils.renderLucideIcon
								? utils.renderLucideIcon( h, 'inbox', { size: 20 } )
								: null
						),
						h( 'h2', { className: 'hdc-blog-index__empty-title' }, 'No posts found' ),
						h(
							'p',
							{ className: 'hdc-blog-index__empty-description' },
							'Try a different keyword or clear active filters.'
						)
					)
					: h(
						'div',
						{},
						h(
							'div',
							{ className: 'hdc-blog-index__list' },
							filtered.slice( 0, visibleCount ).map( function ( post, postIndex ) {
								return h(
									'a',
									{
										className: 'hdc-blog-index__card focus-ring hdc-blog-reveal hdc-blog-reveal--fade-up-soft' + ( post.featuredImageUrl ? ' has-thumbnail' : '' ),
										href: buildPostUrl( post, config ),
										key: post.slug,
										style: { '--reveal-index': postIndex },
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
												onError: hideBrokenImage,
											} )
										)
										: null,
									h(
										'div',
										{ className: 'hdc-blog-index__card-main' },
										h( 'h3', { className: 'hdc-blog-index__card-title' }, post.title ),
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
										h( 'span', {}, post.readingTime || '' ),
										h(
											'span',
											{ className: 'hdc-blog-index__featured-read' },
											'Read ',
											utils.renderLucideIcon
												? utils.renderLucideIcon( h, 'arrow-right', { size: 14 } )
												: null
										)
									)
								);
							} )
						),
						filtered.length > visibleCount
							? h(
								'div',
								{ className: 'hdc-blog-index__load-more' },
								h(
									'button',
									{
										type: 'button',
										className: 'hdc-blog-index__load-more-btn',
										onClick: function () {
											setVisibleCount( function ( current ) {
												return Math.min( current + 6, filtered.length );
											} );
										},
									},
									'Load more'
								)
							)
							: null
					),
				h(
						'section',
						{ className: 'hdc-blog-index__cta ember-surface' },
						h(
							'div',
							{ className: 'hdc-blog-index__cta-grid' },
							h(
								'div',
								{ className: 'hdc-blog-index__cta-left' },
								h( 'p', { className: 'hdc-blog-index__eyebrow' }, 'Keep up with the work' ),
								h( 'div', {},
									h( 'h3', { className: 'hdc-blog-index__cta-title' }, 'Stay updated' ),
									h( 'p', { className: 'hdc-blog-index__cta-description' },
										'Follow the writing on LinkedIn, browse the work on GitHub, or reach out directly.'
									)
								),
								h(
									'div',
									{ className: 'hdc-blog-index__cta-social' },
									h(
										'a',
										{
											className: 'hdc-blog-index__cta-social-link',
											href: 'https://github.com/henryperkins',
											target: '_blank',
											rel: 'noopener noreferrer',
										},
										utils.renderLucideIcon
											? utils.renderLucideIcon( h, 'github', { size: 16 } )
											: null,
										h( 'span', {}, 'GitHub' )
									),
									h(
										'a',
										{
											className: 'hdc-blog-index__cta-social-link',
											href: config.linkedinUrl,
											target: '_blank',
											rel: 'noopener noreferrer',
										},
										utils.renderLucideIcon
											? utils.renderLucideIcon( h, 'linkedin', { size: 16 } )
											: null,
										h( 'span', {}, 'LinkedIn' )
									)
								),
								h(
									'a',
									{
										className: 'hdc-blog-index__cta-secondary',
										href: config.contactUrl,
									},
									'Reach out'
								)
							),
							h( BlogSharePanel, { blogUrl: config.blogBaseUrl } )
						)
					)
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
