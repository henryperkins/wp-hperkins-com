( function ( blocks, blockEditor, components, element, i18n ) {
	const el = element.createElement;
	const __ = i18n.__;
	const Fragment = element.Fragment;
	const useBlockProps = blockEditor.useBlockProps;
	const InspectorControls = blockEditor.InspectorControls;
	const PanelBody = components.PanelBody;
	const TextControl = components.TextControl;
	const TextareaControl = components.TextareaControl;
	const Notice = components.Notice;

	blocks.registerBlockType( 'henrys-digital-canvas/work-showcase', {
		edit: function Edit( props ) {
			const attrs = props.attributes;
			const setAttributes = props.setAttributes;
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
							'Frontend uses React state for GitHub sync, filtering, and timeline/grid presentation.',
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
							'Save and view on the frontend to run live GitHub fetching and work page interactions.',
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
