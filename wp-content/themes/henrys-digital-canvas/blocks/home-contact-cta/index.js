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

	blocks.registerBlockType( 'henrys-digital-canvas/home-contact-cta', {
		edit: function Edit( props ) {
			const attrs = props.attributes;
			const setAttributes = props.setAttributes;
			const blockProps = useBlockProps( {
				className:
					'hdc-home-page__cta-card hdc-home-contact-cta-editor surface-library-ember-veil',
			} );

			function inputFor( label, key, isTextarea ) {
				const Control = isTextarea ? TextareaControl : TextControl;
				return el( Control, {
					label,
					value: attrs[ key ] || '',
					onChange( next ) {
						const update = {};
						update[ key ] = next;
						setAttributes( update );
					},
				} );
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
							title: __(
								'Contact CTA copy',
								'henrys-digital-canvas'
							),
							initialOpen: true,
						},
						inputFor( 'Eyebrow', 'eyebrow', false ),
						inputFor( 'Title', 'title', true ),
						inputFor( 'Description', 'description', true )
					),
					el(
						PanelBody,
						{
							title: __( 'Primary CTA', 'henrys-digital-canvas' ),
							initialOpen: false,
						},
						inputFor(
							'Primary CTA label',
							'primaryCtaLabel',
							false
						),
						inputFor( 'Primary CTA href', 'primaryCtaHref', false )
					),
					el(
						PanelBody,
						{
							title: __(
								'Secondary CTA',
								'henrys-digital-canvas'
							),
							initialOpen: false,
						},
						inputFor(
							'Secondary CTA label',
							'secondaryCtaLabel',
							false
						),
						inputFor(
							'Secondary CTA href',
							'secondaryCtaHref',
							false
						)
					)
				),
				el(
					'div',
					blockProps,
					el(
						'div',
						{ className: 'hdc-home-page__cta-layout' },
						el(
							'div',
							{ className: 'hdc-home-page__cta-body' },
							attrs.eyebrow
								? el(
										'p',
										{ className: 'hdc-home-page__eyebrow' },
										attrs.eyebrow
								  )
								: null,
							el(
								'h2',
								{ className: 'hdc-home-page__section-title' },
								attrs.title ||
									__( 'Contact CTA', 'henrys-digital-canvas' )
							),
							el(
								'p',
								{ className: 'hdc-home-page__copy' },
								attrs.description || ''
							)
						),
						el(
							'div',
							{ className: 'hdc-home-page__cta-actions' },
							el(
								'span',
								{ className: 'hdc-home-page__button' },
								attrs.primaryCtaLabel ||
									__( 'Primary CTA', 'henrys-digital-canvas' )
							),
							el(
								'span',
								{
									className:
										'hdc-home-page__button hdc-home-page__button--secondary',
								},
								attrs.secondaryCtaLabel ||
									__(
										'Secondary CTA',
										'henrys-digital-canvas'
									)
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
