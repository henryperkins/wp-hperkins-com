<?php
/**
 * Azure OpenAI Image generation integration
 */

namespace Classifai\Providers\Azure;

use Classifai\Features\ImageGeneration;
use Classifai\Providers\Provider;
use WP_Error;

use function Classifai\safe_wp_remote_post;

if (!defined('ABSPATH')) {
    exit;
}

class Images extends Provider
{

    /**
     * Provider ID
     *
     * @var string
     */
    const ID = 'azure_openai_dalle';

    /**
     * Image generation URL fragment.
     *
     * @var string
     */
    protected $image_generation_url = 'openai/deployments/{deployment-id}/images/generations';

    /**
     * Image generation API version.
     *
     * @var string
     */
    protected $image_api_version = '2025-04-01-preview';

    /**
     * Image model.
     *
     * @var string
     */
    protected $model = 'gpt-image-1.5';

    /**
     * Maximum number of characters a prompt can have.
     *
     * @var int
     */
    public $max_prompt_chars = 32000;

    /**
     * Azure OpenAI Image constructor.
     *
     * @param \Classifai\Features\Feature $feature_instance The feature instance.
     */
    public function __construct($feature_instance = null)
    {
        $this->feature_instance = $feature_instance;
    }

    /**
     * Register what we need for the provider.
     */
    public function register()
    {
        $feature = new ImageGeneration();

        if (
            !$feature->is_feature_enabled() ||
            $feature->get_feature_provider_instance()::ID !== static::ID
        ) {
            return;
        }

        add_filter('classifai_' . ImageGeneration::ID . '_rest_route_generate-image_args', [$this, 'register_rest_args']);
    }

    /**
     * Get the API version.
     *
     * @return string
     */
    public function get_api_version(): string
    {
        /**
         * Filter the API version.
         *
         * @since 3.8.0
         * @hook classifai_azure_openai_dalle_api_version
         *
         * @param string $version The default API version.
         *
         * @return string The API version.
         */
        return apply_filters('classifai_azure_openai_dalle_api_version', $this->image_api_version);
    }

    /**
     * Get the maximum number of characters the prompt supports.
     *
     * @return int
     */
    public function get_max_prompt_chars(): int
    {
        /**
         * Filter the max number of characters the prompt can have.
         *
         * @since 3.8.0
         * @hook classifai_azure_openai_dalle_max_prompt_chars
         *
         * @param int $max The default maximum prompt characters.
         *
         * @return int The maximum prompt characters.
         */
        return apply_filters('classifai_azure_openai_dalle_max_prompt_chars', $this->max_prompt_chars);
    }

    /**
     * Get the model name.
     *
     * @return string
     */
    public function get_model(): string
    {
        /**
         * Filter the model used for image generation.
         *
         * @since 3.8.0
         * @hook classifai_azure_openai_dalle_model
         *
         * @param string $model The default model.
         *
         * @return string The model.
         */
        return apply_filters('classifai_azure_openai_dalle_model', $this->model);
    }

    /**
     * Get request timeout for Azure image API requests.
     *
     * @return int
     */
    public function get_request_timeout(): int
    {
        /**
         * Filter the request timeout for Azure OpenAI image requests.
         *
         * @since 3.8.0
         * @hook classifai_azure_openai_dalle_request_timeout
         *
         * @param int $timeout Request timeout in seconds.
         *
         * @return int Request timeout in seconds.
         */
        return (int) apply_filters('classifai_azure_openai_dalle_request_timeout', 90);
    }

    /**
     * Returns the image quality options.
     *
     * @return array
     */
    public static function get_image_quality_options(): array
    {
        $options = [
            'auto' => __('Auto', 'classifai'),
            'low' => __('Low', 'classifai'),
            'medium' => __('Medium', 'classifai'),
            'high' => __('High', 'classifai'),
        ];

        /**
         * Filter the image quality options.
         *
         * @since 3.8.0
         * @hook classifai_azure_openai_dalle_quality_options
         *
         * @param array $options The default quality options.
         *
         * @return array The quality options.
         */
        return apply_filters('classifai_azure_openai_dalle_quality_options', $options);
    }

