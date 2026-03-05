( function ( blocks, blockEditor, components, element, i18n ) {
	const el = element.createElement;
	const __ = i18n.__;
	const Fragment = element.Fragment;
	const useBlockProps = blockEditor.useBlockProps;
	const InspectorControls = blockEditor.InspectorControls;
	const PanelBody = components.PanelBody;
	const TextControl = components.TextControl;
	const TextareaControl = components.TextareaControl;
	const ToggleControl = components.ToggleControl;
	const RangeControl = components.RangeControl;
	const Notice = components.Notice;

	blocks.registerBlockType( 'henrys-digital-canvas/work-showcase', {
		edit: function Edit( props ) {
			const attrs = props.attributes;
			const setAttributes = props.setAttributes;
			const showSignalsPanel = attrs.showSignalsPanel !== false;
			const showActivitySparkline = attrs.showActivitySparkline !== false;
			const blockProps = useBlockProps( {
				className: 'hdc-work-showcase-editor',
			} );

			return el(
				Fragment,
				{},
				el(
					InspectorControls,
					{},
					el(
						PanelBody,
						{
							title: __( 'Work Showcase Settings', 'henrys-digital-canvas' ),
							initialOpen: true,
						},
						el( TextControl, {
							label: __( 'Heading', 'henrys-digital-canvas' ),
							value: attrs.heading,
							onChange: function ( heading ) {
								setAttributes( { heading: heading } );
							},
						} ),
						el( TextareaControl, {
							label: __( 'Description', 'henrys-digital-canvas' ),
							value: attrs.description,
							onChange: function ( description ) {
								setAttributes( { description: description } );
							},
						} ),
						el( TextControl, {
							label: __( 'GitHub username', 'henrys-digital-canvas' ),
							value: attrs.githubUsername,
							onChange: function ( githubUsername ) {
								setAttributes( { githubUsername: githubUsername } );
							},
						} ),
						el( RangeControl, {
							label: __( 'Repository count', 'henrys-digital-canvas' ),
							value: attrs.repoCount,
							onChange: function ( repoCount ) {
								setAttributes( { repoCount: repoCount || 100 } );
							},
							min: 1,
							max: 100,
						} ),
						el( RangeControl, {
							label: __( 'Comparison limit', 'henrys-digital-canvas' ),
							value: attrs.compareLimit,
							onChange: function ( compareLimit ) {
								setAttributes( { compareLimit: compareLimit || 2 } );
							},
							min: 2,
							max: 6,
						} ),
						el( ToggleControl, {
							label: __( 'Include forked repositories', 'henrys-digital-canvas' ),
							checked: !! attrs.includeForks,
							onChange: function ( includeForks ) {
								setAttributes( { includeForks: includeForks } );
							},
						} ),
						el( ToggleControl, {
							label: __( 'Include archived repositories', 'henrys-digital-canvas' ),
							checked: !! attrs.includeArchived,
							onChange: function ( includeArchived ) {
								setAttributes( { includeArchived: includeArchived } );
							},
						} ),
						el( ToggleControl, {
							label: __( 'Open repository links in new tab', 'henrys-digital-canvas' ),
							checked: !! attrs.openInNewTab,
							onChange: function ( openInNewTab ) {
								setAttributes( { openInNewTab: openInNewTab } );
							},
						} ),
						el( ToggleControl, {
							label: __( 'Show engineering signals section', 'henrys-digital-canvas' ),
							checked: showSignalsPanel,
							onChange: function ( showSignalsPanel ) {
								setAttributes( { showSignalsPanel: showSignalsPanel } );
							},
						} ),
						el( ToggleControl, {
							label: __( 'Show activity sparkline graph', 'henrys-digital-canvas' ),
							checked: showActivitySparkline,
							onChange: function ( showActivitySparkline ) {
								setAttributes( { showActivitySparkline: showActivitySparkline } );
							},
							disabled: ! showSignalsPanel,
						} ),
						el( RangeControl, {
							label: __( 'Sparkline week range', 'henrys-digital-canvas' ),
							value: attrs.sparklineWeeks || 8,
							onChange: function ( sparklineWeeks ) {
								setAttributes( { sparklineWeeks: sparklineWeeks || 8 } );
							},
							min: 4,
							max: 16,
							disabled: ! showSignalsPanel || ! showActivitySparkline,
						} )
					)
				),
				el(
					'div',
					blockProps,
					el(
						Notice,
						{
							status: 'info',
							isDismissible: false,
						},
						__(
							'Frontend uses React state for GitHub sync/fallback, filters, compare sheet, and timeline/grid views.',
							'henrys-digital-canvas'
						)
					),
					el( 'h3', { className: 'hdc-work-heading' }, attrs.heading || __( 'Work', 'henrys-digital-canvas' ) ),
					el(
						'p',
						{ className: 'hdc-work-description' },
						attrs.description || __( 'A mix of public GitHub repositories and private case studies with compare and filter controls.', 'henrys-digital-canvas' )
					),
					el(
						'p',
						{ className: 'hdc-work-editor-meta' },
						__(
							'Save and view on frontend to run live GitHub fetching and compare interactions.',
							'henrys-digital-canvas'
						)
					)
				)
			);
		},
		save: function Save() {
			return null;
		},
	} );
} )(
	window.wp.blocks,
	window.wp.blockEditor,
	window.wp.components,
	window.wp.element,
	window.wp.i18n
);
