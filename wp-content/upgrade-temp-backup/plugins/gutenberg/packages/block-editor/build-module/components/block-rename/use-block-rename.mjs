// packages/block-editor/src/components/block-rename/use-block-rename.js
import { getBlockSupport } from "@wordpress/blocks";
function useBlockRename(name) {
  return {
    canRename: !!name && getBlockSupport(name, "renaming", true)
  };
}
export {
  useBlockRename as default
};
//# sourceMappingURL=use-block-rename.mjs.map