    /**
     * Returns the image size options.
     *
     * @return array
     */
    public static function get_image_size_options(): array
    {
        $options = [
            'auto' => __('Auto', 'classifai'),
            '1024x1024' => __('1024x1024 (square)', 'classifai'),
            '1536x1024' => __('1536x1024 (landscape)', 'classifai'),
            '1024x1536' => __('1024x1536 (portrait)', 'classifai'),
        ];

        /**
         * Filter the image size options.
         *
         * @since 3.8.0
         * @hook classifai_azure_openai_dalle_size_options
         *
         * @param array $options The default size options.
         *
         * @return array The size options.
         */
        return apply_filters('classifai_azure_openai_dalle_size_options', $options);
    }

    /**
     * Returns the image style options.
     *
     * @return array
     */
    public static function get_image_style_options(): array
    {
        $options = [];

        /**
         * Filter the image style options.
         *
         * @since 3.8.0
         * @hook classifai_azure_openai_dalle_style_options
         *
         * @param array $options The default style options.
         *
         * @return array The style options.
         */
        return apply_filters('classifai_azure_openai_dalle_style_options', $options);
    }

    /**
     * Render the provider fields.
     */
    public function render_provider_fields()
    {
        $settings = $this->feature_instance->get_settings(static::ID);

        add_settings_field(
            static::ID . '_endpoint_url',
            esc_html__('Endpoint URL', 'classifai'),
            [$this->feature_instance, 'render_input'],
            $this->feature_instance->get_option_name(),
            $this->feature_instance->get_option_name() . '_section',
            [
                'option_index' => static::ID,
                'label_for' => 'endpoint_url',
                'input_type' => 'text',
                'default_value' => $settings['endpoint_url'],
                'description' => $this->feature_instance->is_configured_with_provider(static::ID) ?
                    '' :
                    __('Supported protocol and hostname endpoints, e.g., <code>https://EXAMPLE.openai.azure.com</code>.', 'classifai'),
                'class' => 'large-text classifai-provider-field hidden provider-scope-' . static::ID,
            ]
        );

        add_settings_field(
            static::ID . '_api_key',
            esc_html__('API key', 'classifai'),
            [$this->feature_instance, 'render_input'],
            $this->feature_instance->get_option_name(),
            $this->feature_instance->get_option_name() . '_section',
            [
                'option_index' => static::ID,
                'label_for' => 'api_key',
                'input_type' => 'password',
                'default_value' => $settings['api_key'],
                'class' => 'classifai-provider-field hidden provider-scope-' . static::ID,
            ]
        );

        add_settings_field(
            static::ID . '_deployment',
            esc_html__('Deployment name', 'classifai'),
            [$this->feature_instance, 'render_input'],
            $this->feature_instance->get_option_name(),
            $this->feature_instance->get_option_name() . '_section',
            [
                'option_index' => static::ID,
                'label_for' => 'deployment',
                'input_type' => 'text',
                'default_value' => $settings['deployment'],
                'description' => $this->feature_instance->is_configured_with_provider(static::ID) ?
                    '' :
                    __('Custom name you chose for your deployment when you deployed a DALL·E model.', 'classifai'),
                'class' => 'large-text classifai-provider-field hidden provider-scope-' . static::ID,
            ]
        );

        do_action('classifai_' . static::ID . '_render_provider_fields', $this);
    }

    /**
     * Returns the default settings for the provider.
     *
     * @return array
     */
    public function get_default_provider_settings(): array
    {
        $common_settings = [
            'endpoint_url' => '',
            'api_key' => '',
            'deployment' => '',
            'authenticated' => false,
        ];

        switch ($this->feature_instance::ID) {
            case ImageGeneration::ID:
                return array_merge(
                    $common_settings,
                    [
                        'number_of_images' => 1,
                        'quality' => 'auto',
                        'image_size' => '1024x1024',
                    ]
                );
        }

        return $common_settings;
    }

