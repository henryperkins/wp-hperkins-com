/**
 * Wrapper component that renders its children only if the post type supports page attributes.
 *
 * @param {Object}          props          - The component props.
 * @param {React.ReactNode} props.children - The child components to render.
 *
 * @return {React.ReactNode} The rendered child components or null if page attributes are not supported.
 */
export function PageAttributesCheck({ children }: {
    children: React.ReactNode;
}): React.ReactNode;
export default PageAttributesCheck;
//# sourceMappingURL=check.d.ts.map