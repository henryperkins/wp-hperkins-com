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

// packages/editor/src/components/post-author/select.js
var select_exports = {};
__export(select_exports, {
  default: () => PostAuthorSelect
});
module.exports = __toCommonJS(select_exports);
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_store = require("../../store/index.cjs");
var import_hook = require("./hook.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function PostAuthorSelect() {
  const { editPost } = (0, import_data.useDispatch)(import_store.store);
  const { authorId, authorOptions } = (0, import_hook.useAuthorsQuery)();
  const setAuthorId = (value) => {
    const author = Number(value);
    editPost({ author });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.SelectControl,
    {
      __next40pxDefaultSize: true,
      className: "post-author-selector",
      label: (0, import_i18n.__)("Author"),
      options: authorOptions,
      onChange: setAuthorId,
      value: authorId,
      hideLabelFromVision: true
    }
  );
}
//# sourceMappingURL=select.cjs.map
