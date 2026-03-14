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

// packages/media-fields/src/author/view.tsx
var view_exports = {};
__export(view_exports, {
  default: () => AuthorView
});
module.exports = __toCommonJS(view_exports);
var import_clsx = __toESM(require("clsx"));
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_icons = require("@wordpress/icons");
var import_components = require("@wordpress/components");
var import_jsx_runtime = require("react/jsx-runtime");
function AuthorView({
  item
}) {
  const author = item?._embedded?.author?.[0];
  const text = author?.name;
  const imageUrl = author?.avatar_urls?.[48];
  const [loadingState, setLoadingState] = (0, import_element.useState)("loading");
  (0, import_element.useEffect)(() => {
    setLoadingState("loading");
  }, [imageUrl]);
  const imgRef = (0, import_element.useCallback)((img) => {
    if (img?.complete) {
      setLoadingState("instant");
    }
  }, []);
  const handleLoad = () => {
    if (loadingState === "loading") {
      setLoadingState("loaded");
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { alignment: "left", spacing: 0, children: [
    !!imageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: (0, import_clsx.default)("media-author-field__avatar", {
          "is-loading": loadingState === "loading",
          "is-loaded": loadingState === "loaded"
        }),
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "img",
          {
            ref: imgRef,
            onLoad: handleLoad,
            alt: (0, import_i18n.__)("Author avatar"),
            src: imageUrl
          }
        )
      }
    ),
    !imageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "media-author-field__icon", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Icon, { icon: import_icons.commentAuthorAvatar }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "media-author-field__name", children: text })
  ] });
}
//# sourceMappingURL=view.cjs.map
