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

	blocks.registerBlockType( 'henrys-digital-canvas/home-selected-work', {
		edit: function Edit( props ) {
			const attrs = props.attributes;
			const setAttributes = props.setAttributes;
			const blockProps = useBlockProps( {
				className:
					'hdc-home-page__section hdc-home-page__section--work hdc-home-selected-work-editor',
			} );

			function textInput( label, key, isTextarea ) {
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
							title: __( 'Heading', 'henrys-digital-canvas' ),
							initialOpen: true,
						},
						textInput( 'Section title', 'title', false ),
						textInput( 'Action label', 'actionLabel', false ),
						textInput( 'Action href', 'actionHref', false )
					),
					el(
						PanelBody,
						{
							title: __(
								'Featured repositories',
								'henrys-digital-canvas'
							),
							initialOpen: false,
						},
						el( RangeControl, {
							label: __(
								'Repos to display',
								'henrys-digital-canvas'
							),
							value: Number.isFinite( Number( attrs.repoCount ) )
								? Number( attrs.repoCount )
								: 3,
							min: 1,
							max: 6,
							onChange( repoCount ) {
								setAttributes( { repoCount } );
							},
						} )
					),
					el(
						PanelBody,
						{
							title: __(
								'Empty and status copy',
								'henrys-digital-canvas'
							),
							initialOpen: false,
						},
						textInput( 'Loading label', 'loadingLabel', false ),
						textInput( 'Empty title', 'emptyTitle', false ),
						textInput(
							'Empty description (live)',
							'emptyDescriptionLive',
							true
						),
						textInput(
							'Empty description (fallback)',
							'emptyDescriptionFallback',
							true
						)
					)
				),
				el(
					'div',
					blockProps,
					el(
						Notice,
						{ status: 'info', isDismissible: false },
						__(
							'Live: fetches featured repos from GitHub with fallback, sorted by priority then recency. Editor shows the configured copy.',
							'henrys-digital-canvas'
						)
					),
					el(
						'h2',
						{ className: 'hdc-home-page__section-title' },
						attrs.title ||
							__( 'Selected Work', 'henrys-digital-canvas' )
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