    /**
     * Sanitization for the options being saved.
     *
     * @param array $new_settings Array of settings about to be saved.
     * @return array The sanitized settings to be saved.
     */
    public function sanitize_settings(array $new_settings): array
    {
        $settings = $this->feature_instance->get_settings();

        if (
            !empty($new_settings[static::ID]['endpoint_url']) &&
            !empty($new_settings[static::ID]['api_key']) &&
            !empty($new_settings[static::ID]['deployment'])
        ) {
            $new_settings[static::ID]['authenticated'] = $settings[static::ID]['authenticated'];
            $new_settings[static::ID]['endpoint_url'] = esc_url_raw($new_settings[static::ID]['endpoint_url'] ?? $settings[static::ID]['endpoint_url']);
            $new_settings[static::ID]['api_key'] = sanitize_text_field($new_settings[static::ID]['api_key'] ?? $settings[static::ID]['api_key']);
            $new_settings[static::ID]['deployment'] = sanitize_text_field($new_settings[static::ID]['deployment'] ?? $settings[static::ID]['deployment']);

            $is_authenticated = $new_settings[static::ID]['authenticated'];
            $is_endpoint_same = $new_settings[static::ID]['endpoint_url'] === $settings[static::ID]['endpoint_url'];
            $is_api_key_same = $new_settings[static::ID]['api_key'] === $settings[static::ID]['api_key'];
            $is_deployment_same = $new_settings[static::ID]['deployment'] === $settings[static::ID]['deployment'];

            if (!($is_authenticated && $is_endpoint_same && $is_api_key_same && $is_deployment_same)) {
                $auth_check = $this->authenticate_credentials(
                    $new_settings[static::ID]['endpoint_url'],
                    $new_settings[static::ID]['api_key'],
                    $new_settings[static::ID]['deployment']
                );

                if (is_wp_error($auth_check)) {
                    $new_settings[static::ID]['authenticated'] = false;

                    add_settings_error(
                        'api_key',
                        'classifai-auth',
                        $auth_check->get_error_message(),
                        'error'
                    );
                } else {
                    $new_settings[static::ID]['authenticated'] = true;
                }
            }
        } else {
            $new_settings[static::ID]['endpoint_url'] = $settings[static::ID]['endpoint_url'];
            $new_settings[static::ID]['api_key'] = $settings[static::ID]['api_key'];
            $new_settings[static::ID]['deployment'] = $settings[static::ID]['deployment'];

            if (
                ($new_settings['provider'] ?? '') === static::ID &&
                (
                    empty($new_settings[static::ID]['endpoint_url']) ||
                    empty($new_settings[static::ID]['api_key']) ||
                    empty($new_settings[static::ID]['deployment'])
                )
            ) {
                $new_settings[static::ID]['authenticated'] = false;

                add_settings_error(
                    'api_key',
                    'classifai-auth',
                    esc_html__('Please provide Endpoint URL, API Key, and Deployment name for Azure OpenAI Images.', 'classifai'),
                    'error'
                );
            }
        }

        if ($this->feature_instance instanceof ImageGeneration) {
            $new_settings[static::ID]['number_of_images'] = absint($new_settings[static::ID]['number_of_images'] ?? $settings[static::ID]['number_of_images']);

            if (in_array($new_settings[static::ID]['quality'], array_keys(self::get_image_quality_options()), true)) {
                $new_settings[static::ID]['quality'] = sanitize_text_field($new_settings[static::ID]['quality']);
            } else {
                $new_settings[static::ID]['quality'] = $settings[static::ID]['quality'];
            }

            if (in_array($new_settings[static::ID]['image_size'], array_keys(self::get_image_size_options()), true)) {
                $new_settings[static::ID]['image_size'] = sanitize_text_field($new_settings[static::ID]['image_size']);
            } else {
                $new_settings[static::ID]['image_size'] = $settings[static::ID]['image_size'];
            }
        }

        return $new_settings;
    }

    /**
     * Build and return the API endpoint based on settings.
     *
     * @return string
     */
    protected function prep_api_url(): string
    {
        $feature = new ImageGeneration();
        $settings = $feature->get_settings(static::ID);
        $endpoint = $settings['endpoint_url'] ?? '';
        $deployment = $settings['deployment'] ?? '';

        if (!$endpoint || !$deployment) {
            return '';
        }

        $endpoint = trailingslashit($endpoint) . str_replace('{deployment-id}', $deployment, $this->image_generation_url);
        $endpoint = add_query_arg('api-version', $this->get_api_version(), $endpoint);

        return $endpoint;
    }

