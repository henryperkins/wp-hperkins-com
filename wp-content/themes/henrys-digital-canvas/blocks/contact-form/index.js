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

	blocks.registerBlockType( 'henrys-digital-canvas/contact-form', {
		edit: function Edit( props ) {
			const attrs = props.attributes;
			const setAttributes = props.setAttributes;
			const blockProps = useBlockProps( {
				className: 'hdc-contact-form-editor',
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
							title: __( 'Contact Form Settings', 'henrys-digital-canvas' ),
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
							label: __( 'Show social links', 'henrys-digital-canvas' ),
							checked: !! attrs.showSocialLinks,
							onChange: function ( showSocialLinks ) {
								setAttributes( { showSocialLinks: showSocialLinks } );
							},
						} ),
						el( TextControl, {
							label: __( 'Submit label', 'henrys-digital-canvas' ),
							value: attrs.submitLabel,
							onChange: function ( submitLabel ) {
								setAttributes( { submitLabel: submitLabel } );
							},
						} ),
						el( TextControl, {
							label: __( 'Submitting label', 'henrys-digital-canvas' ),
							value: attrs.submittingLabel,
							onChange: function ( submittingLabel ) {
								setAttributes( { submittingLabel: submittingLabel } );
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
						__( 'Frontend posts form payloads to /api/contact and preserves client validation + submit states.', 'henrys-digital-canvas' )
					),
					el( 'h3', { className: 'hdc-contact-form-editor__title' }, attrs.heading || __( 'Contact', 'henrys-digital-canvas' ) ),
					el( 'p', { className: 'hdc-contact-form-editor__description' }, attrs.description || __( 'Open to opportunities and consulting engagements.', 'henrys-digital-canvas' ) )
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
