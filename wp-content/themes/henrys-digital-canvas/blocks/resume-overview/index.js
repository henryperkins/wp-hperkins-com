( function ( blocks, blockEditor, components, element, i18n ) {
	if ( ! blocks || ! blockEditor || ! components || ! element || ! i18n ) {
		return;
	}

	const el = element.createElement;
	const __ = i18n.__;
	const useBlockProps = blockEditor.useBlockProps;
	const Notice = components.Notice;

	blocks.registerBlockType( 'henrys-digital-canvas/resume-overview', {
		edit: function Edit() {
			const blockProps = useBlockProps( {
				className: 'hdc-resume-overview-editor',
			} );

			return el(
				el(
					'div',
					blockProps,
					el(
						Notice,
						{
						status: 'info',
						isDismissible: false,
					},
						__( 'Frontend fetches /wp-json/henrys-digital-canvas/v1/resume and renders the source-of-truth resume layout.', 'henrys-digital-canvas' )
					),
					el( 'h3', { className: 'hdc-resume-overview-editor__title' }, __( 'Resume', 'henrys-digital-canvas' ) ),
					el( 'p', { className: 'hdc-resume-overview-editor__intro' }, __( 'Frontend renders the React-parity resume page with fixed CTAs, section jump links, and live resume contract data.', 'henrys-digital-canvas' ) )
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
