( function ( blocks, blockEditor, components, element, i18n ) {
	if ( ! blocks || ! blockEditor || ! components || ! element || ! i18n ) {
		return;
	}

	const el = element.createElement;
	const Fragment = element.Fragment;
	const __ = i18n.__;
	const InspectorControls = blockEditor.InspectorControls;
	const useBlockProps = blockEditor.useBlockProps;
	const PanelBody = components.PanelBody;
	const TextControl = components.TextControl;
	const ToggleControl = components.ToggleControl;
	const Notice = components.Notice;

	blocks.registerBlockType( 'henrys-digital-canvas/resume-overview', {
		edit: function Edit( props ) {
			const attrs = props.attributes;
			const setAttributes = props.setAttributes;
			const blockProps = useBlockProps( {
				className: 'hdc-resume-overview-editor',
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
							title: __( 'Resume Overview Settings', 'henrys-digital-canvas' ),
							initialOpen: true,
						},
						el( TextControl, {
							label: __( 'Heading', 'henrys-digital-canvas' ),
							value: attrs.heading,
							onChange: function ( heading ) {
								setAttributes( { heading: heading } );
							},
						} ),
						el( TextControl, {
							label: __( 'Optional intro override', 'henrys-digital-canvas' ),
							value: attrs.intro,
							onChange: function ( intro ) {
								setAttributes( { intro: intro } );
							},
						} ),
						el( ToggleControl, {
							label: __( 'Show ATS link', 'henrys-digital-canvas' ),
							checked: !! attrs.showAtsLink,
							onChange: function ( showAtsLink ) {
								setAttributes( { showAtsLink: showAtsLink } );
							},
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
						__( 'Frontend fetches /wp-json/henrys-digital-canvas/v1/resume and renders the OSOT resume layout with section jump links.', 'henrys-digital-canvas' )
					),
					el( 'h3', { className: 'hdc-resume-overview-editor__title' }, attrs.heading || __( 'Resume', 'henrys-digital-canvas' ) ),
					el( 'p', { className: 'hdc-resume-overview-editor__intro' }, attrs.intro || __( 'Frontend renders the OSOT resume structure, not a custom summary block.', 'henrys-digital-canvas' ) )
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
