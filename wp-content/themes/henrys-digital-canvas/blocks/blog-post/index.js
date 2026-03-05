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

	blocks.registerBlockType( 'henrys-digital-canvas/blog-post', {
		edit: function Edit( props ) {
			const attrs = props.attributes;
			const setAttributes = props.setAttributes;
			const blockProps = useBlockProps( {
				className: 'hdc-blog-post-editor',
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
							title: __( 'Blog Post Settings', 'henrys-digital-canvas' ),
							initialOpen: true,
						},
						el( TextControl, {
							label: __( 'Slug override', 'henrys-digital-canvas' ),
							help: __( 'Optional. Leave empty to infer from /blog/{slug} URL.', 'henrys-digital-canvas' ),
							value: attrs.slug,
							onChange: function ( slug ) {
								setAttributes( { slug: slug } );
							},
						} ),
						el( ToggleControl, {
							label: __( 'Show reading progress bar', 'henrys-digital-canvas' ),
							checked: !! attrs.showProgress,
							onChange: function ( showProgress ) {
								setAttributes( { showProgress: showProgress } );
							},
						} ),
						el( ToggleControl, {
							label: __( 'Show scroll-to-top button', 'henrys-digital-canvas' ),
							checked: !! attrs.showScrollTop,
							onChange: function ( showScrollTop ) {
								setAttributes( { showScrollTop: showScrollTop } );
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
						__( 'Frontend fetches /wp-json/henrys-digital-canvas/v1/blog/{slug} and renders the article detail experience.', 'henrys-digital-canvas' )
					),
					el( 'h3', { className: 'hdc-blog-post-editor__title' }, __( 'Blog Post Detail', 'henrys-digital-canvas' ) ),
					attrs.slug
						? el( 'p', { className: 'hdc-blog-post-editor__slug' }, __( 'Slug override:', 'henrys-digital-canvas' ) + ' ' + attrs.slug )
						: el( 'p', { className: 'hdc-blog-post-editor__slug' }, __( 'Slug will be inferred from the URL path.', 'henrys-digital-canvas' ) )
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
