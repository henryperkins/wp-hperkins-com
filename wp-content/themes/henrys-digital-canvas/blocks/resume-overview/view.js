( function ( wp ) {
	if ( ! wp || ! wp.element ) {
		return;
	}

	const element = wp.element;
	const Fragment = element.Fragment;
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
		'Signature Work': 'folder-open',
		'Education': 'graduation-cap',
		'What Makes This Profile Different': 'sparkles',
		'Skills': 'wrench',
		'Certifications': 'award',
	};

	function sectionTitle( title ) {
		const iconName = SECTION_ICONS[ title ] || '';
		return h(
			'h2',
			{ className: 'hdc-resume-overview__section-title' },
			iconName
				? h(
					'span',
					{ className: 'hdc-resume-overview__section-icon', 'aria-hidden': 'true' },
					renderLucideIcon( h, iconName, {
						className: 'hdc-resume-overview__section-icon-svg',
						size: 18,
					} )
				  )
				: null,
			title
		);
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

	function renderInlineSeparated( values ) {
		const items = ensureArray( values )
			.map( function ( item ) {
				return ensureString( item, '' );
			} )
			.filter( Boolean );

		if ( ! items.length ) {
			return null;
		}

		return h(
			'span',
			{ className: 'hdc-resume-overview__inline-separated' },
			items.map( function ( item, index ) {
				return h(
					Fragment,
					{ key: item + '-' + String( index ) },
					h( 'span', { className: 'hdc-resume-overview__inline-separated-item' }, item ),
					index < items.length - 1
						? h( 'span', { className: 'hdc-resume-overview__inline-separated-separator', 'aria-hidden': 'true' } )
						: null
				);
			} )
		);
	}

	function SectionJumpNav( props ) {
		if ( ! props.items.length ) {
			return null;
		}

		return h(
			'section',
			{ className: 'hdc-resume-overview__jump-nav' },
			h(
				'div',
				{ className: 'hdc-resume-overview__card' },
				h( 'p', { className: 'hdc-resume-overview__card-label' }, 'Jump to resume sections' ),
				props.description ? h( 'p', { className: 'hdc-resume-overview__text' }, props.description ) : null,
				h(
					'nav',
					{ className: 'hdc-resume-overview__jump-nav-nav', 'aria-label': 'Jump to resume sections' },
					h(
						'ul',
						{ className: 'hdc-resume-overview__jump-nav-list' },
						props.items.map( function ( item ) {
							return h(
								'li',
								{ className: 'hdc-resume-overview__jump-nav-item', key: item.href },
								h(
									'a',
									{ className: 'hdc-resume-overview__jump-nav-link', href: item.href },
									item.label
								)
							);
						} )
					)
				)
			)
		);
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
		const differentiator = ensureString( data.differentiator, '' );

		const sectionLinks = [];
		if ( impactStrip.length ) {
			sectionLinks.push( { href: '#resume-impact', label: 'Impact' } );
		}
		sectionLinks.push( { href: '#resume-summary', label: 'Summary' } );
		if ( capabilityMap.length ) {
			sectionLinks.push( { href: '#resume-capability-map', label: 'Capability Map' } );
		}
		if ( experience.length ) {
			sectionLinks.push( { href: '#resume-experience', label: 'Experience' } );
		}
		if ( projects.length ) {
			sectionLinks.push( { href: '#resume-signature-work', label: 'Signature Work' } );
		}
		if ( education.length ) {
			sectionLinks.push( { href: '#resume-education', label: 'Education' } );
		}
		if ( differentiator ) {
			sectionLinks.push( { href: '#resume-differentiator', label: 'Difference' } );
		}
		if ( skills.length ) {
			sectionLinks.push( { href: '#resume-skills', label: 'Skills' } );
		}
		if ( certifications.length ) {
			sectionLinks.push( { href: '#resume-certifications', label: 'Certifications' } );
		}

		return h(
			'div',
			{},
			h(
				'header',
				{ className: 'hdc-resume-overview__hero' },
				h(
					'div',
					{ className: 'hdc-resume-overview__hero-copy' },
					h( 'p', { className: 'hdc-resume-overview__eyebrow' }, config.heading || 'Resume' ),
					h( 'h1', { className: 'hdc-resume-overview__title' }, ensureString( data.headline, 'Resume' ) ),
					h( 'p', { className: 'hdc-resume-overview__subtitle' }, ensureString( data.subheadline, '' ) ),
					config.intro ? h( 'p', { className: 'hdc-resume-overview__legacy-intro' }, config.intro ) : null,
					targetRoles.length
						? h(
							'div',
							{ className: 'hdc-resume-overview__roles' },
							targetRoles.map( function ( role ) {
								return h( 'span', { className: 'hdc-resume-overview__badge', key: role }, role );
							} )
						)
						: null
				),
				h(
					'div',
					{ className: 'hdc-resume-overview__actions' },
					config.showAtsLink
						? h( 'a', { className: 'hdc-resume-overview__action', href: config.atsUrl }, 'ATS one-page' )
						: null,
					config.portfolioUrl
						? h(
							'a',
							{
								className: 'hdc-resume-overview__action hdc-resume-overview__action--secondary group',
								href: config.portfolioUrl,
								target: '_blank',
								rel: 'noopener noreferrer',
							},
							'Portfolio',
							h(
								'span',
								{ className: 'hdc-resume-overview__action-icon', 'aria-hidden': 'true' },
								renderLucideIcon( h, 'external-link', {
									className: 'hdc-resume-overview__action-icon-svg icon-link-hover',
									size: 12,
								} )
							)
						)
						: null
				)
			),
			h(
				'div',
				{ className: 'hdc-resume-overview__layout' },
				h(
					'aside',
					{ className: 'hdc-resume-overview__aside' },
					h( SectionJumpNav, {
						description: 'Use the jump links to move straight to impact, experience, or the condensed skill breakdown.',
						items: sectionLinks,
					} )
				),
				h(
					'div',
					{ className: 'hdc-resume-overview__content' },
					impactStrip.length
						? h(
							'section',
							{ className: 'hdc-resume-overview__section', id: 'resume-impact' },
							sectionTitle( 'Impact at a Glance' ),
							h(
								'div',
								{ className: 'hdc-resume-overview__metrics' },
								impactStrip.map( function ( metric, index ) {
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
						{
							className: 'hdc-resume-overview__section hdc-resume-overview__panel hdc-resume-overview__panel--strong',
							id: 'resume-summary',
						},
						h( 'h2', { className: 'hdc-resume-overview__section-title' }, 'Professional Summary' ),
						h( 'p', { className: 'hdc-resume-overview__text' }, ensureString( data.summary, '' ) )
					),
					capabilityMap.length
						? h(
							'section',
							{ className: 'hdc-resume-overview__section', id: 'resume-capability-map' },
							sectionTitle( 'Capability Map' ),
							h(
								'div',
								{ className: 'hdc-resume-overview__capability' },
								capabilityMap.map( function ( column, index ) {
									const items = ensureArray( column && column.items );
									return h(
										'article',
										{ className: 'hdc-resume-overview__card', key: ensureString( column && column.category, 'capability-' + String( index ) ) },
										h( 'h3', { className: 'hdc-resume-overview__entry-title' }, ensureString( column && column.category, 'Capability' ) ),
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
							{ className: 'hdc-resume-overview__section', id: 'resume-experience' },
							sectionTitle( 'Experience' ),
							h(
								'div',
								{ className: 'hdc-resume-overview__timeline' },
								experience.map( function ( entry, index ) {
									const highlights = ensureArray( entry && entry.highlights );
									return h(
										'article',
										{ className: 'hdc-resume-overview__card', key: ensureString( entry && entry.id, 'experience-' + String( index ) ) },
										h( 'h3', { className: 'hdc-resume-overview__entry-title' }, ensureString( entry && entry.title, 'Role' ) ),
										h(
											'p',
											{ className: 'hdc-resume-overview__entry-link' },
											renderInlineSeparated( [
												entry && entry.company,
												entry && entry.location,
											] )
										),
										h( 'p', { className: 'hdc-resume-overview__entry-meta' }, ensureString( entry && entry.period, '' ) ),
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
					projects.length
						? h(
							'section',
							{ className: 'hdc-resume-overview__section', id: 'resume-signature-work' },
							sectionTitle( 'Signature Work' ),
							h(
								'div',
								{ className: 'hdc-resume-overview__timeline' },
								projects.map( function ( project, index ) {
									const tech = ensureArray( project && project.tech );
									return h(
										'article',
										{ className: 'hdc-resume-overview__card', key: ensureString( project && project.name, 'project-' + String( index ) ) },
										h( 'h3', { className: 'hdc-resume-overview__entry-title' }, ensureString( project && project.name, 'Project' ) ),
										h( 'p', { className: 'hdc-resume-overview__text' }, ensureString( project && project.description, '' ) ),
										h( 'p', { className: 'hdc-resume-overview__text' }, 'Impact: ' + ensureString( project && project.impact, '' ) ),
										ensureString( project && project.link, '' )
											? h(
												'a',
												{
													className: 'hdc-resume-overview__project-link group',
													href: ensureString( project && project.link, '' ),
													target: '_blank',
													rel: 'noopener noreferrer',
												},
												h( 'span', null, 'View' ),
												h(
													'span',
													{ className: 'hdc-resume-overview__project-link-icon', 'aria-hidden': 'true' },
													renderLucideIcon( h, 'external-link', {
														className: 'hdc-resume-overview__project-link-icon-svg icon-link-hover',
														size: 12,
													} )
												)
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
					education.length
						? h(
							'section',
							{ className: 'hdc-resume-overview__section', id: 'resume-education' },
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
											'h3',
											{ className: 'hdc-resume-overview__entry-title' },
											ensureString( entry && entry.degree, 'Education' )
										),
										h(
											'p',
											{ className: 'hdc-resume-overview__entry-link' },
											ensureString( entry && entry.school, '' )
										),
										h(
											'p',
											{ className: 'hdc-resume-overview__entry-meta' },
											ensureString( entry && entry.period, '' )
										),
										ensureString( entry && entry.details, '' )
											? h( 'p', { className: 'hdc-resume-overview__text' }, ensureString( entry && entry.details, '' ) )
											: null
									);
								} )
							)
						)
						: null,
					differentiator
						? h(
							'section',
							{
								className: 'hdc-resume-overview__section hdc-resume-overview__panel',
								id: 'resume-differentiator',
							},
							sectionTitle( 'What Makes This Profile Different' ),
							h( 'p', { className: 'hdc-resume-overview__text' }, differentiator )
						)
						: null,
					skills.length
						? h(
							'section',
							{ className: 'hdc-resume-overview__section', id: 'resume-skills' },
							sectionTitle( 'Skills' ),
							h(
								'div',
								{ className: 'hdc-resume-overview__skills' },
								skills.map( function ( category, index ) {
									const items = ensureArray( category && category.items );
									return h(
										'article',
										{ className: 'hdc-resume-overview__card', key: ensureString( category && category.category, 'skills-' + String( index ) ) },
										h( 'h3', { className: 'hdc-resume-overview__entry-title' }, ensureString( category && category.category, 'Skills' ) ),
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
							{ className: 'hdc-resume-overview__section', id: 'resume-certifications' },
							sectionTitle( 'Certifications' ),
							h(
								'ul',
								{ className: 'hdc-resume-overview__list' },
								certifications.map( function ( item, index ) {
									return h( 'li', { key: String( item ) + '-' + String( index ) }, String( item ) );
								} )
							)
						)
						: null
				)
			)
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
