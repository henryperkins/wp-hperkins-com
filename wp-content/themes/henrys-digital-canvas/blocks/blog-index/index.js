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
	const ToggleControl = components.ToggleControl;
	const Notice = components.Notice;

	blocks.registerBlockType( 'henrys-digital-canvas/blog-index', {
		edit: function Edit( props ) {
			const attrs = props.attributes;
			const setAttributes = props.setAttributes;
			const blockProps = useBlockProps( {
				className: 'hdc-blog-index-editor',
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
							title: __( 'Blog Index Settings', 'henrys-digital-canvas' ),
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
							label: __( 'Description', 'henrys-digital-canvas' ),
							value: attrs.description,
							onChange: function ( description ) {
								setAttributes( { description: description } );
							},
						} ),
						el( ToggleControl, {
							label: __( 'Show LinkedIn + contact CTA', 'henrys-digital-canvas' ),
							checked: !! attrs.showNewsletterCta,
							onChange: function ( showNewsletterCta ) {
								setAttributes( { showNewsletterCta: showNewsletterCta } );
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
						__( 'Frontend fetches /wp-json/henrys-digital-canvas/v1/blog and renders featured + filterable post listings.', 'henrys-digital-canvas' )
					),
					el( 'h3', { className: 'hdc-blog-index-editor__title' }, attrs.heading || __( 'Blog', 'henrys-digital-canvas' ) ),
					el( 'p', { className: 'hdc-blog-index-editor__description' }, attrs.description || __( 'Notes on engineering and product craft.', 'henrys-digital-canvas' ) )
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
