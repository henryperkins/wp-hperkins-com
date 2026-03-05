( function ( blocks, blockEditor, components, element, i18n ) {
	const el = element.createElement;
	const __ = i18n.__;
	const useBlockProps = blockEditor.useBlockProps;
	const InspectorControls = blockEditor.InspectorControls;
	const PanelBody = components.PanelBody;
	const TextControl = components.TextControl;
	const ToggleControl = components.ToggleControl;
	const RangeControl = components.RangeControl;
	const Notice = components.Notice;
	const Fragment = element.Fragment;

	blocks.registerBlockType( 'henrys-digital-canvas/digital-canvas-feed', {
		edit: function Edit( props ) {
			const attrs = props.attributes;
			const setAttributes = props.setAttributes;
			const blockProps = useBlockProps( {
				className: 'hdc-digital-canvas-feed-editor',
			} );

			return el(
				Fragment,
				{},
				el(
					InspectorControls,
					{},
					el(
						PanelBody,
						{
							title: __( 'Feed Settings', 'henrys-digital-canvas' ),
							initialOpen: true,
						},
						el( TextControl, {
							label: __( 'Heading', 'henrys-digital-canvas' ),
							value: attrs.heading,
							onChange: function ( heading ) {
								setAttributes( { heading: heading } );
							},
						} ),
						el( ToggleControl, {
							label: __( 'Show blog posts', 'henrys-digital-canvas' ),
							checked: !! attrs.showBlog,
							onChange: function ( value ) {
								setAttributes( { showBlog: value } );
							},
						} ),
						el( RangeControl, {
							label: __( 'Blog post count', 'henrys-digital-canvas' ),
							value: attrs.blogCount,
							onChange: function ( value ) {
								setAttributes( { blogCount: value || 3 } );
							},
							min: 1,
							max: 10,
						} ),
						el( ToggleControl, {
							label: __( 'Show featured projects', 'henrys-digital-canvas' ),
							checked: !! attrs.showRepos,
							onChange: function ( value ) {
								setAttributes( { showRepos: value } );
							},
						} ),
						el( RangeControl, {
							label: __( 'Repository count', 'henrys-digital-canvas' ),
							value: attrs.repoCount,
							onChange: function ( value ) {
								setAttributes( { repoCount: value || 4 } );
							},
							min: 1,
							max: 10,
						} ),
						el( TextControl, {
							label: __( 'Custom posts endpoint (optional)', 'henrys-digital-canvas' ),
							help: __(
								'Defaults to /wp-json/henrys-digital-canvas/v1/blog when empty.',
								'henrys-digital-canvas'
							),
							value: attrs.postsEndpoint,
							onChange: function ( postsEndpoint ) {
								setAttributes( { postsEndpoint: postsEndpoint } );
							},
						} ),
						el( ToggleControl, {
							label: __( 'Open external links in new tab', 'henrys-digital-canvas' ),
							checked: !! attrs.openInNewTab,
							onChange: function ( value ) {
								setAttributes( { openInNewTab: value } );
							},
						} )
					)
				),
				el(
					'div',
					blockProps,
					el(
						Notice,
						{
							status: 'info',
							isDismissible: false,
						},
						__(
							'This block mounts a React view on the frontend and reads the theme blog/work contracts.',
							'henrys-digital-canvas'
						)
					),
					el( 'h3', { className: 'hdc-feed-heading' }, attrs.heading || __( 'Featured Work and Recent Writing', 'henrys-digital-canvas' ) ),
					el(
						'p',
						{ className: 'hdc-feed-editor-summary' },
						__(
							'Frontend preview updates after saving. Use block settings to configure the feed.',
							'henrys-digital-canvas'
						)
					),
					( ! attrs.showBlog && ! attrs.showRepos ) &&
						el(
							'p',
							{ className: 'hdc-feed-editor-warning' },
							__(
								'Enable at least one source (blog posts or repositories).',
								'henrys-digital-canvas'
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
