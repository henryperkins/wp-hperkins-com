( function ( window, wp ) {
	'use strict';

	const config = window.hdcAiMediaModalData || {};

	if ( ! config.enabled || ! wp || ! wp.media || ! wp.media.view || ! wp.media.View ) {
		return;
	}

	const apiFetch = wp.apiFetch;
	const { __, sprintf } = wp.i18n;
	const { addQueryArgs, cleanForSlug } = wp.url;
	const TAB_ID = config.tabId || 'hdc-ai-generate';
	const FALLBACK_ERROR = __( 'Something went wrong while generating the image.', 'hdc-ai-media-modal' );
	const DEFAULT_IMAGE_MIME_TYPE = 'image/png';
	const MIME_TYPE_TO_EXTENSION = {
		'image/gif': 'gif',
		'image/jpeg': 'jpg',
		'image/png': 'png',
		'image/webp': 'webp',
	};

	let fallbackWarned = false;
	let uploadFrame = null;

	function warnFallback() {
		if ( fallbackWarned ) {
			return;
		}

		fallbackWarned = true;
		window.console.info( config.fallbackWarning || '[HDC AI Media Modal] Falling back to REST.' );
	}

	function getErrorMessage( error, fallbackMessage = FALLBACK_ERROR ) {
		if ( error && typeof error === 'object' ) {
			if ( typeof error.message === 'string' && error.message ) {
				return error.message;
			}

			if ( error.data && typeof error.data.message === 'string' && error.data.message ) {
				return error.data.message;
			}
		}

		return fallbackMessage;
	}

	function getNestedValue( object, path, fallback = undefined ) {
		let current = object;

		for ( let index = 0; index < path.length; index++ ) {
			if ( null === current || undefined === current || typeof current !== 'object' ) {
				return fallback;
			}

			current = current[ path[ index ] ];
		}

		return undefined === current ? fallback : current;
	}

	function isAbilityNotFoundError( error ) {
		if ( ! error || typeof error !== 'object' ) {
			return false;
		}

		const code = typeof error.code === 'string' ? error.code : '';
		const message = typeof error.message === 'string' ? error.message : '';

		return 'ability_not_found' === code || message.includes( 'Ability not found' );
	}

	function hasGeneratedImagePayload( generated ) {
		return !! (
			generated &&
			typeof generated === 'object' &&
			generated.image &&
			typeof generated.image === 'object' &&
			typeof generated.image.data === 'string' &&
			generated.image.data
		);
	}

	function detectMimeTypeFromBase64( base64Data ) {
		try {
			const signature = window.atob( base64Data.slice( 0, 32 ) );
			const bytes = Array.from( signature, ( character ) => character.charCodeAt( 0 ) );

			if (
				bytes.length >= 8 &&
				bytes[ 0 ] === 0x89 &&
				bytes[ 1 ] === 0x50 &&
				bytes[ 2 ] === 0x4e &&
				bytes[ 3 ] === 0x47 &&
				bytes[ 4 ] === 0x0d &&
				bytes[ 5 ] === 0x0a &&
				bytes[ 6 ] === 0x1a &&
				bytes[ 7 ] === 0x0a
			) {
				return 'image/png';
			}

			if ( bytes.length >= 3 && bytes[ 0 ] === 0xff && bytes[ 1 ] === 0xd8 && bytes[ 2 ] === 0xff ) {
				return 'image/jpeg';
			}

			if (
				bytes.length >= 6 &&
				( signature.slice( 0, 6 ) === 'GIF87a' || signature.slice( 0, 6 ) === 'GIF89a' )
			) {
				return 'image/gif';
			}

			if ( bytes.length >= 12 && signature.slice( 0, 4 ) === 'RIFF' && signature.slice( 8, 12 ) === 'WEBP' ) {
				return 'image/webp';
			}
		} catch ( error ) {
			// Fall back to PNG when the payload signature cannot be inspected.
		}

		return DEFAULT_IMAGE_MIME_TYPE;
	}

	function getImageMimeType( imagePayload ) {
		const mimeType = getNestedValue( imagePayload, [ 'mime_type' ], '' );

		if ( typeof mimeType === 'string' && mimeType ) {
			return mimeType;
		}

		const imageData = getNestedValue( imagePayload, [ 'data' ], '' );

		if ( typeof imageData === 'string' && imageData ) {
			return detectMimeTypeFromBase64( imageData );
		}

		return DEFAULT_IMAGE_MIME_TYPE;
	}

	function buildDataUri( base64Data, mimeType ) {
		return `data:${ mimeType };base64,${ base64Data }`;
	}

	function getFileExtension( mimeType ) {
		return MIME_TYPE_TO_EXTENSION[ mimeType ] || 'png';
	}

	function createSafeFilename( prompt, mimeType, maxLength = 80 ) {
		let safeFileName = typeof cleanForSlug === 'function' ? cleanForSlug( prompt || '' ) : '';

		if ( ! safeFileName ) {
			safeFileName = 'ai-generated-image';
		}

		if ( safeFileName.length > maxLength ) {
			const truncated = safeFileName.substring( 0, maxLength );
			const lastDash = truncated.lastIndexOf( '-' );

			safeFileName = lastDash > maxLength * 0.5 ? truncated.substring( 0, lastDash ) : truncated;
		}

		return `${ safeFileName }.${ getFileExtension( mimeType ) }`;
	}

	function base64ToBlob( base64Data, mimeType ) {
		const byteCharacters = window.atob( base64Data );
		const byteArrays = [];

		for ( let offset = 0; offset < byteCharacters.length; offset += 512 ) {
			const slice = byteCharacters.slice( offset, offset + 512 );
			const byteNumbers = Array.from( slice, ( character ) => character.charCodeAt( 0 ) );

			byteArrays.push( new Uint8Array( byteNumbers ) );
		}

		return new window.Blob( byteArrays, { type: mimeType } );
	}

	function normalizeClassifaiResult( result ) {
		const generatedImage = Array.isArray( result ) ? result[ 0 ] : result;
		const base64Data =
			generatedImage && typeof generatedImage === 'object'
				? generatedImage.url || generatedImage.data || generatedImage.b64_json || ''
				: '';

		if ( ! base64Data ) {
			throw new Error( __( 'The ClassifAI image generation route returned an invalid response.', 'hdc-ai-media-modal' ) );
		}

		return {
			image: {
				data: base64Data,
				mime_type: detectMimeTypeFromBase64( base64Data ),
				provider_metadata: {
					id: 'classifai',
					name: 'ClassifAI',
				},
				model_metadata: {
					id: 'classifai-image-generation',
					name: 'ClassifAI image generation',
				},
			},
		};
	}

	async function generateImageViaClassifAI( prompt ) {
		const result = await apiFetch( {
			path: config.classifaiEndpoint || '/classifai/v1/generate-image',
			method: 'POST',
			data: {
				prompt,
				format: 'b64_json',
			},
		} );

		return normalizeClassifaiResult( result );
	}

	async function generateImage( prompt ) {
		const errors = [];

		if ( config.classifaiGenerationEnabled ) {
			try {
				return await generateImageViaClassifAI( prompt );
			} catch ( error ) {
				errors.push( error );
			}
		}

		if ( config.aiImageAbilityEnabled ) {
			try {
				const generated = await executeAbility( 'ai/image-generation', {
					prompt,
				} );

				if ( ! hasGeneratedImagePayload( generated ) ) {
					throw new Error( __( 'The image generation ability returned an invalid response.', 'hdc-ai-media-modal' ) );
				}

				return generated;
			} catch ( error ) {
				errors.push( error );
			}
		}

		throw errors[ errors.length - 1 ] || new Error( FALLBACK_ERROR );
	}

	async function executeAbility( abilityName, input = null, options = {} ) {
		const abilities = window && window.wp && window.wp.abilities ? window.wp.abilities : null;

		if ( abilities && typeof abilities.executeAbility === 'function' ) {
			try {
				return await abilities.executeAbility( abilityName, null == input ? null : input );
			} catch ( error ) {
				if ( ! isAbilityNotFoundError( error ) ) {
					throw error;
				}

				warnFallback();
			}
		} else {
			warnFallback();
		}

		const method = options.method || 'POST';

		if ( 'GET' === method || 'DELETE' === method ) {
			return apiFetch( {
				path: null === input
					? `/wp-abilities/v1/abilities/${ abilityName }/run`
					: addQueryArgs( `/wp-abilities/v1/abilities/${ abilityName }/run`, { input } ),
				method,
			} );
		}

		return apiFetch( {
			path: `/wp-abilities/v1/abilities/${ abilityName }/run`,
			method: 'POST',
			data: {
				input: null == input ? null : input,
			},
		} );
	}

	function truncateTitle( value, maxLength = 80 ) {
		if ( ! value || value.length <= maxLength ) {
			return value;
		}

		const truncated = value.substring( 0, maxLength );
		const lastSpace = truncated.lastIndexOf( ' ' );

		if ( lastSpace > maxLength * 0.5 ) {
			return truncated.substring( 0, lastSpace );
		}

		return truncated;
	}

	async function maybeGenerateAltText( base64Image, mimeType, prompt ) {
		if ( ! config.altTextEnabled ) {
			return prompt;
		}

		try {
			const result = await executeAbility( 'ai/alt-text-generation', {
				image_url: buildDataUri( base64Image, mimeType ),
			} );

			if ( result && typeof result === 'object' && typeof result.alt_text === 'string' && result.alt_text ) {
				return result.alt_text;
			}
		} catch ( error ) {
			// Fall back to the prompt when alt text generation fails.
		}

		return prompt;
	}

	function normalizeUploadedAttachment( attachment ) {
		const descriptionObject = getNestedValue( attachment, [ 'description' ], null );
		const titleObject = getNestedValue( attachment, [ 'title' ], null );
		const rawDescription = attachment && typeof attachment === 'object' ? attachment.description : undefined;
		const rawTitle = attachment && typeof attachment === 'object' ? attachment.title : undefined;
		const description =
			typeof rawDescription === 'string'
				? rawDescription
				: descriptionObject && typeof descriptionObject === 'object' && descriptionObject.raw
					? descriptionObject.raw
					: '';
		const title =
			typeof rawTitle === 'string'
				? rawTitle
				: titleObject && typeof titleObject === 'object' && titleObject.raw
					? titleObject.raw
					: '';

		return {
			...attachment,
			alt_text:
				attachment && typeof attachment === 'object'
					? attachment.alt_text || attachment.alt || ''
					: '',
			description,
			title,
		};
	}

	function uploadGeneratedImage( base64Data, prompt, additionalData ) {
		const uploadMedia =
			window && window.wp && window.wp.mediaUtils
				? window.wp.mediaUtils.uploadMedia
				: null;

		if ( typeof uploadMedia !== 'function' ) {
			throw new Error( __( 'The Media Library upload utilities are unavailable.', 'hdc-ai-media-modal' ) );
		}

		const mimeType = detectMimeTypeFromBase64( base64Data );
		const file = new window.File(
			[ base64ToBlob( base64Data, mimeType ) ],
			createSafeFilename( prompt, mimeType ),
			{ type: mimeType }
		);

		return new Promise( ( resolve, reject ) => {
			let settled = false;

			try {
				uploadMedia( {
					allowedTypes: [ 'image' ],
					filesList: [ file ],
					multiple: false,
					additionalData,
					onFileChange( files ) {
						if ( settled || ! Array.isArray( files ) || ! files.length ) {
							return;
						}

						const uploaded = files[ 0 ];

						if ( uploaded && uploaded.id ) {
							settled = true;
							resolve( normalizeUploadedAttachment( uploaded ) );
						}
					},
					onError( error ) {
						if ( settled ) {
							return;
						}

						settled = true;
						reject( error );
					},
				} );
			} catch ( error ) {
				if ( settled ) {
					return;
				}

				settled = true;
				reject( error );
			}
		} );
	}

	async function importGeneratedImage( generatedImage, prompt, onProgress ) {
		const imagePayload = generatedImage && generatedImage.image ? generatedImage.image : null;

		if ( ! imagePayload || ! imagePayload.data ) {
			throw new Error( __( 'No generated image was returned.', 'hdc-ai-media-modal' ) );
		}

		const mimeType = getImageMimeType( imagePayload );
		const importInput = {
			description: sprintf(
				/* translators: 1: Provider name, 2: Model name, 3: Date, 4: Prompt. */
				__( 'Generated by %1$s using %2$s on %3$s. Prompt: %4$s', 'hdc-ai-media-modal' ),
				getNestedValue( imagePayload, [ 'provider_metadata', 'name' ], '' ) || __( 'AI provider', 'hdc-ai-media-modal' ),
				getNestedValue( imagePayload, [ 'model_metadata', 'name' ], '' ) || __( 'AI model', 'hdc-ai-media-modal' ),
				new Date().toLocaleDateString(),
				prompt
			),
		};

		if ( config.aiImageAbilityEnabled ) {
			importInput.meta = {
				ai_generated: 1,
			};
		}

		if ( config.altTextEnabled ) {
			onProgress( __( 'Generating alt text…', 'hdc-ai-media-modal' ) );
			importInput.alt_text = await maybeGenerateAltText( imagePayload.data, mimeType, prompt );
		} else {
			importInput.alt_text = prompt;
		}
		importInput.title = truncateTitle( importInput.alt_text || prompt || __( 'AI generated image', 'hdc-ai-media-modal' ) );

		onProgress( __( 'Saving to the Media Library…', 'hdc-ai-media-modal' ) );

		const postSettings = wp && wp.media && wp.media.model && wp.media.model.settings
			? wp.media.model.settings
			: null;
		const postId =
			postSettings && postSettings.post && postSettings.post.id
				? postSettings.post.id
				: 0;

		return uploadGeneratedImage( imagePayload.data, prompt, {
			post: postId,
			title: importInput.title,
			alt_text: importInput.alt_text,
			description: importInput.description,
			meta: importInput.meta,
		} );
	}

	const GenerateImageView = wp.media.View.extend( {
		className: 'hdc-ai-media-modal__content',
		template: wp.template( 'hdc-ai-media-generate' ),
		events: {
			'input .hdc-ai-media-modal__prompt': 'handlePromptInput',
			'keydown .hdc-ai-media-modal__prompt': 'handlePromptKeydown',
			'click .hdc-ai-media-modal__generate': 'handleGenerate',
			'click .hdc-ai-media-modal__save': 'handleSave',
			'click .hdc-ai-media-modal__browse': 'handleBrowse',
			'click .hdc-ai-media-modal__regenerate': 'handleRegenerate',
			'click .hdc-ai-media-modal__reset': 'handleReset',
		},

		initialize( options ) {
			this.frame = options.frame;
			this.state = this.frame.hdcAiMediaState || {
				prompt: '',
				isBusy: false,
				statusMessage: '',
				errorMessage: '',
				generated: null,
				imported: null,
			};
			this.frame.hdcAiMediaState = this.state;
		},

		render() {
			const generatedImage = this.state.generated && this.state.generated.image
				? this.state.generated.image
				: null;
			const previewSrc = generatedImage && generatedImage.data
				? buildDataUri(
					generatedImage.data,
					getImageMimeType( generatedImage )
				)
				: '';

			this.$el.html(
				this.template( {
					prompt: this.state.prompt,
					isBusy: this.state.isBusy,
					statusMessage: this.state.statusMessage,
					errorMessage: this.state.errorMessage,
					previewSrc,
					hasGeneratedImage: !! previewSrc,
					importedId: this.state.imported && this.state.imported.id ? this.state.imported.id : 0,
				} )
			);

			return this;
		},

		handlePromptInput( event ) {
			this.state.prompt = event.target.value;
		},

		handlePromptKeydown( event ) {
			if ( event.key === 'Enter' && ( event.metaKey || event.ctrlKey ) ) {
				event.preventDefault();
				void this.handleGenerate();
			}
		},

		async handleGenerate() {
			const prompt = ( this.$( '.hdc-ai-media-modal__prompt' ).val() || '' ).trim();

			if ( ! prompt ) {
				this.state.errorMessage = __( 'Enter a prompt before generating an image.', 'hdc-ai-media-modal' );
				this.render();
				return;
			}

			this.state.prompt = prompt;
			this.state.isBusy = true;
			this.state.statusMessage = __( 'Generating image…', 'hdc-ai-media-modal' );
			this.state.errorMessage = '';
			this.state.generated = null;
			this.state.imported = null;
			this.render();

			try {
				const generated = await generateImage( prompt );
				this.state.generated = generated;
				this.state.statusMessage = '';
			} catch ( error ) {
				this.state.errorMessage = getErrorMessage( error );
				this.state.statusMessage = '';
			} finally {
				this.state.isBusy = false;
				this.render();
			}
		},

		async handleSave() {
			if ( ! this.state.generated ) {
				return;
			}

			this.state.isBusy = true;
			this.state.errorMessage = '';
			this.state.statusMessage = __( 'Preparing import…', 'hdc-ai-media-modal' );
			this.render();

			try {
				const imported = await importGeneratedImage(
					this.state.generated,
					this.state.prompt,
					( statusMessage ) => {
						this.state.statusMessage = statusMessage;
						this.render();
					}
				);

				this.state.imported = imported;
				this.state.statusMessage = '';
				await this.selectImportedAttachment();
			} catch ( error ) {
				this.state.errorMessage = getErrorMessage( error, __( 'The generated image could not be saved.', 'hdc-ai-media-modal' ) );
				this.state.statusMessage = '';
			} finally {
				this.state.isBusy = false;
				this.render();
			}
		},

		async handleBrowse() {
			if ( ! this.state.imported ) {
				return;
			}

			this.state.errorMessage = '';
			await this.selectImportedAttachment();
		},

		handleRegenerate() {
			void this.handleGenerate();
		},

		handleReset() {
			this.state.errorMessage = '';
			this.state.statusMessage = '';
			this.state.generated = null;
			this.state.imported = null;
			this.render();
		},

		async selectImportedAttachment() {
			if ( ! this.state.imported || ! this.state.imported.id ) {
				return;
			}

			const attachment = wp.media.model.Attachment.get( this.state.imported.id );
			await attachment.fetch();

			const currentState = this.frame.state();
			const selection = currentState && currentState.get ? currentState.get( 'selection' ) : null;

			if ( selection ) {
				selection.reset( [ attachment ] );
			}

			if ( this.frame.$el ) {
				const browseButton = this.frame.$el.find( '#menu-item-browse' );

				if ( browseButton.length ) {
					browseButton.trigger( 'click' );
				}
			}
		},
	} );

	function extendMediaFrame( BaseFrame ) {
		return BaseFrame.extend( {
			bindHandlers() {
				BaseFrame.prototype.bindHandlers.apply( this, arguments );
				this.on( `content:render:${ TAB_ID }`, this.renderGenerateTab, this );
			},

			browseRouter( routerView ) {
				BaseFrame.prototype.browseRouter.apply( this, arguments );

				routerView.set( {
					[ TAB_ID ]: {
						text: __( 'Generate Image', 'hdc-ai-media-modal' ),
						priority: 35,
					},
				} );
			},

			renderGenerateTab() {
				this.content.set(
					new GenerateImageView( {
						frame: this,
					} ).render()
				);
			},
		} );
	}

	function patchMediaFrames() {
		if ( window.hdcAiMediaModalPatched ) {
			return;
		}

		window.hdcAiMediaModalPatched = true;
		wp.media.view.MediaFrame.Select = extendMediaFrame( wp.media.view.MediaFrame.Select );
		wp.media.view.MediaFrame.Post = extendMediaFrame( wp.media.view.MediaFrame.Post );
	}

	function focusGenerateTab( frame ) {
		window.setTimeout( () => {
			if ( frame && frame.$el ) {
				const menuItem = frame.$el.find( `#menu-item-${ TAB_ID }` );

				if ( menuItem.length ) {
					menuItem.trigger( 'click' );
				}
			}
		}, 50 );
	}

	function openGenerateFrame() {
		if ( uploadFrame ) {
			uploadFrame.open();
			focusGenerateTab( uploadFrame );
			return;
		}

		uploadFrame = wp.media( {
			title: __( 'Generate Image', 'hdc-ai-media-modal' ),
			button: {
				text: __( 'Select image', 'hdc-ai-media-modal' ),
			},
			multiple: false,
			frame: 'select',
			library: {
				type: 'image',
			},
		} );

		uploadFrame.on( 'open', () => {
			focusGenerateTab( uploadFrame );
		} );

		uploadFrame.open();
	}

	function maybeAutoOpenGenerateFrame() {
		if ( ! config.autoOpen ) {
			return;
		}

		openGenerateFrame();

		if (
			window.history &&
			typeof window.history.replaceState === 'function' &&
			typeof config.uploadUrl === 'string' &&
			config.uploadUrl
		) {
			window.history.replaceState( {}, document.title, config.uploadUrl );
		}
	}

	function injectUploadButton() {
		if ( ! config.isUploadScreen || ! document.body.classList.contains( 'upload-php' ) ) {
			return;
		}

		const heading = document.querySelector( 'h1.wp-heading-inline' );

		if ( ! heading || ! heading.parentNode ) {
			return;
		}

		const existingLocalButton = document.querySelector( '.hdc-ai-media-modal__open-button' );
		const upstreamButton = document.querySelector( '.ai-generate-image-btn' );
		let button = existingLocalButton;

		if ( upstreamButton ) {
			if ( existingLocalButton ) {
				upstreamButton.remove();
				return;
			}

			const replacement = document.createElement( 'button' );
			replacement.type = 'button';
			replacement.className = 'page-title-action hdc-ai-media-modal__open-button';
			replacement.textContent = __( 'Generate Image', 'hdc-ai-media-modal' );
			replacement.addEventListener( 'click', openGenerateFrame );
			upstreamButton.replaceWith( replacement );
			button = replacement;
		}

		if ( button ) {
			return;
		}

		button = document.createElement( 'button' );
		button.type = 'button';
		button.className = 'page-title-action hdc-ai-media-modal__open-button';
		button.textContent = __( 'Generate Image', 'hdc-ai-media-modal' );
		button.addEventListener( 'click', openGenerateFrame );

		const pageActions = heading.parentNode.querySelectorAll( '.page-title-action' );
		const insertAfter = pageActions.length ? pageActions[ pageActions.length - 1 ] : heading;
		insertAfter.insertAdjacentElement( 'afterend', button );
	}

	patchMediaFrames();

	function bootstrapUploadScreen() {
		injectUploadButton();
		maybeAutoOpenGenerateFrame();
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', bootstrapUploadScreen );
	} else {
		bootstrapUploadScreen();
	}

	if ( config.isUploadScreen && document.body.classList.contains( 'upload-php' ) ) {
		const observer = new MutationObserver( injectUploadButton );
		observer.observe( document.body, {
			childList: true,
			subtree: true,
		} );
	}
} )( window, window.wp );
