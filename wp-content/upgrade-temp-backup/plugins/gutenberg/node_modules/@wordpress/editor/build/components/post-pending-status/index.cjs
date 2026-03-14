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

// packages/editor/src/components/post-pending-status/index.js
var post_pending_status_exports = {};
__export(post_pending_status_exports, {
  PostPendingStatus: () => PostPendingStatus,
  default: () => post_pending_status_default
});
module.exports = __toCommonJS(post_pending_status_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_check = __toESM(require("./check.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function PostPendingStatus() {
  const status = (0, import_data.useSelect)(
    (select) => select(import_store.store).getEditedPostAttribute("status"),
    []
  );
  const { editPost } = (0, import_data.useDispatch)(import_store.store);
  const togglePendingStatus = () => {
    const updatedStatus = status === "pending" ? "draft" : "pending";
    editPost({ status: updatedStatus });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_check.default, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.CheckboxControl,
    {
      label: (0, import_i18n.__)("Pending review"),
      checked: status === "pending",
      onChange: togglePendingStatus
    }
  ) });
}
var post_pending_status_default = PostPendingStatus;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PostPendingStatus
});
//# sourceMappingURL=index.cjs.map
