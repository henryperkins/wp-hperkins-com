"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/collaborators-overlay/index.tsx
var collaborators_overlay_exports = {};
__export(collaborators_overlay_exports, {
  CollaboratorsOverlay: () => CollaboratorsOverlay
});
module.exports = __toCommonJS(collaborators_overlay_exports);
var import_block_editor = require("@wordpress/block-editor");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_overlay = require("./overlay.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { BlockCanvasCover } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
function CollaboratorsOverlay({ postId, postType }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockCanvasCover.Fill, { children: ({
    containerRef
  }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_overlay.Overlay,
    {
      blockEditorDocument: containerRef.current?.ownerDocument,
      postId,
      postType
    }
  ) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CollaboratorsOverlay
});
//# sourceMappingURL=index.cjs.map
