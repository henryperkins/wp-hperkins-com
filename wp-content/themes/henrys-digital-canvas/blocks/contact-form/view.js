( function ( wp ) {
	if ( ! wp || ! wp.element ) {
		return;
	}

	const element = wp.element;
	const h = element.createElement;
	const useEffect = element.useEffect;
	const useRef = element.useRef;
	const useState = element.useState;
	const createRoot = element.createRoot;
	const legacyRender = element.render;
	const renderLucideIcon =
		window.hdcSharedUtils && typeof window.hdcSharedUtils.renderLucideIcon === 'function'
			? window.hdcSharedUtils.renderLucideIcon
			: function () {
				return null;
			};

	const FIELD_HINT_IDS = {
		name: {
			default: 'contact-name-hint',
			error: 'contact-name-error',
		},
		email: {
			default: 'contact-email-hint',
			error: 'contact-email-error',
		},
		message: {
			default: 'contact-message-hint',
			error: 'contact-message-error',
		},
	};
	const TURNSTILE_SCRIPT_ID = 'cloudflare-turnstile-script';
	const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
	const TURNSTILE_LABEL_ID = 'contact-verification-label';
	const TURNSTILE_HINT_ID = 'contact-verification-hint';
	const TURNSTILE_ERROR_ID = 'contact-verification-error';

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

	function ensureObject( value ) {
		return value && typeof value === 'object' ? value : {};
	}

	function parseConfig( section ) {
		let parsed = {};
		try {
			parsed = JSON.parse( section.getAttribute( 'data-config' ) || '{}' );
		} catch ( error ) {
			parsed = {};
		}

		const guidance = ensureObject( parsed.guidance );
		const form = ensureObject( parsed.form );
		const labels = ensureObject( form.labels );
		const placeholders = ensureObject( form.placeholders );
		const hints = ensureObject( form.hints );
		const turnstile = ensureObject( parsed.turnstile );

		return {
			pageTitle: ensureString( parsed.pageTitle, 'Contact — Henry Perkins' ),
			heading: ensureString( parsed.heading, 'Contact' ),
			description: ensureString( parsed.description, '' ),
			guidance: {
				eyebrow: ensureString( guidance.eyebrow, 'Start here' ),
				title: ensureString( guidance.title, 'What to send' ),
				description: ensureString( guidance.description, '' ),
				focusAreasHeading: ensureString( guidance.focusAreasHeading, 'Good fit' ),
				focusAreas: ensureArray( guidance.focusAreas )
					.map( function ( item ) {
						return ensureString( item, '' );
					} )
					.filter( Boolean ),
				briefingHeading: ensureString( guidance.briefingHeading, 'Helpful context' ),
				briefingItems: ensureArray( guidance.briefingItems )
					.map( function ( item ) {
						return ensureString( item, '' );
					} )
					.filter( Boolean ),
				timingNote: ensureString( guidance.timingNote, '' ),
			},
			form: {
				eyebrow: ensureString( form.eyebrow, 'Direct outreach' ),
				title: ensureString( form.title, 'Send a message' ),
				description: ensureString( form.description, '' ),
				labels: {
					company: ensureString( labels.company, 'Company' ),
					email: ensureString( labels.email, 'Email' ),
					message: ensureString( labels.message, 'Message' ),
					name: ensureString( labels.name, 'Name' ),
					verification: ensureString( labels.verification, 'Verification' ),
				},
				placeholders: {
					email: ensureString( placeholders.email, 'your@email.com' ),
					message: ensureString( placeholders.message, "What's on your mind?" ),
					name: ensureString( placeholders.name, 'Your name' ),
				},
				hints: {
					email: ensureString( hints.email, 'I reply to this address directly.' ),
					message: ensureString( hints.message, 'Include context, timeline, and goals if possible.' ),
					name: ensureString( hints.name, 'Use your full name for a faster follow-up.' ),
					verification: ensureString( hints.verification, 'Complete the verification check before sending.' ),
				},
				submitLabel: ensureString( parsed.submitLabel || form.submitLabel, 'Send Message' ),
				submittingLabel: ensureString( parsed.submittingLabel || form.submittingLabel, 'Sending…' ),
				successTitle: ensureString( form.successTitle, 'Message sent!' ),
				successMessage: ensureString( form.successMessage, "Thanks for reaching out. I'll get back to you soon." ),
			},
			showSocialLinks: parsed.showSocialLinks !== false,
			endpoint: ensureString( parsed.endpoint, '/api/contact' ),
			restEndpoint: ensureString( parsed.restEndpoint, '' ),
			socialLinks: ensureArray( parsed.socialLinks )
				.filter( function ( link ) {
					return link && typeof link === 'object';
				} )
				.map( function ( link ) {
					return {
						href: ensureString( link.href, '#' ),
						icon: ensureString( link.icon, '' ),
						label: ensureString( link.label, 'Link'),
					};
				} ),
			turnstile: {
				action: ensureString( turnstile.action, 'contact' ),
				siteKey: ensureString( turnstile.siteKey, '' ),
				label: ensureString( turnstile.label, 'Verification' ),
				hint: ensureString( turnstile.hint, 'Complete the verification check before sending.' ),
				requiredError: ensureString(
					turnstile.requiredError,
					'Please complete the verification check and try again.'
				),
				unavailableError: ensureString(
					turnstile.unavailableError,
					'Verification is unavailable right now. Please try again later.'
				),
			},
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

	function loadTurnstileScript() {
		if ( typeof window === 'undefined' ) {
			return Promise.resolve();
		}

		if ( window.turnstile ) {
			return Promise.resolve();
		}

		if ( window.__hdcTurnstileScriptPromise ) {
			return window.__hdcTurnstileScriptPromise;
		}

		window.__hdcTurnstileScriptPromise = new Promise( function ( resolve, reject ) {
			const existingScript = document.getElementById( TURNSTILE_SCRIPT_ID );
			if ( existingScript ) {
				existingScript.addEventListener( 'load', resolve, { once: true } );
				existingScript.addEventListener(
					'error',
					function () {
						reject( new Error( 'Failed to load Turnstile.' ) );
					},
					{ once: true }
				);
				return;
			}

			const script = document.createElement( 'script' );
			script.id = TURNSTILE_SCRIPT_ID;
			script.src = TURNSTILE_SCRIPT_SRC;
			script.async = true;
			script.defer = true;
			script.onload = resolve;
			script.onerror = function () {
				reject( new Error( 'Failed to load Turnstile.' ) );
			};
			document.head.appendChild( script );
		} );

		return window.__hdcTurnstileScriptPromise;
	}

	function TurnstileWidget( props ) {
		const groupRef = useRef( null );
		const containerRef = useRef( null );
		const widgetIdRef = useRef( null );

		useEffect(
			function () {
				props.controlRef.current = {
					focus: function () {
						if ( groupRef.current ) {
							groupRef.current.focus();
						}
					},
					reset: function () {
						if ( widgetIdRef.current && window.turnstile ) {
							window.turnstile.reset( widgetIdRef.current );
						}
						props.onTokenChange( '' );
					},
				};

				return function () {
					props.controlRef.current = {
						focus: function () {},
						reset: function () {},
					};
				};
			},
			[ props.controlRef, props.onTokenChange ]
		);

		useEffect(
			function () {
				let isCancelled = false;

				async function renderWidget() {
					try {
						await loadTurnstileScript();
						if ( isCancelled || ! containerRef.current || ! window.turnstile ) {
							return;
						}

						widgetIdRef.current = window.turnstile.render( containerRef.current, {
							sitekey: props.siteKey,
							theme: 'auto',
							size: 'flexible',
							action: props.action,
							callback: function ( token ) {
								props.onTokenChange( token );
							},
							'expired-callback': function () {
								props.onTokenChange( '' );
							},
							'error-callback': function () {
								props.onTokenChange( '' );
								props.onError();
							},
						} );
					} catch ( error ) {
						props.onTokenChange( '' );
						props.onError();
					}
				}

				renderWidget();

				return function () {
					isCancelled = true;
					if ( widgetIdRef.current && window.turnstile ) {
						window.turnstile.remove( widgetIdRef.current );
					}
					widgetIdRef.current = null;
				};
			},
			[ props.action, props.onError, props.onTokenChange, props.siteKey ]
		);

		return h(
			'div',
			{
				'aria-describedby': props.ariaDescribedBy,
				'aria-invalid': props.invalid ? 'true' : undefined,
				'aria-labelledby': props.ariaLabelledBy,
				'aria-required': 'true',
				className: 'hdc-contact-form__verification-shell',
				ref: groupRef,
				role: 'group',
				tabIndex: -1,
			},
			h( 'div', { className: 'hdc-contact-form__turnstile-widget', ref: containerRef } )
		);
	}

	function submitContact( endpoint, payload ) {
		if ( ! endpoint ) {
			const error = new Error( 'Contact endpoint is unavailable.' );
			error.status = 0;
			return Promise.reject( error );
		}

		return fetch( endpoint, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
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
		const turnstileControlRef = useRef( {
			focus: function () {},
			reset: function () {},
		} );
		const [ formData, setFormData ] = useState( {
			name: '',
			email: '',
			message: '',
			company: '',
		} );
		const [ fieldErrors, setFieldErrors ] = useState( {} );
		const [ touched, setTouched ] = useState( {
			name: false,
			email: false,
			message: false,
		} );
		const [ status, setStatus ] = useState( 'idle' );
		const [ errorMsg, setErrorMsg ] = useState( '' );
		const [ turnstileToken, setTurnstileToken ] = useState( '' );
		const [ turnstileError, setTurnstileError ] = useState( '' );
		const turnstileDescribedBy = turnstileError ? TURNSTILE_HINT_ID + ' ' + TURNSTILE_ERROR_ID : TURNSTILE_HINT_ID;

		useEffect(
			function () {
				document.title = config.pageTitle;
			},
			[ config.pageTitle ]
		);

		function getFieldDescribedBy( fieldName ) {
			return fieldErrors[ fieldName ] ? FIELD_HINT_IDS[ fieldName ].error : FIELD_HINT_IDS[ fieldName ].default;
		}

		function onChange( event ) {
			const fieldName = event.target.name;
			const nextValue = event.target.value;

			setFormData( function ( prev ) {
				return Object.assign( {}, prev, {
					[ fieldName ]: nextValue,
				} );
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
				return Object.assign( {}, prev, {
					[ fieldName ]: true,
				} );
			} );
			setFieldErrors( function ( prev ) {
				return Object.assign( {}, prev, {
					[ fieldName ]: validateField( fieldName, formData[ fieldName ] ),
				} );
			} );
		}

		function onHoneypotChange( event ) {
			const nextValue = event.target.value;
			setFormData( function ( prev ) {
				return Object.assign( {}, prev, {
					company: nextValue,
				} );
			} );
		}

		async function onSubmit( event ) {
			event.preventDefault();

			const nextErrors = validateForm( formData );
			setFieldErrors( nextErrors );
			setTouched( {
				name: true,
				email: true,
				message: true,
			} );

			if ( Object.keys( nextErrors ).length > 0 ) {
				setStatus( 'idle' );
				return;
			}

			if ( ! config.turnstile.siteKey ) {
				setTurnstileError( config.turnstile.unavailableError );
				setStatus( 'idle' );
				return;
			}

			if ( ! turnstileToken ) {
				setTurnstileError( config.turnstile.requiredError );
				setStatus( 'idle' );
				turnstileControlRef.current.focus();
				return;
			}

			setStatus( 'submitting' );
			setErrorMsg( '' );
			setTurnstileError( '' );

			const payload = {
				name: String( formData.name || '' ),
				email: String( formData.email || '' ),
				message: String( formData.message || '' ),
				company: String( formData.company || '' ),
				turnstileToken: turnstileToken,
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
							setStatus( 'idle' );
							return;
						}

						if ( fallbackError && fallbackError.message === config.turnstile.requiredError ) {
							setTurnstileError( fallbackError.message );
							setStatus( 'idle' );
							return;
						}

						setErrorMsg(
							fallbackError instanceof Error
								? fallbackError.message
								: 'Something went wrong. Please try again.'
						);
						setStatus( 'error' );
						return;
					}
				}

				if ( primaryError && primaryError.fieldErrors ) {
					setFieldErrors( function ( prev ) {
						return Object.assign( {}, prev, primaryError.fieldErrors );
					} );
					setStatus( 'idle' );
					return;
				}

				if ( primaryError instanceof Error && primaryError.message === config.turnstile.requiredError ) {
					setTurnstileError( primaryError.message );
					setStatus( 'idle' );
					return;
				}

				setErrorMsg(
					primaryError instanceof Error
						? primaryError.message
						: 'Something went wrong. Please try again.'
				);
				setStatus( 'error' );
			} finally {
				turnstileControlRef.current.reset();
				setTurnstileToken( '' );
			}
		}

		function renderFieldHint( fieldName ) {
			const fieldError = fieldErrors[ fieldName ];
			const hintId = fieldError ? FIELD_HINT_IDS[ fieldName ].error : FIELD_HINT_IDS[ fieldName ].default;
			const hintClassName = fieldError
				? 'hdc-contact-form__hint hdc-contact-form__hint--error'
				: 'hdc-contact-form__hint';
			const hintText = fieldError || config.form.hints[ fieldName ];

			return h(
				'p',
				{
					className: hintClassName,
					id: hintId,
					role: fieldError ? 'alert' : undefined,
				},
				hintText
			);
		}

		return h(
			'div',
			{ className: 'hdc-contact-form__layout' },
			h(
				'div',
				{ className: 'hdc-contact-form__lead' },
				h(
					'header',
					{ className: 'hdc-contact-form__header' },
					h( 'h1', { className: 'hdc-contact-form__title' }, config.heading ),
					h( 'p', { className: 'hdc-contact-form__description' }, config.description )
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
									key: link.href,
									rel: 'noreferrer',
									target: '_blank',
								},
								h(
									'span',
									{
										'aria-hidden': 'true',
										className: 'hdc-contact-form__social-icon',
									},
									renderLucideIcon( h, link.icon, {
										className: 'hdc-contact-form__social-icon-svg',
										size: 16,
									} ) || link.label.charAt( 0 )
								),
								h( 'span', {}, link.label )
							);
						} )
					)
					: null,
				h(
					'section',
					{ className: 'hdc-contact-form__guidance-card' },
					h( 'p', { className: 'hdc-contact-form__eyebrow' }, config.guidance.eyebrow ),
					h( 'h2', { className: 'hdc-contact-form__section-title' }, config.guidance.title ),
					h( 'p', { className: 'hdc-contact-form__copy' }, config.guidance.description ),
					h(
						'div',
						{ className: 'hdc-contact-form__guidance-block' },
						h( 'h3', { className: 'hdc-contact-form__guidance-title' }, config.guidance.focusAreasHeading ),
						h(
							'ul',
							{ className: 'hdc-contact-form__list' },
							config.guidance.focusAreas.map( function ( item, index ) {
								return h( 'li', { key: 'focus-' + String( index ) }, item );
							} )
						)
					),
					h(
						'div',
						{ className: 'hdc-contact-form__guidance-block' },
						h( 'h3', { className: 'hdc-contact-form__guidance-title' }, config.guidance.briefingHeading ),
						h(
							'ul',
							{ className: 'hdc-contact-form__list' },
							config.guidance.briefingItems.map( function ( item, index ) {
								return h( 'li', { key: 'briefing-' + String( index ) }, item );
							} )
						)
					),
					config.guidance.timingNote
						? h( 'p', { className: 'hdc-contact-form__copy hdc-contact-form__copy--compact' }, config.guidance.timingNote )
						: null
				)
			),
			h(
				'section',
				{ className: 'hdc-contact-form__form-card' },
				h(
					'div',
					{ className: 'hdc-contact-form__form-intro' },
					h( 'p', { className: 'hdc-contact-form__eyebrow' }, config.form.eyebrow ),
					h( 'h2', { className: 'hdc-contact-form__section-title' }, config.form.title ),
					h( 'p', { className: 'hdc-contact-form__copy' }, config.form.description )
				),
				status === 'success'
					? h(
						'div',
						{
							className: 'hdc-contact-form__success-wrap',
							role: 'status',
						},
						h( 'h3', { className: 'hdc-contact-form__success-title' }, config.form.successTitle ),
						h( 'p', { className: 'hdc-contact-form__success-message' }, config.form.successMessage )
					)
					: h(
						'form',
						{
							className: 'hdc-contact-form__form',
							noValidate: true,
							onSubmit: onSubmit,
						},
						h(
							'div',
							{
								'aria-hidden': 'true',
								className: 'hdc-contact-form__honeypot',
							},
							h( 'label', { className: 'hdc-contact-form__label', htmlFor: 'company' }, config.form.labels.company ),
							h( 'input', {
								autoComplete: 'off',
								className: 'hdc-contact-form__input',
								id: 'company',
								name: 'company',
								onChange: onHoneypotChange,
								tabIndex: -1,
								type: 'text',
								value: formData.company,
							} )
						),
						h(
							'div',
							{ className: 'hdc-contact-form__field' },
							h( 'label', { className: 'hdc-contact-form__label', htmlFor: 'name' }, config.form.labels.name ),
							h( 'input', {
								'aria-describedby': getFieldDescribedBy( 'name' ),
								'aria-invalid': fieldErrors.name ? 'true' : undefined,
								className: 'hdc-contact-form__input',
								disabled: status === 'submitting',
								id: 'name',
								name: 'name',
								onBlur: onBlur,
								onChange: onChange,
								placeholder: config.form.placeholders.name,
								required: true,
								type: 'text',
								value: formData.name,
							} ),
							renderFieldHint( 'name' )
						),
						h(
							'div',
							{ className: 'hdc-contact-form__field' },
							h( 'label', { className: 'hdc-contact-form__label', htmlFor: 'email' }, config.form.labels.email ),
							h( 'input', {
								'aria-describedby': getFieldDescribedBy( 'email' ),
								'aria-invalid': fieldErrors.email ? 'true' : undefined,
								className: 'hdc-contact-form__input',
								disabled: status === 'submitting',
								id: 'email',
								name: 'email',
								onBlur: onBlur,
								onChange: onChange,
								placeholder: config.form.placeholders.email,
								required: true,
								type: 'email',
								value: formData.email,
							} ),
							renderFieldHint( 'email' )
						),
						h(
							'div',
							{ className: 'hdc-contact-form__field' },
							h( 'label', { className: 'hdc-contact-form__label', htmlFor: 'message' }, config.form.labels.message ),
							h( 'textarea', {
								'aria-describedby': getFieldDescribedBy( 'message' ),
								'aria-invalid': fieldErrors.message ? 'true' : undefined,
								className: 'hdc-contact-form__input hdc-contact-form__textarea',
								disabled: status === 'submitting',
								id: 'message',
								name: 'message',
								onBlur: onBlur,
								onChange: onChange,
								placeholder: config.form.placeholders.message,
								required: true,
								rows: 5,
								value: formData.message,
							} ),
							renderFieldHint( 'message' )
						),
						h(
							'div',
							{ className: 'hdc-contact-form__verification' },
							h(
								'p',
								{
									className: 'hdc-contact-form__label hdc-contact-form__label--plain',
									id: TURNSTILE_LABEL_ID,
								},
								config.turnstile.label
							),
							config.turnstile.siteKey
								? h( TurnstileWidget, {
									action: config.turnstile.action,
									ariaDescribedBy: turnstileDescribedBy,
									ariaLabelledBy: TURNSTILE_LABEL_ID,
									controlRef: turnstileControlRef,
									invalid: !! turnstileError,
									onError: function () {
										setTurnstileToken( '' );
										setTurnstileError( config.turnstile.unavailableError );
										turnstileControlRef.current.focus();
									},
									onTokenChange: function ( token ) {
										setTurnstileToken( token );
										if ( token ) {
											setTurnstileError( '' );
										}
									},
									siteKey: config.turnstile.siteKey,
								} )
								: h(
									'div',
									{
										'aria-describedby': TURNSTILE_ERROR_ID,
										'aria-invalid': 'true',
										'aria-labelledby': TURNSTILE_LABEL_ID,
										'aria-required': 'true',
										className: 'hdc-contact-form__verification-shell',
										role: 'group',
										tabIndex: -1,
									},
									h(
										'p',
										{
											className: 'hdc-contact-form__hint hdc-contact-form__hint--error',
											id: TURNSTILE_ERROR_ID,
											role: 'alert',
										},
										config.turnstile.unavailableError
									)
								),
							config.turnstile.siteKey
								? h(
									'p',
									{
										className: turnstileError
											? 'hdc-contact-form__hint hdc-contact-form__hint--error'
											: 'hdc-contact-form__hint',
										id: turnstileError ? TURNSTILE_ERROR_ID : TURNSTILE_HINT_ID,
										role: turnstileError ? 'alert' : undefined,
									},
									turnstileError || config.turnstile.hint
								)
								: null
						),
						status === 'error' && errorMsg
							? h(
								'p',
								{
									className: 'hdc-contact-form__error',
									role: 'alert',
								},
								errorMsg
							)
							: null,
						h(
							'button',
							{
								className: 'hdc-contact-form__submit',
								disabled: status === 'submitting' || ! config.turnstile.siteKey,
								type: 'submit',
							},
							h(
								'span',
								{
									'aria-hidden': 'true',
									className: 'hdc-contact-form__submit-icon',
								},
								renderLucideIcon( h, 'send', {
									className: 'hdc-contact-form__submit-icon-svg',
									size: 16,
								} )
							),
							status === 'submitting' ? config.form.submittingLabel : config.form.submitLabel
						)
					)
			)
		);
	}

	function mountContactForm( section ) {
		const rootNode = section.querySelector( '[data-hdc-contact-form-root]' );
		if ( ! rootNode ) {
			return;
		}

		const app = h( ContactFormApp, {
			config: parseConfig( section ),
		} );
		if ( typeof createRoot === 'function' ) {
			createRoot( rootNode ).render( app );
			return;
		}

		legacyRender( app, rootNode );
	}

	document.querySelectorAll( '.hdc-contact-form' ).forEach( mountContactForm );
} )( window.wp );
