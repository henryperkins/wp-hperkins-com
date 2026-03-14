// packages/editor/src/components/global-styles-renderer/index.js
import { useEffect } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as editorStore } from "../../store/index.mjs";
import { useGlobalStylesOutput } from "../../hooks/use-global-styles-output.mjs";
function useGlobalStylesRenderer(disableRootPadding) {
  const [styles, settings] = useGlobalStylesOutput(disableRootPadding);
  const { getEditorSettings } = useSelect(editorStore);
  const { updateEditorSettings } = useDispatch(editorStore);
  useEffect(() => {
    if (!styles || !settings) {
      return;
    }
    const currentStoreSettings = getEditorSettings();
    const nonGlobalStyles = Object.values(
      currentStoreSettings.styles ?? []
    ).filter((style) => !style.isGlobalStyles);
    updateEditorSettings({
      ...currentStoreSettings,
      styles: [...nonGlobalStyles, ...styles],
      __experimentalFeatures: settings
    });
  }, [styles, settings, updateEditorSettings, getEditorSettings]);
}
function GlobalStylesRenderer({ disableRootPadding }) {
  useGlobalStylesRenderer(disableRootPadding);
  return null;
}
export {
  GlobalStylesRenderer
};
//# sourceMappingURL=index.mjs.map
