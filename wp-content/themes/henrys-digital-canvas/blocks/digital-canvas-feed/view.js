( function ( wp ) {
	if ( ! wp || ! wp.element ) {
		return;
	}

	const createElement = wp.element.createElement;
	const useEffect = wp.element.useEffect;
	const useMemo = wp.element.useMemo;
	const useState = wp.element.useState;
	const createRoot = wp.element.createRoot;
	const render = wp.element.render;
	const utils = window.hdcSharedUtils || {};
	const renderLucideIcon =
		typeof utils.renderLucideIcon === 'function'
			? utils.renderLucideIcon
			: function () {
				return null;
			};

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

	function ensureString( value, fallback ) {
		if ( typeof value !== 'string' ) {
			return fallback;
		}

		const trimmed = value.trim();
		return trimmed || fallback;
	}

	function normalizePostsEndpoint( endpoint, count ) {
		const perPage = clamp( Number.parseInt( count, 10 ) || 3, 1, 10 );

		if ( ! endpoint ) {
			return '/wp-json/henrys-digital-canvas/v1/blog?limit=' + perPage;
		}

		try {
			const parsed = new URL( endpoint, window.location.origin );
			if ( ! parsed.searchParams.has( 'per_page' ) ) {
				parsed.searchParams.set( 'limit', String( perPage ) );
			}
			return parsed.toString();
		} catch ( error ) {
			const params = new URLSearchParams( {
				limit: String( perPage ),
			} );
			return withQuery( endpoint, params );
		}
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

	async function fetchPosts( config ) {
		const endpoint = normalizePostsEndpoint( config.postsEndpoint || config.blogEndpoint, config.blogCount );
		const response = await fetch( endpoint, {
			headers: {
				Accept: 'application/json',
			},
		} );

		if ( ! response.ok ) {
			throw new Error( 'Post request failed with status ' + response.status );
		}

		const payload = await response.json();
		const posts = payload && Array.isArray( payload.posts ) ? payload.posts : Array.isArray( payload ) ? payload : null;
		if ( ! posts ) {
			throw new Error( 'Post response format is invalid.' );
		}

		return posts.slice( 0, clamp( config.blogCount, 1, 10 ) ).map( function ( post ) {
			const slug = ensureString( post && post.slug, '' );
			const link = slug ? '/blog/' + encodeURIComponent( slug ) + '/' : ensureString( post && post.url, '#' );
			const title = stripHtml( post && ( post.title?.rendered || post.title ) ) || 'Untitled post';
			const excerpt = stripHtml( post && post.excerpt );

			return {
				id: post.id || link || title,
				title: title,
				excerpt: excerpt,
				link: link,
				dateLabel: formatDate( post.date ),
				readingTime: ensureString( post && post.readingTime, '' ),
			};
		} );
	}

	async function fetchRepos( config ) {
		const endpoint = ensureString(
			config.workEndpoint,
			'/wp-json/henrys-digital-canvas/v1/work?limit=' + String( clamp( config.repoCount, 1, 10 ) )
		);
		const response = await fetch( endpoint, {
			headers: {
				Accept: 'application/json',
			},
		} );

		if ( ! response.ok ) {
			throw new Error( 'GitHub request failed with status ' + response.status );
		}

		const payload = await response.json();
		const repos = payload && Array.isArray( payload.repos ) ? payload.repos : Array.isArray( payload ) ? payload : null;
		if ( ! repos ) {
			throw new Error( 'GitHub response format is invalid.' );
		}

		return repos
			.slice( 0, clamp( config.repoCount, 1, 10 ) )
			.map( function ( repo ) {
				return {
					id: repo.id || repo.name,
					name: repo.name || 'Unnamed repository',
					description: repo.description || 'No description provided.',
					language: repo.language || 'Unknown',
					url: repo.name ? '/work/' + encodeURIComponent( repo.name ) + '/' : '#',
					stars: Number.isFinite( Number( repo.stars ) ) ? Number( repo.stars ) : 0,
					updatedLabel: formatDate( repo.updatedAt ),
				};
			} );
	}

	function SectionList( props ) {
		const items = props.items || [];
		const type = props.type;
		const openInNewTab = !! props.openInNewTab;

		if ( items.length === 0 ) {
			return createElement(
				'p',
				{ className: 'hdc-feed-empty' },
				type === 'posts' ? 'No posts found.' : 'No repositories found.'
			);
		}

			return createElement(
				'ul',
				{ className: 'hdc-feed-list' },
				items.map( function ( item ) {
					const meta = type === 'posts'
						? createElement(
							'span',
							{ className: 'hdc-feed-meta-row' },
							item.dateLabel ? createElement( 'span', { className: 'hdc-feed-meta-item' }, item.dateLabel ) : null,
							item.readingTime
								? createElement(
									'span',
									{ className: 'hdc-feed-meta-item' },
									createElement(
										'span',
										{ className: 'hdc-feed-meta-icon', 'aria-hidden': 'true' },
										renderLucideIcon( createElement, 'clock', { className: 'hdc-feed-meta-icon-svg', size: 12 } )
									),
									createElement( 'span', null, item.readingTime )
								)
								: null
						)
						: createElement(
							'span',
							{ className: 'hdc-feed-meta-row' },
							createElement( 'span', { className: 'hdc-feed-meta-item' }, item.language ),
							createElement(
								'span',
								{ className: 'hdc-feed-meta-item' },
								createElement(
									'span',
									{ className: 'hdc-feed-meta-icon', 'aria-hidden': 'true' },
									renderLucideIcon( createElement, 'star', { className: 'hdc-feed-meta-icon-svg', size: 12 } )
								),
								createElement( 'span', null, String( item.stars ) )
							),
							item.updatedLabel
								? createElement(
									'span',
									{ className: 'hdc-feed-meta-item' },
									createElement(
										'span',
										{ className: 'hdc-feed-meta-icon', 'aria-hidden': 'true' },
										renderLucideIcon( createElement, 'clock', { className: 'hdc-feed-meta-icon-svg', size: 12 } )
									),
									createElement( 'span', null, item.updatedLabel )
								)
								: null
						);

				return createElement(
					'li',
					{ className: 'hdc-feed-item', key: item.id },
					createElement(
						'a',
						{
							className: 'hdc-feed-link',
							href: item.link || item.url,
							target: openInNewTab ? '_blank' : undefined,
							rel: openInNewTab ? 'noopener noreferrer' : undefined,
						},
						type === 'posts' ? item.title : item.name
					),
					createElement(
						'p',
						{ className: 'hdc-feed-meta' },
						meta
					),
					createElement(
						'p',
						{ className: 'hdc-feed-description' },
						item.excerpt || item.description
					)
				);
			} )
		);
	}

	function FeedApp( props ) {
		const config = props.config;
		const [ state, setState ] = useState( {
			loading: true,
			error: '',
			posts: [],
			repos: [],
		} );

		const configSignature = useMemo( function () {
			return JSON.stringify( config );
		}, [ config ] );

		useEffect( function () {
			document.title = 'Henry Perkins — Customer-Facing Technical Consultant';
		}, [] );

		useEffect( function () {
			let isCancelled = false;

			async function load() {
				setState( function ( current ) {
					return {
						loading: true,
						error: '',
						posts: current.posts,
						repos: current.repos,
					};
				} );

				const tasks = [];
				if ( config.showBlog ) {
					tasks.push( fetchPosts( config ) );
				}
				if ( config.showRepos ) {
					tasks.push( fetchRepos( config ) );
				}

				const results = await Promise.allSettled( tasks );
				if ( isCancelled ) {
					return;
				}

				const nextPosts = [];
				const nextRepos = [];
				const errors = [];
				let taskIndex = 0;

				if ( config.showBlog ) {
					const postResult = results[ taskIndex++ ];
					if ( postResult.status === 'fulfilled' ) {
						nextPosts.push.apply( nextPosts, postResult.value );
					} else {
						errors.push( 'Failed to load posts.' );
					}
				}

				if ( config.showRepos ) {
					const repoResult = results[ taskIndex++ ];
					if ( repoResult.status === 'fulfilled' ) {
						nextRepos.push.apply( nextRepos, repoResult.value );
					} else {
						errors.push( 'Failed to load repositories.' );
					}
				}

				setState( {
					loading: false,
					error: errors.join( ' ' ),
					posts: nextPosts,
					repos: nextRepos,
				} );
			}

			load().catch( function () {
				if ( isCancelled ) {
					return;
				}
				setState( {
					loading: false,
					error: 'Unable to load feed data.',
					posts: [],
					repos: [],
				} );
			} );

			return function () {
				isCancelled = true;
			};
		}, [ configSignature, config ] );

		return createElement(
			'div',
			{ className: 'hdc-feed-shell' },
			createElement( 'h3', { className: 'hdc-feed-heading' }, config.heading ),
			state.loading && createElement( 'p', { className: 'hdc-feed-loading' }, 'Loading feed…' ),
			( ! state.loading && state.error ) && createElement( 'p', { className: 'hdc-feed-error' }, state.error ),
			createElement(
				'div',
				{ className: 'hdc-feed-grid' },
				config.showBlog && createElement(
					'section',
					{ className: 'hdc-feed-section' },
					createElement( 'h4', { className: 'hdc-feed-section-title' }, 'Recent Posts' ),
					createElement( SectionList, {
						type: 'posts',
						items: state.posts,
						openInNewTab: config.openInNewTab,
					} )
				),
				config.showRepos && createElement(
					'section',
					{ className: 'hdc-feed-section' },
					createElement( 'h4', { className: 'hdc-feed-section-title' }, 'Recent Repositories' ),
					createElement( SectionList, {
						type: 'repos',
						items: state.repos,
						openInNewTab: config.openInNewTab,
					} )
				)
			)
		);
	}

	function mountFeed( container ) {
		if ( ! container ) {
			return;
		}

		let config = {};
		const rawConfig = container.getAttribute( 'data-config' ) || '{}';

		try {
			config = JSON.parse( rawConfig );
		} catch ( error ) {
			config = {};
		}

		const rootNode = container.querySelector( '[data-hdc-feed-root]' ) || container;
		const component = createElement( FeedApp, { config: config } );

		if ( typeof createRoot === 'function' ) {
			createRoot( rootNode ).render( component );
			return;
		}

		render( component, rootNode );
	}

	document
		.querySelectorAll( '.wp-block-henrys-digital-canvas-digital-canvas-feed' )
		.forEach( mountFeed );
} )( window.wp );
