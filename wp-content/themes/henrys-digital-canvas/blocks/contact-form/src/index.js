import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	Notice,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

registerBlockType( 'henrys-digital-canvas/contact-form', {
	edit: function Edit( { attributes, setAttributes } ) {
		const blockProps = useBlockProps( {
			className: 'hdc-contact-form-editor',
		} );

		return (
			<>
				<InspectorControls>
					<PanelBody
						title={ __(
							'Contact Form Settings',
							'henrys-digital-canvas'
						) }
						initialOpen={ true }
					>
						<TextControl
							label={ __( 'Heading', 'henrys-digital-canvas' ) }
							value={ attributes.heading }
							onChange={ ( heading ) =>
								setAttributes( { heading } )
							}
						/>
						<TextControl
							label={ __(
								'Description',
								'henrys-digital-canvas'
							) }
							value={ attributes.description }
							onChange={ ( description ) =>
								setAttributes( { description } )
							}
						/>
						<ToggleControl
							label={ __(
								'Show social links',
								'henrys-digital-canvas'
							) }
							checked={ !! attributes.showSocialLinks }
							onChange={ ( showSocialLinks ) =>
								setAttributes( { showSocialLinks } )
							}
						/>
						<TextControl
							label={ __(
								'Submit label',
								'henrys-digital-canvas'
							) }
							value={ attributes.submitLabel }
							onChange={ ( submitLabel ) =>
								setAttributes( { submitLabel } )
							}
						/>
						<TextControl
							label={ __(
								'Submitting label',
								'henrys-digital-canvas'
							) }
							value={ attributes.submittingLabel }
							onChange={ ( submittingLabel ) =>
								setAttributes( { submittingLabel } )
							}
						/>
					</PanelBody>
				</InspectorControls>
				<div { ...blockProps }>
					<Notice status="info" isDismissible={ false }>
						{ __(
							'Frontend posts form payloads to /api/contact and preserves client validation + submit states.',
							'henrys-digital-canvas'
						) }
					</Notice>
					<h3 className="hdc-contact-form-editor__title">
						{ attributes.heading ||
							__( 'Contact', 'henrys-digital-canvas' ) }
					</h3>
					<p className="hdc-contact-form-editor__description">
						{ attributes.description ||
							__(
								'Open to opportunities and consulting engagements.',
								'henrys-digital-canvas'
							) }
					</p>
				</div>
			</>
		);
	},
	save: () => null,
} );
