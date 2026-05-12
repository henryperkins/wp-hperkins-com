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
	const Button = components.Button;
	const Notice = components.Notice;

	blocks.registerBlockType( 'henrys-digital-canvas/home-selected-work', {
		edit: function Edit( props ) {
			const attrs = props.attributes;
			const setAttributes = props.setAttributes;
			const blockProps = useBlockProps( {
				className:
					'hdc-home-page__section hdc-home-page__section--work hdc-home-selected-work-editor',
			} );
			const repoNames = Array.isArray( attrs.featuredRepoNames )
				? attrs.featuredRepoNames
				: [];

			function updateRepoName( index, next ) {
				const cloned = repoNames.slice();
				cloned[ index ] = next.trim();
				setAttributes( { featuredRepoNames: cloned } );
			}

			function addRepoName() {
				setAttributes( {
					featuredRepoNames: repoNames.concat( [ '' ] ),
				} );
			}

			function removeRepoName( index ) {
				setAttributes( {
					featuredRepoNames: repoNames.filter( function ( _, i ) {
						return i !== index;
					} ),
				} );
			}

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
						} ),
						repoNames.map( function ( name, index ) {
							return el(
								'div',
								{
									key: 'repo-' + index,
									style: { marginBottom: '8px' },
								},
								el( TextControl, {
									label: 'Repo #' + ( index + 1 ),
									value: name || '',
									onChange( next ) {
										updateRepoName( index, next );
									},
								} ),
								el(
									Button,
									{
										variant: 'tertiary',
										isDestructive: true,
										onClick() {
											removeRepoName( index );
										},
									},
									__( 'Remove', 'henrys-digital-canvas' )
								)
							);
						} ),
						el(
							Button,
							{ variant: 'secondary', onClick: addRepoName },
							__( 'Add repo', 'henrys-digital-canvas' )
						)
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
						textInput(
							'Source label (live)',
							'sourceLiveLabel',
							true
						),
						textInput(
							'Source label (fallback)',
							'sourceFallbackLabel',
							true
						),
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
							'Live: fetches selected repos from GitHub with fallback. Editor shows the configured selection.',
							'henrys-digital-canvas'
						)
					),
					el(
						'h2',
						{ className: 'hdc-home-page__section-title' },
						attrs.title ||
							__( 'Selected Work', 'henrys-digital-canvas' )
					),
					el(
						'p',
						{ className: 'hdc-home-page__editor-meta' },
						__( 'Featured:', 'henrys-digital-canvas' ) +
							repoNames.join( ', ' )
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
