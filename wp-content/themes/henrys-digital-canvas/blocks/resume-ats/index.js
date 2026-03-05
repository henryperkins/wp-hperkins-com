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

	blocks.registerBlockType( 'henrys-digital-canvas/resume-ats', {
		edit: function Edit( props ) {
			const attrs = props.attributes;
			const setAttributes = props.setAttributes;
			const blockProps = useBlockProps( {
				className: 'hdc-resume-ats-editor',
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
							title: __( 'ATS Resume Settings', 'henrys-digital-canvas' ),
							initialOpen: true,
						},
						el( TextControl, {
							label: __( 'Heading', 'henrys-digital-canvas' ),
							value: attrs.heading,
							onChange: function ( heading ) {
								setAttributes( { heading: heading } );
							},
						} ),
						el( ToggleControl, {
							label: __( 'Show print button', 'henrys-digital-canvas' ),
							checked: !! attrs.showPrintButton,
							onChange: function ( showPrintButton ) {
								setAttributes( { showPrintButton: showPrintButton } );
							},
						} ),
						el( ToggleControl, {
							label: __( 'Show link back to interactive resume', 'henrys-digital-canvas' ),
							checked: !! attrs.showBackLink,
							onChange: function ( showBackLink ) {
								setAttributes( { showBackLink: showBackLink } );
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
						__( 'Frontend fetches /wp-json/henrys-digital-canvas/v1/resume-ats and renders a print-ready one-page layout.', 'henrys-digital-canvas' )
					),
					el( 'h3', { className: 'hdc-resume-ats-editor__title' }, attrs.heading || __( 'ATS One-Page Resume', 'henrys-digital-canvas' ) ),
					el( 'p', { className: 'hdc-resume-ats-editor__meta' }, __( 'Save and preview on the frontend to test print and validation behavior.', 'henrys-digital-canvas' ) )
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
