/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
/**
 * Internal dependencies
 */
import type { PluginErrorBoundaryProps as Props, PluginErrorBoundaryState as State } from '../../types';
export declare class PluginErrorBoundary extends Component<Props, State> {
    constructor(props: Props);
    static getDerivedStateFromError(): State;
    componentDidCatch(error: Error): void;
    render(): React.ReactNode;
}
//# sourceMappingURL=index.d.ts.map