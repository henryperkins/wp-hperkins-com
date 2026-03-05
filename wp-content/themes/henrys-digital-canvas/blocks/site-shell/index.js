( function ( blocks, blockEditor, components, element, i18n ) {
	if ( ! blocks || ! blockEditor || ! components || ! element || ! i18n ) {
		return;
	}

	const el = element.createElement;
	const Fragment = element.Fragment;
	const __ = i18n.__;
	const InspectorControls = blockEditor.InspectorControls;
	const PanelBody = components.PanelBody;
	const TextControl = components.TextControl;
	const ToggleControl = components.ToggleControl;
	const Notice = components.Notice;
	const useBlockProps = blockEditor.useBlockProps;

	blocks.registerBlockType( 'henrys-digital-canvas/site-shell', {
		edit: function Edit( props ) {
			const attrs = props.attributes;
			const setAttributes = props.setAttributes;
			const blockProps = useBlockProps( {
				className: 'hdc-site-shell-editor',
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
							title: __( 'Site Shell Settings', 'henrys-digital-canvas' ),
							initialOpen: true,
						},
						el( TextControl, {
							label: __( 'Site title', 'henrys-digital-canvas' ),
							value: attrs.siteTitle,
							onChange: function ( siteTitle ) {
								setAttributes( { siteTitle: siteTitle } );
							},
						} ),
						el( TextControl, {
							label: __( 'Tagline', 'henrys-digital-canvas' ),
							value: attrs.tagline,
							onChange: function ( tagline ) {
								setAttributes( { tagline: tagline } );
							},
						} ),
						el( ToggleControl, {
							label: __( 'Show command launcher', 'henrys-digital-canvas' ),
							checked: !! attrs.showCommandLauncher,
							onChange: function ( showCommandLauncher ) {
								setAttributes( { showCommandLauncher: showCommandLauncher } );
							},
						} ),
						el( ToggleControl, {
							label: __( 'Enable theme switcher', 'henrys-digital-canvas' ),
							checked: !! attrs.enableThemeToggle,
							onChange: function ( enableThemeToggle ) {
								setAttributes( { enableThemeToggle: enableThemeToggle } );
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
							'This block renders the shared site shell on the frontend (header navigation, theme switcher, and command launcher).',
							'henrys-digital-canvas'
						)
					),
					el( 'p', { className: 'hdc-site-shell-editor__title' }, attrs.siteTitle || __( 'Henry T. Perkins', 'henrys-digital-canvas' ) ),
					attrs.tagline
						? el( 'p', { className: 'hdc-site-shell-editor__tagline' }, attrs.tagline )
						: null
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
