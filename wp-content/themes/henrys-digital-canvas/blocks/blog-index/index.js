( function ( blocks, blockEditor, components, element, i18n ) {
	if ( ! blocks || ! blockEditor || ! components || ! element || ! i18n ) {
		return;
	}

	const el = element.createElement;
	const __ = i18n.__;
	const useBlockProps = blockEditor.useBlockProps;
	const Notice = components.Notice;
	const BLOG_HEADING = __( 'Blog', 'henrys-digital-canvas' );
	const BLOG_DESCRIPTION = __( 'Writing on customer-facing engineering, AI workflows, WordPress delivery, and support-to-implementation systems.', 'henrys-digital-canvas' );

	blocks.registerBlockType( 'henrys-digital-canvas/blog-index', {
		edit: function Edit() {
			const blockProps = useBlockProps( {
				className: 'hdc-blog-index-editor',
			} );

			return el(
				'div',
				blockProps,
				el(
					Notice,
					{
						status: 'info',
						isDismissible: false,
					},
					__( 'Frontend fetches /wp-json/henrys-digital-canvas/v1/blog and renders the React-matched featured and archive states.', 'henrys-digital-canvas' )
				),
				el( 'h3', { className: 'hdc-blog-index-editor__title' }, BLOG_HEADING ),
				el( 'p', { className: 'hdc-blog-index-editor__description' }, BLOG_DESCRIPTION )
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
