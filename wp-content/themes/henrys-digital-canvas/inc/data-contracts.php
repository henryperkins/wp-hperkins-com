<?php
/**
 * Theme data contract helpers.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Read a JSON file from the child theme.
 *
 * @param string $relative_path Theme-relative path.
 * @param mixed  $fallback      Fallback value when file is unavailable.
 * @return mixed
 */
function hdc_read_theme_json_file( $relative_path, $fallback = array() ) {
	$full_path = get_stylesheet_directory() . $relative_path;

	if ( ! file_exists( $full_path ) || ! is_readable( $full_path ) ) {
		return $fallback;
	}

	if ( function_exists( 'wp_json_file_decode' ) ) {
		$data = wp_json_file_decode( $full_path, array( 'associative' => true ) );
	} else {
		$contents = file_get_contents( $full_path ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		$data     = json_decode( (string) $contents, true );
	}

	if ( null === $data || false === $data ) {
		return $fallback;
	}

	return $data;
}

/**
 * Estimate reading time from rendered HTML.
 *
 * @param string $html Rendered post HTML.
 * @return string
 */
function hdc_estimate_reading_time( $html ) {
	$word_count = str_word_count( wp_strip_all_tags( (string) $html ) );
	$minutes    = max( 1, (int) round( $word_count / 220 ) );

	return sprintf(
		/* translators: %d = reading time in minutes. */
		__( '%d min read', 'henrys-digital-canvas' ),
		$minutes
	);
}

/**
 * Ensure one featured post in fallback arrays.
 *
 * @param array $posts Posts list.
 * @return array
 */
function hdc_ensure_featured_post( $posts ) {
	if ( empty( $posts ) || ! is_array( $posts ) ) {
		return array();
	}

	$has_featured = false;
	foreach ( $posts as $post ) {
		if ( ! empty( $post['featured'] ) ) {
			$has_featured = true;
			break;
		}
	}

	if ( $has_featured ) {
		return $posts;
	}

	$posts[0]['featured'] = true;
	return $posts;
}

/**
 * Sort posts descending by date.
 *
 * @param array $posts Posts list.
 * @return array
 */
function hdc_sort_posts_desc( $posts ) {
	if ( ! is_array( $posts ) ) {
		return array();
	}

	usort(
		$posts,
		static function ( $left, $right ) {
			$left_date  = isset( $left['date'] ) ? strtotime( (string) $left['date'] ) : 0;
			$right_date = isset( $right['date'] ) ? strtotime( (string) $right['date'] ) : 0;

			if ( $left_date === $right_date ) {
				return 0;
			}

			return ( $left_date > $right_date ) ? -1 : 1;
		}
	);

	return $posts;
}

/**
 * Resolve a fallback media URL into an absolute theme-aware URL.
 *
 * @param string $url Raw URL value.
 * @return string
 */
function hdc_resolve_fallback_media_url( $url ) {
	$url = trim( (string) $url );
	if ( '' === $url ) {
		return '';
	}

	if ( 0 === strpos( $url, '/images/' ) ) {
		$relative_path = ltrim( substr( $url, strlen( '/images/' ) ), '/' );
		return esc_url_raw( get_theme_file_uri( 'assets/images/' . $relative_path ) );
	}

	return esc_url_raw( $url );
}

/**
 * Extract featured media fields for a WordPress post.
 *
 * @param int $post_id Post ID.
 * @return array{
 *     featuredImageUrl:string,
 *     featuredImageAlt:string,
 *     featuredImageSrcSet:string
 * }
 */
function hdc_get_post_featured_media_fields( $post_id ) {
	$attachment_id = get_post_thumbnail_id( $post_id );
	if ( ! $attachment_id ) {
		return array(
			'featuredImageUrl'    => '',
			'featuredImageAlt'    => '',
			'featuredImageSrcSet' => '',
		);
	}

	$featured_image_url    = wp_get_attachment_image_url( $attachment_id, 'large' );
	$featured_image_alt    = get_post_meta( $attachment_id, '_wp_attachment_image_alt', true );
	$featured_image_srcset = wp_get_attachment_image_srcset( $attachment_id, 'large' );

	return array(
		'featuredImageUrl'    => esc_url_raw( (string) $featured_image_url ),
		'featuredImageAlt'    => sanitize_text_field( (string) $featured_image_alt ),
		'featuredImageSrcSet' => trim( wp_strip_all_tags( (string) $featured_image_srcset ) ),
	);
}

/**
 * Normalize one fallback blog entry into the API contract shape.
 *
 * @param array $post  Fallback post payload.
 * @param int   $index Zero-based list index.
 * @return array
 */
function hdc_normalize_fallback_blog_post_contract( $post, $index = 0 ) {
	if ( ! is_array( $post ) ) {
		return array();
	}

	$slug = sanitize_title( (string) ( $post['slug'] ?? '' ) );
	if ( '' === $slug ) {
		$slug = 'fallback-post-' . (string) ( $index + 1 );
	}

	$content_html = wp_kses_post( (string) ( $post['contentHtml'] ?? '' ) );
	$content_text = trim( wp_strip_all_tags( (string) ( $post['content'] ?? '' ) ) );
	if ( '' === $content_text ) {
		$content_text = trim( wp_strip_all_tags( $content_html ) );
	}

	$excerpt = sanitize_text_field( (string) ( $post['excerpt'] ?? '' ) );
	if ( '' === $excerpt ) {
		$excerpt = wp_trim_words( $content_text, 36, '…' );
	}

	$tags = array();
	if ( isset( $post['tags'] ) && is_array( $post['tags'] ) ) {
		$tags = array_values(
			array_filter(
				array_map(
					static function ( $tag ) {
						return sanitize_text_field( (string) $tag );
					},
					$post['tags']
				)
			)
		);
	}
	if ( empty( $tags ) ) {
		$tags = array( 'General' );
	}

	$date_iso = sanitize_text_field( (string) ( $post['date'] ?? '' ) );
	$url      = esc_url_raw( (string) ( $post['url'] ?? '' ) );
	if ( '' === $url ) {
		$url = esc_url_raw( home_url( '/blog/' . rawurlencode( $slug ) . '/' ) );
	}

	$reading_time = sanitize_text_field( (string) ( $post['readingTime'] ?? '' ) );
	if ( '' === $reading_time ) {
		$reading_time = hdc_estimate_reading_time( '' !== $content_html ? $content_html : $content_text );
	}

	$post_id = isset( $post['id'] ) ? absint( $post['id'] ) : 0;

	return array(
		'id'                  => $post_id,
		'slug'                => $slug,
		'title'               => html_entity_decode( sanitize_text_field( (string) ( $post['title'] ?? 'Untitled Post' ) ), ENT_QUOTES, 'UTF-8' ),
		'excerpt'             => $excerpt,
		'date'                => $date_iso,
		'tags'                => $tags,
		'featured'            => ! empty( $post['featured'] ),
		'readingTime'         => $reading_time,
		'content'             => $content_text,
		'contentHtml'         => $content_html,
		'url'                 => $url,
		'source'              => 'local',
		'featuredImageUrl'    => hdc_resolve_fallback_media_url( (string) ( $post['featuredImageUrl'] ?? '' ) ),
		'featuredImageAlt'    => sanitize_text_field( (string) ( $post['featuredImageAlt'] ?? '' ) ),
		'featuredImageSrcSet' => trim( wp_strip_all_tags( (string) ( $post['featuredImageSrcSet'] ?? '' ) ) ),
	);
}

/**
 * Read resume dataset.
 *
 * @return array
 */
function hdc_get_resume_data_contract() {
	$data = hdc_read_theme_json_file( '/data/resume.json', array() );
	return is_array( $data ) ? $data : array();
}

/**
 * Read ATS resume dataset.
 *
 * @return array
 */
function hdc_get_resume_ats_data_contract() {
	$data = hdc_read_theme_json_file( '/data/resume-ats.json', array() );
	return is_array( $data ) ? $data : array();
}

/**
 * Get hobbies/moments dataset with optional filters.
 *
 * @param string $category  Optional category filter.
 * @param string $timeframe Optional timeframe filter.
 * @return array
 */
function hdc_get_moments_data_contract( $category = '', $timeframe = '' ) {
	$moments = hdc_read_theme_json_file( '/data/moments.json', array() );

	if ( ! is_array( $moments ) ) {
		return array();
	}

	$allowed_categories = array( 'dev', 'music', 'learning' );
	$allowed_timeframes = array( 'now', 'recently', 'next' );

	$normalized_category  = in_array( $category, $allowed_categories, true ) ? $category : '';
	$normalized_timeframe = in_array( $timeframe, $allowed_timeframes, true ) ? $timeframe : '';

	$normalized_moments = array_map(
		static function ( $moment ) {
			if ( ! is_array( $moment ) ) {
				return $moment;
			}

			if ( isset( $moment['media'] ) && is_array( $moment['media'] ) && ! empty( $moment['media']['src'] ) ) {
				$src = (string) $moment['media']['src'];
				if ( 0 === strpos( $src, '/images/' ) ) {
					$moment['media']['src'] = get_theme_file_uri( 'assets/images/' . ltrim( substr( $src, strlen( '/images/' ) ), '/' ) );
				}
			}

			return $moment;
		},
		$moments
	);

	if ( '' === $normalized_category && '' === $normalized_timeframe ) {
		return array_values( $normalized_moments );
	}

	$filtered = array_filter(
		$normalized_moments,
		static function ( $moment ) use ( $normalized_category, $normalized_timeframe ) {
			if ( ! is_array( $moment ) ) {
				return false;
			}

			if ( '' !== $normalized_category && ( $moment['category'] ?? '' ) !== $normalized_category ) {
				return false;
			}

			if ( '' !== $normalized_timeframe && ( $moment['timeframe'] ?? '' ) !== $normalized_timeframe ) {
				return false;
			}

			return true;
		}
	);

	return array_values( $filtered );
}

/**
 * Map WP post object to blog contract shape.
 *
 * @param WP_Post $post        Post object.
 * @param bool    $is_featured Whether post should be featured.
 * @return array
 */
function hdc_map_wp_post_to_blog_contract( $post, $is_featured = false ) {
	$content_html = apply_filters( 'the_content', (string) $post->post_content );
	$content_html = wp_kses_post( (string) $content_html );
	$content_text = trim( wp_strip_all_tags( (string) $content_html ) );
	$media_fields = hdc_get_post_featured_media_fields( (int) $post->ID );

	$excerpt = has_excerpt( $post )
		? wp_strip_all_tags( get_the_excerpt( $post ) )
		: wp_trim_words( $content_text, 36, '…' );

	$tags = wp_get_post_terms( $post->ID, 'post_tag', array( 'fields' => 'names' ) );
	if ( ! is_array( $tags ) || empty( $tags ) ) {
		$tags = wp_get_post_terms( $post->ID, 'category', array( 'fields' => 'names' ) );
	}
	if ( ! is_array( $tags ) || empty( $tags ) ) {
		$tags = array( 'General' );
	}

	$date_iso = get_post_time( 'c', false, $post );
	if ( ! is_string( $date_iso ) || '' === $date_iso ) {
		$date_iso = $post->post_date;
	}

	return array(
		'id'                  => (int) $post->ID,
		'slug'                => (string) $post->post_name,
		'title'               => html_entity_decode( get_the_title( $post ), ENT_QUOTES, 'UTF-8' ),
		'excerpt'             => $excerpt,
		'date'                => $date_iso,
		'tags'                => array_values( array_unique( array_map( 'sanitize_text_field', $tags ) ) ),
		'featured'            => (bool) $is_featured,
		'readingTime'         => hdc_estimate_reading_time( $content_html ),
		'content'             => $content_text,
		'contentHtml'         => $content_html,
		'url'                 => get_permalink( $post ),
		'source'              => 'wordpress',
		'featuredImageUrl'    => $media_fields['featuredImageUrl'],
		'featuredImageAlt'    => $media_fields['featuredImageAlt'],
		'featuredImageSrcSet' => $media_fields['featuredImageSrcSet'],
	);
}

/**
 * Return blog contract list with WP-first fallback behavior.
 *
 * @param int $limit Max posts.
 * @return array{
 *     source:string,
 *     posts:array<int,array>
 * }
 */
function hdc_get_blog_posts_data_contract( $limit = 30 ) {
	$limit = max( 1, min( 100, (int) $limit ) );

	$wp_posts = get_posts(
		array(
			'post_type'      => 'post',
			'post_status'    => 'publish',
			'numberposts'    => $limit,
			'orderby'        => 'date',
			'order'          => 'DESC',
			'suppress_filters' => false,
		)
	);

	if ( is_array( $wp_posts ) && ! empty( $wp_posts ) ) {
		$mapped = array();
		foreach ( $wp_posts as $index => $wp_post ) {
			$mapped[] = hdc_map_wp_post_to_blog_contract( $wp_post, 0 === $index );
		}

		return array(
			'source' => 'wordpress',
			'posts'  => $mapped,
		);
	}

	$fallback_posts = hdc_read_theme_json_file( '/data/blog-posts-fallback.json', array() );
	if ( ! is_array( $fallback_posts ) ) {
		$fallback_posts = array();
	}

	$fallback_posts = hdc_sort_posts_desc( $fallback_posts );
	$fallback_posts = array_slice( $fallback_posts, 0, $limit );
	$fallback_posts = array_values(
		array_filter(
			array_map(
				static function ( $post, $index ) {
					return hdc_normalize_fallback_blog_post_contract( $post, (int) $index );
				},
				$fallback_posts,
				array_keys( $fallback_posts )
			)
		)
	);
	$fallback_posts = hdc_ensure_featured_post( $fallback_posts );

	return array(
		'source' => 'local',
		'posts'  => $fallback_posts,
	);
}

/**
 * Resolve one blog post by slug, with WP-first behavior.
 *
 * @param string $slug Post slug.
 * @return array|null
 */
function hdc_get_blog_post_by_slug_data_contract( $slug ) {
	$slug = sanitize_title( (string) $slug );
	if ( '' === $slug ) {
		return null;
	}

	$wp_posts = get_posts(
		array(
			'post_type'        => 'post',
			'post_status'      => 'publish',
			'name'             => $slug,
			'posts_per_page'   => 1,
			'no_found_rows'    => true,
			'suppress_filters' => false,
		)
	);

	if ( is_array( $wp_posts ) && ! empty( $wp_posts ) ) {
		return hdc_map_wp_post_to_blog_contract( $wp_posts[0], false );
	}

	$fallback_posts = hdc_read_theme_json_file( '/data/blog-posts-fallback.json', array() );
	if ( ! is_array( $fallback_posts ) ) {
		return null;
	}

	foreach ( $fallback_posts as $index => $post ) {
		$normalized_post = hdc_normalize_fallback_blog_post_contract( $post, (int) $index );
		if ( ! empty( $normalized_post ) && ( $normalized_post['slug'] ?? '' ) === $slug ) {
			return $normalized_post;
		}
	}

	return null;
}

/**
 * Get merged work repositories list.
 *
 * @return array<int,array>
 */
function hdc_get_work_repositories_data_contract() {
	$repos   = hdc_read_theme_json_file( '/blocks/work-showcase/data/repos.json', array() );
	$details = hdc_read_theme_json_file( '/blocks/work-showcase/data/repo-case-study-details.json', array() );

	if ( ! is_array( $repos ) ) {
		$repos = array();
	}
	if ( ! is_array( $details ) ) {
		$details = array();
	}

	$merged = array();
	foreach ( $repos as $repo ) {
		if ( ! is_array( $repo ) || empty( $repo['name'] ) ) {
			continue;
		}

		$name = sanitize_text_field( (string) $repo['name'] );
		if ( '' === $name ) {
			continue;
		}

		if ( isset( $details[ $name ] ) && is_array( $details[ $name ] ) ) {
			$repo = array_replace_recursive( $repo, $details[ $name ] );
		}

		if ( empty( $repo['url'] ) && ( $repo['origin'] ?? '' ) === 'github' ) {
			$repo['url'] = 'https://github.com/henryperkins/' . rawurlencode( $name );
		}

		$repo['name']   = $name;
		$repo['source'] = 'local-json';
		$merged[]       = $repo;
	}

	usort(
		$merged,
		static function ( $left, $right ) {
			$left_time  = isset( $left['updatedAt'] ) ? strtotime( (string) $left['updatedAt'] ) : 0;
			$right_time = isset( $right['updatedAt'] ) ? strtotime( (string) $right['updatedAt'] ) : 0;

			if ( $left_time === $right_time ) {
				return strcmp( (string) ( $left['name'] ?? '' ), (string) ( $right['name'] ?? '' ) );
			}

			return ( $left_time > $right_time ) ? -1 : 1;
		}
	);

	return array_values( $merged );
}

/**
 * Resolve one work repository by name.
 *
 * @param string $repo_name Repository slug/name.
 * @return array|null
 */
function hdc_get_work_repository_by_name_data_contract( $repo_name ) {
	$repo_name = sanitize_text_field( (string) $repo_name );
	if ( '' === $repo_name ) {
		return null;
	}

	$repos = hdc_get_work_repositories_data_contract();
	foreach ( $repos as $repo ) {
		if ( ! is_array( $repo ) || empty( $repo['name'] ) ) {
			continue;
		}

		if ( strtolower( (string) $repo['name'] ) === strtolower( $repo_name ) ) {
			return $repo;
		}
	}

	return null;
}
