( function ( window, wp ) {
	'use strict';

	const config = window.hdcAiMediaModalData || {};

	if ( ! config.enabled || ! wp || ! wp.media || ! wp.media.view || ! wp.media.View ) {
		return;
	}

	const apiFetch = wp.apiFetch;
	const { __, sprintf } = wp.i18n;
	const { addQueryArgs } = wp.url;
	const TAB_ID = config.tabId || 'hdc-ai-generate';
	const FALLBACK_ERROR = __( 'Something went wrong while generating the image.', 'hdc-ai-media-modal' );

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

	function normalizeClassifaiResult( result ) {
		const generatedImage = Array.isArray( result ) ? result[ 0 ] : result;
		const base64Data = generatedImage?.url || generatedImage?.data || generatedImage?.b64_json || '';

		if ( ! base64Data ) {
			throw new Error( __( 'The ClassifAI image generation route returned an invalid response.', 'hdc-ai-media-modal' ) );
		}

		return {
			image: {
				data: base64Data,
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
		const abilities = window?.wp?.abilities ?? null;

		if ( typeof abilities?.executeAbility === 'function' ) {
			try {
				return await abilities.executeAbility( abilityName, input ?? null );
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
				input: input ?? null,
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

	async function maybeGenerateAltText( base64Image, prompt ) {
		if ( ! config.altTextEnabled ) {
			return prompt;
		}

		try {
			const result = await executeAbility( 'ai/alt-text-generation', {
				image_url: `data:image/png;base64,${ base64Image }`,
			} );

			if ( result && typeof result === 'object' && typeof result.alt_text === 'string' && result.alt_text ) {
				return result.alt_text;
			}
		} catch ( error ) {
			// Fall back to the prompt when alt text generation fails.
		}

		return prompt;
	}

	async function importGeneratedImage( generatedImage, prompt, onProgress ) {
		const imagePayload = generatedImage?.image;
		const isClassifaiImage = imagePayload?.provider_metadata?.id === 'classifai';

		if ( ! imagePayload || ! imagePayload.data ) {
			throw new Error( __( 'No generated image was returned.', 'hdc-ai-media-modal' ) );
		}

		const importInput = {
			data: imagePayload.data,
			mime_type: 'image/png',
			description: sprintf(
				/* translators: 1: Provider name, 2: Model name, 3: Date, 4: Prompt. */
				__( 'Generated by %1$s using %2$s on %3$s. Prompt: %4$s', 'hdc-ai-media-modal' ),
				imagePayload.provider_metadata?.name || __( 'AI provider', 'hdc-ai-media-modal' ),
				imagePayload.model_metadata?.name || __( 'AI model', 'hdc-ai-media-modal' ),
				new Date().toLocaleDateString(),
				prompt
			),
			meta: [
				{
					key: 'ai_generated',
					value: '1',
				},
			],
		};

		if ( ! isClassifaiImage ) {
			onProgress( __( 'Generating alt text…', 'hdc-ai-media-modal' ) );
			importInput.alt_text = await maybeGenerateAltText( imagePayload.data, prompt );
		} else {
			importInput.alt_text = prompt;
		}
		importInput.title = truncateTitle( importInput.alt_text || prompt || __( 'AI generated image', 'hdc-ai-media-modal' ) );

		onProgress( __( 'Saving to the Media Library…', 'hdc-ai-media-modal' ) );
		const imported = await executeAbility( 'ai/image-import', importInput );

		if ( ! imported || typeof imported !== 'object' || ! imported.image ) {
			throw new Error( __( 'The generated image could not be imported.', 'hdc-ai-media-modal' ) );
		}

		return imported.image;
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
			const previewSrc = this.state.generated?.image?.data
				? `data:image/png;base64,${ this.state.generated.image.data }`
				: '';

			this.$el.html(
				this.template( {
					prompt: this.state.prompt,
					isBusy: this.state.isBusy,
					statusMessage: this.state.statusMessage,
					errorMessage: this.state.errorMessage,
					previewSrc,
					hasGeneratedImage: !! previewSrc,
					importedId: this.state.imported?.id || 0,
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
			if ( ! this.state.imported?.id ) {
				return;
			}

			const attachment = wp.media.model.Attachment.get( this.state.imported.id );
			await attachment.fetch();

			const currentState = this.frame.state();
			const selection = currentState?.get ? currentState.get( 'selection' ) : null;

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
			if ( frame?.$el ) {
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

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', injectUploadButton );
	} else {
		injectUploadButton();
	}

	if ( config.isUploadScreen && document.body.classList.contains( 'upload-php' ) ) {
		const observer = new MutationObserver( injectUploadButton );
		observer.observe( document.body, {
			childList: true,
			subtree: true,
		} );
	}
} )( window, window.wp );
