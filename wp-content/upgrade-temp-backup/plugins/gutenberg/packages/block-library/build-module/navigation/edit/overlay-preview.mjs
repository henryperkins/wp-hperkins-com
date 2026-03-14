// packages/block-library/src/navigation/edit/overlay-preview.js
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { useMemo } from "@wordpress/element";
import { parse } from "@wordpress/blocks";
import { Spinner } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { BlockPreview } from "@wordpress/block-editor";
import { createTemplatePartId } from "../../template-part/edit/utils/create-template-part-id.mjs";
import { jsx } from "react/jsx-runtime";
function OverlayPreview({ overlay, currentTheme }) {
  const templatePartId = useMemo(() => {
    if (!overlay || !currentTheme) {
      return null;
    }
    return createTemplatePartId(currentTheme, overlay);
  }, [currentTheme, overlay]);
  const { content, editedBlocks, hasResolved } = useSelect(
    (select) => {
      if (!templatePartId) {
        return {
          content: null,
          editedBlocks: null,
          hasResolved: true
        };
      }
      const { getEditedEntityRecord, hasFinishedResolution } = select(coreStore);
      const editedRecord = getEditedEntityRecord(
        "postType",
        "wp_template_part",
        templatePartId,
        { context: "view" }
      );
      return {
        content: editedRecord?.content,
        editedBlocks: editedRecord?.blocks,
        hasResolved: hasFinishedResolution("getEditedEntityRecord", [
          "postType",
          "wp_template_part",
          templatePartId,
          { context: "view" }
        ])
      };
    },
    [templatePartId]
  );
  const blocks = useMemo(() => {
    if (!templatePartId) {
      return null;
    }
    if (editedBlocks && editedBlocks.length > 0) {
      return editedBlocks;
    }
    if (content && typeof content === "string") {
      return parse(content);
    }
    return [];
  }, [templatePartId, editedBlocks, content]);
  if (!overlay) {
    return null;
  }
  if (!hasResolved) {
    return /* @__PURE__ */ jsx("div", { className: "wp-block-navigation__overlay-preview-loading", children: /* @__PURE__ */ jsx(Spinner, {}) });
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "wp-block-navigation__overlay-preview",
      "aria-label": __("Navigation Overlay template part preview"),
      role: "region",
      children: /* @__PURE__ */ jsx(
        BlockPreview.Async,
        {
          placeholder: /* @__PURE__ */ jsx("div", { className: "wp-block-navigation__overlay-preview-placeholder" }),
          children: /* @__PURE__ */ jsx(
            BlockPreview,
            {
              blocks,
              viewportWidth: 400,
              minHeight: 200
            }
          )
        }
      )
    }
  );
}
export {
  OverlayPreview as default
};
//# sourceMappingURL=overlay-preview.mjs.map
