// packages/editor/src/components/pattern-overrides-panel/index.js
import { useSelect } from "@wordpress/data";
import { privateApis as patternsPrivateApis } from "@wordpress/patterns";
import { store as editorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var { OverridesPanel } = unlock(patternsPrivateApis);
function PatternOverridesPanel() {
  const supportsPatternOverridesPanel = useSelect(
    (select) => select(editorStore).getCurrentPostType() === "wp_block",
    []
  );
  if (!supportsPatternOverridesPanel) {
    return null;
  }
  return /* @__PURE__ */ jsx(OverridesPanel, {});
}
export {
  PatternOverridesPanel as default
};
//# sourceMappingURL=index.mjs.map
