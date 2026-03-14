// packages/editor/src/hooks/use-global-styles-output.js
import { getBlockTypes, store as blocksStore } from "@wordpress/blocks";
import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { generateGlobalStyles } from "@wordpress/global-styles-engine";
import { store as editorStore } from "../store/index.mjs";
import { useSetting, useGlobalStyles } from "../components/global-styles/index.mjs";
function useGlobalStylesOutputWithConfig(mergedConfig = {}, disableRootPadding = false) {
  const blockGap = useSetting("spacing.blockGap");
  const hasBlockGapSupport = blockGap !== null;
  const hasFallbackGapSupport = !hasBlockGapSupport;
  const { disableLayoutStyles, getBlockStyles } = useSelect((select) => {
    const { getEditorSettings } = select(editorStore);
    const { getBlockStyles: getBlockStylesSelector } = select(blocksStore);
    const settings = getEditorSettings();
    return {
      disableLayoutStyles: !!settings?.disableLayoutStyles,
      getBlockStyles: getBlockStylesSelector
    };
  }, []);
  return useMemo(() => {
    if (!mergedConfig?.styles || !mergedConfig?.settings) {
      return [[], {}];
    }
    const blockTypes = getBlockTypes();
    return generateGlobalStyles(mergedConfig, blockTypes, {
      hasBlockGapSupport,
      hasFallbackGapSupport,
      disableLayoutStyles,
      disableRootPadding,
      getBlockStyles
    });
  }, [
    hasBlockGapSupport,
    hasFallbackGapSupport,
    mergedConfig,
    disableLayoutStyles,
    disableRootPadding,
    getBlockStyles
  ]);
}
function useGlobalStylesOutput(disableRootPadding = false) {
  const { merged: mergedConfig } = useGlobalStyles();
  return useGlobalStylesOutputWithConfig(mergedConfig, disableRootPadding);
}
export {
  useGlobalStylesOutput,
  useGlobalStylesOutputWithConfig
};
//# sourceMappingURL=use-global-styles-output.mjs.map
