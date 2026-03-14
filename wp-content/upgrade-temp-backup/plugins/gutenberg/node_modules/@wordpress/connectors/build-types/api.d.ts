import type { ConnectorConfig } from './types';
/**
 * Register a connector that will appear in the Connectors settings page.
 *
 * @param slug   Unique identifier for the connector.
 * @param config Connector configuration.
 *
 * @example
 * ```js
 * import { __experimentalRegisterConnector as registerConnector, __experimentalConnectorItem as ConnectorItem } from '@wordpress/connectors';
 *
 * registerConnector( 'my-plugin/openai', {
 *     label: 'OpenAI',
 *     description: 'Text, image, and code generation with GPT.',
 *     icon: <MyOpenAIIcon />,
 *     render: ( { slug, label, description } ) => (
 *         <ConnectorItem
 *             icon={ <MyOpenAIIcon /> }
 *             name={ label }
 *             description={ description }
 *         >
 *             <MyCustomSettings />
 *         </ConnectorItem>
 *     ),
 * } );
 * ```
 */
export declare function registerConnector(slug: string, config: Omit<ConnectorConfig, 'slug'>): void;
//# sourceMappingURL=api.d.ts.map