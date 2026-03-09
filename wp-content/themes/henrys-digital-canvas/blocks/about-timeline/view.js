( function ( wp ) {
	if ( ! wp || ! wp.element ) {
		return;
	}

	const element = wp.element;
	const h = element.createElement;
	const useEffect = element.useEffect;
	const createRoot = element.createRoot;
	const legacyRender = element.render;
	const renderLucideIcon =
		window.hdcSharedUtils && typeof window.hdcSharedUtils.renderLucideIcon === 'function'
			? window.hdcSharedUtils.renderLucideIcon
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

	function ensureObject( value ) {
		return value && typeof value === 'object' ? value : {};
	}

	function parseConfig( section ) {
		let parsed = {};
		try {
			parsed = JSON.parse( section.getAttribute( 'data-config' ) || '{}' );
		} catch ( error ) {
			parsed = {};
		}

		return {
			pageTitle: ensureString( parsed.pageTitle, 'About — Henry Perkins' ),
			heading: ensureString( parsed.heading, 'About Henry Perkins' ),
			intro: ensureArray( parsed.intro )
				.map( function ( paragraph ) {
					return ensureString( paragraph, '' );
				} )
				.filter( Boolean ),
			profile: ( function () {
				const profile = ensureObject( parsed.profile );
				const defaultImageUrl = 'https://www.gravatar.com/avatar/251a0a7f43fc6a5086ffa73cebc49ab2?s=384';
				const defaultCardAvatarUrl = 'https://www.gravatar.com/avatar/251a0a7f43fc6a5086ffa73cebc49ab2?s=128';
				return {
					imageUrl: ensureString( profile.imageUrl, defaultImageUrl ),
					imageAlt: ensureString( profile.imageAlt, 'Henry Perkins' ),
					cardAvatarUrl: ensureString( profile.cardAvatarUrl, defaultCardAvatarUrl ),
					cardName: ensureString( profile.cardName, 'Henry Perkins' ),
					cardTitle: ensureString( profile.cardTitle, 'Founder, Lakefront Digital' ),
					linkedinUrl: ensureString( profile.linkedinUrl, 'https://linkedin.com/in/henryperkins' ),
				};
			} )(),
			sectionLabels: {
				values: ensureString(
					parsed.sectionLabels && parsed.sectionLabels.values,
					'What I Value'
				),
				timeline: ensureString(
					parsed.sectionLabels && parsed.sectionLabels.timeline,
					'Career Path'
				),
			},
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

	function AboutTimelineApp( props ) {
		const config = props.config;

		useEffect(
			function () {
				document.title = config.pageTitle;
			},
			[ config.pageTitle ]
		);

		return h(
			'div',
			{},
			h( 'h1', { className: 'hdc-about-timeline__title' }, config.heading ),
			h(
				'div',
				{ className: 'hdc-about-timeline__intro hdc-about-timeline__intro--animated' },
				h(
					'div',
					{ className: 'hdc-about-timeline__intro-media' },
					config.profile.imageUrl
						? h( 'img', {
							className: 'hdc-about-timeline__portrait',
							src: config.profile.imageUrl,
							alt: config.profile.imageAlt,
							decoding: 'async',
							loading: 'eager',
						} )
						: h( 'div', { className: 'hdc-about-timeline__avatar', 'aria-hidden': 'true' }, 'HP' )
				),
				h(
					'div',
					{ className: 'hdc-about-timeline__copy' },
					config.intro.map( function ( paragraph, index ) {
						return h(
							'p',
							{
								className: 'hdc-about-timeline__text',
								key: 'intro-' + String( index ),
							},
							paragraph
						);
					} ),
					config.profile.linkedinUrl
						? h(
							'a',
							{
								className: 'hdc-about-timeline__profile-card',
								href: config.profile.linkedinUrl,
								target: '_blank',
								rel: 'noopener noreferrer',
								'aria-label': config.profile.cardName + ' ' + config.profile.cardTitle,
							},
							config.profile.cardAvatarUrl
								? h( 'img', {
									className: 'hdc-about-timeline__profile-avatar',
									src: config.profile.cardAvatarUrl,
									alt: '',
									decoding: 'async',
									loading: 'lazy',
								} )
								: null,
							h(
								'span',
								{ className: 'hdc-about-timeline__profile-copy' },
								h( 'span', { className: 'hdc-about-timeline__profile-name' }, config.profile.cardName ),
								h( 'span', { className: 'hdc-about-timeline__profile-title' }, config.profile.cardTitle )
							),
							h(
								'span',
								{ className: 'hdc-about-timeline__profile-icon', 'aria-hidden': 'true' },
								renderLucideIcon( h, 'linkedin', {
									className: 'hdc-about-timeline__profile-icon-svg',
									size: 18,
								} )
							)
						)
						: null
				)
			),
			config.showValues && config.valueCards.length
				? h(
					'section',
					{ className: 'hdc-about-timeline__section' },
					h(
						'h2',
						{ className: 'hdc-about-timeline__section-title' },
						config.sectionLabels.values
					),
					h(
						'div',
						{ className: 'hdc-about-timeline__values' },
						config.valueCards.map( function ( valueCard, index ) {
							return h(
								'article',
								{
									className: 'hdc-about-timeline__card',
									key: 'value-' + String( index ),
								},
								h( 'h3', { className: 'hdc-about-timeline__card-title' }, valueCard.title ),
								h( 'p', { className: 'hdc-about-timeline__text' }, valueCard.description )
							);
						} )
					)
				)
				: null,
			config.showTimeline && config.timeline.length
				? h(
					'section',
					{ className: 'hdc-about-timeline__section' },
					h(
						'h2',
						{ className: 'hdc-about-timeline__section-title' },
						config.sectionLabels.timeline
					),
					h(
						'ol',
						{ className: 'hdc-about-timeline__timeline' },
						config.timeline.map( function ( item, index ) {
							return h(
								'li',
								{
									className: 'hdc-about-timeline__row hdc-about-timeline__row--animated',
									key: item.id || 'timeline-' + String( index ),
									style: { '--hdc-row-delay': String( index * 60 ) + 'ms' },
								},
								h(
									'span',
									{ className: 'hdc-about-timeline__icon', 'aria-hidden': 'true' },
									renderLucideIcon( h, item.icon, { className: 'hdc-about-timeline__icon-svg', size: 16 } ) || '•'
								),
								h(
									'div',
									{ className: 'hdc-about-timeline__row-main' },
									h(
										'div',
										{ className: 'hdc-about-timeline__row-header' },
										h( 'h3', { className: 'hdc-about-timeline__row-title' }, item.title ),
										h(
											'p',
											{ className: 'hdc-about-timeline__year' },
											item.periodDateTime
												? h( 'time', { dateTime: item.periodDateTime }, item.periodLabel )
												: item.periodLabel
										)
									),
									h( 'p', { className: 'hdc-about-timeline__text' }, item.detail )
								)
							);
						} )
					)
				)
				: null
		);
	}

	function mountAboutTimeline( section ) {
		const rootNode = section.querySelector( '[data-hdc-about-timeline-root]' );
		if ( ! rootNode ) {
			return;
		}

		const app = h( AboutTimelineApp, { config: parseConfig( section ) } );
		if ( typeof createRoot === 'function' ) {
			createRoot( rootNode ).render( app );
			return;
		}

		legacyRender( app, rootNode );
	}

	document.querySelectorAll( '.hdc-about-timeline' ).forEach( mountAboutTimeline );
} )( window.wp );
