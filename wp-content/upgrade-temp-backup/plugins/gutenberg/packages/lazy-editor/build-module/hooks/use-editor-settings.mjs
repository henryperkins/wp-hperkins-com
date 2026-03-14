// packages/lazy-editor/src/hooks/use-editor-settings.tsx
import { generateGlobalStyles } from "@wordpress/global-styles-engine";
import { store as coreDataStore } from "@wordpress/core-data";
import { useMemo } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { useUserGlobalStyles } from "./use-global-styles.mjs";
import { unlock } from "../lock-unlock.mjs";
function useEditorSettings({ stylesId }) {
  const { editorSettings } = useSelect(
    (select) => ({
      editorSettings: unlock(
        select(coreDataStore)
      ).getEditorSettings()
    }),
    []
  );
  const { user: globalStyles } = useUserGlobalStyles(stylesId);
  const [globalStylesCSS] = generateGlobalStyles(globalStyles);
  const hasEditorSettings = !!editorSettings;
  const styles = useMemo(() => {
    if (!hasEditorSettings) {
      return [];
    }
    return [
      ...editorSettings?.styles ?? [],
      ...globalStylesCSS
    ];
  }, [hasEditorSettings, editorSettings?.styles, globalStylesCSS]);
  return {
    isReady: hasEditorSettings,
    editorSettings: useMemo(
      () => ({
        ...editorSettings ?? {},
        styles
      }),
      [editorSettings, styles]
    )
  };
}
export {
  useEditorSettings
};
//# sourceMappingURL=use-editor-settings.mjs.map
