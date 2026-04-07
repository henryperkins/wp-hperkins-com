( function ( wp ) {
	if ( ! wp || ! wp.element ) {
		return;
	}

	const element = wp.element;
	const h = element.createElement;
	const useEffect = element.useEffect;
	const useMemo = element.useMemo;
	const useRef = element.useRef;
	const useState = element.useState;
	const createRoot = element.createRoot;
	const legacyRender = element.render;

	const utils = window.hdcSharedUtils || {};
	const BLOG_PAGE_SIZE = 6;
	const BLOG_HEADING = 'Blog';
	const BLOG_DESCRIPTION =
		'Writing on customer-facing engineering, AI workflows, WordPress delivery, and support-to-implementation systems.';
	const BLOG_LOADING_DESCRIPTION =
		'Please wait while the latest posts are prepared.';
	const BLOG_ERROR_DESCRIPTION =
		'The blog index could not be loaded right now. Try again in a moment.';
	const BLOG_DATE_FORMATTER = new Intl.DateTimeFormat( 'en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	} );

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

	function toAbsoluteUrl( value ) {
		const url = ensureString( value, '' );
		if ( ! url ) {
			return '';
		}

		try {
			return new URL( url, window.location.origin ).toString();
		} catch ( error ) {
			return url;
		}
	}

	function parseConfig( section ) {
		let parsed = {};

		try {
			parsed = JSON.parse(
				section.getAttribute( 'data-config' ) || '{}'
			);
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
			endpoint: ensureString( parsed.endpoint, '' ),
			fallbackUrl: ensureString( parsed.fallbackUrl, '' ),
			blogBaseUrl: ensureString( parsed.blogBaseUrl, '/blog/' ),
			contactUrl: ensureString( parsed.contactUrl, '/contact/' ),
			githubUrl: ensureString(
				parsed.githubUrl,
				'https://github.com/henryperkins'
			),
			linkedinUrl: ensureString(
				parsed.linkedinUrl,
				'https://linkedin.com/in/henryperkins'
			),
			inlineFallback,
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
				throw new Error(
					'Request failed with status ' + response.status
				);
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
			return 'Date unavailable';
		}

		return BLOG_DATE_FORMATTER.format( date );
	}

	function resolveBlogPayload( payload ) {
		if (
			payload &&
			typeof payload === 'object' &&
			Array.isArray( payload.posts )
		) {
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
			utils.estimateReadingTimeLabel
				? utils.estimateReadingTimeLabel(
						contentHtml || content || excerpt
				  )
				: '1 min read'
		);

		return {
			slug: ensureString(
				post && post.slug,
				'post-' + String( index + 1 )
			),
			title: ensureString( post && post.title, 'Untitled Post' ),
			excerpt,
			date: ensureString( post && post.date, '' ),
			tags: tags.length ? tags : [ 'General' ],
			featured: !! ( post && post.featured ),
			readingTime,
			content,
			contentHtml,
			url: ensureString( post && post.url, '' ),
			featuredImageUrl: ensureString( post && post.featuredImageUrl, '' ),
			featuredImageAlt: ensureString( post && post.featuredImageAlt, '' ),
			featuredImageSrcSet: ensureString(
				post && post.featuredImageSrcSet,
				''
			),
		};
	}

	function normalizePosts( posts ) {
		return ensureArray( posts )
			.map( normalizePost )
			.sort( function ( left, right ) {
				return (
					parseDateValue( right.date ).getTime() -
					parseDateValue( left.date ).getTime()
				);
			} );
	}

	function buildPostUrl( post, blogBaseUrl ) {
		if ( post && post.slug ) {
			const base = ensureString( blogBaseUrl, '/blog/' ).replace(
				/\/+$/,
				''
			);

			return toAbsoluteUrl(
				base + '/' + encodeURIComponent( post.slug ) + '/'
			);
		}

		if ( post && post.url ) {
			return toAbsoluteUrl( post.url );
		}

		return toAbsoluteUrl( ensureString( blogBaseUrl, '/blog/' ) );
	}

	function buildImageAlt( post ) {
		const explicitAlt = ensureString( post && post.featuredImageAlt, '' );
		if ( explicitAlt ) {
			return explicitAlt;
		}

		const title = ensureString( post && post.title, 'Blog post' );
		return 'Featured image for ' + title;
	}

	function hideBrokenImage( event ) {
		if ( event && event.target ) {
			event.target.style.display = 'none';
		}
	}

	function getCopyButtonText( copyLabel ) {
		if ( copyLabel === 'success' ) {
			return 'Blog link copied';
		}

		if ( copyLabel === 'error' ) {
			return 'Copy failed';
		}

		return 'Copy blog link';
	}

	function getCopyButtonIcon( copyLabel ) {
		if ( copyLabel === 'success' ) {
			return 'check';
		}

		return 'share-2';
	}

	function getCopyButtonClassName( copyLabel ) {
		let className = 'hdc-blog-index__share-copy-btn';

		if ( copyLabel === 'success' ) {
			className += ' hdc-blog-index__share-copy-btn--success';
		} else if ( copyLabel === 'error' ) {
			className += ' hdc-blog-index__share-copy-btn--error';
		}

		return className;
	}

	function getPublishedPostCountLabel( postCount ) {
		if ( postCount === 1 ) {
			return '1 published note';
		}

		return postCount + ' published notes';
	}

	function getTopicCountLabel( allTagCount ) {
		if ( allTagCount <= 1 ) {
			return null;
		}

		return allTagCount - 1 + ' topics';
	}

	function getArchiveSummaryLabel(
		filteredCount,
		currentVisibleCount,
		hasActiveArchiveFilters,
		hasFeaturedPost
	) {
		if ( filteredCount > currentVisibleCount ) {
			return 'Showing ' + currentVisibleCount + ' of ' + filteredCount;
		}

		if ( filteredCount === 0 ) {
			if ( hasActiveArchiveFilters ) {
				return 'No matching archive posts';
			}

			if ( hasFeaturedPost ) {
				return 'Featured post only';
			}

			return 'No published posts yet';
		}

		if ( filteredCount === 1 ) {
			return '1 archive post ready to read';
		}

		return filteredCount + ' archive posts ready to read';
	}

	function getBrowseDescription(
		normalizedSearchLower,
		normalizedSearchTrimmed,
		activeTag,
		filteredCount,
		hasFeaturedPost
	) {
		if ( normalizedSearchLower ) {
			return (
				'Showing posts that match "' + normalizedSearchTrimmed + '".'
			);
		}

		if ( activeTag !== 'All' ) {
			return 'Showing posts tagged ' + activeTag + '.';
		}

		if ( filteredCount === 0 ) {
			if ( hasFeaturedPost ) {
				return 'The latest post is featured above. More posts will appear here as the archive grows.';
			}

			return 'Published posts will appear here once the archive is live.';
		}

		return 'Search by keyword or filter by topic to move through the archive.';
	}

	function getEmptyStateTitle( hasActiveArchiveFilters, hasFeaturedPost ) {
		if ( hasActiveArchiveFilters ) {
			return 'No posts found';
		}

		if ( hasFeaturedPost ) {
			return 'Archive updating';
		}

		return 'No posts published yet';
	}

	function getEmptyStateDescription(
		hasActiveArchiveFilters,
		hasFeaturedPost
	) {
		if ( hasActiveArchiveFilters ) {
			return 'Try a different keyword or clear active filters.';
		}

		if ( hasFeaturedPost ) {
			return 'The latest post is featured above. More posts will appear here as the archive grows.';
		}

		return 'Published posts will appear here once they are available.';
	}

	let blogRevealObserver = null;

	function initBlogReveals() {
		if ( blogRevealObserver ) {
			blogRevealObserver.disconnect();
			blogRevealObserver = null;
		}

		const elements = document.querySelectorAll(
			'.hdc-blog-reveal:not(.is-visible)'
		);
		if ( ! elements.length ) {
			return;
		}

		if ( typeof window.IntersectionObserver === 'undefined' ) {
			elements.forEach( function ( el ) {
				el.classList.add( 'is-visible' );
			} );
			return;
		}

		blogRevealObserver = new window.IntersectionObserver(
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
			const rect = el.getBoundingClientRect();
			const isAboveFold =
				rect.top < window.innerHeight && rect.bottom > 0;

			if ( isAboveFold ) {
				el.classList.add( 'is-visible' );
			} else {
				blogRevealObserver.observe( el );
			}
		} );
	}

	function BlogSharePanel( props ) {
		const shareUrl = toAbsoluteUrl( props.blogUrl || '/blog/' );
		const [ copyLabel, setCopyLabel ] = useState( 'idle' );
		const buttonText = getCopyButtonText( copyLabel );
		const buttonIcon = getCopyButtonIcon( copyLabel );
		const buttonClass = getCopyButtonClassName( copyLabel );
		const linkedInShareUrl =
			'https://www.linkedin.com/sharing/share-offsite/?url=' +
			encodeURIComponent( shareUrl );
		const emailShareUrl =
			'mailto:?subject=' +
			encodeURIComponent( 'Blog \u2014 Henry Perkins' ) +
			'&body=' +
			encodeURIComponent( BLOG_DESCRIPTION + '\n\n' + shareUrl );

		function handleCopy() {
			if (
				window.navigator.clipboard &&
				window.navigator.clipboard.writeText
			) {
				window.navigator.clipboard.writeText( shareUrl ).then(
					function () {
						setCopyLabel( 'success' );
					},
					function () {
						setCopyLabel( 'error' );
					}
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
				} catch ( error ) {
					setCopyLabel( 'error' );
				}
			}

			setTimeout( function () {
				setCopyLabel( 'idle' );
			}, 2000 );
		}

		return h(
			'div',
			{ className: 'hdc-blog-index__share-panel' },
			h(
				'h3',
				{ className: 'hdc-blog-index__cta-title' },
				'Share the blog'
			),
			h(
				'p',
				{ className: 'hdc-blog-index__cta-description' },
				'Share the main blog landing page on LinkedIn or by email.'
			),
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
		const endpoint = config.endpoint;
		const fallbackUrl = config.fallbackUrl;
		const blogBaseUrl = config.blogBaseUrl;
		const contactUrl = config.contactUrl;
		const githubUrl = config.githubUrl;
		const linkedinUrl = config.linkedinUrl;
		const inlineFallback = config.inlineFallback;
		const [ state, setState ] = useState( {
			loading: true,
			error: '',
			source: 'unknown',
			posts: [],
		} );
		const [ search, setSearch ] = useState( '' );
		const [ activeTag, setActiveTag ] = useState( 'All' );
		const [ visibleCount, setVisibleCount ] = useState( BLOG_PAGE_SIZE );
		const [ retryCount, setRetryCount ] = useState( 0 );
		const chipRefs = useRef( [] );

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
						const payload = await fetchJson( endpoint );
						const resolved = resolveBlogPayload( payload );

						if ( ! cancelled ) {
							setState( {
								loading: false,
								error: '',
								source: resolved.source,
								posts: normalizePosts( resolved.posts ),
							} );
						}
					} catch ( endpointError ) {
						if ( inlineFallback ) {
							try {
								const resolvedInline =
									resolveBlogPayload( inlineFallback );

								if ( ! cancelled ) {
									setState( {
										loading: false,
										error: '',
										source:
											resolvedInline.source || 'local',
										posts: normalizePosts(
											resolvedInline.posts
										),
									} );
								}

								return;
							} catch ( inlineFallbackError ) {
								// Fall through to the static fallback URL.
							}
						}

						try {
							const fallback = await fetchJson( fallbackUrl );
							const resolvedFallback =
								resolveBlogPayload( fallback );

							if ( ! cancelled ) {
								setState( {
									loading: false,
									error: '',
									source: resolvedFallback.source || 'local',
									posts: normalizePosts(
										resolvedFallback.posts
									),
								} );
							}
						} catch ( fallbackError ) {
							if ( ! cancelled ) {
								setState( {
									loading: false,
									error: BLOG_ERROR_DESCRIPTION,
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
			[ endpoint, fallbackUrl, inlineFallback, retryCount ]
		);

		const featured = useMemo(
			function () {
				if ( ! state.posts.length ) {
					return null;
				}

				return (
					state.posts.find( function ( post ) {
						return !! post.featured;
					} ) || null
				);
			},
			[ state.posts ]
		);

		const archivePosts = useMemo(
			function () {
				return state.posts.filter( function ( post ) {
					return ! post.featured;
				} );
			},
			[ state.posts ]
		);

		const allTags = useMemo(
			function () {
				const unique = new Set();

				archivePosts.forEach( function ( post ) {
					ensureArray( post.tags ).forEach( function ( tag ) {
						unique.add( tag );
					} );
				} );

				return [ 'All' ].concat( Array.from( unique ) );
			},
			[ archivePosts ]
		);

		function handleChipKeyDown( event, index, options ) {
			let next = -1;

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
				setVisibleCount( BLOG_PAGE_SIZE );
				setActiveTag( options[ next ] );

				if ( chipRefs.current[ next ] ) {
					chipRefs.current[ next ].focus();
				}
			}
		}

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

				return archivePosts.filter( function ( post ) {
					const normalizedTitle = post.title.toLowerCase();
					const normalizedExcerpt = post.excerpt.toLowerCase();
					const titleMatches =
						normalizedTitle.indexOf( normalizedSearch ) !== -1;
					const excerptMatches =
						normalizedExcerpt.indexOf( normalizedSearch ) !== -1;
					const matchesSearch =
						! normalizedSearch || titleMatches || excerptMatches;
					const matchesTag =
						activeTag === 'All' ||
						post.tags.indexOf( activeTag ) !== -1;

					return matchesSearch && matchesTag;
				} );
			},
			[ archivePosts, search, activeTag ]
		);

		const visiblePosts = useMemo(
			function () {
				return filtered.slice( 0, visibleCount );
			},
			[ filtered, visibleCount ]
		);

		const listedPosts = useMemo(
			function () {
				return featured
					? [ featured ].concat( visiblePosts )
					: visiblePosts;
			},
			[ featured, visiblePosts ]
		);

		useEffect(
			function () {
				const frameId = window.requestAnimationFrame( function () {
					initBlogReveals();
				} );

				return function () {
					window.cancelAnimationFrame( frameId );
				};
			},
			[
				state.loading,
				state.error,
				state.posts.length,
				visibleCount,
				search,
				activeTag,
			]
		);

		useEffect(
			function () {
				const existing = document.getElementById( 'hdc-blog-jsonld' );

				if ( existing ) {
					existing.remove();
				}

				if ( state.loading || ! listedPosts.length ) {
					return;
				}

				const ld = {
					'@context': 'https://schema.org',
					'@type': 'ItemList',
					itemListElement: listedPosts.map( function ( post, index ) {
						return {
							'@type': 'ListItem',
							description: post.excerpt,
							image: post.featuredImageUrl
								? toAbsoluteUrl( post.featuredImageUrl )
								: undefined,
							name: post.title,
							position: index + 1,
							url: buildPostUrl( post, blogBaseUrl ),
						};
					} ),
				};

				const script = document.createElement( 'script' );

				script.type = 'application/ld+json';
				script.id = 'hdc-blog-jsonld';
				script.textContent = JSON.stringify( ld );
				document.head.appendChild( script );

				return function () {
					const el = document.getElementById( 'hdc-blog-jsonld' );

					if ( el ) {
						el.remove();
					}
				};
			},
			[ state.loading, listedPosts, blogBaseUrl ]
		);

		const hasBlogPosts = state.posts.length > 0;
		const isBlogLookupPending = ! hasBlogPosts && state.loading;
		const hasBlogLookupError = ! hasBlogPosts && !! state.error;
		const latestPost = state.posts[ 0 ] || null;
		const currentlyShowing = visiblePosts.length;
		const normalizedSearchTrimmed = search.trim();
		const normalizedSearchLower = normalizedSearchTrimmed.toLowerCase();
		const hasActiveArchiveFilters =
			normalizedSearchLower.length > 0 || activeTag !== 'All';
		const publishedPostCountLabel = getPublishedPostCountLabel(
			state.posts.length
		);
		const topicCountLabel = getTopicCountLabel( allTags.length );
		const archiveSummaryLabel = getArchiveSummaryLabel(
			filtered.length,
			currentlyShowing,
			hasActiveArchiveFilters,
			!! featured
		);
		const browseDescription = getBrowseDescription(
			normalizedSearchLower,
			normalizedSearchTrimmed,
			activeTag,
			filtered.length,
			!! featured
		);
		const emptyStateTitle = getEmptyStateTitle(
			hasActiveArchiveFilters,
			!! featured
		);
		const emptyStateDescription = getEmptyStateDescription(
			hasActiveArchiveFilters,
			!! featured
		);

		const latestMetaSeparator = latestPost
			? h( 'span', {
					className: 'hdc-blog-index__meta-sep',
					'aria-hidden': 'true',
			  } )
			: null;
		const latestMetaItem = latestPost
			? h(
					'span',
					{ className: 'hdc-blog-index__hero-meta-item' },
					'Latest ',
					h(
						'time',
						{ dateTime: latestPost.date },
						formatDateLabel( latestPost.date )
					)
			  )
			: null;
		const topicMetaSeparator = topicCountLabel
			? h( 'span', {
					className: 'hdc-blog-index__meta-sep',
					'aria-hidden': 'true',
			  } )
			: null;
		const topicMetaItem = topicCountLabel
			? h(
					'span',
					{ className: 'hdc-blog-index__hero-meta-item' },
					topicCountLabel
			  )
			: null;

		let heroMeta = null;
		if ( hasBlogPosts ) {
			heroMeta = h(
				'span',
				{
					className: 'hdc-blog-index__hero-meta',
					'data-contrast-probe': 'hero-meta-blog',
				},
				h(
					'span',
					{ className: 'hdc-blog-index__hero-meta-item' },
					publishedPostCountLabel
				),
				latestMetaSeparator,
				latestMetaItem,
				topicMetaSeparator,
				topicMetaItem
			);
		}

		const heroNode = h(
			'section',
			{
				className:
					'hdc-blog-index__hero ember-surface hdc-blog-reveal hdc-blog-reveal--fade-up-soft',
				style: { '--reveal-index': 0 },
			},
			h(
				'div',
				{ className: 'hdc-blog-index__hero-inner' },
				h(
					'header',
					{ className: 'hdc-blog-index__intro' },
					h(
						'p',
						{ className: 'hdc-blog-index__eyebrow' },
						'Writing'
					),
					h(
						'h1',
						{ className: 'hdc-blog-index__title' },
						BLOG_HEADING
					),
					h(
						'p',
						{ className: 'hdc-blog-index__description' },
						BLOG_DESCRIPTION
					),
					heroMeta
				)
			)
		);

		const loadingStateNode = h(
			'div',
			{ className: 'hdc-blog-index__state-card' },
			h(
				'span',
				{
					className: 'hdc-blog-index__state-icon-badge',
					'aria-hidden': 'true',
				},
				utils.renderLucideIcon
					? utils.renderLucideIcon( h, 'loader-2', {
							className:
								'hdc-blog-index__state-icon hdc-blog-index__spin',
							size: 18,
					  } )
					: null
			),
			h(
				'h2',
				{ className: 'hdc-blog-index__state-title' },
				'Loading posts'
			),
			h(
				'p',
				{ className: 'hdc-blog-index__state-description' },
				BLOG_LOADING_DESCRIPTION
			)
		);

		const errorStateNode = h(
			'div',
			{ className: 'hdc-blog-index__state-card' },
			h(
				'span',
				{
					className: 'hdc-blog-index__state-icon-badge',
					'aria-hidden': 'true',
				},
				utils.renderLucideIcon
					? utils.renderLucideIcon( h, 'alert-circle', {
							className: 'hdc-blog-index__state-icon',
							size: 18,
					  } )
					: null
			),
			h(
				'h2',
				{ className: 'hdc-blog-index__state-title' },
				'Could not load blog posts'
			),
			h(
				'p',
				{ className: 'hdc-blog-index__state-description' },
				BLOG_ERROR_DESCRIPTION
			),
			h(
				'button',
				{
					type: 'button',
					className: 'hdc-blog-index__retry',
					onClick() {
						setRetryCount( function ( count ) {
							return count + 1;
						} );
					},
				},
				'Try again'
			)
		);

		let featuredNode = null;
		if ( featured ) {
			const featuredImageNode = featured.featuredImageUrl
				? h(
						'div',
						{
							className: 'hdc-blog-index__featured-image-wrap',
						},
						h( 'img', {
							className: 'hdc-blog-index__featured-image',
							src: featured.featuredImageUrl,
							srcSet: featured.featuredImageSrcSet || undefined,
							sizes: '(min-width: 1280px) 1024px, (min-width: 1024px) 90vw, 100vw',
							alt: buildImageAlt( featured ),
							loading: 'eager',
							fetchPriority: 'high',
							decoding: 'async',
							onError: hideBrokenImage,
						} )
				  )
				: null;
			const featuredClockIcon = utils.renderLucideIcon
				? utils.renderLucideIcon( h, 'clock', { size: 12 } )
				: null;
			const featuredArrowIcon = utils.renderLucideIcon
				? utils.renderLucideIcon( h, 'arrow-right', { size: 14 } )
				: null;

			featuredNode = h(
				'a',
				{
					className:
						'hdc-blog-index__featured ember-surface focus-ring hdc-blog-reveal',
					href: buildPostUrl( featured, blogBaseUrl ),
					style: { '--reveal-index': 0 },
				},
				h(
					'span',
					{ className: 'hdc-blog-index__featured-pill' },
					'Featured'
				),
				featuredImageNode,
				h(
					'h2',
					{
						className: 'hdc-blog-index__featured-title',
						'data-contrast-probe': 'ember-title-blog',
					},
					featured.title
				),
				h(
					'p',
					{ className: 'hdc-blog-index__featured-excerpt' },
					featured.excerpt
				),
				h(
					'div',
					{ className: 'hdc-blog-index__featured-meta' },
					featuredClockIcon,
					h(
						'time',
						{ dateTime: featured.date },
						formatDateLabel( featured.date )
					),
					h( 'span', {}, featured.readingTime || '' ),
					h(
						'span',
						{ className: 'hdc-blog-index__featured-read' },
						'Read ',
						featuredArrowIcon
					)
				)
			);
		}

		let contextualBadge = null;
		if ( normalizedSearchLower ) {
			contextualBadge = h(
				'span',
				{ className: 'hdc-blog-index__badge' },
				'Search: ' + normalizedSearchTrimmed
			);
		} else if ( activeTag !== 'All' ) {
			contextualBadge = h(
				'span',
				{ className: 'hdc-blog-index__badge' },
				'Tag: ' + activeTag
			);
		} else if ( latestPost ) {
			contextualBadge = h(
				'span',
				{ className: 'hdc-blog-index__badge' },
				'Latest ' + formatDateLabel( latestPost.date )
			);
		}

		const browseCardNode = h(
			'section',
			{
				className:
					'hdc-blog-index__browse-card surface-inset-soft hdc-blog-reveal',
				style: { '--reveal-index': 0 },
			},
			h(
				'div',
				{ className: 'hdc-blog-index__browse-header' },
				h(
					'div',
					{ className: 'hdc-blog-index__browse-header-left' },
					h(
						'p',
						{ className: 'hdc-blog-index__eyebrow' },
						'Browse the archive'
					),
					h(
						'h2',
						{ className: 'hdc-blog-index__section-title' },
						'All Posts'
					),
					h(
						'p',
						{ className: 'hdc-blog-index__browse-description' },
						browseDescription
					)
				),
				h(
					'div',
					{ className: 'hdc-blog-index__browse-badges' },
					h(
						'span',
						{ className: 'hdc-blog-index__badge' },
						archiveSummaryLabel
					),
					contextualBadge
				)
			),
			h(
				'div',
				{ className: 'hdc-blog-index__filters' },
				h(
					'div',
					{ className: 'hdc-blog-index__search-wrap' },
					utils.renderLucideIcon
						? utils.renderLucideIcon( h, 'search', {
								size: 16,
								className: 'hdc-blog-index__search-icon',
						  } )
						: null,
					h( 'input', {
						type: 'search',
						className: 'hdc-blog-index__search',
						placeholder: 'Search posts...',
						value: search,
						onChange( event ) {
							setVisibleCount( BLOG_PAGE_SIZE );
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
								className:
									'hdc-blog-index__chip' +
									( isActive ? ' is-active' : '' ),
								onClick() {
									setVisibleCount( BLOG_PAGE_SIZE );
									setActiveTag( tag );
								},
								onKeyDown( event ) {
									handleChipKeyDown(
										event,
										tagIndex,
										allTags
									);
								},
								ref( node ) {
									chipRefs.current[ tagIndex ] = node;
								},
								key: 'tag-' + tag,
							},
							tag
						);
					} )
				)
			)
		);

		let archiveNode = null;
		if ( filtered.length === 0 ) {
			archiveNode = h(
				'div',
				{ className: 'hdc-blog-index__empty-state' },
				h(
					'div',
					{ className: 'hdc-blog-index__empty-icon-badge' },
					utils.renderLucideIcon
						? utils.renderLucideIcon( h, 'inbox', { size: 20 } )
						: null
				),
				h(
					'h2',
					{ className: 'hdc-blog-index__empty-title' },
					emptyStateTitle
				),
				h(
					'p',
					{ className: 'hdc-blog-index__empty-description' },
					emptyStateDescription
				)
			);
		} else {
			archiveNode = h(
				'div',
				{},
				h(
					'div',
					{ className: 'hdc-blog-index__list' },
					visiblePosts.map( function ( post, postIndex ) {
						const thumbnailSrcSet =
							post.featuredImageSrcSet || undefined;
						const thumbnailSizes = '(min-width: 640px) 112px, 96px';
						const thumbnailNode = post.featuredImageUrl
							? h(
									'div',
									{
										className:
											'hdc-blog-index__card-thumb-wrap',
									},
									h( 'img', {
										className: 'hdc-blog-index__card-thumb',
										src: post.featuredImageUrl,
										srcSet: thumbnailSrcSet,
										sizes: thumbnailSizes,
										alt: buildImageAlt( post ),
										loading: 'lazy',
										decoding: 'async',
										onError: hideBrokenImage,
									} )
							  )
							: null;
						const cardArrowIcon = utils.renderLucideIcon
							? utils.renderLucideIcon( h, 'arrow-right', {
									size: 14,
							  } )
							: null;

						return h(
							'a',
							{
								className:
									'hdc-blog-index__card focus-ring hdc-blog-reveal hdc-blog-reveal--fade-up-soft' +
									( post.featuredImageUrl
										? ' has-thumbnail'
										: '' ),
								href: buildPostUrl( post, blogBaseUrl ),
								key: post.slug,
								style: { '--reveal-index': postIndex },
							},
							thumbnailNode,
							h(
								'div',
								{ className: 'hdc-blog-index__card-main' },
								h(
									'h3',
									{ className: 'hdc-blog-index__card-title' },
									post.title
								),
								h(
									'p',
									{
										className:
											'hdc-blog-index__card-excerpt',
									},
									post.excerpt
								),
								h(
									'div',
									{ className: 'hdc-blog-index__tags' },
									post.tags.map( function ( tag ) {
										return h(
											'span',
											{
												className:
													'hdc-blog-index__tag',
												key: post.slug + '-tag-' + tag,
											},
											tag
										);
									} )
								)
							),
							h(
								'div',
								{ className: 'hdc-blog-index__card-meta' },
								h(
									'time',
									{ dateTime: post.date },
									formatDateLabel( post.date )
								),
								h( 'span', {}, post.readingTime || '' ),
								h(
									'span',
									{
										className:
											'hdc-blog-index__featured-read',
									},
									'Read ',
									cardArrowIcon
								)
							)
						);
					} )
				),
				filtered.length > visiblePosts.length
					? h(
							'div',
							{ className: 'hdc-blog-index__load-more' },
							h(
								'button',
								{
									type: 'button',
									className: 'hdc-blog-index__load-more-btn',
									onClick() {
										setVisibleCount( function ( current ) {
											return Math.min(
												current + BLOG_PAGE_SIZE,
												filtered.length
											);
										} );
									},
								},
								'Load more'
							)
					  )
					: null
			);
		}

		const ctaNode = h(
			'section',
			{ className: 'hdc-blog-index__cta surface-inset-soft' },
			h(
				'div',
				{ className: 'hdc-blog-index__cta-grid' },
				h(
					'div',
					{ className: 'hdc-blog-index__cta-left' },
					h(
						'p',
						{ className: 'hdc-blog-index__eyebrow' },
						'Keep up with the work'
					),
					h(
						'div',
						{},
						h(
							'h3',
							{ className: 'hdc-blog-index__cta-title' },
							'Stay updated'
						),
						h(
							'p',
							{ className: 'hdc-blog-index__cta-description' },
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
								href: githubUrl,
								target: '_blank',
								rel: 'noopener noreferrer',
							},
							utils.renderLucideIcon
								? utils.renderLucideIcon( h, 'github', {
										size: 16,
								  } )
								: null,
							h( 'span', {}, 'GitHub' )
						),
						h(
							'a',
							{
								className: 'hdc-blog-index__cta-social-link',
								href: linkedinUrl,
								target: '_blank',
								rel: 'noopener noreferrer',
							},
							utils.renderLucideIcon
								? utils.renderLucideIcon( h, 'linkedin', {
										size: 16,
								  } )
								: null,
							h( 'span', {}, 'LinkedIn' )
						)
					),
					h(
						'a',
						{
							className: 'hdc-blog-index__cta-secondary',
							href: contactUrl,
						},
						'Reach out'
					)
				),
				h( BlogSharePanel, { blogUrl: blogBaseUrl } )
			)
		);

		let contentNode = null;
		if ( isBlogLookupPending ) {
			contentNode = loadingStateNode;
		} else if ( hasBlogLookupError ) {
			contentNode = errorStateNode;
		} else {
			contentNode = h(
				element.Fragment,
				{},
				featuredNode,
				browseCardNode,
				archiveNode,
				ctaNode
			);
		}

		return h(
			'div',
			{},
			heroNode,
			h( 'div', { className: 'hdc-blog-index__content' }, contentNode )
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
