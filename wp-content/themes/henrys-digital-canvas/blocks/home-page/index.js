( function ( blocks, blockEditor, components, element, i18n ) {
	if ( ! blocks || ! blockEditor || ! components || ! element || ! i18n ) {
		return;
	}

	const el = element.createElement;
	const __ = i18n.__;
	const useBlockProps = blockEditor.useBlockProps;
	const Notice = components.Notice;

	blocks.registerBlockType( 'henrys-digital-canvas/home-page', {
		edit: function Edit() {
			const blockProps = useBlockProps( {
				className: 'hdc-home-page-editor',
			} );

			return el(
				'div',
				blockProps,
				el(
					Notice,
					{
						isDismissible: false,
						status: 'info',
					},
					__(
						'Frontend renders the OSOT homepage structure: hero, selected work, resume snapshot, recent writing, and contact CTA.',
						'henrys-digital-canvas'
					)
				),
				el( 'h3', { className: 'hdc-home-page-editor__title' }, __( 'Home Page', 'henrys-digital-canvas' ) ),
				el(
					'p',
					{ className: 'hdc-home-page-editor__description' },
					__(
						'Use the frontend to review live GitHub source labeling, recent writing cards, and the resume snapshot contract.',
						'henrys-digital-canvas'
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
