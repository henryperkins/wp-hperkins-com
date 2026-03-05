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
	$contact_rate_limit_error          = __( 'Too many messages sent in a short time. Please try again shortly.', 'henrys-digital-canvas' );

	$payload = array(
		'name'    => trim( (string) ( $payload['name'] ?? '' ) ),
		'email'   => trim( (string) ( $payload['email'] ?? '' ) ),
		'message' => trim( (string) ( $payload['message'] ?? '' ) ),
	);

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
		'name'    => sanitize_text_field( $payload['name'] ),
		'email'   => sanitize_email( $payload['email'] ),
		'message' => sanitize_textarea_field( $payload['message'] ),
	);

	$rate_limit_window_seconds = (int) apply_filters( 'hdc_contact_rate_limit_window_seconds', 60, $payload );
	$rate_limit_max_attempts   = (int) apply_filters( 'hdc_contact_rate_limit_max_attempts', 3, $payload );
	$rate_limit_window_seconds = max( 10, min( 3600, $rate_limit_window_seconds ) );
	$rate_limit_max_attempts   = max( 1, min( 10, $rate_limit_max_attempts ) );
	$rate_limit_ip             = sanitize_text_field( (string) ( $_SERVER['REMOTE_ADDR'] ?? 'unknown' ) );
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
 * @return string
 */
function hdc_resolve_github_username() {
	$username = isset( $_GET['username'] ) ? sanitize_text_field( wp_unslash( (string) $_GET['username'] ) ) : '';
	if ( '' !== $username && preg_match( '/^[A-Za-z0-9-]{1,39}$/', $username ) ) {
		return $username;
	}

	$configured_owner = '';
	if ( defined( 'HDC_GITHUB_REPO_OWNER' ) && is_string( HDC_GITHUB_REPO_OWNER ) ) {
		$configured_owner = HDC_GITHUB_REPO_OWNER;
	}
	if ( '' === trim( $configured_owner ) ) {
		$env_owner = getenv( 'GITHUB_REPO_OWNER' );
		if ( is_string( $env_owner ) ) {
			$configured_owner = $env_owner;
		}
	}

	$configured_owner = sanitize_text_field( (string) $configured_owner );
	if ( ! preg_match( '/^[A-Za-z0-9-]{1,39}$/', $configured_owner ) ) {
		$configured_owner = 'henryperkins';
	}

	return apply_filters( 'hdc_github_repo_owner', $configured_owner );
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

	$username  = hdc_resolve_github_username();
	$max_repos = hdc_clamp_int( $_GET['max_repos'] ?? null, 100, 1, 200 );
	$cache_key = 'hdc_legacy_github_language_summary_' . md5( $username . '|' . $max_repos );
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
	$per_page                  = 100;
	$page_limit                = max( 1, (int) ceil( $max_repos / $per_page ) + 1 );
	$all_repos                 = array();

	for ( $page = 1; $page <= $page_limit; $page++ ) {
		$list_url = add_query_arg(
			array(
				'per_page' => $per_page,
				'page'     => $page,
			),
			'https://api.github.com/users/' . rawurlencode( $username ) . '/repos'
		);

		$page_result = hdc_fetch_github_json( $list_url, $headers );
		$latest_rate_limit_headers = hdc_get_github_rate_limit_headers( $page_result['response'] ?? null );

		if ( empty( $page_result['ok'] ) ) {
			hdc_send_legacy_json_response(
				(int) ( $page_result['status'] ?? 502 ),
				$page_result['payload'] ?? array( 'error' => 'GitHub API request failed' ),
				'no-store, no-cache, must-revalidate, max-age=0',
				$latest_rate_limit_headers
			);
		}

		if ( ! is_array( $page_result['payload'] ) ) {
			hdc_send_legacy_json_response(
				502,
				array( 'error' => 'Unexpected GitHub response shape' ),
				'no-store, no-cache, must-revalidate, max-age=0',
				$latest_rate_limit_headers
			);
		}

		$sanitized_page = array_map( 'hdc_sanitize_github_repo', $page_result['payload'] );
		$all_repos      = array_merge( $all_repos, $sanitized_page );

		if ( count( $sanitized_page ) < $per_page || count( $all_repos ) >= $max_repos ) {
			break;
		}
	}

	$repositories = array_values(
		array_filter(
			$all_repos,
			static function ( $repo ) {
				return is_array( $repo ) && ! empty( $repo['name'] ) && empty( $repo['fork'] ) && empty( $repo['archived'] );
			}
		)
	);
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

		$language_url = 'https://api.github.com/repos/' . rawurlencode( $username ) . '/' . rawurlencode( $repo_name ) . '/languages';
		$language_result = hdc_fetch_github_json( $language_url, $headers );
		$latest_rate_limit_headers = hdc_get_github_rate_limit_headers( $language_result['response'] ?? null );

		if ( empty( $language_result['ok'] ) ) {
			$failed_language_request_count++;
			continue;
		}

		$language_map = hdc_sanitize_github_language_map( $language_result['payload'] );
		foreach ( $language_map as $language => $bytes ) {
			$language_byte_totals[ $language ] = (int) ( $language_byte_totals[ $language ] ?? 0 ) + (int) $bytes;
		}
	}

	$response_payload = array(
		'username'                 => $username,
		'analyzedRepoCount'        => count( $repositories ),
		'repoLanguageCounts'       => hdc_sort_language_counts_desc( $repo_language_counts ),
		'languageByteTotals'       => hdc_sort_language_bytes_desc( $language_byte_totals ),
		'byteDataIncomplete'       => $failed_language_request_count > 0,
		'failedLanguageRequestCount' => $failed_language_request_count,
	);
	set_transient( $cache_key, $response_payload, 300 );

	hdc_send_legacy_json_response(
		200,
		$response_payload,
		'public, max-age=300, s-maxage=900, stale-while-revalidate=86400',
		$latest_rate_limit_headers
	);
}
add_action( 'parse_request', 'hdc_handle_legacy_github_language_summary_endpoint' );
