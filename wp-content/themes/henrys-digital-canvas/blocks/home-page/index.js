( function ( blocks, blockEditor, element, i18n ) {
	if ( ! blocks || ! blockEditor || ! element || ! i18n ) {
		return;
	}

	const el = element.createElement;
	const useBlockProps = blockEditor.useBlockProps;
	const useInnerBlocksProps =
		blockEditor.useInnerBlocksProps ||
		blockEditor.__experimentalUseInnerBlocksProps;
	const InnerBlocks = blockEditor.InnerBlocks;

	const TEMPLATE = [
		[ 'henrys-digital-canvas/home-hero', {} ],
		[ 'henrys-digital-canvas/home-selected-work', {} ],
		[ 'henrys-digital-canvas/home-throughline', {} ],
		[ 'henrys-digital-canvas/home-resume-snapshot', {} ],
		[ 'henrys-digital-canvas/home-recent-writing', {} ],
		[ 'henrys-digital-canvas/home-contact-cta', {} ],
	];

	const ALLOWED_BLOCKS = TEMPLATE.map( function ( pair ) {
		return pair[ 0 ];
	} );

	blocks.registerBlockType( 'henrys-digital-canvas/home-page', {
		edit: function Edit() {
			const blockProps = useBlockProps( {
				className: 'hdc-home-page',
			} );
			const innerBlocksProps = useInnerBlocksProps(
				{
					className: 'hdc-home-page__shell',
				},
				{
					template: TEMPLATE,
					templateLock: 'all',
					allowedBlocks: ALLOWED_BLOCKS,
					renderAppender: false,
				}
			);
			return el( 'section', blockProps, el( 'div', innerBlocksProps ) );
		},
		save: function Save() {
			return el( InnerBlocks.Content, {} );
		},
	} );
} )(
	window.wp.blocks,
	window.wp.blockEditor,
	window.wp.element,
	window.wp.i18n
);
