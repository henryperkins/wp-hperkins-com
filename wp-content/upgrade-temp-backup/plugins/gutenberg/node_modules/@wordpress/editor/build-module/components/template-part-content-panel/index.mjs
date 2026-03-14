// packages/editor/src/components/template-part-content-panel/index.js
import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { store as blocksStore } from "@wordpress/blocks";
import {
  store as blockEditorStore,
  privateApis as blockEditorPrivateApis
} from "@wordpress/block-editor";
import { PanelBody } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { unlock } from "../../lock-unlock.mjs";
import { TEMPLATE_PART_POST_TYPE } from "../../store/constants.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
var { BlockQuickNavigation } = unlock(blockEditorPrivateApis);
function TemplatePartContentPanelInner() {
  const blockTypes = useSelect((select) => {
    const { getBlockTypes } = select(blocksStore);
    return getBlockTypes();
  }, []);
  const themeBlockNames = useMemo(() => {
    return blockTypes.filter((blockType) => {
      return blockType.category === "theme";
    }).map(({ name }) => name);
  }, [blockTypes]);
  const themeBlocks = useSelect(
    (select) => {
      const { getBlocksByName } = select(blockEditorStore);
      return getBlocksByName(themeBlockNames);
    },
    [themeBlockNames]
  );
  if (themeBlocks.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsx(PanelBody, { title: __("Content"), children: /* @__PURE__ */ jsx(BlockQuickNavigation, { clientIds: themeBlocks }) });
}
function TemplatePartContentPanel() {
  const postType = useSelect((select) => {
    const { getCurrentPostType } = select(editorStore);
    return getCurrentPostType();
  }, []);
  if (postType !== TEMPLATE_PART_POST_TYPE) {
    return null;
  }
  return /* @__PURE__ */ jsx(TemplatePartContentPanelInner, {});
}
export {
  TemplatePartContentPanel as default
};
//# sourceMappingURL=index.mjs.map
