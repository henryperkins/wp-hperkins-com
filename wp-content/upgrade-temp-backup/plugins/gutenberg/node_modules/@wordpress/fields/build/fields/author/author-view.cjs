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

// packages/fields/src/fields/author/author-view.tsx
var author_view_exports = {};
__export(author_view_exports, {
  default: () => author_view_default
});
module.exports = __toCommonJS(author_view_exports);
var import_clsx = __toESM(require("clsx"));
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_icons = require("@wordpress/icons");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_jsx_runtime = require("react/jsx-runtime");
function AuthorView({ item }) {
  const authorId = item?.author;
  const embeddedAuthorId = item?._embedded?.author?.[0]?.id;
  const shouldFetch = Boolean(
    authorId && (!embeddedAuthorId || authorId !== embeddedAuthorId)
  );
  const author = (0, import_data.useSelect)(
    (select) => {
      if (!shouldFetch) {
        return null;
      }
      const { getEntityRecord } = select(import_core_data.store);
      return authorId ? getEntityRecord("root", "user", authorId) : null;
    },
    [authorId, shouldFetch]
  );
  const text = author?.name || item?._embedded?.author?.[0]?.name;
  const imageUrl = author?.avatar_urls?.[48] || item?._embedded?.author?.[0]?.avatar_urls?.[48];
  const [isImageLoaded, setIsImageLoaded] = (0, import_element.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { alignment: "left", spacing: 0, children: [
    !!imageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: (0, import_clsx.default)("fields-controls__author-avatar", {
          "is-loaded": isImageLoaded
        }),
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "img",
          {
            onLoad: () => setIsImageLoaded(true),
            alt: (0, import_i18n.__)("Author avatar"),
            src: imageUrl
          }
        )
      }
    ),
    !imageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fields-controls__author-icon", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Icon, { icon: import_icons.commentAuthorAvatar }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "fields-controls__author-name", children: text })
  ] });
}
var author_view_default = AuthorView;
//# sourceMappingURL=author-view.cjs.map
