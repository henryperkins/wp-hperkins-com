// packages/editor/src/components/collaborators-overlay/index.tsx
import { privateApis } from "@wordpress/block-editor";
import { unlock } from "../../lock-unlock.mjs";
import { Overlay } from "./overlay.mjs";
import { jsx } from "react/jsx-runtime";
var { BlockCanvasCover } = unlock(privateApis);
function CollaboratorsOverlay({ postId, postType }) {
  return /* @__PURE__ */ jsx(BlockCanvasCover.Fill, { children: ({
    containerRef
  }) => /* @__PURE__ */ jsx(
    Overlay,
    {
      blockEditorDocument: containerRef.current?.ownerDocument,
      postId,
      postType
    }
  ) });
}
export {
  CollaboratorsOverlay
};
//# sourceMappingURL=index.mjs.map
