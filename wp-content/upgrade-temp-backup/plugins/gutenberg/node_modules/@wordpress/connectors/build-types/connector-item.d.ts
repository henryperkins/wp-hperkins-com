/**
 * Internal dependencies
 */
import type { ReactNode } from 'react';
export interface ConnectorItemProps {
    className?: string;
    icon?: ReactNode;
    name: string;
    description: string;
    actionArea?: ReactNode;
    children?: ReactNode;
}
export declare function ConnectorItem({ className, icon, name, description, actionArea, children, }: ConnectorItemProps): import("react").JSX.Element;
export interface DefaultConnectorSettingsProps {
    onSave?: (apiKey: string) => void | Promise<void>;
    onRemove?: () => void;
    initialValue?: string;
    helpUrl?: string;
    helpLabel?: string;
    readOnly?: boolean;
}
/**
 * Default settings form for connectors.
 *
 * @param props              - Component props.
 * @param props.onSave       - Callback invoked with the API key when the user saves.
 * @param props.onRemove     - Callback invoked when the user removes the connector.
 * @param props.initialValue - Initial value for the API key field.
 * @param props.helpUrl      - URL to documentation for obtaining an API key.
 * @param props.helpLabel    - Custom label for the help link. Defaults to the URL without protocol.
 * @param props.readOnly     - Whether the form is in read-only mode.
 */
export declare function DefaultConnectorSettings({ onSave, onRemove, initialValue, helpUrl, helpLabel, readOnly, }: DefaultConnectorSettingsProps): import("react").JSX.Element;
//# sourceMappingURL=connector-item.d.ts.map