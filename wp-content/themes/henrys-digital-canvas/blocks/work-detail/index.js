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

	blocks.registerBlockType( 'henrys-digital-canvas/work-detail', {
		edit: function Edit( props ) {
			const attrs = props.attributes;
			const setAttributes = props.setAttributes;
			const blockProps = useBlockProps( {
				className: 'hdc-work-detail-editor',
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
							title: __( 'Work Detail Settings', 'henrys-digital-canvas' ),
							initialOpen: true,
						},
						el( TextControl, {
							label: __( 'Repo slug override', 'henrys-digital-canvas' ),
							help: __( 'Optional. Leave empty to infer from /work/{repo} URL.', 'henrys-digital-canvas' ),
							value: attrs.repo,
							onChange: function ( repo ) {
								setAttributes( { repo: repo } );
							},
						} ),
						el( ToggleControl, {
							label: __( 'Show back link', 'henrys-digital-canvas' ),
							checked: !! attrs.showBackLink,
							onChange: function ( showBackLink ) {
								setAttributes( { showBackLink: showBackLink } );
							},
						} ),
						el( ToggleControl, {
							label: __( 'Show error when repo is missing', 'henrys-digital-canvas' ),
							checked: !! attrs.showWhenMissingRepo,
							onChange: function ( showWhenMissingRepo ) {
								setAttributes( { showWhenMissingRepo: showWhenMissingRepo } );
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
						__( 'Frontend fetches /wp-json/henrys-digital-canvas/v1/work/{repo} and renders the full case-study detail layout.', 'henrys-digital-canvas' )
					),
					el( 'h3', { className: 'hdc-work-detail-editor__title' }, __( 'Work Detail', 'henrys-digital-canvas' ) ),
					attrs.repo
						? el( 'p', { className: 'hdc-work-detail-editor__meta' }, __( 'Repo override:', 'henrys-digital-canvas' ) + ' ' + attrs.repo )
						: el( 'p', { className: 'hdc-work-detail-editor__meta' }, __( 'Repo will be inferred from URL.', 'henrys-digital-canvas' ) )
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
