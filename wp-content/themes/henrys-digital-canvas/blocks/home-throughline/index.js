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
	const TextareaControl = components.TextareaControl;
	const Button = components.Button;

	blocks.registerBlockType( 'henrys-digital-canvas/home-throughline', {
		edit: function Edit( props ) {
			const attrs = props.attributes;
			const setAttributes = props.setAttributes;
			const blockProps = useBlockProps( {
				className:
					'hdc-home-page__throughline-grid hdc-home-throughline-editor',
			} );
			const paragraphs = Array.isArray( attrs.paragraphs )
				? attrs.paragraphs
				: [];
			const quote =
				attrs.quote && typeof attrs.quote === 'object'
					? attrs.quote
					: { text: '', attribution: '', eyebrow: '' };

			function updateParagraph( index, next ) {
				const cloned = paragraphs.slice();
				cloned[ index ] = next;
				setAttributes( { paragraphs: cloned } );
			}

			function addParagraph() {
				setAttributes( { paragraphs: paragraphs.concat( [ '' ] ) } );
			}

			function removeParagraph( index ) {
				setAttributes( {
					paragraphs: paragraphs.filter( function ( _, i ) {
						return i !== index;
					} ),
				} );
			}

			function updateQuote( field, next ) {
				const merged = Object.assign( {}, quote );
				merged[ field ] = next;
				setAttributes( { quote: merged } );
			}

			return el(
				Fragment,
				{},
				el(
					InspectorControls,
					{},
					el(
						PanelBody,
						{
							title: __( 'Throughline', 'henrys-digital-canvas' ),
							initialOpen: true,
						},
						el( TextControl, {
							label: __( 'Title', 'henrys-digital-canvas' ),
							value: attrs.title || '',
							onChange( title ) {
								setAttributes( { title } );
							},
						} )
					),
					el(
						PanelBody,
						{
							title: __( 'Paragraphs', 'henrys-digital-canvas' ),
							initialOpen: false,
						},
						paragraphs.map( function ( paragraph, index ) {
							return el(
								'div',
								{
									key: 'p-' + index,
									style: { marginBottom: '12px' },
								},
								el( TextareaControl, {
									label: 'Paragraph ' + ( index + 1 ),
									value: paragraph || '',
									onChange( next ) {
										updateParagraph( index, next );
									},
								} ),
								el(
									Button,
									{
										variant: 'tertiary',
										isDestructive: true,
										onClick() {
											removeParagraph( index );
										},
									},
									__( 'Remove', 'henrys-digital-canvas' )
								)
							);
						} ),
						el(
							Button,
							{ variant: 'secondary', onClick: addParagraph },
							__( 'Add paragraph', 'henrys-digital-canvas' )
						)
					),
					el(
						PanelBody,
						{
							title: __( 'Quote', 'henrys-digital-canvas' ),
							initialOpen: false,
						},
						el( TextControl, {
							label: __( 'Eyebrow', 'henrys-digital-canvas' ),
							value: quote.eyebrow || '',
							onChange( next ) {
								updateQuote( 'eyebrow', next );
							},
						} ),
						el( TextareaControl, {
							label: __( 'Quote text', 'henrys-digital-canvas' ),
							value: quote.text || '',
							onChange( next ) {
								updateQuote( 'text', next );
							},
						} ),
						el( TextControl, {
							label: __( 'Attribution', 'henrys-digital-canvas' ),
							value: quote.attribution || '',
							onChange( next ) {
								updateQuote( 'attribution', next );
							},
						} )
					)
				),
				el(
					'div',
					blockProps,
					el(
						'h2',
						{
							className:
								'hdc-home-page__section-title hdc-home-page__section-title--intro',
						},
						attrs.title ||
							__( 'Throughline', 'henrys-digital-canvas' )
					),
					el(
						'div',
						{ className: 'hdc-home-page__throughline-story' },
						paragraphs.map( function ( p, i ) {
							return el(
								'p',
								{
									key: 'p-' + i,
									className:
										'hdc-home-page__throughline-paragraph',
								},
								p
							);
						} )
					),
					el(
						'aside',
						{ className: 'hdc-home-page__throughline-quote-card' },
						quote.eyebrow
							? el(
									'p',
									{
										className:
											'hdc-home-page__throughline-quote-header',
									},
									quote.eyebrow
							  )
							: null,
						el(
							'blockquote',
							{
								className:
									'hdc-home-page__throughline-blockquote',
							},
							el(
								'p',
								{
									className:
										'hdc-home-page__throughline-quote-text',
								},
								quote.text
							),
							el(
								'footer',
								{
									className:
										'hdc-home-page__throughline-quote-footer',
								},
								quote.attribution
							)
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
