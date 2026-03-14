// packages/editor/src/components/template-part-menu-items/index.js
import { useSelect } from "@wordpress/data";
import {
  BlockSettingsMenuControls,
  store as blockEditorStore
} from "@wordpress/block-editor";
import ConvertToRegularBlocks from "./convert-to-regular.mjs";
import ConvertToTemplatePart from "./convert-to-template-part.mjs";
import { jsx } from "react/jsx-runtime";
function TemplatePartMenuItems() {
  return /* @__PURE__ */ jsx(BlockSettingsMenuControls, { children: ({ selectedClientIds, onClose }) => /* @__PURE__ */ jsx(
    TemplatePartConverterMenuItem,
    {
      clientIds: selectedClientIds,
      onClose
    }
  ) });
}
function TemplatePartConverterMenuItem({ clientIds, onClose }) {
  const { blocks } = useSelect(
    (select) => {
      const { getBlocksByClientId } = select(blockEditorStore);
      return {
        blocks: getBlocksByClientId(clientIds)
      };
    },
    [clientIds]
  );
  if (blocks.length === 1 && blocks[0]?.name === "core/template-part") {
    return /* @__PURE__ */ jsx(
      ConvertToRegularBlocks,
      {
        clientId: clientIds[0],
        onClose
      }
    );
  }
  return /* @__PURE__ */ jsx(ConvertToTemplatePart, { clientIds, blocks });
}
export {
  TemplatePartMenuItems as default
};
//# sourceMappingURL=index.mjs.map
