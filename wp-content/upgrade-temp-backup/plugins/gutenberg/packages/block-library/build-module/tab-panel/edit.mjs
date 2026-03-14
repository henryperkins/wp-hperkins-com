// packages/block-library/src/tab-panel/edit.js
import {
  useBlockProps,
  useInnerBlocksProps,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import AddTabToolbarControl from "../tab/add-tab-toolbar-control.mjs";
import RemoveTabToolbarControl from "../tab/remove-tab-toolbar-control.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var TAB_PANELS_TEMPLATE = [["core/tab", {}]];
function Edit({ clientId }) {
  const blockProps = useBlockProps();
  const innerBlocksProps = useInnerBlocksProps(blockProps, {
    template: TAB_PANELS_TEMPLATE,
    templateLock: false,
    renderAppender: false
    // Appender handled by individual tab blocks
  });
  const tabsClientId = useSelect(
    (select) => {
      const { getBlockRootClientId } = select(blockEditorStore);
      return getBlockRootClientId(clientId);
    },
    [clientId]
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(AddTabToolbarControl, { tabsClientId }),
    /* @__PURE__ */ jsx(RemoveTabToolbarControl, { tabsClientId }),
    /* @__PURE__ */ jsx("div", { ...innerBlocksProps })
  ] });
}
export {
  Edit as default
};
//# sourceMappingURL=edit.mjs.map
