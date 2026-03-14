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

// packages/editor/src/components/post-visibility/index.js
var post_visibility_exports = {};
__export(post_visibility_exports, {
  default: () => PostVisibility
});
module.exports = __toCommonJS(post_visibility_exports);
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_utils = require("./utils.cjs");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function PostVisibility({ onClose }) {
  const instanceId = (0, import_compose.useInstanceId)(PostVisibility);
  const { status, visibility, password } = (0, import_data.useSelect)((select) => ({
    status: select(import_store.store).getEditedPostAttribute("status"),
    visibility: select(import_store.store).getEditedPostVisibility(),
    password: select(import_store.store).getEditedPostAttribute("password")
  }));
  const { editPost } = (0, import_data.useDispatch)(import_store.store);
  const [hasPassword, setHasPassword] = (0, import_element.useState)(!!password);
  function updateVisibility(value) {
    const nextValues = {
      public: {
        status: visibility === "private" ? "draft" : status,
        password: ""
      },
      private: { status: "private", password: "" },
      password: {
        status: visibility === "private" ? "draft" : status,
        password: password || ""
      }
    };
    editPost(nextValues[value]);
    setHasPassword(value === "password");
  }
  const updatePassword = (value) => {
    editPost({ password: value });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-post-visibility", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_editor.__experimentalInspectorPopoverHeader,
      {
        title: (0, import_i18n.__)("Visibility"),
        help: (0, import_i18n.__)("Control how this post is viewed."),
        onClose
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 4, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.RadioControl,
        {
          label: (0, import_i18n.__)("Visibility"),
          hideLabelFromVision: true,
          options: import_utils.VISIBILITY_OPTIONS,
          selected: hasPassword ? "password" : visibility,
          onChange: updateVisibility
        }
      ),
      hasPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.TextControl,
        {
          label: (0, import_i18n.__)("Password"),
          onChange: updatePassword,
          value: password,
          placeholder: (0, import_i18n.__)("Use a secure password"),
          type: "text",
          id: `editor-post-visibility__password-input-${instanceId}`,
          __next40pxDefaultSize: true,
          maxLength: 255
        }
      )
    ] })
  ] });
}
//# sourceMappingURL=index.cjs.map
