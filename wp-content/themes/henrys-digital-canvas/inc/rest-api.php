<?php
/**
 * Theme REST API routes for data contracts.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Resolve the best-available client IP for contact verification and rate limiting.
 *
 * Prefers trusted proxy headers (CF-Connecting-IP for Cloudflare) over the
 * spoofable X-Forwarded-For, and always falls back to REMOTE_ADDR.
 *
 * @return string
 */
function hdc_get_contact_client_ip() {
	// Cloudflare sets this to the true client IP; it cannot be spoofed through CF.
	if ( ! empty( $_SERVER['HTTP_CF_CONNECTING_IP'] ) ) {
		return sanitize_text_field( wp_unslash( (string) $_SERVER['HTTP_CF_CONNECTING_IP'] ) );
	}

	// REMOTE_ADDR is set by the web server and is reliable when not behind a proxy.
	$remote_addr = sanitize_text_field( (string) ( $_SERVER['REMOTE_ADDR'] ?? '' ) );
	if ( '' !== $remote_addr && 'unknown' !== $remote_addr ) {
		return $remote_addr;
	}

	// Last resort: X-Forwarded-For (first entry). Only reached when REMOTE_ADDR is
	// unavailable, which is unusual outside of non-standard proxy configurations.
	$forwarded_for = isset( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ? wp_unslash( (string) $_SERVER['HTTP_X_FORWARDED_FOR'] ) : '';
	if ( '' !== trim( $forwarded_for ) ) {
		$forwarded_parts = explode( ',', $forwarded_for );
		return sanitize_text_field( trim( (string) $forwarded_parts[0] ) );
	}

	return 'unknown';
}

/**
 * Verify a Turnstile token against Cloudflare.
 *
 * @param mixed $token Raw Turnstile token.
 * @return array{outcome:string,errorCodes:array<int,string>}
 */
function hdc_verify_turnstile_token( $token ) {
	$secret = hdc_get_turnstile_secret_key();
	if ( '' === $secret ) {
		return array(
			'outcome'    => 'unavailable',
			'errorCodes' => array( 'missing-input-secret' ),
		);
	}

	$token = trim( (string) $token );
	if ( '' === $token ) {
		return array(
			'outcome'    => 'invalid',
			'errorCodes' => array( 'missing-input-response' ),
		);
	}

	if ( strlen( $token ) > 2048 ) {
		return array(
			'outcome'    => 'invalid',
			'errorCodes' => array( 'invalid-input-response' ),
		);
	}

	$request_body = array(
		'secret'          => $secret,
		'response'        => $token,
		'idempotency_key' => wp_generate_uuid4(),
	);

	$client_ip = hdc_get_contact_client_ip();
	if ( '' !== $client_ip && 'unknown' !== $client_ip ) {
		$request_body['remoteip'] = $client_ip;
	}

	$response = wp_remote_post(
		'https://challenges.cloudflare.com/turnstile/v0/siteverify',
		array(
			'timeout' => 10,
			'body'    => $request_body,
		)
	);

	if ( is_wp_error( $response ) ) {
		return array(
			'outcome'    => 'unavailable',
			'errorCodes' => array( 'internal-error' ),
		);
	}

	$response_code = (int) wp_remote_retrieve_response_code( $response );
	$payload       = json_decode( (string) wp_remote_retrieve_body( $response ), true );

	if ( ! is_array( $payload ) ) {
		return array(
			'outcome'    => 'unavailable',
			'errorCodes' => array( 'internal-error' ),
		);
	}

	$error_codes = isset( $payload['error-codes'] ) && is_array( $payload['error-codes'] )
		? array_values(
			array_filter(
				array_map(
					static function ( $error_code ) {
						return sanitize_text_field( (string) $error_code );
					},
					$payload['error-codes']
				)
			)
		)
		: array();

	if ( empty( $payload['success'] ) ) {
		if ( in_array( 'missing-input-secret', $error_codes, true ) || in_array( 'invalid-input-secret', $error_codes, true ) ) {
			return array(
				'outcome'    => 'unavailable',
				'errorCodes' => $error_codes,
			);
		}

		if ( $response_code >= 500 || in_array( 'internal-error', $error_codes, true ) ) {
			return array(
				'outcome'    => 'unavailable',
				'errorCodes' => ! empty( $error_codes ) ? $error_codes : array( 'internal-error' ),
			);
		}

		return array(
			'outcome'    => 'invalid',
			'errorCodes' => ! empty( $error_codes ) ? $error_codes : array( 'invalid-input-response' ),
		);
	}

	$action = sanitize_text_field( (string) ( $payload['action'] ?? '' ) );
	if ( '' !== $action && 'contact' !== $action ) {
		return array(
			'outcome'    => 'invalid',
			'errorCodes' => array( 'action-mismatch' ),
		);
	}

	return array(
		'outcome'    => 'ok',
		'errorCodes' => array(),
	);
}

/**
 * Validate contact payload and return field-level errors.
 *
 * @param array $payload Incoming payload.
 * @return array<string,string>
 */
function hdc_validate_contact_payload( $payload ) {
	$errors  = array();
	$name    = trim( (string) ( $payload['name'] ?? '' ) );
	$email   = trim( (string) ( $payload['email'] ?? '' ) );
	$message = trim( (string) ( $payload['message'] ?? '' ) );

	if ( '' === $name ) {
		$errors['name'] = __( 'Please enter your name.', 'henrys-digital-canvas' );
	} elseif ( strlen( $name ) < 2 ) {
		$errors['name'] = __( 'Name should be at least 2 characters.', 'henrys-digital-canvas' );
	}

	if ( '' === $email ) {
		$errors['email'] = __( 'Please enter your email address.', 'henrys-digital-canvas' );
	} elseif ( ! is_email( $email ) ) {
		$errors['email'] = __( 'Enter a valid email address.', 'henrys-digital-canvas' );
	}

	if ( '' === $message ) {
		$errors['message'] = __( 'Please add a message.', 'henrys-digital-canvas' );
	} elseif ( strlen( $message ) < 20 ) {
		$errors['message'] = __( 'Message should be at least 20 characters.', 'henrys-digital-canvas' );
	}

	return $errors;
}

/**
 * Process a validated contact submission.
 *
 * @param array $payload Contact payload.
 * @return array|WP_Error
 */
function hdc_process_contact_submission( $payload ) {
	$contact_service_unavailable_error = __( 'Contact service is temporarily unavailable. Please try again in a little bit.', 'henrys-digital-canvas' );
	$contact_rate_limit_error          = __( 'Too many contact attempts. Please wait a few minutes and try again.', 'henrys-digital-canvas' );
	$contact_verification_error        = __( 'Please complete the verification check and try again.', 'henrys-digital-canvas' );

	$payload = array(
		'name'           => trim( (string) ( $payload['name'] ?? '' ) ),
		'email'          => trim( (string) ( $payload['email'] ?? '' ) ),
		'message'        => trim( (string) ( $payload['message'] ?? '' ) ),
		'company'        => trim( (string) ( $payload['company'] ?? '' ) ),
		'turnstileToken' => trim( (string) ( $payload['turnstileToken'] ?? '' ) ),
	);

	if ( '' !== $payload['company'] ) {
		return array(
			'success' => true,
		);
	}

	$errors = hdc_validate_contact_payload( $payload );
	if ( ! empty( $errors ) ) {
		return new WP_Error(
			'hdc_contact_validation_failed',
			__( 'Invalid contact form submission.', 'henrys-digital-canvas' ),
			array(
				'status' => 422,
				'errors' => $errors,
				'error'  => __( 'Please review the highlighted fields and try again.', 'henrys-digital-canvas' ),
			)
		);
	}

	$payload = array(
		'name'           => sanitize_text_field( $payload['name'] ),
		'email'          => sanitize_email( $payload['email'] ),
		'message'        => sanitize_textarea_field( $payload['message'] ),
		'turnstileToken' => sanitize_text_field( $payload['turnstileToken'] ),
	);

	$rate_limit_window_seconds = (int) apply_filters( 'hdc_contact_rate_limit_window_seconds', 600, $payload );
	$rate_limit_max_attempts   = (int) apply_filters( 'hdc_contact_rate_limit_max_attempts', 3, $payload );
	$rate_limit_window_seconds = max( 10, min( 3600, $rate_limit_window_seconds ) );
	$rate_limit_max_attempts   = max( 1, min( 10, $rate_limit_max_attempts ) );
	$rate_limit_ip             = hdc_get_contact_client_ip();
	$rate_limit_key            = 'hdc_contact_rate_' . md5( $rate_limit_ip );
	$attempt_count             = (int) get_transient( $rate_limit_key );

	if ( $attempt_count >= $rate_limit_max_attempts ) {
		return new WP_Error(
			'hdc_contact_rate_limited',
			$contact_rate_limit_error,
			array(
				'status' => 429,
				'error'  => $contact_rate_limit_error,
			)
		);
	}

	set_transient( $rate_limit_key, $attempt_count + 1, $rate_limit_window_seconds );

	$turnstile_verification = hdc_verify_turnstile_token( $payload['turnstileToken'] );
	if ( 'unavailable' === $turnstile_verification['outcome'] ) {
		error_log( 'hdc_contact_submission: Turnstile validation unavailable.' ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		return new WP_Error(
			'hdc_contact_turnstile_unavailable',
			$contact_service_unavailable_error,
			array(
				'status' => 503,
				'error'  => $contact_service_unavailable_error,
			)
		);
	}

	if ( 'invalid' === $turnstile_verification['outcome'] ) {
		return new WP_Error(
			'hdc_contact_turnstile_invalid',
			$contact_verification_error,
			array(
				'status' => 400,
				'error'  => $contact_verification_error,
			)
		);
	}

	$to      = apply_filters( 'hdc_contact_to_email', get_option( 'admin_email' ), $payload );
	$subject = sprintf(
		/* translators: %s is the sender's name. */
		__( 'New contact message from %s', 'henrys-digital-canvas' ),
		$payload['name']
	);

	$body = sprintf(
		"Name: %s\nEmail: %s\n\nMessage:\n%s",
		$payload['name'],
		$payload['email'],
		$payload['message']
	);

	$headers = array(
		sprintf( 'Reply-To: %s <%s>', $payload['name'], $payload['email'] ),
	);

	if ( ! is_email( $to ) ) {
		error_log( 'hdc_contact_submission: invalid destination email; contact route misconfigured.' ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		return new WP_Error(
			'hdc_contact_service_unavailable',
			$contact_service_unavailable_error,
			array(
				'status' => 503,
				'error'  => $contact_service_unavailable_error,
			)
		);
	}

	$sent = wp_mail( $to, $subject, $body, $headers );

	if ( ! $sent ) {
		error_log( 'hdc_contact_submission: wp_mail returned false; delivery failed.' ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		return new WP_Error(
			'hdc_contact_delivery_failed',
			$contact_service_unavailable_error,
			array(
				'status' => 503,
				'error'  => $contact_service_unavailable_error,
			)
		);
	}

	return array(
		'success'         => true,
		'emailDispatched' => true,
		'message'         => __( 'Thanks for reaching out. I\'ll get back to you soon.', 'henrys-digital-canvas' ),
	);
}

/**
 * Register theme REST routes.
 *
 * @return void
 */
function hdc_register_data_contract_rest_routes() {
	register_rest_route(
		'henrys-digital-canvas/v1',
		'/resume',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'permission_callback' => '__return_true',
			'callback'            => static function () {
				return rest_ensure_response(
					array(
						'source' => 'theme-json',
						'data'   => hdc_get_resume_data_contract(),
					)
				);
			},
		)
	);

	register_rest_route(
		'henrys-digital-canvas/v1',
		'/resume-ats',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'permission_callback' => '__return_true',
			'callback'            => static function () {
				return rest_ensure_response(
					array(
						'source' => 'theme-json',
						'data'   => hdc_get_resume_ats_data_contract(),
					)
				);
			},
		)
	);

	register_rest_route(
		'henrys-digital-canvas/v1',
		'/moments',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'permission_callback' => '__return_true',
			'args'                => array(
				'category'  => array(
					'required'          => false,
					'sanitize_callback' => 'sanitize_text_field',
				),
				'timeframe' => array(
					'required'          => false,
					'sanitize_callback' => 'sanitize_text_field',
				),
			),
			'callback'            => static function ( WP_REST_Request $request ) {
				$category = strtolower( (string) $request->get_param( 'category' ) );
				$timeframe = strtolower( (string) $request->get_param( 'timeframe' ) );
				$items = hdc_get_moments_data_contract( $category, $timeframe );

				return rest_ensure_response(
					array(
						'source' => 'theme-json',
						'count'  => count( $items ),
						'items'  => $items,
					)
				);
			},
		)
	);

	register_rest_route(
		'henrys-digital-canvas/v1',
		'/blog',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'permission_callback' => '__return_true',
			'args'                => array(
				'limit' => array(
					'required'          => false,
					'sanitize_callback' => 'absint',
				),
			),
			'callback'            => static function ( WP_REST_Request $request ) {
				$limit = $request->get_param( 'limit' );
				if ( null === $limit ) {
					$limit = 30;
				}

				$contract = hdc_get_blog_posts_data_contract( (int) $limit );
				return rest_ensure_response( $contract );
			},
		)
	);

	register_rest_route(
		'henrys-digital-canvas/v1',
		'/blog/(?P<slug>[a-z0-9-]+)',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'permission_callback' => '__return_true',
			'callback'            => static function ( WP_REST_Request $request ) {
				$slug = sanitize_title( (string) $request->get_param( 'slug' ) );
				$post = hdc_get_blog_post_by_slug_data_contract( $slug );

				if ( ! is_array( $post ) ) {
					return new WP_Error(
						'hdc_blog_post_not_found',
						__( 'Post not found.', 'henrys-digital-canvas' ),
						array( 'status' => 404 )
					);
				}

				return rest_ensure_response( $post );
			},
		)
	);

	register_rest_route(
		'henrys-digital-canvas/v1',
		'/work',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'permission_callback' => '__return_true',
			'args'                => array(
				'limit' => array(
					'required'          => false,
					'sanitize_callback' => 'absint',
				),
			),
			'callback'            => static function ( WP_REST_Request $request ) {
				$repos = hdc_get_work_repositories_data_contract();
				$limit = (int) $request->get_param( 'limit' );
				if ( $limit > 0 ) {
					$repos = array_slice( $repos, 0, min( 100, $limit ) );
				}

				return rest_ensure_response(
					array(
						'source' => 'local-json',
						'repos'  => $repos,
					)
				);
			},
		)
	);

	register_rest_route(
		'henrys-digital-canvas/v1',
		'/work/(?P<repo>[A-Za-z0-9._-]+)',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'permission_callback' => '__return_true',
			'callback'            => static function ( WP_REST_Request $request ) {
				$repo_name = sanitize_text_field( (string) $request->get_param( 'repo' ) );
				$repo      = hdc_get_work_repository_by_name_data_contract( $repo_name );

				if ( ! is_array( $repo ) ) {
					return new WP_Error(
						'hdc_work_repo_not_found',
						__( 'Repository not found.', 'henrys-digital-canvas' ),
						array( 'status' => 404 )
					);
				}

				return rest_ensure_response( $repo );
			},
		)
	);

	register_rest_route(
		'henrys-digital-canvas/v1',
		'/contact',
		array(
			'methods'             => WP_REST_Server::CREATABLE,
			'permission_callback' => '__return_true',
			'args'                => array(
				'name'    => array(
					'required'          => true,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'email'   => array(
					'required'          => true,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'message' => array(
					'required'          => true,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_textarea_field',
				),
				'company' => array(
					'required'          => false,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'turnstileToken' => array(
					'required'          => false,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
			),
			'callback'            => static function ( WP_REST_Request $request ) {
				$payload  = $request->get_json_params();
				if ( ! is_array( $payload ) ) {
					$payload = $request->get_params();
				}

				$result = hdc_process_contact_submission( is_array( $payload ) ? $payload : array() );
				if ( is_wp_error( $result ) ) {
					return $result;
				}

				return rest_ensure_response( $result );
			},
		)
	);
}
add_action( 'rest_api_init', 'hdc_register_data_contract_rest_routes' );

/**
 * Backward-compatible non-REST contact endpoint for `/api/contact`.
 *
 * @param WP $wp Current request.
 * @return void
 */
function hdc_handle_legacy_contact_endpoint( $wp ) {
	if ( ! isset( $wp->request ) || 'api/contact' !== trim( (string) $wp->request, '/' ) ) {
		return;
	}

	$method = strtoupper( (string) ( $_SERVER['REQUEST_METHOD'] ?? 'GET' ) );

	header( 'Content-Type: application/json; charset=' . get_option( 'blog_charset' ) );
	header( 'Cache-Control: no-store, no-cache, must-revalidate, max-age=0' );

	if ( 'OPTIONS' === $method ) {
		status_header( 204 );
		echo wp_json_encode( array() );
		exit;
	}

	if ( 'POST' !== $method ) {
		status_header( 405 );
		echo wp_json_encode(
			array(
				'error' => __( 'Method not allowed.', 'henrys-digital-canvas' ),
			)
		);
		exit;
	}

	// Verify Origin or Referer matches this site to mitigate CSRF.
	$site_host   = strtolower( (string) wp_parse_url( home_url(), PHP_URL_HOST ) );
	$origin      = isset( $_SERVER['HTTP_ORIGIN'] ) ? strtolower( (string) wp_parse_url( wp_unslash( $_SERVER['HTTP_ORIGIN'] ), PHP_URL_HOST ) ) : '';
	$referer     = isset( $_SERVER['HTTP_REFERER'] ) ? strtolower( (string) wp_parse_url( wp_unslash( $_SERVER['HTTP_REFERER'] ), PHP_URL_HOST ) ) : '';
	$origin_ok   = ( '' !== $origin && $origin === $site_host ) || ( '' !== $referer && $referer === $site_host );

	if ( ! $origin_ok ) {
		status_header( 403 );
		echo wp_json_encode(
			array(
				'error' => __( 'Request origin not allowed.', 'henrys-digital-canvas' ),
			)
		);
		exit;
	}

	$raw_body = file_get_contents( 'php://input' ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	$payload  = json_decode( (string) $raw_body, true );
	if ( ! is_array( $payload ) ) {
		$payload = array();
	}

	$result = hdc_process_contact_submission( $payload );
	if ( is_wp_error( $result ) ) {
		$error_data = $result->get_error_data();
		$status     = is_array( $error_data ) && ! empty( $error_data['status'] ) ? (int) $error_data['status'] : 422;

		status_header( $status );
		if ( ! is_array( $error_data ) ) {
			$error_data = array();
		}

		if ( empty( $error_data['error'] ) ) {
			$error_data['error'] = $result->get_error_message();
		}

		echo wp_json_encode( $error_data );
		exit;
	}

	status_header( 200 );
	echo wp_json_encode( $result );
	exit;
}
add_action( 'parse_request', 'hdc_handle_legacy_contact_endpoint' );

/**
 * Parse a positive integer from input and clamp to bounds.
 *
 * @param mixed $value Raw input value.
 * @param int   $default Fallback when input is invalid.
 * @param int   $min Minimum value.
 * @param int   $max Maximum value.
 * @return int
 */
function hdc_clamp_int( $value, $default, $min, $max ) {
	$parsed = filter_var( $value, FILTER_VALIDATE_INT );
	if ( false === $parsed ) {
		return $default;
	}

	return max( $min, min( $max, (int) $parsed ) );
}

/**
 * Resolve GitHub repository owner from query params or configured defaults.
 *
 * @return string|WP_Error
 */
function hdc_resolve_github_username() {
	$configured_owner = apply_filters( 'hdc_github_repo_owner', hdc_get_configured_github_owner() );
	$configured_owner = sanitize_text_field( (string) $configured_owner );
	if ( ! preg_match( '/^[A-Za-z0-9-]{1,39}$/', $configured_owner ) ) {
		$configured_owner = hdc_get_configured_github_owner();
	}

	$username = isset( $_GET['username'] ) ? sanitize_text_field( wp_unslash( (string) $_GET['username'] ) ) : '';
	if ( '' === $username ) {
		return $configured_owner;
	}

	if ( ! preg_match( '/^[A-Za-z0-9-]{1,39}$/', $username ) ) {
		return new WP_Error(
			'hdc_invalid_github_username',
			__( 'Invalid GitHub username.', 'henrys-digital-canvas' ),
			array( 'status' => 400 )
		);
	}

	if ( 0 !== strcasecmp( $username, $configured_owner ) ) {
		return new WP_Error(
			'hdc_github_username_not_allowed',
			__( 'This endpoint only supports the configured GitHub owner.', 'henrys-digital-canvas' ),
			array( 'status' => 400 )
		);
	}

	return $configured_owner;
}

/**
 * Build GitHub API request headers.
 *
 * @return array<string,string>
 */
function hdc_get_github_request_headers() {
	$github_token = '';
	if ( defined( 'HDC_GITHUB_TOKEN' ) && is_string( HDC_GITHUB_TOKEN ) ) {
		$github_token = HDC_GITHUB_TOKEN;
	}
	if ( '' === trim( $github_token ) ) {
		$env_token = getenv( 'GITHUB_TOKEN' );
		if ( is_string( $env_token ) ) {
			$github_token = $env_token;
		}
	}

	$github_token = trim( (string) apply_filters( 'hdc_github_token', $github_token ) );
	$headers      = array(
		'Accept'               => 'application/vnd.github+json',
		'X-GitHub-Api-Version' => '2022-11-28',
		'User-Agent'           => 'henry-digital-canvas',
	);

	if ( '' !== $github_token ) {
		$headers['Authorization'] = 'Bearer ' . $github_token;
	}

	return $headers;
}

/**
 * Fetch JSON from GitHub and normalize response metadata.
 *
 * @param string               $url Target URL.
 * @param array<string,string> $headers Request headers.
 * @return array<string,mixed>
 */
function hdc_fetch_github_json( $url, $headers ) {
	$response = wp_remote_get(
		$url,
		array(
			'headers' => $headers,
			'timeout' => 20,
		)
	);

	if ( is_wp_error( $response ) ) {
		return array(
			'ok'       => false,
			'status'   => 502,
			'payload'  => array(
				'error' => 'Failed to reach GitHub API',
			),
			'response' => null,
		);
	}

	$status_code = (int) wp_remote_retrieve_response_code( $response );
	$body        = wp_remote_retrieve_body( $response );
	$payload     = json_decode( (string) $body, true );
	if ( JSON_ERROR_NONE !== json_last_error() ) {
		return array(
			'ok'       => false,
			'status'   => 502,
			'payload'  => array(
				'error' => 'GitHub API returned invalid JSON',
			),
			'response' => $response,
		);
	}

	if ( $status_code < 200 || $status_code >= 300 ) {
		return array(
			'ok'       => false,
			'status'   => $status_code,
			'payload'  => array(
				'error'   => 'GitHub API request failed',
				'status'  => $status_code,
				'details' => $payload,
			),
			'response' => $response,
		);
	}

	return array(
		'ok'       => true,
		'status'   => $status_code,
		'payload'  => $payload,
		'response' => $response,
	);
}

/**
 * Extract GitHub rate-limit headers from an upstream response.
 *
 * @param array|string|null $response WordPress HTTP response array or null.
 * @return array<string,string>
 */
function hdc_get_github_rate_limit_headers( $response ) {
	if ( ! is_array( $response ) ) {
		return array();
	}

	$header_mappings = array(
		'x-ratelimit-limit'     => 'x-github-ratelimit-limit',
		'x-ratelimit-remaining' => 'x-github-ratelimit-remaining',
		'x-ratelimit-used'      => 'x-github-ratelimit-used',
		'x-ratelimit-reset'     => 'x-github-ratelimit-reset',
		'x-ratelimit-resource'  => 'x-github-ratelimit-resource',
		'retry-after'           => 'retry-after',
	);

	$headers = array();
	foreach ( $header_mappings as $source_header => $target_header ) {
		$value = wp_remote_retrieve_header( $response, $source_header );
		if ( is_array( $value ) ) {
			$value = reset( $value );
		}
		if ( is_string( $value ) && '' !== trim( $value ) ) {
			$headers[ $target_header ] = trim( $value );
		}
	}

	return $headers;
}

/**
 * Estimate retry-after seconds from GitHub rate-limit headers.
 *
 * @param array|string|null $response WordPress HTTP response array or null.
 * @return int
 */
function hdc_get_github_rate_limit_retry_after_seconds( $response ) {
	if ( ! is_array( $response ) ) {
		return 60;
	}

	$retry_after = wp_remote_retrieve_header( $response, 'retry-after' );
	if ( is_array( $retry_after ) ) {
		$retry_after = reset( $retry_after );
	}
	if ( is_numeric( $retry_after ) ) {
		return max( 60, min( 1800, (int) $retry_after ) );
	}

	$reset_time = wp_remote_retrieve_header( $response, 'x-ratelimit-reset' );
	if ( is_array( $reset_time ) ) {
		$reset_time = reset( $reset_time );
	}
	if ( is_numeric( $reset_time ) ) {
		$seconds_until_reset = (int) $reset_time - time();
		if ( $seconds_until_reset > 0 ) {
			return max( 60, min( 1800, $seconds_until_reset ) );
		}
	}

	return 60;
}

/**
 * Send a JSON response and terminate request handling.
 *
 * @param int                  $status_code HTTP status code.
 * @param mixed                $payload JSON-serializable payload.
 * @param string               $cache_control Cache-Control header value.
 * @param array<string,string> $extra_headers Additional headers.
 * @return void
 */
function hdc_send_legacy_json_response( $status_code, $payload, $cache_control, $extra_headers = array() ) {
	header( 'Content-Type: application/json; charset=' . get_option( 'blog_charset' ) );
	header( 'Cache-Control: ' . $cache_control );

	foreach ( $extra_headers as $name => $value ) {
		if ( ! is_string( $name ) || ! is_string( $value ) ) {
			continue;
		}
		if ( '' === trim( $name ) || '' === trim( $value ) ) {
			continue;
		}

		$safe_name  = str_replace( array( "\r", "\n" ), '', trim( $name ) );
		$safe_value = str_replace( array( "\r", "\n" ), '', trim( $value ) );
		header( $safe_name . ': ' . $safe_value );
	}

	status_header( $status_code );
	echo wp_json_encode( $payload );
	exit;
}

/**
 * Decorate a cached language summary payload for stale fallback responses.
 *
 * @param array  $payload Cached successful payload.
 * @param string $error_message User-facing error message.
 * @return array
 */
function hdc_build_stale_github_language_summary_payload( $payload, $error_message ) {
	if ( ! is_array( $payload ) ) {
		return array();
	}

	$payload['stale'] = true;
	if ( '' !== trim( $error_message ) ) {
		$payload['error'] = sanitize_text_field( $error_message );
	}

	return $payload;
}

/**
 * Normalize GitHub repository shape for frontend consumers.
 *
 * @param mixed $repo Raw repository payload.
 * @return array<string,mixed>
 */
function hdc_sanitize_github_repo( $repo ) {
	$repo = is_array( $repo ) ? $repo : array();

	$topics = array();
	if ( isset( $repo['topics'] ) && is_array( $repo['topics'] ) ) {
		foreach ( $repo['topics'] as $topic ) {
			if ( is_string( $topic ) && '' !== trim( $topic ) ) {
				$topics[] = trim( $topic );
			}
		}
	}

	$sanitized = array(
		'name'             => isset( $repo['name'] ) && is_string( $repo['name'] ) ? $repo['name'] : '',
		'description'      => isset( $repo['description'] ) && is_string( $repo['description'] ) ? $repo['description'] : null,
		'language'         => isset( $repo['language'] ) && is_string( $repo['language'] ) ? $repo['language'] : null,
		'stargazers_count' => isset( $repo['stargazers_count'] ) && is_numeric( $repo['stargazers_count'] ) ? (int) $repo['stargazers_count'] : 0,
		'forks_count'      => isset( $repo['forks_count'] ) && is_numeric( $repo['forks_count'] ) ? (int) $repo['forks_count'] : 0,
		'pushed_at'        => isset( $repo['pushed_at'] ) && is_string( $repo['pushed_at'] ) ? $repo['pushed_at'] : '',
		'html_url'         => isset( $repo['html_url'] ) && is_string( $repo['html_url'] ) ? $repo['html_url'] : '',
		'topics'           => $topics,
		'fork'             => ! empty( $repo['fork'] ),
		'archived'         => ! empty( $repo['archived'] ),
	);

	if ( isset( $repo['default_branch'] ) && is_string( $repo['default_branch'] ) && '' !== $repo['default_branch'] ) {
		$sanitized['default_branch'] = $repo['default_branch'];
	}

	return $sanitized;
}

/**
 * Sanitize GitHub language totals payload.
 *
 * @param mixed $payload Raw languages payload.
 * @return array<string,int>
 */
function hdc_sanitize_github_language_map( $payload ) {
	if ( ! is_array( $payload ) ) {
		return array();
	}

	$sanitized = array();
	foreach ( $payload as $language => $bytes ) {
		if ( ! is_string( $language ) || '' === trim( $language ) ) {
			continue;
		}

		if ( ! is_numeric( $bytes ) ) {
			continue;
		}

		$bytes = (int) $bytes;
		if ( $bytes <= 0 ) {
			continue;
		}

		$sanitized[ $language ] = $bytes;
	}

	return $sanitized;
}

/**
 * Sort language count map to descending array structure.
 *
 * @param array<string,int> $language_counts Language => count map.
 * @return array<int,array<string,mixed>>
 */
function hdc_sort_language_counts_desc( $language_counts ) {
	$rows = array();
	foreach ( $language_counts as $language => $count ) {
		$rows[] = array(
			'language' => (string) $language,
			'count'    => (int) $count,
		);
	}

	usort(
		$rows,
		static function ( $left, $right ) {
			$delta = (int) $right['count'] - (int) $left['count'];
			if ( 0 !== $delta ) {
				return $delta;
			}
			return strcmp( (string) $left['language'], (string) $right['language'] );
		}
	);

	return $rows;
}

/**
 * Sort language byte totals map to descending array structure.
 *
 * @param array<string,int> $language_bytes Language => bytes map.
 * @return array<int,array<string,mixed>>
 */
function hdc_sort_language_bytes_desc( $language_bytes ) {
	$rows = array();
	foreach ( $language_bytes as $language => $bytes ) {
		$rows[] = array(
			'language' => (string) $language,
			'bytes'    => (int) $bytes,
		);
	}

	usort(
		$rows,
		static function ( $left, $right ) {
			$delta = (int) $right['bytes'] - (int) $left['bytes'];
			if ( 0 !== $delta ) {
				return $delta;
			}
			return strcmp( (string) $left['language'], (string) $right['language'] );
		}
	);

	return $rows;
}

/**
 * Extract a GitHub API payload message from normalized proxy results.
 *
 * @param mixed $payload Raw payload.
 * @return string
 */
function hdc_extract_github_payload_message( $payload ) {
	if ( ! is_array( $payload ) ) {
		return '';
	}

	if ( isset( $payload['message'] ) && is_string( $payload['message'] ) ) {
		return trim( $payload['message'] );
	}

	if ( isset( $payload['details'] ) && is_array( $payload['details'] ) && isset( $payload['details']['message'] ) && is_string( $payload['details']['message'] ) ) {
		return trim( $payload['details']['message'] );
	}

	if ( isset( $payload['error'] ) && is_string( $payload['error'] ) ) {
		return trim( $payload['error'] );
	}

	return '';
}

/**
 * Determine whether a normalized GitHub proxy result reflects rate limiting.
 *
 * @param array<string,mixed> $result Normalized proxy result.
 * @return bool
 */
function hdc_is_rate_limited_github_result( $result ) {
	if ( ! is_array( $result ) || ! empty( $result['ok'] ) ) {
		return false;
	}

	$status = isset( $result['status'] ) ? (int) $result['status'] : 0;
	if ( 429 === $status ) {
		return true;
	}

	if ( 403 !== $status ) {
		return false;
	}

	$remaining = 0;
	if ( isset( $result['response'] ) && is_array( $result['response'] ) ) {
		$remaining_header = wp_remote_retrieve_header( $result['response'], 'x-ratelimit-remaining' );
		if ( is_array( $remaining_header ) ) {
			$remaining_header = reset( $remaining_header );
		}
		$remaining = is_numeric( $remaining_header ) ? (int) $remaining_header : 0;
	}

	if ( $remaining <= 0 ) {
		return true;
	}

	return false !== stripos( hdc_extract_github_payload_message( $result['payload'] ?? array() ), 'rate limit' );
}

/**
 * Sanitize GitHub community profile payload for frontend consumers.
 *
 * @param mixed $payload Raw community profile payload.
 * @return array<string,mixed>|null
 */
function hdc_sanitize_github_community_profile( $payload ) {
	if ( ! is_array( $payload ) ) {
		return null;
	}

	$files = isset( $payload['files'] ) && is_array( $payload['files'] ) ? $payload['files'] : array();
	$health_percentage = null;
	if ( isset( $payload['health_percentage'] ) && is_numeric( $payload['health_percentage'] ) ) {
		$health_percentage = (int) round( max( 0, min( 100, (float) $payload['health_percentage'] ) ) );
	}

	return array(
		'healthPercentage' => $health_percentage,
		'files'            => array(
			'hasCodeOfConduct'      => ! empty( $files['code_of_conduct'] ),
			'hasContributing'       => ! empty( $files['contributing'] ),
			'hasIssueTemplate'      => ! empty( $files['issue_template'] ),
			'hasPullRequestTemplate' => ! empty( $files['pull_request_template'] ),
			'hasLicense'            => ! empty( $files['license'] ),
			'hasReadme'             => ! empty( $files['readme'] ),
		),
	);
}

/**
 * Sanitize GitHub release payload for frontend consumers.
 *
 * @param mixed $payload Raw release payload.
 * @return array<string,mixed>|null
 */
function hdc_sanitize_github_release( $payload ) {
	if ( ! is_array( $payload ) ) {
		return null;
	}

	$tag_name     = isset( $payload['tag_name'] ) && is_string( $payload['tag_name'] ) ? trim( $payload['tag_name'] ) : '';
	$published_at = isset( $payload['published_at'] ) && is_string( $payload['published_at'] ) ? trim( $payload['published_at'] ) : '';
	$html_url     = isset( $payload['html_url'] ) && is_string( $payload['html_url'] ) ? trim( $payload['html_url'] ) : '';

	if ( '' === $tag_name || '' === $published_at || '' === $html_url ) {
		return null;
	}

	$name = null;
	if ( isset( $payload['name'] ) && is_string( $payload['name'] ) ) {
		$name = '' !== trim( $payload['name'] ) ? trim( $payload['name'] ) : null;
	}

	return array(
		'tagName'     => $tag_name,
		'name'        => $name,
		'publishedAt' => $published_at,
		'htmlUrl'     => $html_url,
		'prerelease'  => ! empty( $payload['prerelease'] ),
		'draft'       => ! empty( $payload['draft'] ),
	);
}

/**
 * Parse requested GitHub repo names from query params.
 *
 * @param int $max_repos Maximum number of repos to accept.
 * @return array<int,string>
 */
function hdc_parse_requested_github_repo_names( $max_repos ) {
	$values = array();

	if ( isset( $_GET['repo'] ) ) {
		$raw_repo = wp_unslash( $_GET['repo'] );
		if ( is_array( $raw_repo ) ) {
			$values = array_merge( $values, $raw_repo );
		} else {
			$values[] = $raw_repo;
		}
	}

	if ( isset( $_GET['repos'] ) ) {
		$raw_repos = wp_unslash( $_GET['repos'] );
		$repos_list = is_array( $raw_repos ) ? $raw_repos : array( $raw_repos );
		foreach ( $repos_list as $repo_group ) {
			$values = array_merge( $values, explode( ',', (string) $repo_group ) );
		}
	}

	$repo_names = array();
	$seen       = array();
	foreach ( $values as $value ) {
		$normalized = trim( sanitize_text_field( (string) $value ) );
		if ( '' === $normalized || ! preg_match( '/^[A-Za-z0-9._-]{1,100}$/', $normalized ) ) {
			continue;
		}

		$dedupe_key = strtolower( $normalized );
		if ( isset( $seen[ $dedupe_key ] ) ) {
			continue;
		}

		$seen[ $dedupe_key ] = true;
		$repo_names[]        = $normalized;
		if ( count( $repo_names ) >= $max_repos ) {
			break;
		}
	}

	return $repo_names;
}

/**
 * Backward-compatible non-REST GitHub repositories endpoint for `/api/github/repos`.
 *
 * @param WP $wp Current request.
 * @return void
 */
function hdc_handle_legacy_github_repos_endpoint( $wp ) {
	if ( ! isset( $wp->request ) || 'api/github/repos' !== trim( (string) $wp->request, '/' ) ) {
		return;
	}

	$method = strtoupper( (string) ( $_SERVER['REQUEST_METHOD'] ?? 'GET' ) );
	if ( 'OPTIONS' === $method ) {
		hdc_send_legacy_json_response( 204, array(), 'no-store, no-cache, must-revalidate, max-age=0' );
	}

	if ( 'GET' !== $method ) {
		hdc_send_legacy_json_response(
			405,
			array(
				'error' => __( 'Method not allowed.', 'henrys-digital-canvas' ),
			),
			'no-store, no-cache, must-revalidate, max-age=0'
		);
	}

	$username = hdc_resolve_github_username();
	if ( is_wp_error( $username ) ) {
		$error_data = $username->get_error_data();
		hdc_send_legacy_json_response(
			is_array( $error_data ) && ! empty( $error_data['status'] ) ? (int) $error_data['status'] : 400,
			array(
				'error' => $username->get_error_message(),
			),
			'no-store, no-cache, must-revalidate, max-age=0'
		);
	}

	$per_page = hdc_clamp_int( $_GET['per_page'] ?? null, 100, 1, 100 );
	$page     = hdc_clamp_int( $_GET['page'] ?? null, 1, 1, 1000 );
	$cache_key = 'hdc_legacy_github_repos_' . md5( $username . '|' . $per_page . '|' . $page );
	$cached    = get_transient( $cache_key );

	if ( is_array( $cached ) ) {
		hdc_send_legacy_json_response(
			200,
			$cached,
			'public, max-age=120, s-maxage=300, stale-while-revalidate=86400'
		);
	}

	$upstream_url = add_query_arg(
		array(
			'per_page' => $per_page,
			'page'     => $page,
		),
		'https://api.github.com/users/' . rawurlencode( $username ) . '/repos'
	);

	$result             = hdc_fetch_github_json( $upstream_url, hdc_get_github_request_headers() );
	$rate_limit_headers = hdc_get_github_rate_limit_headers( $result['response'] ?? null );

	if ( empty( $result['ok'] ) ) {
		hdc_send_legacy_json_response(
			(int) ( $result['status'] ?? 502 ),
			$result['payload'] ?? array( 'error' => 'GitHub API request failed' ),
			'no-store, no-cache, must-revalidate, max-age=0',
			$rate_limit_headers
		);
	}

	if ( ! is_array( $result['payload'] ) ) {
		hdc_send_legacy_json_response(
			502,
			array( 'error' => 'Unexpected GitHub response shape' ),
			'no-store, no-cache, must-revalidate, max-age=0',
			$rate_limit_headers
		);
	}

	$sanitized_payload = array_map( 'hdc_sanitize_github_repo', $result['payload'] );
	set_transient( $cache_key, $sanitized_payload, 120 );

	hdc_send_legacy_json_response(
		200,
		$sanitized_payload,
		'public, max-age=120, s-maxage=300, stale-while-revalidate=86400',
		$rate_limit_headers
	);
}
add_action( 'parse_request', 'hdc_handle_legacy_github_repos_endpoint' );

/**
 * Backward-compatible non-REST GitHub language summary endpoint for `/api/github/language-summary`.
 *
 * @param WP $wp Current request.
 * @return void
 */
function hdc_handle_legacy_github_language_summary_endpoint( $wp ) {
	if ( ! isset( $wp->request ) || 'api/github/language-summary' !== trim( (string) $wp->request, '/' ) ) {
		return;
	}

	$method = strtoupper( (string) ( $_SERVER['REQUEST_METHOD'] ?? 'GET' ) );
	if ( 'OPTIONS' === $method ) {
		hdc_send_legacy_json_response( 204, array(), 'no-store, no-cache, must-revalidate, max-age=0' );
	}

	if ( 'GET' !== $method ) {
		hdc_send_legacy_json_response(
			405,
			array(
				'error' => __( 'Method not allowed.', 'henrys-digital-canvas' ),
			),
			'no-store, no-cache, must-revalidate, max-age=0'
		);
	}

	$username = hdc_resolve_github_username();
	if ( is_wp_error( $username ) ) {
		$error_data = $username->get_error_data();
		hdc_send_legacy_json_response(
			is_array( $error_data ) && ! empty( $error_data['status'] ) ? (int) $error_data['status'] : 400,
			array(
				'error' => $username->get_error_message(),
			),
			'no-store, no-cache, must-revalidate, max-age=0'
		);
	}

	$max_repos       = hdc_clamp_int( $_GET['max_repos'] ?? null, 80, 1, 80 );
	$cache_key       = 'hdc_legacy_github_language_summary_' . md5( $username . '|' . $max_repos );
	$stale_cache_key = $cache_key . '_stale';
	$cooldown_key    = 'hdc_legacy_github_language_summary_cooldown_' . md5( $username );
	$cached          = get_transient( $cache_key );

	if ( is_array( $cached ) ) {
		hdc_send_legacy_json_response(
			200,
			$cached,
			'public, max-age=300, s-maxage=900, stale-while-revalidate=86400'
		);
	}

	$stale_cached = get_transient( $stale_cache_key );
	$cooldown     = (int) get_transient( $cooldown_key );
	if ( $cooldown > 0 ) {
		$cooldown_headers = array(
			'retry-after' => (string) $cooldown,
		);

		if ( is_array( $stale_cached ) ) {
			hdc_send_legacy_json_response(
				503,
				hdc_build_stale_github_language_summary_payload(
					$stale_cached,
					__( 'Showing cached language totals while GitHub is temporarily unavailable.', 'henrys-digital-canvas' )
				),
				'no-store, no-cache, must-revalidate, max-age=0',
				$cooldown_headers
			);
		}

		hdc_send_legacy_json_response(
			503,
			array(
				'error' => __( 'GitHub language summary is temporarily unavailable.', 'henrys-digital-canvas' ),
			),
			'no-store, no-cache, must-revalidate, max-age=0',
			$cooldown_headers
		);
	}

	$headers                   = hdc_get_github_request_headers();
	$latest_rate_limit_headers = array();
	$repositories              = array();
	$per_page                  = 100;
	$page_limit                = 2;

	for ( $page = 1; $page <= $page_limit && count( $repositories ) < $max_repos; $page++ ) {
		$list_url = add_query_arg(
			array(
				'per_page' => $per_page,
				'page'     => $page,
			),
			'https://api.github.com/users/' . rawurlencode( $username ) . '/repos'
		);

		$page_result               = hdc_fetch_github_json( $list_url, $headers );
		$latest_rate_limit_headers = hdc_get_github_rate_limit_headers( $page_result['response'] ?? null );

		if ( empty( $page_result['ok'] ) ) {
			if ( hdc_is_rate_limited_github_result( $page_result ) ) {
				$cooldown = hdc_get_github_rate_limit_retry_after_seconds( $page_result['response'] ?? null );
				set_transient( $cooldown_key, $cooldown, $cooldown );
				$latest_rate_limit_headers['retry-after'] = (string) $cooldown;
			}

			$error_message = hdc_extract_github_payload_message( $page_result['payload'] ?? array() );
			if ( '' === $error_message ) {
				$error_message = __( 'GitHub language summary request failed.', 'henrys-digital-canvas' );
			}

			if ( is_array( $stale_cached ) ) {
				hdc_send_legacy_json_response(
					503,
					hdc_build_stale_github_language_summary_payload( $stale_cached, $error_message ),
					'no-store, no-cache, must-revalidate, max-age=0',
					$latest_rate_limit_headers
				);
			}

			hdc_send_legacy_json_response(
				(int) ( $page_result['status'] ?? 502 ),
				$page_result['payload'] ?? array( 'error' => $error_message ),
				'no-store, no-cache, must-revalidate, max-age=0',
				$latest_rate_limit_headers
			);
		}

		if ( ! is_array( $page_result['payload'] ) ) {
			if ( is_array( $stale_cached ) ) {
				hdc_send_legacy_json_response(
					503,
					hdc_build_stale_github_language_summary_payload(
						$stale_cached,
						__( 'Showing cached language totals because GitHub returned an unexpected response.', 'henrys-digital-canvas' )
					),
					'no-store, no-cache, must-revalidate, max-age=0',
					$latest_rate_limit_headers
				);
			}

			hdc_send_legacy_json_response(
				502,
				array(
					'error' => __( 'Unexpected GitHub response shape.', 'henrys-digital-canvas' ),
				),
				'no-store, no-cache, must-revalidate, max-age=0',
				$latest_rate_limit_headers
			);
		}

		$sanitized_page = array_map( 'hdc_sanitize_github_repo', $page_result['payload'] );
		foreach ( $sanitized_page as $repo ) {
			if ( ! is_array( $repo ) || empty( $repo['name'] ) || ! empty( $repo['fork'] ) || ! empty( $repo['archived'] ) ) {
				continue;
			}

			$repositories[] = $repo;
			if ( count( $repositories ) >= $max_repos ) {
				break 2;
			}
		}

		if ( count( $page_result['payload'] ) < $per_page ) {
			break;
		}
	}

	$repositories = array_slice( $repositories, 0, $max_repos );

	$repo_language_counts = array();
	foreach ( $repositories as $repo ) {
		$language = isset( $repo['language'] ) && is_string( $repo['language'] ) ? trim( $repo['language'] ) : '';
		if ( '' === $language ) {
			continue;
		}

		$repo_language_counts[ $language ] = (int) ( $repo_language_counts[ $language ] ?? 0 ) + 1;
	}

	$language_byte_totals          = array();
	$failed_language_request_count = 0;
	foreach ( $repositories as $repo ) {
		$repo_name = isset( $repo['name'] ) ? sanitize_text_field( (string) $repo['name'] ) : '';
		if ( '' === $repo_name ) {
			continue;
		}

		$language_url              = 'https://api.github.com/repos/' . rawurlencode( $username ) . '/' . rawurlencode( $repo_name ) . '/languages';
		$language_result           = hdc_fetch_github_json( $language_url, $headers );
		$latest_rate_limit_headers = hdc_get_github_rate_limit_headers( $language_result['response'] ?? null );

		if ( empty( $language_result['ok'] ) ) {
			$failed_language_request_count++;
			if ( hdc_is_rate_limited_github_result( $language_result ) ) {
				$cooldown = hdc_get_github_rate_limit_retry_after_seconds( $language_result['response'] ?? null );
				set_transient( $cooldown_key, $cooldown, $cooldown );
				$latest_rate_limit_headers['retry-after'] = (string) $cooldown;
			}
			continue;
		}

		$language_map = hdc_sanitize_github_language_map( $language_result['payload'] );
		foreach ( $language_map as $language => $bytes ) {
			$language_byte_totals[ $language ] = (int) ( $language_byte_totals[ $language ] ?? 0 ) + (int) $bytes;
		}
	}

	if ( $failed_language_request_count > 0 ) {
		$error_message = __( 'GitHub language-byte totals are temporarily unavailable.', 'henrys-digital-canvas' );
		if ( is_array( $stale_cached ) ) {
			hdc_send_legacy_json_response(
				503,
				hdc_build_stale_github_language_summary_payload( $stale_cached, $error_message ),
				'no-store, no-cache, must-revalidate, max-age=0',
				$latest_rate_limit_headers
			);
		}

		hdc_send_legacy_json_response(
			503,
			array(
				'error'                      => $error_message,
				'byteDataIncomplete'         => true,
				'failedLanguageRequestCount' => $failed_language_request_count,
			),
			'no-store, no-cache, must-revalidate, max-age=0',
			$latest_rate_limit_headers
		);
	}

	delete_transient( $cooldown_key );

	$response_payload = array(
		'username'                   => $username,
		'analyzedRepoCount'          => count( $repositories ),
		'repoLanguageCounts'         => hdc_sort_language_counts_desc( $repo_language_counts ),
		'languageByteTotals'         => hdc_sort_language_bytes_desc( $language_byte_totals ),
		'byteDataIncomplete'         => false,
		'failedLanguageRequestCount' => 0,
		'stale'                      => false,
	);
	set_transient( $cache_key, $response_payload, 300 );
	set_transient( $stale_cache_key, $response_payload, DAY_IN_SECONDS );

	hdc_send_legacy_json_response(
		200,
		$response_payload,
		'public, max-age=300, s-maxage=900, stale-while-revalidate=86400',
		$latest_rate_limit_headers
	);
}
add_action( 'parse_request', 'hdc_handle_legacy_github_language_summary_endpoint' );

/**
 * Backward-compatible non-REST GitHub repo proofs endpoint for `/api/github/repo-proofs`.
 *
 * @param WP $wp Current request.
 * @return void
 */
function hdc_handle_legacy_github_repo_proofs_endpoint( $wp ) {
	if ( ! isset( $wp->request ) || 'api/github/repo-proofs' !== trim( (string) $wp->request, '/' ) ) {
		return;
	}

	$method = strtoupper( (string) ( $_SERVER['REQUEST_METHOD'] ?? 'GET' ) );
	if ( 'OPTIONS' === $method ) {
		hdc_send_legacy_json_response( 204, array(), 'no-store, no-cache, must-revalidate, max-age=0' );
	}

	if ( 'GET' !== $method ) {
		hdc_send_legacy_json_response(
			405,
			array(
				'error' => __( 'Method not allowed.', 'henrys-digital-canvas' ),
			),
			'no-store, no-cache, must-revalidate, max-age=0'
		);
	}

	$username  = hdc_resolve_github_username();
	if ( is_wp_error( $username ) ) {
		$error_data = $username->get_error_data();
		hdc_send_legacy_json_response(
			is_array( $error_data ) && ! empty( $error_data['status'] ) ? (int) $error_data['status'] : 400,
			array(
				'error' => $username->get_error_message(),
			),
			'no-store, no-cache, must-revalidate, max-age=0'
		);
	}

	$max_repos = hdc_clamp_int( $_GET['max_repos'] ?? null, 9, 1, 12 );
	$repo_names = hdc_parse_requested_github_repo_names( $max_repos );

	if ( empty( $repo_names ) ) {
		hdc_send_legacy_json_response(
			400,
			array(
				'error' => __( 'At least one valid repo name must be provided using repo=<name>.', 'henrys-digital-canvas' ),
			),
			'no-store, no-cache, must-revalidate, max-age=0'
		);
	}

	$cache_key = 'hdc_legacy_github_repo_proofs_' . md5( $username . '|' . implode( '|', $repo_names ) );
	$cached    = get_transient( $cache_key );

	if ( is_array( $cached ) ) {
		hdc_send_legacy_json_response(
			200,
			$cached,
			'public, max-age=300, s-maxage=900, stale-while-revalidate=86400'
		);
	}

	$headers                   = hdc_get_github_request_headers();
	$latest_rate_limit_headers = array();
	$first_rate_limited_result = null;
	$proofs                    = array();
	$failed_repo_count         = 0;

	foreach ( $repo_names as $repo_name ) {
		$community_url = 'https://api.github.com/repos/' . rawurlencode( $username ) . '/' . rawurlencode( $repo_name ) . '/community/profile';
		$community_result = hdc_fetch_github_json( $community_url, $headers );
		if ( isset( $community_result['response'] ) ) {
			$latest_rate_limit_headers = hdc_get_github_rate_limit_headers( $community_result['response'] );
		}
		if ( null === $first_rate_limited_result && hdc_is_rate_limited_github_result( $community_result ) ) {
			$first_rate_limited_result = $community_result;
		}

		$release_url = 'https://api.github.com/repos/' . rawurlencode( $username ) . '/' . rawurlencode( $repo_name ) . '/releases/latest';
		$release_result = hdc_fetch_github_json( $release_url, $headers );
		if ( isset( $release_result['response'] ) ) {
			$latest_rate_limit_headers = hdc_get_github_rate_limit_headers( $release_result['response'] );
		}
		if ( null === $first_rate_limited_result && hdc_is_rate_limited_github_result( $release_result ) ) {
			$first_rate_limited_result = $release_result;
		}

		$community_health = ! empty( $community_result['ok'] ) ? hdc_sanitize_github_community_profile( $community_result['payload'] ) : null;
		$latest_release   = ! empty( $release_result['ok'] ) ? hdc_sanitize_github_release( $release_result['payload'] ) : null;
		if ( ! empty( $release_result['ok'] ) ) {
			$release_status = $latest_release ? 'published' : 'unavailable';
		} elseif ( 404 === (int) ( $release_result['status'] ?? 0 ) ) {
			$release_status = 'missing';
		} else {
			$release_status = 'unavailable';
		}

		$errors = array();
		if ( empty( $community_result['ok'] ) && 404 !== (int) ( $community_result['status'] ?? 0 ) ) {
			$errors[] = hdc_extract_github_payload_message( $community_result['payload'] ?? array() ) ?: 'Community profile request failed.';
		}
		if ( empty( $release_result['ok'] ) && 404 !== (int) ( $release_result['status'] ?? 0 ) ) {
			$errors[] = hdc_extract_github_payload_message( $release_result['payload'] ?? array() ) ?: 'Release request failed.';
		}

		$proof = array(
			'repo'            => $repo_name,
			'communityHealth' => $community_health,
			'latestRelease'   => $latest_release,
			'releaseStatus'   => $release_status,
		);

		if ( ! $community_health && 'unavailable' === $release_status && ! empty( $errors ) ) {
			$proof['error'] = implode( '; ', $errors );
			$failed_repo_count += 1;
		}

		$proofs[] = $proof;
	}

	if ( $failed_repo_count === count( $proofs ) && is_array( $first_rate_limited_result ) ) {
		hdc_send_legacy_json_response(
			(int) ( $first_rate_limited_result['status'] ?? 502 ),
			$first_rate_limited_result['payload'] ?? array( 'error' => 'GitHub API request failed' ),
			'no-store, no-cache, must-revalidate, max-age=0',
			hdc_get_github_rate_limit_headers( $first_rate_limited_result['response'] ?? null )
		);
	}

	$payload = array(
		'username'        => $username,
		'repoCount'       => count( $repo_names ),
		'failedRepoCount' => $failed_repo_count,
		'partialData'     => $failed_repo_count > 0,
		'proofs'          => $proofs,
	);

	set_transient( $cache_key, $payload, 300 );

	hdc_send_legacy_json_response(
		200,
		$payload,
		'public, max-age=300, s-maxage=900, stale-while-revalidate=86400',
		$latest_rate_limit_headers
	);
}
add_action( 'parse_request', 'hdc_handle_legacy_github_repo_proofs_endpoint' );
