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

	blocks.registerBlockType( 'henrys-digital-canvas/home-hero', {
		edit: function Edit( props ) {
			const attrs = props.attributes;
			const setAttributes = props.setAttributes;
			const blockProps = useBlockProps( {
				className: 'hdc-home-page__hero hdc-home-hero-editor',
			} );

			function inputFor( label, key, isTextarea ) {
				const Control = isTextarea ? TextareaControl : TextControl;
				return el( Control, {
					label: __( label, 'henrys-digital-canvas' ),
					value: attrs[ key ] || '',
					onChange: function ( next ) {
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
						{ title: __( 'Hero copy', 'henrys-digital-canvas' ), initialOpen: true },
						inputFor( 'Eyebrow', 'eyebrow', false ),
						inputFor( 'Title', 'title', true ),
						inputFor( 'Description', 'description', true )
					),
					el(
						PanelBody,
						{ title: __( 'Primary CTA', 'henrys-digital-canvas' ), initialOpen: false },
						inputFor( 'Primary CTA label', 'primaryCtaLabel', false ),
						inputFor( 'Primary CTA href', 'primaryCtaHref', false )
					),
					el(
						PanelBody,
						{ title: __( 'Secondary CTA', 'henrys-digital-canvas' ), initialOpen: false },
						inputFor( 'Secondary CTA label', 'secondaryCtaLabel', false ),
						inputFor( 'Secondary CTA href', 'secondaryCtaHref', false )
					)
				),
				el(
					'div',
					blockProps,
					attrs.eyebrow ? el( 'p', { className: 'hdc-home-page__hero-eyebrow' }, attrs.eyebrow ) : null,
					el( 'h1', { className: 'hdc-home-page__hero-title' }, attrs.title || __( 'Home hero', 'henrys-digital-canvas' ) ),
					el( 'p', { className: 'hdc-home-page__hero-description' }, attrs.description || '' ),
					el(
						'div',
						{ className: 'hdc-home-page__hero-actions' },
						el( 'span', { className: 'hdc-home-page__button hdc-home-page__button--hero' }, attrs.primaryCtaLabel || __( 'Primary CTA', 'henrys-digital-canvas' ) ),
						el( 'span', { className: 'hdc-home-page__button hdc-home-page__button--hero-secondary' }, attrs.secondaryCtaLabel || __( 'Secondary CTA', 'henrys-digital-canvas' ) )
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