    /**
     * Authenticates our credentials.
     *
     * @param string $url Endpoint URL.
     * @param string $api_key Api Key.
     * @param string $deployment Deployment name.
     * @return bool|WP_Error
     */
    protected function authenticate_credentials(string $url, string $api_key, string $deployment)
    {
        $endpoint = trailingslashit($url) . str_replace('{deployment-id}', $deployment, $this->image_generation_url);
        $endpoint = add_query_arg('api-version', $this->get_api_version(), $endpoint);
        $timeout = $this->get_request_timeout();

        $request = safe_wp_remote_post(
            $endpoint,
            [
                'headers' => [
                    'api-key' => $api_key,
                    'Content-Type' => 'application/json',
                ],
                'body' => wp_json_encode(
                    [
                        'prompt' => 'A solid red square',
                        'model' => $this->get_model(),
                        'n' => 1,
                        'quality' => 'low',
                        'size' => '1024x1024',
                    ]
                ),
                'timeout' => $timeout, // phpcs:ignore WordPressVIPMinimum.Performance.RemoteRequestTimeout.timeout_timeout
            ]
        );

        if (is_wp_error($request)) {
            return $request;
        }

        $response = json_decode(wp_remote_retrieve_body($request));

        if (!empty($response->error)) {
            return new WP_Error('auth', $response->error->message);
        }

        return true;
    }

    /**
     * Common entry point for all REST endpoints for this provider.
     *
     * @param string $prompt The prompt used to generate an image.
     * @param string $route_to_call The route we are processing.
     * @param array  $args Optional arguments to pass to the route.
     * @return string|WP_Error
     */
    public function rest_endpoint_callback($prompt = '', string $route_to_call = '', array $args = [])
    {
        $route_to_call = strtolower($route_to_call);
        $return = '';

        switch ($route_to_call) {
            case 'image_gen':
                $return = $this->generate_image($prompt, $args);
                break;
        }

        return $return;
    }

    /**
     * Generate an image using Azure OpenAI DALL·E.
     *
     * @param string $prompt The prompt used to generate an image.
     * @param array  $args Optional arguments passed to endpoint.
     * @return array|WP_Error
     */
    public function generate_image(string $prompt = '', array $args = [])
    {
        if (!$prompt) {
            return new WP_Error('prompt_required', esc_html__('A prompt is required to generate an image.', 'classifai'));
        }

        $image_generation = new ImageGeneration();
        $settings = $image_generation->get_settings(static::ID);
        $args = wp_parse_args(
            array_filter($args),
            [
                'num' => $settings['number_of_images'] ?? 1,
                'quality' => $settings['quality'] ?? 'auto',
                'size' => $settings['image_size'] ?? '1024x1024',
                'format' => 'b64_json',
            ]
        );

        if (!$image_generation->is_feature_enabled()) {
            return new WP_Error('not_enabled', esc_html__('Image generation is disabled or Azure OpenAI authentication failed. Please check your settings.', 'classifai'));
        }

        /**
         * Filter the prompt we will send to Azure OpenAI.
         *
         * @since 3.8.0
         * @hook classifai_azure_openai_dalle_prompt
         *
         * @param string $prompt Prompt we are sending to Azure OpenAI.
         *
         * @return string Prompt.
         */
        $prompt = apply_filters('classifai_azure_openai_dalle_prompt', $prompt);

        $max_prompt_chars = $this->get_max_prompt_chars();

        if (mb_strlen($prompt) > $max_prompt_chars) {
            /* translators: %d is the maximum number of characters allowed in the prompt. */
            return new WP_Error('invalid_param', sprintf(esc_html__('Your image prompt is too long. Please ensure it doesn\'t exceed %d characters.', 'classifai'), $max_prompt_chars));
        }

        $api_url = $this->prep_api_url();

        if (!$api_url) {
            return new WP_Error('invalid_settings', esc_html__('Azure OpenAI endpoint URL and deployment name are required.', 'classifai'));
        }

        $body = [
            'prompt' => sanitize_text_field($prompt),
            'model' => $this->get_model(),
            'n' => absint($args['num']),
            'quality' => sanitize_text_field($args['quality']),
            'size' => sanitize_text_field($args['size']),
        ];

        /**
         * Filter the request body before sending to Azure OpenAI.
         *
         * @since 3.8.0
         * @hook classifai_azure_openai_dalle_request_body
         *
         * @param array $body Request body that will be sent to Azure OpenAI.
         *
         * @return array Request body.
         */
        $body = apply_filters('classifai_azure_openai_dalle_request_body', $body);
        $timeout = $this->get_request_timeout();

        $responses = [];

        $responses[] = safe_wp_remote_post(
            $api_url,
            [
                'headers' => [
                    'api-key' => $settings['api_key'],
                    'Content-Type' => 'application/json',
                ],
                'body' => wp_json_encode($body),
                'timeout' => $timeout, // phpcs:ignore WordPressVIPMinimum.Performance.RemoteRequestTimeout.timeout_timeout
            ]
        );

        $cleaned_responses = [];

        foreach ($responses as $response) {
            if (is_wp_error($response)) {
                return $response;
            }

            $body_content = wp_remote_retrieve_body($response);
            $code = wp_remote_retrieve_response_code($response);
            $json = json_decode($body_content, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                return new WP_Error('invalid_json', esc_html__('Invalid JSON response from Azure OpenAI.', 'classifai'));
            }

            if (!empty($json['error'])) {
                $message = $json['error']['message'] ?? esc_html__('An error occurred', 'classifai');
                return new WP_Error($code, $message);
            }

            if (!empty($json['data'])) {
                foreach ($json['data'] as $data) {
                    if (!empty($data[$args['format']])) {
                        if ('url' === $args['format']) {
                            $cleaned_responses[] = ['url' => esc_url_raw($data[$args['format']])];
                        } else {
                            $cleaned_responses[] = ['url' => $data[$args['format']]];
                        }
                    }
                }
            }
        }

        set_transient('classifai_azure_openai_dalle_latest_response', $cleaned_responses, DAY_IN_SECONDS * 30);

        return $cleaned_responses;
    }

