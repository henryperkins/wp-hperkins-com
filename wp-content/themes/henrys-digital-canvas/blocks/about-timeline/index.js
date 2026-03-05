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

	blocks.registerBlockType( 'henrys-digital-canvas/about-timeline', {
		edit: function Edit( props ) {
			const attrs = props.attributes;
			const setAttributes = props.setAttributes;
			const blockProps = useBlockProps( {
				className: 'hdc-about-timeline-editor',
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
							title: __( 'About Timeline Settings', 'henrys-digital-canvas' ),
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
							label: __( 'Show values cards', 'henrys-digital-canvas' ),
							checked: !! attrs.showValues,
							onChange: function ( showValues ) {
								setAttributes( { showValues: showValues } );
							},
						} ),
						el( ToggleControl, {
							label: __( 'Show timeline', 'henrys-digital-canvas' ),
							checked: !! attrs.showTimeline,
							onChange: function ( showTimeline ) {
								setAttributes( { showTimeline: showTimeline } );
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
						__( 'Frontend renders the About profile narrative, values cards, and timeline milestones.', 'henrys-digital-canvas' )
					),
					el( 'h3', { className: 'hdc-about-timeline-editor__title' }, attrs.heading || __( 'About Henry Perkins', 'henrys-digital-canvas' ) )
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
