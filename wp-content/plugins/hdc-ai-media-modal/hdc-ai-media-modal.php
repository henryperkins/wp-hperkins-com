<?php
/**
 * Plugin Name: HDC AI Media Modal
 * Description: Adds AI image generation to the WordPress media modal using the local AI Experiments abilities.
 * Version: 0.1.0
 * Requires at least: 6.9
 * Requires PHP: 7.4
 * Author: Henry Perkins
 * Text Domain: hdc-ai-media-modal
 *
 * @package HdcAiMediaModal
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class HDC_AI_Media_Modal {
	private const HANDLE = 'hdc-ai-media-modal-admin';

	/**
	 * Singleton instance.
	 *
	 * @var self|null
	 */
	private static ?self $instance = null;

	/**
	 * Returns the singleton instance.
	 *
	 * @return self
	 */
	public static function instance(): self {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	private function __construct() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'dequeue_conflicting_assets' ), 100 );
		add_action( 'print_media_templates', array( $this, 'render_media_templates' ) );
		add_action( 'admin_notices', array( $this, 'render_dependency_notice' ) );
	}

	/**
	 * Determines whether the AI abilities backend is ready.
	 *
	 * @return bool
	 */
	private function has_ai_abilities(): bool {
		return class_exists( '\WordPress\AI_Client\AI_Client' )
			&& function_exists( 'wp_register_ability' )
			&& (bool) get_option( 'ai_experiments_enabled', false )
			&& (bool) get_option( 'ai_experiment_image-generation_enabled', false );
	}

	/**
	 * Determines whether the ClassifAI image generation backend is configured.
	 *
	 * @return bool
	 */
	private function has_classifai_generation(): bool {
		if ( ! class_exists( '\Classifai\Features\ImageGeneration' ) ) {
			return false;
		}

		$settings = get_option( 'classifai_feature_image_generation', array() );
		if ( ! is_array( $settings ) ) {
			return false;
		}

		$provider = $settings['provider'] ?? '';
		if ( ! is_string( $provider ) || '' === $provider ) {
			return false;
		}

		return ! empty( $settings['status'] ) && ! empty( $settings[ $provider ]['authenticated'] );
	}

	/**
	 * Determines whether at least one supported generation backend is ready.
	 *
	 * @return bool
	 */
	private function is_available(): bool {
		return $this->has_ai_abilities() || $this->has_classifai_generation();
	}

	/**
	 * Determines whether the current screen supports the media modal integration.
	 *
	 * @param WP_Screen|null $screen Current admin screen.
	 * @return bool
	 */
	private function is_supported_screen( ?WP_Screen $screen ): bool {
		if ( ! $screen ) {
			return false;
		}

		if ( 'upload' === $screen->base ) {
			return true;
		}

		if ( function_exists( 'wp_should_load_block_editor_scripts_and_styles' ) && wp_should_load_block_editor_scripts_and_styles() ) {
			return true;
		}

		return 'post' === $screen->base;
	}

	/**
	 * Removes overlapping ClassifAI media-modal assets while leaving its backend route available.
	 *
	 * @return void
	 */
	public function dequeue_conflicting_assets(): void {
		$screen = get_current_screen();

		if ( ! $this->is_supported_screen( $screen ) || ! $this->has_classifai_generation() ) {
			return;
		}

		wp_dequeue_script( 'classifai-plugin-image-generation-media-modal-js' );
		wp_dequeue_style( 'classifai-plugin-image-generation-media-modal-css' );
	}

	/**
	 * Enqueues the media modal assets.
	 *
	 * @param string $hook_suffix Current admin hook suffix.
	 * @return void
	 */
	public function enqueue_assets( string $hook_suffix ): void {
		$screen = get_current_screen();

		if ( ! $this->is_supported_screen( $screen ) ) {
			return;
		}

		wp_enqueue_media();

		$script_path = plugin_dir_path( __FILE__ ) . 'assets/js/admin-media-modal.js';
		$style_path  = plugin_dir_path( __FILE__ ) . 'assets/css/admin-media-modal.css';

		wp_enqueue_style(
			self::HANDLE,
			plugins_url( 'assets/css/admin-media-modal.css', __FILE__ ),
			array(),
			file_exists( $style_path ) ? (string) filemtime( $style_path ) : '1.0.0'
		);

		wp_enqueue_script(
			self::HANDLE,
			plugins_url( 'assets/js/admin-media-modal.js', __FILE__ ),
			array( 'media-views', 'wp-api-fetch', 'wp-i18n', 'wp-url' ),
			file_exists( $script_path ) ? (string) filemtime( $script_path ) : '1.0.0',
			true
		);

		wp_localize_script(
			self::HANDLE,
			'hdcAiMediaModalData',
			array(
				'enabled'                  => $this->is_available(),
				'aiImageAbilityEnabled'    => $this->has_ai_abilities(),
				'classifaiGenerationEnabled' => $this->has_classifai_generation(),
				'classifaiEndpoint'        => '/classifai/v1/generate-image',
				'altTextEnabled'           => (bool) get_option( 'ai_experiment_alt-text-generation_enabled', false ),
				'tabId'                    => 'hdc-ai-generate',
				'isUploadScreen'           => 'upload.php' === $hook_suffix,
				'experimentsUrl'           => admin_url( 'options-general.php?page=ai-experiments' ),
				'abilitiesUrl'             => admin_url( 'admin.php?page=abilities-explorer' ),
				'dependencyMessage'        => __( 'Either AI Experiments image generation or ClassifAI image generation must be enabled before this media modal tab can be used.', 'hdc-ai-media-modal' ),
				'fallbackWarning'          => __( '[HDC AI Media Modal] wp.abilities.executeAbility is unavailable. Falling back to REST.', 'hdc-ai-media-modal' ),
			)
		);
	}

	/**
	 * Renders the templates used in the media modal.
	 *
	 * @return void
	 */
	public function render_media_templates(): void {
		$screen = get_current_screen();

		if ( ! $this->is_supported_screen( $screen ) ) {
			return;
		}
		?>
		<script type="text/html" id="tmpl-hdc-ai-media-generate">
			<div class="hdc-ai-media-modal">
				<div class="hdc-ai-media-modal__panel">
					<p class="hdc-ai-media-modal__description">
						<?php esc_html_e( 'Describe the image you want to generate. The result will be saved to the Media Library and selected for use.', 'hdc-ai-media-modal' ); ?>
					</p>

					<label class="screen-reader-text" for="hdc-ai-media-prompt">
						<?php esc_html_e( 'Image prompt', 'hdc-ai-media-modal' ); ?>
					</label>
					<textarea
						id="hdc-ai-media-prompt"
						class="hdc-ai-media-modal__prompt"
						rows="4"
						maxlength="4000"
						placeholder="<?php echo esc_attr__( 'Describe the image you want to generate', 'hdc-ai-media-modal' ); ?>"
					>{{ data.prompt }}</textarea>

					<div class="hdc-ai-media-modal__actions">
						<button type="button" class="button button-primary button-large hdc-ai-media-modal__generate" <# if ( data.isBusy ) { #>disabled<# } #>>
							<?php esc_html_e( 'Generate Image', 'hdc-ai-media-modal' ); ?>
						</button>

						<# if ( data.hasGeneratedImage ) { #>
							<button type="button" class="button button-secondary hdc-ai-media-modal__reset" <# if ( data.isBusy ) { #>disabled<# } #>>
								<?php esc_html_e( 'Clear', 'hdc-ai-media-modal' ); ?>
							</button>
						<# } #>
					</div>

					<# if ( data.statusMessage ) { #>
						<div class="hdc-ai-media-modal__status" role="status" aria-live="polite">
							<span class="spinner is-active"></span>
							<span>{{ data.statusMessage }}</span>
						</div>
					<# } #>

					<# if ( data.errorMessage ) { #>
						<p class="hdc-ai-media-modal__error" role="alert">{{ data.errorMessage }}</p>
					<# } #>
				</div>

				<# if ( data.previewSrc ) { #>
					<div class="hdc-ai-media-modal__preview-shell">
						<div class="hdc-ai-media-modal__preview-frame">
							<img class="hdc-ai-media-modal__preview-image" src="{{ data.previewSrc }}" alt="{{ data.prompt }}" />
						</div>

						<div class="hdc-ai-media-modal__preview-actions">
							<# if ( ! data.importedId ) { #>
								<button type="button" class="button button-primary hdc-ai-media-modal__save" <# if ( data.isBusy ) { #>disabled<# } #>>
									<?php esc_html_e( 'Save To Media Library', 'hdc-ai-media-modal' ); ?>
								</button>
							<# } #>

							<# if ( data.importedId ) { #>
								<button type="button" class="button button-primary hdc-ai-media-modal__browse" <# if ( data.isBusy ) { #>disabled<# } #>>
									<?php esc_html_e( 'Select Image', 'hdc-ai-media-modal' ); ?>
								</button>
							<# } #>

							<button type="button" class="button button-secondary hdc-ai-media-modal__regenerate" <# if ( data.isBusy ) { #>disabled<# } #>>
								<?php esc_html_e( 'Generate Another', 'hdc-ai-media-modal' ); ?>
							</button>
						</div>

						<# if ( data.importedId ) { #>
							<p class="description">
								<?php esc_html_e( 'The generated image has been added to the Media Library and reselected for this frame.', 'hdc-ai-media-modal' ); ?>
							</p>
						<# } #>
					</div>
				<# } #>
			</div>
		</script>
		<?php
	}

	/**
	 * Renders an admin notice when the AI experiment dependency is unavailable.
	 *
	 * @return void
	 */
	public function render_dependency_notice(): void {
		if ( $this->is_available() || ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$screen = get_current_screen();

		if ( ! $this->is_supported_screen( $screen ) ) {
			return;
		}

		printf(
			'<div class="notice notice-warning"><p>%s</p></div>',
			wp_kses_post(
				sprintf(
					/* translators: %s: AI Experiments settings URL. */
					__( 'HDC AI Media Modal is installed, but the AI image generation experiment is not enabled. Enable the global AI experiments toggle and the Image Generation experiment in <a href="%s">AI Experiments settings</a>.', 'hdc-ai-media-modal' ),
					esc_url( admin_url( 'options-general.php?page=ai-experiments' ) )
				)
			)
		);
	}
}

HDC_AI_Media_Modal::instance();
