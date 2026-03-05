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

	$sent = wp_mail( $to, $subject, $body, $headers );

	if ( ! $sent ) {
		error_log( 'hdc_contact_submission: wp_mail returned false; submission accepted but email delivery not confirmed.' ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
	}

	return array(
		'success'         => true,
		'emailDispatched' => (bool) $sent,
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
