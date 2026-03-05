( function ( blocks, blockEditor, components, element, i18n ) {
	if ( ! blocks || ! blockEditor || ! components || ! element || ! i18n ) {
		return;
	}

	const el = element.createElement;
	const Fragment = element.Fragment;
	const __ = i18n.__;
	const useBlockProps = blockEditor.useBlockProps;
	const InspectorControls = blockEditor.InspectorControls;
	const PanelBody = components.PanelBody;
	const TextControl = components.TextControl;
	const Notice = components.Notice;

	blocks.registerBlockType( 'henrys-digital-canvas/not-found', {
		edit: function Edit( props ) {
			const attrs = props.attributes;
			const setAttributes = props.setAttributes;
			const blockProps = useBlockProps( {
				className: 'hdc-not-found-editor',
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
							title: __( 'Not Found Settings', 'henrys-digital-canvas' ),
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
							label: __( 'Home button label', 'henrys-digital-canvas' ),
							value: attrs.homeLabel,
							onChange: function ( homeLabel ) {
								setAttributes( { homeLabel: homeLabel } );
							},
						} ),
						el( TextControl, {
							label: __( 'Back button label', 'henrys-digital-canvas' ),
							value: attrs.backLabel,
							onChange: function ( backLabel ) {
								setAttributes( { backLabel: backLabel } );
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
						__( 'Use this block in the 404 template for path-aware recovery actions.', 'henrys-digital-canvas' )
					),
					el( 'h3', { className: 'hdc-not-found-editor__title' }, attrs.heading || __( 'Page not found', 'henrys-digital-canvas' ) )
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
