interface BlockStyle {
    name: string;
    label: string;
    source?: string;
    isDefault?: boolean;
}
interface VariationsPanelProps {
    name: string;
}
export declare function useBlockVariations(name: string): BlockStyle[];
export declare function VariationsPanel({ name }: VariationsPanelProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=variations-panel.d.ts.map