    /**
     * Returns the debug information for the provider settings.
     *
     * @return array
     */
    public function get_debug_information(): array
    {
        $settings = $this->feature_instance->get_settings();
        $provider_settings = $settings[static::ID];
        $debug_info = [];

        if ($this->feature_instance instanceof ImageGeneration) {
            $debug_info[__('Number of images', 'classifai')] = $provider_settings['number_of_images'] ?? 1;
            $debug_info[__('Model', 'classifai')] = $this->get_model();
            $debug_info[__('Quality', 'classifai')] = $provider_settings['quality'] ?? 'auto';
            $debug_info[__('Size', 'classifai')] = $provider_settings['image_size'] ?? '1024x1024';
            $debug_info[__('Latest response:', 'classifai')] = $this->get_formatted_latest_response(get_transient('classifai_azure_openai_dalle_latest_response'));
        }

        return apply_filters(
            'classifai_azure_openai_dalle_debug_information',
            $debug_info,
            $settings,
            $this->feature_instance
        );
    }

    /**
     * Register additional REST arguments for the provider.
     *
     * @param array $args Existing REST arguments.
     * @return array
     */
    public function register_rest_args(array $args = []): array
    {
        $provider_args = [
            'n' => [
                'type' => 'integer',
                'minimum' => 1,
                'maximum' => 10,
                'sanitize_callback' => 'absint',
                'validate_callback' => 'rest_validate_request_arg',
                'description' => esc_html__('Number of images to generate', 'classifai'),
            ],
            'quality' => [
                'type' => 'string',
                'enum' => array_keys(self::get_image_quality_options()),
                'sanitize_callback' => 'sanitize_text_field',
                'validate_callback' => 'rest_validate_request_arg',
                'description' => esc_html__('Quality of generated image', 'classifai'),
            ],
            'size' => [
                'type' => 'string',
                'enum' => array_keys(self::get_image_size_options()),
                'sanitize_callback' => 'sanitize_text_field',
                'validate_callback' => 'rest_validate_request_arg',
                'description' => esc_html__('Size of generated image', 'classifai'),
            ],
            'format' => [
                'type' => 'string',
                'enum' => [
                    'url',
                    'b64_json',
                ],
                'sanitize_callback' => 'sanitize_text_field',
                'validate_callback' => 'rest_validate_request_arg',
                'description' => esc_html__('Format of generated image', 'classifai'),
            ],
        ];

        $args['args'] = array_merge($args['args'], $provider_args);

        return $args;
    }
}
