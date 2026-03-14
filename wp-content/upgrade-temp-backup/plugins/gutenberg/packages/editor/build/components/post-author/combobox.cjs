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

// packages/editor/src/components/post-author/combobox.js
var combobox_exports = {};
__export(combobox_exports, {
  default: () => PostAuthorCombobox
});
module.exports = __toCommonJS(combobox_exports);
var import_compose = require("@wordpress/compose");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_store = require("../../store/index.cjs");
var import_hook = require("./hook.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function PostAuthorCombobox() {
  const [fieldValue, setFieldValue] = (0, import_element.useState)();
  const { editPost } = (0, import_data.useDispatch)(import_store.store);
  const { authorId, authorOptions, isLoading } = (0, import_hook.useAuthorsQuery)(fieldValue);
  const handleSelect = (postAuthorId) => {
    if (!postAuthorId) {
      return;
    }
    editPost({ author: postAuthorId });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.ComboboxControl,
    {
      __next40pxDefaultSize: true,
      label: (0, import_i18n.__)("Author"),
      options: authorOptions,
      value: authorId,
      onFilterValueChange: (0, import_compose.debounce)(setFieldValue, 300),
      onChange: handleSelect,
      allowReset: false,
      hideLabelFromVision: true,
      isLoading
    }
  );
}
//# sourceMappingURL=combobox.cjs.map
