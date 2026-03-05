( function ( wp ) {
	if ( ! wp || ! wp.element ) {
		return;
	}

	const element = wp.element;
	const h = element.createElement;
	const useEffect = element.useEffect;
	const useMemo = element.useMemo;
	const createRoot = element.createRoot;
	const legacyRender = element.render;
	const renderLucideIcon =
		window.hdcSharedUtils && typeof window.hdcSharedUtils.renderLucideIcon === 'function'
			? window.hdcSharedUtils.renderLucideIcon
			: function () {
				return null;
			};

	const INTRO_PARAGRAPHS = [
		"I'm Henry T. Perkins, based in Lisle, Illinois and open to US remote opportunities. I help support, product, and implementation teams solve customer-facing technical problems.",
		'My background spans SaaS support, developer community enablement, web consulting, and operations leadership. I focus on practical outcomes: resolving complex issues, documenting repeatable solutions, integrating APIs, and turning feedback into clear action.',
		'Today, through Lakefront Digital, I build and support WordPress, WooCommerce, Cloudflare, and AI-assisted solutions for small businesses and nonprofits. I have also volunteered in WordPress community events and continue to prioritize mentorship-oriented, people-first technical work.',
	];

	const VALUES = [
		{
			title: 'Customer Empathy',
			desc: 'Strong communication and calm escalation handling are core to how I support users and teams.',
		},
		{
			title: 'Clarity',
			desc: 'Clear documentation, reproducible debugging steps, and direct handoffs help teams move faster.',
		},
		{
			title: 'Execution',
			desc: 'I prioritize practical, end-to-end delivery from discovery and scoping through deployment and support.',
		},
	];

	const TIMELINE = [
		{ year: '2007-2008', title: 'Writing Coach / Editor', detail: 'Youth Communication Chicago and Journalism & Mass Communications studies', icon: 'calendar' },
		{ year: '2009-2012', title: 'Customer Service Representative', detail: 'Micro Center; supported customers in a fast-paced technology retail environment', icon: 'briefcase' },
		{ year: '2012', title: 'Community Manager', detail: 'Built and grew the PageLines developer community and App Store ecosystem', icon: 'users' },
		{ year: '2012', title: 'Happiness Engineer', detail: 'Supported WordPress.com users globally at Automattic', icon: 'heart' },
		{ year: '2013', title: 'Associate Degree Completed', detail: 'Business Administration & Management, College of DuPage', icon: 'graduation-cap' },
		{ year: '2015-2017', title: 'Freelance Artist / Consultant', detail: 'Clinique; focused on customer education and service', icon: 'briefcase' },
		{ year: '2018-2019', title: 'Starbucks Manager', detail: 'Sodexo; managed staffing, food safety, and service standards', icon: 'briefcase' },
		{ year: '2019-2022', title: 'Shift Supervisor', detail: 'Starbucks; led high-volume operations and team coaching', icon: 'briefcase' },
		{ year: '2022-Present', title: 'Founder, Lakefront Digital', detail: 'Delivering end-to-end web and IT consulting engagements', icon: 'code' },
		{ year: 'Expected May 2026', title: 'B.S. in Progress', detail: 'Organizational Leadership, Arizona State University', icon: 'graduation-cap' },
	];

	function ensureString( value, fallback ) {
		if ( typeof value !== 'string' ) {
			return fallback;
		}
		const trimmed = value.trim();
		return trimmed || fallback;
	}

	function parseConfig( section ) {
		let parsed = {};
		try {
			parsed = JSON.parse( section.getAttribute( 'data-config' ) || '{}' );
		} catch ( error ) {
			parsed = {};
		}

		return {
			heading: ensureString( parsed.heading, 'About Henry Perkins' ),
			showValues: !! parsed.showValues,
			showTimeline: !! parsed.showTimeline,
		};
	}

	function AboutTimelineApp( props ) {
		const config = props.config;
		const timeline = useMemo( function () {
			return TIMELINE;
		}, [] );

		useEffect( function () {
			document.title = 'About — Henry Perkins';
		}, [] );

		return h(
			'div',
			{},
			h( 'h1', { className: 'hdc-about-timeline__title' }, config.heading || 'About Henry Perkins' ),
			h(
				'div',
				{ className: 'hdc-about-timeline__intro hdc-about-timeline__intro--animated' },
				h( 'div', { className: 'hdc-about-timeline__avatar', 'aria-hidden': 'true' }, 'HP' ),
				h(
					'div',
					{ className: 'hdc-about-timeline__copy' },
					INTRO_PARAGRAPHS.map( function ( paragraph, index ) {
						return h( 'p', { className: 'hdc-about-timeline__text', key: 'intro-' + String( index ) }, paragraph );
					} )
				)
			),
			config.showValues
				? h(
					'section',
					{ className: 'hdc-about-timeline__section' },
					h( 'h3', { className: 'hdc-about-timeline__section-title' }, 'What I Value' ),
					h(
						'div',
						{ className: 'hdc-about-timeline__values' },
						VALUES.map( function ( value, index ) {
							return h(
								'article',
								{ className: 'hdc-about-timeline__card', key: 'value-' + String( index ) },
								h( 'h4', { className: 'hdc-about-timeline__card-title' }, value.title ),
								h( 'p', { className: 'hdc-about-timeline__text' }, value.desc )
							);
						} )
					)
				)
				: null,
			config.showTimeline
				? h(
					'section',
					{ className: 'hdc-about-timeline__section' },
					h( 'h3', { className: 'hdc-about-timeline__section-title' }, 'Timeline' ),
					h(
						'ul',
						{ className: 'hdc-about-timeline__timeline' },
						timeline.map( function ( item, index ) {
							return h(
								'li',
								{
									className: 'hdc-about-timeline__row hdc-about-timeline__row--animated',
									style: { '--hdc-row-delay': String( index * 60 ) + 'ms' },
									key: 'timeline-' + String( index ),
								},
								h(
									'span',
									{ className: 'hdc-about-timeline__icon', 'aria-hidden': 'true' },
									renderLucideIcon( h, item.icon, { className: 'hdc-about-timeline__icon-svg', size: 16 } ) || '•'
								),
								h(
									'div',
									{ className: 'hdc-about-timeline__row-main' },
									h( 'p', { className: 'hdc-about-timeline__year' }, item.year ),
									h( 'h4', { className: 'hdc-about-timeline__row-title' }, item.title ),
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
		} else {
			legacyRender( app, rootNode );
		}
	}

	document.querySelectorAll( '.hdc-about-timeline' ).forEach( mountAboutTimeline );
} )( window.wp );
