// packages/customize-widgets/src/components/sidebar-block-editor/sidebar-editor-provider.js
import { privateApis as blockEditorPrivateApis } from "@wordpress/block-editor";
import useSidebarBlockEditor from "./use-sidebar-block-editor.mjs";
import useBlocksFocusControl from "../focus-control/use-blocks-focus-control.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var { ExperimentalBlockEditorProvider } = unlock(blockEditorPrivateApis);
function SidebarEditorProvider({
  sidebar,
  settings,
  children
}) {
  const [blocks, onInput, onChange] = useSidebarBlockEditor(sidebar);
  useBlocksFocusControl(blocks);
  return /* @__PURE__ */ jsx(
    ExperimentalBlockEditorProvider,
    {
      value: blocks,
      onInput,
      onChange,
      settings,
      useSubRegistry: false,
      children
    }
  );
}
export {
  SidebarEditorProvider as default
};
//# sourceMappingURL=sidebar-editor-provider.mjs.map
