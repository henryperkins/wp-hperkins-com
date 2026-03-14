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

// packages/editor/src/components/post-last-revision/index.js
var post_last_revision_exports = {};
__export(post_last_revision_exports, {
  PrivatePostLastRevision: () => PrivatePostLastRevision,
  default: () => post_last_revision_default
});
module.exports = __toCommonJS(post_last_revision_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_icons = require("@wordpress/icons");
var import_check = __toESM(require("./check.cjs"));
var import_post_panel_row = __toESM(require("../post-panel-row/index.cjs"));
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function usePostLastRevisionInfo() {
  return (0, import_data.useSelect)((select) => {
    const { getCurrentPostLastRevisionId, getCurrentPostRevisionsCount } = select(import_store.store);
    return {
      lastRevisionId: getCurrentPostLastRevisionId(),
      revisionsCount: getCurrentPostRevisionsCount()
    };
  }, []);
}
function PostLastRevision() {
  const { lastRevisionId, revisionsCount } = usePostLastRevisionInfo();
  const { setCurrentRevisionId } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_store.store));
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_check.default, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Button,
    {
      __next40pxDefaultSize: true,
      onClick: () => setCurrentRevisionId(lastRevisionId),
      className: "editor-post-last-revision__title",
      icon: import_icons.backup,
      iconPosition: "right",
      text: (0, import_i18n.sprintf)(
        /* translators: %s: number of revisions. */
        (0, import_i18n.__)("Revisions (%s)"),
        revisionsCount
      )
    }
  ) });
}
function PrivatePostLastRevision() {
  const { lastRevisionId, revisionsCount } = usePostLastRevisionInfo();
  const { setCurrentRevisionId } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_store.store));
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_check.default, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_panel_row.default, { label: (0, import_i18n.__)("Revisions"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Button,
    {
      onClick: () => setCurrentRevisionId(lastRevisionId),
      className: "editor-private-post-last-revision__button",
      text: revisionsCount,
      variant: "tertiary",
      size: "compact"
    }
  ) }) });
}
var post_last_revision_default = PostLastRevision;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PrivatePostLastRevision
});
//# sourceMappingURL=index.cjs.map
