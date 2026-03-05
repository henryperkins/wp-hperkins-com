( function ( wp ) {
	if ( ! wp || ! wp.element ) {
		return;
	}

	const element = wp.element;
	const h = element.createElement;
	const useEffect = element.useEffect;
	const useMemo = element.useMemo;
	const useState = element.useState;
	const createRoot = element.createRoot;
	const legacyRender = element.render;
	const renderLucideIcon =
		window.hdcSharedUtils && typeof window.hdcSharedUtils.renderLucideIcon === 'function'
			? window.hdcSharedUtils.renderLucideIcon
			: function () {
				return null;
			};

	function ensureString( value, fallback ) {
		if ( typeof value !== 'string' ) {
			return fallback;
		}

		const trimmed = value.trim();
		return trimmed || fallback;
	}

	function ensureArray( value ) {
		return Array.isArray( value ) ? value : [];
	}

	function getSocialIconName( label, href ) {
		const token = String( label || href || '' ).toLowerCase();
		if ( token.indexOf( 'linkedin' ) !== -1 ) {
			return 'linkedin';
		}
		if ( token.indexOf( 'github' ) !== -1 ) {
			return 'github';
		}
		if ( token.indexOf( 'mail' ) !== -1 || token.indexOf( '@' ) !== -1 ) {
			return 'mail';
		}
		return '';
	}

	function parseConfig( section ) {
		let parsed = {};
		try {
			parsed = JSON.parse( section.getAttribute( 'data-config' ) || '{}' );
		} catch ( error ) {
			parsed = {};
		}

		return {
			heading: ensureString( parsed.heading, 'Contact' ),
			description: ensureString( parsed.description, '' ),
			showSocialLinks: !! parsed.showSocialLinks,
			submitLabel: ensureString( parsed.submitLabel, 'Send Message' ),
			submittingLabel: ensureString( parsed.submittingLabel, 'Sending…' ),
			endpoint: ensureString( parsed.endpoint, '/api/contact' ),
			restEndpoint: ensureString( parsed.restEndpoint, '' ),
			successTitle: ensureString( parsed.successTitle, 'Message sent!' ),
			successMessage: ensureString( parsed.successMessage, 'Thanks for reaching out. I\'ll get back to you soon.' ),
			socialLinks: ensureArray( parsed.socialLinks )
				.filter( function ( item ) {
					return item && typeof item === 'object';
				} )
				.map( function ( item ) {
					return {
						label: ensureString( item.label, 'Link' ),
						href: ensureString( item.href, '#' ),
					};
				} ),
		};
	}

	function validateField( fieldName, value ) {
		const trimmed = String( value || '' ).trim();

		if ( fieldName === 'name' ) {
			if ( ! trimmed ) {
				return 'Please enter your name.';
			}
			if ( trimmed.length < 2 ) {
				return 'Name should be at least 2 characters.';
			}
			return undefined;
		}

		if ( fieldName === 'email' ) {
			if ( ! trimmed ) {
				return 'Please enter your email address.';
			}
			if ( ! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( trimmed ) ) {
				return 'Enter a valid email address.';
			}
			return undefined;
		}

		if ( ! trimmed ) {
			return 'Please add a message.';
		}
		if ( trimmed.length < 20 ) {
			return 'Message should be at least 20 characters.';
		}

		return undefined;
	}

	function validateForm( data ) {
		const errors = {};
		[ 'name', 'email', 'message' ].forEach( function ( fieldName ) {
			const error = validateField( fieldName, data[ fieldName ] );
			if ( error ) {
				errors[ fieldName ] = error;
			}
		} );
		return errors;
	}

	function submitContact( endpoint, payload ) {
		if ( ! endpoint ) {
			const missingEndpointError = new Error( 'Contact endpoint is unavailable.' );
			missingEndpointError.status = 0;
			throw missingEndpointError;
		}

		return fetch( endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify( payload ),
		} ).then( async function ( response ) {
			let body = null;
			try {
				body = await response.json();
			} catch ( parseError ) {
				body = null;
			}

			if ( ! response.ok ) {
				const error = new Error( body && body.error ? body.error : 'Failed to send message.' );
				error.status = response.status;
				error.fieldErrors = body && body.errors && typeof body.errors === 'object' ? body.errors : null;
				throw error;
			}

			return body || {};
		} );
	}

	function ContactFormApp( props ) {
		const config = props.config;
		const [ formData, setFormData ] = useState( {
			name: '',
			email: '',
			message: '',
		} );
		const [ fieldErrors, setFieldErrors ] = useState( {} );
		const [ touched, setTouched ] = useState( {
			name: false,
			email: false,
			message: false,
		} );
		const [ status, setStatus ] = useState( 'idle' );
		const [ errorMsg, setErrorMsg ] = useState( '' );

		const signature = useMemo( function () {
			return JSON.stringify( config );
		}, [ config ] );

		useEffect( function () {
			document.title = 'Contact — Henry Perkins';
		}, [] );

		useEffect(
			function () {
				setFormData( { name: '', email: '', message: '' } );
				setFieldErrors( {} );
				setTouched( { name: false, email: false, message: false } );
				setStatus( 'idle' );
				setErrorMsg( '' );
			},
			[ signature ]
		);

		function onChange( event ) {
			const fieldName = event.target.name;
			const nextValue = event.target.value;

			setFormData( function ( prev ) {
				return Object.assign( {}, prev, { [ fieldName ]: nextValue } );
			} );

			if ( touched[ fieldName ] ) {
				setFieldErrors( function ( prev ) {
					return Object.assign( {}, prev, {
						[ fieldName ]: validateField( fieldName, nextValue ),
					} );
				} );
			}
		}

		function onBlur( event ) {
			const fieldName = event.target.name;
			setTouched( function ( prev ) {
				return Object.assign( {}, prev, { [ fieldName ]: true } );
			} );
			setFieldErrors( function ( prev ) {
				return Object.assign( {}, prev, {
					[ fieldName ]: validateField( fieldName, formData[ fieldName ] ),
				} );
			} );
		}

		async function onSubmit( event ) {
			event.preventDefault();

			const nextErrors = validateForm( formData );
			setFieldErrors( nextErrors );
			setTouched( { name: true, email: true, message: true } );

			if ( Object.keys( nextErrors ).length > 0 ) {
				setStatus( 'idle' );
				return;
			}

			setStatus( 'submitting' );
			setErrorMsg( '' );

			const payload = {
				name: String( formData.name || '' ),
				email: String( formData.email || '' ),
				message: String( formData.message || '' ),
			};

			try {
				await submitContact( config.endpoint, payload );
				setStatus( 'success' );
				return;
			} catch ( primaryError ) {
				const shouldTryRest =
					primaryError &&
					typeof primaryError === 'object' &&
					( Number( primaryError.status || 0 ) === 404 || Number( primaryError.status || 0 ) === 0 );

				if ( shouldTryRest && config.restEndpoint ) {
					try {
						await submitContact( config.restEndpoint, payload );
						setStatus( 'success' );
						return;
					} catch ( fallbackError ) {
						if ( fallbackError && fallbackError.fieldErrors ) {
							setFieldErrors( function ( prev ) {
								return Object.assign( {}, prev, fallbackError.fieldErrors );
							} );
						}
						setErrorMsg( fallbackError instanceof Error ? fallbackError.message : 'Something went wrong. Please try again.' );
						setStatus( 'error' );
						return;
					}
				}

				if ( primaryError && primaryError.fieldErrors ) {
					setFieldErrors( function ( prev ) {
						return Object.assign( {}, prev, primaryError.fieldErrors );
					} );
				}

				setErrorMsg( primaryError instanceof Error ? primaryError.message : 'Something went wrong. Please try again.' );
				setStatus( 'error' );
			}
		}

		return h(
			'div',
			{},
			h(
				'header',
				{ className: 'hdc-contact-form__header' },
				h( 'h2', { className: 'hdc-contact-form__title' }, config.heading || 'Contact' ),
				config.description ? h( 'p', { className: 'hdc-contact-form__description' }, config.description ) : null
			),
			config.showSocialLinks && config.socialLinks.length
				? h(
					'div',
					{ className: 'hdc-contact-form__social' },
					config.socialLinks.map( function ( link ) {
						return h(
							'a',
							{
								className: 'hdc-contact-form__social-link',
								href: link.href,
								target: link.href.indexOf( 'mailto:' ) === 0 ? undefined : '_blank',
								rel: link.href.indexOf( 'mailto:' ) === 0 ? undefined : 'noopener noreferrer',
							key: link.label + '-' + link.href,
							},
								h(
									'span',
									{ className: 'hdc-contact-form__social-icon', 'aria-hidden': 'true' },
									renderLucideIcon( h, getSocialIconName( link.label, link.href ), { className: 'hdc-contact-form__social-icon-svg', size: 14 } ) || '•'
								),
							h( 'span', { className: 'hdc-contact-form__social-label' }, link.label )
						);
					} )
				)
				: null,
			status === 'success'
				? h(
					'div',
					{ className: 'hdc-contact-form__success-wrap', role: 'status', 'aria-live': 'polite' },
					h( 'h3', { className: 'hdc-contact-form__success-title' }, config.successTitle ),
					h( 'p', { className: 'hdc-contact-form__success-message' }, config.successMessage )
				)
				: h(
					'form',
					{
						className: 'hdc-contact-form__form',
						onSubmit: onSubmit,
						noValidate: true,
					},
					h(
						'label',
						{ className: 'hdc-contact-form__field', htmlFor: 'hdc-contact-name' },
						h( 'span', { className: 'hdc-contact-form__label' }, 'Name' ),
						h( 'input', {
							id: 'hdc-contact-name',
							name: 'name',
							type: 'text',
							required: true,
							value: formData.name,
							onChange: onChange,
							onBlur: onBlur,
							placeholder: 'Your name',
							disabled: status === 'submitting',
							'aria-invalid': fieldErrors.name ? 'true' : 'false',
							className: 'hdc-contact-form__input',
						} ),
						fieldErrors.name
							? h( 'span', { className: 'hdc-contact-form__hint hdc-contact-form__hint--error' }, fieldErrors.name )
							: h( 'span', { className: 'hdc-contact-form__hint' }, 'Use your full name for a faster follow-up.' )
					),
					h(
						'label',
						{ className: 'hdc-contact-form__field', htmlFor: 'hdc-contact-email' },
						h( 'span', { className: 'hdc-contact-form__label' }, 'Email' ),
						h( 'input', {
							id: 'hdc-contact-email',
							name: 'email',
							type: 'email',
							required: true,
							value: formData.email,
							onChange: onChange,
							onBlur: onBlur,
							placeholder: 'your@email.com',
							disabled: status === 'submitting',
							'aria-invalid': fieldErrors.email ? 'true' : 'false',
							className: 'hdc-contact-form__input',
						} ),
						fieldErrors.email
							? h( 'span', { className: 'hdc-contact-form__hint hdc-contact-form__hint--error' }, fieldErrors.email )
							: h( 'span', { className: 'hdc-contact-form__hint' }, 'I reply to this address directly.' )
					),
					h(
						'label',
						{ className: 'hdc-contact-form__field', htmlFor: 'hdc-contact-message' },
						h( 'span', { className: 'hdc-contact-form__label' }, 'Message' ),
						h( 'textarea', {
							id: 'hdc-contact-message',
							name: 'message',
							required: true,
							rows: 6,
							value: formData.message,
							onChange: onChange,
							onBlur: onBlur,
							placeholder: 'What\'s on your mind?',
							disabled: status === 'submitting',
							'aria-invalid': fieldErrors.message ? 'true' : 'false',
							className: 'hdc-contact-form__input hdc-contact-form__textarea',
						} ),
						fieldErrors.message
							? h( 'span', { className: 'hdc-contact-form__hint hdc-contact-form__hint--error' }, fieldErrors.message )
							: h( 'span', { className: 'hdc-contact-form__hint' }, 'Include context, timeline, and goals if possible.' )
					),
					status === 'error' && errorMsg
						? h( 'p', { className: 'hdc-contact-form__error', role: 'alert' }, errorMsg )
						: null,
					h(
						'button',
						{
							type: 'submit',
							className: 'hdc-contact-form__submit',
							disabled: status === 'submitting',
						},
							h(
								'span',
								{ className: 'hdc-contact-form__submit-icon', 'aria-hidden': 'true' },
								renderLucideIcon( h, 'send', { className: 'hdc-contact-form__submit-icon-svg', size: 16 } ) || '•'
							),
						h( 'span', {}, status === 'submitting' ? config.submittingLabel : config.submitLabel )
					)
				)
		);
	}

	function mountContactForm( section ) {
		const rootNode = section.querySelector( '[data-hdc-contact-form-root]' );
		if ( ! rootNode ) {
			return;
		}

		const app = h( ContactFormApp, { config: parseConfig( section ) } );
		if ( typeof createRoot === 'function' ) {
			createRoot( rootNode ).render( app );
		} else {
			legacyRender( app, rootNode );
		}
	}

	document.querySelectorAll( '.hdc-contact-form' ).forEach( mountContactForm );
} )( window.wp );
