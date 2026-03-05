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

	const SECTION_ICONS = {
		'Impact at a Glance': 'trending-up',
		'Capability Map': 'layers',
		'Experience': 'briefcase',
		'Education': 'graduation-cap',
		'Signature Work': 'folder-open',
		'Projects': 'folder-open',
		'Skills': 'wrench',
		'Certifications': 'award',
		'What Makes This Profile Different': 'sparkles',
	};

	function sectionTitle( title ) {
		var iconName = SECTION_ICONS[ title ] || '';
		var icon = iconName
			? h( 'span', { className: 'hdc-resume-overview__section-icon', 'aria-hidden': 'true' }, renderLucideIcon( h, iconName, { className: 'hdc-resume-overview__section-icon-svg', size: 18 } ) || null )
			: null;
		return h( 'h3', { className: 'hdc-resume-overview__section-title' }, icon, ' ', title );
	}

	function ensureArray( value ) {
		return Array.isArray( value ) ? value : [];
	}

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
			heading: ensureString( parsed.heading, 'Resume' ),
			intro: ensureString( parsed.intro, '' ),
			showAtsLink: !! parsed.showAtsLink,
			endpoint: ensureString( parsed.endpoint, '' ),
			fallbackUrl: ensureString( parsed.fallbackUrl, '' ),
			atsUrl: ensureString( parsed.atsUrl, '/resume/ats/' ),
			portfolioUrl: ensureString( parsed.portfolioUrl, 'https://hperkins.com' ),
		};
	}

	async function fetchJson( url ) {
		if ( ! url ) {
			throw new Error( 'Missing URL' );
		}

		const response = await fetch( url, {
			headers: {
				Accept: 'application/json',
			},
		} );

		if ( ! response.ok ) {
			throw new Error( 'Request failed with status ' + response.status );
		}

		return response.json();
	}

	function resolveContractData( payload ) {
		if ( payload && typeof payload === 'object' && payload.data && typeof payload.data === 'object' ) {
			return payload.data;
		}
		return payload;
	}

	function ResumeOverviewApp( props ) {
		const config = props.config;
		const [ state, setState ] = useState( {
			loading: true,
			error: '',
			data: null,
		} );

		const signature = useMemo( function () {
			return JSON.stringify( config );
		}, [ config ] );

		useEffect( function () {
			document.title = 'Resume — Henry Perkins';
		}, [] );

		useEffect(
			function () {
				let cancelled = false;

				async function load() {
					setState( {
						loading: true,
						error: '',
						data: null,
					} );

					try {
						const contractPayload = await fetchJson( config.endpoint );
						const contractData = resolveContractData( contractPayload );
						if ( ! cancelled ) {
							setState( {
								loading: false,
								error: '',
								data: contractData,
							} );
						}
						return;
					} catch ( primaryError ) {
						try {
							const fallbackPayload = await fetchJson( config.fallbackUrl );
							if ( ! cancelled ) {
								setState( {
									loading: false,
									error: '',
									data: fallbackPayload,
								} );
							}
						} catch ( fallbackError ) {
							if ( ! cancelled ) {
								setState( {
									loading: false,
									error: 'Unable to load resume data.',
									data: null,
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

		if ( state.loading ) {
			return h( 'p', { className: 'hdc-resume-overview__status' }, 'Loading resume…' );
		}

		if ( state.error ) {
			return h( 'p', { className: 'hdc-resume-overview__error' }, state.error );
		}

		const data = state.data;
		if ( ! data || typeof data !== 'object' ) {
			return h( 'p', { className: 'hdc-resume-overview__error' }, 'Resume data is unavailable.' );
		}

		const targetRoles = ensureArray( data.targetRoles );
		const impactStrip = ensureArray( data.impactStrip );
		const capabilityMap = ensureArray( data.capabilityMap );
		const experience = ensureArray( data.experience );
		const education = ensureArray( data.education );
		const projects = ensureArray( data.projects );
		const skills = ensureArray( data.skills );
		const certifications = ensureArray( data.certifications );

		return h(
			'div',
			{},
			h(
				'header',
				{ className: 'hdc-resume-overview__hero' },
				h( 'p', { className: 'hdc-resume-overview__eyebrow' }, config.heading || 'Resume' ),
				h( 'h2', { className: 'hdc-resume-overview__title' }, ensureString( data.headline, 'Resume' ) ),
				h( 'p', { className: 'hdc-resume-overview__subtitle' }, ensureString( data.subheadline, '' ) ),
				config.intro ? h( 'p', { className: 'hdc-resume-overview__intro' }, config.intro ) : null,
				targetRoles.length
					? h(
						'div',
						{ className: 'hdc-resume-overview__roles' },
						targetRoles.map( function ( role ) {
							return h( 'span', { className: 'hdc-resume-overview__badge', key: role }, role );
						} )
					)
					: null,
				config.showAtsLink
					? h(
						'div',
						{ className: 'hdc-resume-overview__actions' },
						h( 'a', { className: 'hdc-resume-overview__action', href: config.atsUrl }, 'ATS one-page resume' ),
						config.portfolioUrl
							? h(
								'a',
								{
									className: 'hdc-resume-overview__action hdc-resume-overview__action--secondary',
									href: config.portfolioUrl,
									target: '_blank',
									rel: 'noopener noreferrer',
								},
								'Portfolio'
							)
							: null
					)
					: null
			),
			impactStrip.length
				? h(
					'section',
					{ className: 'hdc-resume-overview__section' },
					sectionTitle( 'Impact at a Glance' ),
					h(
						'div',
						{ className: 'hdc-resume-overview__metrics' },
						impactStrip.map( function (metric, index) {
							const value = ensureString( metric && metric.value, '' );
							const label = ensureString( metric && metric.label, '' );
							return h(
								'article',
								{ className: 'hdc-resume-overview__card', key: value + '-' + String( index ) },
								h( 'span', { className: 'hdc-resume-overview__metric-value' }, value ),
								h( 'span', { className: 'hdc-resume-overview__metric-label' }, label )
							);
						} )
					)
				)
				: null,
			h(
				'section',
				{ className: 'hdc-resume-overview__section' },
				h( 'h3', { className: 'hdc-resume-overview__section-title' }, 'Professional Summary' ),
				h( 'p', { className: 'hdc-resume-overview__text' }, ensureString( data.summary, '' ) )
			),
			capabilityMap.length
				? h(
					'section',
					{ className: 'hdc-resume-overview__section' },
					sectionTitle( 'Capability Map' ),
					h(
						'div',
						{ className: 'hdc-resume-overview__capability' },
						capabilityMap.map( function ( column, index ) {
							const items = ensureArray( column && column.items );
							return h(
								'article',
								{ className: 'hdc-resume-overview__card', key: ensureString( column && column.category, 'capability-' + String( index ) ) },
								h( 'h4', { className: 'hdc-resume-overview__entry-title' }, ensureString( column && column.category, 'Capability' ) ),
								h(
									'ul',
									{ className: 'hdc-resume-overview__list' },
									items.map( function ( item, itemIndex ) {
										return h( 'li', { key: String( item ) + '-' + String( itemIndex ) }, String( item ) );
									} )
								)
							);
						} )
					)
				)
				: null,
			experience.length
				? h(
					'section',
					{ className: 'hdc-resume-overview__section' },
					sectionTitle( 'Experience' ),
					h(
						'div',
						{ className: 'hdc-resume-overview__timeline' },
						experience.map( function ( entry, index ) {
							const highlights = ensureArray( entry && entry.highlights );
							return h(
								'article',
								{ className: 'hdc-resume-overview__card', key: ensureString( entry && entry.id, 'experience-' + String( index ) ) },
								h( 'h4', { className: 'hdc-resume-overview__entry-title' }, ensureString( entry && entry.title, 'Role' ) ),
								h(
									'p',
									{ className: 'hdc-resume-overview__entry-meta' },
									ensureString( entry && entry.company, '' ) + ' · ' + ensureString( entry && entry.location, '' ) + ' · ' + ensureString( entry && entry.period, '' )
								),
								h(
									'ul',
									{ className: 'hdc-resume-overview__list' },
									highlights.map( function ( item, itemIndex ) {
										return h( 'li', { key: String( item ) + '-' + String( itemIndex ) }, String( item ) );
									} )
								)
							);
						} )
					)
				)
				: null,
			education.length
				? h(
					'section',
					{ className: 'hdc-resume-overview__section' },
					sectionTitle( 'Education' ),
					h(
						'div',
						{ className: 'hdc-resume-overview__timeline' },
						education.map( function ( entry, index ) {
							return h(
								'article',
								{
									className: 'hdc-resume-overview__card',
									key: ensureString( entry && entry.id, 'education-' + String( index ) ),
								},
								h(
									'h4',
									{ className: 'hdc-resume-overview__entry-title' },
									ensureString( entry && entry.degree, 'Education' )
								),
								h(
									'p',
									{ className: 'hdc-resume-overview__entry-meta' },
									ensureString( entry && entry.school, '' ) + ' · ' + ensureString( entry && entry.period, '' )
								)
							);
						} )
					)
				)
				: null,
			projects.length
				? h(
					'section',
					{ className: 'hdc-resume-overview__section' },
					sectionTitle( 'Signature Work' ),
					h(
						'div',
						{ className: 'hdc-resume-overview__timeline' },
						projects.map( function ( project, index ) {
							const tech = ensureArray( project && project.tech );
							return h(
								'article',
								{ className: 'hdc-resume-overview__card', key: ensureString( project && project.name, 'project-' + String( index ) ) },
								h( 'h4', { className: 'hdc-resume-overview__entry-title' }, ensureString( project && project.name, 'Project' ) ),
								h( 'p', { className: 'hdc-resume-overview__text' }, ensureString( project && project.description, '' ) ),
								h( 'p', { className: 'hdc-resume-overview__text' }, 'Impact: ' + ensureString( project && project.impact, '' ) ),
								ensureString( project && project.link, '' )
									? h(
										'a',
										{
											className: 'hdc-resume-overview__project-link',
											href: ensureString( project && project.link, '' ),
											target: '_blank',
											rel: 'noopener noreferrer',
										},
										'View'
									)
									: null,
								tech.length
									? h(
										'div',
										{ className: 'hdc-resume-overview__chips' },
										tech.map( function ( item, itemIndex ) {
											return h( 'span', { className: 'hdc-resume-overview__badge', key: String( item ) + '-' + String( itemIndex ) }, String( item ) );
										} )
									)
									: null
							);
						} )
					)
				)
				: null,
			skills.length
				? h(
					'section',
					{ className: 'hdc-resume-overview__section' },
					sectionTitle( 'Skills' ),
					h(
						'div',
						{ className: 'hdc-resume-overview__skills' },
						skills.map( function ( category, index ) {
							const items = ensureArray( category && category.items );
							return h(
								'article',
								{ className: 'hdc-resume-overview__card', key: ensureString( category && category.category, 'skills-' + String( index ) ) },
								h( 'h4', { className: 'hdc-resume-overview__entry-title' }, ensureString( category && category.category, 'Skills' ) ),
								h(
									'div',
									{ className: 'hdc-resume-overview__chips' },
									items.map( function ( item, itemIndex ) {
										return h( 'span', { className: 'hdc-resume-overview__badge', key: String( item ) + '-' + String( itemIndex ) }, String( item ) );
									} )
								)
							);
						} )
					)
				)
				: null,
			certifications.length
				? h(
					'section',
					{ className: 'hdc-resume-overview__section' },
					sectionTitle( 'Certifications' ),
					h(
						'ul',
						{ className: 'hdc-resume-overview__list' },
						certifications.map( function ( item, index ) {
							return h( 'li', { key: String( item ) + '-' + String( index ) }, String( item ) );
						} )
					)
				)
				: null,
			ensureString( data.differentiator, '' )
				? h(
					'section',
					{ className: 'hdc-resume-overview__section' },
					sectionTitle( 'What Makes This Profile Different' ),
					h( 'p', { className: 'hdc-resume-overview__text' }, ensureString( data.differentiator, '' ) )
				)
				: null
		);
	}

	function mountResumeOverview( section ) {
		const rootNode = section.querySelector( '[data-hdc-resume-overview-root]' );
		if ( ! rootNode ) {
			return;
		}

		const app = h( ResumeOverviewApp, { config: parseConfig( section ) } );
		if ( typeof createRoot === 'function' ) {
			createRoot( rootNode ).render( app );
		} else {
			legacyRender( app, rootNode );
		}
	}

	document.querySelectorAll( '.hdc-resume-overview' ).forEach( mountResumeOverview );
} )( window.wp );
