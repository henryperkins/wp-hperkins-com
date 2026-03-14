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

// packages/editor/src/components/post-trash/index.js
var post_trash_exports = {};
__export(post_trash_exports, {
  default: () => PostTrash
});
module.exports = __toCommonJS(post_trash_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_store = require("../../store/index.cjs");
var import_check = __toESM(require("./check.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function PostTrash({ onActionPerformed }) {
  const registry = (0, import_data.useRegistry)();
  const { isNew, isDeleting, postId, title } = (0, import_data.useSelect)((select) => {
    const store = select(import_store.store);
    return {
      isNew: store.isEditedPostNew(),
      isDeleting: store.isDeletingPost(),
      postId: store.getCurrentPostId(),
      title: store.getCurrentPostAttribute("title")
    };
  }, []);
  const { trashPost } = (0, import_data.useDispatch)(import_store.store);
  const [showConfirmDialog, setShowConfirmDialog] = (0, import_element.useState)(false);
  if (isNew || !postId) {
    return null;
  }
  const handleConfirm = async () => {
    setShowConfirmDialog(false);
    await trashPost();
    const item = await registry.resolveSelect(import_store.store).getCurrentPost();
    onActionPerformed?.("move-to-trash", [item]);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_check.default, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Button,
      {
        __next40pxDefaultSize: true,
        className: "editor-post-trash",
        isDestructive: true,
        variant: "secondary",
        isBusy: isDeleting,
        "aria-disabled": isDeleting,
        onClick: isDeleting ? void 0 : () => setShowConfirmDialog(true),
        children: (0, import_i18n.__)("Move to trash")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.__experimentalConfirmDialog,
      {
        isOpen: showConfirmDialog,
        onConfirm: handleConfirm,
        onCancel: () => setShowConfirmDialog(false),
        confirmButtonText: (0, import_i18n.__)("Move to trash"),
        size: "small",
        children: (0, import_i18n.sprintf)(
          // translators: %s: The item's title.
          (0, import_i18n.__)('Are you sure you want to move "%s" to the trash?'),
          title
        )
      }
    )
  ] });
}
//# sourceMappingURL=index.cjs.map
