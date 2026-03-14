/**
 * Component which merges passed value with current consumed block context.
 *
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/block-context/README.md
 *
 * @param {BlockContextProviderProps} props
 */
export function BlockContextProvider({ value, children }: BlockContextProviderProps): import("react").JSX.Element;
export default Context;
export type ReactNode = React.ReactNode;
export type BlockContextProviderProps = {
    /**
     * Context value to merge with current
     * value.
     */
    value: Record<string, any>;
    /**
     * Component children.
     */
    children: ReactNode;
};
/** @typedef {React.ReactNode} ReactNode */
/**
 * @typedef BlockContextProviderProps
 *
 * @property {Record<string,*>} value    Context value to merge with current
 *                                       value.
 * @property {ReactNode}        children Component children.
 */
/** @type {React.Context<Record<string,*>>} */
declare const Context: React.Context<Record<string, any>>;
//# sourceMappingURL=index.d.ts.map