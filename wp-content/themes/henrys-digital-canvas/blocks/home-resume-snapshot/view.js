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
	const ensureString = utils.ensureString;
	const ensureArray = utils.ensureArray;
	const ensureObject = utils.ensureObject;
	const normalizeTextList = utils.normalizeTextList;
	const normalizeResumeData = utils.normalizeResumeData;
	const resolveRequestUrl = utils.resolveRequestUrl;

	function parseConfig( section ) {
		let parsed = {};

		try {
			parsed = JSON.parse( section.getAttribute( 'data-config' ) || '{}' );
		} catch ( error ) {
			parsed = {};
		}

		return {
			title: ensureString( parsed.title, 'Resume Snapshot' ),
			actionLabel: ensureString( parsed.actionLabel, '' ),
			actionHref: ensureString( parsed.actionHref, '' ),
			positioningEyebrow: ensureString( parsed.positioningEyebrow, 'Positioning' ),
			label: ensureString( parsed.label, '' ),
			items: ensureArray( parsed.items ),
			bestFitEyebrow: ensureString( parsed.bestFitEyebrow, 'Best fit' ),
			bestFitTitle: ensureString( parsed.bestFitTitle, 'Where I contribute fastest' ),
			focusAreas: ensureArray( parsed.focusAreas ),
			actionLinks: ensureArray( parsed.actionLinks ),
			resumeEndpoint: ensureString( parsed.resumeEndpoint, '/wp-json/henrys-digital-canvas/v1/resume' ),
			initialResume: parsed.initialResume,
		};
	}

	function renderActionArrow() {
		const renderLucideIcon = utils.renderLucideIcon || function () {
			return null;
		};
		return h(
			'span',
			{ 'aria-hidden': 'true', className: 'hdc-home-page__action-icon' },
			renderLucideIcon( h, 'arrow-right', {
				className: 'hdc-home-page__action-icon-svg',
				size: 14,
			} )
		);
	}

	function ResumeSnapshotLoadingState() {
		return h(
			'div',
			{ 'aria-hidden': 'true', className: 'hdc-home-page__resume-stack' },
			h( 'span', { className: 'hdc-home-page__skeleton hdc-home-page__skeleton--title hdc-home-page__skeleton--title-wide' } ),
			h( 'span', { className: 'hdc-home-page__skeleton hdc-home-page__skeleton--line' } ),
			h( 'span', { className: 'hdc-home-page__skeleton hdc-home-page__skeleton--line hdc-home-page__skeleton--line-short' } ),
			h(
				'div',
				{ className: 'hdc-home-page__resume-snapshot' },
				h( 'span', { className: 'hdc-home-page__skeleton hdc-home-page__skeleton--meta' } ),
				h( 'span', { className: 'hdc-home-page__skeleton hdc-home-page__skeleton--line hdc-home-page__skeleton--line-medium' } )
			),
			h(
				'div',
				{ className: 'hdc-home-page__badges', 'data-loading': 'true' },
				h( 'span', { className: 'hdc-home-page__skeleton hdc-home-page__skeleton--badge' } ),
				h( 'span', { className: 'hdc-home-page__skeleton hdc-home-page__skeleton--badge' } ),
				h( 'span', { className: 'hdc-home-page__skeleton hdc-home-page__skeleton--badge' } )
			)
		);
	}

	async function fetchResume( config ) {
		const response = await fetch( resolveRequestUrl( config.resumeEndpoint ), {
			headers: { Accept: 'application/json' },
		} );

		if ( ! response.ok ) {
			throw new Error( 'Resume request failed with status ' + response.status );
		}

		return normalizeResumeData( await response.json() );
	}

	function SnapshotItems( props ) {
		if ( ! props.label && ! props.items.length ) {
			return null;
		}

		return h(
			'div',
			{ className: 'hdc-home-page__resume-snapshot' },
			props.label ? h( 'p', { className: 'hdc-home-page__resume-snapshot-label' }, props.label ) : null,
			props.items.length
				? h(
						'p',
						{ className: 'hdc-home-page__resume-snapshot-items' },
						props.items.reduce( function ( acc, item, index ) {
							if ( index > 0 ) {
								acc.push(
									h( 'span', { className: 'hdc-home-page__inline-dot', 'aria-hidden': 'true', key: 'dot-' + String( index ) }, '\u00B7' )
								);
							}
							acc.push( h( 'span', { key: 'item-' + String( index ) }, item ) );
							return acc;
						}, [] )
				  )
				: null
		);
	}

	function ResumeSnapshotApp( props ) {
		const config = props.config;
		const initialResume = useMemo(
			function () {
				return normalizeResumeData( config.initialResume );
			},
			[ config.initialResume ]
		);
		const [ resumeState, setResumeState ] = useState( {
			data: initialResume,
			loading: ! initialResume,
		} );

		useEffect(
			function () {
				let cancelled = false;

				fetchResume( config )
					.then( function ( resume ) {
						if ( cancelled ) {
							return;
						}
						setResumeState( {
							data: resume && typeof resume === 'object' ? resume : initialResume,
							loading: false,
						} );
					} )
					.catch( function () {
						if ( cancelled ) {
							return;
						}
						setResumeState( {
							data: initialResume,
							loading: false,
						} );
					} );

				return function () {
					cancelled = true;
				};
			},
			[ config, initialResume ]
		);

		useEffect(
			function () {
				if ( typeof utils.initRevealObserver === 'function' ) {
					utils.initRevealObserver();
				}
			},
			[ resumeState.loading, resumeState.data ]
		);

		const resume = resumeState.data;
		const snapshotItems = normalizeTextList( config.items );
		const focusAreas = normalizeTextList( config.focusAreas );
		const targetRoles = normalizeTextList( resume && resume.targetRoles );
		const actionLinks = ensureArray( config.actionLinks );
		let primaryContent = h( ResumeSnapshotLoadingState );

		if ( ! resumeState.loading ) {
			primaryContent = h(
				'div',
				{ className: 'hdc-home-page__resume-stack' },
				resume && resume.headline ? h( 'h3', { className: 'hdc-home-page__card-title' }, resume.headline ) : null,
				resume && resume.subheadline
					? h( 'p', { className: 'hdc-home-page__card-copy', 'data-contrast-probe': 'ember-body-home' }, resume.subheadline )
					: null,
				h( SnapshotItems, { label: config.label, items: snapshotItems } ),
				targetRoles.length
					? h(
							'div',
							{ className: 'hdc-home-page__badges' },
							targetRoles.map( function ( role ) {
								return h( 'span', { className: 'hdc-home-page__badge', key: role }, role );
							} )
					  )
					: null,
				actionLinks.length
					? h(
							'div',
							{ className: 'hdc-home-page__inline-links' },
							actionLinks.map( function ( link, index ) {
								const normalizedLink = ensureObject( link );
								return h(
									'a',
									{
										className: 'hdc-home-page__text-link focus-ring',
										href: utils.normalizeAppPath( ensureString( normalizedLink.href, '/resume/' ) ),
										key: ensureString( normalizedLink.href, 'resume-link-' + String( index ) ),
									},
									ensureString( normalizedLink.label, 'Learn more' ),
									renderActionArrow()
								);
							} )
					  )
					: null
			);
		}

		return h(
			Fragment,
			{},
			h(
				'div',
				{ className: 'hdc-home-page__resume-card ember-surface' },
				h( 'p', { className: 'hdc-home-page__eyebrow', 'data-contrast-probe': 'ember-eyebrow-home' }, config.positioningEyebrow ),
				primaryContent
			),
			h(
				'div',
				{ className: 'hdc-home-page__resume-card hdc-home-page__resume-card--accent ember-surface ember-surface-strong' },
				h( 'p', { className: 'hdc-home-page__eyebrow' }, config.bestFitEyebrow ),
				h( 'h3', { className: 'hdc-home-page__card-title' }, config.bestFitTitle ),
				h(
					'ul',
					{ className: 'hdc-home-page__list list-accent-disc' },
					focusAreas.map( function ( area, index ) {
						return h( 'li', { key: 'focus-area-' + String( index ) }, ensureString( area, '' ) );
					} )
				)
			)
		);
	}

	function mount( section ) {
		const grid = section.querySelector( '[data-hdc-home-resume-grid]' );

		if ( ! grid ) {
			return;
		}

		const app = h( ResumeSnapshotApp, { config: parseConfig( section ) } );

		if ( typeof createRoot === 'function' ) {
			createRoot( grid ).render( app );
			return;
		}

		legacyRender( app, grid );
	}

	function init() {
		document.querySelectorAll( '[data-hdc-home-resume-snapshot]' ).forEach( mount );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )( window.wp );
