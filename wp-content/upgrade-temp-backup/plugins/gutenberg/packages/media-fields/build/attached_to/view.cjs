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

// packages/media-fields/src/attached_to/view.tsx
var view_exports = {};
__export(view_exports, {
  default: () => MediaAttachedToView
});
module.exports = __toCommonJS(view_exports);
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_get_rendered_content = require("../utils/get-rendered-content.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function MediaAttachedToView({
  item
}) {
  const [attachedPostTitle, setAttachedPostTitle] = (0, import_element.useState)(null);
  const parentId = item.post;
  const embeddedPostId = item._embedded?.["wp:attached-to"]?.[0]?.id;
  const embeddedPostTitle = item._embedded?.["wp:attached-to"]?.[0]?.title;
  (0, import_element.useEffect)(() => {
    if (!!parentId && parentId === embeddedPostId) {
      setAttachedPostTitle(
        (0, import_get_rendered_content.getRenderedContent)(embeddedPostTitle) || embeddedPostId?.toString() || ""
      );
    }
    if (!parentId) {
      setAttachedPostTitle((0, import_i18n.__)("(Unattached)"));
    }
  }, [parentId, embeddedPostId, embeddedPostTitle]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: attachedPostTitle });
}
//# sourceMappingURL=view.cjs.map
