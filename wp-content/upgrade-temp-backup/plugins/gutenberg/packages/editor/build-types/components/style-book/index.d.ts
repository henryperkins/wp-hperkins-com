/**
 * Get deduped examples for single page stylebook.
 * @param {Array} examples Array of examples.
 * @return {Array} Deduped examples.
 */
export function getExamplesForSinglePageUse(examples: any[]): any[];
export function StyleBookPreview({ userConfig, isStatic, path, onPathChange, }: {
    path: string;
    onPathChange: Function;
    userConfig: Object;
    isStatic: boolean;
}): Object;
export function StyleBookBody({ examples, isSelected, onClick, onSelect, settings, title, goTo, }: {
    examples: any;
    isSelected: any;
    onClick: any;
    onSelect: any;
    settings: any;
    title: any;
    goTo: any;
}): import("react").JSX.Element;
declare const _default: import("react").ForwardRefExoticComponent<{
    isSelected: any;
    onClick: any;
    onSelect: any;
    showTabs?: boolean | undefined;
    userConfig?: {} | undefined;
    path?: string | undefined;
} & import("react").RefAttributes<any>>;
export default _default;
//# sourceMappingURL=index.d.ts.map