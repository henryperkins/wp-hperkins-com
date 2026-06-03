( function ( wp ) {
	if ( ! wp || ! wp.element || ! window.hdcSharedUtils ) {
		return;
	}

	const element = wp.element;
	const h = element.createElement;
	const Fragment = element.Fragment;
	const useEffect = element.useEffect;
	const useMemo = element.useMemo;
	const useState = element.useState;
	const createRoot = element.createRoot;
	const legacyRender = element.render;
	const utils = window.hdcSharedUtils;

	function parseConfig( section ) {
		let parsed = {};

		try {
			parsed = JSON.parse(
				section.getAttribute( 'data-config' ) || '{}'
			);
		} catch ( error ) {
			parsed = {};
		}

		return {
			title: utils.ensureString( parsed.title, 'Recent Writing' ),
			emptyTitle: utils.ensureString(
				parsed.emptyTitle,
				'Recent writing is updating'
			),
			emptyDescription: utils.ensureString( parsed.emptyDescription, '' ),
			errorTitle: utils.ensureString(
				parsed.errorTitle,
				'Could not load recent writing'
			),
			errorDescription: utils.ensureString(
				parsed.errorDescription,
				'The homepage writing feed is temporarily unavailable. Try again or visit the full blog index.'
			),
			blogCount: utils.clamp(
				Number.parseInt( parsed.blogCount, 10 ) || 3,
				1,
				6
			),
			blogEndpoint: utils.ensureString( parsed.blogEndpoint, '' ),
			initialPosts: parsed.initialPosts || {},
		};
	}

	function StateCard( props ) {
		const renderLucideIcon =
			utils.renderLucideIcon ||
			function () {
				return null;
			};
		return h(
			'div',
			{ className: 'hdc-home-page__empty-state ember-surface' },
			h(
				'span',
				{
					'aria-hidden': 'true',
					className: 'hdc-home-page__empty-state-icon',
				},
				renderLucideIcon( h, props.iconName, {
					className: 'hdc-home-page__empty-state-icon-svg',
					size: 20,
				} )
			),
			h( 'h2', { className: 'hdc-home-page__empty-title' }, props.title ),
			props.description
				? h(
						'p',
						{ className: 'hdc-home-page__empty' },
						props.description
				  )
				: null,
			props.action ? props.action : null
		);
	}

	function PostCard( props ) {
		const post = props.post;
		const readingTimeNode = post.readingTime
			? h( 'span', {}, post.readingTime )
			: null;
		let thumbnailNode = null;

		if ( post.thumbnailUrl ) {
			thumbnailNode = h(
				'div',
				{ className: 'hdc-home-page__post-thumb-wrap' },
				h( 'img', {
					alt: post.thumbnailAlt,
					className: 'hdc-feed-card-thumb',
					decoding: 'async',
					height: post.thumbnailHeight || undefined,
					loading: 'lazy',
					onError( event ) {
						event.target.style.display = 'none';
					},
					sizes: '(min-width: 640px) 112px, 96px',
					src: post.thumbnailUrl,
					srcSet: post.thumbnailSrcSet || undefined,
					width: post.thumbnailWidth || undefined,
				} )
			);
		}

		return h(
			'a',
			{
				className:
					'hdc-home-page__post-card focus-ring hdc-reveal hdc-reveal--slide-left',
				href: post.link,
				style: { '--reveal-index': props.revealIndex },
			},
			thumbnailNode,
			h(
				'div',
				{ className: 'hdc-home-page__post-body' },
				h(
					'h3',
					{
						className:
							'hdc-home-page__card-title hdc-home-page__card-title--row',
					},
					post.title
				),
				h(
					'p',
					{
						className:
							'hdc-home-page__card-copy hdc-home-page__card-copy--clamp',
					},
					post.excerpt
				),
				h(
					'div',
					{ className: 'hdc-home-page__post-meta' },
					h( 'time', { dateTime: post.date }, post.dateLabel ),
					readingTimeNode
				)
			)
		);
	}

	async function fetchPosts( config ) {
		const endpoint = utils.normalizePostsEndpoint(
			config.blogEndpoint,
			config.blogCount
		);
		const response = await fetch( endpoint, {
			headers: { Accept: 'application/json' },
		} );

		if ( ! response.ok ) {
			throw new Error(
				'Post request failed with status ' + response.status
			);
		}

		return utils.normalizePostsPayload(
			await response.json(),
			config.blogCount
		);
	}

	function RecentWritingApp( props ) {
		const config = props.config;
		const initialPosts = useMemo(
			function () {
				return utils.normalizePostsPayload(
					config.initialPosts,
					config.blogCount
				);
			},
			[ config.initialPosts, config.blogCount ]
		);
		const [ postsState, setPostsState ] = useState( {
			error: '',
			items: initialPosts,
			loading: initialPosts.length === 0,
		} );
		const [ reloadToken, setReloadToken ] = useState( 0 );

		useEffect(
			function () {
				let cancelled = false;

				fetchPosts( config )
					.then( function ( posts ) {
						if ( cancelled ) {
							return;
						}
						setPostsState( {
							error: '',
							items: posts.length ? posts : initialPosts,
							loading: false,
						} );
					} )
					.catch( function ( error ) {
						if ( cancelled ) {
							return;
						}
						setPostsState( {
							error:
								error instanceof Error
									? error.message
									: 'Recent writing is temporarily unavailable.',
							items: initialPosts,
							loading: false,
						} );
					} );

				return function () {
					cancelled = true;
				};
			},
			[ config, initialPosts, reloadToken ]
		);

		useEffect(
			function () {
				if ( typeof utils.initRevealObserver === 'function' ) {
					utils.initRevealObserver();
				}
			},
			[ postsState.loading, postsState.items ]
		);

		function handleRetry() {
			setPostsState( function ( previous ) {
				return { error: '', items: previous.items, loading: true };
			} );
			setReloadToken( function ( token ) {
				return token + 1;
			} );
		}

		if ( postsState.loading ) {
			return h( StateCard, {
				description:
					'Please wait while the latest posts are prepared for the homepage.',
				iconName: 'loader-2',
				title: 'Loading recent writing',
			} );
		}

		if ( postsState.items.length ) {
			return h(
				Fragment,
				{},
				postsState.items.map( function ( post, postIndex ) {
					return h( PostCard, {
						key: post.id,
						post,
						revealIndex: postIndex,
					} );
				} )
			);
		}

		if ( postsState.error ) {
			return h( StateCard, {
				action: h(
					'button',
					{
						className:
							'hdc-home-page__button hdc-home-page__button--secondary hdc-home-page__retry focus-ring',
						onClick: handleRetry,
						type: 'button',
					},
					'Try again'
				),
				description: config.errorDescription,
				iconName: 'alert-circle',
				title: config.errorTitle,
			} );
		}

		return h( StateCard, {
			description: config.emptyDescription,
			iconName: 'inbox',
			title: config.emptyTitle,
		} );
	}

	function mount( section ) {
		const stack = section.querySelector(
			'[data-hdc-home-recent-writing-stack]'
		);

		if ( ! stack ) {
			return;
		}

		const app = h( RecentWritingApp, { config: parseConfig( section ) } );

		if ( typeof createRoot === 'function' ) {
			createRoot( stack ).render( app );
			return;
		}

		legacyRender( app, stack );
	}

	function init() {
		document
			.querySelectorAll( '[data-hdc-home-recent-writing]' )
			.forEach( mount );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )( window.wp );
