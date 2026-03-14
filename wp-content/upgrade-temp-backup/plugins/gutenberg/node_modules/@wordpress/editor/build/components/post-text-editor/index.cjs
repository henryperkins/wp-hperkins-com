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

// packages/editor/src/components/post-text-editor/index.js
var post_text_editor_exports = {};
__export(post_text_editor_exports, {
  default: () => PostTextEditor
});
module.exports = __toCommonJS(post_text_editor_exports);
var import_react_autosize_textarea = __toESM(require("react-autosize-textarea"));
var import_i18n = require("@wordpress/i18n");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_compose = require("@wordpress/compose");
var import_components = require("@wordpress/components");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function PostTextEditor() {
  const instanceId = (0, import_compose.useInstanceId)(PostTextEditor);
  const { value, type, id } = (0, import_data.useSelect)((select) => {
    const { getCurrentPostType, getCurrentPostId, getEditedPostContent } = select(import_store.store);
    return {
      value: getEditedPostContent(),
      type: getCurrentPostType(),
      id: getCurrentPostId()
    };
  }, []);
  const { editEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.VisuallyHidden,
      {
        as: "label",
        htmlFor: `post-content-${instanceId}`,
        children: (0, import_i18n.__)("Type text or HTML")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_react_autosize_textarea.default,
      {
        autoComplete: "off",
        dir: "auto",
        value,
        onChange: (event) => {
          editEntityRecord("postType", type, id, {
            content: event.target.value,
            blocks: void 0,
            selection: void 0
          });
        },
        className: "editor-post-text-editor",
        id: `post-content-${instanceId}`,
        placeholder: (0, import_i18n.__)("Start writing with text or HTML")
      }
    )
  ] });
}
//# sourceMappingURL=index.cjs.map
