interface PreviewWrapperProps {
    children: ((args: {
        ratio: number;
        key: number;
    }) => React.ReactNode) | ((args: {
        ratio: number;
        key: number;
    }) => React.ReactNode)[];
    label?: string;
    isFocused?: boolean;
    withHoverView?: boolean;
}
declare function PreviewWrapper({ children, label, isFocused, withHoverView, }: PreviewWrapperProps): import("react").JSX.Element;
export default PreviewWrapper;
//# sourceMappingURL=preview-wrapper.d.ts.map