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
		'Capability Map': 'layers',
		'Experience': 'briefcase',
		'Signature Work': 'folder-open',
		'Education': 'graduation-cap',
		'What Makes This Profile Different': 'sparkles',
		'Certifications': 'award',
	};

	const RESUME_CAPABILITY_SKILL_GROUPS = {
		'Customer Outcomes': [ 'Support & Enablement' ],
		'Technical Delivery': [ 'Languages & Frontend', 'AI & Automation', 'WordPress & Web Delivery' ],
		'Operations & Leadership': [ 'Tools & Workflow', 'Leadership & Operations' ],
	};

	const CAPABILITY_SURFACE_CLASSES = {
		'Customer Outcomes': 'resume-capability-surface resume-capability-customer',
		'Technical Delivery': 'resume-capability-surface resume-capability-technical',
		'Operations & Leadership': 'resume-capability-surface resume-capability-operations',
	};

	const PROJECT_VISUAL_PATHS = {
		'Prompt Forge': {
			alt: 'Prompt Forge signature work cover showing structured builder flows and routed signal lines',
			path: '/assets/images/work/case-studies/promptforge-cover',
		},
		'HPerkins.com': {
			alt: 'HPerkins.com signature work cover showing editorial panels and linked runtime structure',
			path: '/assets/images/work/case-studies/digital-canvas-cover',
		},
		'WordPress Portfolio (wp-hperkins-com)': {
			alt: 'WordPress Portfolio signature work cover showing structured publishing panels and content-delivery pathways',
			path: '/assets/images/resume/signature-work/wordpress-portfolio-cover',
		},
	};

	function getProjectVisual( name, themeUri ) {
		const entry = PROJECT_VISUAL_PATHS[ name ];
		if ( ! entry || ! themeUri ) {
			return null;
		}
		return {
			alt: entry.alt,
			src: themeUri + entry.path + '.webp',
			srcSet: themeUri + entry.path + '-960.webp 960w, ' + themeUri + entry.path + '.webp 1536w',
		};
	}

	function sectionTitle( title ) {
		const iconName = SECTION_ICONS[ title ] || '';
		return h(
			'div',
			{ className: 'hdc-resume-overview__section-heading' },
			iconName
				? h(
					'span',
					{ className: 'hdc-resume-overview__section-icon-badge', 'aria-hidden': 'true' },
					h(
						'span',
						{ className: 'hdc-resume-overview__section-icon' },
						renderLucideIcon( h, iconName, {
							className: 'hdc-resume-overview__section-icon-svg',
							size: 14,
						} )
					)
				  )
				: null,
			h( 'h2', { className: 'hdc-resume-overview__section-title' }, title ),
			h( 'span', { className: 'hdc-resume-overview__section-heading-rule', 'aria-hidden': 'true' } )
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

	const MONTHS = {
		jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
		jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
	};

	function parsePeriodStart( period ) {
		const start = ( period || '' ).split( '-' )[ 0 ].trim();
		const monthYear = start.match( /^([A-Za-z]{3})\s+(\d{4})$/ );
		if ( monthYear ) {
			return Number( monthYear[ 2 ] ) * 12 + ( MONTHS[ monthYear[ 1 ].toLowerCase() ] || 0 );
		}
		const yearOnly = start.match( /^(\d{4})$/ );
		if ( yearOnly ) {
			return Number( yearOnly[ 1 ] ) * 12;
		}
		return 0;
	}

	function sortExperienceDescending( entries ) {
		return entries.slice().sort( function ( a, b ) {
			return parsePeriodStart( b.period ) - parsePeriodStart( a.period );
		} );
	}

	function parseJsonAttribute( section, attributeName ) {
		const raw = section.getAttribute( attributeName );
		if ( ! raw ) {
			return null;
		}

		try {
			return JSON.parse( raw );
		} catch ( error ) {
			return null;
		}
	}

	function parseConfig( section ) {
		const parsed = parseJsonAttribute( section, 'data-config' ) || {};

		return {
			heading: ensureString( parsed.heading, 'Resume' ),
			intro: ensureString( parsed.intro, '' ),
			showAtsLink: !! parsed.showAtsLink,
			endpoint: ensureString( parsed.endpoint, '' ),
			fallbackUrl: ensureString( parsed.fallbackUrl, '' ),
			atsUrl: ensureString( parsed.atsUrl, '/resume/ats/' ),
			themeUri: ensureString( parsed.themeUri, '' ),
			inlinePayload: resolveInlineData( parseJsonAttribute( section, 'data-inline-payload' ) ),
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

	function resolveInlineData( payload ) {
		const data = resolveContractData( payload );
		return data && typeof data === 'object' ? data : null;
	}

	function createState( data ) {
		return {
			loading: ! data,
			error: '',
			data: data || null,
		};
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
		const items = props.items;
		const initialHref = items.length ? items[ 0 ].href : '';
		const activeState = useState( function () {
			return window.location.hash || initialHref;
		} );
		const activeHref = activeState[ 0 ];
		const setActiveHref = activeState[ 1 ];

		useEffect( function () {
			if ( typeof IntersectionObserver === 'undefined' || ! items.length ) {
				return undefined;
			}

			const headingEls = [];
			items.forEach( function ( item ) {
				const id = item.href.replace( /^#/, '' );
				const el = document.getElementById( id );
				if ( el ) {
					headingEls.push( el );
				}
			} );

			if ( ! headingEls.length ) {
				return undefined;
			}

			const observer = new IntersectionObserver(
				function ( entries ) {
					entries.forEach( function ( entry ) {
						if ( entry.isIntersecting ) {
							setActiveHref( '#' + entry.target.id );
						}
					} );
				},
				{ rootMargin: '-100px 0px -66% 0px', threshold: 0 }
			);

			headingEls.forEach( function ( el ) {
				observer.observe( el );
			} );

			function onHashChange() {
				setActiveHref( window.location.hash || initialHref );
			}

			window.addEventListener( 'hashchange', onHashChange );

			return function () {
				observer.disconnect();
				window.removeEventListener( 'hashchange', onHashChange );
			};
		}, [ items ] );

		if ( ! items.length ) {
			return null;
		}

		return h(
			'section',
			{ className: 'hdc-resume-overview__jump-nav' },
			h(
				'div',
				{ className: 'hdc-resume-overview__card hdc-resume-overview__jump-nav-panel' },
				h( 'p', { className: 'hdc-resume-overview__card-label' }, 'Jump to resume sections' ),
				props.description ? h( 'p', { className: 'hdc-resume-overview__text' }, props.description ) : null,
				h(
					'nav',
					{ className: 'hdc-resume-overview__jump-nav-nav', 'aria-label': 'Jump to resume sections' },
					h(
						'ul',
						{ className: 'hdc-resume-overview__jump-nav-list' },
						items.map( function ( item ) {
							const isActive = activeHref === item.href;
							return h(
								'li',
								{ className: 'hdc-resume-overview__jump-nav-item', key: item.href },
								h(
									'a',
									{
										className: 'hdc-resume-overview__jump-nav-link' + ( isActive ? ' hdc-resume-overview__jump-nav-link--active' : '' ),
										href: item.href,
										'aria-current': isActive ? 'true' : undefined,
									},
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
		const [ state, setState ] = useState( function () {
			return createState( config.inlinePayload );
		} );

		const signature = useMemo( function () {
			return JSON.stringify( config );
		}, [ config ] );

		useEffect( function () {
			document.title = 'Resume — Henry Perkins';
		}, [] );

		useEffect(
			function () {
				if ( config.inlinePayload ) {
					setState( createState( config.inlinePayload ) );
					return undefined;
				}

				let cancelled = false;

				async function load() {
					setState( createState( null ) );

					try {
						const contractPayload = await fetchJson( config.endpoint );
						const contractData = resolveContractData( contractPayload );
						if ( ! cancelled ) {
							setState( createState( contractData ) );
						}
						return;
					} catch ( primaryError ) {
						try {
							const fallbackPayload = await fetchJson( config.fallbackUrl );
							if ( ! cancelled ) {
								setState( createState( fallbackPayload ) );
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
		const experience = sortExperienceDescending( ensureArray( data.experience ) );
		const education = ensureArray( data.education );
		const projects = ensureArray( data.projects );
		const skills = ensureArray( data.skills );
		const certifications = ensureArray( data.certifications );
		const differentiator = ensureString( data.differentiator, '' );

		const skillsByCategory = {};
		skills.forEach( function ( cat ) {
			skillsByCategory[ cat.category ] = cat;
		} );
		const combinedCapabilityCards = capabilityMap.map( function ( column ) {
			const groupNames = RESUME_CAPABILITY_SKILL_GROUPS[ column.category ] || [];
			return {
				category: column.category,
				items: ensureArray( column.items ),
				skillGroups: groupNames
					.map( function ( name ) { return skillsByCategory[ name ]; } )
					.filter( Boolean ),
			};
		} );

		const sectionLinks = [];
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
		if ( certifications.length ) {
			sectionLinks.push( { href: '#resume-certifications', label: 'Certifications' } );
		}

		return h(
			'div',
			{},
			h(
				'section',
				{ className: 'hdc-resume-overview__hero noise' },
				h(
					'div',
					{ className: 'hero-backdrop-resume-profile', 'aria-hidden': 'true' },
					h( 'div', { className: 'hero-backdrop-overlay' } )
				),
				h( 'div', { className: 'hdc-resume-overview__hero-gradient hero-gradient-layer', 'aria-hidden': 'true' } ),
				h(
					'div',
					{ className: 'hdc-resume-overview__hero-shell' },
					h(
						'div',
						{ className: 'hdc-resume-overview__hero-content' },
						h( 'p', { className: 'hdc-resume-overview__eyebrow' }, config.heading || 'Resume' ),
						h( 'h1', { className: 'hdc-resume-overview__title' }, ensureString( data.headline, 'Resume' ) ),
						h( 'p', { className: 'hdc-resume-overview__subtitle' }, ensureString( data.subheadline, '' ) ),
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
							? h( 'a', { className: 'hdc-resume-overview__action hdc-resume-overview__action--inverse-glass', href: config.atsUrl }, 'ATS Resume' )
							: null,
						h(
							'a',
							{
								className: 'hdc-resume-overview__action hdc-resume-overview__action--inverse-glass hdc-resume-overview__action--icon-only',
								href: '/documents/henry-perkins-ats-resume.pdf',
								target: '_blank',
								rel: 'noopener noreferrer',
								'aria-label': 'Open ATS Resume PDF',
								title: 'Open ATS Resume PDF',
							},
							renderLucideIcon( h, 'printer', { className: 'hdc-resume-overview__action-icon-svg', size: 16 } )
						),
						h( 'a', { className: 'hdc-resume-overview__action hdc-resume-overview__action--primary', href: '/contact/' }, 'Contact' )
					)
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
					h(
						'section',
						{
							className: 'hdc-resume-overview__section hdc-resume-overview__panel hdc-resume-overview__panel--strong ember-surface ember-surface-strong',
							id: 'resume-summary',
						},
						h( 'h2', { className: 'hdc-resume-overview__section-title' }, 'Professional Summary' ),
						h( 'p', { className: 'hdc-resume-overview__text' }, ensureString( data.summary, '' ) )
					),
					combinedCapabilityCards.length
						? h(
							'section',
							{ className: 'hdc-resume-overview__section', id: 'resume-capability-map' },
							sectionTitle( 'Capability Map' ),
							h( 'span', { id: 'resume-skills', 'aria-hidden': 'true', className: 'hdc-resume-overview__skills-anchor' } ),
							h(
								'div',
								{ className: 'hdc-resume-overview__capability' },
								combinedCapabilityCards.map( function ( column, index ) {
									const surfaceClass = CAPABILITY_SURFACE_CLASSES[ column.category ] || '';
									return h(
										'article',
										{
											className: 'hdc-resume-overview__card surface-inset-soft' + ( surfaceClass ? ' ' + surfaceClass : '' ),
											key: column.category || 'capability-' + String( index ),
										},
										h( 'h3', { className: 'hdc-resume-overview__entry-title' }, column.category || 'Capability' ),
										h(
											'ul',
											{ className: 'hdc-resume-overview__list' },
											column.items.map( function ( item, itemIndex ) {
												return h( 'li', { key: String( item ) + '-' + String( itemIndex ) }, String( item ) );
											} )
										),
										column.skillGroups.length
											? h(
												'div',
												{ className: 'hdc-resume-overview__capability-skills' },
												column.skillGroups.map( function ( group ) {
													return h(
														'div',
														{ key: group.category, className: 'hdc-resume-overview__capability-skill-group' },
														h( 'h4', { className: 'hdc-resume-overview__capability-skill-heading' }, group.category ),
														h(
															'div',
															{ className: 'hdc-resume-overview__chips' },
															ensureArray( group.items ).map( function ( item, itemIndex ) {
																return h( 'span', { className: 'hdc-resume-overview__badge', key: String( item ) + '-' + String( itemIndex ) }, String( item ) );
															} )
														)
													);
												} )
											)
											: null
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
										{
											className: 'hdc-resume-overview__timeline-item',
											key: ensureString( entry && entry.id, 'experience-' + String( index ) ),
										},
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
									const projectName = ensureString( project && project.name, '' );
									const projectVisual = getProjectVisual( projectName, config.themeUri );
									return h(
										'article',
										{
											className: 'hdc-resume-overview__card hdc-resume-overview__card--ember hdc-resume-overview__card--project ember-surface',
											key: projectName || 'project-' + String( index ),
										},
										projectVisual
											? h( 'img', {
												alt: projectVisual.alt,
												className: 'hdc-resume-overview__project-cover',
												decoding: 'async',
												loading: 'lazy',
												sizes: '(min-width: 1280px) 768px, 100vw',
												src: projectVisual.src,
												srcSet: projectVisual.srcSet,
											} )
											: null,
										h(
											'div',
											{ className: 'hdc-resume-overview__project-body' },
											h(
												'div',
												{ className: 'hdc-resume-overview__project-header' },
												h( 'h3', { className: 'hdc-resume-overview__entry-title' }, projectName || 'Project' ),
												ensureString( project && project.link, '' )
													? h(
														'a',
														{
															className: 'hdc-resume-overview__project-link group',
															'aria-label': 'View ' + ( projectName || 'project' ) + ' project',
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
													: null
											),
											h( 'p', { className: 'hdc-resume-overview__text' }, ensureString( project && project.description, '' ) ),
											h( 'p', { className: 'hdc-resume-overview__text' },
												h( 'span', { className: 'hdc-resume-overview__evidence-label' }, 'Evidence:' ),
												' ' + ensureString( project && project.impact, '' )
											),
											tech.length
												? h(
													'div',
													{ className: 'hdc-resume-overview__chips' },
													tech.map( function ( item, itemIndex ) {
														return h( 'span', { className: 'hdc-resume-overview__badge', key: String( item ) + '-' + String( itemIndex ) }, String( item ) );
													} )
												)
												: null
										)
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
											className: 'hdc-resume-overview__timeline-item',
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
								className: 'hdc-resume-overview__section hdc-resume-overview__panel hdc-resume-overview__panel--ember ember-surface',
								id: 'resume-differentiator',
							},
							sectionTitle( 'What Makes This Profile Different' ),
							h( 'p', { className: 'hdc-resume-overview__text' }, differentiator )
						)
						: null,
					certifications.length
						? h(
							'section',
							{ className: 'hdc-resume-overview__section', id: 'resume-certifications' },
							sectionTitle( 'Certifications' ),
							h(
								'div',
								{ className: 'hdc-resume-overview__panel hdc-resume-overview__panel--soft' },
								h(
									'ul',
									{ className: 'hdc-resume-overview__list' },
									certifications.map( function ( item, index ) {
										return h( 'li', { key: String( item ) + '-' + String( index ) }, String( item ) );
									} )
								)
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
