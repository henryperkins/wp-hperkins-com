// packages/edit-site/src/components/page-patterns/use-pattern-settings.js
import { store as coreStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { privateApis as blockEditorPrivateApis } from "@wordpress/block-editor";
import { privateApis as editorPrivateApis } from "@wordpress/editor";
import { generateGlobalStyles } from "@wordpress/global-styles-engine";
import { unlock } from "../../lock-unlock.mjs";
import { store as editSiteStore } from "../../store/index.mjs";
import { filterOutDuplicatesByName } from "./utils.mjs";
var { useGlobalStyles } = unlock(editorPrivateApis);
var { globalStylesDataKey } = unlock(blockEditorPrivateApis);
function usePatternSettings() {
  const { merged: mergedConfig } = useGlobalStyles();
  const storedSettings = useSelect((select) => {
    const { getSettings } = unlock(select(editSiteStore));
    return getSettings();
  }, []);
  const settingsBlockPatterns = storedSettings.__experimentalAdditionalBlockPatterns ?? // WP 6.0
  storedSettings.__experimentalBlockPatterns;
  const restBlockPatterns = useSelect(
    (select) => select(coreStore).getBlockPatterns(),
    []
  );
  const blockPatterns = useMemo(
    () => [
      ...settingsBlockPatterns || [],
      ...restBlockPatterns || []
    ].filter(filterOutDuplicatesByName),
    [settingsBlockPatterns, restBlockPatterns]
  );
  const [globalStyles, globalSettings] = useMemo(() => {
    return generateGlobalStyles(mergedConfig, [], {
      disableRootPadding: false
    });
  }, [mergedConfig]);
  const settings = useMemo(() => {
    const {
      __experimentalAdditionalBlockPatterns,
      styles,
      __experimentalFeatures,
      ...restStoredSettings
    } = storedSettings;
    return {
      ...restStoredSettings,
      styles: globalStyles,
      __experimentalFeatures: globalSettings,
      [globalStylesDataKey]: mergedConfig.styles ?? {},
      __experimentalBlockPatterns: blockPatterns,
      isPreviewMode: true
    };
  }, [
    storedSettings,
    blockPatterns,
    globalStyles,
    globalSettings,
    mergedConfig
  ]);
  return settings;
}
export {
  usePatternSettings as default
};
//# sourceMappingURL=use-pattern-settings.mjs.map
