/**
 * This is a React hook that provides the editor settings from the REST API.
 *
 * @param {Object} props            - The props object.
 * @param {string} [props.stylesId] - The ID of the user's global styles to use.
 * @return Editor settings.
 */
export declare function useEditorSettings({ stylesId }: {
    stylesId: string;
}): {
    isReady: boolean;
    editorSettings: any;
};
//# sourceMappingURL=use-editor-settings.d.ts.map