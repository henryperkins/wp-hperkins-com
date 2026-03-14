interface VariationProps {
    variation: any;
    children: (isFocused: boolean) => React.ReactNode;
    isPill?: boolean;
    properties?: string[];
    showTooltip?: boolean;
}
export default function Variation({ variation, children, isPill, properties, showTooltip, }: VariationProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=variation.d.ts.map