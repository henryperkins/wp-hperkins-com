// packages/lazy-editor/src/components/preview/index.tsx
import { __ } from "@wordpress/i18n";
import { useId, useMemo } from "@wordpress/element";
import { BlockPreview, BlockEditorProvider } from "@wordpress/block-editor";
import { privateApis as editorPrivateApis } from "@wordpress/editor";
import { parse } from "@wordpress/blocks";

// packages/lazy-editor/src/components/preview/style.scss
if (typeof document !== "undefined" && process.env.NODE_ENV !== "test" && !document.head.querySelector("style[data-wp-hash='5619aa31a1']")) {
  const style = document.createElement("style");
  style.setAttribute("data-wp-hash", "5619aa31a1");
  style.appendChild(document.createTextNode(".lazy-editor-block-preview__container{align-items:center;border-radius:4px;display:flex;flex-direction:column;height:100%;justify-content:center}.dataviews-view-grid .lazy-editor-block-preview__container .block-editor-block-preview__container{height:100%}.dataviews-view-table .lazy-editor-block-preview__container{text-wrap:balance;text-wrap:pretty;flex-grow:0;width:96px}"));
  document.head.appendChild(style);
}

// packages/lazy-editor/src/components/preview/index.tsx
import { unlock } from "../../lock-unlock.mjs";
import { useEditorAssets } from "../../hooks/use-editor-assets.mjs";
import { useEditorSettings } from "../../hooks/use-editor-settings.mjs";
import { useStylesId } from "../../hooks/use-styles-id.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { useStyle } = unlock(editorPrivateApis);
function PreviewContent({
  blocks,
  content,
  description
}) {
  const descriptionId = useId();
  const backgroundColor = useStyle("color.background");
  const actualBlocks = useMemo(() => {
    return blocks ?? parse(content, {
      __unstableSkipMigrationLogs: true
    });
  }, [content, blocks]);
  const isEmpty = !actualBlocks?.length;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "lazy-editor-block-preview__container",
      style: { backgroundColor },
      "aria-describedby": !!description ? descriptionId : void 0,
      children: [
        isEmpty && __("Empty."),
        !isEmpty && /* @__PURE__ */ jsx(BlockPreview.Async, { children: /* @__PURE__ */ jsx(BlockPreview, { blocks: actualBlocks }) }),
        !!description && /* @__PURE__ */ jsx("div", { hidden: true, id: descriptionId, children: description })
      ]
    }
  );
}
function Preview({
  blocks,
  content,
  description
}) {
  const stylesId = useStylesId();
  const { isReady: settingsReady, editorSettings } = useEditorSettings({
    stylesId
  });
  const { isReady: assetsReady } = useEditorAssets();
  const finalSettings = useMemo(
    () => ({
      ...editorSettings,
      isPreviewMode: true
    }),
    [editorSettings]
  );
  if (!settingsReady || !assetsReady) {
    return null;
  }
  return /* @__PURE__ */ jsx(BlockEditorProvider, { settings: finalSettings, children: /* @__PURE__ */ jsx(
    PreviewContent,
    {
      blocks,
      content,
      description
    }
  ) });
}
export {
  Preview
};
//# sourceMappingURL=index.mjs.map
