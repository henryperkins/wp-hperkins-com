// packages/edit-widgets/src/components/widget-areas-block-editor-content/index.js
import {
  BlockList,
  BlockToolbar,
  BlockTools,
  BlockSelectionClearer,
  WritingFlow,
  __unstableEditorStyles as EditorStyles
} from "@wordpress/block-editor";
import { useViewportMatch } from "@wordpress/compose";
import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { store as preferencesStore } from "@wordpress/preferences";
import Notices from "../notices/index.mjs";
import KeyboardShortcuts from "../keyboard-shortcuts/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function WidgetAreasBlockEditorContent({
  blockEditorSettings
}) {
  const hasThemeStyles = useSelect(
    (select) => !!select(preferencesStore).get(
      "core/edit-widgets",
      "themeStyles"
    ),
    []
  );
  const isLargeViewport = useViewportMatch("medium");
  const styles = useMemo(() => {
    return hasThemeStyles ? blockEditorSettings.styles : [];
  }, [blockEditorSettings, hasThemeStyles]);
  return /* @__PURE__ */ jsxs("div", { className: "edit-widgets-block-editor", children: [
    /* @__PURE__ */ jsx(Notices, {}),
    !isLargeViewport && /* @__PURE__ */ jsx(BlockToolbar, { hideDragHandle: true }),
    /* @__PURE__ */ jsxs(BlockTools, { children: [
      /* @__PURE__ */ jsx(KeyboardShortcuts, {}),
      /* @__PURE__ */ jsx(
        EditorStyles,
        {
          styles,
          scope: ":where(.editor-styles-wrapper)"
        }
      ),
      /* @__PURE__ */ jsx(BlockSelectionClearer, { children: /* @__PURE__ */ jsx(WritingFlow, { children: /* @__PURE__ */ jsx(BlockList, { className: "edit-widgets-main-block-list" }) }) })
    ] })
  ] });
}
export {
  WidgetAreasBlockEditorContent as default
};
//# sourceMappingURL=index.mjs.map
