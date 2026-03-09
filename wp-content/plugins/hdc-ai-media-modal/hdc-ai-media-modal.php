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
		add_action( 'admin_init', array( $this, 'maybe_redirect_generate_image_page' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'dequeue_conflicting_assets' ), 100 );
		add_action( 'print_media_templates', array( $this, 'render_media_templates' ) );
		add_action( 'admin_notices', array( $this, 'render_dependency_notice' ) );
	}

	/**
	 * Redirects the upstream AI Generate Image page to the working HDC modal flow.
	 *
	 * The AI experiment currently registers a Media submenu page at
	 * `upload.php?page=generate-image`, but in this install it renders only the
	 * page heading with no interactive controls. Route that URL back to the
	 * Media Library and auto-open the HDC modal instead.
	 *
	 * @return void
	 */
	public function maybe_redirect_generate_image_page(): void {
		if ( ! is_admin() || wp_doing_ajax() || ! current_user_can( 'upload_files' ) ) {
			return;
		}

		global $pagenow;

		if ( 'upload.php' !== $pagenow ) {
			return;
		}

		$page = isset( $_GET['page'] ) ? sanitize_key( wp_unslash( $_GET['page'] ) ) : '';

		if ( 'generate-image' !== $page ) {
			return;
		}

		wp_safe_redirect(
			add_query_arg(
				'hdc-ai-generate',
				'1',
				admin_url( 'upload.php' )
			)
		);
		exit;
	}

	/**
	 * Determines whether the AI Experiments image generation backend is installed.
	 *
	 * @return bool
	 */
	private function has_ai_image_generation_experiment(): bool {
		return class_exists( '\WordPress\AI\Experiments\Image_Generation\Image_Generation' );
	}

	/**
	 * Determines whether the AI Experiments alt text backend is installed.
	 *
	 * @return bool
	 */
	private function has_ai_alt_text_experiment(): bool {
		return class_exists( '\WordPress\AI\Experiments\Alt_Text_Generation\Alt_Text_Generation' );
	}

	/**
	 * Determines whether a given AI experiment is enabled.
	 *
	 * @param string $experiment_class Fully-qualified experiment class name.
	 * @param string $option_name      Fallback option name used if the class cannot be instantiated.
	 * @return bool
	 */
	private function is_ai_experiment_enabled( string $experiment_class, string $option_name ): bool {
		$global_enabled = (bool) get_option( 'ai_experiments_enabled', false );

		if ( ! $global_enabled ) {
			return false;
		}

		if ( class_exists( $experiment_class ) ) {
			try {
				$experiment = new $experiment_class();

				if ( method_exists( $experiment, 'is_enabled' ) ) {
					return (bool) $experiment->is_enabled();
				}
			} catch ( \Throwable $error ) {
				// Fall back to the registered option when the experiment instance is unavailable.
			}
		}

		return (bool) get_option( $option_name, false );
	}

	/**
	 * Determines whether the AI abilities backend is ready.
	 *
	 * @return bool
	 */
	private function has_ai_abilities(): bool {
		if ( ! function_exists( 'wp_register_ability' ) || ! $this->has_ai_image_generation_experiment() ) {
			return false;
		}

		return $this->is_ai_experiment_enabled(
			'\WordPress\AI\Experiments\Image_Generation\Image_Generation',
			'ai_experiment_image-generation_enabled'
		);
	}

	/**
	 * Determines whether AI-generated alt text is available.
	 *
	 * @return bool
	 */
	private function has_ai_alt_text_generation(): bool {
		if ( ! function_exists( 'wp_register_ability' ) || ! $this->has_ai_alt_text_experiment() ) {
			return false;
		}

		return $this->is_ai_experiment_enabled(
			'\WordPress\AI\Experiments\Alt_Text_Generation\Alt_Text_Generation',
			'ai_experiment_alt-text-generation_enabled'
		);
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
		$status = $this->get_backend_status();

		return $status['available'];
	}

	/**
	 * Returns the current backend availability for the media modal integration.
	 *
	 * @return array<string, mixed>
	 */
	private function get_backend_status(): array {
		$ai_enabled        = $this->has_ai_abilities();
		$classifai_enabled = $this->has_classifai_generation();

		return array(
			'ai_present'           => $this->has_ai_image_generation_experiment(),
			'ai_enabled'           => $ai_enabled,
			'ai_alt_text_enabled'  => $this->has_ai_alt_text_generation(),
			'classifai_present'    => class_exists( '\Classifai\Features\ImageGeneration' ),
			'classifai_enabled'    => $classifai_enabled,
			'available'            => $ai_enabled || $classifai_enabled,
			'experiments_url'      => admin_url( 'options-general.php?page=ai-experiments' ),
			'abilities_url'        => admin_url( 'admin.php?page=abilities-explorer' ),
			'classifai_url'        => admin_url( 'tools.php?page=classifai' ),
		);
	}

	/**
	 * Returns the admin notice explaining how to enable a supported backend.
	 *
	 * @param array<string, mixed> $status Backend availability state.
	 * @return string
	 */
	private function get_dependency_notice_message( array $status ): string {
		if ( $status['ai_present'] && ! $status['ai_enabled'] && $status['classifai_present'] && ! $status['classifai_enabled'] ) {
			return sprintf(
				/* translators: 1: AI Experiments settings URL, 2: ClassifAI settings URL. */
				__( 'HDC AI Media Modal is installed, but no supported image generation backend is configured. Enable the Image Generation experiment in <a href="%1$s">AI Experiments settings</a> or configure <a href="%2$s">ClassifAI image generation</a>.', 'hdc-ai-media-modal' ),
				esc_url( $status['experiments_url'] ),
				esc_url( $status['classifai_url'] )
			);
		}

		if ( $status['ai_present'] && ! $status['ai_enabled'] ) {
			return sprintf(
				/* translators: %s: AI Experiments settings URL. */
				__( 'HDC AI Media Modal is installed, but the AI Experiments image generation backend is not enabled. Enable the global AI Experiments toggle and the Image Generation experiment in <a href="%s">AI Experiments settings</a>.', 'hdc-ai-media-modal' ),
				esc_url( $status['experiments_url'] )
			);
		}

		if ( $status['classifai_present'] && ! $status['classifai_enabled'] ) {
			return sprintf(
				/* translators: %s: ClassifAI settings URL. */
				__( 'HDC AI Media Modal is installed, but ClassifAI image generation is not configured. Connect and enable an image generation provider in <a href="%s">ClassifAI settings</a>.', 'hdc-ai-media-modal' ),
				esc_url( $status['classifai_url'] )
			);
		}

		return sprintf(
			/* translators: 1: AI Experiments settings URL, 2: ClassifAI settings URL. */
			__( 'HDC AI Media Modal is installed, but no supported image generation backend is available. Enable AI Experiments image generation in <a href="%1$s">AI Experiments settings</a> or configure <a href="%2$s">ClassifAI image generation</a>.', 'hdc-ai-media-modal' ),
			esc_url( $status['experiments_url'] ),
			esc_url( $status['classifai_url'] )
		);
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
		$status = $this->get_backend_status();

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
			array( 'media-views', 'wp-api-fetch', 'wp-i18n', 'wp-media-utils', 'wp-url' ),
			file_exists( $script_path ) ? (string) filemtime( $script_path ) : '1.0.0',
			true
		);

		wp_localize_script(
			self::HANDLE,
			'hdcAiMediaModalData',
			array(
				'enabled'                    => $status['available'],
				'aiImageAbilityEnabled'      => $status['ai_enabled'],
				'classifaiGenerationEnabled' => $status['classifai_enabled'],
				'classifaiEndpoint'        => '/classifai/v1/generate-image',
				'altTextEnabled'           => $status['ai_alt_text_enabled'],
				'tabId'                    => 'hdc-ai-generate',
				'isUploadScreen'           => 'upload.php' === $hook_suffix,
				'autoOpen'                 => isset( $_GET['hdc-ai-generate'] ),
				'uploadUrl'                => admin_url( 'upload.php' ),
				'experimentsUrl'           => $status['experiments_url'],
				'abilitiesUrl'             => $status['abilities_url'],
				'classifaiUrl'             => $status['classifai_url'],
				'dependencyMessage'        => __( 'AI Experiments image generation or ClassifAI image generation must be enabled before this media modal tab can be used.', 'hdc-ai-media-modal' ),
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
		$status = $this->get_backend_status();

		if ( $status['available'] || ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$screen = get_current_screen();

		if ( ! $this->is_supported_screen( $screen ) ) {
			return;
		}

		printf(
			'<div class="notice notice-warning"><p>%s</p></div>',
			wp_kses_post( $this->get_dependency_notice_message( $status ) )
		);
	}
}

HDC_AI_Media_Modal::instance();
