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
	const Notice = components.Notice;

	function asArray( value ) {
		return Array.isArray( value ) ? value : [];
	}

	function asObject( value ) {
		return value && typeof value === 'object' ? value : {};
	}

	function renderStringRepeater( labelPrefix, attrKey, attrs, setAttributes ) {
		const list = asArray( attrs[ attrKey ] );
		return el(
			Fragment,
			{},
			list.map( function ( item, index ) {
				return el(
					'div',
					{ key: attrKey + '-' + index, style: { marginBottom: '8px' } },
					el( TextareaControl, {
						label: __( labelPrefix + ' ' + ( index + 1 ), 'henrys-digital-canvas' ),
						value: item,
						onChange: function ( next ) {
							const cloned = list.slice();
							const update = {};
							cloned[ index ] = next;
							update[ attrKey ] = cloned;
							setAttributes( update );
						},
					} ),
					el(
						Button,
						{
							variant: 'tertiary',
							isDestructive: true,
							onClick: function () {
								const update = {};
								update[ attrKey ] = list.filter( function ( _, i ) {
									return i !== index;
								} );
								setAttributes( update );
							},
						},
						__( 'Remove', 'henrys-digital-canvas' )
					)
				);
			} ),
			el(
				Button,
				{
					variant: 'secondary',
					onClick: function () {
						const update = {};
						update[ attrKey ] = list.concat( [ '' ] );
						setAttributes( update );
					},
				},
				__( 'Add ' + labelPrefix.toLowerCase(), 'henrys-digital-canvas' )
			)
		);
	}

	function renderActionLinksRepeater( attrs, setAttributes ) {
		const list = asArray( attrs.actionLinks );

		function updateField( index, field, value ) {
			const cloned = list.map( function ( item, i ) {
				if ( i !== index ) {
					return item;
				}
				const merged = Object.assign( {}, asObject( item ) );
				merged[ field ] = value;
				return merged;
			} );
			setAttributes( { actionLinks: cloned } );
		}

		return el(
			Fragment,
			{},
			list.map( function ( link, index ) {
				const item = asObject( link );
				return el(
					'div',
					{ key: 'al-' + index, style: { marginBottom: '8px' } },
					el( TextControl, {
						label: __( 'Link ' + ( index + 1 ) + ' label', 'henrys-digital-canvas' ),
						value: item.label || '',
						onChange: function ( next ) {
							updateField( index, 'label', next );
						},
					} ),
					el( TextControl, {
						label: __( 'Link ' + ( index + 1 ) + ' href', 'henrys-digital-canvas' ),
						value: item.href || '',
						onChange: function ( next ) {
							updateField( index, 'href', next );
						},
					} ),
					el(
						Button,
						{
							variant: 'tertiary',
							isDestructive: true,
							onClick: function () {
								setAttributes( {
									actionLinks: list.filter( function ( _, i ) {
										return i !== index;
									} ),
								} );
							},
						},
						__( 'Remove', 'henrys-digital-canvas' )
					)
				);
			} ),
			el(
				Button,
				{
					variant: 'secondary',
					onClick: function () {
						setAttributes( { actionLinks: list.concat( [ { label: '', href: '' } ] ) } );
					},
				},
				__( 'Add link', 'henrys-digital-canvas' )
			)
		);
	}

	blocks.registerBlockType( 'henrys-digital-canvas/home-resume-snapshot', {
		edit: function Edit( props ) {
			const attrs = props.attributes;
			const setAttributes = props.setAttributes;
			const blockProps = useBlockProps( {
				className: 'hdc-home-page__section hdc-home-page__section--resume hdc-home-resume-snapshot-editor',
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
						{ title: __( 'Positioning', 'henrys-digital-canvas' ), initialOpen: false },
						input( 'Eyebrow', 'positioningEyebrow', false ),
						input( 'Label', 'label', false ),
						renderStringRepeater( 'Item', 'items', attrs, setAttributes )
					),
					el(
						PanelBody,
						{ title: __( 'Best fit', 'henrys-digital-canvas' ), initialOpen: false },
						input( 'Eyebrow', 'bestFitEyebrow', false ),
						input( 'Title', 'bestFitTitle', false ),
						renderStringRepeater( 'Focus area', 'focusAreas', attrs, setAttributes )
					),
					el( PanelBody, { title: __( 'Action links', 'henrys-digital-canvas' ), initialOpen: false }, renderActionLinksRepeater( attrs, setAttributes ) ),
					el( PanelBody, { title: __( 'Advanced', 'henrys-digital-canvas' ), initialOpen: false }, input( 'Resume endpoint (override)', 'resumeEndpoint', false ) )
				),
				el(
					'div',
					blockProps,
					el(
						Notice,
						{ status: 'info', isDismissible: false },
						__( 'Live: fetches resume snapshot via REST. Editor shows a placeholder summary.', 'henrys-digital-canvas' )
					),
					el( 'h2', { className: 'hdc-home-page__section-title' }, attrs.title || __( 'Resume Snapshot', 'henrys-digital-canvas' ) ),
					el( 'p', { className: 'hdc-home-page__editor-meta' }, __( 'Items: ', 'henrys-digital-canvas' ) + asArray( attrs.items ).join( ', ' ) )
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
