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
			heading: ensureString( parsed.heading, 'ATS One-Page Resume' ),
			showPrintButton: !! parsed.showPrintButton,
			showBackLink: !! parsed.showBackLink,
			endpoint: ensureString( parsed.endpoint, '' ),
			fallbackUrl: ensureString( parsed.fallbackUrl, '' ),
			resumeUrl: ensureString( parsed.resumeUrl, '/resume/' ),
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

	function ResumeAtsApp( props ) {
		const config = props.config;
		const [ state, setState ] = useState( {
			loading: true,
			error: '',
			data: null,
		} );

		const signature = useMemo( function () {
			return JSON.stringify( config );
		}, [ config ] );

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
						const primaryPayload = await fetchJson( config.endpoint );
						if ( ! cancelled ) {
							setState( {
								loading: false,
								error: '',
								data: resolveContractData( primaryPayload ),
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

		return h(
			'div',
			{},
			h(
				'div',
				{ className: 'hdc-resume-ats__controls' },
				config.showBackLink
					? h( 'a', { className: 'hdc-resume-ats__link', href: config.resumeUrl }, 'Interactive resume' )
					: null,
				config.showPrintButton
					? h(
						'button',
						{
							type: 'button',
							className: 'hdc-resume-ats__button',
							onClick: function () {
								window.print();
							},
						},
						'Print / Save PDF'
					)
					: null
			),
			h(
				'article',
				{ className: 'hdc-resume-ats__article' },
				h( 'p', { className: 'hdc-resume-ats__heading' }, config.heading ),
				h( 'h2', { className: 'hdc-resume-ats__name' }, ensureString( data.name, 'Henry T. Perkins' ) ),
				h( 'p', { className: 'hdc-resume-ats__headline' }, ensureString( data.headline, '' ) ),
				h(
					'p',
					{ className: 'hdc-resume-ats__contact' },
					ensureString( data.location, '' ) +
						' | ' +
						ensureString( data.email, '' ) +
						' | ' +
						ensureString( data.linkedin, '' ) +
						' | ' +
						ensureString( data.github, '' ) +
						' | ' +
						ensureString( data.portfolio, '' )
				),
				h(
					'section',
					{ className: 'hdc-resume-ats__section' },
					h( 'h3', { className: 'hdc-resume-ats__section-title' }, 'Professional Summary' ),
					h( 'p', { className: 'hdc-resume-ats__text' }, ensureString( data.summary, '' ) )
				),
				impact.length
					? h(
						'section',
						{ className: 'hdc-resume-ats__section' },
						h( 'h3', { className: 'hdc-resume-ats__section-title' }, 'Selected Impact' ),
						h(
							'ul',
							{ className: 'hdc-resume-ats__list' },
							impact.map( function ( item, index ) {
								return h( 'li', { key: String( item ) + '-' + String( index ) }, String( item ) );
							} )
						)
					)
					: null,
				experience.length
					? h(
						'section',
						{ className: 'hdc-resume-ats__section' },
						h( 'h3', { className: 'hdc-resume-ats__section-title' }, 'Experience' ),
						experience.map( function ( entry, index ) {
							const bullets = ensureArray( entry && entry.bullets );
							return h(
								'div',
								{ className: 'hdc-resume-ats__entry', key: ensureString( entry && entry.id, 'experience-' + String( index ) ) },
								h( 'h4', { className: 'hdc-resume-ats__entry-title' }, ensureString( entry && entry.title, 'Role' ) ),
								h(
									'p',
									{ className: 'hdc-resume-ats__entry-meta' },
									ensureString( entry && entry.company, '' ) + ' | ' + ensureString( entry && entry.location, '' ) + ' | ' + ensureString( entry && entry.period, '' )
								),
								h(
									'ul',
									{ className: 'hdc-resume-ats__list' },
									bullets.map( function ( bullet, bulletIndex ) {
										return h( 'li', { key: String( bullet ) + '-' + String( bulletIndex ) }, String( bullet ) );
									} )
								)
							);
						} )
					)
					: null,
				projects.length
					? h(
						'section',
						{ className: 'hdc-resume-ats__section' },
						h( 'h3', { className: 'hdc-resume-ats__section-title' }, 'Projects' ),
						projects.map( function ( project, index ) {
							return h(
								'div',
								{ className: 'hdc-resume-ats__entry', key: ensureString( project && project.name, 'project-' + String( index ) ) },
								h( 'h4', { className: 'hdc-resume-ats__entry-title' }, ensureString( project && project.name, 'Project' ) ),
								h( 'p', { className: 'hdc-resume-ats__text' }, ensureString( project && project.description, '' ) ),
								h( 'p', { className: 'hdc-resume-ats__text' }, ensureString( project && project.impact, '' ) ),
								h( 'p', { className: 'hdc-resume-ats__text' }, 'Tech: ' + ensureString( project && project.tech, '' ) )
							);
						} )
					)
					: null,
				education.length
					? h(
						'section',
						{ className: 'hdc-resume-ats__section' },
						h( 'h3', { className: 'hdc-resume-ats__section-title' }, 'Education' ),
						h(
							'ul',
							{ className: 'hdc-resume-ats__list' },
							education.map( function ( item, index ) {
								return h( 'li', { key: String( item ) + '-' + String( index ) }, String( item ) );
							} )
						)
					)
					: null,
				skills.length
					? h(
						'section',
						{ className: 'hdc-resume-ats__section' },
						h( 'h3', { className: 'hdc-resume-ats__section-title' }, 'Skills' ),
						h( 'p', { className: 'hdc-resume-ats__text' }, skills.join( ' | ' ) )
					)
					: null,
				certifications.length
					? h(
						'section',
						{ className: 'hdc-resume-ats__section' },
						h( 'h3', { className: 'hdc-resume-ats__section-title' }, 'Certifications' ),
						h(
							'ul',
							{ className: 'hdc-resume-ats__list' },
							certifications.map( function ( item, index ) {
								return h( 'li', { key: String( item ) + '-' + String( index ) }, String( item ) );
							} )
						)
					)
					: null
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
