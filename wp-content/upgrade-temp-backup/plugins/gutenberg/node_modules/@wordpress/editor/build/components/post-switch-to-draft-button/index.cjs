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

// packages/editor/src/components/post-switch-to-draft-button/index.js
var post_switch_to_draft_button_exports = {};
__export(post_switch_to_draft_button_exports, {
  default: () => PostSwitchToDraftButton
});
module.exports = __toCommonJS(post_switch_to_draft_button_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_deprecated = __toESM(require("@wordpress/deprecated"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function PostSwitchToDraftButton() {
  (0, import_deprecated.default)("wp.editor.PostSwitchToDraftButton", {
    since: "6.7",
    version: "6.9"
  });
  const [showConfirmDialog, setShowConfirmDialog] = (0, import_element.useState)(false);
  const { editPost, savePost } = (0, import_data.useDispatch)(import_store.store);
  const { isSaving, isPublished, isScheduled } = (0, import_data.useSelect)((select) => {
    const { isSavingPost, isCurrentPostPublished, isCurrentPostScheduled } = select(import_store.store);
    return {
      isSaving: isSavingPost(),
      isPublished: isCurrentPostPublished(),
      isScheduled: isCurrentPostScheduled()
    };
  }, []);
  const isDisabled = isSaving || !isPublished && !isScheduled;
  let alertMessage;
  let confirmButtonText;
  if (isPublished) {
    alertMessage = (0, import_i18n.__)("Are you sure you want to unpublish this post?");
    confirmButtonText = (0, import_i18n.__)("Unpublish");
  } else if (isScheduled) {
    alertMessage = (0, import_i18n.__)("Are you sure you want to unschedule this post?");
    confirmButtonText = (0, import_i18n.__)("Unschedule");
  }
  const handleConfirm = () => {
    setShowConfirmDialog(false);
    editPost({ status: "draft" });
    savePost();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Button,
      {
        __next40pxDefaultSize: true,
        className: "editor-post-switch-to-draft",
        onClick: () => {
          if (!isDisabled) {
            setShowConfirmDialog(true);
          }
        },
        "aria-disabled": isDisabled,
        variant: "secondary",
        style: { flexGrow: "1", justifyContent: "center" },
        children: (0, import_i18n.__)("Switch to draft")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.__experimentalConfirmDialog,
      {
        isOpen: showConfirmDialog,
        onConfirm: handleConfirm,
        onCancel: () => setShowConfirmDialog(false),
        confirmButtonText,
        children: alertMessage
      }
    )
  ] });
}
//# sourceMappingURL=index.cjs.map
