"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/editor-notices/index.js
var editor_notices_exports = {};
__export(editor_notices_exports, {
  EditorNotices: () => EditorNotices,
  default: () => editor_notices_default
});
module.exports = __toCommonJS(editor_notices_exports);
var import_deprecated = __toESM(require("@wordpress/deprecated"));
var import_notices = require("@wordpress/notices");
var import_template_validation_notice = __toESM(require("../template-validation-notice/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function EditorNotices() {
  (0, import_deprecated.default)("wp.editor.EditorNotices", {
    since: "7.0",
    version: "7.2",
    alternative: "wp.notices.InlineNotices"
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_notices.InlineNotices,
    {
      pinnedNoticesClassName: "components-editor-notices__pinned",
      dismissibleNoticesClassName: "components-editor-notices__dismissible",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_template_validation_notice.default, {})
    }
  );
}
var editor_notices_default = EditorNotices;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EditorNotices
});
//# sourceMappingURL=index.cjs.map
