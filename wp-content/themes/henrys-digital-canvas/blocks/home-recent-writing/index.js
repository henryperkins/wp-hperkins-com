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
	const RangeControl = components.RangeControl;
	const Notice = components.Notice;

	blocks.registerBlockType( 'henrys-digital-canvas/home-recent-writing', {
		edit: function Edit( props ) {
			const attrs = props.attributes;
			const setAttributes = props.setAttributes;
			const blockProps = useBlockProps( {
				className: 'hdc-home-page__section hdc-home-page__section--writing hdc-home-recent-writing-editor hdc-feed-section',
			} );

			function input( label, key, isTextarea ) {
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
						{ title: __( 'Heading', 'henrys-digital-canvas' ), initialOpen: true },
						input( 'Section title', 'title', false ),
						input( 'Action label', 'actionLabel', false ),
						input( 'Action href', 'actionHref', false )
					),
					el(
						PanelBody,
						{ title: __( 'Feed', 'henrys-digital-canvas' ), initialOpen: false },
						el( RangeControl, {
							label: __( 'Posts to display', 'henrys-digital-canvas' ),
							value: Number.isFinite( Number( attrs.blogCount ) ) ? Number( attrs.blogCount ) : 3,
							min: 1,
							max: 6,
							onChange: function ( blogCount ) {
								setAttributes( { blogCount: blogCount } );
							},
						} )
					),
					el(
						PanelBody,
						{ title: __( 'Empty state', 'henrys-digital-canvas' ), initialOpen: false },
						input( 'Empty title', 'emptyTitle', false ),
						input( 'Empty description', 'emptyDescription', true )
					),
					el( PanelBody, { title: __( 'Advanced', 'henrys-digital-canvas' ), initialOpen: false }, input( 'Blog endpoint (override)', 'blogEndpoint', false ) )
				),
				el(
					'div',
					blockProps,
					el(
						Notice,
						{ status: 'info', isDismissible: false },
						__( 'Live: fetches blog posts via REST. Editor shows a placeholder summary.', 'henrys-digital-canvas' )
					),
					el( 'h2', { className: 'hdc-home-page__section-title' }, attrs.title || __( 'Recent Writing', 'henrys-digital-canvas' ) ),
					el(
						'p',
						{ className: 'hdc-home-page__editor-meta' },
						__( 'Showing the ', 'henrys-digital-canvas' ) +
							( Number.isFinite( Number( attrs.blogCount ) ) ? Number( attrs.blogCount ) : 3 ) +
							__( ' most recent posts.', 'henrys-digital-canvas' )
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
