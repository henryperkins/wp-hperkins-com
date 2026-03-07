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
		const inlineData = resolveInlineData(
			parseJsonAttribute( section, 'data-inline-payload' ) ||
				parseJsonAttribute( section, 'data-fallback-payload' )
		);

		return {
			heading: ensureString( parsed.heading, 'ATS one-page resume' ),
			showPrintButton: !! parsed.showPrintButton,
			showBackLink: !! parsed.showBackLink,
			endpoint: ensureString( parsed.endpoint, '' ),
			fallbackUrl: ensureString( parsed.fallbackUrl, '' ),
			resumeUrl: ensureString( parsed.resumeUrl, '/resume/' ),
			inlineData: inlineData,
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

	function SectionJumpNav( props ) {
		if ( ! props.items.length ) {
			return null;
		}

		return h(
			'section',
			{ className: 'hdc-resume-ats__jump-nav' },
			h(
				'div',
				{ className: 'hdc-resume-ats__jump-nav-panel' },
				h( 'p', { className: 'hdc-resume-ats__jump-nav-label' }, 'Jump to ATS sections' ),
				props.description ? h( 'p', { className: 'hdc-resume-ats__jump-nav-description' }, props.description ) : null,
				h(
					'nav',
					{ className: 'hdc-resume-ats__jump-nav-nav', 'aria-label': 'Jump to ATS sections' },
					h(
						'ul',
						{ className: 'hdc-resume-ats__jump-nav-list' },
						props.items.map( function ( item ) {
							return h(
								'li',
								{ className: 'hdc-resume-ats__jump-nav-item', key: item.href },
								h(
									'a',
									{ className: 'hdc-resume-ats__jump-nav-link', href: item.href },
									item.label
								)
							);
						} )
					)
				)
			)
		);
	}

	function ResumeAtsApp( props ) {
		const config = props.config;
		const [ state, setState ] = useState( function () {
			return createState( config.inlineData );
		} );

		const signature = useMemo( function () {
			return JSON.stringify( config );
		}, [ config ] );

		useEffect( function () {
			document.title = 'ATS Resume — Henry Perkins';
		}, [] );

		useEffect(
			function () {
				if ( config.inlineData ) {
					setState( createState( config.inlineData ) );
					return undefined;
				}

				let cancelled = false;

				async function load() {
					setState( createState( null ) );

					try {
						const primaryPayload = await fetchJson( config.endpoint );
						if ( ! cancelled ) {
							setState( createState( resolveContractData( primaryPayload ) ) );
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
									error: 'Unable to load ATS resume data.',
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
			return h( 'p', { className: 'hdc-resume-ats__status' }, 'Loading ATS resume…' );
		}

		if ( state.error ) {
			return h( 'p', { className: 'hdc-resume-ats__error' }, state.error );
		}

		const data = state.data;
		if ( ! data || typeof data !== 'object' ) {
			return h( 'p', { className: 'hdc-resume-ats__error' }, 'ATS resume data is unavailable.' );
		}

		const impact = ensureArray( data.impactHighlights );
		const experience = ensureArray( data.experience );
		const projects = ensureArray( data.projects );
		const education = ensureArray( data.education );
		const skills = ensureArray( data.skills );
		const certifications = ensureArray( data.certifications );

		const sectionLinks = [];
		sectionLinks.push( { href: '#ats-summary', label: 'Summary' } );
		if ( impact.length ) {
			sectionLinks.push( { href: '#ats-impact', label: 'Impact' } );
		}
		if ( experience.length ) {
			sectionLinks.push( { href: '#ats-experience', label: 'Experience' } );
		}
		if ( projects.length ) {
			sectionLinks.push( { href: '#ats-projects', label: 'Projects' } );
		}
		if ( education.length ) {
			sectionLinks.push( { href: '#ats-education', label: 'Education' } );
		}
		if ( skills.length ) {
			sectionLinks.push( { href: '#ats-skills', label: 'Skills' } );
		}
		if ( certifications.length ) {
			sectionLinks.push( { href: '#ats-certifications', label: 'Certifications' } );
		}

		return h(
			'div',
			{},
			h(
				'div',
				{ className: 'hdc-resume-ats__controls' },
				config.showBackLink
					? h(
						'a',
						{ className: 'hdc-resume-ats__control', href: config.resumeUrl },
						h(
							'span',
							{ className: 'hdc-resume-ats__control-icon', 'aria-hidden': 'true' },
							renderLucideIcon( h, 'arrow-left', { className: 'hdc-resume-ats__control-icon-svg', size: 14 } )
						),
						'Interactive Resume'
					)
					: null,
				config.showPrintButton
					? h(
						'button',
						{
							type: 'button',
							className: 'hdc-resume-ats__control',
							onClick: function () {
								window.print();
							},
						},
						h(
							'span',
							{ className: 'hdc-resume-ats__control-icon', 'aria-hidden': 'true' },
							renderLucideIcon( h, 'printer', { className: 'hdc-resume-ats__control-icon-svg', size: 14 } )
						),
						'Print / Save PDF'
					)
					: null
			),
			h(
				'div',
				{ className: 'hdc-resume-ats__layout' },
				h(
					'aside',
					{ className: 'hdc-resume-ats__aside' },
					h( SectionJumpNav, {
						description: 'Use this version for the shortest scan. Jump straight to the section you need before exporting or printing.',
						items: sectionLinks,
					} )
				),
				h(
					'article',
					{ className: 'hdc-resume-ats__article' },
					h(
						'header',
						{ className: 'hdc-resume-ats__header' },
						h(
							'div',
							{ className: 'hdc-resume-ats__label' },
							h(
								'span',
								{ className: 'hdc-resume-ats__label-icon', 'aria-hidden': 'true' },
								renderLucideIcon( h, 'file-text', { className: 'hdc-resume-ats__label-icon-svg', size: 16 } )
							),
							h( 'p', { className: 'hdc-resume-ats__label-text' }, config.heading )
						),
						h( 'h1', { className: 'hdc-resume-ats__name text-document-title' }, ensureString( data.name, 'Henry T. Perkins' ) ),
						h( 'p', { className: 'hdc-resume-ats__headline text-document-headline' }, ensureString( data.headline, '' ) ),
						h(
							'p',
							{ className: 'hdc-resume-ats__contact text-document-body' },
							ensureString( data.location, '' ) +
								' | ' +
								ensureString( data.email, '' ) +
								' | ' +
								ensureString( data.linkedin, '' ) +
								' | ' +
								ensureString( data.github, '' ) +
								' | ' +
								ensureString( data.portfolio, '' )
						)
					),
					h(
						'section',
						{ className: 'hdc-resume-ats__section', id: 'ats-summary' },
						h( 'h2', { className: 'hdc-resume-ats__section-title text-document-section-label' }, 'Professional Summary' ),
						h( 'p', { className: 'hdc-resume-ats__text text-document-body' }, ensureString( data.summary, '' ) )
					),
					impact.length
						? h(
							'section',
							{ className: 'hdc-resume-ats__section', id: 'ats-impact' },
							h( 'h2', { className: 'hdc-resume-ats__section-title text-document-section-label' }, 'Selected Impact' ),
							h(
								'ul',
								{ className: 'hdc-resume-ats__list' },
								impact.map( function ( item, index ) {
									return h( 'li', { key: String( item ) + '-' + String( index ), className: 'text-document-body' }, String( item ) );
								} )
							)
						)
						: null,
					experience.length
						? h(
							'section',
							{ className: 'hdc-resume-ats__section', id: 'ats-experience' },
							h( 'h2', { className: 'hdc-resume-ats__section-title text-document-section-label' }, 'Experience' ),
							h(
								'div',
								{ className: 'hdc-resume-ats__entries' },
								experience.map( function ( entry, index ) {
									const bullets = ensureArray( entry && entry.bullets );
									return h(
										'div',
										{ className: 'hdc-resume-ats__entry', key: ensureString( entry && entry.id, 'experience-' + String( index ) ) },
										h( 'h3', { className: 'hdc-resume-ats__entry-title text-document-heading' }, ensureString( entry && entry.title, 'Role' ) ),
										h(
											'p',
											{ className: 'hdc-resume-ats__entry-meta text-document-body' },
											ensureString( entry && entry.company, '' ) + ' | ' + ensureString( entry && entry.location, '' ) + ' | ' + ensureString( entry && entry.period, '' )
										),
										h(
											'ul',
											{ className: 'hdc-resume-ats__list' },
											bullets.map( function ( bullet, bulletIndex ) {
												return h( 'li', { key: String( bullet ) + '-' + String( bulletIndex ), className: 'text-document-body' }, String( bullet ) );
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
							{ className: 'hdc-resume-ats__section', id: 'ats-projects' },
							h( 'h2', { className: 'hdc-resume-ats__section-title text-document-section-label' }, 'Projects' ),
							h(
								'div',
								{ className: 'hdc-resume-ats__entries hdc-resume-ats__entries--compact' },
								projects.map( function ( project, index ) {
									return h(
										'div',
										{ className: 'hdc-resume-ats__entry', key: ensureString( project && project.name, 'project-' + String( index ) ) },
										h( 'h3', { className: 'hdc-resume-ats__entry-title text-document-heading' }, ensureString( project && project.name, 'Project' ) ),
										h( 'p', { className: 'hdc-resume-ats__text text-document-body' }, ensureString( project && project.description, '' ) ),
										h( 'p', { className: 'hdc-resume-ats__text text-document-body' }, ensureString( project && project.impact, '' ) ),
										h( 'p', { className: 'hdc-resume-ats__text text-document-body' }, 'Tech: ' + ensureString( project && project.tech, '' ) )
									);
								} )
							)
						)
						: null,
					education.length
						? h(
							'section',
							{ className: 'hdc-resume-ats__section', id: 'ats-education' },
							h( 'h2', { className: 'hdc-resume-ats__section-title text-document-section-label' }, 'Education' ),
							h(
								'ul',
								{ className: 'hdc-resume-ats__list' },
								education.map( function ( item, index ) {
									return h( 'li', { key: String( item ) + '-' + String( index ), className: 'text-document-body' }, String( item ) );
								} )
							)
						)
						: null,
					skills.length
						? h(
							'section',
							{ className: 'hdc-resume-ats__section', id: 'ats-skills' },
							h( 'h2', { className: 'hdc-resume-ats__section-title text-document-section-label' }, 'Skills' ),
							h( 'p', { className: 'hdc-resume-ats__text text-document-body' }, skills.join( ' | ' ) )
						)
						: null,
					certifications.length
						? h(
							'section',
							{ className: 'hdc-resume-ats__section', id: 'ats-certifications' },
							h( 'h2', { className: 'hdc-resume-ats__section-title text-document-section-label' }, 'Certifications' ),
							h(
								'ul',
								{ className: 'hdc-resume-ats__list' },
								certifications.map( function ( item, index ) {
									return h( 'li', { key: String( item ) + '-' + String( index ), className: 'text-document-body' }, String( item ) );
								} )
							)
						)
						: null
				)
			)
		);
	}

	function mountResumeAts( section ) {
		const rootNode = section.querySelector( '[data-hdc-resume-ats-root]' );
		if ( ! rootNode ) {
			return;
		}

		const app = h( ResumeAtsApp, { config: parseConfig( section ) } );
		if ( typeof createRoot === 'function' ) {
			createRoot( rootNode ).render( app );
		} else {
			legacyRender( app, rootNode );
		}
	}

	document.querySelectorAll( '.hdc-resume-ats' ).forEach( mountResumeAts );
} )( window.wp );
