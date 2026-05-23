<?php
/**
 * Helpers for serializing the home page inner-block tree.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Serialize a self-closing Henry's Digital Canvas child block.
 *
 * @param string $block_slug Child block slug without the namespace.
 * @param array  $attributes Block attributes.
 * @return string Serialized block comment.
 */
function hdc_serialize_home_page_child_block( $block_slug, array $attributes ) {
	$serialized_attributes = empty( $attributes ) ? '' : ' ' . serialize_block_attributes( $attributes );

	return sprintf(
		'<!-- wp:henrys-digital-canvas/%s%s /-->',
		$block_slug,
		$serialized_attributes
	);
}

/**
 * Build the home page child block tree with explicit child attrs.
 *
 * @return string Serialized child block markup.
 */
function hdc_build_home_page_child_block_markup() {
	$contract = function_exists( 'hdc_get_home_content_data_contract' ) ? hdc_get_home_content_data_contract() : array();
	$hero     = isset( $contract['hero'] ) && is_array( $contract['hero'] ) ? $contract['hero'] : array();
	$work     = isset( $contract['selectedWork'] ) && is_array( $contract['selectedWork'] ) ? $contract['selectedWork'] : array();
	$through  = isset( $contract['throughline'] ) && is_array( $contract['throughline'] ) ? $contract['throughline'] : array();
	$resume   = isset( $contract['resumeSnapshot'] ) && is_array( $contract['resumeSnapshot'] ) ? $contract['resumeSnapshot'] : array();
	$writing  = isset( $contract['recentWriting'] ) && is_array( $contract['recentWriting'] ) ? $contract['recentWriting'] : array();
	$contact  = isset( $contract['contactCta'] ) && is_array( $contract['contactCta'] ) ? $contract['contactCta'] : array();

	$blocks = array(
		hdc_serialize_home_page_child_block( 'home-hero', $hero ),
		hdc_serialize_home_page_child_block(
			'home-selected-work',
			array(
				'title'                    => $work['title'] ?? '',
				'actionLabel'              => $work['actionLabel'] ?? '',
				'actionHref'               => $work['actionHref'] ?? '',
				'featuredRepoNames'        => $work['featuredRepoNames'] ?? array(),
				'loadingLabel'             => $work['loadingLabel'] ?? '',
				'sourceLiveLabel'          => $work['sourceLiveLabel'] ?? '',
				'sourceFallbackLabel'      => $work['sourceFallbackLabel'] ?? '',
				'emptyTitle'               => $work['emptyTitle'] ?? '',
				'emptyDescriptionLive'     => $work['emptyDescriptionLive'] ?? '',
				'emptyDescriptionFallback' => $work['emptyDescriptionFallback'] ?? '',
				'repoCount'                => 3,
			)
		),
		hdc_serialize_home_page_child_block( 'home-throughline', $through ),
		hdc_serialize_home_page_child_block( 'home-resume-snapshot', $resume ),
		hdc_serialize_home_page_child_block(
			'home-recent-writing',
			array(
				'title'            => $writing['title'] ?? '',
				'actionLabel'      => $writing['actionLabel'] ?? '',
				'actionHref'       => $writing['actionHref'] ?? '',
				'emptyTitle'       => $writing['emptyTitle'] ?? '',
				'emptyDescription' => $writing['emptyDescription'] ?? '',
				'blogCount'        => 3,
			)
		),
		hdc_serialize_home_page_child_block( 'home-contact-cta', $contact ),
	);

	return implode( "\n\n", $blocks );
}

/**
 * Build the home page parent + child block tree with explicit child attrs.
 *
 * @return string Serialized block markup.
 */
function hdc_build_home_page_block_markup() {
	return sprintf(
		"<!-- wp:henrys-digital-canvas/home-page %s -->\n%s\n<!-- /wp:henrys-digital-canvas/home-page -->",
		serialize_block_attributes( array( 'align' => 'full' ) ),
		hdc_build_home_page_child_block_markup()
	);
}
