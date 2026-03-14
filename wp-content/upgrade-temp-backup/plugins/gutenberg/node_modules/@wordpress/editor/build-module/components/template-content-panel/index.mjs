// packages/editor/src/components/template-content-panel/index.js
import { useSelect, useDispatch } from "@wordpress/data";
import { privateApis as blockEditorPrivateApis } from "@wordpress/block-editor";
import { PanelBody } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { store as interfaceStore } from "@wordpress/interface";
import { applyFilters } from "@wordpress/hooks";
import { useMemo } from "@wordpress/element";
import { unlock } from "../../lock-unlock.mjs";
import { TEMPLATE_POST_TYPE } from "../../store/constants.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
var { BlockQuickNavigation } = unlock(blockEditorPrivateApis);
var POST_CONTENT_BLOCK_TYPES = [
  "core/post-title",
  "core/post-featured-image",
  "core/post-content"
];
var TEMPLATE_PART_BLOCK = "core/template-part";
function TemplateContentPanel() {
  const postContentBlockTypes = useMemo(
    () => applyFilters(
      "editor.postContentBlockTypes",
      POST_CONTENT_BLOCK_TYPES
    ),
    []
  );
  const { clientIds, postType, renderingMode } = useSelect(
    (select) => {
      const {
        getCurrentPostType,
        getPostBlocksByName,
        getRenderingMode
      } = unlock(select(editorStore));
      const _postType = getCurrentPostType();
      return {
        postType: _postType,
        clientIds: getPostBlocksByName(
          TEMPLATE_POST_TYPE === _postType ? TEMPLATE_PART_BLOCK : postContentBlockTypes
        ),
        renderingMode: getRenderingMode()
      };
    },
    [postContentBlockTypes]
  );
  const { enableComplementaryArea } = useDispatch(interfaceStore);
  if (renderingMode === "post-only" && postType !== TEMPLATE_POST_TYPE || clientIds.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsx(PanelBody, { title: __("Content"), children: /* @__PURE__ */ jsx(
    BlockQuickNavigation,
    {
      clientIds,
      onSelect: () => {
        enableComplementaryArea("core", "edit-post/document");
      }
    }
  ) });
}
export {
  TemplateContentPanel as default
};
//# sourceMappingURL=index.mjs.map
