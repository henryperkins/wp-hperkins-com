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

// packages/block-editor/src/components/link-picker/link-preview.js
var link_preview_exports = {};
__export(link_preview_exports, {
  LinkPreview: () => LinkPreview
});
module.exports = __toCommonJS(link_preview_exports);
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Badge } = (0, import_lock_unlock.unlock)(import_components.privateApis);
function LinkPreview({ title, url, image, badges }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "space-between", alignment: "top", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { className: "link-preview-button__content", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { alignment: "top", children: [
      image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { className: "link-preview-button__image-container", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "img",
        {
          className: "link-preview-button__image",
          src: image,
          alt: ""
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        import_components.__experimentalVStack,
        {
          className: "link-preview-button__details",
          alignment: "topLeft",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.__experimentalTruncate,
              {
                numberOfLines: 1,
                className: "link-preview-button__title",
                children: title
              }
            ),
            url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.__experimentalTruncate,
              {
                numberOfLines: 1,
                className: "link-preview-button__hint",
                children: url
              }
            ),
            badges && badges.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.__experimentalHStack,
              {
                className: "link-preview-button__badges",
                alignment: "left",
                children: badges.map((badge) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Badge,
                  {
                    intent: badge.intent,
                    children: badge.label
                  },
                  `${badge.label}|${badge.intent}`
                ))
              }
            )
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icons.Icon, { icon: import_icons.chevronDown, className: "link-preview-button__icon" })
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LinkPreview
});
//# sourceMappingURL=link-preview.cjs.map
