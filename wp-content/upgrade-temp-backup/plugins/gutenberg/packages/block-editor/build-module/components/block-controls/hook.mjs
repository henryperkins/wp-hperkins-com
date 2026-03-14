// packages/block-editor/src/components/block-controls/hook.js
import groups from "./groups.mjs";
import {
  useBlockEditContext,
  mayDisplayControlsKey,
  mayDisplayParentControlsKey
} from "../block-edit/context.mjs";
function useBlockControlsFill(group, shareWithChildBlocks) {
  const context = useBlockEditContext();
  if (context[mayDisplayControlsKey]) {
    return groups[group]?.Fill;
  }
  if (context[mayDisplayParentControlsKey] && shareWithChildBlocks) {
    return groups.parent.Fill;
  }
  return null;
}
export {
  useBlockControlsFill as default
};
//# sourceMappingURL=hook.mjs.map
