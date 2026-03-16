( function ( wp ) {
	if ( ! wp || ! wp.element ) {
		return;
	}

	const element = wp.element;
	const h = element.createElement;
	const Fragment = element.Fragment;
	const useEffect = element.useEffect;
	const useState = element.useState;
	const createRoot = element.createRoot;
	const legacyRender = element.render;
	const renderLucideIcon =
		window.hdcSharedUtils && typeof window.hdcSharedUtils.renderLucideIcon === 'function'
			? window.hdcSharedUtils.renderLucideIcon
			: function () {
				return null;
			};

	let aboutRevealObserver = null;

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

	function ensureObject( value ) {
		return value && typeof value === 'object' ? value : {};
	}

	function ensureTextArray( value ) {
		return ensureArray( value )
			.map( function ( entry ) {
				return ensureString( entry, '' );
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

		const profile = ensureObject( parsed.profile );
		const sectionLabels = ensureObject( parsed.sectionLabels );

		return {
			heading: ensureString( parsed.heading, 'About Henry Perkins' ),
			heroDescription: ensureString(
				parsed.heroDescription,
				'Customer-facing technical consultant focused on AI-assisted workflows, WordPress delivery, and practical systems that help support and product teams work more clearly.'
			),
			intro: ensureTextArray( parsed.intro ),
			profile: {
				imageUrl: ensureString(
					profile.imageUrl,
					'https://www.gravatar.com/avatar/251a0a7f43fc6a5086ffa73cebc49ab2?s=384'
				),
				imageAlt: ensureString( profile.imageAlt, 'Henry Perkins' ),
				cardAvatarUrl: ensureString(
					profile.cardAvatarUrl,
					'https://www.gravatar.com/avatar/251a0a7f43fc6a5086ffa73cebc49ab2?s=128'
				),
				cardName: ensureString( profile.cardName, 'Henry Perkins' ),
				cardSubtitle: ensureString(
					profile.cardSubtitle,
					'Where tech meets tenacity \u2014 and Java isn\u2019t just coffee'
				),
				linkedinUrl: ensureString( profile.linkedinUrl, 'https://linkedin.com/in/henryperkins' ),
			},
			sectionLabels: {
				capabilities: ensureString(
					sectionLabels.capabilities,
					'AI all day. Everything else too.'
				),
				values: ensureString( sectionLabels.values, 'What I Value' ),
				timeline: ensureString( sectionLabels.timeline, 'Career Path' ),
			},
			capabilities: ensureArray( parsed.capabilities )
				.filter( function ( capability ) {
					return capability && typeof capability === 'object';
				} )
				.map( function ( capability ) {
					return {
						title: ensureString( capability.title, 'Untitled capability' ),
						icon: ensureString( capability.icon, 'wrench' ),
						description: ensureTextArray( capability.description ),
					};
				} ),
			valueCards: ensureArray( parsed.valueCards )
				.filter( function ( valueCard ) {
					return valueCard && typeof valueCard === 'object';
				} )
				.map( function ( valueCard ) {
					return {
						title: ensureString( valueCard.title, 'Untitled' ),
						description: ensureString( valueCard.description, '' ),
					};
				} ),
			timeline: ensureArray( parsed.timeline )
				.filter( function ( item ) {
					return item && typeof item === 'object';
				} )
				.map( function ( item ) {
					return {
						id: ensureString( item.id, 'timeline-item' ),
						periodLabel: ensureString( item.periodLabel, '' ),
						periodDateTime: ensureString( item.periodDateTime, '' ),
						title: ensureString( item.title, 'Untitled milestone' ),
						detail: ensureString( item.detail, '' ),
						icon: ensureString( item.icon, 'briefcase' ),
					};
				} ),
			showValues: parsed.showValues !== false,
			showTimeline: parsed.showTimeline !== false,
		};
	}

	function disconnectAboutReveals() {
		if ( aboutRevealObserver ) {
			aboutRevealObserver.disconnect();
			aboutRevealObserver = null;
		}
	}

	function initAboutReveals( rootNode ) {
		disconnectAboutReveals();

		if ( ! rootNode ) {
			return;
		}

		const elements = rootNode.querySelectorAll( '.hdc-about-timeline__reveal:not(.is-visible)' );
		if ( ! elements.length ) {
			return;
		}

		if ( typeof IntersectionObserver === 'undefined' ) {
			elements.forEach( function ( entry ) {
				entry.classList.add( 'is-visible' );
			} );
			return;
		}

		aboutRevealObserver = new IntersectionObserver(
			function ( entries ) {
				entries.forEach( function ( entry ) {
					if ( entry.isIntersecting ) {
						entry.target.classList.add( 'is-visible' );
						aboutRevealObserver.unobserve( entry.target );
					}
				} );
			},
			{ threshold: 0.1 }
		);

		elements.forEach( function ( entry ) {
			const rect = entry.getBoundingClientRect();
			const isAboveFold = rect.top < window.innerHeight && rect.bottom > 0;

			if ( isAboveFold ) {
				entry.classList.add( 'is-visible' );
				return;
			}

			aboutRevealObserver.observe( entry );
		} );
	}

	function ProfileAvatar( props ) {
		const [ imgFailed, setImgFailed ] = useState( false );

		useEffect(
			function () {
				setImgFailed( false );
			},
			[ props.imageUrl ]
		);

		const showImage = !! props.imageUrl && ! imgFailed;

		return h(
			'div',
			{ className: 'hdc-about-timeline__avatar-frame ember-surface' },
			showImage
				? h( 'img', {
					className: 'hdc-about-timeline__portrait',
					src: props.imageUrl,
					alt: props.imageAlt,
					decoding: 'async',
					loading: 'eager',
					onError: function () {
						setImgFailed( true );
					},
				} )
				: h(
					'div',
					{
						className: 'hdc-about-timeline__avatar-fallback avatar-monogram-surface',
						'aria-hidden': 'true',
					},
					h( 'span', { className: 'hdc-about-timeline__avatar-initials' }, props.initials || 'HP' )
				)
		);
	}

	function LinkedInBadge( props ) {
		const profile = props.profile;
		if ( ! profile.linkedinUrl ) {
			return null;
		}

		return h(
			'a',
			{
				className: 'hdc-about-timeline__profile-card focus-ring',
				href: profile.linkedinUrl,
				target: '_blank',
				rel: 'noopener noreferrer',
				'aria-label': [ profile.cardName, profile.cardSubtitle, 'Open LinkedIn profile' ]
					.filter( Boolean )
					.join( '. ' ),
			},
			profile.cardAvatarUrl
				? h( 'img', {
					className: 'hdc-about-timeline__profile-avatar',
					src: profile.cardAvatarUrl,
					alt: '',
					decoding: 'async',
					loading: 'lazy',
				} )
				: null,
			h(
				'span',
				{ className: 'hdc-about-timeline__profile-copy' },
				h( 'span', { className: 'hdc-about-timeline__profile-name' }, profile.cardName ),
				h( 'span', { className: 'hdc-about-timeline__profile-subtitle' }, profile.cardSubtitle )
			),
			h(
				'span',
				{ className: 'hdc-about-timeline__profile-icon', 'aria-hidden': 'true' },
				renderLucideIcon( h, 'linkedin', {
					className: 'hdc-about-timeline__profile-icon-svg',
					size: 20,
				} )
			)
		);
	}

	function CapabilityCard( props ) {
		return h(
			'article',
			{ className: 'hdc-about-timeline__capability-card ember-surface' },
			h(
				'div',
				{ className: 'hdc-about-timeline__capability-label' },
				h(
					'span',
					{ className: 'hdc-about-timeline__capability-icon', 'aria-hidden': 'true' },
					renderLucideIcon( h, props.capability.icon, {
						className: 'hdc-about-timeline__capability-icon-svg',
						size: 18,
					} )
				),
				h( 'span', { className: 'text-eyebrow hdc-about-timeline__kicker' }, 'What I do' )
			),
			h(
				'div',
				{ className: 'hdc-about-timeline__capability-copy' },
				h(
					'h3',
					{ className: 'text-card-title hdc-about-timeline__capability-title' },
					props.capability.title
				),
				props.capability.description.map( function ( paragraph, index ) {
					return h(
						'p',
						{
							className: 'hdc-about-timeline__capability-text',
							key: props.capability.title + '-paragraph-' + String( index ),
						},
						paragraph
					);
				} )
			)
		);
	}

	function ValueCard( props ) {
		return h(
			'article',
			{ className: 'hdc-about-timeline__value-card' },
			h( 'h3', { className: 'hdc-about-timeline__value-title' }, props.valueCard.title ),
			h( 'p', { className: 'hdc-about-timeline__value-text text-body-sm' }, props.valueCard.description )
		);
	}

	function TimelineItem( props ) {
		const item = props.item;

		return h(
			'li',
			{
				className: 'hdc-about-timeline__timeline-item hdc-about-timeline__reveal hdc-about-timeline__reveal--slide-inline',
				style: { '--reveal-index': String( props.index ) },
			},
			h(
				'span',
				{ className: 'hdc-about-timeline__icon-badge', 'aria-hidden': 'true' },
				renderLucideIcon( h, item.icon, {
					className: 'hdc-about-timeline__icon-svg',
					size: 16,
				} ) || '•'
			),
			h(
				'div',
				{ className: 'hdc-about-timeline__timeline-main' },
				h(
					'div',
					{ className: 'hdc-about-timeline__timeline-header' },
					h( 'h3', { className: 'hdc-about-timeline__row-title text-heading-base' }, item.title ),
					h(
						'p',
						{ className: 'hdc-about-timeline__year text-year-label' },
						item.periodDateTime
							? h( 'time', { dateTime: item.periodDateTime }, item.periodLabel )
							: item.periodLabel
					)
				),
				h( 'p', { className: 'hdc-about-timeline__timeline-text text-body-sm' }, item.detail )
			)
		);
	}

	function AboutTimelineApp( props ) {
		const config = props.config;

		useEffect(
			function () {
				if ( ! props.mountNode ) {
					return undefined;
				}

				if ( typeof window.requestAnimationFrame === 'function' ) {
					window.requestAnimationFrame( function () {
						initAboutReveals( props.mountNode );
					} );
				} else {
					window.setTimeout( function () {
						initAboutReveals( props.mountNode );
					}, 0 );
				}

				return function () {
					disconnectAboutReveals();
				};
			},
			[ props.mountNode ]
		);

		return h(
			Fragment,
			null,
			h(
				'section',
				{
					className: 'hdc-about-timeline__hero ember-surface hdc-about-timeline__reveal',
					style: { '--reveal-index': '0' },
				},
				h(
					'div',
					{ className: 'hdc-about-timeline__hero-shell' },
					h( 'p', { className: 'hdc-about-timeline__eyebrow text-eyebrow' }, 'About' ),
					h( 'h1', { className: 'hdc-about-timeline__hero-title text-page-title' }, config.heading ),
					h(
						'p',
						{ className: 'hdc-about-timeline__hero-description' },
						config.heroDescription
					)
				)
			),
			h(
				'div',
				{
					className: 'hdc-about-timeline__content-shell hdc-about-timeline__reveal hdc-about-timeline__reveal--fade-up-soft',
					style: { '--reveal-index': '1' },
				},
				h(
					'div',
					{ className: 'hdc-about-timeline__content-flow' },
					h(
						'section',
						{ className: 'hdc-about-timeline__intro-layout' },
						h( ProfileAvatar, {
							imageUrl: config.profile.imageUrl,
							imageAlt: config.profile.imageAlt,
							initials: 'HP',
						} ),
						h(
							'div',
							{ className: 'hdc-about-timeline__intro-copy' },
							config.intro.map( function ( paragraph, index ) {
								return h(
									'p',
									{
										className: 'hdc-about-timeline__text hdc-about-timeline__intro-text text-body-copy',
										key: 'intro-' + String( index ),
									},
									paragraph
								);
							} ),
							h( LinkedInBadge, { profile: config.profile } )
						)
					),
					config.capabilities.length
						? h(
							'section',
							{ className: 'hdc-about-timeline__section hdc-about-timeline__section--capabilities' },
							h(
								'div',
								{ className: 'hdc-about-timeline__section-header' },
								h( 'h2', { className: 'hdc-about-timeline__section-title' }, config.sectionLabels.capabilities )
							),
							h(
								'div',
								{ className: 'hdc-about-timeline__capabilities-grid' },
								config.capabilities.map( function ( capability, index ) {
									return h( CapabilityCard, {
										capability: capability,
										key: capability.title || 'capability-' + String( index ),
									} );
								} )
							)
						)
						: null,
					config.showValues && config.valueCards.length
						? h(
							'section',
							{ className: 'hdc-about-timeline__section' },
							h(
								'div',
								{ className: 'hdc-about-timeline__section-header' },
								h( 'h2', { className: 'hdc-about-timeline__section-title' }, config.sectionLabels.values )
							),
							h(
								'div',
								{ className: 'hdc-about-timeline__values-grid' },
								config.valueCards.map( function ( valueCard, index ) {
									return h( ValueCard, {
										valueCard: valueCard,
										key: valueCard.title || 'value-' + String( index ),
									} );
								} )
							)
						)
						: null,
					config.showTimeline && config.timeline.length
						? h(
							'section',
							{ className: 'hdc-about-timeline__section' },
							h(
								'div',
								{ className: 'hdc-about-timeline__section-header hdc-about-timeline__section-header--timeline' },
								h( 'h2', { className: 'hdc-about-timeline__section-title' }, config.sectionLabels.timeline )
							),
							h(
								'ol',
								{ className: 'hdc-about-timeline__timeline' },
								config.timeline.map( function ( item, index ) {
									return h( TimelineItem, {
										item: item,
										index: index,
										key: item.id || 'timeline-' + String( index ),
									} );
								} )
							)
						)
						: null
				)
			)
		);
	}

	function mountAboutTimeline( section ) {
		const rootNode = section.querySelector( '[data-hdc-about-timeline-root]' );
		if ( ! rootNode ) {
			return;
		}

		const app = h( AboutTimelineApp, {
			config: parseConfig( section ),
			mountNode: rootNode,
		} );

		if ( typeof createRoot === 'function' ) {
			createRoot( rootNode ).render( app );
			return;
		}

		legacyRender( app, rootNode );
	}

	document.querySelectorAll( '.hdc-about-timeline' ).forEach( mountAboutTimeline );
} )( window.wp );
