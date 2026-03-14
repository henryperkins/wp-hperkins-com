type Style = {
    src: string;
    deps?: string[];
    version?: string;
    media?: string;
};
type InlineStyle = string | string[];
type Script = {
    src: string;
    deps?: string[];
    version?: string;
    in_footer?: boolean;
};
type InlineScript = string | string[];
type ScriptModules = Record<string, string>;
declare function loadAssets(scriptsData: Record<string, Script>, inlineScripts: Record<'before' | 'after', Record<string, InlineScript>>, stylesData: Record<string, Style>, inlineStyles: Record<'before' | 'after', Record<string, InlineStyle>>, htmlTemplates?: string[], scriptModules?: ScriptModules): Promise<void>;
export default loadAssets;
//# sourceMappingURL=index.d.ts.map