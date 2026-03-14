// packages/edit-site/src/components/block-editor/use-site-editor-settings.js
import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { usePrevious } from "@wordpress/compose";
import {
  store as editorStore,
  privateApis as editorPrivateApis
} from "@wordpress/editor";
import { generateGlobalStyles } from "@wordpress/global-styles-engine";
import { store as editSiteStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import useNavigateToEntityRecord from "./use-navigate-to-entity-record.mjs";
import { FOCUSABLE_ENTITIES } from "../../utils/constants.mjs";
var { useLocation, useHistory } = unlock(routerPrivateApis);
var { useGlobalStyles } = unlock(editorPrivateApis);
function useNavigateToPreviousEntityRecord() {
  const location = useLocation();
  const previousCanvas = usePrevious(location.query.canvas);
  const history = useHistory();
  const goBack = useMemo(() => {
    const isFocusMode = location.query.focusMode || location?.params?.postId && FOCUSABLE_ENTITIES.includes(location?.params?.postType);
    const didComeFromEditorCanvas = previousCanvas === "edit";
    const showBackButton = isFocusMode && didComeFromEditorCanvas;
    return showBackButton ? () => history.back() : void 0;
  }, [location, history, previousCanvas]);
  return goBack;
}
function useSpecificEditorSettings() {
  const { query } = useLocation();
  const { canvas = "view" } = query;
  const onNavigateToEntityRecord = useNavigateToEntityRecord();
  const { merged: mergedConfig } = useGlobalStyles();
  const { settings, currentPostIsTrashed } = useSelect((select) => {
    const { getSettings } = select(editSiteStore);
    const { getCurrentPostAttribute } = select(editorStore);
    return {
      settings: getSettings(),
      currentPostIsTrashed: getCurrentPostAttribute("status") === "trash"
    };
  }, []);
  const onNavigateToPreviousEntityRecord = useNavigateToPreviousEntityRecord();
  const [globalStyles, globalSettings] = useMemo(() => {
    return generateGlobalStyles(mergedConfig, [], {
      disableRootPadding: false
    });
  }, [mergedConfig]);
  const defaultEditorSettings = useMemo(() => {
    const nonGlobalStyles = (settings?.styles ?? []).filter(
      (style) => !style.isGlobalStyles
    );
    return {
      ...settings,
      styles: [
        ...nonGlobalStyles,
        ...globalStyles,
        {
          // Forming a "block formatting context" to prevent margin collapsing.
          // @see https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context
          css: canvas === "view" ? `body{min-height: 100vh; ${currentPostIsTrashed ? "" : "cursor: pointer;"}}` : void 0
        }
      ],
      __experimentalFeatures: globalSettings,
      richEditingEnabled: true,
      supportsTemplateMode: true,
      focusMode: canvas !== "view",
      onNavigateToEntityRecord,
      onNavigateToPreviousEntityRecord,
      isPreviewMode: canvas === "view"
    };
  }, [
    settings,
    globalStyles,
    globalSettings,
    canvas,
    currentPostIsTrashed,
    onNavigateToEntityRecord,
    onNavigateToPreviousEntityRecord
  ]);
  return defaultEditorSettings;
}
export {
  useSpecificEditorSettings
};
//# sourceMappingURL=use-site-editor-settings.mjs.map
